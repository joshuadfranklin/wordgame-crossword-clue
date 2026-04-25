import type { Guess } from '../lib/types';
import GuessRow from './GuessRow';

interface GuessBoardProps {
  guesses: Guess[];
  onGuessesChange: (guesses: Guess[]) => void;
}

export default function GuessBoard({ guesses, onGuessesChange }: GuessBoardProps) {
  const canAddMore = guesses.length < 5;

  const handleGuessChange = (index: number, guess: Guess) => {
    const newGuesses = [...guesses];
    newGuesses[index] = guess;
    onGuessesChange(newGuesses);
  };

  const handleRemove = (index: number) => {
    const newGuesses = guesses.filter((_, i) => i !== index);
    onGuessesChange(newGuesses);
  };

  return (
    <div className="guess-board">
      <div className="guess-board-label">Your guesses</div>
      {guesses.map((guess, i) => (
        <GuessRow
          key={i}
          guess={guess}
          onChange={(g) => handleGuessChange(i, g)}
          onRemove={() => handleRemove(i)}
        />
      ))}
      {canAddMore && (
        <GuessRow
          guess={null}
          onChange={(guess) => onGuessesChange([...guesses, guess])}
          onRemove={() => {}}
        />
      )}
    </div>
  );
}
