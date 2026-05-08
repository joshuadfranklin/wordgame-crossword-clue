import { useState, useEffect, forwardRef } from 'react';
import type { Guess, Color } from '../lib/types';

interface GuessRowProps {
  guess: Guess | null;
  onChange: (guess: Guess) => void;
  onRemove: () => void;
}

const COLOR_CYCLE: Color[] = ['gray', 'yellow', 'green'];

const GuessRow = forwardRef<HTMLInputElement, GuessRowProps>(function GuessRow({ guess, onChange, onRemove }, ref) {
  const [word, setWord] = useState(guess?.word || '');
  const [colors, setColors] = useState<Color[]>(guess?.colors || ['gray', 'gray', 'gray', 'gray', 'gray']);

  useEffect(() => {
    if (guess) {
      setWord(guess.word);
      setColors(guess.colors);
    }
  }, [guess]);

  const isActive = word.length === 5;

  const handleWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5);
    setWord(value);

    if (value.length === 5) {
      onChange({ word: value, colors });
    }
  };

  const handleColorClick = (index: number) => {
    if (!isActive) return;

    const currentColor = colors[index];
    const currentIndex = COLOR_CYCLE.indexOf(currentColor);
    const nextIndex = (currentIndex + 1) % COLOR_CYCLE.length;
    const nextColor = COLOR_CYCLE[nextIndex];

    const newColors = [...colors];
    newColors[index] = nextColor;
    setColors(newColors);

    if (word.length === 5) {
      onChange({ word, colors: newColors });
    }
  };

  return (
    <div className="guess-row">
      <input
        ref={ref}
        type="text"
        className="guess-input"
        value={word}
        onChange={handleWordChange}
        placeholder="WORD"
        maxLength={5}
      />
      <div className="color-tiles">
        {colors.map((color, i) => (
          <div
            key={i}
            className={`color-tile ${color} ${isActive ? '' : 'inactive'}`}
            onClick={() => handleColorClick(i)}
          >
            {isActive ? word[i] : ''}
          </div>
        ))}
      </div>
      {guess && (
        <button className="remove-button" onClick={onRemove}>
          ✕
        </button>
      )}
    </div>
  );
});

export default GuessRow;
