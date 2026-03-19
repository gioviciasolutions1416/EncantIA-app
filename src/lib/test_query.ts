import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return console.log("No session");

  const { data, error } = await supabase
    .from('events')
    .select('*, guests(count), rsvp:guests(count)')
    .eq('user_id', session.user.id)
    .eq('rsvp.status', 'confirmed')
    .limit(1);
    
  console.log("Error:", error);
  console.log("Data:", JSON.stringify(data, null, 2));
}

test();
