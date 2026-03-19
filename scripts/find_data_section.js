const fs = require('fs');
const content = fs.readFileSync('src/templates/boda_clasica.ts', 'utf-8');

const lines = content.split('\n');
lines.forEach((line, index) => {
  if (line.includes('data-section')) {
    console.log(`${index + 1}: ${line.trim()}`);
  }
});
