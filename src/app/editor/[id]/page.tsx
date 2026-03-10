'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-browser';
import { toast } from 'sonner';
import {
    ArrowLeft, Save, Globe, GlobeLock, Loader2, ChevronDown, ChevronUp,
    Smartphone, Monitor, Copy, Check, Wand2, Upload, Calendar, Clock,
    MapPin, MessageSquare, Shirt, Gift, Type, Palette, X, CheckCircle2,
    Music, Image as ImageIcon, ExternalLink, Eye, Info, Plus, Layout
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────
interface EventData {
    id: string;
    title: string;
    event_type: string;
    event_date: string;
    event_time: string;
    venue: string;
    message: string;
    dress_code: string;
    gift_registry_url: string;
    cover_image_url: string;
    styles_json: Record<string, string>;
    is_published: boolean;
    slug: string;
    // New fields
    music_url: string;
    gallery_urls: string[];
    views: number;
    location_url: string;
    location_waze_url: string;
    // Ceremonial fields
    parents_bride: string;
    parents_groom: string;
    godparents: string;
}

interface Theme {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    font: string;
    style: string;
}

const PRESET_TEMPLATES = [
    {
        name: 'Minimal Gold',
        primary: '#C5A059',
        secondary: '#2D2D2D',
        background: '#FFFFFF',
        text: '#2D2D2D',
        accent: '#F4EBE0',
        font: 'Playfair Display'
    },
    {
        name: 'Royal Navy',
        primary: '#1B2B48',
        secondary: '#C5A059',
        background: '#F8F9FA',
        text: '#1B2B48',
        accent: '#D4AF37',
        font: 'Cinzel'
    },
    {
        name: 'Tropical Bloom',
        primary: '#E94E77',
        secondary: '#2E8B57',
        background: '#FDFCF0',
        text: '#2D2D2D',
        accent: '#F1D4D4',
        font: 'Montserrat'
    },
    {
        name: 'Modern Rose',
        primary: '#A35D6A',
        secondary: '#7B2D8B',
        background: '#FAF5F7',
        text: '#4A2C2C',
        accent: '#E8C49A',
        font: 'Alex Brush'
    }
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const inputCls =
    'w-full px-3 py-2.5 rounded-xl border text-sm text-[#2d1b2d] placeholder:text-gray-300 ' +
    'focus:outline-none focus:ring-2 focus:ring-[#a35d6a]/20 focus:border-[#a35d6a] transition-all bg-white';
const borderColor = '#e8d0d7';

function SectionHeader({
    icon, title, open, onToggle,
}: { icon: React.ReactNode; title: string; open: boolean; onToggle: () => void }) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-sm text-[#2d1b2d] hover:bg-rose-50/50 transition-colors"
        >
            <span className="flex items-center gap-2.5 text-[#a35d6a]">
                {icon}
                <span className="text-[#2d1b2d]">{title}</span>
            </span>
            {open ? <ChevronUp size={16} className="text-[#a35d6a]" /> : <ChevronDown size={16} className="text-gray-400" />}
        </button>
    );
}

// ─── Invitation Preview ───────────────────────────────────────────────────────
function InvitationPreview({ data }: { data: EventData }) {
    const theme = data.styles_json || {};
    const bg = theme.background || '#fdf8f0';
    const primary = theme.primary || '#a35d6a';
    const secondary = theme.secondary || '#7B2D8B';
    const accent = theme.accent || '#e8c49a';
    const textColor = theme.text || '#2d1b2d';
    const font = theme.font || 'Playfair Display';

    const formattedDate = data.event_date
        ? new Date(data.event_date + 'T12:00:00').toLocaleDateString('es-MX', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        })
        : null;

    return (
        <div
            className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden text-center"
            style={{ background: bg, fontFamily: `'${font}', serif` }}
        >
            {/* Cover image */}
            {data.cover_image_url ? (
                <div className="absolute inset-0">
                    <img src={data.cover_image_url} alt="cover" className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.45)' }} />
                </div>
            ) : (
                <div
                    className="absolute inset-0 opacity-20"
                    style={{ background: `radial-gradient(ellipse at center, ${accent}88, ${primary}44)` }}
                />
            )}

            {/* Content Container */}
            <div
                className="relative z-10 flex flex-col items-center px-6 py-8 gap-3"
                style={{ color: data.cover_image_url ? '#fff' : textColor }}
            >
                <span
                    className="text-[9px] font-bold tracking-[0.3em] uppercase px-3 py-1 rounded-full"
                    style={{
                        background: data.cover_image_url ? 'rgba(255,255,255,0.2)' : `${primary}22`,
                        color: data.cover_image_url ? '#fff' : primary,
                    }}
                >
                    {data.event_type || 'Invitación'}
                </span>

                <h2
                    className="text-2xl font-bold leading-tight"
                    style={{
                        fontFamily: `'${font}', serif`,
                        textShadow: data.cover_image_url ? '0 2px 10px rgba(0,0,0,0.5)' : 'none'
                    }}
                >
                    {data.title || 'Tu invitación'}
                </h2>

                {/* Family Info */}
                {(data.parents_bride || data.parents_groom || data.godparents) && (
                    <div className="flex flex-col gap-1 mt-1 opacity-70">
                        {data.event_type === 'Boda' ? (
                            <>
                                {data.parents_bride && <p className="text-[9px] uppercase tracking-widest leading-tight">Padres de la Novia: <span className="font-bold">{data.parents_bride}</span></p>}
                                {data.parents_groom && <p className="text-[9px] uppercase tracking-widest leading-tight">Padres del Novio: <span className="font-bold">{data.parents_groom}</span></p>}
                            </>
                        ) : (
                            <>
                                {data.parents_bride && <p className="text-[9px] uppercase tracking-widest leading-tight">Padres: <span className="font-bold">{data.parents_bride}</span></p>}
                                {data.godparents && <p className="text-[9px] uppercase tracking-widest leading-tight">Padrinos: <span className="font-bold">{data.godparents}</span></p>}
                            </>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-3 w-full max-w-[160px]">
                    <div className="h-[1px] flex-1" style={{ background: data.cover_image_url ? 'rgba(255,255,255,0.4)' : accent }} />
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: data.cover_image_url ? '#fff' : accent }} />
                    <div className="h-[1px] flex-1" style={{ background: data.cover_image_url ? 'rgba(255,255,255,0.4)' : accent }} />
                </div>

                {formattedDate && (
                    <p className="text-[10px] font-semibold tracking-widest uppercase opacity-90 capitalize">
                        {formattedDate}
                    </p>
                )}

                {(data.event_time || data.venue) && (
                    <div className="flex flex-col gap-1 text-[10px] opacity-80">
                        {data.event_time && <span>{data.event_time} hrs</span>}
                        {data.venue && <span className="max-w-[180px]">{data.venue}</span>}
                    </div>
                )}

                {data.message && (
                    <p className="text-[10px] leading-relaxed opacity-80 max-w-[180px] mt-1 italic">
                        "{data.message}"
                    </p>
                )}

                {data.dress_code && (
                    <span
                        className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full mt-1"
                        style={{
                            background: data.cover_image_url ? 'rgba(255,255,255,0.15)' : `${secondary}15`,
                            color: data.cover_image_url ? 'rgba(255,255,255,0.9)' : secondary,
                        }}
                    >
                        👗 {data.dress_code}
                    </span>
                )}
            </div>
        </div>
    );
}

// ─── Editor Main Page ────────────────────────────────────────────────────────
export default function EditorPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();

    const [eventData, setEventData] = useState<EventData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isPublished, setIsPublished] = useState(false);
    const [isGeneratingTheme, setIsGeneratingTheme] = useState(false);
    const [generatedTheme, setGeneratedTheme] = useState<Theme | null>(null);
    const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
    const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');
    const [hasChanges, setHasChanges] = useState(false);
    const [themePrompt, setThemePrompt] = useState('');
    const [saveStatus, setSaveStatus] = useState<'saved' | 'unsaved'>('saved');
    const [copied, setCopied] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [galleryLoading, setGalleryLoading] = useState(false);
    const [userPlan, setUserPlan] = useState('free');
    const [openSections, setOpenSections] = useState({ info: true, templates: false, personal: false, theme: false, extra: false });
    const [titleEditing, setTitleEditing] = useState(false);
    const autoSaveRef = useRef<NodeJS.Timeout | null>(null);

    // ── Load event ─────────────────────────────────────────────────────────────
    useEffect(() => {
        const load = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { router.replace('/login'); return; }

            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('id', id)
                .eq('user_id', session.user.id)
                .single();

            if (error || !data) { router.replace('/dashboard'); return; }

            setEventData(data as EventData);
            setIsPublished(data.is_published);
            setLoading(false);

            const { data: profile } = await supabase.from('profiles').select('plan').eq('id', session.user.id).single();
            if (profile) setUserPlan(profile.plan);
        };
        load();
    }, [id, router]);

    // ── Auto-save every 30s ────────────────────────────────────────────────────
    useEffect(() => {
        if (!hasChanges || !eventData) return;
        if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
        autoSaveRef.current = setTimeout(() => handleSave(true), 30000);
        return () => { if (autoSaveRef.current) clearTimeout(autoSaveRef.current); };
    }, [eventData, hasChanges]);

    // ── Helpers ────────────────────────────────────────────────────────────────
    const update = (field: keyof EventData, value: any) => {
        setEventData(prev => prev ? { ...prev, [field]: value } : null);
        setHasChanges(true);
        setSaveStatus('unsaved');
    };

    const toggleSection = (s: keyof typeof openSections) =>
        setOpenSections(prev => ({ ...prev, [s]: !prev[s] }));

    const handleSave = useCallback(async (auto = false) => {
        if (!eventData) return;
        setIsSaving(true);
        const { error } = await supabase.from('events').update({
            title: eventData.title,
            event_date: eventData.event_date || null,
            event_time: eventData.event_time || null,
            venue: eventData.venue,
            message: eventData.message,
            dress_code: eventData.dress_code,
            gift_registry_url: eventData.gift_registry_url,
            cover_image_url: eventData.cover_image_url,
            styles_json: eventData.styles_json || {},
            music_url: eventData.music_url,
            gallery_urls: eventData.gallery_urls || [],
            location_url: eventData.location_url,
            location_waze_url: eventData.location_waze_url,
            parents_bride: eventData.parents_bride,
            parents_groom: eventData.parents_groom,
            godparents: eventData.godparents,
        }).eq('id', eventData.id);

        if (!error && !auto) {
            toast.success('Cambios guardados correctamente');
        } else if (error) {
            console.error('Save error:', error);
            toast.error(`Error: ${error.message || 'No se pudo guardar. Verifica tu conexión.'}`);
        }

        setIsSaving(false);
        setHasChanges(false);
        setSaveStatus('saved');
    }, [eventData]);

    const handlePublish = async () => {
        if (!eventData) return;
        await handleSave(true);
        const newVal = !isPublished;
        const { error } = await supabase.from('events').update({ is_published: newVal }).eq('id', eventData.id);
        if (!error) {
            setIsPublished(newVal);
            toast.success(newVal ? 'Invitación publicada ✨' : 'Invitación despublicada');
        }
    };

    const handleFileUpload = async (file: File) => {
        if (!eventData) return;
        setUploadLoading(true);
        try {
            const ext = file.name.split('.').pop();
            const fileName = `cover_${Date.now()}.${ext}`;
            const path = `${eventData.id}/${fileName}`;
            const { error: uploadError } = await supabase.storage.from('covers').upload(path, file, { upsert: true });
            if (uploadError) throw uploadError;
            const { data: { publicUrl } } = supabase.storage.from('covers').getPublicUrl(path);
            update('cover_image_url', publicUrl);
            await supabase.from('events').update({ cover_image_url: publicUrl }).eq('id', eventData.id);
            toast.success('Portada actualizada');
        } catch (e: any) { toast.error('Error al subir: ' + e.message); }
        finally { setUploadLoading(false); }
    };

    const handleGalleryUpload = async (files: FileList) => {
        if (!eventData) return;
        setGalleryLoading(true);
        const currentUrls = [...(eventData.gallery_urls || [])];
        const newUrls = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const ext = file.name.split('.').pop();
            const fileName = `gallery_${Date.now()}_${i}.${ext}`;
            const path = `${eventData.id}/gallery/${fileName}`;
            const { error } = await supabase.storage.from('covers').upload(path, file);
            if (!error) {
                const { data: { publicUrl } } = supabase.storage.from('covers').getPublicUrl(path);
                newUrls.push(publicUrl);
            }
        }

        const updated = [...currentUrls, ...newUrls];
        update('gallery_urls', updated);
        await supabase.from('events').update({ gallery_urls: updated }).eq('id', eventData.id);
        setGalleryLoading(false);
        toast.success(`Se subieron ${newUrls.length} fotos`);
    };

    const removeGalleryImage = async (url: string) => {
        if (!eventData) return;
        const updated = eventData.gallery_urls.filter(u => u !== url);
        update('gallery_urls', updated);
        await supabase.from('events').update({ gallery_urls: updated }).eq('id', eventData.id);
    };

    const handleGenerateTheme = async () => {
        setIsGeneratingTheme(true);
        setGeneratedTheme(null);
        try {
            const res = await fetch('/api/ai/theme', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: themePrompt, eventType: eventData?.event_type }),
            });
            const theme = await res.json();
            setGeneratedTheme(theme);
            toast.success('¡Tema generado con IA!');
        } catch { toast.error('Error al generar tema'); }
        setIsGeneratingTheme(false);
    };

    const applyTheme = () => {
        if (!generatedTheme) return;
        update('styles_json', generatedTheme as any);
        setGeneratedTheme(null);
        setThemePrompt('');
        toast.success('Tema aplicado');
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-[#a35d6a]" size={36} /></div>;
    if (!eventData) return null;

    const planColors: Record<string, { bg: string; text: string; label: string }> = {
        free: { bg: '#f3f4f6', text: '#6b7280', label: 'Gratis' },
        basico: { bg: '#dbeafe', text: '#1d4ed8', label: 'Básico' },
        rsvp: { bg: '#d1fae5', text: '#065f46', label: 'RSVP' },
        premium: { bg: '#ede9fe', text: '#6d28d9', label: 'Premium' },
    };
    const plan = planColors[userPlan] || planColors.free;

    return (
        <div className="min-h-screen flex flex-col bg-[#fdfafc]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {/* ── TOP BAR ──────────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-b z-20 gap-2" style={{ borderColor }}>
                {/* Left: back + title */}
                <div className="flex items-center gap-2 min-w-0">
                    <Link href="/dashboard" className="flex items-center gap-1 text-xs text-[#7a5060] hover:text-[#a35d6a] transition-colors flex-shrink-0">
                        <ArrowLeft size={15} />
                        <span className="hidden sm:inline">Dashboard</span>
                    </Link>
                    <span className="text-[#e8d0d7] hidden sm:inline">/</span>
                    {titleEditing ? (
                        <input autoFocus value={eventData.title} onChange={(e) => update('title', e.target.value)} onBlur={() => setTitleEditing(false)} className="text-sm font-bold text-[#2d1b2d] border-b border-[#a35d6a] bg-transparent outline-none w-32 md:w-48" />
                    ) : (
                        <button onClick={() => setTitleEditing(true)} className="text-sm font-bold text-[#2d1b2d] hover:text-[#a35d6a] transition-colors truncate max-w-[130px] md:max-w-[200px] text-left hidden sm:block">{eventData.title}</button>
                    )}
                </div>

                {/* Right: status + save + publish */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Save status - desktop only */}
                    <span className="text-[10px] text-gray-400 hidden md:block">
                        {isSaving ? '💾 Guardando…' : saveStatus === 'unsaved' ? '● Sin guardar' : '✓ Guardado'}
                    </span>
                    {/* Views badge - desktop only */}
                    <div className="hidden md:flex items-center gap-1 text-[11px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                        <Eye size={10} /> {eventData.views || 0}
                    </div>
                    {/* Save button: icon-only on mobile */}
                    <button onClick={() => handleSave()} disabled={isSaving || !hasChanges}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold border transition-all disabled:opacity-40"
                        style={{ borderColor, color: '#7a5060' }}
                    >
                        {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                        <span className="hidden sm:inline">Guardar</span>
                    </button>
                    {/* Publish button */}
                    <button onClick={handlePublish}
                        className="flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-full text-xs font-bold text-white transition-all hover:opacity-90"
                        style={{ background: isPublished ? '#ef4444' : 'linear-gradient(135deg, #a35d6a, #7B2D8B)' }}
                    >
                        {isPublished ? <GlobeLock size={12} /> : <Globe size={12} />}
                        <span className="hidden sm:inline">{isPublished ? 'Despublicar' : 'Publicar'}</span>
                    </button>
                </div>
            </div>

            {/* Mobile Tab Switcher */}
            <div className="flex md:hidden border-b bg-white" style={{ borderColor }}>
                <button
                    onClick={() => setMobileTab('edit')}
                    className={`flex-1 py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${mobileTab === 'edit' ? 'text-[#a35d6a] border-b-2 border-[#a35d6a]' : 'text-gray-400'
                        }`}
                >
                    <Palette size={14} /> Editar
                </button>
                <button
                    onClick={() => setMobileTab('preview')}
                    className={`flex-1 py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${mobileTab === 'preview' ? 'text-[#a35d6a] border-b-2 border-[#a35d6a]' : 'text-gray-400'
                        }`}
                >
                    <Smartphone size={14} /> Vista previa
                </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* ── LEFT PANEL ─────────────────────────────────────────────────── */}
                <div className={`${mobileTab === 'edit' ? 'flex' : 'hidden'} md:flex w-full md:w-[40%] md:min-w-[340px] flex-col border-r overflow-y-auto bg-white`} style={{ borderColor }}>

                    {/* INFO SECTION */}
                    <div className="border-b" style={{ borderColor }}>
                        <SectionHeader icon={<Type size={15} />} title="Información del evento" open={openSections.info} onToggle={() => toggleSection('info')} />
                        {openSections.info && (
                            <div className="px-5 pb-5 flex flex-col gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-[#7a5060] mb-1.5 block">Título del evento</label>
                                    <input value={eventData.title} onChange={(e) => update('title', e.target.value)} placeholder="Ej: Boda de Laura y Marco" className={inputCls} style={{ borderColor }} />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div><label className="text-xs font-semibold text-[#7a5060] mb-1.5 flex items-center gap-1.5"><Calendar size={11} /> Fecha</label><input type="date" value={eventData.event_date || ''} onChange={(e) => update('event_date', e.target.value)} className={inputCls} style={{ borderColor }} /></div>
                                    <div><label className="text-xs font-semibold text-[#7a5060] mb-1.5 flex items-center gap-1.5"><Clock size={11} /> Hora</label><input type="time" value={eventData.event_time || ''} onChange={(e) => update('event_time', e.target.value)} className={inputCls} style={{ borderColor }} /></div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-[#7a5060] mb-1.5 flex items-center gap-1.5"><MapPin size={11} /> Lugar / Salón</label>
                                    <input value={eventData.venue || ''} onChange={(e) => update('venue', e.target.value)} placeholder="Ej: Terraza Jacarandas, Sala 4" className={inputCls} style={{ borderColor }} />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-[#7a5060] mb-1.5 flex items-center gap-1.5"><MessageSquare size={11} /> Mensaje especial</label>
                                    <textarea value={eventData.message || ''} onChange={(e) => update('message', e.target.value)} placeholder="Unas palabras cortas para tus invitados..." rows={2} className={inputCls + ' resize-none'} style={{ borderColor }} />
                                </div>

                                {/* Dynamic fields based on event type */}
                                {eventData.event_type === 'Boda' && (
                                    <>
                                        <div>
                                            <label className="text-xs font-semibold text-[#7a5060] mb-1.5 block">Padres de la Novia</label>
                                            <input value={eventData.parents_bride || ''} onChange={(e) => update('parents_bride', e.target.value)} placeholder="Ej: Diana y Robert" className={inputCls} style={{ borderColor }} />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-[#7a5060] mb-1.5 block">Padres del Novio</label>
                                            <input value={eventData.parents_groom || ''} onChange={(e) => update('parents_groom', e.target.value)} placeholder="Ej: Martha y Luis" className={inputCls} style={{ borderColor }} />
                                        </div>
                                    </>
                                )}
                                {(eventData.event_type === 'Bautizo' || eventData.event_type === 'Primera Comunión' || eventData.event_type === 'XV Años') && (
                                    <>
                                        <div>
                                            <label className="text-xs font-semibold text-[#7a5060] mb-1.5 block">Padres</label>
                                            <input value={eventData.parents_bride || ''} onChange={(e) => update('parents_bride', e.target.value)} placeholder="Ej: Diana y Robert" className={inputCls} style={{ borderColor }} />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-[#7a5060] mb-1.5 block">Padrinos</label>
                                            <input value={eventData.godparents || ''} onChange={(e) => update('godparents', e.target.value)} placeholder="Ej: Martha y Luis" className={inputCls} style={{ borderColor }} />
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* MASTER TEMPLATES SECTION */}
                    <div className="border-b" style={{ borderColor }}>
                        <SectionHeader icon={<Layout size={15} />} title="Plantillas Maestras" open={openSections.templates} onToggle={() => toggleSection('templates')} />
                        {openSections.templates && (
                            <div className="px-5 pb-5 grid grid-cols-2 gap-3">
                                {PRESET_TEMPLATES.map((tmpl) => (
                                    <button
                                        key={tmpl.name}
                                        onClick={() => {
                                            update('styles_json', { ...tmpl } as any);
                                            toast.success(`Estilo "${tmpl.name}" aplicado`);
                                        }}
                                        className="group relative flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all hover:scale-105 active:scale-95 text-center overflow-hidden"
                                        style={{ borderColor }}
                                    >
                                        <div className="w-full h-12 rounded-lg mb-1 flex items-center justify-center relative overflow-hidden" style={{ background: tmpl.background }}>
                                            <div className="absolute inset-0 opacity-10" style={{ background: `linear-gradient(135deg, ${tmpl.primary}, ${tmpl.secondary})` }} />
                                            <span className="text-xl font-bold" style={{ color: tmpl.primary, fontFamily: `'${tmpl.font}', serif` }}>Aa</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-[#7a5060] uppercase tracking-wider">{tmpl.name}</span>
                                        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, ${tmpl.primary}, ${tmpl.secondary})` }} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* PERSONALIZATION SECTION */}
                    <div className="border-b" style={{ borderColor }}>
                        <SectionHeader icon={<Palette size={15} />} title="Personalización" open={openSections.personal} onToggle={() => toggleSection('personal')} />
                        {openSections.personal && (
                            <div className="px-5 pb-5 flex flex-col gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-[#7a5060] mb-1.5 flex items-center gap-1.5"><Shirt size={11} /> Código de vestimenta</label>
                                    <select value={eventData.dress_code || ''} onChange={(e) => update('dress_code', e.target.value)} className={inputCls} style={{ borderColor }}>
                                        <option value="">Selecciona...</option>
                                        <option value="Formal">Formal</option>
                                        <option value="Etiqueta">Etiqueta</option>
                                        <option value="Cóctel">Cóctel</option>
                                        <option value="Guayabera / Playa">Guayabera / Playa</option>
                                        <option value="Casual">Casual</option>
                                        <option value="Blanco obligado">Todo de blanco</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-[#7a5060] mb-1.5 flex items-center gap-1.5"><Upload size={11} /> Foto de portada</label>
                                    <label className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-dashed text-xs font-bold cursor-pointer hover:bg-rose-50 transition-all" style={{ borderColor: '#e8d0d7', color: '#a35d6a' }}>
                                        {uploadLoading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                        {eventData.cover_image_url ? 'Cambiar imagen' : 'Subir imagen principal'}
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />
                                    </label>
                                    {eventData.cover_image_url && (
                                        <div className="mt-2 relative group rounded-lg overflow-hidden h-20 border" style={{ borderColor }}>
                                            <img src={eventData.cover_image_url} alt="cover" className="w-full h-full object-cover" />
                                            <button onClick={() => update('cover_image_url', '')} className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><X size={16} /></button>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-2">
                                    <label className="text-xs font-semibold text-[#7a5060] mb-1.5 flex items-center gap-1.5"><ImageIcon size={11} /> Galería de fotos (hasta 10)</label>
                                    <label className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border text-[11px] font-bold bg-white hover:bg-rose-50 cursor-pointer transition-all disabled:opacity-50" style={{ borderColor: '#e8d0d7', color: '#7a5060' }}>
                                        {galleryLoading ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />} Subir fotos...
                                        <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => e.target.files && handleGalleryUpload(e.target.files)} disabled={galleryLoading} />
                                    </label>
                                    {eventData.gallery_urls?.length > 0 && (
                                        <div className="grid grid-cols-4 gap-2 mt-3">
                                            {eventData.gallery_urls.map((url, i) => (
                                                <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border">
                                                    <img src={url} alt="Gallery" className="w-full h-full object-cover" />
                                                    <button onClick={() => removeGalleryImage(url)} className="absolute top-1 right-1 p-1 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-red-500"><X size={10} /></button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* EXTRA SECTION */}
                    <div className="border-b" style={{ borderColor }}>
                        <SectionHeader icon={<Music size={15} />} title="Música y Mapas" open={openSections.extra} onToggle={() => toggleSection('extra')} />
                        {openSections.extra && (
                            <div className="px-5 pb-5 flex flex-col gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-[#7a5060] mb-1.5 flex items-center gap-1.5"><Music size={11} /> URL de Música (Link directo MP3 o YouTube)</label>
                                    <input value={eventData.music_url || ''} onChange={(e) => update('music_url', e.target.value)} placeholder="https://..." className={inputCls} style={{ borderColor }} />
                                    <p className="text-[10px] text-gray-400 mt-1">Se reproducirá automáticamente al abrir la invitación.</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-[#7a5060] mb-1.5 flex items-center gap-1.5"><MapPin size={11} /> Link Google Maps</label>
                                    <input value={eventData.location_url || ''} onChange={(e) => update('location_url', e.target.value)} placeholder="https://goo.gl/maps/..." className={inputCls} style={{ borderColor }} />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-[#7a5060] mb-1.5 flex items-center gap-1.5"><MapPin size={11} /> Link Waze</label>
                                    <input value={eventData.location_waze_url || ''} onChange={(e) => update('location_waze_url', e.target.value)} placeholder="https://waze.com/ul/..." className={inputCls} style={{ borderColor }} />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-[#7a5060] mb-1.5 flex items-center gap-1.5"><Gift size={11} /> Mesa de regalos</label>
                                    <input value={eventData.gift_registry_url || ''} onChange={(e) => update('gift_registry_url', e.target.value)} placeholder="URL de Liverpool, Amazon, Amalia, etc." className={inputCls} style={{ borderColor }} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* AI THEME SECTION */}
                    <div className="border-b" style={{ borderColor }}>
                        <SectionHeader icon={<Wand2 size={15} />} title="Tema con Inteligencia Artificial" open={openSections.theme} onToggle={() => toggleSection('theme')} />
                        {openSections.theme && (
                            <div className="px-5 pb-5 flex flex-col gap-4">
                                <p className="text-[11px] text-[#7a5060]">Describe el estilo que imaginas y crearé una paleta de colores y tipografía perfecta.</p>
                                <textarea value={themePrompt} onChange={(e) => setThemePrompt(e.target.value)} placeholder="Ej: Boda frente al mar, estilo boho con colores arena y menta..." rows={3} className={inputCls + ' resize-none'} style={{ borderColor }} />
                                <button onClick={handleGenerateTheme} disabled={isGeneratingTheme || !themePrompt.trim()} className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-xs font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 shadow-md" style={{ background: 'linear-gradient(135deg, #a35d6a, #7B2D8B)' }}>
                                    {isGeneratingTheme ? <><Loader2 size={14} className="animate-spin" /> Esculpiedo tu tema…</> : <><Wand2 size={14} /> Crear tema con IA</>}
                                </button>
                                {generatedTheme && (
                                    <div className="rounded-xl border p-4 flex flex-col gap-3 shadow-sm" style={{ borderColor: '#e8d0d7', background: generatedTheme.background }}>
                                        <p className="text-[11px] font-bold" style={{ color: generatedTheme.text }}>✨ Estilo {generatedTheme.style}</p>
                                        <div className="flex gap-2">
                                            {[generatedTheme.primary, generatedTheme.secondary, generatedTheme.accent].map((c, i) => (
                                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" style={{ background: c }} />
                                            ))}
                                            <span className="text-[10px] uppercase tracking-wider font-bold opacity-50 ml-1 self-center">{generatedTheme.font}</span>
                                        </div>
                                        <button onClick={applyTheme} className="text-[11px] font-bold py-2 rounded-full text-white transition-all hover:opacity-90" style={{ background: generatedTheme.primary }}>Aplicar este tema</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="p-5 flex flex-col gap-3 mt-auto sticky bottom-0 bg-white border-t" style={{ borderColor }}>
                        <button onClick={() => handleSave()} disabled={isSaving || !hasChanges} className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-bold border transition-all disabled:opacity-40 hover:bg-gray-50" style={{ borderColor, color: '#7a5060' }}>
                            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Guardar borrador
                        </button>
                        <button onClick={handlePublish} className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-bold text-white transition-all hover:opacity-90 shadow-lg" style={{ background: isPublished ? '#ef4444' : 'linear-gradient(135deg, #a35d6a, #7B2D8B)' }}>
                            {isPublished ? <GlobeLock size={14} /> : <Globe size={14} />} {isPublished ? 'Despublicar invitación' : 'Publicar invitación'}
                        </button>
                    </div>
                </div>

                {/* ── RIGHT PANEL: PREVIEW ────────────────────────────────────────── */}
                <div className={`${mobileTab === 'preview' ? 'flex' : 'hidden'} md:flex flex-1 flex-col items-center justify-start py-4 md:py-8 px-4 overflow-y-auto bg-[#f5f0f5]`}>
                    {/* Desktop: show toggle + Vista publica. Mobile: only Vista publica */}
                    <div className="flex items-center justify-between w-full max-w-sm mb-4 md:mb-8 bg-white/50 p-1.5 rounded-full border border-white">
                        <div className="hidden md:flex gap-1">
                            {(['mobile', 'desktop'] as const).map((m) => (
                                <button key={m} onClick={() => setPreviewMode(m)} className={`p-2 rounded-full transition-all ${previewMode === m ? 'bg-white shadow-sm text-[#a35d6a]' : 'text-gray-400'}`}>
                                    {m === 'mobile' ? <Smartphone size={16} /> : <Monitor size={16} />}
                                </button>
                            ))}
                        </div>
                        <Link href={`/invite/${eventData.slug}`} target="_blank" className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-bold text-[#a35d6a] hover:bg-white transition-all mx-auto md:mx-0"><ExternalLink size={12} /> Vista pública</Link>
                    </div>

                    <div className={`transition-all duration-500 w-full md:w-auto ${previewMode === 'mobile' || mobileTab === 'preview'
                        ? 'max-w-[320px] md:max-w-[280px] aspect-[9/19.5]'
                        : 'max-w-sm aspect-[9/16]'
                        }`}>
                        <div className="relative bg-[#1a1a2e] rounded-[44px] shadow-[0_40px_100px_rgba(0,0,0,0.3)] border border-white/10 overflow-hidden w-full h-full">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#1a1a2e] z-30 rounded-b-3xl" />
                            <div className="w-full h-full rounded-[37px] overflow-hidden"><InvitationPreview data={eventData} /></div>
                        </div>
                    </div>

                    {/* Only show URL hint on desktop */}
                    <div className="hidden md:flex mt-8 flex-col items-center gap-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest"><Info size={12} /> Vista móvil optimizada</div>
                        <p className="text-[10px] text-gray-400 font-medium">giovis.app/invite/{eventData.slug}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
