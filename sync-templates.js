const fs = require('fs');
const path = require('path');

const srcDir = 'd:\\INVITACIONES_DIGITALES\\recursos\\plantillas html\\Bodas';
const destDir = 'd:\\INVITACIONES_DIGITALES\\giovis-app\\src\\templates';

const mapping = {
  'boda_bellabestia.html': { file: 'boda_bellabestia.ts', varName: 'BODA_BELLABESTIA' },
  'boda_clasica.html': { file: 'boda_clasica.ts', varName: 'BODA_CLASICA' },
  'boda_editorial.html': { file: 'boda_editorial.ts', varName: 'BODA_EDITORIAL' },
  'boda_etereol.html': { file: 'boda_etereo.ts', varName: 'BODA_ETEREO' },
  'boda_fineart.html': { file: 'boda_fineart.ts', varName: 'BODA_FINEART' }
};

function escapeForTemplateLiteral(str) {
  // Escape backticks if any exist inside the HTML
  return str.replace(/`/g, '\\`').replace(/\${/g, '\\${');
}

Object.entries(mapping).forEach(([htmlFile, config]) => {
    const htmlPath = path.join(srcDir, htmlFile);
    const tsPath = path.join(destDir, config.file);
    
    if(fs.existsSync(htmlPath)) {
        let content = fs.readFileSync(htmlPath, 'utf8');
        const escapedContent = escapeForTemplateLiteral(content);
        const tsContent = `export const ${config.varName} = \`\n${escapedContent}\n\`;\n`;
        fs.writeFileSync(tsPath, tsContent, 'utf8');
        console.log(`Synced: ${htmlFile} -> ${config.file}`);
    } else {
        console.log(`Missing: ${htmlFile}`);
    }
});
