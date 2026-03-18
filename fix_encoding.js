const fs = require('fs');
const sourcePath = 'd:/INVITACIONES_DIGITALES/editor-v4-completo (1).jsx';
const targetPath = 'd:/INVITACIONES_DIGITALES/giovis-app/src/app/editor/[id]/page.tsx';

try {
    const content = fs.readFileSync(sourcePath, 'utf8');
    fs.writeFileSync(targetPath, '"use client";\n' + content, 'utf8');
    console.log('Successfully wrote UTF-8 file to ' + targetPath);
} catch (err) {
    console.error('Error:', err);
    process.exit(1);
}
