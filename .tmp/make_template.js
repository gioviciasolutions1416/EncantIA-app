const fs = require('fs');
const path = require('path');

const srcDir = 'D:/INVITACIONES_DIGITALES/recursos/plantillas html/Bodas';
const destDir = 'D:/INVITACIONES_DIGITALES/giovis-app/src/templates';

const files = [
  { name: 'boda_bellabestia', var: 'BODA_BELLABESTIA' },
  { name: 'boda_clasica', var: 'BODA_CLASICA' },
  { name: 'boda_editorial', var: 'BODA_EDITORIAL' },
  { name: 'boda_etereo', var: 'BODA_ETEREO' },
  { name: 'boda_fineart', var: 'BODA_FINEART' }
];

files.forEach(f => {
  const htmlPath = path.join(srcDir, `${f.name}.html`);
  const tsPath = path.join(destDir, `${f.name}.ts`);

  if (fs.existsSync(htmlPath)) {
      let html = fs.readFileSync(htmlPath, 'utf8');
      // Escape backticks (\`) and dollar braces (\${}) to make explicit literal strings
      html = html.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
      
      const tsContent = `export const ${f.var} = \`\n${html}\n\`;`;
      fs.writeFileSync(tsPath, tsContent, 'utf8');
      console.log(`Creado ${f.name}.ts`);
  } else {
      console.error(`No existe ${f.name}.html`);
  }
});
