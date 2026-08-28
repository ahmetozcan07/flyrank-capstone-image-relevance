const fs = require('fs/promises');
const path = require('path');
const { Ollama } = require('ollama');
const { z } = require('zod');
const { pool, recordCall } = require('./db');
require('dotenv').config();

const ollama = new Ollama();
const VISION_MODEL = process.env.OLLAMA_VISION_MODEL || 'llava';
// Same threshold used here (ingestion flagging) and in the matching engine
// (guard rejection) — a flagged image is not a "maybe", it's already suspect.
const CONFIDENCE_THRESHOLD = Number(process.env.CONFIDENCE_THRESHOLD || 0.70);

// Vision processing job with structured output validation
const metadataSchema = z.object({
  subject: z.string(),
  category: z.string(),
  attributes: z.array(z.string()),
  caption: z.string(),
  confidence: z.number().min(0).max(1)
});

const IMAGES_DIR = path.join(__dirname, 'images');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Batch processing with retries and per-call cost tracking
async function analyzeImageWithRetry(imagePath, filename, maxRetries = 2) {
  const imageBuffer = await fs.readFile(imagePath);
  const base64Image = imageBuffer.toString('base64');
  let attempt = 0;

  while (attempt <= maxRetries) {
    attempt++;
    const startTime = Date.now();
    try {
      console.log(`[Batch Job] Analyzing ${filename} (Attempt ${attempt})...`);

      const response = await ollama.generate({
        model: VISION_MODEL,
        prompt: 'Analyze this image and output strictly valid JSON. Schema: {"subject": "string", "category": "string", "attributes": ["string", "string"], "caption": "string", "confidence": number from 0.0 to 1.0}. No markdown, no extra text.',
        images: [base64Image],
        format: 'json'
      });

      // Never trust the raw response — parse, then validate against the schema.
      const parsedJson = JSON.parse(response.response);
      const validatedData = metadataSchema.parse(parsedJson);

      const duration = Date.now() - startTime;
      console.log(`[Success] ${filename} processed in ${duration}ms. Cost: $0.00 (Local)`);
      await recordCall({ callType: 'vision', model: VISION_MODEL, subjectRef: filename, ok: true, durationMs: duration });

      return {
        filename,
        metadata: validatedData,
        processing_time_ms: duration,
        cost: 0
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[Error] Attempt ${attempt} failed for ${filename}: ${error.message}`);
      await recordCall({ callType: 'vision', model: VISION_MODEL, subjectRef: filename, ok: false, durationMs: duration });

      if (attempt >= maxRetries) {
        console.error(`[Failed] Giving up on ${filename} after ${maxRetries} retries.`);
        return null;
      }
      await delay(2000); // Backoff before retry
    }
  }
}

/**
 * Upserts the image + its tags into Postgres. A confidence below
 * CONFIDENCE_THRESHOLD is stored as 'flagged_low_confidence' right here,
 * at ingestion — not guessed at and not silently accepted.
 */
async function persistResult(result) {
  const { filename, metadata } = result;

  const imageRes = await pool.query(
    `INSERT INTO images (filename, filepath) VALUES ($1, $2)
     ON CONFLICT (filename) DO UPDATE SET filepath = EXCLUDED.filepath
     RETURNING id`,
    [filename, path.join('images', filename)]
  );
  const imageId = imageRes.rows[0].id;

  const status = metadata.confidence < CONFIDENCE_THRESHOLD ? 'flagged_low_confidence' : 'tagged';

  // One image can be re-processed on a re-run; keep the latest tag row.
  await pool.query(`DELETE FROM tags WHERE image_id = $1`, [imageId]);
  await pool.query(
    `INSERT INTO tags (image_id, subject, category, attributes, caption, confidence, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [imageId, metadata.subject, metadata.category, metadata.attributes, metadata.caption, metadata.confidence, status]
  );

  return { imageId, status };
}

async function runBatchJob() {
  console.log('--- Starting Vision Processing Batch Job ---');
  let processed = 0;
  let flagged = 0;
  let failed = 0;

  try {
    const files = await fs.readdir(IMAGES_DIR);
    const imageFiles = files.filter(f => f.match(/\.(jpg|jpeg|png|webp)$/i));

    for (const filename of imageFiles) {
      const imagePath = path.join(IMAGES_DIR, filename);
      const result = await analyzeImageWithRetry(imagePath, filename);

      if (!result) {
        failed++;
        continue;
      }

      const { status } = await persistResult(result);
      processed++;
      if (status === 'flagged_low_confidence') {
        flagged++;
        console.log(`[Flagged] ${filename} — confidence ${result.metadata.confidence} < ${CONFIDENCE_THRESHOLD}, stored as flagged_low_confidence.`);
      }
    }

    console.log(`\n--- Batch Job Complete ---`);
    console.log(`Processed: ${processed}/${imageFiles.length} images (${flagged} flagged low-confidence, ${failed} failed after retries).`);

  } catch (error) {
    console.error('Batch job failed:', error);
  } finally {
    await pool.end();
  }
}

runBatchJob();
