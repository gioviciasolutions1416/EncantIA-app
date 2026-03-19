const fs = require('fs');

const files = [
  'src/templates/boda_bellabestia.ts',
  'src/templates/boda_editorial.ts',
  'src/templates/boda_etereo.ts',
  'src/templates/boda_fineart.ts'
];

files.forEach(file => {
  console.log(`\n=== ${file} ===`);
  try {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    lines.forEach((line, index) => {
      if (
        line.includes('padrinos_html') || 
        line.includes('galeria_html') || 
        line.includes('itin_html') || 
        line.includes('lugar_recepcion') || 
        line.includes('updateCountdown')
      ) {
        console.log(`${index + 1}: ${line.trim()}`);
      }
    });
  } catch (e) {
    console.error(`Error processing ${file}: ${e.message}`);
  }
});
