'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-browser';
import {
    LayoutDashboard, PlusCircle, User, LogOut, Eye, Pencil, Users,
    Calendar, MapPin, PartyPopper, Loader2, Search, X, Menu, Palette, Settings, Shield, Heart, Crown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ─────────────────────────────────────────────────────────────────
interface UserProfile {
    id: string;
    email?: string;
    user_metadata?: { full_name?: string; name?: string };
}

interface Event {
    id: string;
    title: string;
    event_type: string;
    event_date: string;
    venue: string;
    is_published: boolean;
    slug: string;
    created_at: string;
    views: number;
    guests_count?: number;
    plan?: string;
}

// ─── Sidebar ───────────────────────────────────────────────────────────────
function Sidebar({
    user,
    onSignOut,
    activeItem,
    eventsCount = 0,
    profile
}: {
    user: any;
    onSignOut: () => void;
    activeItem: string;
    eventsCount?: number;
    profile?: any;
}) {
    const name = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || 'Usuario';
    const firstName = name.split(' ')[0];

    const navItems = [
        { id: 'events', href: '/dashboard', icon: LayoutDashboard, label: 'Mis Eventos' },
        { id: 'templates', href: '/dashboard/plantillas', icon: Palette, label: 'Plantillas' },
        { id: 'invitados', href: '/dashboard/invitados', icon: Users, label: 'Invitados' },
        { id: 'account', href: '/dashboard/cuenta', icon: User, label: 'Mi Cuenta' },
        { id: 'security', href: '/dashboard/security', icon: Shield, label: 'Seguridad' },
    ];

    const sidebarContent = (
        <div className="flex flex-col h-full text-[#7a5060]" style={{ background: 'linear-gradient(to bottom, #FEFAF8, #FDF5F2)' }}>
            {/* Logo */}
            <div className="px-6 pt-10 pb-5 flex flex-col items-center">
                <img src="/logo.png" className="h-10 w-auto object-contain" alt="EncantIA" />
                <div className="w-full border-t border-dotted border-[#f0dde3] mt-4" />
            </div>

            {/* User Info */}
            <div className="px-6 py-5 flex flex-col items-center text-center gap-2 border-b border-[#f0dde3]/60 mb-2">
                <div className="w-14 h-14 rounded-full bg-rose-50 shadow-sm flex items-center justify-center border-2 border-[#f0dde3] overflow-hidden mb-1">
                    <div className="w-full h-full bg-gradient-to-br from-[#a35d6a] to-[#7B2D8B] flex items-center justify-center text-white font-black text-lg">
                        {firstName[0].toUpperCase()}
                    </div>
                </div>
                <div>
                    <h2 className="text-xs font-black text-[#2d1b2d] tracking-tight uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>{name}</h2>
                    <p className="text-[9px] font-bold text-[#a35d6a] uppercase tracking-widest mt-0.5">Panel de Control</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 space-y-1">
                {navItems.map(({ id, href, icon: Icon, label }) => (
                    <Link
                        key={id}
                        href={href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                            activeItem === id 
                            ? 'bg-[#FDF0F3] text-[#a35d6a] border-l-4 border-[#a35d6a]' 
                            : 'text-[#7a5060] hover:bg-[#FDF0F3]/50 hover:text-[#a35d6a]'
                        }`}
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        <Icon size={18} />
                        {label}
                        {id === 'events' && eventsCount > 0 && (
                          <span className="ml-auto text-[8px] bg-[#a35d6a]/10 text-[#a35d6a] px-2 py-0.5 rounded-full font-black">
                            {eventsCount}
                          </span>
                        )}
                        {id === 'templates' && (
                          <span className="ml-auto text-[7px] bg-[#a35d6a] text-white px-1.5 py-0.5 rounded-full font-black uppercase">
                            NUEVO
                          </span>
                        )}
                    </Link>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 mt-auto border-t border-[#f0dde3] space-y-3">
                <div className="bg-white border border-[#f0dde3] p-3 rounded-2xl shadow-sm text-center">
                    <p className="text-[9px] font-bold text-[#7a5060]/70 uppercase tracking-widest">Plan Actual</p>
                    <p className="text-xs font-black text-[#a35d6a] mt-0.5">
                        {profile?.role === 'admin' ? '⭐ Admin' : profile?.plan || 'Free'}
                    </p>
                    <button className="text-[9px] font-black text-[#7a5060]/50 underline mt-2 hover:text-[#a35d6a] transition-all">Ver beneficios</button>
                </div>

                <button
                    onClick={onSignOut}
                    className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-bold bg-white hover:bg-rose-50/50 border border-[#f0dde3] text-[#a35d6a] transition-all shadow-sm"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    <LogOut size={16} />
                    Cerrar sesión
                </button>
            </div>
        </div>
    );

    return (
        <aside className="hidden md:flex flex-col w-64 border-r shrink-0 z-30 overflow-y-auto bg-[#FEFAF8]" style={{ borderColor: '#f0dde3' }}>
            {sidebarContent}
        </aside>
    );
}

// ─── Event Card ────────────────────────────────────────────────────────────
function EventCard({ event, profile }: { event: Event, profile: any }) {
    try {
        const typeColors: Record<string, string> = {
            Boda: '#a35d6a',
            'XV Años': '#7B2D8B',
            Bautizo: '#6b9bb8',
            'Baby Shower': '#e8a0b0',
            Comunión: '#c8976a',
        };
        const color = typeColors[event.event_type] || '#7a5060';

        let formattedDate = '—';
        try {
            if (event.event_date) {
                const date = new Date(event.event_date + 'T00:00:00');
                if (!isNaN(date.getTime())) {
                    formattedDate = date.toLocaleDateString('es-MX', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                    });
                }
            }
        } catch (e) {
            console.warn('Error formateando fecha:', e);
        }

        let daysLeft = 0;
        try {
            if (event.event_date) {
                const target = new Date(event.event_date + 'T00:00:00');
                const diff = target.getTime() - Date.now();
                daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
            }
        } catch (e) {}

        return (
            <div className="group rounded-[1.5rem] overflow-hidden bg-white border border-[#f0dde3] shadow-[0_20px_60px_rgba(163,93,106,0.08)] hover:shadow-[0_30px_70px_rgba(163,93,106,0.15)] hover:-translate-y-1.5 transition-all duration-500 flex flex-col h-full">
                {/* ── IMAGE HEADER ────────────────────────────────────────── */}
                <div 
                    className="h-56 relative bg-cover bg-center shrink-0"
                    style={{ 
                        backgroundImage: (event as any).cover_image_url 
                            ? `url(${(event as any).cover_image_url})` 
                            : `linear-gradient(135deg, #a35d6a 0%, ${color} 100%)` 
                    }}
                >
                    {/* Dark gradient shadow mesh to overlap title readable */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70" />

                    {/* Fallback Icon if no image */}
                    {!(event as any).cover_image_url && (
                        <div className="absolute inset-0 flex items-center justify-center text-white/20">
                            {event.event_type === 'Boda' ? <Heart size={64} /> : event.event_type === 'XV Años' ? <Crown size={64} /> : <PartyPopper size={64} />}
                        </div>
                    )}
                    
                    {/* Float Badges */}
                    <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
                        <div className="flex gap-1.5 flex-wrap">
                            <span className="text-[8px] font-black px-2 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/5 text-white uppercase tracking-widest">
                                {event.event_type}
                            </span>
                            {(() => {
                                const isAdmin = profile?.role === 'admin';
                                const p = isAdmin ? 'diamante' : (event.plan || 'prueba');
                                let config = {
                                    prueba: { label: 'Prueba', bg: 'bg-white/20 border-white/10 text-white' },
                                    plata: { label: 'Plata', bg: 'bg-slate-500/40 border-white/10 text-white' },
                                    oro: { label: 'Oro', bg: 'bg-amber-500/40 border-white/10 text-amber-100' },
                                    diamante: { label: 'Diamante', bg: 'bg-purple-500/40 border-white/10 text-purple-100' }
                                }[p as 'prueba'|'plata'|'oro'|'diamante'] || { label: 'Prueba', bg: 'bg-white/20 border-white/10 text-white' };

                                if (isAdmin) {
                                    config = { label: 'Admin', bg: 'bg-gradient-to-r from-[#a35d6a] to-[#7B2D8B] text-white' };
                                }
                                return (
                                    <span className={`text-[8px] font-black px-2 py-1 rounded-full backdrop-blur-md border uppercase tracking-widest ${config.bg}`}>
                                        {config.label}
                                    </span>
                                );
                            })()}
                        </div>
                        <span className={`text-[8px] font-black px-2 py-1 rounded-full backdrop-blur-md border uppercase tracking-widest ${event.is_published ? 'bg-emerald-500/40 border-emerald-400/30 text-emerald-50' : 'bg-gray-500/40 border-gray-400/30 text-gray-50'}`}>
                            {event.is_published ? 'Pública' : 'Borrador'}
                        </span>
                    </div>

                    {/* Title inside absolute overlay over picture */}
                    <div className="absolute bottom-4 inset-x-0 px-5 z-20">
                        <h3 className="font-black text-white text-xl leading-tight truncate uppercase tracking-tight" 
                            style={{ fontFamily: "'Playfair Display', serif", textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                            {event.title || 'Sin Título'}
                        </h3>
                    </div>
                </div>

                {/* ── CARD BODY ────────────────────────────────────────────── */}
                <div className="p-5 flex flex-col flex-1 bg-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3 text-[10px] text-[#7a5060]/70 font-light tracking-wide">
                            <div className="flex items-center gap-1"><Calendar size={11} className="text-[#a35d6a]" /> {formattedDate}</div>
                            <div className="flex items-center gap-1"><Eye size={11} className="text-[#a35d6a]" /> {event.views || 0}</div>
                        </div>
                        {daysLeft > 0 && (
                            <span className="text-[8px] font-black px-2 py-0.5 rounded-full bg-rose-50 text-[#a35d6a] border border-rose-100 uppercase tracking-widest">
                                Faltan {daysLeft} días
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-2 mt-auto">
                        <div className="flex gap-2">
                            <Link
                                href={`/editor/${event.id}`}
                                className="flex-1 flex items-center justify-center gap-1.5 text-[10px] font-black uppercase py-2.5 rounded-xl bg-gradient-to-r from-[#a35d6a] to-[#7B2D8B] text-white shadow-lg shadow-rose-500/10 tracking-widest hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                <Pencil size={11} /> Editar Diseño
                            </Link>
                            <Link
                                href={`/dashboard/rsvp/${event.id}`}
                                className="flex-1 flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase py-2.5 rounded-xl border border-[#f0dde3] text-[#7a5060] tracking-widest hover:bg-rose-50 hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                <Users size={11} /> Invitados
                            </Link>
                        </div>
                        <Link
                            href={`/${event.slug}`}
                            target="_blank"
                            className="text-center text-[9px] text-[#a35d6a]/70 hover:text-[#a35d6a] underline font-bold mt-1 tracking-wider"
                        >
                            Previsualizar Invitación
                        </Link>
                    </div>
                </div>
            </div>
        );
    } catch (err) {
        return (
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-800 text-xs">
                <p className="font-bold">Error en tarjeta:</p>
                <p className="opacity-80">{(err as any).message || 'Desconocido'}</p>
            </div>
        );
    }
}

// ─── Empty State ───────────────────────────────────────────────────────────
function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-28 text-center px-4">
            <div
                className="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-md"
                style={{ background: 'linear-gradient(135deg, #fdfafc, #f0dde3)' }}
            >
                <svg className="w-12 h-12 text-[#a35d6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            </div>
            <h3
                className="text-2xl font-black text-[#2d1b2d] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
            >
                Aún no tienes eventos creados
            </h3>
            <p className="text-[#7a5060] text-sm mb-10 max-w-sm text-center font-medium">
                Crea tu primera invitación digital para sorprender a todos.
            </p>
            <Link
                href="/dashboard/plantillas"
                className="inline-flex items-center gap-2 text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all hover:scale-105 shadow-xl hover:shadow-rose-500/20 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #a35d6a, #7B2D8B)' }}
            >
                <PlusCircle size={16} /> Crear mi primera invitación
            </Link>
        </div>
    );
}

// ─── Dashboard Page ─────────────────────────────────────────────────────────
export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [profile, setProfile] = useState<any>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [eventsLoading, setEventsLoading] = useState(true);
    const [search, setSearch] = useState('');

    const loadEvents = useCallback(async (userId: string) => {
        setEventsLoading(true);
        console.log('Cargando eventos para:', userId);
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*, guests(count)')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error de Supabase:', error);
                throw error;
            }
            console.log('Eventos recibidos:', data?.length || 0);
            if (data) {
                const mappedEvents = data.map((e: any) => ({
                    ...e,
                    guests_count: e.guests?.[0]?.count || 0
                }));
                setEvents(mappedEvents);
            }
        } catch (err: any) {
            console.error('Fallo total al cargar eventos:', err);
        } finally {
            setEventsLoading(false);
        }
    }, []);

    useEffect(() => {
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            console.log('Sesión actual:', session?.user?.id);
            if (!session) {
                router.replace('/login');
                return;
            }
            setUser(session.user as UserProfile);
            
            try {
                const { data } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                if (data) {
                    setProfile(data);
                }
            } catch (err) {
                console.warn('Error cargando perfil:', err);
            }

            setLoading(false);
            loadEvents(session.user.id);
        });
    }, [router, loadEvents]);

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

    const firstName =
        (user.user_metadata?.full_name || user.user_metadata?.name || user.email || 'Usuario')
            .split(' ')[0];

    return (
        <div className="min-h-screen flex bg-[#fdfafc] relative overflow-hidden">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&display=swap');
                
                @keyframes float-petal {
                    0% { transform: translateY(100px) rotate(0deg); opacity: 0; }
                    20% { opacity: 0.08; }
                    80% { opacity: 0.08; }
                    100% { transform: translateY(-500px) rotate(45deg); opacity: 0; }
                }

                .animate-petal-slow {
                    animation: float-petal 15s linear infinite;
                }
                .animate-petal-fast {
                    animation: float-petal 10s linear infinite;
                    animation-delay: 3s;
                }
            `}</style>

            {/* ── ANIMATED PETALS ── */}
            <svg className="absolute bottom-0 right-1/4 w-12 h-12 text-[#a35d6a] -z-10 animate-petal-slow pointer-events-none" fill="currentColor" viewBox="0 0 100 100">
                <path d="M50 0 C70 15, 85 35, 80 60 C75 80, 50 90, 40 70 C30 50, 25 20, 50 0 Z" />
            </svg>
            <svg className="absolute bottom-20 left-1/3 w-8 h-8 text-[#a35d6a] -z-10 animate-petal-fast pointer-events-none" fill="currentColor" viewBox="0 0 100 100">
                <path d="M50 0 C70 15, 85 35, 80 60 C75 80, 50 90, 40 70 C30 50, 25 20, 50 0 Z" />
            </svg>

            {/* ── BACKGROUND PETALS ── */}
            <svg className="absolute -top-10 -right-10 -z-10 opacity-[0.03] text-[#a35d6a] w-72 h-72 rotate-45" fill="currentColor" viewBox="0 0 100 100">
                <path d="M50 0 C70 15, 85 35, 80 60 C75 80, 50 90, 40 70 C30 50, 25 20, 50 0 Z" />
            </svg>
            <svg className="absolute bottom-20 left-48 -z-10 opacity-[0.02] text-[#a35d6a] w-96 h-96 -rotate-12" fill="currentColor" viewBox="0 0 100 100">
                <path d="M50 0 C70 15, 85 35, 80 60 C75 80, 50 90, 40 70 C30 50, 25 20, 50 0 Z" />
            </svg>
            <svg className="absolute top-1/2 right-4 -z-10 opacity-[0.02] text-[#a35d6a] w-64 h-64 rotate-180" fill="currentColor" viewBox="0 0 100 100">
                <path d="M50 0 C70 15, 85 35, 80 60 C75 80, 50 90, 40 70 C30 50, 25 20, 50 0 Z" />
            </svg>

            {/* ── BACKGROUND GLOWS ── */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#a35d6a] rounded-full filter blur-[100px] opacity-[0.06] -z-10 translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-[250px] w-[600px] h-[600px] bg-[#7B2D8B] rounded-full filter blur-[120px] opacity-[0.05] -z-10 -translate-x-1/4 translate-y-1/4" />
            <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-[#f0dde3] rounded-full filter blur-[80px] opacity-[0.08] -z-10 -translate-x-1/2 -translate-y-1/2" />

            <Sidebar 
                user={user} 
                onSignOut={handleSignOut} 
                activeItem="events" 
                eventsCount={events.length}
                profile={profile}
            />

            {/* Main content */}
            <main className="flex-1 overflow-y-auto pb-20 md:pb-0 px-6 py-8">
                {/* ── HERO BANNER ── */}
                <div className="relative overflow-hidden rounded-[2rem] mb-8 p-8 md:p-10"
                  style={{ 
                    background: 'linear-gradient(135deg, #fdf0f3 0%, #fce8f0 50%, #f5e0ec 100%)',
                    border: '1px solid #f0dde3',
                    boxShadow: '0 20px 60px rgba(163,93,106,0.08)'
                  }}>
                  
                  {/* Ornamento floral SVG top right */}
                  <svg className="absolute top-0 right-0 opacity-10 w-48 h-48" viewBox="0 0 200 200" fill="none">
                    <circle cx="160" cy="40" r="60" fill="#a35d6a"/>
                    <circle cx="180" cy="80" r="40" fill="#7B2D8B"/>
                    <circle cx="140" cy="20" r="30" fill="#f0dde3"/>
                  </svg>
                  
                  {/* Ornamento bottom left */}
                  <svg className="absolute bottom-0 left-0 opacity-[0.06] w-40 h-40" viewBox="0 0 200 200" fill="none">
                    <circle cx="40" cy="160" r="80" fill="#a35d6a"/>
                  </svg>

                  <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-[2px] bg-[#a35d6a] opacity-40 rounded-full"/>
                        <p className="text-[#a35d6a] text-[10px] uppercase tracking-[0.4em] font-black opacity-70">
                          Bienvenido de vuelta
                        </p>
                      </div>
                      <h1 className="text-4xl md:text-5xl font-black text-[#2d1b2d] mb-2 leading-none"
                        style={{ fontFamily: "'Playfair Display', serif" }}>
                        {profile?.full_name?.split(' ')[0] || firstName}
                      </h1>
                      <p className="text-[#a35d6a] text-sm italic font-light tracking-wide opacity-80">
                        ✨ Crea momentos mágicos que duran para siempre
                      </p>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="bg-white rounded-2xl px-5 py-4 text-center flex flex-col items-center gap-1 min-w-[90px]"
                        style={{ boxShadow: '0 4px 20px rgba(163,93,106,0.1)', border: '1px solid #f0dde3' }}>
                        <p className="text-[#a35d6a]/50 text-[8px] uppercase tracking-[0.3em] font-black">Eventos</p>
                        <p className="text-[#2d1b2d] font-black text-3xl leading-none"
                          style={{ fontFamily: "'Playfair Display', serif" }}>{events.length}</p>
                      </div>
                      <div className="bg-white rounded-2xl px-5 py-4 text-center flex flex-col items-center gap-1 min-w-[90px]"
                        style={{ boxShadow: '0 4px 20px rgba(163,93,106,0.1)', border: '1px solid #f0dde3' }}>
                        <p className="text-[#a35d6a]/50 text-[8px] uppercase tracking-[0.3em] font-black">Publicados</p>
                        <p className="text-[#2d1b2d] font-black text-3xl leading-none"
                          style={{ fontFamily: "'Playfair Display', serif" }}>{events.filter(e => e.is_published).length}</p>
                      </div>
                      <div className="bg-gradient-to-br from-[#a35d6a] to-[#7B2D8B] rounded-2xl px-5 py-4 text-center flex flex-col items-center gap-1 min-w-[90px]"
                        style={{ boxShadow: '0 8px 25px rgba(163,93,106,0.35)' }}>
                        <p className="text-white/60 text-[8px] uppercase tracking-[0.3em] font-black">Plan</p>
                        <p className="text-white font-black text-sm uppercase tracking-wider leading-none mt-1">
                          {profile?.role === 'admin' ? '⭐ Admin' : profile?.plan || 'Free'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="px-4 md:px-8 py-5 md:py-8">
                    {/* ── SEARCH & FILTERS ──── */}
                    <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex items-center gap-3 mb-8 flex-wrap">
                            <div className="relative w-full md:max-w-md">
                                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar tu invitación..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 rounded-full border bg-white outline-none focus:ring-4 focus:ring-[#a35d6a]/10 focus:border-[#a35d6a] transition-all text-sm shadow-sm placeholder-[#7a5060]/40 text-[#2d1b2d]"
                                    style={{ borderColor: '#f0dde3' }}
                                />
                                {search && (
                                    <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 bg-white px-4 py-2 rounded-full border shadow-sm" style={{ borderColor: '#f0dde3' }}>
                                {events.filter(e => (e.title || '').toLowerCase().includes((search || '').toLowerCase()) || (e.event_type || '').toLowerCase().includes((search || '').toLowerCase())).length} RESULTADOS
                            </div>
                        </div>

                        <Link
                            href="/dashboard/plantillas"
                            className="flex items-center gap-2 text-white bg-gradient-to-r from-[#a35d6a] to-[#7B2D8B] px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:scale-105 shadow-[0_8px_30px_rgba(163,93,106,0.3)] animate-pulse hover:animate-none flex-shrink-0 mb-4 md:mb-0"
                        >
                            <span>✨</span>
                            Crear nueva invitación
                        </Link>
                    </div>

                        {eventsLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-white rounded-2xl border p-6 flex flex-col gap-4 shadow-sm" style={{ borderColor: '#f0dde3' }}>
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1 space-y-2">
                                                <div className="h-5 w-3/4 skeleton-pulse rounded-lg" />
                                                <div className="h-4 w-1/4 skeleton-pulse rounded-full" />
                                            </div>
                                            <div className="h-6 w-20 skeleton-pulse rounded-full" />
                                        </div>
                                        <div className="space-y-2 py-2">
                                            <div className="h-3 w-1/2 skeleton-pulse rounded" />
                                            <div className="h-3 w-2/3 skeleton-pulse rounded" />
                                        </div>
                                        <div className="flex gap-2 pt-4 border-t" style={{ borderColor: '#f0dde3' }}>
                                            <div className="h-9 flex-1 skeleton-pulse rounded-lg" />
                                            <div className="h-9 flex-1 skeleton-pulse rounded-lg" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : events.length === 0 ? (
                            <EmptyState />
                        ) : (
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                 {events
                                     .filter(e => (e.title || '').toLowerCase().includes((search || '').toLowerCase()) || (e.event_type || '').toLowerCase().includes((search || '').toLowerCase()))
                                     .map((event) => (
                                         <div key={event.id} className="w-full">
                                             <EventCard event={event} profile={profile} />
                                         </div>
                                     ))}
                             </div>
                        )}
                </div>
            </main>

            {/* Mobile Bottom Nav */}
            <nav
                className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50 flex items-center justify-around px-2 py-2"
                style={{ borderColor: '#f0dde3' }}
            >
                <Link href="/dashboard" className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl" style={{ color: '#7B2D8B' }}>
                    <LayoutDashboard size={20} />
                    <span className="text-[10px] font-semibold">Eventos</span>
                </Link>
                <Link href="/dashboard/plantillas" className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl" style={{ color: '#7a5060' }}>
                    <Palette size={20} />
                    <span className="text-[10px] font-semibold">Plantillas</span>
                </Link>
                <Link href="/dashboard/nuevo" className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl" style={{ color: '#7a5060' }}>
                    <PlusCircle size={20} />
                    <span className="text-[10px] font-semibold">Crear</span>
                </Link>
                <Link href="/dashboard/cuenta" className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl" style={{ color: '#7a5060' }}>
                    <User size={20} />
                    <span className="text-[10px] font-semibold">Cuenta</span>
                </Link>
                <button onClick={handleSignOut} className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl text-red-400">
                    <LogOut size={20} />
                    <span className="text-[10px] font-semibold">Salir</span>
                </button>
            </nav>
        </div>
    );
}
