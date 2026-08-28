const fs = require('fs/promises');
const path = require('path');
const { Ollama } = require('ollama');
const { z } = require('zod');

const ollama = new Ollama();

// Vision processing job with structured output validation[cite: 2]
const metadataSchema = z.object({
  subject: z.string(),
  category: z.string(),
  attributes: z.array(z.string()),
  caption: z.string(),
  confidence: z.number().min(0).max(1)
});

const IMAGES_DIR = path.join(__dirname, 'images');
const OUTPUT_FILE = path.join(__dirname, 'image_metadata.json');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Batch processing with retries and per-call cost tracking[cite: 2]
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
        model: 'llava',
        prompt: 'Analyze this image and output strictly valid JSON. Schema: {"subject": "string", "category": "string", "attributes": ["string", "string"], "caption": "string", "confidence": number from 0.0 to 1.0}. No markdown, no extra text.',
        images: [base64Image],
        format: 'json'
      });

      const parsedJson = JSON.parse(response.response);
      const validatedData = metadataSchema.parse(parsedJson);
      
      const duration = Date.now() - startTime;
      // Logging cost tracking per call (Local model cost is $0)[cite: 2]
      console.log(`[Success] ${filename} processed in ${duration}ms. Cost: $0.00 (Local)`);
      
      return { 
        filename, 
        metadata: validatedData, 
        processing_time_ms: duration,
        cost: 0 
      };

    } catch (error) {
      console.error(`[Error] Attempt ${attempt} failed for ${filename}: ${error.message}`);
      if (attempt >= maxRetries) {
        console.error(`[Failed] Giving up on ${filename} after ${maxRetries} retries.`);
        return null;
      }
      await delay(2000); // Backoff before retry
    }
  }
}

async function runBatchJob() {
  console.log('--- Starting Vision Processing Batch Job ---');
  let results = [];
  let totalCost = 0;

  try {
    const files = await fs.readdir(IMAGES_DIR);
    const imageFiles = files.filter(f => f.match(/\.(jpg|jpeg|png|webp)$/i));

    for (const filename of imageFiles) {
      const imagePath = path.join(IMAGES_DIR, filename);
      const result = await analyzeImageWithRetry(imagePath, filename);
      
      if (result) {
        results.push(result);
        totalCost += result.cost;
      }
    }

    await fs.writeFile(OUTPUT_FILE, JSON.stringify(results, null, 2), 'utf-8');
    console.log(`\n--- Batch Job Complete ---`);
    console.log(`Processed: ${results.length}/${imageFiles.length} images.`);
    console.log(`Total API Cost: $${totalCost.toFixed(4)}`);
    console.log(`Results saved to ${OUTPUT_FILE}`);

  } catch (error) {
    console.error('Batch job failed:', error);
  }
}

runBatchJob();