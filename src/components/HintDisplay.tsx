import type { HintCandidate } from '../lib/types';

interface HintDisplayProps {
  hints: HintCandidate[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export default function HintDisplay({ hints, currentIndex, onIndexChange }: HintDisplayProps) {
  if (hints.length === 0) {
    return null;
  }

  const current = hints[currentIndex];
  const total = hints.length;
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < total - 1;

  return (
    <div className="hint-display">
      <div className="hint-header">
        <div className="hint-mystery">
          <div className="hint-label">Guess this next</div>
          <div className="mystery-tiles">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="mystery-tile">?</div>
            ))}
          </div>
        </div>
        <div className="hint-nav">
          <button
            className="nav-button"
            onClick={() => onIndexChange(currentIndex - 1)}
            disabled={!canGoPrev}
          >
            ←
          </button>
          <span className="nav-counter">{currentIndex + 1} / {total}</span>
          <button
            className="nav-button"
            onClick={() => onIndexChange(currentIndex + 1)}
            disabled={!canGoNext}
          >
            →
          </button>
        </div>
      </div>
      <div className="clue-list">
        {current.clues.map((clue, i) => (
          <div key={i} className="clue-item">
            {clue}
          </div>
        ))}
      </div>
    </div>
  );
}
