'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-browser';
import { toast } from 'sonner';
import {
    ArrowLeft, Search, Plus, Download, Copy, CheckCircle2,
    Loader2, X, ChevronDown, Users, UserCheck, Clock, UserX,
    LayoutDashboard, PlusCircle, User, LogOut, Eye, MessageCircle,
    Trash2, CheckSquare, Square, MoreHorizontal, ShieldCheck, QrCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Guest {
    id: string;
    name: string;
    phone: string | null;
    email: string | null;
    invitation_token: string;
    created_at: string;
    event_id: string;
    is_group: boolean;
    members_json: string[]; // List of names in the family/group
    rsvp: {
        status: 'confirmed' | 'declined' | 'pending';
        companions: number;
        dietary_restrictions: string;
        message: string;
        responded_at: string | null;
        confirmed_members_json: string[]; // Subset of members_json that actually confirmed
        is_checked_in: boolean;
        checked_in_at: string | null;
    } | null;
}

interface EventInfo {
    id: string;
    title: string;
    slug: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
    confirmed: { label: 'Confirmado', bg: '#d1fae5', color: '#065f46', dot: '#10b981' },
    declined: { label: 'Declinó', bg: '#fee2e2', color: '#991b1b', dot: '#ef4444' },
    pending: { label: 'Pendiente', bg: '#fef3c7', color: '#92400e', dot: '#f59e0b' },
    checked_in: { label: 'En el Evento', bg: '#eff6ff', color: '#1e40af', dot: '#3b82f6' },
};

function StatusChip({ status }: { status: keyof typeof STATUS_CONFIG }) {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    return (
        <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
            style={{ background: cfg.bg, color: cfg.color }}
        >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
            {cfg.label}
        </span>
    );
}

function StatCard({
    label, value, total, color, icon: Icon,
}: { label: string; value: number; total: number; color: string; icon: React.ElementType }) {
    const pct = total > 0 ? Math.round((value / total) * 100) : 0;
    return (
        <div
            className="bg-white rounded-2xl p-5 border shadow-sm flex flex-col gap-4 transition-all hover:shadow-md hover:-translate-y-0.5"
            style={{ borderColor: `${color}22` }}
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
                <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm"
                    style={{ background: `linear-gradient(135deg, ${color}22, ${color}44)` }}
                >
                    <Icon size={18} style={{ color }} />
                </div>
            </div>
            {/* Value + percent */}
            <div className="flex items-end justify-between">
                <span className="text-4xl font-black" style={{ color: '#1a1a2e' }}>{value}</span>
                <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: `${color}18`, color }}
                >
                    {pct}%
                </span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}99, ${color})` }}
                />
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function RSVPDashboard() {
    const { eventId } = useParams() as { eventId: string };
    const router = useRouter();

    const [guests, setGuests] = useState<Guest[]>([]);
    const [event, setEvent] = useState<EventInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | 'confirmed' | 'declined' | 'pending'>('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
    const [addForm, setAddForm] = useState({ name: '', phone: '', email: '', is_group: false, members: [] as string[] });
    const [addLoading, setAddLoading] = useState(false);
    const [generatedLink, setGeneratedLink] = useState<string | null>(null);
    const [copied, setCopied] = useState<string | null>(null);
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [justUpdatedId, setJustUpdatedId] = useState<string | null>(null);

    // ── Load data ──────────────────────────────────────────────────────────────
    const fetchGuests = useCallback(async () => {
        const { data } = await supabase
            .from('guests')
            .select(`*, rsvp(status, companions, dietary_restrictions, message, responded_at, is_checked_in, checked_in_at, confirmed_members_json)`)
            .eq('event_id', eventId)
            .order('created_at', { ascending: false });

        if (data) setGuests(data as Guest[]);
    }, [eventId]);

    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { router.replace('/login'); return; }

            const { data: ev } = await supabase
                .from('events')
                .select('id, title, slug')
                .eq('id', eventId)
                .eq('user_id', session.user.id)
                .single();

            if (!ev) { router.replace('/dashboard'); return; }
            setEvent(ev);
            await fetchGuests();
            setLoading(false);
        };
        init();
    }, [eventId, router, fetchGuests]);

    // ── Realtime ───────────────────────────────────────────────────────────────
    useEffect(() => {
        const channel = supabase
            .channel(`rsvp-${eventId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'guests', filter: `event_id=eq.${eventId}` }, fetchGuests)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'rsvp' }, (payload) => {
                fetchGuests();
                toast.success('¡Nueva respuesta recibida! 🔔', {
                    description: 'Un invitado acaba de actualizar su asistencia.',
                    duration: 5000,
                });
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rsvp' }, fetchGuests)
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [eventId, fetchGuests]);

    // ── Stats ──────────────────────────────────────────────────────────────────
    const total = guests.length;
    const confirmed = guests.filter(g => g.rsvp?.status === 'confirmed').length;
    const declined = guests.filter(g => g.rsvp?.status === 'declined').length;
    const pending = guests.filter(g => !g.rsvp || g.rsvp.status === 'pending').length;

    // ── Filter + Search ────────────────────────────────────────────────────────
    const filtered = guests.filter(g => {
        const matchSearch = g.name.toLowerCase().includes(search.toLowerCase()) ||
            (g.email || '').toLowerCase().includes(search.toLowerCase());
        const gStatus = g.rsvp?.status || 'pending';
        const matchFilter = filter === 'all' || gStatus === filter;
        return matchSearch && matchFilter;
    });

    // ── Add guest ──────────────────────────────────────────────────────────────
    const handleAddGuest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!addForm.name.trim()) return;
        setAddLoading(true);

        const { data, error } = await supabase
            .from('guests')
            .insert({
                event_id: eventId,
                name: addForm.name.trim(),
                phone: addForm.phone || null,
                email: addForm.email || null,
                is_group: addForm.is_group,
                members_json: addForm.members
            })
            .select()
            .single();

        if (!error && data) {
            const link = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${event?.slug}?token=${data.invitation_token}`;
            setGeneratedLink(link);
            setAddForm({ name: '', phone: '', email: '', is_group: false, members: [] });
            await fetchGuests();
            toast.success('¡Invitado agregado!');
        } else if (error) {
            toast.error('Error al agregar invitado');
        }
        setAddLoading(false);
    };

    // ── Bulk Actions ────────────────────────────────────────────────────────
    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };
    const toggleAll = () => {
        if (selectedIds.length === filtered.length && filtered.length > 0) setSelectedIds([]);
        else setSelectedIds(filtered.map(g => g.id));
    };

    const handleBulkDelete = async () => {
        if (!confirm(`¿Estás seguro de eliminar ${selectedIds.length} invitados?`)) return;
        const { error } = await supabase.from('guests').delete().in('id', selectedIds);
        if (!error) {
            toast.success(`${selectedIds.length} invitados eliminados`);
            setSelectedIds([]);
            fetchGuests();
        }
    };

    const handleBulkConfirm = async () => {
        const { error } = await supabase.from('rsvp').upsert(
            selectedIds.map(id => ({ guest_id: id, status: 'confirmed', event_id: eventId }))
        );
        if (!error) {
            toast.success(`${selectedIds.length} invitados confirmados`);
            setSelectedIds([]);
            fetchGuests();
        }
    };

    const shareWhatsApp = (g: Guest) => {
        const link = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${event?.slug}?token=${g.invitation_token}`;
        const text = encodeURIComponent(`🌟 *¡HOLA ${g.name.toUpperCase()}!* 🌟\n\nNos encantaría que nos acompañes en nuestro gran día. ❤️\n\nTe compartimos tu *invitación digital personalizada* con todos los detalles y el pase de entrada aquí:\n\n🔗 ${link}\n\n*¡Por favor, no olvides confirmar tu asistencia en el link!* ✨`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };

    // ── Export CSV ─────────────────────────────────────────────────────────────
    const exportCSV = () => {
        const headers = ['Nombre', 'Estado', 'Acompañantes', 'Restricciones', 'Mensaje', 'Fecha respuesta', 'Teléfono', 'Email'];
        const rows = guests.map(g => [
            g.name,
            g.rsvp?.status || 'pendiente',
            g.rsvp?.companions ?? 0,
            g.rsvp?.dietary_restrictions || '',
            g.rsvp?.message || '',
            g.rsvp?.responded_at ? new Date(g.rsvp.responded_at).toLocaleDateString('es-MX') : '',
            g.phone || '',
            g.email || '',
        ]);
        const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invitados-${event?.slug || eventId}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const copyAllLinks = () => {
        const text = guests.map(g => `${g.name}: ${guestLink(g)}`).join('\n');
        navigator.clipboard.writeText(text);
        toast.success(`Copiados ${guests.length} links al portapapeles`);
    };

    const copySelectedLinks = () => {
        const selectedGuests = guests.filter(g => selectedIds.includes(g.id));
        const text = selectedGuests.map(g => `${g.name}: ${guestLink(g)}`).join('\n');
        navigator.clipboard.writeText(text);
        toast.success(`Copiados ${selectedIds.length} links al portapapeles`);
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const FILTER_LABELS = { all: 'Todos', confirmed: 'Confirmados', pending: 'Pendientes', declined: 'Declinaron' };
    const guestLink = (g: Guest) => `${process.env.NEXT_PUBLIC_APP_URL}/invite/${event?.slug}?token=${g.invitation_token}`;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fdfafc]">
                <Loader2 className="animate-spin text-[#a35d6a]" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-[#fdfafc]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

            {/* ── SIDEBAR ──────────────────────────────────────────────────────── */}
            <aside className="hidden md:flex w-60 min-h-screen flex-col border-r bg-white flex-shrink-0" style={{ borderColor: '#f0dde3' }}>
                <div className="px-5 py-5 border-b" style={{ borderColor: '#f0dde3' }}>
                    <Link href="/" className="group inline-block">
                        <img
                            src="/logo.png"
                            alt="EncantIA"
                            style={{ height: '48px', width: 'auto', filter: 'drop-shadow(0 2px 6px rgba(163,93,106,0.3))' }}
                            className="group-hover:scale-105 transition-transform duration-300"
                        />
                    </Link>
                </div>
                <nav className="flex-1 px-3 py-5 flex flex-col gap-1">
                    {[
                        { href: '/dashboard', icon: LayoutDashboard, label: 'Mis Eventos' },
                        { href: '/dashboard/nuevo', icon: PlusCircle, label: 'Crear Evento' },
                        { href: '/dashboard/cuenta', icon: User, label: 'Cuenta' },
                    ].map(({ href, icon: Icon, label }) => (
                        <Link key={href} href={href} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-[#7a5060] hover:bg-rose-50">
                            <Icon size={16} />
                            {label}
                        </Link>
                    ))}
                </nav>
                <div className="px-3 pb-5 border-t pt-4" style={{ borderColor: '#f0dde3' }}>
                    <button
                        onClick={async () => { await supabase.auth.signOut(); router.replace('/login'); }}
                        className="flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-sm text-red-400 hover:bg-red-50 transition-all"
                    >
                        <LogOut size={15} /> Cerrar sesión
                    </button>
                </div>
            </aside>

            {/* ── MAIN ─────────────────────────────────────────────────────────── */}
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
                        <div className="flex flex-col gap-1 min-w-0">
                            <p className="text-white/60 text-xs font-medium uppercase tracking-widest truncate">
                                {event?.title || 'Evento'}
                            </p>
                            <h1
                                className="text-2xl md:text-3xl font-black text-white"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                Lista de Invitados
                            </h1>
                            <p className="text-white/70 text-sm mt-1 hidden sm:block">
                                Gestiona la asistencia y detalles de tus invitados
                            </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                                onClick={exportCSV}
                                className="hidden md:flex items-center gap-2 text-[#7B2D8B] bg-white px-5 py-3 rounded-full font-black text-sm transition-all hover:scale-105 shadow-xl"
                            >
                                <Download size={16} />
                                Exportar
                            </button>
                            <Link
                                href="/dashboard"
                                className="flex items-center justify-center w-10 md:w-auto md:px-5 md:h-12 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-sm border border-white/20 shadow-lg"
                            >
                                <ArrowLeft size={16} />
                                <span className="hidden md:inline ml-2 font-bold text-sm">Volver</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="px-4 md:px-8 py-5 md:py-8 flex flex-col gap-6">

                    {/* ── STATS ──── */}
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard label="Total invitados" value={total} total={total} color="#3498db" icon={Users} />
                            <StatCard label="Confirmados" value={confirmed} total={total} color="#27ae60" icon={UserCheck} />
                            <StatCard label="Pendientes" value={pending} total={total} color="#f39c12" icon={Clock} />
                            <StatCard label="Declinaron" value={declined} total={total} color="#e74c3c" icon={UserX} />
                        </div>

                        {/* Visual Donut Chart */}
                        <div className="bg-white rounded-3xl p-6 border shadow-sm flex flex-col items-center justify-center gap-4 min-w-[200px]" style={{ borderColor: '#f0dde3' }}>
                            <div className="relative w-28 h-28">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                    <circle cx="18" cy="18" r="16" fill="none" stroke="#f3f4f6" strokeWidth="4" />
                                    {total > 0 && (
                                        <>
                                            {/* Declined segment */}
                                            <circle cx="18" cy="18" r="16" fill="none" stroke="#e74c3c" strokeWidth="4" strokeDasharray={`${((declined + pending + confirmed) / total) * 100} 100`} />
                                            {/* Pending segment */}
                                            <circle cx="18" cy="18" r="16" fill="none" stroke="#f39c12" strokeWidth="4" strokeDasharray={`${((pending + confirmed) / total) * 100} 100`} />
                                            {/* Confirmed segment */}
                                            <circle cx="18" cy="18" r="16" fill="none" stroke="#27ae60" strokeWidth="4" strokeDasharray={`${(confirmed / total) * 100} 100`} />
                                        </>
                                    )}
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-xl font-black text-[#2d1b2d]">{total > 0 ? Math.round((confirmed / total) * 100) : 0}%</span>
                                    <span className="text-[8px] font-bold text-gray-400">OK</span>
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-bold text-[#7a5060]">Tasa de Asistencia</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">Basado en confirmados</p>
                            </div>
                        </div>
                    </div>

                    {/* ── CONTROLS ── */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Search */}
                        <div className="relative flex-1 min-w-[200px]">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar invitado…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#a35d6a]/20 focus:border-[#a35d6a] transition-all bg-white shadow-sm"
                                style={{ borderColor: '#e8d0d7' }}
                            />
                        </div>

                        {/* Filter dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setFilterOpen(p => !p)}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold bg-white transition-all hover:bg-gray-50 shadow-sm"
                                style={{ borderColor: '#e8d0d7', color: '#7a5060' }}
                            >
                                {FILTER_LABELS[filter]} <ChevronDown size={14} />
                            </button>
                            <AnimatePresence>
                                {filterOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                        className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl border shadow-xl z-50 overflow-hidden py-1.5"
                                        style={{ borderColor: '#f0dde3' }}
                                    >
                                        {(Object.keys(FILTER_LABELS) as Array<keyof typeof FILTER_LABELS>).map(f => (
                                            <button
                                                key={f}
                                                onClick={() => { setFilter(f); setFilterOpen(false); }}
                                                className={`w-full text-left px-4 py-2 text-xs transition-colors flex items-center justify-between ${filter === f ? 'bg-rose-50 text-[#7B2D8B] font-bold' : 'text-[#7a5060] hover:bg-gray-50'}`}
                                            >
                                                {FILTER_LABELS[f]}
                                                {filter === f && <CheckCircle2 size={12} />}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Bulk actions - Only if selected */}
                        <AnimatePresence>
                            {selectedIds.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20, scale: 0.9 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: -20, scale: 0.9 }}
                                    className="flex items-center gap-2 bg-[#7B2D8B]/5 px-4 py-2 rounded-2xl border border-[#7B2D8B]/20 shadow-lg backdrop-blur-sm"
                                >
                                    <span className="text-xs font-black text-[#7B2D8B] border-r pr-3 mr-1">{selectedIds.length}</span>
                                    <button
                                        onClick={copySelectedLinks}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#7B2D8B]/20 text-[#7B2D8B] rounded-full text-[10px] font-bold hover:bg-[#7B2D8B]/10 transition-all shadow-sm"
                                    >
                                        <Copy size={12} /> Copiar Links
                                    </button>
                                    <button
                                        onClick={handleBulkConfirm}
                                        className="px-3 py-1.5 bg-[#27ae60] text-white rounded-full text-[10px] font-bold shadow-md shadow-green-200 hover:scale-105 transition-all"
                                    >
                                        Confirmar
                                    </button>
                                    <button
                                        onClick={handleBulkDelete}
                                        className="px-3 py-1.5 bg-red-400 text-white rounded-full text-[10px] font-bold shadow-md shadow-red-200 hover:scale-105 transition-all"
                                    >
                                        Eliminar
                                    </button>
                                    <button
                                        onClick={() => setSelectedIds([])}
                                        className="ml-1 p-1.5 text-gray-400"
                                    >
                                        <X size={14} />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex items-center gap-2 md:ml-auto">
                            <button
                                onClick={() => { setShowAddModal(true); setGeneratedLink(null); }}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-black text-white transition-all hover:scale-105 shadow-xl shadow-rose-100"
                                style={{ background: 'linear-gradient(135deg, #a35d6a, #7B2D8B)' }}
                            >
                                <Plus size={16} /> Agregar
                            </button>
                            <button
                                onClick={exportCSV}
                                className="p-2.5 rounded-full border bg-white hover:bg-gray-50 transition-all shadow-sm"
                                style={{ borderColor: '#e8d0d7', color: '#7a5060' }}
                                title="Exportar CSV"
                            >
                                <Download size={16} />
                            </button>
                        </div>
                    </div>

                    {/* ── TABLE ──── */}
                    <div className="bg-white rounded-2xl border overflow-hidden shadow-sm" style={{ borderColor: '#f0dde3' }}>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b" style={{ borderColor: '#f0dde3', background: '#fdfafc' }}>
                                        <th className="px-4 py-3 text-left w-10">
                                            <button onClick={toggleAll} className="p-1 rounded hover:bg-rose-50">
                                                {selectedIds.length === filtered.length && filtered.length > 0
                                                    ? <CheckSquare size={16} className="text-[#a35d6a]" />
                                                    : <Square size={16} className="text-gray-300" />}
                                            </button>
                                        </th>
                                        {['Nombre', 'Estado', 'Ingreso', 'Acompañantes', 'Restricciones', 'Mensaje', 'Respondió', 'Acciones'].map(h => (
                                            <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-4 py-12 text-center text-gray-400 text-sm">
                                                {search ? 'No se encontraron invitados.' : 'Aún no hay invitados. ¡Agrega el primero!'}
                                            </td>
                                        </tr>
                                    ) : (
                                        <AnimatePresence mode="popLayout">
                                            {filtered.map(g => {
                                                const status = g.rsvp?.status || 'pending';
                                                const isSelected = selectedIds.includes(g.id);
                                                return (
                                                    <motion.tr
                                                        key={g.id}
                                                        layout
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className={`border-b transition-colors cursor-pointer ${isSelected ? 'bg-[#7B2D8B]/5' : 'hover:bg-rose-50/30'}`}
                                                        style={{ borderColor: '#f9f0f3' }}
                                                        onClick={() => setSelectedGuest(g)}
                                                    >
                                                        <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                                                            <button onClick={() => toggleSelect(g.id)} className="p-1 rounded">
                                                                {isSelected
                                                                    ? <CheckSquare size={16} className="text-[#a35d6a]" />
                                                                    : <Square size={16} className="text-gray-300" />}
                                                            </button>
                                                        </td>
                                                        <td className="px-4 py-3 font-semibold text-[#2d1b2d] whitespace-nowrap">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center text-[#a35d6a] text-xs font-bold flex-shrink-0">
                                                                    {g.name[0].toUpperCase()}
                                                                </div>
                                                                {g.name}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <StatusChip status={status as keyof typeof STATUS_CONFIG} />
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            {g.rsvp?.is_checked_in ? (
                                                                <div className="flex flex-col">
                                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-tighter w-fit">
                                                                        <ShieldCheck size={10} /> Recibido
                                                                    </span>
                                                                    <span className="text-[9px] text-gray-400 mt-0.5 ml-1">
                                                                        {g.rsvp.checked_in_at ? new Date(g.rsvp.checked_in_at).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) : '—'}
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-300 text-xs">—</span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 text-center text-gray-500">{g.rsvp?.companions ?? '—'}</td>
                                                        <td className="px-4 py-3 text-gray-500 max-w-[150px] truncate">{g.rsvp?.dietary_restrictions || '—'}</td>
                                                        <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate italic">{g.rsvp?.message || '—'}</td>
                                                        <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                                                            {g.rsvp?.responded_at ? new Date(g.rsvp.responded_at).toLocaleDateString('es-MX') : '—'}
                                                        </td>
                                                        <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                                                            <div className="flex items-center gap-1">
                                                                <button
                                                                    onClick={() => shareWhatsApp(g)}
                                                                    className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-all"
                                                                    title="Enviar por WhatsApp"
                                                                >
                                                                    <MessageCircle size={14} fill="currentColor" />
                                                                </button>
                                                                <button
                                                                    onClick={() => setSelectedGuest(g)}
                                                                    className="p-1.5 rounded-lg hover:bg-rose-50 text-[#a35d6a] transition-colors"
                                                                    title="Ver detalle"
                                                                >
                                                                    <Eye size={14} />
                                                                </button>
                                                                <button
                                                                    onClick={() => copyToClipboard(guestLink(g), g.id)}
                                                                    className="p-1.5 rounded-lg hover:bg-rose-50 text-[#a35d6a] transition-colors"
                                                                    title="Copiar link"
                                                                >
                                                                    {copied === g.id ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                );
                                            })}
                                        </AnimatePresence>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer count */}
                        <div className="px-4 py-3 border-t text-xs text-gray-400" style={{ borderColor: '#f0dde3' }}>
                            Mostrando {filtered.length} de {total} invitados
                        </div>
                    </div>
                </div>
            </main>

            {/* ── DETAIL MODAL ─────────────────────────────────────────────────── */}
            {selectedGuest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div
                            className="px-6 py-5 flex items-center justify-between"
                            style={{ background: 'linear-gradient(135deg, #fdf0f4, #f3e6f9)' }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-white/60 flex items-center justify-center text-[#a35d6a] text-xl font-bold">
                                    {selectedGuest.name[0].toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#2d1b2d]">{selectedGuest.name}</h3>
                                    <StatusChip status={(selectedGuest.rsvp?.status || 'pending') as keyof typeof STATUS_CONFIG} />
                                </div>
                            </div>
                            <button onClick={() => setSelectedGuest(null)} className="text-gray-400 hover:text-gray-600 p-1">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="px-6 py-5 flex flex-col gap-4">
                            {/* Contact */}
                            {(selectedGuest.phone || selectedGuest.email) && (
                                <div className="flex flex-col gap-1.5">
                                    {selectedGuest.phone && <p className="text-sm text-gray-600">📱 {selectedGuest.phone}</p>}
                                    {selectedGuest.email && <p className="text-sm text-gray-600">✉️ {selectedGuest.email}</p>}
                                </div>
                            )}

                            {/* RSVP data */}
                            {selectedGuest.rsvp && (
                                <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-2 text-sm">
                                    <p><span className="font-semibold text-gray-500">Acompañantes:</span> {selectedGuest.rsvp.companions}</p>
                                    {selectedGuest.rsvp.dietary_restrictions && (
                                        <p><span className="font-semibold text-gray-500">Restricciones:</span> {selectedGuest.rsvp.dietary_restrictions}</p>
                                    )}
                                    {selectedGuest.rsvp.message && (
                                        <p className="italic text-gray-600">"{selectedGuest.rsvp.message}"</p>
                                    )}
                                    {selectedGuest.rsvp.responded_at && (
                                        <p className="text-xs text-gray-400">
                                            Respondió: {new Date(selectedGuest.rsvp.responded_at).toLocaleString('es-MX')}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Invitation link */}
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Link de invitación</p>
                                <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 border" style={{ borderColor: '#e8d0d7' }}>
                                    <p className="text-xs text-gray-500 flex-1 truncate">{guestLink(selectedGuest)}</p>
                                    <button
                                        onClick={() => copyToClipboard(guestLink(selectedGuest), `modal-${selectedGuest.id}`)}
                                        className="flex-shrink-0 p-1.5 rounded-lg text-[#a35d6a] hover:bg-rose-50 transition-colors"
                                    >
                                        {copied === `modal-${selectedGuest.id}` ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedGuest(null)}
                                className="w-full py-3 rounded-xl border text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors mt-1"
                                style={{ borderColor: '#e8d0d7' }}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── ADD GUEST MODAL ──────────────────────────────────────────────── */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl">
                        <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: '#f0dde3' }}>
                            <h3 className="font-bold text-[#2d1b2d]">Agregar invitado</h3>
                            <button onClick={() => { setShowAddModal(false); setGeneratedLink(null); }} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        {generatedLink ? (
                            <div className="px-8 py-10 flex flex-col items-center gap-6 animate-scale-in text-center">
                                <div className="w-16 h-16 rounded-3xl bg-green-50 flex items-center justify-center text-green-500 mb-2 shadow-lg shadow-green-100 rotate-6">
                                    <CheckCircle2 size={32} />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <h3 className="text-xl font-black text-[#2d1b2d] leading-tight">¡Invitación Lista! ✨</h3>
                                    <p className="text-xs text-gray-400 font-medium tracking-tight">Copia el link o envíalo directamente por WhatsApp.</p>
                                </div>

                                <div className="w-full bg-rose-50/50 rounded-[32px] p-6 border border-rose-100 flex flex-col gap-4 relative overflow-hidden group">
                                    <div className="absolute -top-4 -right-4 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                                        <QrCode size={100} />
                                    </div>

                                    <div className="flex flex-col gap-1.5 items-center relative z-10">
                                        <div className="px-3 py-1 bg-white rounded-full text-[10px] font-black uppercase tracking-widest text-[#a35d6a] border border-rose-100 shadow-sm">
                                            {addForm.is_group ? 'Invitación Grupal' : 'Pase Individual'}
                                        </div>
                                        <p className="font-bold text-gray-400 text-[10px] break-all max-w-[200px] line-clamp-1 opacity-60">{generatedLink}</p>
                                    </div>

                                    <button
                                        onClick={() => copyToClipboard(generatedLink, 'new')}
                                        className="w-full py-4 rounded-2xl bg-white border border-[#e8d0d7] text-[#a35d6a] text-sm font-black flex items-center justify-center gap-2 hover:bg-rose-50 transition-all active:scale-95 shadow-sm"
                                    >
                                        {copied === 'new' ? <><CheckCircle2 size={16} className="text-green-500" /> ¡Copiado!</> : <><Copy size={16} /> Copiar Link</>}
                                    </button>
                                </div>

                                <div className="flex flex-col gap-3 w-full">
                                    <a
                                        href={`https://wa.me/?text=${encodeURIComponent(`🌟 *¡HOLA!* 🌟\n\nNos encantaría que nos acompañes en nuestro gran día. ❤️\n\nTe compartimos tu *invitación digital personalizada* con todos los detalles y el pase de entrada aquí:\n\n🔗 ${generatedLink}\n\n*¡Por favor, no olvides confirmar tu asistencia en el link!* ✨`)}`}
                                        target="_blank"
                                        className="w-full py-4 rounded-2xl text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2.5 transition-all active:scale-95 hover:brightness-110"
                                        style={{ background: '#25D366' }}
                                    >
                                        <MessageCircle size={18} fill="currentColor" /> Compartir en WhatsApp
                                    </a>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setGeneratedLink(null)}
                                            className="flex-1 py-3 rounded-xl border-2 border-dashed text-xs font-bold text-[#a35d6a] hover:bg-rose-50 transition-all"
                                            style={{ borderColor: '#e8d0d7' }}
                                        >
                                            Agregar otro
                                        </button>
                                        <button
                                            onClick={() => { setShowAddModal(false); setGeneratedLink(null); }}
                                            className="flex-1 py-3 rounded-xl text-gray-400 text-xs font-bold hover:bg-gray-50 transition-all underline decoration-rose-100"
                                        >
                                            Listo
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleAddGuest} className="px-6 py-5 flex flex-col gap-4">
                                {[
                                    { field: 'name', label: 'Nombre *', placeholder: 'Nombre completo', required: true },
                                    { field: 'phone', label: 'Teléfono', placeholder: '+52 33 1234 5678', required: false },
                                    { field: 'email', label: 'Email', placeholder: 'correo@ejemplo.com', required: false },
                                ].map(({ field, label, placeholder, required }) => (
                                    <div key={field}>
                                        <label className="text-xs font-bold text-gray-500 mb-1.5 block">{label}</label>
                                        <input
                                            type={field === 'email' ? 'email' : 'text'}
                                            placeholder={placeholder}
                                            value={(addForm as any)[field]}
                                            onChange={e => setAddForm(p => ({ ...p, [field]: e.target.value }))}
                                            required={required}
                                            className="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#a35d6a]/20 focus:border-[#a35d6a] transition-all"
                                            style={{ borderColor: '#e8d0d7' }}
                                        />
                                    </div>
                                ))}

                                {/* Group Toggle */}
                                <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 flex items-center justify-between">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-xs font-bold text-[#2d1b2d]">Invitación Familiar / Grupo</span>
                                        <span className="text-[10px] text-gray-500">Permite confirmar por integrante.</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setAddForm(p => ({ ...p, is_group: !p.is_group }))}
                                        className={`w-10 h-5 rounded-full transition-all relative ${addForm.is_group ? 'bg-[#a35d6a]' : 'bg-gray-200'}`}
                                    >
                                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${addForm.is_group ? 'left-5.5' : 'left-0.5'}`} />
                                    </button>
                                </div>

                                {addForm.is_group && (
                                    <div className="flex flex-col gap-3 animate-fade-in">
                                        <label className="text-xs font-bold text-gray-500">Integrantes de la familia</label>
                                        <div className="flex flex-col gap-2">
                                            {addForm.members.map((m, i) => (
                                                <div key={i} className="flex gap-2">
                                                    <input
                                                        value={m}
                                                        onChange={e => {
                                                            const n = [...addForm.members];
                                                            n[i] = e.target.value;
                                                            setAddForm(p => ({ ...p, members: n }));
                                                        }}
                                                        className="flex-1 px-4 py-2 rounded-lg border text-sm outline-none bg-white"
                                                        style={{ borderColor: '#e8d0d7' }}
                                                        placeholder={`Nombre ${i + 1}`}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setAddForm(p => ({ ...p, members: p.members.filter((_, idx) => idx !== i) }))}
                                                        className="p-2 text-rose-300 hover:text-rose-500"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => setAddForm(p => ({ ...p, members: [...p.members, ''] }))}
                                                className="py-2.5 rounded-xl border-2 border-dashed text-xs font-bold text-[#a35d6a] hover:bg-rose-50 transition-all"
                                                style={{ borderColor: '#e8d0d7' }}
                                            >
                                                + Agregar integrante
                                            </button>
                                        </div>
                                    </div>
                                )}
                                <div className="flex gap-3 mt-1">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 py-3 rounded-xl border text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
                                        style={{ borderColor: '#e8d0d7' }}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={addLoading}
                                        className="flex-1 py-3 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
                                        style={{ background: 'linear-gradient(135deg, #a35d6a, #7B2D8B)' }}
                                    >
                                        {addLoading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                                        Agregar
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

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
                <button
                    onClick={async () => { await supabase.auth.signOut(); router.replace('/login'); }}
                    className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl text-red-400"
                >
                    <LogOut size={20} />
                    <span className="text-[10px] font-semibold">Salir</span>
                </button>
            </nav>
        </div>
    );
}
