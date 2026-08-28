/**
 * The vision model's `category` field is free text — it isn't drawn from a
 * controlled vocabulary, so the same real-world category comes back as
 * "animal", "animals", "wildlife", or "Pets" depending on the image and the
 * model's mood. A strict string-equality guard treats every one of those as
 * a mismatch, which rejects perfectly good matches. This maps known
 * synonyms to one canonical label before comparing; anything not in the map
 * just falls back to lowercased-as-is (still better than nothing).
 */
const CATEGORY_SYNONYMS = {
  animal: ['animal', 'animals', 'wildlife', 'wild animal', 'pet', 'pets', 'mammal', 'mammals'],
  building: ['building', 'buildings', 'architecture', 'urban', 'structure', 'cityscape'],
};

function normalizeCategory(raw) {
  if (!raw) return raw;
  const lower = raw.toLowerCase().trim();
  for (const [canonical, synonyms] of Object.entries(CATEGORY_SYNONYMS)) {
    if (synonyms.includes(lower)) return canonical;
  }
  return lower;
}

/**
 * The mismatch guard. Generalized on purpose — no hardcoded species names.
 * A post can declare an expected target_category (e.g. "animal", "building")
 * and/or a target_subject (e.g. "fox", "architecture"). Either, both, or
 * neither can be set; only the checks with data actually run.
 *
 * @param {{ subject: string, category: string, confidence: number }} candidateMetadata
 * @param {number} similarity cosine similarity between post and candidate caption
 * @param {{ target_category?: string, target_subject?: string }} post
 * @param {{ minConfidence: number, minSimilarity: number }} thresholds
 * @returns {{ rejected: boolean, reason: string | null }}
 */
function evaluateGuard(candidateMetadata, similarity, post, thresholds) {
  const { subject, category, confidence } = candidateMetadata;
  const { minConfidence, minSimilarity } = thresholds;

  if (confidence < minConfidence) {
    return { rejected: true, reason: `Vision model confidence (${confidence}) is below threshold (${minConfidence}).` };
  }

  if (similarity < minSimilarity) {
    return { rejected: true, reason: `Semantic similarity (${similarity.toFixed(3)}) is below threshold (${minSimilarity}). No confident match.` };
  }

  if (post.target_category && normalizeCategory(category) !== normalizeCategory(post.target_category)) {
    return { rejected: true, reason: `Category mismatch: expected '${post.target_category}', detected '${category}'.` };
  }

  if (post.target_subject && !subject?.toLowerCase().includes(post.target_subject.toLowerCase())) {
    return { rejected: true, reason: `Subject mismatch: expected '${post.target_subject}', detected '${subject}'.` };
  }

  return { rejected: false, reason: null };
}

function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0, normA = 0, normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

module.exports = { evaluateGuard, cosineSimilarity };
