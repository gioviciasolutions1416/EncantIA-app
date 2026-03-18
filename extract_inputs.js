const fs = require('fs');
const path = require('path');

const dir = 'd:/INVITACIONES_DIGITALES/giovis-app/src/components/editor/sections';
const files = fs.readdirSync(dir);
let outputStr = '';

files.forEach(file => {
  const filePath = path.join(dir, file);
  if (!fs.statSync(filePath).isFile()) return;
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Regex to find `<textarea` or `<input` with all attributes over lines
  const regex = /<(textarea|input)([\s\S]*?)(\/>|<\/textarea>|>)/g;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    const tagName = match[1];
    const attributes = match[2];
    
    // Si es input, ignorar si tiene un tipo que no sea text (ej: type="file", type="radio", etc.)
    if (tagName === 'input') {
      const typeMatch = attributes.match(/type\s*=\s*"([^"]+)"/) || attributes.match(/type\s*=\s*\{'([^']+)'\}/);
      if (typeMatch && typeMatch[1] !== 'text') {
         continue; // ignorar checkbox, file, etc.
      }
    }
    
    const valueMatch = attributes.match(/value\s*=\s*\{([^\}]+)\}/) || attributes.match(/value\s*=\s*"([^"]+)"/);
    const placeholderMatch = attributes.match(/placeholder\s*=\s*"([^"]+)"/) || attributes.match(/placeholder\s*=\s*\{([^\}]+)\}/);
    
    const value = valueMatch ? valueMatch[1].trim() : 'N/A';
    const placeholder = placeholderMatch ? placeholderMatch[1].trim() : 'N/A';
    
    // Encontrar Label anterior buscando hacia atrás
    const tagIndex = match.index;
    const precedingContent = content.substring(Math.max(0, tagIndex - 1000), tagIndex);
    const labelMatches = [...precedingContent.matchAll(/<label[^>]*>([\s\S]*?)<\/label>/g)];
    let label = 'N/A';
    if (labelMatches.length > 0) {
       const lastLabelMatch = labelMatches[labelMatches.length - 1][1];
       label = lastLabelMatch.replace(/<[^>]+>/g, '').trim();
    }
    
    outputStr += `FILE: ${file}\n`;
    outputStr += `FIELD: ${value}\n`;
    outputStr += `PLACEHOLDER: ${placeholder}\n`;
    outputStr += `LABEL: ${label}\n`;
    outputStr += '---\n';
  }
});

fs.writeFileSync('inputs_output.txt', outputStr, 'utf-8');
console.log('Done');
