const { pool } = require('./db');
const { evaluateGuard, cosineSimilarity } = require('./guard');
const { getEmbedding, loadImagesWithVectors } = require('./imageStore');
require('dotenv').config();

// Mismatch Guard Thresholds
const MIN_SIMILARITY_THRESHOLD = Number(process.env.MIN_SIMILARITY_THRESHOLD || 0.45);
const MIN_CONFIDENCE_THRESHOLD = Number(process.env.CONFIDENCE_THRESHOLD || 0.70);

// Demo/dev posts. In a real system these come from the blog's own DB;
// target_category / target_subject exist here purely so the guard has
// something concrete to check against for this bounded demo corpus.
const mockPosts = [
  {
    title: "The behavior of red foxes",
    content: "Red foxes are wild animals known for their orange fur and hunting skills in the forest.",
    target_category: "animal",
    target_subject: "fox"
  },
  {
    title: "Urban Architecture",
    content: "Modern buildings and cityscapes define the new era of civil engineering.",
    target_category: "building",
    target_subject: null
  }
];

async function seedPosts(posts) {
  for (const post of posts) {
    await pool.query(
      `INSERT INTO posts (title, content, target_category, target_subject)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (title) DO UPDATE SET
         content = EXCLUDED.content,
         target_category = EXCLUDED.target_category,
         target_subject = EXCLUDED.target_subject`,
      [post.title, post.content, post.target_category, post.target_subject]
    );
  }
}

async function persistSuggestion(postId, topCandidate, similarity, guardResult) {
  // One "current" suggestion per post — reruns replace it rather than piling up.
  await pool.query(`DELETE FROM suggestions WHERE post_id = $1`, [postId]);
  await pool.query(
    `INSERT INTO suggestions (post_id, image_id, similarity_score, status, reject_reason)
     VALUES ($1, $2, $3, $4, $5)`,
    [
      postId,
      topCandidate.image_id,
      similarity,
      guardResult.rejected ? 'rejected' : 'pending',
      guardResult.reason
    ]
  );
}

async function runMatchingEngine() {
  console.log('--- Starting Matching Engine ---');

  await seedPosts(mockPosts);
  const posts = (await pool.query(`SELECT * FROM posts WHERE title = ANY($1::text[])`, [mockPosts.map(p => p.title)])).rows;

  console.log('Loading images and embeddings...');
  const images = await loadImagesWithVectors();
  if (images.length === 0) {
    console.log('No tagged images found. Run process_images.js first.');
    await pool.end();
    return;
  }

  for (const post of posts) {
    console.log(`\nEvaluating Post: "${post.title}"`);
    const postVector = await getEmbedding(post.content, `post:${post.title}`);

    const candidates = images.map(img => ({
      ...img,
      similarity: cosineSimilarity(postVector, img.vector)
    }));
    candidates.sort((a, b) => b.similarity - a.similarity);
    const topCandidate = candidates[0];

    console.log(`Top Candidate: ${topCandidate.filename} (Similarity: ${topCandidate.similarity.toFixed(3)})`);

    const guardResult = evaluateGuard(
      topCandidate,
      topCandidate.similarity,
      post,
      { minConfidence: MIN_CONFIDENCE_THRESHOLD, minSimilarity: MIN_SIMILARITY_THRESHOLD }
    );

    await persistSuggestion(post.id, topCandidate, topCandidate.similarity, guardResult);

    if (guardResult.rejected) {
      console.log(`Result: REJECTED`);
      console.log(`Reason: ${guardResult.reason}`);
    } else {
      console.log(`Result: APPROVED`);
      console.log(`Subject: ${topCandidate.subject}`);
    }
  }

  await pool.end();
}

runMatchingEngine();
