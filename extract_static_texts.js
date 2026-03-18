const fs = require('fs');

const file = 'src/templates/boda_clasica.ts';
const content = fs.readFileSync(file, 'utf-8');

// Extraer el bloque HTML (dentro de las comillas invertidas)
const match = content.match(/export const BODA_CLASICA\s*=\s*`([\s\S]*?)`/);
if (!match) {
    console.error('No se encontró el template string BODA_CLASICA');
    process.exit(1);
}

const html = match[1];

// Regex para encontrar etiquetas y su contenido de texto continuo
// Buscaremos cualquier texto entre > y < que no sea puros espacios
const regex = />([^<]+)</g;
let m;
console.log('--- TEXTOS ENCONTRADOS EN EL HTML ---');
while ((m = regex.exec(html)) !== null) {
    const text = m[1].trim();
    if (text && !text.startsWith('{{') && !text.includes('data-') && text.length > 2) {
        console.log(`Texto: "${text}"`);
    }
}
