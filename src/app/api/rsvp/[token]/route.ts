import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
);

// GET /api/rsvp/[token] — traer datos del invitado y evento
export async function GET(
    _req: NextRequest,
    { params }: { params: { token: string } }
) {
    const { token } = params;

    const { data: guest, error } = await supabaseAdmin
        .from('guests')
        .select('id, name, event_id')
        .eq('invitation_token', token)
        .single();

    if (error || !guest) {
        return NextResponse.json({ error: 'Invitación no encontrada' }, { status: 404 });
    }

    const { data: event } = await supabaseAdmin
        .from('events')
        .select('title, event_date, event_time, venue, message, cover_image_url, event_type')
        .eq('id', guest.event_id)
        .single();

    // Ver si ya respondió
    const { data: rsvp } = await supabaseAdmin
        .from('rsvp')
        .select('status, companions, dietary_restrictions, message')
        .eq('guest_id', guest.id)
        .maybeSingle();

    return NextResponse.json({ guest, event, rsvp });
}

// POST /api/rsvp/[token] — confirmar asistencia
export async function POST(
    req: NextRequest,
    { params }: { params: { token: string } }
) {
    const { token } = params;
    const body = await req.json();
    const { status, companions, dietary_restrictions, message } = body;

    const { data: guest, error } = await supabaseAdmin
        .from('guests')
        .select('id')
        .eq('invitation_token', token)
        .single();

    if (error || !guest) {
        return NextResponse.json({ error: 'Invitación no encontrada' }, { status: 404 });
    }

    // Upsert rsvp
    const { error: rsvpError } = await supabaseAdmin
        .from('rsvp')
        .upsert(
            {
                guest_id: guest.id,
                status: status || 'confirmed',
                companions: companions || 0,
                dietary_restrictions: dietary_restrictions || '',
                message: message || '',
                responded_at: new Date().toISOString(),
            },
            { onConflict: 'guest_id' }
        );

    if (rsvpError) {
        return NextResponse.json({ error: rsvpError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
