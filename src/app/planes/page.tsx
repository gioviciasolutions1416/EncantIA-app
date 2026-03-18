'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-browser';
import {
    Check,
    ArrowLeft,
    Loader2,
    Sparkles,
    ShieldCheck,
    Zap,
    Heart,
    Music,
    Image as ImageIcon,
    Layout
} from 'lucide-react';
import { toast } from 'sonner';

const PLANES = [
    {
        id: 'plata',
        name: 'Plata',
        price: 299,
        featured: false,
        icon: <Layout className="text-gray-400" size={24} />,
        features: [
            "1 invitación digital",
            "Personalización completa",
            "1 tema de IA incluido",
            "Mapa con GPS",
            "Mesa de regalos",
            "Soporte por email"
        ]
    },
    {
        id: 'oro',
        name: 'Oro',
        price: 499,
        featured: true,
        icon: <Zap className="text-amber-500" size={24} />,
        features: [
            "Todo lo del plan Plata",
            "3 temas de IA premium",
            "Confirmaciones en tiempo real",
            "Música de fondo ilimitada",
            "WhatsApp RSVP directo",
            "Soporte prioritario"
        ]
    },
    {
        id: 'diamante',
        name: 'Diamante',
        price: 799,
        featured: false,
        icon: <Sparkles className="text-[#a35d6a]" size={24} />,
        features: [
            "Todo lo del plan Oro",
            "Temas IA ilimitados",
            "Galería de fotos 4K",
            "Vídeo Invitación Pro",
            "Muro de felicitaciones",
            "Descarga para impresión"
        ]
    }
];

export default function PlanesPage() {
    const router = useRouter();
    const [loading, setLoading] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user || null);
        });
    }, []);

    const handleCheckout = async (planId: string) => {
        if (!user) {
            toast.error('Debes iniciar sesión para contratar un plan');
            router.push('/login?redir=/planes');
            return;
        }

        setLoading(planId);
        try {
            const res = await fetch('/api/payments/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId, userId: user.id })
            });

            const data = await res.json();
            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            } else {
                toast.error(data.error || 'Error al iniciar el pago');
            }
        } catch (error) {
            console.error(error);
            toast.error('Ocurrió un error inesperado');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#fdfafc] selection:bg-rose-100">
            {/* Nav */}
            <nav className="p-6 md:px-12 flex items-center justify-between">
                <Link href="/" className="group flex items-center gap-2">
                    <img src="/logo.png" alt="EncantIA" className="h-12 w-auto" />
                </Link>
                {user ? (
                    <Link href="/dashboard" className="text-sm font-bold text-[#a35d6a] bg-rose-50 px-6 py-2.5 rounded-full">
                        Ir a mi Panel
                    </Link>
                ) : (
                    <Link href="/login" className="text-sm font-bold text-white bg-[#a35d6a] px-6 py-2.5 rounded-full">
                        Iniciar Sesión
                    </Link>
                )}
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 text-center">
                <header className="mb-16 md:mb-24">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-rose-100 text-[#a35d6a] text-[10px] font-bold uppercase tracking-widest mb-6">
                        Precios transparentes
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold text-[#2d1b2d] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Elige la magia perfecta <br />
                        <span className="italic text-[#a35d6a]">para tu evento</span>
                    </h1>
                    <p className="text-[#7a5060] text-lg max-w-2xl mx-auto font-medium">
                        Pago único por evento. Sin cargos mensuales, sin complicaciones.
                    </p>
                </header>

                <div className="grid md:grid-cols-3 gap-8 items-stretch pt-4">
                    {PLANES.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative bg-white rounded-[40px] p-10 flex flex-col transition-all duration-500 shadow-xl border ${plan.featured ? 'border-[#a35d6a] border-2 md:scale-105 z-10' : 'border-[#f0dde3]/50'
                                } hover:-translate-y-2`}
                        >
                            {plan.featured && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#a35d6a] text-white text-[10px] font-bold px-6 py-2 rounded-full uppercase tracking-widest shadow-lg">
                                    Más recomendado ✨
                                </div>
                            )}

                            <div className="flex flex-col items-center mb-10">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${plan.featured ? 'bg-rose-50' : 'bg-gray-50'}`}>
                                    {plan.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-[#2d1b2d] mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-extrabold text-[#2d1b2d]">${plan.price}</span>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">MXN</span>
                                </div>
                            </div>

                            <ul className="space-y-5 mb-12 flex-1 text-left">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-[#7a5060] font-medium leading-relaxed">
                                        <div className={`mt-0.5 rounded-full flex items-center justify-center flex-shrink-0 ${plan.featured ? 'text-[#a35d6a]' : 'text-green-500'}`}>
                                            <Check size={18} strokeWidth={3} />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleCheckout(plan.id)}
                                disabled={!!loading}
                                className={`w-full py-5 rounded-full font-bold text-sm transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center ${plan.featured
                                    ? 'bg-[#a35d6a] text-white shadow-[#a35d6a]/20'
                                    : 'bg-white text-[#a35d6a] border-2 border-[#a35d6a]/20 hover:bg-rose-50'
                                    }`}
                            >
                                {loading === plan.id ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    'Elegir este Plan'
                                )}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Secure Payment Note */}
                <footer className="mt-20 flex flex-col items-center gap-6 opacity-40">
                    <div className="flex items-center gap-6">
                        <ShieldCheck size={24} />
                        <div className="flex items-center gap-2">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-6" />
                        </div>
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest">Pagos 100% seguros procesados por Stripe</p>
                </footer>
            </main>
        </div>
    );
}
