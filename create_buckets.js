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

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createBucket(bucketName) {
  console.log(`Intentando crear bucket: ${bucketName}...`);
  try {
    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      fileSizeLimit: 5242880 // 5MB
    });

    if (error) {
      console.error(`Error creando el bucket ${bucketName}:`, error.message);
      return false;
    }
    console.log(`Bucket ${bucketName} creado exitosamente!`, data);
    return true;
  } catch (err) {
    console.error(`Excepción durante el bucket creation ${bucketName}:`, err.message);
    return false;
  }
}

async function run() {
  const coverCreated = await createBucket('covers');
  const galleryCreated = await createBucket('gallery');
  
  if (coverCreated && galleryCreated) {
    console.log('\n--- Éxito completo ---');
  } else {
    console.log('\n--- Reportar resultado al usuario ---');
  }
}

run();
