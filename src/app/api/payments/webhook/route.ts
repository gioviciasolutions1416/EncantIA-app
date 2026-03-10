import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-02-25.clover' });

// Admin client — usa service role para operaciones server-side
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(req: NextRequest) {
    const rawBody = await req.text();
    const sig = req.headers.get('stripe-signature');

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(rawBody, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err) {
        console.error('Webhook signature error:', err);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const { userId, planId } = session.metadata || {};

        if (userId && planId) {
            const planExpiry = new Date();
            planExpiry.setFullYear(planExpiry.getFullYear() + 2);

            // Actualizar plan en profiles
            await supabaseAdmin
                .from('profiles')
                .update({ plan: planId, plan_expires_at: planExpiry.toISOString() })
                .eq('id', userId);

            // Registrar pago
            await supabaseAdmin.from('payments').insert({
                user_id: userId,
                stripe_session_id: session.id,
                plan: planId,
                amount: session.amount_total ? session.amount_total / 100 : 0,
                status: 'completed',
            });
        }
    }

    return NextResponse.json({ received: true }, { status: 200 });
}
