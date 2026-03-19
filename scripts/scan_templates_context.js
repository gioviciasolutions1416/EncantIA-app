const fs = require('fs');

const files = [
  'src/templates/boda_bellabestia.ts',
  'src/templates/boda_editorial.ts',
  'src/templates/boda_etereo.ts',
  'src/templates/boda_fineart.ts'
];

let resultStr = '';

files.forEach(file => {
  resultStr += `\n=== ${file} ===\n`;
  try {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    lines.forEach((line, index) => {
      if (
        line.includes('padrinos_html') || 
        line.includes('galeria_html') || 
        line.includes('itin_html') || 
        line.includes('lugar_recepcion') || 
        line.includes('updateCountdown') ||
        line.includes('hotels') ||
        line.includes('hospedaje')
      ) {
        // Print 5 lines above for context
        const start = Math.max(0, index - 5);
        for (let i = start; i <= index; i++) {
            resultStr += `${i + 1}: ${lines[i].trim()}\n`;
        }
        resultStr += `--- \n`;
      }
    });
  } catch (e) {
    resultStr += `Error processing ${file}: ${e.message}\n`;
  }
});

fs.writeFileSync('scan_results_clean.txt', resultStr, 'utf-8');
console.log('Scan complete! Saved to scan_results_clean.txt');
