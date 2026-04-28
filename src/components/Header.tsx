import { useState } from 'react';

interface HeaderProps {
  settingsOpen: boolean;
  onToggleSettings: () => void;
}

export default function Header({ settingsOpen, onToggleSettings }: HeaderProps) {
  const [copied, setCopied] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const handleSaveLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  return (
    <>
      <div className="header">
        <h1>Wordle Hint</h1>
        <div className="header-actions">
          <button
            className="help-button"
            onClick={() => setHelpOpen(true)}
          >
            ? Help
          </button>
          <button
            className={`settings-button ${settingsOpen ? 'active' : ''}`}
            onClick={onToggleSettings}
          >
            ⚙ Settings
          </button>
          <button className="save-link-button" onClick={handleSaveLink}>
            {copied ? '✓ Copied!' : '[ Save Link ]'}
          </button>
        </div>
      </div>

      {helpOpen && (
        <div className="help-modal-overlay" onClick={() => setHelpOpen(false)}>
          <div className="help-modal" onClick={(e) => e.stopPropagation()}>
            <div className="help-header">
              <h2>How to Use</h2>
              <button className="help-close" onClick={() => setHelpOpen(false)}>✕</button>
            </div>
            <div className="help-content">
              <section>
                <h3>1. Enter Your Guesses</h3>
                <p>Click <strong>+ Add Guess</strong> to add a Wordle guess. Type a 5-letter word, then click each tile to cycle through colors:</p>
                <ul>
                  <li><span className="color-label green">Green</span> - Correct letter in correct position</li>
                  <li><span className="color-label yellow">Yellow</span> - Correct letter in wrong position</li>
                  <li><span className="color-label gray">Gray</span> - Letter not in word</li>
                </ul>
              </section>

              <section>
                <h3>2. Get Hints</h3>
                <p>Click <strong>Get Hint</strong> to see crossword-style clues for valid next guesses based on your constraints.</p>
                <p>Use the <strong>← / →</strong> buttons to browse through multiple word suggestions.</p>
              </section>

              <section>
                <h3>3. Adjust Settings</h3>
                <p>Click <strong>⚙ Settings</strong> to customize:</p>
                <ul>
                  <li><strong>Words</strong> - How many candidate words to show (1-5)</li>
                  <li><strong>Hints</strong> - How many clues per word (1-5)</li>
                </ul>
              </section>

              <section>
                <h3>4. Save & Share</h3>
                <p>Click <strong>[ Save Link ]</strong> to copy the current URL. All your guesses and settings are saved in the link - perfect for sharing!</p>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
