'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-browser';
import {
    LayoutDashboard, PlusCircle, User, LogOut, Eye, Pencil, Users,
    Calendar, MapPin, PartyPopper, Loader2, Search, X, Menu, Palette, Settings, Shield
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
}: {
    user: any;
    onSignOut: () => void;
    activeItem: string;
}) {
    const name = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || 'Usuario';
    const firstName = name.split(' ')[0];

    const navItems = [
        { id: 'events', href: '/dashboard', icon: LayoutDashboard, label: 'Mis Eventos' },
        { id: 'templates', href: '/dashboard/templates', icon: Palette, label: 'Plantillas' },
        { id: 'rsvp', href: '/dashboard/rsvp', icon: Users, label: 'Invitados' },
        { id: 'account', href: '/dashboard/cuenta', icon: User, label: 'Mi Cuenta' },
        { id: 'security', href: '/dashboard/security', icon: Shield, label: 'Seguridad' },
    ];

    const sidebarContent = (
        <div className="flex flex-col h-full bg-[#fdfaf8]">
            {/* Header/User Info */}
            <div className="px-6 py-10 flex flex-col items-center text-center gap-2">
                <div className="w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center border-4 border-rose-50 overflow-hidden mb-2">
                    <div className="w-full h-full bg-gradient-to-tr from-[#a35d6a] to-[#7B2D8B] flex items-center justify-center text-white font-black text-xl">
                        {firstName[0].toUpperCase()}
                    </div>
                </div>
                <div>
                    <h2 className="text-sm font-black text-[#2d1b2d] tracking-tight uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>{name}</h2>
                    <p className="text-[9px] font-bold text-[#a35d6a]/60 uppercase tracking-[0.2em] mt-0.5">Administrador</p>
                </div>
                </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1.5">
                {navItems.map(({ id, href, icon: Icon, label }) => (
                    <Link
                        key={id}
                        href={href}
                        className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                            activeItem === id 
                            ? 'bg-rose-100 text-[#a35d6a] shadow-[0_10px_20px_-5px_rgba(163,93,106,0.15)] border-r-4 border-[#a35d6a]' 
                            : 'text-[#7a5060]/70 hover:bg-rose-50 hover:text-[#a35d6a]'
                        }`}
                    >
                        <Icon size={16} />
                        {label}
                    </Link>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 mt-auto">
                <button
                    onClick={onSignOut}
                    className="flex items-center justify-center gap-3 w-full px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] bg-white border border-rose-100 text-red-400 hover:bg-red-50 hover:text-red-600 transition-all shadow-sm"
                >
                    <LogOut size={16} />
                    Cerrar sesión
                </button>
                <div className="mt-4 text-center">
                    <p className="text-[8px] font-bold text-[#7a5060]/30 uppercase tracking-widest">EncantIA v2.4.0</p>
                </div>
            </div>
        </div>
    );

    return (
        <aside className="hidden md:flex flex-col w-64 border-r shrink-0 z-30 overflow-y-auto" style={{ borderColor: '#f0dde3' }}>
            {sidebarContent}
        </aside>
    );
}

// ─── Event Card ────────────────────────────────────────────────────────────
function EventCard({ event }: { event: Event }) {
    const typeColors: Record<string, string> = {
        Boda: '#a35d6a',
        'XV Años': '#7B2D8B',
        Bautizo: '#6b9bb8',
        'Baby Shower': '#e8a0b0',
        Comunión: '#c8976a',
    };
    const color = typeColors[event.event_type] || '#7a5060';

    const formattedDate = event.event_date
        ? new Date(event.event_date + 'T00:00:00').toLocaleDateString('es-MX', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
        : '—';

    return (
        <div
        className="group bg-white rounded-3xl border p-4 flex flex-col gap-4 hover:shadow-[0_20px_40px_-15px_rgba(163,93,106,0.15)] transition-all relative overflow-hidden active:scale-[0.98]"
        style={{ borderColor: '#f0dde3' }}
    >
        {/* Minimal Preview Image / Placeholder */}
        <div className="w-full aspect-[16/7] rounded-2xl overflow-hidden relative bg-gray-50 border border-gray-100/50">
            {(event as any).cover_image_url ? (
                <img src={(event as any).cover_image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Preview" />
            ) : (
                <div className="w-full h-full flex items-center justify-center opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700" style={{ background: `linear-gradient(135deg, ${color}33, ${color}11)` }}>
                    <PartyPopper size={32} style={{ color }} />
                </div>
            )}
            <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-black/5 uppercase tracking-tighter" style={{ color }}>{event.event_type}</span>
                
                {(() => {
                    const p = event.plan || 'prueba';
                    const config = {
                        prueba: { label: 'Prueba', bg: 'bg-gray-100 text-gray-600' },
                        basico: { label: 'Plata', bg: 'bg-slate-100 text-slate-700 font-bold' },
                        rsvp: { label: 'Oro', bg: 'bg-amber-50 text-amber-600 border border-amber-200' },
                        diamante: { label: 'Diamante', bg: 'bg-purple-50 text-purple-600 border border-purple-200' }
                    }[p as 'prueba'|'basico'|'rsvp'|'diamante'] || { label: 'Prueba', bg: 'bg-gray-100 text-gray-600' };

                    return (
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm border border-black/5 uppercase tracking-tighter backdrop-blur-md ${config.bg}`}>
                            {config.label}
                        </span>
                    );
                })()}
            </div>
            <div className="absolute top-3 right-3">
                <span className="text-[9px] font-black px-2 py-1 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-black/5 uppercase tracking-tighter" style={{ color: event.is_published ? '#059669' : '#d97706' }}>
                    {event.is_published ? '✓ Pública' : '• Borrador'}
                </span>
            </div>
        </div>

        {/* Info */}
        <div className="flex items-start justify-between gap-3 px-1">
            <div className="flex-1 min-w-0">
                <h3 className="font-black text-[#2d1b2d] text-sm leading-tight truncate mb-1 uppercase tracking-tight">{event.title || 'Sin Título'}</h3>
                <div className="flex items-center gap-3 text-[10px] text-[#7a5060]/70 font-bold uppercase tracking-wider">
                    <div className="flex items-center gap-1"><Calendar size={10} /> {formattedDate}</div>
                    <div className="flex items-center gap-1"><Eye size={10} /> {event.views || 0}</div>
                    <div className="flex items-center gap-1 text-[#7B2D8B]"><Users size={10} /> {event.guests_count || 0}</div>
                </div>
            </div>
        </div>

        {/* Details — Hidden in new grid card to avoid clutter */}

        {/* Actions expanded */}
        <div className="flex flex-col gap-2 pt-1 mt-auto">
            <div className="flex gap-2">
                <Link
                    href={`/editor/${event.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 text-[10px] font-black uppercase py-2.5 px-3 rounded-xl transition-all hover:scale-[1.02] shadow-sm tracking-widest bg-[#a35d6a] text-white hover:bg-[#723a46]"
                >
                    <Pencil size={11} /> Editar Diseño
                </Link>
                <Link
                    href={`/dashboard/rsvp/${event.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 text-[10px] font-black uppercase py-2.5 px-3 rounded-xl transition-all hover:scale-[1.02] shadow-sm tracking-widest border border-[#f0dde3] text-[#7a5060] hover:bg-rose-50"
                >
                    <Users size={11} /> Invitados
                </Link>
            </div>
            
            <Link
                href={`/invite/${event.slug}`}
                target="_blank"
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[9px] font-bold text-[#a35d6a]/60 hover:text-[#a35d6a] hover:bg-rose-50/50 transition-all border border-dashed border-[#f0dde3]"
            >
                <Eye size={10} /> Previsualizar invitación pública
            </Link>
        </div>
    </div>
    );
}

// ─── Empty State ───────────────────────────────────────────────────────────
function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div
                className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
                style={{ background: 'linear-gradient(135deg, #f8e8ee, #f3e0f7)' }}
            >
                <PartyPopper size={40} style={{ color: '#a35d6a' }} />
            </div>
            <h3
                className="text-2xl font-bold text-[#2d1b2d] mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
            >
                Aún no tienes invitaciones
            </h3>
            <p className="text-[#7a5060] text-sm mb-10 max-w-xs text-center opacity-80">
                Crea tu primera invitación digital y sorprende a tus invitados con un diseño único.
            </p>
            <Link
                href="/dashboard/nuevo"
                className="inline-flex items-center gap-2 text-white px-8 py-4 rounded-full font-black text-sm transition-all hover:scale-105 shadow-xl hover:shadow-2xl active:scale-95"
                style={{ background: 'linear-gradient(135deg, #a35d6a, #7B2D8B)' }}
            >
                <PlusCircle size={18} /> Crear mi primera invitación
            </Link>
        </div>
    );
}

// ─── Dashboard Page ─────────────────────────────────────────────────────────
export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserProfile | null>(null);
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
        supabase.auth.getSession().then(({ data: { session } }) => {
            console.log('Sesión actual:', session?.user?.id);
            if (!session) {
                router.replace('/login');
                return;
            }
            setUser(session.user as UserProfile);
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
        <div className="min-h-screen flex bg-[#fdfafc]">
            <Sidebar 
                user={user} 
                onSignOut={handleSignOut} 
                activeItem="events" 
            />

            {/* Main content */}
            <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
                {/* ── HERO BANNER ──────────────────────────────────────────────── */}
                <div
                    className="relative overflow-hidden px-5 md:px-8 pt-12 md:pt-6 pb-8"
                    style={{ background: 'linear-gradient(135deg, #2d1b2d 0%, #7B2D8B 50%, #a35d6a 100%)' }}
                >

                    {/* Decorative circles */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10 bg-white" />
                    <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-10 bg-white" />
                    <div className="absolute top-4 right-24 w-16 h-16 rounded-full opacity-5 bg-white" />

                    <div className="relative flex items-center justify-between gap-4">
                        <div className="flex flex-col gap-1">
                            <p className="text-white/60 text-xs font-medium uppercase tracking-widest">Bienvenido</p>
                            <h1
                                className="text-2xl md:text-3xl font-black text-white"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                {firstName} 👋
                            </h1>
                            <p className="text-white/70 text-sm mt-1">
                                {events.length > 0
                                    ? `${events.length} evento${events.length !== 1 ? 's' : ''} · ${events.filter(e => e.is_published).length} publicado${events.filter(e => e.is_published).length !== 1 ? 's' : ''}`
                                    : 'Crea tu primera invitación digital ✨'}
                            </p>
                        </div>
                        <Link
                            href="/dashboard/nuevo"
                            className="flex items-center gap-2 text-[#7B2D8B] bg-white px-5 py-3 rounded-full font-black text-sm transition-all hover:scale-105 shadow-xl flex-shrink-0"
                        >
                            <PlusCircle size={16} />
                            Crear
                        </Link>
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
                                    placeholder="Buscar por título o tipo..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 rounded-2xl border bg-white outline-none focus:ring-2 focus:ring-[#7B2D8B]/10 focus:border-[#7B2D8B] transition-all text-sm shadow-sm"
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
                                <AnimatePresence mode="popLayout">
                                    {events
                                        .filter(e => (e.title || '').toLowerCase().includes((search || '').toLowerCase()) || (e.event_type || '').toLowerCase().includes((search || '').toLowerCase()))
                                        .map((event, idx) => (
                                            <motion.div
                                                key={event.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: idx * 0.05 }}
                                            >
                                                <EventCard event={event} />
                                            </motion.div>
                                        ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
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
