'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-browser';
import {
    User,
    Mail,
    Shield,
    CreditCard,
    LogOut,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    Calendar,
    LayoutDashboard,
    PlusCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface UserProfile {
    id: string;
    email?: string;
    user_metadata?: {
        full_name?: string;
        name?: string;
    };
}

export default function AccountPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [eventCount, setEventCount] = useState(0);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.replace('/login');
                return;
            }
            setUser(session.user as UserProfile);

            // Get event count for stats
            const { count } = await supabase
                .from('events')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', session.user.id);

            setEventCount(count || 0);
            setLoading(false);
        };
        checkUser();
    }, [router]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.replace('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="animate-spin text-[#a35d6a]" size={36} />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#fdfafc] flex overflow-hidden">
            {/* Sidebar */}
            <aside className="hidden md:flex w-64 min-h-screen flex-col border-r bg-white flex-shrink-0" style={{ borderColor: '#f0dde3' }}>
                <div className="px-6 py-6 border-b" style={{ borderColor: '#f0dde3' }}>
                    <Link href="/" className="group inline-block">
                        <img
                            src="/logo.png"
                            alt="EncantIA"
                            style={{ height: '52px', width: 'auto', filter: 'drop-shadow(0 2px 6px rgba(163,93,106,0.3))' }}
                            className="group-hover:scale-105 transition-transform duration-300"
                        />
                    </Link>
                </div>
                <nav className="flex-1 px-3 py-6 flex flex-col gap-1">
                    {[
                        { href: '/dashboard', icon: LayoutDashboard, label: 'Mis Eventos', active: false },
                        { href: '/dashboard/nuevo', icon: PlusCircle, label: 'Crear Evento', active: false },
                        { href: '/dashboard/cuenta', icon: User, label: 'Mi Cuenta', active: true },
                    ].map(({ href, icon: Icon, label, active }) => (
                        <Link
                            key={href}
                            href={href}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                            style={{
                                background: active ? 'linear-gradient(135deg, #f8e8ee, #f3e0f7)' : 'transparent',
                                color: active ? '#7B2D8B' : '#7a5060',
                                fontWeight: active ? 600 : 400,
                            }}
                        >
                            <Icon size={18} />
                            {label}
                        </Link>
                    ))}
                </nav>
                <div className="px-3 pb-6 border-t pt-4" style={{ borderColor: '#f0dde3' }}>
                    <button onClick={handleSignOut} className="flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-sm font-medium text-red-400 hover:bg-red-50 hover:text-red-600 transition-all">
                        <LogOut size={16} /> Cerrar sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
                {/* ── HERO BANNER ──────────────────────────────────────────────── */}
                <div
                    className="relative overflow-hidden px-5 md:px-8 pt-6 pb-8"
                    style={{ background: 'linear-gradient(135deg, #2d1b2d 0%, #7B2D8B 50%, #a35d6a 100%)' }}
                >
                    {/* Decorative circles */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10 bg-white" />
                    <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-10 bg-white" />
                    <div className="absolute top-4 right-24 w-16 h-16 rounded-full opacity-5 bg-white" />

                    <div className="relative flex items-center justify-between gap-4">
                        <div className="flex flex-col gap-1">
                            <p className="text-white/60 text-xs font-medium uppercase tracking-widest">Ajustes</p>
                            <h1
                                className="text-2xl md:text-3xl font-black text-white"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                Mi Cuenta
                            </h1>
                            <p className="text-white/70 text-sm mt-1">
                                Gestiona tus datos personales y suscripción
                            </p>
                        </div>
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 text-[#7B2D8B] bg-white px-5 py-3 rounded-full font-black text-sm transition-all hover:scale-105 shadow-xl flex-shrink-0"
                        >
                            <ArrowLeft size={16} />
                            Volver
                        </Link>
                    </div>
                </div>

                <div className="max-w-2xl mx-auto px-4 md:px-8 py-8 md:py-12">
                    <div className="grid gap-6">
                        {/* Profile Info */}
                        <section className="bg-white rounded-3xl border border-[#f0dde3] overflow-hidden shadow-sm">
                            <div className="px-8 py-6 border-b border-[#f0dde3] bg-gray-50/50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                                        <User size={20} />
                                    </div>
                                    <h2 className="font-bold text-[#2d1b2d]">Datos Personales</h2>
                                </div>
                                <button className="text-xs font-bold text-[#a35d6a] hover:underline" onClick={() => toast.info('Función de edición próxima')}>Editar</button>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Nombre Completo</label>
                                        <p className="text-sm font-semibold text-[#2d1b2d]">{user.user_metadata?.full_name || user.user_metadata?.name || 'No especificado'}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Correo Electrónico</label>
                                        <p className="text-sm font-semibold text-[#2d1b2d] flex items-center gap-2">
                                            {user.email}
                                            <CheckCircle2 size={14} className="text-green-500" />
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Plan / Subscription */}
                        <section className="bg-white rounded-3xl border border-[#f0dde3] overflow-hidden shadow-sm">
                            <div className="px-8 py-6 border-b border-[#f0dde3] bg-gray-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                        <CreditCard size={20} />
                                    </div>
                                    <h2 className="font-bold text-[#2d1b2d]">Plan Actual</h2>
                                </div>
                            </div>
                            <div className="p-8">
                                <div className="flex items-center justify-between p-4 md:p-6 rounded-2xl border-2 border-dashed border-purple-100 bg-purple-50/20">
                                    <div className="min-w-0">
                                        <p className="text-sm md:text-base font-bold text-purple-700 truncate">Plan Gratuito (Básico)</p>
                                        <p className="text-xs text-purple-500/80">Vigente indefinidamente</p>
                                    </div>
                                    <Link href="/planes" className="px-5 md:px-6 py-2 md:py-2.5 rounded-full bg-purple-600 text-white text-[10px] md:text-xs font-bold shadow-lg shadow-purple-200 hover:bg-purple-700 transition-all flex-shrink-0">
                                        Mejorar Plan
                                    </Link>
                                </div>
                                <div className="mt-8 flex items-center justify-around text-center">
                                    <div>
                                        <p className="text-2xl md:text-3xl font-black text-[#2d1b2d]">{eventCount}</p>
                                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Eventos</p>
                                    </div>
                                    <div className="w-px h-10 bg-gray-100" />
                                    <div>
                                        <p className="text-2xl md:text-3xl font-black text-[#2d1b2d]">Ilimitado</p>
                                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Invitados</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Security */}
                        <section className="bg-white rounded-3xl border border-[#f0dde3] overflow-hidden shadow-sm mb-6">
                            <div className="px-8 py-6 border-b border-[#f0dde3] bg-gray-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                        <Shield size={20} />
                                    </div>
                                    <h2 className="font-bold text-[#2d1b2d]">Seguridad</h2>
                                </div>
                            </div>
                            <div className="p-8">
                                <button className="flex items-center gap-3 px-6 py-3 rounded-xl border-2 border-gray-100 font-bold text-xs text-[#2d1b2d] hover:bg-gray-50 transition-all">
                                    Cambiar Contraseña
                                </button>
                                <p className="text-[10px] text-gray-400 mt-4 leading-relaxed italic">
                                    EncantIA utiliza Supabase Auth para garantizar que tus datos estén siempre protegidos bajo estándares de seguridad bancaria.
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            {/* Mobile Bottom Nav */}
            <nav
                className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50 flex items-center justify-around px-2 py-2"
                style={{ borderColor: '#f0dde3' }}
            >
                <Link href="/dashboard" className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all" style={{ color: '#7a5060' }}>
                    <LayoutDashboard size={20} />
                    <span className="text-[10px] font-semibold">Eventos</span>
                </Link>
                <Link href="/dashboard/nuevo" className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all" style={{ color: '#7a5060' }}>
                    <PlusCircle size={20} />
                    <span className="text-[10px] font-semibold">Crear</span>
                </Link>
                <Link href="/dashboard/cuenta" className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all" style={{ color: '#7B2D8B' }}>
                    <User size={20} />
                    <span className="text-[10px] font-semibold">Cuenta</span>
                </Link>
                <button
                    onClick={handleSignOut}
                    className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl text-red-400"
                >
                    <LogOut size={20} />
                    <span className="text-[10px] font-semibold">Salir</span>
                </button>
            </nav>
        </div>
    );
}
