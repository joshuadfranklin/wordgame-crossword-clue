import { describe, it, expect } from 'vitest';
import { encodeState, decodeState } from './url';
import type { AppState } from './types';

describe('encodeState', () => {
  it('encodes state with guesses and settings', () => {
    const state: AppState = {
      guesses: [
        {
          word: 'CRONY',
          colors: ['green', 'yellow', 'green', 'gray', 'yellow']
        }
      ],
      settings: {
        wordsCount: 3,
        hintsCount: 2
      }
    };
    const result = encodeState(state);
    expect(result).toBe('g=CRONY-GYGXY&words=3&hints=2');
  });

  it('encodes state with multiple guesses', () => {
    const state: AppState = {
      guesses: [
        {
          word: 'CRONY',
          colors: ['green', 'yellow', 'green', 'gray', 'yellow']
        },
        {
          word: 'NYMPH',
          colors: ['yellow', 'yellow', 'gray', 'green', 'green']
        }
      ],
      settings: {
        wordsCount: 4,
        hintsCount: 5
      }
    };
    const result = encodeState(state);
    expect(result).toBe('g=CRONY-GYGXY,NYMPH-YYXGG&words=4&hints=5');
  });

  it('encodes state with empty guesses', () => {
    const state: AppState = {
      guesses: [],
      settings: {
        wordsCount: 3,
        hintsCount: 3
      }
    };
    const result = encodeState(state);
    expect(result).toBe('words=3&hints=3');
  });
});

describe('decodeState', () => {
  it('decodes valid query string', () => {
    const query = 'g=CRONY-GYGXY&words=3&hints=2';
    const result = decodeState(query);
    expect(result).toEqual({
      guesses: [
        {
          word: 'CRONY',
          colors: ['green', 'yellow', 'green', 'gray', 'yellow']
        }
      ],
      settings: {
        wordsCount: 3,
        hintsCount: 2
      }
    });
  });

  it('decodes query string with multiple guesses', () => {
    const query = 'g=CRONY-GYGXY,NYMPH-YYXGG&words=4&hints=5';
    const result = decodeState(query);
    expect(result).toEqual({
      guesses: [
        {
          word: 'CRONY',
          colors: ['green', 'yellow', 'green', 'gray', 'yellow']
        },
        {
          word: 'NYMPH',
          colors: ['yellow', 'yellow', 'gray', 'green', 'green']
        }
      ],
      settings: {
        wordsCount: 4,
        hintsCount: 5
      }
    });
  });

  it('decodes query string with missing params (uses defaults)', () => {
    const query = '';
    const result = decodeState(query);
    expect(result).toEqual({
      guesses: [],
      settings: {
        wordsCount: 3,
        hintsCount: 3
      }
    });
  });

  it('decodes query string with partial params (uses defaults for missing)', () => {
    const query = 'words=2';
    const result = decodeState(query);
    expect(result).toEqual({
      guesses: [],
      settings: {
        wordsCount: 2,
        hintsCount: 3
      }
    });
  });

  it('decodes query string with invalid params (uses defaults)', () => {
    const query = 'g=INVALID&words=abc&hints=xyz';
    const result = decodeState(query);
    expect(result).toEqual({
      guesses: [],
      settings: {
        wordsCount: 3,
        hintsCount: 3
      }
    });
  });

  it('clamps settings to 1-5 range', () => {
    const query = 'words=0&hints=10';
    const result = decodeState(query);
    expect(result).toEqual({
      guesses: [],
      settings: {
        wordsCount: 1,
        hintsCount: 5
      }
    });
  });

  it('clamps negative settings to 1', () => {
    const query = 'words=-5&hints=-2';
    const result = decodeState(query);
    expect(result).toEqual({
      guesses: [],
      settings: {
        wordsCount: 1,
        hintsCount: 1
      }
    });
  });
});
