// Content formatting utilities for detail pages

/**
 * Split a long text block into paragraphs.
 * Handles both explicit double-newlines and long single blocks by splitting
 * on sentence boundaries when text exceeds a threshold.
 */
export function splitIntoParagraphs(text: string, minLength = 200): string[] {
  // If text already has double newlines, split on those
  if (text.includes('\n\n')) {
    return text
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean);
  }

  // If text is short enough, return as single paragraph
  if (text.length < minLength) {
    return [text.trim()];
  }

  // Split long single blocks into ~2-3 paragraphs on sentence boundaries
  const sentences = text.match(/[^.!?]+[.!?]+\s*/g) || [text];
  if (sentences.length <= 2) return [text.trim()];

  const targetSize = Math.ceil(sentences.length / Math.min(3, Math.ceil(sentences.length / 3)));
  const paragraphs: string[] = [];
  let current = '';

  for (let i = 0; i < sentences.length; i++) {
    current += sentences[i];
    if ((i + 1) % targetSize === 0 || i === sentences.length - 1) {
      paragraphs.push(current.trim());
      current = '';
    }
  }

  return paragraphs.filter(Boolean);
}

/**
 * Extract a pull quote from text -- picks the most interesting sentence.
 * Prefers sentences with evocative words. Returns null if text is too short.
 */
export function extractPullQuote(text: string): string | null {
  if (text.length < 150) return null;

  const sentences = text.match(/[^.!?]+[.!?]+/g);
  if (!sentences || sentences.length < 3) return null;

  // Score sentences for "interestingness"
  const evocativeWords = [
    'ancient', 'centuries', 'tradition', 'revered', 'prized', 'legendary',
    'sacred', 'renowned', 'celebrated', 'treasured', 'distinctive', 'unique',
    'remarkable', 'extraordinary', 'delicate', 'complex', 'rich', 'profound',
    'transforms', 'unfolds', 'emerges', 'reveals', 'embodies', 'essence',
  ];

  let bestScore = 0;
  let bestSentence = '';

  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    // Skip very short or very long sentences
    if (trimmed.length < 40 || trimmed.length > 200) continue;

    let score = 0;
    const lower = trimmed.toLowerCase();
    for (const word of evocativeWords) {
      if (lower.includes(word)) score += 1;
    }
    // Prefer sentences that aren't the first one
    if (sentence !== sentences[0]) score += 0.5;

    if (score > bestScore) {
      bestScore = score;
      bestSentence = trimmed;
    }
  }

  return bestScore > 0 ? bestSentence : null;
}
