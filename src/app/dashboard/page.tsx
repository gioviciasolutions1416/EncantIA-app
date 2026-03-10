'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-browser';
import {
    LayoutDashboard,
    PlusCircle,
    User,
    LogOut,
    Calendar,
    MapPin,
    Eye,
    Pencil,
    Loader2,
    PartyPopper,
    Users,
} from 'lucide-react';

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
            className="w-64 min-h-screen flex flex-col border-r"
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
                Aún no tienes eventos
            </h3>
            <p className="text-sm text-[#7a5060] mb-8 max-w-sm">
                Crea tu primera invitación digital y sorprende a tus invitados con una experiencia única.
            </p>
            <Link
                href="/dashboard/nuevo"
                className="inline-flex items-center gap-2 text-white px-8 py-3.5 rounded-full font-bold text-sm transition-all hover:opacity-90 shadow-lg"
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
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [eventsLoading, setEventsLoading] = useState(true);

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
            <main className="flex-1 overflow-y-auto">
                {/* Top bar */}
                <div
                    className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b px-8 py-4 flex items-center justify-between"
                    style={{ borderColor: '#f0dde3' }}
                >
                    <div>
                        <h1
                            className="text-2xl font-bold text-[#2d1b2d]"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Hola, {firstName} 👋
                        </h1>
                        <p className="text-xs text-[#7a5060] mt-0.5">
                            {events.length > 0
                                ? `Tienes ${events.length} evento${events.length !== 1 ? 's' : ''} creado${events.length !== 1 ? 's' : ''}`
                                : 'Comienza creando tu primera invitación'}
                        </p>
                    </div>
                    <Link
                        href="/dashboard/nuevo"
                        className="flex items-center gap-2 text-white px-6 py-3 rounded-full font-bold text-sm transition-all hover:opacity-90 shadow-md"
                        style={{ background: 'linear-gradient(135deg, #a35d6a, #7B2D8B)' }}
                    >
                        <PlusCircle size={16} />
                        Crear nueva invitación
                    </Link>
                </div>

                {/* Content */}
                <div className="px-8 py-8">
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
                        <>
                            <p className="text-sm text-[#7a5060] mb-6 font-medium">
                                {events.length} evento{events.length !== 1 ? 's' : ''}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {events.map((event) => (
                                    <EventCard key={event.id} event={event} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
