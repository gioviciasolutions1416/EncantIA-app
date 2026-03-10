'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-browser';
import {
    User, Mail, Shield, CreditCard, LogOut, ArrowLeft, Loader2, CheckCircle2,
    Calendar, LayoutDashboard, PlusCircle, Sparkles, Settings
} from 'lucide-react';
import { motion } from 'framer-motion';
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
                    className="relative overflow-hidden px-5 md:px-8 pt-10 pb-12"
                    style={{ background: 'linear-gradient(135deg, #2d1b2d 0%, #7B2D8B 50%, #a35d6a 100%)' }}
                >
                    {/* Decorative elements */}
                    <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10 bg-white blur-3xl" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-10 bg-white blur-3xl" />

                    <div className="relative max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex flex-col gap-2 text-center md:text-left">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/80 text-[10px] font-black uppercase tracking-widest w-fit mx-auto md:mx-0">
                                <Settings size={10} /> Panel de Usuario
                            </span>
                            <h1
                                className="text-3xl md:text-4xl font-black text-white"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                Mi Perfil
                            </h1>
                            <p className="text-white/70 text-sm md:text-base max-w-md">
                                Revisa tu información, gestiona tu plan y mantén tu cuenta segura.
                            </p>
                        </div>
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 text-[#7B2D8B] bg-white px-6 py-3 rounded-full font-black text-sm transition-all hover:scale-105 shadow-2xl active:scale-95 flex-shrink-0"
                        >
                            <ArrowLeft size={16} />
                            Volver al Dashboard
                        </Link>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 md:px-8 py-10 md:py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Profile Main Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="lg:col-span-1"
                        >
                            <div className="bg-white rounded-[2rem] border p-8 flex flex-col items-center text-center shadow-xl shadow-rose-100/30 overflow-hidden relative" style={{ borderColor: '#f0dde3' }}>
                                {/* Decorative background */}
                                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-rose-50 to-purple-50" />

                                <div className="relative mt-4 mb-6">
                                    <div className="w-24 h-24 rounded-[2rem] bg-white p-1.5 shadow-xl rotate-3">
                                        <div className="w-full h-full rounded-[1.6rem] flex items-center justify-center text-white text-3xl font-black shadow-inner -rotate-3" style={{ background: 'linear-gradient(135deg, #a35d6a, #7B2D8B)' }}>
                                            {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white p-1 shadow-lg">
                                        <div className="w-full h-full rounded-full bg-green-500 border-2 border-white" />
                                    </div>
                                </div>

                                <h2 className="text-xl font-black text-[#2d1b2d] break-all leading-tight">
                                    {user.user_metadata?.full_name || user.user_metadata?.name || 'Usuario'}
                                </h2>
                                <p className="text-xs font-medium text-[#7a5060] mt-1 opacity-60">Cliente Premium</p>

                                <div className="grid grid-cols-2 gap-4 w-full mt-8 border-t pt-8" style={{ borderColor: '#f9f0f3' }}>
                                    <div className="text-center">
                                        <p className="text-2xl font-black text-[#7B2D8B]">{eventCount}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Eventos</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-black text-[#a35d6a]">1</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Suscripción</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Settings Sections */}
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            {/* Personal Info */}
                            <motion.section
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-[2rem] border p-8 md:p-10 shadow-sm"
                                style={{ borderColor: '#f0dde3' }}
                            >
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center text-[#a35d6a]">
                                        <User size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#2d1b2d]" style={{ fontFamily: "'Playfair Display', serif" }}>Información Personal</h3>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex flex-col gap-1.5 border-b pb-4" style={{ borderColor: '#f9f0f3' }}>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nombre Completo</p>
                                        <p className="text-sm font-semibold text-[#2d1b2d]">{user.user_metadata?.full_name || user.user_metadata?.name || '—'}</p>
                                    </div>
                                    <div className="flex flex-col gap-1.5 border-b pb-4" style={{ borderColor: '#f9f0f3' }}>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Correo Electrónico</p>
                                        <p className="text-sm font-semibold text-[#2d1b2d]">{user.email}</p>
                                    </div>
                                </div>
                            </motion.section>

                            {/* Plan & Security */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
                                {/* Plan Card */}
                                <div className="bg-white rounded-[2rem] border p-8 shadow-sm flex flex-col justify-between" style={{ borderColor: '#f0dde3' }}>
                                    <div>
                                        <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-[#7B2D8B] mb-6">
                                            <CreditCard size={20} />
                                        </div>
                                        <h3 className="text-lg font-bold text-[#2d1b2d] mb-1">Plan Actual</h3>
                                        <p className="text-2xl font-black text-[#7B2D8B]">Gratis</p>
                                        <p className="text-xs text-[#7a5060]/60 mt-2 leading-relaxed">Limitado a 1 evento activo. Obtén más con Premium.</p>
                                    </div>
                                    <button className="w-full mt-6 py-3 rounded-full bg-[#2d1b2d] text-white text-xs font-black shadow-lg hover:scale-105 transition-all">Mejorar Plan</button>
                                </div>

                                {/* Security Card */}
                                <div className="bg-white rounded-[2rem] border p-8 shadow-sm flex flex-col justify-between" style={{ borderColor: '#f0dde3' }}>
                                    <div>
                                        <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6">
                                            <Shield size={20} />
                                        </div>
                                        <h3 className="text-lg font-bold text-[#2d1b2d] mb-1">Seguridad</h3>
                                        <p className="text-xs text-[#7a5060]/60 mt-1 leading-relaxed">Tu cuenta está protegida con autenticación de Supabase.</p>
                                    </div>
                                    <button className="w-full mt-6 py-3 rounded-full border border-gray-200 text-[#2d1b2d] text-xs font-black hover:bg-gray-50 transition-all">Cambiar Clave</button>
                                </div>
                            </motion.div>
                        </div>
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
