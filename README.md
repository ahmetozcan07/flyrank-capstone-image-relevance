# Design Document: AI Image Understanding & Content Matching Engine

## 1. The Problem & Non-Goal
**Problem:** We need a system that semantically matches the right image to the right blog post based on actual image content, not just filenames. Most importantly, it must feature a "mismatch guard" that safely rejects an image (e.g., a wolf for a fox post) when it isn't a confident match.
**Explicit Non-Goal:** This is not a massive image search engine. We will process a strictly bounded dataset of ~50 images to prove the concept reliably without focusing on infinite scaling.

## 2. Image Metadata Schema (Structured Vision Output)
Every image processed by the local Ollama vision model will be forced into this validated Zod schema:
```json
{
  "subject": "string",
  "category": "string",
  "attributes": ["string", "string"],
  "caption": "string",
  "confidence": "number (0-1)"
}
```
## 3. Matching Strategy & Guard Rules
Embeddings: Vector embeddings for both the image caption and the post text using Ollama.
Ranking: Cosine similarity to rank images against posts.
Mismatch Guard (The Safety Layer): A suggested match will be REJECTED if:
* The vision model's confidence score is below our safe threshold.
* The semantic similarity score falls below a tuned precision threshold.
* There is a hard category mismatch (e.g., expected 'fox', detected 'wolf')

## 4. Database Design (PostgreSQL)
The system will persist data using the following core models:
Images: id, filename, filepath
Tags: image_id, subject, category, attributes, caption, confidence
Embeddings: image_id, post_id, vector_data
Posts: id, title, content
Suggestions: post_id, image_id, similarity_score, status (pending/rejected)
Approvals: suggestion_id, human_decision (approved/rejected)

## 5. Dataset Plan
I will gather an initial corpus of ~50 licensed-free images from Unsplash,
divided across 5 distinct animal categories (red fox, wolf, dog, deer, bear) to test the strict boundaries of the mismatch guard