import type { Guess } from './types';

/**
 * Filter candidate words based on guess constraints.
 *
 * @param guesses - Array of guesses with word and color feedback
 * @param candidates - Array of candidate words to filter
 * @returns Array of candidates that match all guess constraints
 */
export function filterCandidates(guesses: Guess[], candidates: string[]): string[] {
  if (guesses.length === 0) {
    return candidates;
  }

  return candidates.filter(candidate =>
    guesses.every(guess => matchesGuess(candidate, guess))
  );
}

/**
 * Check if a candidate word matches the constraints from a single guess.
 *
 * @param candidate - The word to check
 * @param guess - The guess with word and color feedback
 * @returns true if candidate satisfies all constraints
 */
function matchesGuess(candidate: string, guess: Guess): boolean {
  const { word, colors } = guess;

  // Count letters that are green or yellow (confirmed to be in the word)
  const confirmedLetters = new Map<string, number>();

  for (let i = 0; i < word.length; i++) {
    const letter = word[i];
    const color = colors[i];

    if (color === 'green' || color === 'yellow') {
      confirmedLetters.set(letter, (confirmedLetters.get(letter) || 0) + 1);
    }
  }

  // Check each position's constraint
  for (let i = 0; i < word.length; i++) {
    const letter = word[i];
    const color = colors[i];

    if (color === 'green') {
      // Green: exact position match required
      if (candidate[i] !== letter) {
        return false;
      }
    } else if (color === 'yellow') {
      // Yellow: letter must be in word but not at this position
      if (candidate[i] === letter) {
        return false; // Can't be at this position
      }
      if (!candidate.includes(letter)) {
        return false; // Must be somewhere in the word
      }
    } else if (color === 'gray') {
      // Gray: letter is not in word, OR no additional occurrences beyond green/yellow
      const confirmedCount = confirmedLetters.get(letter) || 0;
      const candidateCount = countLetter(candidate, letter);

      if (confirmedCount > 0) {
        // If we have green/yellow for this letter, gray means "no more than confirmed count"
        if (candidateCount > confirmedCount) {
          return false;
        }
      } else {
        // If no green/yellow for this letter, gray means "not in word at all"
        if (candidate.includes(letter)) {
          return false;
        }
      }
    }
  }

  // Additional check: ensure candidate has at least the confirmed count of each letter
  for (const [letter, count] of confirmedLetters.entries()) {
    if (countLetter(candidate, letter) < count) {
      return false;
    }
  }

  return true;
}

/**
 * Count occurrences of a letter in a word.
 */
function countLetter(word: string, letter: string): number {
  let count = 0;
  for (const char of word) {
    if (char === letter) {
      count++;
    }
  }
  return count;
}
