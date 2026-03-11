'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { MapPin, Calendar, CheckCircle2, X, Loader2, Music, Volume2, VolumeX, Navigation, ExternalLink, Gift, Clock, Camera, Shield, QrCode, Phone, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { QRCodeCanvas } from 'qrcode.react';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface EventData {
    id: string;
    title: string;
    event_type: string;
    event_date: string;
    event_time: string;
    venue: string;
    message: string;
    cover_image_url: string;
    styles_json: Record<string, any>;
    slug: string;
    dress_code: string;
    gift_registry_url: string;
    music_url: string;
    gallery_urls: string[];
    location_url: string;
    location_waze_url: string;
    parents_bride: string;
    security_enabled: boolean;
    language: string;
    date_format: string;
    time_format: string;
    timezone: string;
    parents_bride_father: string;
    parents_bride_father_deceased: boolean;
    parents_bride_mother: string;
    parents_bride_mother_deceased: boolean;
    parents_groom_father: string;
    parents_groom_father_deceased: boolean;
    parents_groom_mother: string;
    parents_groom_mother_deceased: boolean;
}

interface RSVP {
    status: 'confirmed' | 'declined' | 'pending';
    companions: number;
    dietary_restrictions: string;
    message: string;
    responded_at: string | null;
    confirmed_members_json: string[];
    is_checked_in: boolean;
    checked_in_at: string | null;
}

interface Guest {
    id: string;
    name: string;
    invitation_token: string;
    is_group: boolean;
    members_json: string[];
    rsvp: RSVP | null;
}

interface TimeLeft { days: number; hours: number; minutes: number; seconds: number; }

const TRANSLATIONS: Record<string, any> = {
    es: {
        invitation: "Invitación",
        blessing: "Con la bendición de nuestros padres:",
        parents: "Padres",
        godparents: "Padrinos",
        days: "Días",
        hours: "Horas",
        minutes: "Minutos",
        seconds: "Segundos",
        galleryTitle: "Nuestra Galería",
        giftRegistry: "Mesa de Regalos",
        giftBtn: "Ver Mesa de Regalos",
        giftSuggestion: "Su presencia es nuestro mejor regalo, pero si desean obsequiarnos algo, aquí tienen nuestras sugerencias.",
        vipPass: "Pase Digital VIP",
        vipDesc: "Este es tu pase personalizado. Favor de presentarlo en la entrada.",
        venue: "Ubicación",
        viewMaps: "Ver en Maps",
        viewWaze: "Ver en Waze",
        confirmBtn: "Confirmar Asistencia",
        alreadyConfirmed: "¡Ya confirmé!",
        notAvailable: "Invitación No Disponible",
        notValid: "El link no es válido o ha sido despublicado por el anfitrión.",
        dressCode: "Código de Vestimenta",
        at: "a las",
        confirmed: "Inscríbeme / Asistiré",
        declined: "No podré asistir",
        rsvpTitle: "RSVP · Confirmación",
        rsvpDesc: "Por favor, confirma tu asistencia antes del evento.",
        companions: "Acompañantes adicionales",
        dietary: "¿Alguna restricción alimentaria?",
        message: "Mensaje para los anfitriones",
        sendRSVP: "Enviar Confirmación",
        thanks: "¡Muchas gracias!",
        thanksDesc: "Tu respuesta ha sido registrada. ¡Nos vemos pronto!",
        timeToWait: "Solo faltan",
        addCalendar: "Agendar en mi Calendario",
        eventWall: "Muro del Evento",
        sharePhotos: "Comparte tus fotos",
        uploadDesc: "¡Sube tus mejores momentos de la fiesta!",
        uploadBtn: "Subir Foto",
        swipeMore: "Desliza para ver más",
        passInstructions: "Presenta este código al llegar para registrar tu entrada",
        viewPass: "Ver mi Pase Digital"
    },
    en: {
        invitation: "Invitation",
        blessing: "With the blessing of our parents:",
        parents: "Parents",
        godparents: "Godparents",
        days: "Days",
        hours: "Hours",
        minutes: "Minutes",
        seconds: "Seconds",
        galleryTitle: "Our Gallery",
        giftRegistry: "Gift Registry",
        giftBtn: "View Registry",
        giftSuggestion: "Your presence is our best gift, but if you wish to give us something, here are our suggestions.",
        vipPass: "Digital VIP Pass",
        vipDesc: "This is your personalized pass. Please present it at the entrance.",
        venue: "Venue / Location",
        viewMaps: "View in Maps",
        viewWaze: "View in Waze",
        confirmBtn: "Confirm Attendance",
        alreadyConfirmed: "Already Confirmed!",
        notAvailable: "Invitation Not Available",
        notValid: "The link is invalid or has been unpublished by the host.",
        dressCode: "Dress Code",
        at: "at",
        confirmed: "Count me in / I will attend",
        declined: "I can't attend",
        rsvpTitle: "RSVP · Confirmation",
        rsvpDesc: "Please confirm your attendance before the event.",
        companions: "Additional companions",
        dietary: "Any dietary restrictions?",
        message: "Message for the hosts",
        sendRSVP: "Send Confirmation",
        thanks: "Thank you!",
        thanksDesc: "Your response has been recorded. See you soon!",
        timeToWait: "Time left",
        addCalendar: "Add to my Calendar",
        eventWall: "Event Wall",
        sharePhotos: "Share your photos",
        uploadDesc: "Upload your best party moments!",
        uploadBtn: "Upload Photo",
        swipeMore: "Swipe to see more",
        passInstructions: "Present this code upon arrival to register your entry",
        viewPass: "View My Digital Pass"
    }
};

function useCountdown(targetDate: string): TimeLeft {
    const calc = () => {
        const diff = new Date(targetDate + 'T12:00:00').getTime() - Date.now();
        if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        return {
            days: Math.floor(diff / 86400000),
            hours: Math.floor((diff % 86400000) / 3600000),
            minutes: Math.floor((diff % 3600000) / 60000),
            seconds: Math.floor((diff % 60000) / 1000),
        };
    };
    const [t, setT] = useState<TimeLeft>(calc);
    useEffect(() => {
        const id = setInterval(() => setT(calc()), 1000);
        return () => clearInterval(id);
    }, [targetDate]);
    return t;
}

// ─── RSVP Modal ──────────────────────────────────────────────────────────────
function RSVPModal({ event, guest, onClose, onRefresh }: { event: EventData; guest: Guest | null; onClose: () => void; onRefresh: () => void }) {
    const [step, setStep] = useState<'form' | 'success'>('form');
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(guest?.name || '');
    const [attending, setAttending] = useState<'yes' | 'no' | null>(guest?.rsvp?.status || null);
    const [companions, setCompanions] = useState(guest?.rsvp?.companions || 0);
    const [dietary, setDietary] = useState(guest?.rsvp?.dietary_restrictions || '');
    const [msg, setMsg] = useState(guest?.rsvp?.message || '');
    const [confirmedMembers, setConfirmedMembers] = useState<string[]>(guest?.rsvp?.confirmed_members_json || (guest?.is_group ? guest.members_json : []));

    const theme = event.styles_json || {};
    const primaryColor = theme.primary || '#a35d6a';
    const lang = event.language === 'en' ? 'en' : 'es';
    const t = TRANSLATIONS[lang];

    const toggleMember = (m: string) => {
        setConfirmedMembers(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!attending || !name.trim()) return;
        setLoading(true);

        let activeGuestId = guest?.id;

        if (!activeGuestId) {
            const { data: newGuest } = await supabase
                .from('guests')
                .insert({ event_id: event.id, name: name.trim() })
                .select()
                .single();
            if (newGuest) activeGuestId = newGuest.id;
        }

        if (activeGuestId) {
            const { error } = await supabase.from('rsvp').upsert({
                guest_id: activeGuestId,
                event_id: event.id,
                status: attending === 'yes' ? 'confirmed' : 'declined',
                companions: attending === 'yes' ? (guest?.is_group ? confirmedMembers.length : companions) : 0,
                dietary_restrictions: dietary,
                message: msg,
                responded_at: new Date().toISOString(),
                confirmed_members_json: attending === 'yes' ? confirmedMembers : []
            }, { onConflict: 'guest_id' });

            if (!error && attending === 'yes') {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: [primaryColor, theme.secondary || '#7B2D8B', '#fdf8f0']
                });
            }
        }

        setLoading(false);
        setStep('success');
        onRefresh();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl relative z-10"
            >
                {step === 'form' ? (
                    <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-5">
                        <div className="text-center">
                            <h3 className="text-2xl font-black text-[#2d1b2d]">{t.rsvpTitle}</h3>
                            <p className="text-xs text-gray-400 mt-1">{t.rsvpDesc}</p>
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setAttending('yes')}
                                className={`flex-1 py-3.5 rounded-2xl text-xs font-black transition-all border ${attending === 'yes' ? 'bg-[#a35d6a] text-white border-[#a35d6a]' : 'bg-white text-gray-400 border-gray-100 hover:bg-rose-50'}`}
                            >
                                <CheckCircle2 size={16} className="mx-auto mb-1" />
                                {t.confirmed}
                            </button>
                            <button
                                type="button"
                                onClick={() => setAttending('no')}
                                className={`flex-1 py-3.5 rounded-2xl text-xs font-black transition-all border ${attending === 'no' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50'}`}
                            >
                                <X size={16} className="mx-auto mb-1" />
                                {t.declined}
                            </button>
                        </div>

                        <AnimatePresence>
                            {attending === 'yes' && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="flex flex-col gap-4 overflow-hidden">
                                    {guest?.is_group ? (
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#a35d6a]">{t.companions}</label>
                                            <div className="flex flex-wrap gap-2">
                                                {guest.members_json.map((m, i) => (
                                                    <button
                                                        key={i}
                                                        type="button"
                                                        onClick={() => toggleMember(m)}
                                                        className={`px-3 py-2 rounded-xl text-[10px] font-bold border transition-all ${confirmedMembers.includes(m) ? 'bg-[#a35d6a]/10 border-[#a35d6a] text-[#a35d6a]' : 'bg-white border-gray-100 text-gray-400'}`}
                                                    >
                                                        {m}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#a35d6a]">{t.companions}</label>
                                            <input type="number" value={companions} onChange={(e) => setCompanions(parseInt(e.target.value))} className="w-full mt-1.5 px-4 py-3 rounded-2xl border border-gray-100 text-xs focus:ring-2 focus:ring-[#a35d6a]/20 outline-none" placeholder="0" />
                                        </div>
                                    )}
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#a35d6a]">{t.dietary}</label>
                                        <input value={dietary} onChange={(e) => setDietary(e.target.value)} className="w-full mt-1.5 px-4 py-3 rounded-2xl border border-gray-100 text-xs focus:ring-2 focus:ring-[#a35d6a]/20 outline-none" placeholder="..." />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={!attending || loading}
                            className="w-full py-4 rounded-2xl bg-[#a35d6a] text-white font-black text-sm shadow-xl shadow-rose-200 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100"
                        >
                            {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : t.sendRSVP}
                        </button>
                    </form>
                ) : (
                    <div className="p-10 text-center flex flex-col items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center text-green-500 mb-2">
                            <CheckCircle2 size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-[#2d1b2d]">{t.thanks}</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">{t.thanksDesc}</p>
                        <button onClick={onClose} className="w-full mt-4 py-4 rounded-2xl bg-gray-900 text-white font-bold text-sm">OK</button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}

// ─── Public Invite Page ───────────────────────────────────────────────────────
export default function InvitePage() {
    const { slug } = useParams() as { slug: string };
    const [event, setEvent] = useState<EventData | null>(null);
    const [loading, setLoading] = useState(true);
    const [showRSVP, setShowRSVP] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [liveUrls, setLiveUrls] = useState<string[]>([]);
    const [galleryLoading, setGalleryLoading] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [guest, setGuest] = useState<Guest | null>(null);

    const loadData = async () => {
        const { data } = await supabase.from('events').select('*').eq('slug', slug).single();
        if (data && data.is_published) {
            setEvent(data as EventData);
            setLiveUrls(data.styles_json?.live_photos || []);
            await supabase.from('events').update({ views: (data.views || 0) + 1 }).eq('id', data.id);

            if (token) {
                const { data: g } = await supabase
                    .from('guests')
                    .select('*, rsvp(*)')
                    .eq('invitation_token', token)
                    .single();
                if (g) setGuest(g as Guest);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [slug, token]);

    const handleLiveUpload = async (file: File) => {
        if (!event) return;
        setGalleryLoading(true);
        try {
            const ext = file.name.split('.').pop();
            const fileName = `live_${Date.now()}.${ext}`;
            const path = `live/${event.id}/${fileName}`;
            const { error } = await supabase.storage.from('covers').upload(path, file);
            if (error) throw error;
            const { data: { publicUrl } } = supabase.storage.from('covers').getPublicUrl(path);

            const newUrls = [publicUrl, ...liveUrls].slice(0, 50);
            setLiveUrls(newUrls);

            const newStyles = { ...(event.styles_json || {}), live_photos: newUrls };
            await supabase.from('events').update({ styles_json: newStyles }).eq('id', event.id);

            toast.success('¡Foto compartida en el muro! ✨');
        } catch (e: any) {
            toast.error('Error al subir foto');
        } finally {
            setGalleryLoading(false);
        }
    };

    const countdown = useCountdown(event?.event_date || '2099-01-01');

    const toggleMusic = () => {
        if (!audioRef.current) return;
        if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
        else { audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { }); }
    };

    const addToCalendar = () => {
        if (!event) return;
        const start = event.event_date.replace(/-/g, '') + 'T' + (event.event_time?.replace(/:/g, '') || '120000');
        const end = event.event_date.replace(/-/g, '') + 'T' + (event.event_time ? String(parseInt(event.event_time) + 4).padStart(2, '0') + '0000' : '160000');
        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${end}&details=${encodeURIComponent(event.message || '')}&location=${encodeURIComponent(event.venue || '')}`;
        window.open(url, '_blank');
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-950"><Loader2 className="animate-spin text-rose-500" size={42} /></div>;
    if (!event) return <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white p-10"><h1 className="text-2xl font-bold mb-4">Invitación No Disponible</h1><p className="opacity-50 text-center text-sm">El link no es válido o ha sido despublicado por el anfitrión.</p></div>;

    const lang = event.language === 'en' ? 'en' : 'es';
    const t = TRANSLATIONS[lang];

    const theme = event.styles_json || {};
    const primary = theme.primary || '#a35d6a';
    const headerFont = theme.font || 'Playfair Display';
    const bg = theme.background || '#fdf8f0';
    const accent = theme.secondary || '#7B2D8B';

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr + 'T12:00:00');
        const locale = lang === 'en' ? 'en-US' : 'es-MX';
        if (event.date_format === 'short') return date.toLocaleDateString(locale);
        if (event.date_format === 'abbrev') return date.toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short' });
        return date.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };

    const formatTime = (time: string) => {
        if (!time) return '';
        if (event.time_format === '12h') {
            const [h, m] = time.split(':');
            const hour = parseInt(h);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const h12 = hour % 12 || 12;
            return `${h12}:${m} ${ampm}`;
        }
        return time;
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=${headerFont.replace(/ /g, '+')}:wght@400;700&family=DM+Sans:wght@300;400;500;700&display=swap');
                @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
                .animate-slide-up { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
                .scale-in { animation: scaleIn 0.5s ease-out; }
                @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                .glass { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); }
                ::-webkit-scrollbar { display: none; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fadeIn 1s ease-out; }
            `}</style>

            <div className="min-h-screen w-full relative select-none pb-32" style={{ background: bg, fontFamily: "'DM Sans', sans-serif", color: theme.text || '#2d1b2d' }}>

                {/* Audio Engine */}
                {event.music_url && (
                    <audio ref={audioRef} src={event.music_url} loop onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
                )}

                {/* Floating Music Toggle */}
                {event.music_url && (
                    <button onClick={toggleMusic} className="fixed top-6 right-6 z-[60] w-12 h-12 glass rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90 border border-white/40">
                        {isPlaying ? <Volume2 size={20} className="animate-pulse text-[#a35d6a]" /> : <VolumeX size={20} className="text-gray-400" />}
                    </button>
                )}

                {/* HERO AREA */}
                <div className="relative w-full h-[70vh] min-h-[500px] overflow-hidden">
                    {event.cover_image_url ? (
                        <div className="absolute inset-0">
                            <img src={event.cover_image_url} alt="Cover" className="w-full h-full object-cover" />
                            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.75) 100%)' }} />
                        </div>
                    ) : (
                        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${primary}, ${theme.secondary || '#7B2D8B'})` }} />
                    )}

                    <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 px-8 text-center text-white">
                        <span className="text-xs font-bold tracking-[0.4em] uppercase mb-4 opacity-70 animate-fade-in">{lang === 'en' ? 'Invitation' : event.event_type}</span>
                        <h1 className="text-[42px] leading-[1.1] font-bold mb-4 drop-shadow-2xl" style={{ fontFamily: `'${headerFont}', serif` }}>{event.title}</h1>

                        {(event.parents_bride_father || event.parents_bride_mother || event.parents_groom_father || event.parents_groom_mother || event.godparents) && (
                            <div className="flex flex-col gap-4 mb-8 opacity-90 animate-fade-in-up max-w-[280px]">
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-[0.3em] font-medium opacity-60 font-serif italic mb-2">{t.blessing}</p>
                                    <div className="flex flex-col gap-1">
                                        {(event.parents_bride_father || event.parents_bride_mother) && (
                                            <div className="space-y-0.5">
                                                {event.parents_bride_father && <p className="text-sm font-bold uppercase">{event.parents_bride_father_deceased && '✝'} {event.parents_bride_father}</p>}
                                                {event.parents_bride_mother && <p className="text-sm font-bold uppercase">{event.parents_bride_mother_deceased && '✝'} {event.parents_bride_mother}</p>}
                                            </div>
                                        )}
                                        <div className="w-8 h-[1px] bg-white/20 mx-auto my-1" />
                                        {(event.parents_groom_father || event.parents_groom_mother) && (
                                            <div className="space-y-0.5">
                                                {event.parents_groom_father && <p className="text-sm font-bold uppercase">{event.parents_groom_father_deceased && '✝'} {event.parents_groom_father}</p>}
                                                {event.parents_groom_mother && <p className="text-sm font-bold uppercase">{event.parents_groom_mother_deceased && '✝'} {event.parents_groom_mother}</p>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {event.godparents && (
                                    <div className="pt-2">
                                        <p className="text-[9px] uppercase tracking-[0.3em] font-medium opacity-60 italic mb-1">{t.godparents}</p>
                                        <p className="text-sm font-bold uppercase">{event.godparents}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {event.event_date && (
                            <div className="flex flex-col items-center gap-2 mb-8">
                                <div className="h-[1px] w-12 bg-white/40" />
                                <p className="text-base font-medium tracking-wide uppercase opacity-90">{formatDate(event.event_date)}</p>
                                <div className="h-[1px] w-12 bg-white/40" />
                            </div>
                        )}
                    </div>
                </div>

                {/* MAIN CONTENT CARD */}
                <div className="relative z-10 -mt-8 rounded-t-[40px] px-6 pt-12 pb-12" style={{ background: bg }}>

                    {/* COUNTDOWN */}
                    {event.event_date && (
                        <div className="mb-14">
                            <h3 className="text-center text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-6">{t.timeToWait}</h3>
                            <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
                                {[
                                    { v: countdown.days, l: t.days }, { v: countdown.hours, l: t.hours },
                                    { v: countdown.minutes, l: t.minutes }, { v: countdown.seconds, l: t.seconds }
                                ].map((it, i) => (
                                    <div key={i} className="flex flex-col items-center p-3 rounded-2xl bg-white shadow-sm border border-black/5">
                                        <span className="text-2xl font-black tabular-nums leading-none mb-1" style={{ color: primary }}>{String(it.v).padStart(2, '0')}</span>
                                        <span className="text-[8px] font-black uppercase opacity-30 tracking-wider font-mono">{it.l}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* VENUE & MAPS */}
                    <div className="flex flex-col gap-4 max-w-sm mx-auto mb-14">
                        <div className="p-8 rounded-[32px] text-center flex flex-col items-center shadow-sm border border-black/5" style={{ background: '#fff' }}>
                            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-transform hover:scale-110" style={{ background: `${primary}08`, color: primary }}>
                                <MapPin size={28} />
                            </div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 mb-3">{t.venue}</h4>
                            <p className="text-xl font-black mb-1 leading-tight">{event.venue}</p>
                            {event.event_time && <p className="text-xs font-bold opacity-40 mb-8">{t.at} {formatTime(event.event_time)}</p>}

                            <div className="flex flex-col w-full gap-3">
                                {event.location_url && (
                                    <a href={event.location_url} target="_blank" className="flex items-center justify-center gap-2 py-4 rounded-2xl border border-gray-100 font-black text-[10px] uppercase tracking-widest transition-all hover:bg-gray-50 active:scale-95 shadow-sm">
                                        <Navigation size={14} /> {t.viewMaps}
                                    </a>
                                )}
                                {event.location_waze_url && (
                                    <a href={event.location_waze_url} target="_blank" className="flex items-center justify-center gap-2 py-4 rounded-2xl border border-gray-100 font-black text-[10px] uppercase tracking-widest transition-all hover:bg-gray-50 active:scale-95 shadow-sm">
                                        <ExternalLink size={14} /> {t.viewWaze}
                                    </a>
                                )}
                                <button onClick={addToCalendar} className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-gray-900 border-gray-900 text-white font-black text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-95">
                                    <Calendar size={14} /> {t.addCalendar}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* DRESS CODE */}
                    {event.dress_code && (
                        <div className="text-center mb-16 px-4 flex flex-col items-center">
                            <div className="w-10 h-[1px] mb-6 opacity-30" style={{ background: primary }} />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 mb-4">{t.dressCode}</h4>
                            <p className="text-2xl font-black italic tracking-tight" style={{ color: primary, fontFamily: `'${headerFont}', serif` }}>{event.dress_code}</p>
                        </div>
                    )}

                    {/* MESSAGE */}
                    {event.message && (
                        <div className="relative text-center mb-20 px-8 py-12 rounded-[48px] overflow-hidden border-2 border-dashed bg-white/30" style={{ borderColor: `${primary}1a` }}>
                            <div className="text-4xl font-serif text-rose-200 absolute top-4 left-6 opacity-40">“</div>
                            <p className="text-lg leading-relaxed italic opacity-80" style={{ fontFamily: `'${headerFont}', serif` }}>{event.message}</p>
                            <div className="text-4xl font-serif text-rose-200 absolute bottom-4 right-6 opacity-40 rotate-180">“</div>
                        </div>
                    )}

                    {/* MURO SOCIAL / LIVE PHOTO GALLERY */}
                    <div className="mb-20 px-4">
                        <div className="text-center mb-10">
                            <span className="px-3 py-1 bg-white rounded-full text-[9px] font-black uppercase tracking-widest text-[#a35d6a] border border-rose-100 shadow-sm mb-4 inline-block">{t.eventWall}</span>
                            <h3 className="text-3xl font-black leading-tight" style={{ color: primary, fontFamily: `'${headerFont}', serif` }}>{t.sharePhotos}</h3>
                            <p className="text-xs opacity-40 mt-2">{t.uploadDesc}</p>
                        </div>

                        <div className="flex flex-col gap-6">
                            <label className="flex flex-col items-center justify-center gap-4 w-full py-12 rounded-[40px] border-2 border-dashed transition-all hover:bg-white cursor-pointer group shadow-sm bg-white/50 relative overflow-hidden" style={{ borderColor: `${primary}26` }}>
                                <div className="absolute inset-0 bg-gradient-to-tr from-rose-50/0 to-rose-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="w-16 h-16 rounded-3xl bg-white shadow-xl flex items-center justify-center text-[#a35d6a] group-hover:rotate-6 transition-transform relative z-10">
                                    {galleryLoading ? <Loader2 size={28} className="animate-spin" /> : <Camera size={28} />}
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#a35d6a] relative z-10">{t.uploadBtn}</span>
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleLiveUpload(e.target.files[0])} disabled={galleryLoading} />
                            </label>

                            {liveUrls.length > 0 && (
                                <div className="mt-4">
                                    <div className="flex overflow-x-auto gap-4 pb-4 snap-x no-scrollbar">
                                        {liveUrls.map((url, i) => (
                                            <motion.div
                                                key={url}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="w-48 h-64 flex-shrink-0 rounded-[32px] overflow-hidden shadow-xl snap-center border-4 border-white"
                                            >
                                                <img src={url} alt={`live-${i}`} className="w-full h-full object-cover" />
                                            </motion.div>
                                        ))}
                                        <div className="w-8 shrink-0" />
                                    </div>
                                    <p className="text-center text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-4">{t.swipeMore}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* GIFT REGISTRY */}
                    {event.gift_registry_url && (
                        <div className="mx-2 mb-20 p-12 rounded-[48px] bg-white shadow-xl border border-rose-50 text-center flex flex-col items-center gap-6 relative overflow-hidden group">
                            <div className="absolute -top-6 -right-6 w-32 h-32 bg-rose-50 rounded-full opacity-50 group-hover:scale-110 transition-transform" />
                            <div className="w-16 h-16 rounded-3xl bg-rose-50 flex items-center justify-center text-[#a35d6a] rotate-12 mb-2">
                                <Gift size={32} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#a35d6a]">{t.giftRegistry}</span>
                                <p className="text-sm font-bold opacity-60 leading-relaxed max-w-[240px]">{t.giftSuggestion}</p>
                            </div>
                            <a href={event.gift_registry_url} target="_blank" className="w-full py-4.5 bg-gray-900 text-white rounded-[20px] font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all hover:bg-gray-800 active:scale-95">
                                <ExternalLink size={16} /> {t.giftBtn}
                            </a>
                        </div>
                    )}

                    {/* VIP PASS SECTION */}
                    {event.security_enabled && guest?.rsvp?.status === 'confirmed' && (
                        <div className="mx-2 mb-20 p-10 rounded-[56px] bg-gray-950 text-white shadow-2xl flex flex-col items-center gap-8 relative overflow-hidden border border-white/10">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#a35d6a] to-transparent" />

                            <div className="flex flex-col items-center text-center gap-3">
                                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-[#a35d6a] bg-white/5">
                                    <Shield size={24} />
                                </div>
                                <h3 className="text-2xl font-black uppercase tracking-[0.2em]">{t.vipPass}</h3>
                                <p className="text-[10px] text-gray-400 font-medium tracking-wide opacity-60">{t.vipDesc}</p>
                            </div>

                            <div className="bg-white p-6 rounded-[2.5rem] shadow-[0_0_80px_rgba(163,93,106,0.25)] ring-8 ring-white/5 border-4 border-white">
                                <QRCodeCanvas
                                    value={`${process.env.NEXT_PUBLIC_APP_URL}/invite/${event.slug}?token=${guest.invitation_token}`}
                                    size={180}
                                    level="H"
                                />
                            </div>

                            <div className="text-center font-mono">
                                <p className="text-xs text-[#a35d6a] font-bold tracking-[0.3em] mb-1">ID: {guest.invitation_token.slice(0, 8).toUpperCase()}</p>
                                <p className="text-lg font-black tracking-tight">{guest.name}</p>
                                {guest.is_group && (
                                    <div className="mt-4 flex flex-wrap justify-center gap-2 max-w-[220px]">
                                        {guest.rsvp.confirmed_members_json.map((m, i) => (
                                            <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-wider">{m}</span>
                                        ))}
                                    </div>
                                )}
                                <p className="text-[10px] text-gray-500 mt-6 leading-relaxed opacity-60 px-6">{t.passInstructions}</p>
                            </div>
                        </div>
                    )}

                    {/* FOOTER LOGO */}
                    <div className="mt-20 flex flex-col items-center gap-3 opacity-20">
                        <div className="h-[1px] w-12 bg-gray-400 mb-2" />
                        <span className="text-[8px] font-black uppercase tracking-[0.4em]">Creado con EncantIA</span>
                    </div>
                </div>

                {/* RSVP BUTTON / FOOTER */}
                <div className="fixed bottom-8 left-0 right-0 z-50 px-6 flex justify-center pointer-events-none">
                    <motion.button
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        onClick={() => setShowRSVP(true)}
                        className="w-full max-w-sm py-5 rounded-[28px] shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-90 border-t border-white/20 pointer-events-auto"
                        style={{ background: `linear-gradient(135deg, ${primary}, ${accent})`, color: '#fff' }}
                    >
                        {guest?.rsvp?.status === 'confirmed' ? (
                            <>
                                <QrCode size={20} />
                                <span className="font-black uppercase tracking-[0.1em] text-sm">{t.viewPass}</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle2 size={20} />
                                <span className="font-black uppercase tracking-[0.1em] text-sm">{t.confirmBtn}</span>
                            </>
                        )}
                    </motion.button>
                </div>

                <AnimatePresence>
                    {showRSVP && <RSVPModal event={event} guest={guest} onClose={() => setShowRSVP(false)} onRefresh={loadData} />}
                </AnimatePresence>

            </div>
        </>
    );
}
