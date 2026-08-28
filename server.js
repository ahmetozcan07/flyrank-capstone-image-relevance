const express = require('express');
const { pool } = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({ ok: true }));

// Fetch suggestions for human review — includes the guard's reasoning either way,
// so a reviewer can inspect *why* something was selected or refused.
// Filter with ?status=pending or ?status=rejected; no filter returns everything.
app.get('/api/suggestions', async (req, res) => {
  const { status } = req.query;
  try {
    const query = status
      ? `SELECT s.*, p.title AS post_title, i.filename AS image_filename
         FROM suggestions s
         JOIN posts p ON p.id = s.post_id
         JOIN images i ON i.id = s.image_id
         WHERE s.status = $1
         ORDER BY s.created_at DESC`
      : `SELECT s.*, p.title AS post_title, i.filename AS image_filename
         FROM suggestions s
         JOIN posts p ON p.id = s.post_id
         JOIN images i ON i.id = s.image_id
         ORDER BY s.created_at DESC`;
    const result = status ? await pool.query(query, [status]) : await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to approve or reject a pairing
app.post('/api/review', async (req, res) => {
  const { suggestion_id, decision } = req.body || {};

  if (!suggestion_id || !['approved', 'rejected'].includes(decision)) {
    return res.status(400).json({ error: "Body must include suggestion_id and decision ('approved' | 'rejected')." });
  }

  try {
    const suggestion = await pool.query("SELECT id FROM suggestions WHERE id = $1", [suggestion_id]);
    if (suggestion.rows.length === 0) {
      return res.status(404).json({ error: `No suggestion with id ${suggestion_id}. Check GET /api/suggestions for current ids — they change every time matching_engine.js reruns.` });
    }

    await pool.query("INSERT INTO approvals (suggestion_id, human_decision) VALUES ($1, $2)", [suggestion_id, decision]);
    await pool.query("UPDATE suggestions SET status = $1 WHERE id = $2", [decision, suggestion_id]);

    res.json({ message: `Suggestion ${suggestion_id} successfully marked as ${decision}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Probe 6: every vision/embedding call attributed with a cost entry.
app.get('/api/cost-log', async (req, res) => {
  try {
    const summary = await pool.query(
      `SELECT call_type, model, COUNT(*) AS calls, SUM(CASE WHEN ok THEN 0 ELSE 1 END) AS failures,
              ROUND(AVG(duration_ms)) AS avg_ms, SUM(cost_usd) AS total_cost_usd
       FROM cost_log GROUP BY call_type, model`
    );
    res.json(summary.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Review API running on port ${port}.`);
});
