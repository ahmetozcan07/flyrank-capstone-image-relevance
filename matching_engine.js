const fs = require('fs/promises');
const path = require('path');
const { Ollama } = require('ollama');

const ollama = new Ollama();
const EMBEDDING_MODEL = 'all-minilm';
const METADATA_FILE = path.join(__dirname, 'image_metadata.json');

// Mismatch Guard Thresholds
const MIN_SIMILARITY_THRESHOLD = 0.45; 
const MIN_CONFIDENCE_THRESHOLD = 0.70;

const mockPosts = [
  {
    id: "post_1",
    title: "The behavior of red foxes",
    content: "Red foxes are wild animals known for their orange fur and hunting skills in the forest.",
    target_category: "animal",
    target_subject: "fox"
  },
  {
    id: "post_2",
    title: "Urban Architecture",
    content: "Modern buildings and cityscapes define the new era of civil engineering.",
    target_category: "building",
    target_subject: "architecture"
  }
];

function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0, normA = 0, normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += Math.pow(vecA[i], 2);
    normB += Math.pow(vecB[i], 2);
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function getEmbedding(text) {
  const response = await ollama.embeddings({ model: EMBEDDING_MODEL, prompt: text });
  return response.embedding;
}

async function runMatchingEngine() {
  console.log('--- Starting Matching Engine ---');
  
  const rawData = await fs.readFile(METADATA_FILE, 'utf-8');
  const images = JSON.parse(rawData);

  console.log('Generating embeddings for images...');
  for (const img of images) {
    // We embed the caption to understand the image semantics[cite: 2]
    img.vector = await getEmbedding(img.metadata.caption);
  }

  for (const post of mockPosts) {
    console.log(`\nEvaluating Post: "${post.title}"`);
    const postVector = await getEmbedding(post.content);
    
    let candidates = images.map(img => {
      return {
        filename: img.filename,
        metadata: img.metadata,
        similarity: cosineSimilarity(postVector, img.vector)
      };
    });

    // Rank candidates by semantic similarity[cite: 2]
    candidates.sort((a, b) => b.similarity - a.similarity);
    const topCandidate = candidates[0];

    console.log(`Top Candidate: ${topCandidate.filename} (Similarity: ${topCandidate.similarity.toFixed(3)})`);

    // The Mismatch Guard[cite: 2]
    let rejected = false;
    let rejectReason = "";

    if (topCandidate.metadata.confidence < MIN_CONFIDENCE_THRESHOLD) {
      rejected = true;
      rejectReason = `Vision model confidence (${topCandidate.metadata.confidence}) is below threshold.`;
    } else if (topCandidate.similarity < MIN_SIMILARITY_THRESHOLD) {
      rejected = true;
      rejectReason = `Semantic similarity (${topCandidate.similarity.toFixed(3)}) is below threshold. No confident match.`;
    } else if (
      post.target_subject === "fox" && 
      topCandidate.metadata.subject.toLowerCase().includes("wolf")
    ) {
      rejected = true;
      rejectReason = `Category mismatch: expected fox, detected wolf.`;
    }

    if (rejected) {
      console.log(`Result: REJECTED`);
      console.log(`Reason: ${rejectReason}`);
    } else {
      console.log(`Result: APPROVED`);
      console.log(`Subject: ${topCandidate.metadata.subject}`);
    }
  }
}

runMatchingEngine();