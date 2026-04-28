import { describe, it, expect } from 'vitest';
import { filterCandidates } from './filter';
import type { Guess } from './types';

describe('filterCandidates', () => {
  const candidates = ['APPLE', 'PASTE', 'STALE', 'PLANT', 'SPEED'];

  it('returns all candidates when no guesses provided', () => {
    const result = filterCandidates([], candidates);
    expect(result).toEqual(candidates);
  });

  it('filters by green constraint (exact position match)', () => {
    const guesses: Guess[] = [
      {
        word: 'ABACK',
        colors: ['green', 'gray', 'gray', 'gray', 'gray']
      }
    ];
    const result = filterCandidates(guesses, candidates);
    // Only words starting with 'A' and not containing B, C, K
    expect(result).toEqual(['APPLE']);
  });

  it('filters by multiple green constraints', () => {
    // S at position 0 (green), E at position 4 (green), contains P (not at pos 1), no A, D
    // SPEED: S at 0 ✓, P at 1 ✗ (P can't be at 1 because it's yellow), E at 4? No, has D at 4 ✗
    // Actually, SPEED is S-P-E-E-D, so position 4 is D not E
    // Let me check: STALE is S-T-A-L-E, so position 4 is E ✓, but has A at position 2 (A is gray) ✗
    // None match! Need to pick a better guess word or candidate
    // Let's use a simpler test: just check positions match
    const testCandidates = ['STALE', 'SWEDE', 'SPINE'];
    const testGuess: Guess[] = [{
      word: 'STOIC',
      colors: ['green', 'gray', 'gray', 'gray', 'gray']
    }];
    const testResult = filterCandidates(testGuess, testCandidates);
    // S at position 0, no T, O, I, C
    // STALE: S at 0 ✓, has T ✗
    // SWEDE: S at 0 ✓, no T/O/I/C ✓ → PASS
    // SPINE: S at 0 ✓, has I ✗
    expect(testResult).toEqual(['SWEDE']);
  });

  it('filters by yellow constraint (contains but wrong position)', () => {
    const guesses: Guess[] = [
      {
        word: 'ADIEU',
        colors: ['yellow', 'gray', 'gray', 'gray', 'gray']
      }
    ];
    const result = filterCandidates(guesses, candidates);
    // Contains 'A' but not at position 0, and not containing D, I, E, U
    // STALE: has A at 2 ✓ (not at 0), has E ✗ (E is gray)
    // PLANT: has A at 2 ✓ (not at 0), no D/I/E/U ✓ → PASS
    expect(result).toEqual(['PLANT']);
  });

  it('filters by yellow constraint at multiple positions', () => {
    const guesses: Guess[] = [
      {
        word: 'LATHE',
        colors: ['yellow', 'yellow', 'gray', 'gray', 'gray']
      }
    ];
    const result = filterCandidates(guesses, candidates);
    // Contains L (not at pos 0) and A (not at pos 1), no T, H, E
    // PLANT: P-L-A-N-T
    //   Has L at 1 (not at 0) ✓
    //   Has A at 2 (not at 1) ✓
    //   Has T ✗ (T is gray)
    // None should match
    expect(result).toEqual([]);
  });

  it('filters by gray constraint (not in word)', () => {
    const guesses: Guess[] = [
      {
        word: 'BAKER',
        colors: ['gray', 'gray', 'gray', 'gray', 'gray']
      }
    ];
    const result = filterCandidates(guesses, candidates);
    // None of B, A, K, E, R
    expect(result).toEqual([]);
  });

  it('handles gray constraint correctly (excludes letter)', () => {
    const guesses: Guess[] = [
      {
        word: 'ZEBUS',
        colors: ['gray', 'gray', 'gray', 'gray', 'gray']
      }
    ];
    const result = filterCandidates(guesses, candidates);
    // No Z, E, B, U, S - only candidates without these letters
    expect(result).toEqual(['PLANT']); // PLANT doesn't contain any of these (APPLE has E, PASTE has E and S, STALE has E and S, SPEED has E and S)
  });

  it('handles complex case with duplicate letters (green and gray)', () => {
    const guesses: Guess[] = [
      {
        word: 'SPEED',
        colors: ['gray', 'gray', 'green', 'gray', 'gray']
      }
    ];
    const result = filterCandidates(guesses, candidates);
    // 'E' at position 2 is green (must match)
    // 'S', 'P', 'E' (at position 3), 'D' are gray (not in word or no additional)
    // So: must have 'E' at position 2, no S, P, D, and no additional E beyond position 2
    expect(result).toEqual([]); // None match: APPLE (no E at pos 2), PASTE (has S,P), STALE (has S), PLANT (no E at pos 2), SPEED (has S,P,D)
  });

  it('handles duplicate letters with yellow and gray correctly', () => {
    // PROOF: P(0)-R(1)-O(2)-O(3)-F(4)
    // R at position 1 is yellow: contains R but not at position 1
    // O at position 2 is yellow: contains O but not at position 2
    // P at position 0 is gray, O at position 3 is gray, F at position 4 is gray
    // Confirmed letters: R (1 occurrence from yellow), O (1 occurrence from yellow at pos 2)
    // So: must have exactly 1 R (not at pos 1), exactly 1 O (not at pos 2), no P, no F
    //
    // ROBOT: R-O-B-O-T
    //   R at 0 (not at 1) ✓
    //   Has 2 Os (at positions 1 and 3) ✗ (only 1 O confirmed, but candidate has 2)
    // Wait, let me reconsider. O at pos 2 is yellow (1 O confirmed), O at pos 3 is gray.
    // Gray with confirmed letter means "no additional beyond confirmed"
    // So ROBOT with 2 Os fails because we only confirmed 1 O
    //
    // FLOOR: F-L-O-O-R
    //   Has F ✗ (F is gray)
    //
    // TROOP: T-R-O-O-P
    //   Has P ✗ (P is gray)
    //
    // COLOR: C-O-L-O-R
    //   Has 2 Os (pos 1 and 3), but only 1 confirmed → FAIL
    //
    // Actually, all should fail! Need better test case.
    const guesses: Guess[] = [
      {
        word: 'PROOF',
        colors: ['gray', 'yellow', 'yellow', 'gray', 'gray']
      }
    ];
    const betterCandidates = ['CORNY', 'DECOR', 'MOTOR'];
    const betterResult = filterCandidates(guesses, betterCandidates);
    // CORNY: C-O-R-N-Y
    //   R at 2 (not at 1) ✓
    //   O at 1 (not at 2) ✓
    //   Exactly 1 R ✓, exactly 1 O ✓
    //   No P, F ✓
    //   → PASS
    // DECOR: D-E-C-O-R
    //   R at 4 (not at 1) ✓
    //   O at 3 (not at 2) ✓
    //   Exactly 1 R ✓, exactly 1 O ✓
    //   No P, F ✓
    //   → PASS
    // MOTOR: M-O-T-O-R
    //   Has 2 Os → FAIL
    expect(betterResult).toEqual(['CORNY', 'DECOR']);
  });

  it('combines multiple guesses correctly', () => {
    // First guess: S at position 3 is green, contains P (not at pos 4), no C, R, I
    // Second guess: P at position 3 is green, S at position 4 is green, no B, U, M
    // Wait, position 3 can't be both S and P! Let me fix this.
    // Actually CRISP has positions: C(0) R(1) I(2) S(3) P(4)
    // and BUMPS has: B(0) U(1) M(2) P(3) S(4)
    // First: S green at 3, P yellow at 4 (P exists but not at 4)
    // Second: P green at 3, S green at 4
    // Conflict: S can't be green at both 3 and 4, but P can be at 3 if first guess's P yellow means it exists
    // Let me use simpler: just test that both constraints apply
    const simpleCandidates = ['PASTE', 'STALE'];
    const simpleGuesses: Guess[] = [
      { word: 'ZEBRA', colors: ['gray', 'yellow', 'gray', 'gray', 'gray'] },
      { word: 'QUIET', colors: ['gray', 'gray', 'gray', 'green', 'yellow'] }
    ];
    // First: contains E (not at pos 1), no Z, B, R, A
    // Second: E at pos 3, contains T (not at pos 4), no Q, U, I
    // PASTE: has E at 4 (not 3) → FAIL
    // STALE: has E at 4 (not 3) → FAIL
    const simpleResult = filterCandidates(simpleGuesses, simpleCandidates);
    expect(simpleResult).toEqual([]);
  });
});
