import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { guestId } = await req.json();
    if (!guestId) return NextResponse.json({ error: 'No guestId' }, { status: 400 });

    const { error } = await supabase
      .from('guests')
      .update({
        status: 'confirmed',
        rsvp_status: 'confirmed'
      })
      .eq('id', guestId);

    if (error) {
      console.error('RSVP Supabase error:', JSON.stringify(error));
      throw error;
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('RSVP error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
