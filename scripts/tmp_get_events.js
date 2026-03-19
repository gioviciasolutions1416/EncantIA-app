const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ljwodlzilfilbticoqnb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqd29kbHppbGZpbGJ0aWNvcW5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwODg4MzksImV4cCI6MjA4ODY2NDgzOX0.jsCJVwLnnAupVN_NGD4Z3UTADx4hqDoOJlvV3PwbADo';
const supabase = createClient(supabaseUrl, supabaseKey);

async function getEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('id, title, slug')
    .limit(5);

  if (error) {
    console.error(error);
    return;
  }
  console.log(JSON.stringify(data, null, 2));
}

getEvents();
