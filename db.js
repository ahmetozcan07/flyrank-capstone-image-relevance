const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
});

/**
 * Records one AI call (vision or embedding) into cost_log.
 * Local Ollama calls are $0, but every call is still attributed —
 * this is what Probe 6 in the brief actually checks for.
 */
async function recordCall({ callType, model, subjectRef, ok, durationMs, costUsd = 0 }) {
  await pool.query(
    `INSERT INTO cost_log (call_type, model, subject_ref, ok, duration_ms, cost_usd)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [callType, model, subjectRef, ok, durationMs, costUsd]
  );
}

module.exports = { pool, recordCall };
