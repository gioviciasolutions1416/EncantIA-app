import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Generar token
export async function POST(req: NextRequest) {
  try {
    const { eventId, label, expiresHours } = await req.json();
    if (!eventId) return NextResponse.json({ error: 'No eventId' }, { status: 400 });

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + (expiresHours || 24));

    const { data: insertedData, error } = await supabase
      .from('door_tokens')
      .insert({
        event_id: eventId,
        token: token,
        label: label || 'Portero',
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    // @ts-ignore
    return NextResponse.json({ token: insertedData.token });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// Validar token y obtener datos del evento
export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token');
    if (!token) return NextResponse.json({ error: 'No token' }, { status: 400 });

    const { data: tokenData, error } = await supabase
      .from('door_tokens')
      .select('*, events(*)')
      .eq('token', token)
      .eq('is_active', true)
      .single();

    if (error || !tokenData) return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    // @ts-ignore
    if (new Date(tokenData.expires_at) < new Date()) return NextResponse.json({ error: 'Token expirado' }, { status: 401 });

    // @ts-ignore
    return NextResponse.json({ event: tokenData.events, tokenId: tokenData.id });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
