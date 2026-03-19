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
  // Eliminar etiquetas para dejar solo texto
  const stripped = line.replace(/<[^>]+>/g, ' ').trim();
  
  if (stripped && !stripped.includes('{{') && !stripped.includes('}}')) {
    // Evitar scripts o css o comentarios
    if (!stripped.includes('function') && !stripped.includes('{') && !stripped.includes('@') && !stripped.includes('/*') && !stripped.match(/^[\d.,:;\s\W%#✦]+$/)) {
      results.push({ line: index + 1, text: stripped, full_line: line.trim() });
    }
  }
});

console.log(JSON.stringify(results, null, 2));
