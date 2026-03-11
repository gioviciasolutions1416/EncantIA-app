import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ljwodlzilfilbticoqnb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqd29kbHppbGZpbGJ0aWNvcW5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwODg4MzksImV4cCI6MjA4ODY2NDgzOX0.jsCJVwLnnAupVN_NGD4Z3UTADx4hqDoOJlvV3PwbADo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
    const { data: events, error: eErr } = await supabase.from('events').select('id, title');
    if (eErr) {
        console.error('Events error:', eErr);
    } else {
        console.log('Events:', events.length);
    }

    const { data: rsvps, error: rErr } = await supabase.from('rsvps').select('id, event_id, adults, children');
    if (rErr) {
        // Maybe the table is named differently, like 'rsvp'
        console.error('RSVPs error:', rErr);
    } else {
        console.log('RSVPs:', rsvps.length);
        console.log('Sample RSVP:', rsvps[0]);
    }
}

check();
