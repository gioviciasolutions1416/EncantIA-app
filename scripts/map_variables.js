const fs = require('fs');
const path = require('path');

const dir = 'D:\\INVITACIONES_DIGITALES\\giovis-app\\src\\templates';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts') && f !== 'index.ts');

const MAPPING = {
  'baby_shower.ts': { p: '--sage', s: '--terracotta', bg: '--sage-bg' },
  'baby_shower_2.ts': { p: '--peach', s: '--lemon', bg: '--cream' },
  'bautizo.ts': { p: '--sky-deep', s: '--gold', bg: '--cloud' },
  'bautizo_2.ts': { p: '--terr', s: '--olive', bg: '--warm-white' },
  'boda_1.ts': { p: '--rose', s: '--petal', bg: '--ivory' },
  'boda_2.ts': { p: '--emerald', s: '--champagne', bg: '--ivory' },
  'graduacion.ts': { p: '--accent', s: '--accent2', bg: '--bg' },
  'graduacion_2.ts': { p: '--gold', s: '--navy', bg: '--cream' },
  'xv_2.ts': { p: '--hot', s: '--cyan', bg: '--dark' },
  'xv_anos.ts': { p: '--rose', s: '--blush', bg: '--cream' }
};

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const vars = MAPPING[file];

  if (vars) {
    const mappingBlock = `\n    /* Mapeo adaptado a locales */
    ${vars.p}: var(--color-primary);
    ${vars.s}: var(--color-secondary);
    ${vars.bg}: var(--color-bg);`;

    content = content.replace(/(:root\s*\{[\s\S]*?)\}/, (match, rootInner) => {
      // Avoid duplicating the block if run multiple times
      if (rootInner.includes('Mapeo adaptado a locales')) return match;
      return rootInner.trim() + mappingBlock + '\n  }';
    });

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated mapped variables in style for ${file}`);
  }
});
