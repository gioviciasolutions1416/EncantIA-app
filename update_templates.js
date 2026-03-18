const fs = require('fs');
const path = require('path');

const dir = 'D:\\INVITACIONES_DIGITALES\\giovis-app\\src\\templates';

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

Object.keys(MAPPING).forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const vars = MAPPING[file];

  // 1. Prepend global vars in :root
  const standardVars = `  :root {
    --color-primary: {{color_primary}};
    --color-secondary: {{color_secondary}};
    --color-bg: {{color_bg}};
    --font-titulos: '{{font_titulos}}', serif;
    --font-cuerpo: '{{font_cuerpo}}', sans-serif;`;

  // Matches either ":root {" or ":root{"
  content = content.replace(/:root\s*\{/, standardVars);

  // 2. Replace absolute references in file content using Regex replacement
  // var(--sage) -> var(--color-primary)
  if (vars.p) {
    const pRegex = new RegExp('var\\(\\s*' + vars.p + '\\s*\\)', 'g');
    content = content.replace(pRegex, 'var(--color-primary)');
    // Also strip declaration inside root so it doesn't declare duplicate hex
    const declRegex = new RegExp('\\s*' + vars.p + '\\s*:[^;]+;', 'g');
    content = content.replace(declRegex, '');
  }

  if (vars.s) {
    const sRegex = new RegExp('var\\(\\s*' + vars.s + '\\s*\\)', 'g');
    content = content.replace(sRegex, 'var(--color-secondary)');
    const declRegex = new RegExp('\\s*' + vars.s + '\\s*:[^;]+;', 'g');
    content = content.replace(declRegex, '');
  }

  if (vars.bg) {
    const bgRegex = new RegExp('var\\(\\s*' + vars.bg + '\\s*\\)', 'g');
    content = content.replace(bgRegex, 'var(--color-bg)');
    const declRegex = new RegExp('\\s*' + vars.bg + '\\s*:[^;]+;', 'g');
    content = content.replace(declRegex, '');
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});
