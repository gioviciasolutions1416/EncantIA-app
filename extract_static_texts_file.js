const fs = require('fs');

const content = fs.readFileSync('src/templates/boda_clasica.ts', 'utf-8');
const lines = content.split('\n');
let htmlLines = [];
let insideHtml = false;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('export const BODA_CLASICA')) insideHtml = true;
    if (line.includes('<script>') && i > 300) break;
    if (insideHtml) htmlLines.push(line);
}

const html = htmlLines.join('\n');
let results = [];
const regex = />([^<]+)</g;
let m;

while ((m = regex.exec(html)) !== null) {
    const text = m[1].trim();
    if (text && !text.startsWith('{{') && !text.includes('data-') && text.length > 2) {
        if (!text.startsWith('<!--')) results.push(`Texto: "${text}"`);
    }
}

fs.writeFileSync('static_texts_clean.txt', results.join('\n'), 'utf-8');
console.log('Static texts saved to static_texts_clean.txt');
