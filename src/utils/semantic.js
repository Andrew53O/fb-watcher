// Semantic matching using TensorFlow.js
// TensorFlow.js is available for future semantic matching enhancements

let model = null;
let isModelLoaded = false;

// Load Universal Sentence Encoder for semantic matching
export async function loadModel() {
  if (isModelLoaded) {
    return model;
  }
  
  try {
    // Using a simpler approach without full USE model to keep extension lightweight
    // In production, you could load a lightweight embedding model
    isModelLoaded = true;
    console.log('Semantic matching ready');
    return null;
  } catch (error) {
    console.error('Error loading model:', error);
    return null;
  }
}

// Calculate semantic similarity between two texts
export async function calculateSimilarity(text1, text2) {
  // Simple keyword-based similarity for now
  // In production, this would use embeddings from TensorFlow.js model
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

// Check if text matches any keywords semantically
export async function matchesKeywords(text, keywords, threshold = 0.3) {
  if (!text || !keywords || keywords.length === 0) {
    return false;
  }
  
  const textLower = text.toLowerCase();
  
  // First, try exact keyword matching
  for (const keyword of keywords) {
    if (textLower.includes(keyword.toLowerCase())) {
      return true;
    }
  }
  
  // Then try semantic matching
  for (const keyword of keywords) {
    const similarity = await calculateSimilarity(text, keyword);
    if (similarity >= threshold) {
      return true;
    }
  }
  
  return false;
}

// Extract keywords from text
export function extractKeywords(text) {
  // Simple keyword extraction
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3);
  
  return [...new Set(words)];
}
