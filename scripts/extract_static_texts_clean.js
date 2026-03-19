const fs = require('fs');

const content = fs.readFileSync('src/templates/boda_clasica.ts', 'utf-8');

// Obtener solo las líneas antes de <script> de Javascript que se inyecta
const lines = content.split('\n');
let htmlLines = [];
let insideHtml = false;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('export const BODA_CLASICA')) insideHtml = true;
    if (line.includes('<script>') && i > 300) break; // Detener en Script de partículas
    if (insideHtml) htmlLines.push(line);
}

const html = htmlLines.join('\n');
const regex = />([^<]+)</g;
let m;

console.log('--- TEXTOS ENCONTRADOS EN EL HTML ---');
while ((m = regex.exec(html)) !== null) {
    const text = m[1].trim();
    if (text && !text.startsWith('{{') && !text.includes('data-') && text.length > 2) {
        // Ignorar comentarios
        if (!text.startsWith('<!--')) console.log(`Texto: "${text}"`);
    }
}
