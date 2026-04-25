import { useState, useEffect } from 'react';
import type { AppState, Guess, Settings } from './lib/types';
import { encodeState, decodeState } from './lib/url';
import Header from './components/Header';
import SettingsPanel from './components/SettingsPanel';
import GuessBoard from './components/GuessBoard';
import './App.css';

function App() {
  const [initialState] = useState(() => decodeState(window.location.search.slice(1)));
  const [guesses, setGuesses] = useState<Guess[]>(initialState.guesses);
  const [settings, setSettings] = useState<Settings>(initialState.settings);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Sync state to URL whenever it changes
  useEffect(() => {
    const state: AppState = { guesses, settings };
    const query = encodeState(state);
    const newUrl = `${window.location.pathname}?${query}`;
    window.history.replaceState(null, '', newUrl);
  }, [guesses, settings]);

  return (
    <div className="app">
      <Header
        settingsOpen={settingsOpen}
        onToggleSettings={() => setSettingsOpen(!settingsOpen)}
      />

      {settingsOpen && (
        <SettingsPanel
          settings={settings}
          onSettingsChange={setSettings}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      <GuessBoard guesses={guesses} onGuessesChange={setGuesses} />
    </div>
  );
}

export default App;
