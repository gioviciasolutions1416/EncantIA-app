'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-browser';
import {
    LayoutDashboard, PlusCircle, User, LogOut, Eye, Pencil, Users,
    Calendar, MapPin, PartyPopper, Loader2, Search, X
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
}

// ─── Sidebar ───────────────────────────────────────────────────────────────
function Sidebar({
    user,
    onSignOut,
    activeItem,
}: {
    user: UserProfile;
    onSignOut: () => void;
    activeItem: string;
}) {
    const navItems = [
        { id: 'events', href: '/dashboard', icon: LayoutDashboard, label: 'Mis Eventos' },
        { id: 'new', href: '/dashboard/nuevo', icon: PlusCircle, label: 'Crear Evento' },
        { id: 'account', href: '/dashboard/cuenta', icon: User, label: 'Cuenta' },
    ];

    return (
        <aside
            className="hidden md:flex w-64 min-h-screen flex-col border-r flex-shrink-0"
            style={{ background: '#fff', borderColor: '#f0dde3' }}
        >
            {/* Logo */}
            <div className="px-6 py-6 border-b" style={{ borderColor: '#f0dde3' }}>
                <Link href="/" className="group inline-block">
                    <img
                        src="/logo.png"
                        alt="EncantIA"
                        style={{
                            height: '52px',
                            width: 'auto',
                            filter: 'drop-shadow(0 2px 6px rgba(163,93,106,0.3))',
                        }}
                        className="group-hover:scale-105 transition-transform duration-300"
                    />
                </Link>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-6 flex flex-col gap-1">
                {navItems.map(({ id, href, icon: Icon, label }) => (
                    <Link
                        key={id}
                        href={href}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                        style={{
                            background: activeItem === id ? 'linear-gradient(135deg, #f8e8ee, #f3e0f7)' : 'transparent',
                            color: activeItem === id ? '#7B2D8B' : '#7a5060',
                            fontWeight: activeItem === id ? 600 : 400,
                        }}
                    >
                        <Icon size={18} />
                        {label}
                    </Link>
                ))}
            </nav>

            {/* User + Sign out */}
            <div className="px-3 pb-6 border-t pt-4" style={{ borderColor: '#f0dde3' }}>
                <div className="flex items-center gap-3 px-4 py-3 mb-2">
                    <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #a35d6a, #7B2D8B)' }}
                    >
                        {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#2d1b2d] truncate">
                            {user.user_metadata?.full_name || user.user_metadata?.name || 'Usuario'}
                        </p>
                        <p className="text-[11px] text-[#7a5060] truncate">{user.email}</p>
                    </div>
                </div>
                <button
                    onClick={onSignOut}
                    className="flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-sm transition-all hover:bg-red-50 text-red-400 hover:text-red-600"
                >
                    <LogOut size={16} />
                    Cerrar sesión
                </button>
            </div>
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
            className="bg-white rounded-2xl border p-6 flex flex-col gap-4 hover:shadow-lg transition-all"
            style={{ borderColor: '#f0dde3' }}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#2d1b2d] text-base truncate mb-1">{event.title}</h3>
                    <span
                        className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                        style={{ background: `${color}18`, color }}
                    >
                        {event.event_type}
                    </span>
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <span
                        className="inline-block text-[11px] font-bold px-2.5 py-1 rounded-full"
                        style={
                            event.is_published
                                ? { background: '#d1fae5', color: '#065f46' }
                                : { background: '#fef3c7', color: '#92400e' }
                        }
                    >
                        {event.is_published ? '✓ Publicada' : '• Borrador'}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold bg-gray-50 px-2 py-0.5 rounded-full">
                        <Eye size={10} /> {event.views || 0}
                    </div>
                </div>
            </div>

            {/* Details */}
            <div className="flex flex-col gap-1.5 text-xs text-[#7a5060]">
                <div className="flex items-center gap-2">
                    <Calendar size={13} />
                    {formattedDate}
                </div>
                {event.venue && (
                    <div className="flex items-center gap-2">
                        <MapPin size={13} />
                        <span className="truncate">{event.venue}</span>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t" style={{ borderColor: '#f0dde3' }}>
                <Link
                    href={`/editor/${event.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-lg transition-all hover:opacity-80"
                    style={{ background: 'linear-gradient(135deg, #a35d6a, #7B2D8B)', color: 'white' }}
                >
                    <Pencil size={12} /> Editar
                </Link>
                <Link
                    href={`/dashboard/rsvp/${event.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-lg border transition-all hover:bg-[#fdf2f7]"
                    style={{ borderColor: '#e8d0d7', color: '#7B2D8B' }}
                >
                    <Users size={12} /> Invitados
                </Link>
                <Link
                    href={`/invite/${event.slug}`}
                    target="_blank"
                    className="flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-lg border transition-all hover:bg-[#fdf2f7]"
                    style={{ borderColor: '#e8d0d7', color: '#a35d6a' }}
                >
                    <Eye size={12} />
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
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (!error && data) setEvents(data);
        } catch {
            // tabla puede no existir aún
        } finally {
            setEventsLoading(false);
        }
    }, []);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
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
            <Sidebar user={user} onSignOut={handleSignOut} activeItem="events" />

            {/* Main content */}
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
                            {events.filter(e => e.title.toLowerCase().includes(search.toLowerCase()) || e.event_type.toLowerCase().includes(search.toLowerCase())).length} RESULTADOS
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
                                    .filter(e => e.title.toLowerCase().includes(search.toLowerCase()) || e.event_type.toLowerCase().includes(search.toLowerCase()))
                                    .map((event, idx) => (
                                        <motion.div
                                            key={event.id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                        >
                                            <EventCard event={event} />
                                        </motion.div>
                                    ))}
                            </AnimatePresence>
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
