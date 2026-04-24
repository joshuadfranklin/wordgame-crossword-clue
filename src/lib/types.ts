export type Color = 'green' | 'yellow' | 'gray';

export interface Guess {
  word: string;
  colors: Color[];
}

export interface Settings {
  wordsCount: number;
  hintsCount: number;
}

export interface AppState {
  guesses: Guess[];
  settings: Settings;
}

export interface HintCandidate {
  clues: string[];
}

export type CluesData = Record<string, string[]>;
