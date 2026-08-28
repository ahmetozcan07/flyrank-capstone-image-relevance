const { Ollama } = require('ollama');
const { pool, recordCall } = require('./db');

const ollama = new Ollama();
const EMBEDDING_MODEL = process.env.OLLAMA_EMBED_MODEL || 'all-minilm';

async function getEmbedding(text, subjectRef) {
  const startedAt = Date.now();
  try {
    const response = await ollama.embeddings({ model: EMBEDDING_MODEL, prompt: text });
    await recordCall({ callType: 'embedding', model: EMBEDDING_MODEL, subjectRef, ok: true, durationMs: Date.now() - startedAt });
    return response.embedding;
  } catch (error) {
    await recordCall({ callType: 'embedding', model: EMBEDDING_MODEL, subjectRef, ok: false, durationMs: Date.now() - startedAt });
    throw error;
  }
}

/** Every tagged image (both 'tagged' and 'flagged_low_confidence' — the guard decides what to do with the flag). */
async function loadImageCandidates() {
  const res = await pool.query(
    `SELECT i.id AS image_id, i.filename, t.subject, t.category, t.caption, t.confidence, t.attributes, t.status
     FROM images i JOIN tags t ON t.image_id = i.id`
  );
  return res.rows;
}

/** Cached per (image, model) — avoids re-embedding the same caption on every run. */
async function getOrCreateImageEmbedding(image) {
  const existing = await pool.query(
    `SELECT vector FROM embeddings WHERE image_id = $1 AND model = $2`,
    [image.image_id, EMBEDDING_MODEL]
  );
  if (existing.rows.length > 0) return existing.rows[0].vector;

  const vector = await getEmbedding(image.caption, image.filename);
  await pool.query(
    `INSERT INTO embeddings (image_id, model, vector) VALUES ($1, $2, $3)`,
    [image.image_id, EMBEDDING_MODEL, vector]
  );
  return vector;
}

/** Loads every candidate + its (cached) embedding in one call. */
async function loadImagesWithVectors() {
  const images = await loadImageCandidates();
  const withVectors = [];
  for (const img of images) {
    const vector = await getOrCreateImageEmbedding(img);
    withVectors.push({ ...img, vector });
  }
  return withVectors;
}

module.exports = { getEmbedding, loadImageCandidates, getOrCreateImageEmbedding, loadImagesWithVectors, EMBEDDING_MODEL };
