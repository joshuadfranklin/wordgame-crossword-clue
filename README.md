# Wordle Hint App

A React 19 SPA that provides crossword-style clues as hints for Wordle based on your guess constraints.

## Setup

```bash
npm install
npm run build:clues  # Generate clues from word-output/ files
npm run dev          # Start development server
```

## Usage

1. Enter your Wordle guesses (word + color feedback)
2. Click "Get Hint" to see crossword-style clues for valid next guesses
3. Navigate through multiple candidate words using ← / →
4. Adjust Words (1-5) and Hints (1-5) in Settings
5. Click "Save Link" to share your current state via URL

## How It Works

- **Data**: Pre-builds `word-output/` files into `src/data/clues.json`
- **Filtering**: Applies Wordle green/yellow/gray constraints client-side
- **Hints**: Randomly samples candidate words and clues per settings
- **Persistence**: All state encoded in URL query string

## Color Codes

- **Green**: Letter is correct and in the right position
- **Yellow**: Letter is in the word but wrong position
- **Gray**: Letter is not in the word (or no additional occurrences)

## Scripts

- `npm run dev` - Development server
- `npm run build:clues` - Generate clues.json from word-output/
- `npm run build` - Production build (runs build:clues first)
- `npm run preview` - Preview production build
- `npm test` - Run tests

## Tech Stack

- React 19
- TypeScript
- Vite
- Vitest
