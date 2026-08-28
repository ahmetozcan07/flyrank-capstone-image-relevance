# AI Image Understanding & Content Matching Engine

An automated pipeline that extracts structured metadata from raw images using local vision models, generates semantic vector embeddings, and pairs images with relevant blog posts using a guard-protected cosine similarity matching engine.

## 1. System Architecture & Workflow

```text
===========================================================================================
                                SYSTEM ARCHITECTURE
===========================================================================================

 [ Image Dataset (~53 Images) ]
               │
               ▼
   [ Vision Model (LLaVA) ] ──────────► [ Schema Validation (Zod) ]
                                                       │
                                                       ▼
 [ Blog Posts ]                                [ PostgreSQL DB ]
       │                                     (Images, Tags, Costs)
       ▼                                               │
 [ Ollama Embeddings ]                                 │
   (all-minilm)                                        ▼
       │                                      [ Ollama Embeddings ]
       │                                         (all-minilm)
       │                                               │
       └───────────────────────┬───────────────────────┘
                               │
                               ▼
                   [ Cosine Similarity Matcher ]
                               │
                               ▼
                   [ Mismatch Guard Layer ]
                     - Confidence Threshold (>= 0.70)
                     - Similarity Threshold (>= 0.45)
                     - Category Mismatch Check
                               │
                ┌──────────────┴──────────────┐
                ▼                             ▼
       [ Match Approved ]             [ Match Rejected ]
                │                             │
                └──────────────┬──────────────┘
                               │
                               ▼
                   [ Express.js Review API ]
                    (GET/POST /api/suggestions,
                     /api/review, /api/cost-log)
                               │
                               ▼
                    [ Human Reviewer / Admin ]
===========================================================================================
```

## Architecture Explanation
Images are processed in background batches with retry logic via the llava local vision model. Responses are validated against a strict JSON schema via Zod to ensure typed attributes (subject, category, confidence, tags). Image records, structured tags, operational metrics (token calls/costs), and blog posts are persisted in PostgreSQL. Image descriptions and post contents are converted into vector representations using the all-minilm embedding model. Matches are ranked via cosine similarity calculations. To prevent erroneous pairings, candidates must pass a safety evaluation (similarity threshold $\ge 0.45$, confidence $\ge 0.70$, and category alignment). Failed pairings are safely rejected with explicit, human-readable reasons. Match recommendations are exposed via an Express REST API where admins can inspect rationale, approve, or reject suggestions. 

## Evaluation Metric
Evaluation Metric: Top-1 Precision against labeled dataset
Top-1 Precision Score: 10.0%
Note on Precision: Local embedding (all-minilm) cosine similarity outputs paired with strict mismatch thresholds conservatively reject edge cases to prevent false positives.

## Prerequisites
Ensure you have the following installed on your host machine:

Node.js (v18 or higher)

Docker & Docker Desktop (for PostgreSQL)

Ollama (for running local AI models)

## Setup & Installation Guide
Step 1: Clone the Repository
```bash
git clone <repository_url>
cd <repository_folder>
```
Step 2: Install Node.js Dependencies
```bash
npm install
```
Step 3: Setup Environment Variables
Copy the sample environment file to create your active .env:
```bash
cp .env.example .env
```
(Ensure values match your local PostgreSQL credentials configured in docker-compose.yml)

Step 4: Pull Required Ollama Models
Open a terminal and download the required vision and embedding models:
```bash
ollama pull llava
ollama pull all-minilm
```
(Make sure the Ollama application service is running in the background)

Step 5: Start the Database Container
Launch the PostgreSQL database container:
```bash
docker compose up -d
```
Step 6: Initialize Database Schema
Run the migration script to create all required tables and relationships:
```bash
node init_db.js
```
## Execution & Workflow
1. Ingest & Process Images (Batch Job)
Extract metadata and tags from local images:
```bash
npm run batch
```
2. Run the Matching Engine
Compute vector embeddings and match posts against images through the Mismatch Guard:
```bash
npm run match
```
3. Run the Precision Evaluation Set
Execute the labeled benchmark dataset to compute Top-1 precision:
```bash
npm run eval
```
4. Start the Review API
Start the Express server for human review endpoints:
```bash
node server.js
```
6. API Reference
Get Suggestions
```bash
curl http://localhost:3000/api/suggestions
```
Review a Suggestion (Approve / Reject)
```bash
curl -X POST http://localhost:3000/api/review \
  -H "Content-Type: application/json" \
  -d '{"suggestion_id": 1, "decision": "approved"}'
```
Inspect Cost & Performance Logs
```bash
curl http://localhost:3000/api/cost-log
```




