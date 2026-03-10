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
        <div className="min-h-screen bg-[#fdfafc] flex flex-col md:flex-row">
            {/* Minimal Sidebar for Account */}
            <aside className="w-full md:w-64 border-r bg-white h-auto md:h-screen p-6 flex flex-col gap-8">
                <Link href="/dashboard" className="group inline-block">
                    <img
                        src="/logo.png"
                        alt="EncantIA"
                        style={{
                            height: '52px',
                            width: 'auto',
                            filter: 'drop-shadow(0 2px 6px rgba(163,93,106,0.3))'
                        }}
                        className="group-hover:scale-105 transition-transform duration-300"
                    />
                </Link>

                <nav className="flex flex-col gap-2">
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#7a5060] hover:bg-rose-50 transition-colors">
                        <LayoutDashboard size={18} /> Mis Eventos
                    </Link>
                    <Link href="/dashboard/nuevo" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#7a5060] hover:bg-rose-50 transition-colors">
                        <PlusCircle size={18} /> Crear Evento
                    </Link>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-rose-50 text-[#7B2D8B]">
                        <User size={18} /> Mi Cuenta
                    </div>
                </nav>

                <div className="mt-auto pt-6 border-t flex flex-col gap-4">
                    <button onClick={handleSignOut} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-50 hover:text-red-600 transition-all">
                        <LogOut size={16} /> Cerrar sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-12 overflow-y-auto">
                <div className="max-w-2xl mx-auto">
                    <header className="mb-10">
                        <h1 className="text-3xl font-bold text-[#2d1b2d] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Configuración de Cuenta</h1>
                        <p className="text-[#7a5060] text-sm">Gestiona tus datos personales y suscripción.</p>
                    </header>

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
                                <div className="flex items-center justify-between p-4 rounded-2xl border-2 border-dashed border-purple-100 bg-purple-50/20">
                                    <div>
                                        <p className="text-sm font-bold text-purple-700">Plan Gratuito (Básico)</p>
                                        <p className="text-xs text-purple-500/80">Vigente indefinidamente</p>
                                    </div>
                                    <Link href="/planes" className="px-6 py-2 rounded-full bg-purple-600 text-white text-xs font-bold shadow-lg shadow-purple-200 hover:bg-purple-700 transition-all">
                                        Mejorar Plan
                                    </Link>
                                </div>
                                <div className="mt-6 flex items-center justify-around text-center">
                                    <div>
                                        <p className="text-2xl font-bold text-[#2d1b2d]">{eventCount}</p>
                                        <p className="text-[10px] uppercase font-bold text-gray-400">Eventos Activos</p>
                                    </div>
                                    <div className="w-px h-10 bg-gray-100" />
                                    <div>
                                        <p className="text-2xl font-bold text-[#2d1b2d]">Ilimitado</p>
                                        <p className="text-[10px] uppercase font-bold text-gray-400">Invitados RSVP</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Security */}
                        <section className="bg-white rounded-3xl border border-[#f0dde3] overflow-hidden shadow-sm">
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
        </div>
    );
}
