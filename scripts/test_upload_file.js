const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

let supabaseUrl = '';
let supabaseKey = '';

try {
  const envContent = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf-8');
  envContent.split('\n').forEach(line => {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim();
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1].trim();
  });
} catch (e) {
  console.log('Error env:', e.message);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpload(bucketName) {
  console.log(`\n--- Probando subida a: ${bucketName} ---`);
  
  // Crear un archivo de prueba buffer
  const buffer = Buffer.from('test string');
  const filePath = `test_upload_${Date.now()}.txt`;
  
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, buffer, {
      contentType: 'text/plain',
      upsert: true
    });

  if (error) {
    console.log(`UPLOAD ${bucketName} FAIL: ${error.message}`);
    if (error.statusCode) console.log(`Status Code: ${error.statusCode}`);
  } else {
    console.log(`UPLOAD ${bucketName} SUCCESS! Path: ${data.path}`);
  }
}

async function run() {
  await testUpload('covers');
  await testUpload('gallery');
}

run();
