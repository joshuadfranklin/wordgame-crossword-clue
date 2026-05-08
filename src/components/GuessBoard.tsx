import { useRef, useEffect } from 'react';
import type { Guess } from '../lib/types';
import GuessRow from './GuessRow';

interface GuessBoardProps {
  guesses: Guess[];
  onGuessesChange: (guesses: Guess[]) => void;
}

export default function GuessBoard({ guesses, onGuessesChange }: GuessBoardProps) {
  const canAddMore = guesses.length < 5;
  const lastInputRef = useRef<HTMLInputElement>(null);
  const prevLengthRef = useRef(guesses.length);

  const handleGuessChange = (index: number, guess: Guess) => {
    const newGuesses = [...guesses];
    newGuesses[index] = guess;
    onGuessesChange(newGuesses);
  };

  const handleRemove = (index: number) => {
    const newGuesses = guesses.filter((_, i) => i !== index);
    onGuessesChange(newGuesses);
  };

  const handleAddGuess = () => {
    if (canAddMore) {
      onGuessesChange([...guesses, { word: '', colors: ['gray', 'gray', 'gray', 'gray', 'gray'] }]);
    }
  };

  const handleClear = () => {
    onGuessesChange([]);
  };

  useEffect(() => {
    if (guesses.length > prevLengthRef.current) {
      lastInputRef.current?.focus();
    }
    prevLengthRef.current = guesses.length;
  }, [guesses.length]);

  return (
    <div className="guess-board">
      <div className="guess-board-header">
        <div className="guess-board-label">Your guesses</div>
        <div className="guess-board-actions">
          {canAddMore && (
            <button className="add-guess-button" onClick={handleAddGuess}>
              + Add Guess
            </button>
          )}
          {guesses.length > 0 && (
            <button className="clear-button" onClick={handleClear}>
              Clear
            </button>
          )}
        </div>
      </div>
      {guesses.map((guess, i) => (
        <GuessRow
          key={i}
          ref={i === guesses.length - 1 ? lastInputRef : null}
          guess={guess}
          onChange={(g) => handleGuessChange(i, g)}
          onRemove={() => handleRemove(i)}
        />
      ))}
    </div>
  );
}
