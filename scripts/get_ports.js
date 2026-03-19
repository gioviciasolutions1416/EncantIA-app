const { execSync } = require('child_process');
const fs = require('fs');

try {
    const output = execSync('netstat -ano').toString();
    const lines = output.split('\n');
    const listening = lines.filter(l => l.includes('LISTENING'));
    fs.writeFileSync('ports_clean.txt', listening.join('\n'), 'utf-8');
    console.log('Puertos guardados en ports_clean.txt');
} catch (e) {
    console.error(e);
}
