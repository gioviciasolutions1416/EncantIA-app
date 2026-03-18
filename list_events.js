const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ljwodlzilfilbticoqnb.supabase.co';
const supabaseKey = 'sb_publishable_qV-MMSvES27SH6lEvsAUGw_owouPOrQ'; 

const supabase = createClient(supabaseUrl, supabaseKey);

async function listEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('id, title, event_type, slug')
    .limit(5);

  if (error) {
    console.error(error);
    return;
  }
  console.log('Eventos encontrados:', JSON.stringify(data, null, 2));
}

listEvents();
