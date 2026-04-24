import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const wordOutputDir = path.join(__dirname, '..', 'word-output');
const outputFile = path.join(__dirname, '..', 'src', 'data', 'clues.json');

// Ensure output directory exists
const outputDir = path.dirname(outputFile);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Read all files from word-output directory
const files = fs.readdirSync(wordOutputDir);

// Build clues object
const clues = {};

files.forEach(filename => {
  const filePath = path.join(wordOutputDir, filename);
  const stats = fs.statSync(filePath);

  // Skip directories
  if (!stats.isFile()) {
    return;
  }

  // Read file content
  const content = fs.readFileSync(filePath, 'utf-8');

  // Parse lines - files contain one clue per line with no line numbers
  const lines = content.split('\n');
  const clueArray = lines
    .map(line => line.trim())
    .filter(clue => clue !== ''); // Filter empty lines

  // Add to clues object using filename as key
  clues[filename] = clueArray;
});

// Write output file
fs.writeFileSync(outputFile, JSON.stringify(clues, null, 2), 'utf-8');

console.log(`Successfully built clues.json with ${Object.keys(clues).length} words`);
console.log(`Output written to: ${outputFile}`);
