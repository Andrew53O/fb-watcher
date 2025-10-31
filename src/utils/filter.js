// Filtering utility for matching posts against criteria
export const Filter = {
  // Check if current time is within sleep hours
  isInSleepHours(sleepStart, sleepEnd) {
    const now = new Date();
    const currentHour = now.getHours();
    
    if (sleepStart < sleepEnd) {
      return currentHour >= sleepStart && currentHour < sleepEnd;
    } else {
      // Handle overnight sleep hours (e.g., 22:00 - 06:00)
      return currentHour >= sleepStart || currentHour < sleepEnd;
    }
  },

  // Check if price is within range
  matchesPrice(price, minPrice, maxPrice) {
    const numPrice = typeof price === 'string' 
      ? parseFloat(price.replace(/[^0-9.]/g, '')) 
      : price;
    
    if (isNaN(numPrice)) return false;
    return numPrice >= minPrice && numPrice <= maxPrice;
  },

  // Simple keyword matching (case-insensitive)
  matchesKeywords(text, keywords) {
    if (!keywords || keywords.length === 0) return true;
    
    const lowerText = text.toLowerCase();
    return keywords.some(keyword => {
      const lowerKeyword = keyword.toLowerCase().trim();
      return lowerKeyword && lowerText.includes(lowerKeyword);
    });
  },

  // Calculate cosine similarity between two vectors
  cosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    
    const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
    return magnitude === 0 ? 0 : dotProduct / magnitude;
  },

  // Simple text to vector conversion (TF-IDF approximation)
  textToVector(text, vocabulary) {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const vector = new Array(vocabulary.length).fill(0);
    
    words.forEach(word => {
      const index = vocabulary.indexOf(word);
      if (index !== -1) {
        vector[index]++;
      }
    });
    
    // Normalize
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return magnitude > 0 ? vector.map(v => v / magnitude) : vector;
  },

  // Build vocabulary from keywords
  buildVocabulary(keywords) {
    const vocab = new Set();
    keywords.forEach(keyword => {
      const words = keyword.toLowerCase().match(/\b\w+\b/g) || [];
      words.forEach(word => vocab.add(word));
    });
    return Array.from(vocab);
  },

  // Semantic matching using cosine similarity
  matchesSemanticKeywords(text, keywords, threshold = 0.3) {
    if (!keywords || keywords.length === 0) return true;
    
    const vocabulary = this.buildVocabulary(keywords);
    if (vocabulary.length === 0) return true;
    
    const textVector = this.textToVector(text, vocabulary);
    
    return keywords.some(keyword => {
      const keywordVector = this.textToVector(keyword, vocabulary);
      const similarity = this.cosineSimilarity(textVector, keywordVector);
      return similarity >= threshold;
    });
  },

  // Main filter function
  matchesFilters(post, settings) {
    // Check price
    if (!this.matchesPrice(post.price, settings.priceMin, settings.priceMax)) {
      return false;
    }

    // Check keywords (both simple and semantic)
    const fullText = `${post.title} ${post.description || ''}`;
    const simpleMatch = this.matchesKeywords(fullText, settings.keywords);
    const semanticMatch = this.matchesSemanticKeywords(fullText, settings.keywords, 0.3);
    
    if (!simpleMatch && !semanticMatch) {
      return false;
    }

    return true;
  }
};
