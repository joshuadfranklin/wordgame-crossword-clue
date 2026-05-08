import { useState, useEffect } from 'react';
import type { Guess, Settings, HintCandidate, CluesData } from '../lib/types';
import { filterCandidates } from '../lib/filter';
import HintDisplay from './HintDisplay';

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

interface HintPanelProps {
  guesses: Guess[];
  settings: Settings;
  clues: CluesData;
}

export default function HintPanel({ guesses, settings, clues }: HintPanelProps) {
  const [hints, setHints] = useState<HintCandidate[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (guesses.length === 0) {
      setHints([]);
      setHasSearched(false);
    }
  }, [guesses.length]);

  const handleGetHint = () => {
    setHasSearched(true);
    // IMPORTANT: filterCandidates expects string[] not CluesData
    const candidates = filterCandidates(guesses, Object.keys(clues));

    if (candidates.length === 0) {
      setHints([]);
      return;
    }

    // Randomly sample up to wordsCount candidates
    const shuffled = shuffleArray(candidates);
    const selected = shuffled.slice(0, settings.wordsCount);

    // For each candidate, randomly sample up to hintsCount clues
    const hintCandidates: HintCandidate[] = selected.map(word => {
      const availableClues = clues[word] ?? [];
      const shuffledClues = shuffleArray(availableClues);
      const selectedClues = shuffledClues.slice(0, settings.hintsCount);
      return { clues: selectedClues };
    });

    setHints(hintCandidates);
    setCurrentIndex(0);
  };

  return (
    <div className="hint-panel">
      <div className="hint-button-wrapper">
        <button className="get-hint-button" onClick={handleGetHint}>
          Get Hint
        </button>
      </div>

      {hints.length === 0 && (
        <div className="no-hints">
          {hasSearched ? 'No matching words found' : 'Click "Get Hint" to see suggestions'}
        </div>
      )}

      {hints.length > 0 && (
        <>
          <div className="hint-divider" />
          <HintDisplay
            hints={hints}
            currentIndex={currentIndex}
            onIndexChange={setCurrentIndex}
          />
        </>
      )}
    </div>
  );
}
