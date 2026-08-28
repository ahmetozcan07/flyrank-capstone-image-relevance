const { pool } = require('./db');
const { evaluateGuard, cosineSimilarity } = require('./guard');
const { getEmbedding, loadImagesWithVectors } = require('./imageStore');
require('dotenv').config();

// Same thresholds as matching_engine.js — the guard must behave identically
// at eval time and at serve time, or the precision number means nothing.
const MIN_SIMILARITY_THRESHOLD = Number(process.env.MIN_SIMILARITY_THRESHOLD || 0.45);
const MIN_CONFIDENCE_THRESHOLD = Number(process.env.CONFIDENCE_THRESHOLD || 0.70);

// The labeled evaluation set (10 posts) testing semantic equivalents —
// each one names the exact image file that should be the top-1 match.
const evalPosts = [
  { id: "eval_1", content: "The hunting patterns of Vulpes vulpes in dense forests.", target_category: "animal", target_subject: "fox", target_image: "federico-di-dio-photography-Wstln0400pE-unsplash.jpg" },
  { id: "eval_2", content: "Canis lupus packs organizing a nighttime hunt.", target_category: "animal", target_subject: "wolf", target_image: "philipp-pilz-QZ2EQuPpQJs-unsplash.jpg" },
  { id: "eval_3", content: "Ursus arctos catching salmon in the river.", target_category: "animal", target_subject: "bear", target_image: "becca-_r6w0R6SueQ-unsplash.jpg" },
  { id: "eval_4", content: "Training domesticated canines for search and rescue.", target_category: "animal", target_subject: "dog", target_image: "pauline-loroy-U3aF7hgUSrk-unsplash.jpg" },
  { id: "eval_5", content: "Wild cervidae grazing in the morning mist.", target_category: "animal", target_subject: "deer", target_image: "y-s-aJuv14zf-ZY-unsplash.jpg" },
  { id: "eval_6", content: "Red foxes raising their pups.", target_category: "animal", target_subject: "fox", target_image: "jeremy-hynes-mwIqqM1otnk-unsplash.jpg" },
  { id: "eval_7", content: "The hierarchy of gray wolves.", target_category: "animal", target_subject: "wolf", target_image: "reyk-odinson-mk2chAKaZR4-unsplash.jpg" },
  { id: "eval_8", content: "Grizzly bears preparing for winter hibernation.", target_category: "animal", target_subject: "bear", target_image: "mark-basarab-y421kXlUOQk-unsplash.jpg" },
  { id: "eval_9", content: "A golden retriever playing fetch in the park.", target_category: "animal", target_subject: "dog", target_image: "oscar-sutton-yihlaRCCvd4-unsplash.jpg" },
  { id: "eval_10", content: "A large buck with full antlers in the woods.", target_category: "animal", target_subject: "deer", target_image: "yuya-yoshioka-0U1TsyC7RZE-unsplash.jpg" }
];

async function runEvaluation() {
  console.log('--- Starting Precision Evaluation ---');

  const images = await loadImagesWithVectors();
  if (images.length === 0) {
    console.log('No tagged images found. Run process_images.js first.');
    await pool.end();
    return;
  }

  let correctTop1 = 0;
  const totalEvaluated = evalPosts.length;

  for (const post of evalPosts) {
    const postVector = await getEmbedding(post.content, `eval:${post.id}`);

    const candidates = images.map(img => ({
      ...img,
      similarity: cosineSimilarity(postVector, img.vector)
    }));
    candidates.sort((a, b) => b.similarity - a.similarity);
    const topCandidate = candidates[0];

    const guardResult = evaluateGuard(
      topCandidate,
      topCandidate.similarity,
      post,
      { minConfidence: MIN_CONFIDENCE_THRESHOLD, minSimilarity: MIN_SIMILARITY_THRESHOLD }
    );

    const isCorrect = !guardResult.rejected && topCandidate.filename === post.target_image;
    if (isCorrect) correctTop1++;

    if (isCorrect) {
      console.log(`[PASS] "${post.content.substring(0, 40)}..." -> ${topCandidate.filename}`);
    } else if (guardResult.rejected) {
      console.log(`[FAIL] "${post.content.substring(0, 40)}..." -> REJECTED (${guardResult.reason}) | Target was: ${post.target_image}`);
    } else {
      console.log(`[FAIL] "${post.content.substring(0, 40)}..." -> ${topCandidate.filename} | Target was: ${post.target_image}`);
    }
  }

  const precision = (correctTop1 / totalEvaluated) * 100;
  console.log('\n--- Evaluation Results ---');
  console.log(`Successfully matched ${correctTop1} out of ${totalEvaluated} posts.`);
  console.log(`Top-1 Precision: ${precision.toFixed(1)}%`);

  await pool.end();
}

runEvaluation();
