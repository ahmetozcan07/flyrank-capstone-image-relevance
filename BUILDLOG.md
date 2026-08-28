# Build Log — AI usage

Where AI helped, where it was wrong, what I changed — kept honest per the brief's rule.

## Phase 1 — Design
- Wrote the design doc (README.md) covering the problem/non-goal, metadata schema,
  matching strategy, DB design, and dataset plan.
- I used gemini to write design doc.

## Phase 2 — Vision pipeline
- Built `process_images.js`: Ollama (llava) + Zod schema validation + retry loop.
- Ran the batch job against the 53-image corpus — output pasted in EVIDENCE.md.
- I did not notice any images that model got wrong.

## Phase 3 — Matching engine
- Built `matching_engine.js` and `eval.js`: Ollama embeddings + cosine similarity ranking
  + a mismatch guard (confidence / similarity / category / subject checks).
- Result: fox post ranks the fox image first; the architecture post gets rejected on
  low similarity.

## Session — DB wiring + guard generalization (with Claude, chat)
- Problem found: `init_db.js` created the Postgres schema but `process_images.js` /
  `matching_engine.js` / `eval.js` were still reading and writing `image_metadata.json`
  directly — the DB was never actually used, so `server.js`'s review endpoints would
  always return empty. Fixed by rewriting all three scripts to read/write Postgres
  through a shared `db.js` pool.
- Problem found: the mismatch guard only checked for one hardcoded case
  (`subject.includes("wolf")` when the post wanted "fox"). Generalized it in `guard.js`
  into two checks any post can use: `target_category` vs the image's `category`, and
  `target_subject` vs the image's `subject` — no species names hardcoded anywhere.
- Problem found: low-confidence images weren't flagged until the matching stage —
  `process_images.js` now stores them as `flagged_low_confidence` in `tags.status`
  right at ingestion, per Probe 1.
- Added `cost_log` table + `recordCall()` in `db.js`, called from every vision and
  embedding call in `process_images.js` / `imageStore.js` — backs the new
  `GET /api/cost-log` endpoint (Probe 6).
- Extracted `imageStore.js` so `matching_engine.js` and `eval.js` share the exact
  same embedding-loading and caching logic instead of two copies drifting apart.
- Filled in `.env.example`, `capstone.yaml`, and this file — none of these had been
  committed before.
- Everything above was written and `node --check`'d for syntax by Claude, but **not
  run end-to-end** (no live Postgres/Ollama in that environment) — I ran it myself
  locally and confirmed/adjusted: TODO (fill in what you actually saw when you ran it).
