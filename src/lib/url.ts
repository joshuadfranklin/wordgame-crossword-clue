import type { AppState, Color, Guess } from './types';

/**
 * Clamp a number to a range
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Encode a color to single character
 */
function encodeColor(color: Color): string {
  switch (color) {
    case 'green':
      return 'G';
    case 'yellow':
      return 'Y';
    case 'gray':
      return 'X';
  }
}

/**
 * Decode a single character to color
 */
function decodeColor(char: string): Color | null {
  switch (char) {
    case 'G':
      return 'green';
    case 'Y':
      return 'yellow';
    case 'X':
      return 'gray';
    default:
      return null;
  }
}

/**
 * Encode a guess to string format: WORD-COLORS
 */
function encodeGuess(guess: Guess): string {
  const colors = guess.colors.map(encodeColor).join('');
  return `${guess.word}-${colors}`;
}

/**
 * Decode a guess string to Guess object
 */
function decodeGuess(guessStr: string): Guess | null {
  const parts = guessStr.split('-');
  if (parts.length !== 2) {
    return null;
  }

  const [word, colorsStr] = parts;

  // Validate word is all uppercase letters and matches colors length
  if (!/^[A-Z]+$/.test(word) || word.length !== colorsStr.length) {
    return null;
  }

  // Decode colors
  const colors: Color[] = [];
  for (const char of colorsStr) {
    const color = decodeColor(char);
    if (color === null) {
      return null;
    }
    colors.push(color);
  }

  return { word, colors };
}

/**
 * Encode app state to query string
 */
export function encodeState(state: AppState): string {
  const parts: string[] = [];

  // Encode guesses
  if (state.guesses.length > 0) {
    const guessesStr = state.guesses.map(encodeGuess).join(',');
    parts.push(`g=${guessesStr}`);
  }

  // Encode settings
  parts.push(`words=${state.settings.wordsCount}`);
  parts.push(`hints=${state.settings.hintsCount}`);

  return parts.join('&');
}

/**
 * Decode query string to app state
 */
export function decodeState(query: string): AppState {
  const params = new URLSearchParams(query);

  // Decode guesses
  const guesses: Guess[] = [];
  const guessesParam = params.get('g');
  if (guessesParam) {
    const guessStrs = guessesParam.split(',');
    for (const guessStr of guessStrs) {
      const guess = decodeGuess(guessStr);
      if (guess !== null) {
        guesses.push(guess);
      }
    }
  }

  // Decode settings with defaults and clamping
  const wordsParam = params.get('words');
  const hintsParam = params.get('hints');

  const wordsCount = wordsParam ? clamp(parseInt(wordsParam, 10), 1, 5) : 3;
  const hintsCount = hintsParam ? clamp(parseInt(hintsParam, 10), 1, 5) : 3;

  // Handle invalid numbers (NaN)
  const finalWordsCount = isNaN(wordsCount) ? 3 : wordsCount;
  const finalHintsCount = isNaN(hintsCount) ? 3 : hintsCount;

  return {
    guesses,
    settings: {
      wordsCount: finalWordsCount,
      hintsCount: finalHintsCount
    }
  };
}
