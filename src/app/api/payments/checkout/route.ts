import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-02-25.clover' });

const PRICE_MAP: Record<string, string> = {
    basico: process.env.STRIPE_PRICE_BASICO!,
    rsvp: process.env.STRIPE_PRICE_RSVP!,
    premium: process.env.STRIPE_PRICE_PREMIUM!,
};

export async function POST(req: NextRequest) {
    try {
        const { planId, userId } = await req.json();

        if (!PRICE_MAP[planId]) {
            return NextResponse.json({ error: 'Plan inválido' }, { status: 400 });
        }

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            currency: 'mxn',
            line_items: [{ price: PRICE_MAP[planId], quantity: 1 }],
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?pago=exitoso`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/planes?cancelado=true`,
            metadata: { userId, planId },
        });

        return NextResponse.json({ checkoutUrl: session.url });
    } catch (err) {
        console.error('Checkout error:', err);
        return NextResponse.json({ error: 'Error creando sesión de pago' }, { status: 500 });
    }
}
