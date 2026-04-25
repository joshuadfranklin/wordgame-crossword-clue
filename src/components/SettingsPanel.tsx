import type { Settings } from '../lib/types';

interface SettingsPanelProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  onClose: () => void;
}

export default function SettingsPanel({ settings, onSettingsChange, onClose }: SettingsPanelProps) {
  const options = [1, 2, 3, 4, 5];

  const handleWordsChange = (value: number) => {
    onSettingsChange({ ...settings, wordsCount: value });
  };

  const handleHintsChange = (value: number) => {
    onSettingsChange({ ...settings, hintsCount: value });
  };

  return (
    <div className="settings-panel">
      <div className="settings-row">
        <span className="settings-label">Words</span>
        <div className="settings-options">
          {options.map(n => (
            <button
              key={n}
              className={`settings-option ${settings.wordsCount === n ? 'active' : ''}`}
              onClick={() => handleWordsChange(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
      <div className="settings-row">
        <span className="settings-label">Hints</span>
        <div className="settings-options">
          {options.map(n => (
            <button
              key={n}
              className={`settings-option ${settings.hintsCount === n ? 'active' : ''}`}
              onClick={() => handleHintsChange(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
      <div className="settings-close">
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
