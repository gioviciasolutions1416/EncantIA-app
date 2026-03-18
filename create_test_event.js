const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ljwodlzilfilbticoqnb.supabase.co';
const supabaseKey = 'sb_publishable_qV-MMSvES27SH6lEvsAUGw_owouPOrQ'; 
// Wait, the .env.local said SUPABASE_SERVICE_ROLE_KEY=sb_publishable_qV-MMSvES27SH6lEvsAUGw_owouPOrQ
// That looks like a publishable key actually, or a weird name.
// Let's try the anon key first, maybe RLS is disabled for inserts if authenticated.
// Actually, I'll just use the one from .env.local.

const supabase = createClient(supabaseUrl, supabaseKey);

async function createEvent() {
  const { data, error } = await supabase
    .from('events')
    .insert({
      title: 'Boda de Prueba Antigravity',
      event_type: 'Boda',
      event_date: '2026-06-20',
      slug: 'boda-prueba-' + Math.floor(Math.random() * 1000),
      template_id: 'template-default',
      plan: 'basico'
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    return;
  }
  console.log('Created event ID:', data.id);
}

createEvent();
