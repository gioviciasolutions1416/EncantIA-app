import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ljwodlzilfilbticoqnb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqd29kbHppbGZpbGJ0aWNvcW5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwODg4MzksImV4cCI6MjA4ODY2NDgzOX0.jsCJVwLnnAupVN_NGD4Z3UTADx4hqDoOJlvV3PwbADo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
    const { data, error } = await supabase.from('events').select('id, title, user_id, slug');
    if (error) {
        console.error('Error fetching events:', error);
    } else {
        console.log('Events in DB:', data?.length);
        console.log(JSON.stringify(data, null, 2));
    }
}

check();
