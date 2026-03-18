const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

let supabaseUrl = '';
let supabaseKey = '';

try {
  const envContent = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf-8');
  const lines = envContent.split('\n');
  lines.forEach(line => {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1].trim();
    }
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
      supabaseKey = line.split('=')[1].trim();
    }
  });
} catch (e) {
  console.error('Error leyendo .env.local:', e.message);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProfiles() {
  console.log('Consultando tabla profiles...');
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, role, plan');

  if (error) {
    console.error('Error consultando profiles:', error.message);
  } else {
    console.log('--- RESULTADO ---');
    console.log(JSON.stringify(data, null, 2));
  }
}

checkProfiles();
