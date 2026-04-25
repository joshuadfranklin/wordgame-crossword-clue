import { useState, useEffect } from 'react';
import type { AppState, Guess, Settings } from './lib/types';
import { encodeState, decodeState } from './lib/url';
import './App.css';

function App() {
  const [initialState] = useState(() => decodeState(window.location.search.slice(1)));
  const [guesses, setGuesses] = useState<Guess[]>(initialState.guesses);
  const [settings, setSettings] = useState<Settings>(initialState.settings);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Setters will be used in Task 6+
  void setGuesses;
  void setSettings;

  // Sync state to URL whenever it changes
  useEffect(() => {
    const state: AppState = { guesses, settings };
    const query = encodeState(state);
    const newUrl = `${window.location.pathname}?${query}`;
    window.history.replaceState(null, '', newUrl);
  }, [guesses, settings]);

  return (
    <div className="app">
      <div className="header">
        <h1>Wordle Hint</h1>
        <div className="header-actions">
          <button
            className={`settings-button ${settingsOpen ? 'active' : ''}`}
            onClick={() => setSettingsOpen(!settingsOpen)}
          >
            ⚙ Settings
          </button>
          <button className="save-link-button">[ Save Link ]</button>
        </div>
      </div>

      {/* Components will be added in subsequent tasks */}
      <div className="content">
        <p>Guesses: {guesses.length}</p>
        <p>Words: {settings.wordsCount}, Hints: {settings.hintsCount}</p>
        <p>Settings: {settingsOpen ? 'Open' : 'Closed'}</p>
      </div>
    </div>
  );
}

export default App;
