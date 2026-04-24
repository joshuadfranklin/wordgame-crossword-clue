# Wordle Hint App — Design Spec

**Date:** 2026-04-24  
**Status:** Approved

---

## Overview

A React 19 SPA that accepts up to 5 Wordle guesses (word + per-letter color feedback) and provides crossword-style clues hinting at a valid next guess. All hint candidates come exclusively from the `word-output/` directory (100 words). The word being hinted is never revealed — the clue IS the hint.

---

## Data Pipeline

A Node.js pre-build script (`scripts/build-clues.js`) reads every file in `word-output/`, strips line-number prefixes, and writes `src/data/clues.json`:

```json
{
  "CRONY": ["Back-room fellow", "Baddie's buddy", ...],
  "NYMPH": ["Attendant of Apollo", ...],
  ...
}
```

- Run via `npm run build:clues`
- Wired as a pre-step to `npm run build`
- Imported as a static asset — no runtime fetch
- All 100 words in `one-hundred` have corresponding `word-output/` files

---

## Wordle Constraint Logic

The filter function accepts an array of guesses (`{ word: string, colors: ('green' | 'yellow' | 'gray')[] }`) and returns all keys from `clues.json` that satisfy every constraint:

- **Green:** candidate word must have that exact letter at that exact position
- **Yellow:** candidate word must contain that letter, but NOT at that position
- **Gray:** candidate word must not contain that letter at all — with one exception: if the same letter appears green or yellow elsewhere in the same guess, gray means "no additional occurrences beyond those already accounted for"

Linear scan over all 100 words. No indexing needed.

---

## Component Structure & State

```
App
├── Header
│   ├── SettingsButton        — toggles SettingsPanel open/closed
│   └── SaveLinkButton        — copies current URL to clipboard
├── SettingsPanel             — hidden by default, toggled by SettingsButton
│   ├── WordsControl          — 1–5 toggle buttons, default 3
│   ├── HintsControl          — 1–5 toggle buttons, default 3
│   └── CloseButton           — closes the panel
├── GuessBoard
│   └── GuessRow ×1–5         — text input + 5 mini color tiles + remove button
└── HintPanel
    ├── GetHintButton
    └── HintDisplay           — one candidate word at a time
        ├── Navigation        — ← N/total →
        └── ClueList          — up to hintsCount clues for the current candidate
```

**State in `App`:**

| Key | Type | Description |
|-----|------|-------------|
| `guesses` | `{ word: string, colors: Color[] }[]` | Up to 5 entered guesses |
| `settings` | `{ wordsCount: number, hintsCount: number }` | Both default to 3 |
| `hints` | `{ clues: string[] }[]` | Populated on button click; cleared when any guess changes |
| `currentHintIndex` | `number` | Which candidate word is currently displayed |
| `settingsOpen` | `boolean` | Whether the settings panel is visible |

`hints` is ephemeral and not serialized to the URL.

---

## URL Encoding

All persistent state is encoded in the query string and synced via `history.replaceState` (no page reloads):

```
?g=CRONY-GYGXY,NYMPH-YYXGG&words=3&hints=3
```

- Each guess: `{WORD}-{COLORS}` where colors are `G`=green, `Y`=yellow, `X`=gray
- `words` and `hints` default to 3 if absent or invalid
- On load, URL params hydrate initial state; invalid params fall back silently to defaults

**SaveLinkButton** calls `navigator.clipboard.writeText(window.location.href)` and shows a brief "Copied!" confirmation.

---

## Settings Panel

Toggled by the "⚙ Settings" button in the header (highlighted when open). Contains:

- **Words (1–5):** how many candidate words to randomly select from matches — player cycles through them one at a time
- **Hints (1–5):** how many clues to show for the currently displayed candidate word
- **Close button:** dismisses the panel

Changing either setting clears any displayed hints and updates the URL.

---

## Guess Input (GuessRow)

Compact row layout:
- Text input (5-letter word, auto-uppercased)
- 5 mini color tiles always visible but dimmed/inactive until a 5-letter word is typed — click to cycle: gray → yellow → green (default gray)
- Remove (✕) button to delete the row
- "Add guess" affordance below the last row (up to 5 total)

---

## Hint Display

Triggered by "Get Hint" button. On click:

1. Run constraint filter → candidate word list
2. If no candidates: show "No matches found" message
3. Randomly sample up to `wordsCount` candidates
4. For each, randomly sample up to `hintsCount` clues from that word's list
5. Display the first candidate's clues; `← N/total →` navigation cycles through the rest

The candidate word is **never shown**. Clues are presented as the hint for "what to guess next." Navigation arrows are disabled at the boundaries (first/last).

Displayed hints are cleared whenever any guess word or color changes.

---

## File Structure

```
/
├── scripts/
│   └── build-clues.js         — pre-build data pipeline
├── src/
│   ├── data/
│   │   └── clues.json         — generated, not committed
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── SettingsPanel.tsx
│   │   ├── GuessBoard.tsx
│   │   ├── GuessRow.tsx
│   │   ├── HintPanel.tsx
│   │   └── HintDisplay.tsx
│   ├── lib/
│   │   ├── filter.ts          — Wordle constraint logic
│   │   └── url.ts             — URL encode/decode helpers
│   └── App.tsx
├── word-output/               — source clue files (100 words)
├── one-hundred                — canonical word list
└── package.json
```

`src/data/clues.json` is generated — add it to `.gitignore`.
