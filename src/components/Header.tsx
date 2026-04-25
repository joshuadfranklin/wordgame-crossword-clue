import { useState } from 'react';

interface HeaderProps {
  settingsOpen: boolean;
  onToggleSettings: () => void;
}

export default function Header({ settingsOpen, onToggleSettings }: HeaderProps) {
  const [copied, setCopied] = useState(false);

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
    <div className="header">
      <h1>Wordle Hint</h1>
      <div className="header-actions">
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
  );
}
