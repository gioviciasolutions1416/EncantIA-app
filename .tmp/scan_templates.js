const fs = require('fs');

const filePath = 'd:\\INVITACIONES_DIGITALES\\giovis-app\\src\\templates\\boda_clasica.ts';
const content = fs.readFileSync(filePath, 'utf-8');

const match = content.match(/export const \w+ = `([\s\S]+?)`;/);
if (!match) {
  console.log("No template string found");
  process.exit(1);
}

const html = match[1];
const lines = html.split('\n');

const results = [];
lines.forEach((line, index) => {
  // Encontrar texto entre > y <
  const matches = line.matchAll(/>([^<]+)</g);
  for (const m of matches) {
    const text = m[1].trim();
    // Excluir placeholders, variables, espacios y sólo números/puntuación
    if (text && !text.includes('{{') && !text.includes('}}') && !text.match(/^[\d.,:;\s\W%#✦]+$/)) {
      // Excluir si la línea entera tiene data-field o data-bilingual
      if (!line.includes('data-field') && !line.includes('data-bilingual')) {
         results.push({ line: index + 2, text }); // +2 offset aproximado por cabecera de archivo TS
      }
    }
  }
});

console.log(JSON.stringify(results, null, 2));
