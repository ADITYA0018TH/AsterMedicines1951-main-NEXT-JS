// Fuzzy matching utility using Levenshtein distance
export function levenshteinDistance(str1: string, str2: string): number {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  if (s1 === s2) return 0;
  if (s1.length === 0) return s2.length;
  if (s2.length === 0) return s1.length;

  const matrix: number[][] = [];

  // Initialize first column
  for (let i = 0; i <= s1.length; i++) {
    matrix[i] = [i];
  }

  // Initialize first row
  for (let j = 0; j <= s2.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the matrix
  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[s1.length][s2.length];
}

// Calculate similarity score (0 to 1)
export function similarityScore(str1: string, str2: string): number {
  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 1;
  
  const distance = levenshteinDistance(str1, str2);
  return 1 - distance / maxLen;
}

// Find words that match anywhere in the target
export function containsMatch(query: string, target: string): boolean {
  const q = query.toLowerCase().replace(/[^a-z0-9]/g, '');
  const t = target.toLowerCase().replace(/[^a-z0-9]/g, '');
  return t.includes(q) || q.includes(t);
}

interface ProductMatch {
  id: string;
  name: string;
  slug: string;
  category: string;
  score: number;
}

export interface FuzzyMatchResult {
  exactMatch: ProductMatch | null;
  suggestions: ProductMatch[];
}

export function findSimilarProducts(
  slug: string,
  products: Array<{ id: string | number; name: string; slug?: string; category: string }>,
  maxSuggestions: number = 4
): FuzzyMatchResult {
  const normalizedSlug = slug.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  const matches: ProductMatch[] = products.map(product => {
    const productSlug = (product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).toLowerCase();
    const normalizedProductSlug = productSlug.replace(/[^a-z0-9]/g, '');
    const normalizedName = product.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Calculate multiple similarity scores
    const slugSimilarity = similarityScore(normalizedSlug, normalizedProductSlug);
    const nameSimilarity = similarityScore(normalizedSlug, normalizedName);
    const containsBonus = containsMatch(normalizedSlug, normalizedProductSlug) || 
                          containsMatch(normalizedSlug, normalizedName) ? 0.3 : 0;
    
    // Use the best score
    const bestScore = Math.max(slugSimilarity, nameSimilarity) + containsBonus;
    
    return {
      id: String(product.id),
      name: product.name,
      slug: productSlug,
      category: product.category,
      score: Math.min(bestScore, 1), // Cap at 1
    };
  });

  // Sort by score descending
  matches.sort((a, b) => b.score - a.score);

  // Check for exact match
  const exactMatch = matches.find(m => m.score >= 0.95) || null;

  // Get top suggestions (excluding exact match if found)
  const suggestions = matches
    .filter(m => m.score >= 0.3 && m !== exactMatch)
    .slice(0, maxSuggestions);

  return { exactMatch, suggestions };
}
