const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

let supabaseUrl = '';
let supabaseKey = '';

try {
  const envContent = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf-8');
  const lines = envContent.split('\n');
  lines.forEach(line => {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim();
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1].trim();
  });
} catch (e) {
  console.log('Error env:', e.message);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test(name) {
  const { data, error } = await supabase.storage.createBucket(name, { public: true });
  if (error) {
    console.log(`CREATE ${name} FAIL: ${error.message}`);
  } else {
    console.log(`CREATE ${name} OK`);
  }
}

async function run() {
  await test('covers');
  await test('gallery');
}

run();
