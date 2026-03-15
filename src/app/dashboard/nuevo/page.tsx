'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-browser';
import {
    LayoutDashboard, PlusCircle, User, LogOut, Loader2, ArrowLeft, CalendarDays,
    MapPin, Clock, Tag, Type, CheckCircle2, Sparkles, Lightbulb, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Helpers ────────────────────────────────────────────────────────────────
function generateSlug(name: string, date: string): string {
    const normalizedName = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // quitar acentos
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');

    const year = date ? date.slice(0, 4) : new Date().getFullYear().toString();
    const randomSuffix = Math.random().toString(36).slice(2, 6);

    return `${normalizedName}-${year}-${randomSuffix}`;
}

const EVENT_TYPES = ['Boda', 'XV Años', 'Bautizo', 'Baby Shower', 'Comunión'];

// ─── Form Field ─────────────────────────────────────────────────────────────
function Field({
    label,
    icon,
    children,
    error,
}: {
    label: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    error?: string;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-[#2d1b2d]">
                <span className="text-[#a35d6a]">{icon}</span>
                {label}
            </label>
            {children}
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}

const inputClass =
    'w-full px-4 py-3 rounded-xl border text-sm text-[#2d1b2d] placeholder:text-gray-300 ' +
    'focus:outline-none focus:ring-2 focus:ring-[#a35d6a]/30 focus:border-[#a35d6a] transition-all bg-white';

// ─── Nuevo Evento Page ───────────────────────────────────────────────────────
export default function NuevoEventoPage() {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState({
        title: '',
        event_type: '',
        event_date: '',
        event_time: '',
        location: '',
    });

    const [fieldErrors, setFieldErrors] = useState<Partial<typeof form>>({});

    // Auth guard
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                router.replace('/login');
                return;
            }
            setUserId(session.user.id);
        });
    }, [router]);

    const validate = () => {
        const errors: Partial<typeof form> = {};
        if (!form.title.trim()) errors.title = 'El nombre del evento es obligatorio';
        if (!form.event_type) errors.event_type = 'Selecciona el tipo de evento';
        if (!form.event_date) errors.event_date = 'La fecha es obligatoria';
        if (!form.location.trim()) errors.location = 'El lugar es obligatorio';
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (field: keyof typeof form, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (fieldErrors[field]) {
            setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Get session fresh to avoid null race condition
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { router.replace('/login'); return; }
        const currentUserId = session.user.id;

        if (!validate()) return;

        setLoading(true);
        setError(null);

        try {
            const slug = generateSlug(form.title, form.event_date);

            const { data, error: insertError } = await supabase
                .from('events')
                .insert({
                    user_id: currentUserId,
                    title: form.title.trim(),
                    event_type: form.event_type,
                    event_date: form.event_date,
                    event_time: form.event_time || null,
                    venue: form.location.trim(),
                    slug,
                    is_published: false,
                })
                .select()
                .single();

            if (insertError) throw insertError;

            setSuccess(true);
            setTimeout(() => {
                router.push('/dashboard');
            }, 1200);
        } catch (err: unknown) {
            console.error('Error al crear evento:', err);
            const sbErr = err as { message?: string; details?: string; hint?: string; code?: string };
            const message = sbErr?.message || sbErr?.details || 'Error desconocido al crear el evento';
            setError(`${message}${sbErr?.hint ? ' — ' + sbErr.hint : ''}${sbErr?.code ? ' (código ' + sbErr.code + ')' : ''}`);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fdfafc]">
                <div className="text-center">
                    <div
                        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                        style={{ background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)' }}
                    >
                        <CheckCircle2 size={36} className="text-green-600" />
                    </div>
                    <h2
                        className="text-2xl font-bold text-[#2d1b2d] mb-2"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        ¡Evento creado!
                    </h2>
                    <p className="text-sm text-[#7a5060]">Redirigiendo al dashboard…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-[#fdfafc]">
            {/* Sidebar */}
            <aside
                className="hidden md:flex w-64 min-h-screen flex-col border-r bg-white flex-shrink-0"
                style={{ borderColor: '#f0dde3' }}
            >
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
                        { href: '/dashboard/nuevo', icon: PlusCircle, label: 'Crear Evento', active: true },
                        { href: '/dashboard/cuenta', icon: User, label: 'Cuenta', active: false },
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
                    <button
                        onClick={async () => {
                            await supabase.auth.signOut();
                            router.replace('/login');
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-sm transition-all hover:bg-red-50 text-red-400 hover:text-red-600"
                    >
                        <LogOut size={16} />
                        Cerrar sesión
                    </button>
                </div>
            </aside>

            {/* Main */}
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
                                <Sparkles size={10} /> Nuevo Proyecto
                            </span>
                            <h1
                                className="text-3xl md:text-4xl font-black text-white"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                Crea algo inolvidable
                            </h1>
                            <p className="text-white/70 text-sm md:text-base max-w-md">
                                Inicia tu viaje digital aquí. Diseña la invitación perfecta para tu gran día.
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

                <div className="max-w-5xl mx-auto px-4 md:px-8 py-10 md:py-16">
                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Main Form Area */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex-1"
                        >
                            <div
                                className="bg-white rounded-[2rem] border p-8 md:p-10 shadow-xl shadow-rose-100/50"
                                style={{ borderColor: '#f0dde3' }}
                            >
                                <div className="mb-10">
                                    <h2
                                        className="text-3xl font-bold text-[#2d1b2d] mb-2"
                                        style={{ fontFamily: "'Playfair Display', serif" }}
                                    >
                                        Detalles del Evento
                                    </h2>
                                    <p className="text-sm text-[#7a5060]/70">
                                        Esta información será la base de tu invitación digital. Puedes editarla después.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                    {/* Title */}
                                    <Field label="Nombre del evento" icon={<Type size={14} />} error={fieldErrors.title}>
                                        <input
                                            type="text"
                                            placeholder="Ej: Boda de Sofía y Roberto"
                                            value={form.title}
                                            onChange={(e) => handleChange('title', e.target.value)}
                                            className={inputClass}
                                            style={{ borderColor: fieldErrors.title ? '#f87171' : '#e8d0d7' }}
                                        />
                                    </Field>

                                    {/* Type */}
                                    <Field label="Tipo de evento" icon={<Tag size={14} />} error={fieldErrors.event_type}>
                                        <select
                                            value={form.event_type}
                                            onChange={(e) => handleChange('event_type', e.target.value)}
                                            className={inputClass}
                                            style={{ borderColor: fieldErrors.event_type ? '#f87171' : '#e8d0d7' }}
                                        >
                                            <option value="">Selecciona el tipo…</option>
                                            {EVENT_TYPES.map((t) => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                        </select>
                                    </Field>

                                    {/* Date + Time */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <Field label="Fecha" icon={<CalendarDays size={14} />} error={fieldErrors.event_date}>
                                            <input
                                                type="date"
                                                value={form.event_date}
                                                onChange={(e) => handleChange('event_date', e.target.value)}
                                                className={inputClass}
                                                style={{ borderColor: fieldErrors.event_date ? '#f87171' : '#e8d0d7' }}
                                            />
                                        </Field>
                                        <Field label="Hora (opcional)" icon={<Clock size={14} />}>
                                            <input
                                                type="time"
                                                value={form.event_time}
                                                onChange={(e) => handleChange('event_time', e.target.value)}
                                                className={inputClass}
                                                style={{ borderColor: '#e8d0d7' }}
                                            />
                                        </Field>
                                    </div>

                                    {/* Location */}
                                    <Field label="Lugar" icon={<MapPin size={14} />} error={fieldErrors.location}>
                                        <input
                                            type="text"
                                            placeholder="Ej: Jardín Villa Toscana, Guadalajara"
                                            value={form.location}
                                            onChange={(e) => handleChange('location', e.target.value)}
                                            className={inputClass}
                                            style={{ borderColor: fieldErrors.location ? '#f87171' : '#e8d0d7' }}
                                        />
                                    </Field>

                                    {/* Error */}
                                    {error && (
                                        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                                            ⚠️ {error}
                                        </div>
                                    )}

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center justify-center gap-3 w-full py-4 rounded-full text-white font-black text-base transition-all hover:scale-[1.02] active:scale-95 shadow-xl disabled:opacity-60 mt-4 h-14"
                                        style={{ background: 'linear-gradient(135deg, #a35d6a, #7B2D8B)' }}
                                    >
                                        {loading ? (
                                            <Loader2 size={20} className="animate-spin" />
                                        ) : (
                                            <>Crear Invitación <ArrowLeft size={18} className="rotate-180" /></>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </motion.div>

                        {/* Tips Sidebar */}
                        <motion.aside
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="lg:w-80 flex flex-col gap-6"
                        >
                            <div className="bg-white rounded-[2rem] border p-6 md:p-8 shadow-sm" style={{ borderColor: '#f0dde3' }}>
                                <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 mb-4">
                                    <Lightbulb size={20} />
                                </div>
                                <h3 className="text-lg font-bold text-[#2d1b2d] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Recuerda que...</h3>
                                <ul className="space-y-4">
                                    {[
                                        { text: "Tu información se guarda de forma segura." },
                                        { text: "Tu evento es privado por defecto hasta que lo publiques." },
                                        { text: "Agregaremos una ubicación interactiva automáticamente." }
                                    ].map((tip, i) => (
                                        <li key={i} className="flex gap-3 text-xs text-[#7a5060]/80 leading-relaxed font-medium">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#7B2D8B] mt-1.5 flex-shrink-0" />
                                            {tip.text}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-[#7B2D8B]/5 rounded-[2rem] p-6 md:p-8 border border-[#7B2D8B]/10">
                                <h3 className="text-sm font-bold text-[#7B2D8B] mb-2">¿Necesitas ayuda?</h3>
                                <p className="text-[11px] text-[#2d1b2d]/60 leading-relaxed mb-4">
                                    Estamos aquí para que tu evento sea perfecto. Escríbenos si tienes dudas.
                                </p>
                                <button className="text-[11px] font-black text-[#7B2D8B] hover:underline flex items-center gap-1">
                                    Contactar soporte <ArrowLeft size={10} className="rotate-180" />
                                </button>
                            </div>
                        </motion.aside>
                    </div>
                </div>
            </main>

            {/* Mobile Bottom Nav */}
            <nav
                className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50 flex items-center justify-around px-2 py-2"
                style={{ borderColor: '#f0dde3' }}
            >
                <Link href="/dashboard" className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl" style={{ color: '#7a5060' }}>
                    <LayoutDashboard size={20} />
                    <span className="text-[10px] font-semibold">Eventos</span>
                </Link>
                <Link href="/dashboard/nuevo" className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl" style={{ color: '#7B2D8B' }}>
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
