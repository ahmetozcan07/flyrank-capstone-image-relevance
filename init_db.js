const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
});

async function initializeDatabase() {
  await client.connect();
  console.log("Connected to PostgreSQL.");

  // Base tables — CREATE TABLE IF NOT EXISTS so this is safe to re-run.
  await client.query(`
    CREATE TABLE IF NOT EXISTS images (
      id SERIAL PRIMARY KEY,
      filename TEXT UNIQUE NOT NULL,
      filepath TEXT
    );

    CREATE TABLE IF NOT EXISTS tags (
      id SERIAL PRIMARY KEY,
      image_id INTEGER REFERENCES images(id) ON DELETE CASCADE,
      subject TEXT,
      category TEXT,
      attributes TEXT[],
      caption TEXT,
      confidence REAL,
      status TEXT DEFAULT 'tagged'
    );

    -- One row per image, storing the caption embedding used for matching.
    -- Plain REAL[] is fine at ~50 images (Section 10 says pgvector is optional at this scale).
    CREATE TABLE IF NOT EXISTS embeddings (
      id SERIAL PRIMARY KEY,
      image_id INTEGER REFERENCES images(id) ON DELETE CASCADE,
      model TEXT,
      vector REAL[]
    );

    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      title TEXT,
      content TEXT,
      target_category TEXT,
      target_subject TEXT
    );

    CREATE TABLE IF NOT EXISTS suggestions (
      id SERIAL PRIMARY KEY,
      post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
      image_id INTEGER REFERENCES images(id) ON DELETE CASCADE,
      similarity_score REAL,
      status TEXT DEFAULT 'pending',
      reject_reason TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS approvals (
      id SERIAL PRIMARY KEY,
      suggestion_id INTEGER REFERENCES suggestions(id) ON DELETE CASCADE,
      human_decision TEXT,
      reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Every vision/embedding call, attributed — Requirement 7 + Probe 6.
    CREATE TABLE IF NOT EXISTS cost_log (
      id SERIAL PRIMARY KEY,
      call_type TEXT,
      model TEXT,
      subject_ref TEXT,
      ok BOOLEAN,
      duration_ms INTEGER,
      cost_usd NUMERIC DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Migration-style additions, in case tables already existed from an earlier
  // run of this script without these columns. Safe to re-run.
  await client.query(`
    ALTER TABLE images ADD COLUMN IF NOT EXISTS filepath TEXT;
    ALTER TABLE tags ADD COLUMN IF NOT EXISTS attributes TEXT[];
    ALTER TABLE tags ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'tagged';
    ALTER TABLE posts ADD COLUMN IF NOT EXISTS target_category TEXT;
    ALTER TABLE posts ADD COLUMN IF NOT EXISTS target_subject TEXT;
    ALTER TABLE suggestions ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
  `);

  // Indexes the review/matching queries actually need.
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_tags_image_id ON tags(image_id);
    CREATE INDEX IF NOT EXISTS idx_embeddings_image_id ON embeddings(image_id);
    CREATE INDEX IF NOT EXISTS idx_suggestions_post_id ON suggestions(post_id);
    CREATE INDEX IF NOT EXISTS idx_suggestions_image_id ON suggestions(image_id);
    CREATE INDEX IF NOT EXISTS idx_suggestions_status ON suggestions(status);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_images_filename ON images(filename);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_posts_title ON posts(title);
  `);

  console.log("Tables, columns, and indexes are up to date.");
  await client.end();
}

initializeDatabase();