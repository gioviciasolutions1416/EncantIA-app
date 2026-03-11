'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { 
    MapPin, Calendar, CheckCircle2, X, Loader2, Music, Volume2, VolumeX, 
    Navigation, ExternalLink, Gift, Clock, Camera, Shield, QrCode, Phone, 
    Plus, Heart, Church, Car, Cake, Utensils, IceCream, Flower2, Wine, Trash2,
    Hash, FileText, Share2, Globe, Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { toast } from 'sonner';
import { QRCodeCanvas } from 'qrcode.react';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ─── Types ──────────────────────────────────────────────────────────────────
interface EventData {
    id: string;
    title: string;
    event_type: string;
    event_date: string;
    event_time: string;
    venue: string;
    message: string;
    message_secondary: string;
    venue_address: string;
    cover_image_url: string;
    styles_json: Record<string, any>;
    slug: string;
    dress_code: string;
    dress_code_detail: string;
    dress_code_women: string;
    dress_code_men: string;
    dress_code_icons_enabled: boolean;
    gift_registry_enabled: boolean;
    gift_registry_type: 'link' | 'code' | 'envelope';
    gift_registry_code: string;
    gift_registry_url: string;
    music_url: string;
    gallery_urls: string[];
    location_url: string;
    location_waze_url: string;
    parents_bride_father: string;
    parents_bride_father_deceased: boolean;
    parents_bride_mother: string;
    parents_bride_mother_deceased: boolean;
    parents_groom_father: string;
    parents_groom_father_deceased: boolean;
    parents_groom_mother: string;
    parents_groom_mother_deceased: boolean;
    godparents: string;
    security_enabled: boolean;
    language: string;
    date_format: string;
    time_format: string;
    timezone: string;
    adults_only: boolean;
    calendar_enabled: boolean;
    itinerary_items: { name: string; time: string; icon: string; description?: string }[];
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
        parents_bride: "Padres de la Novia",
        parents_groom: "Padres del Novio",
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
        viewPass: "Ver mi Pase Digital",
        itinerary: "Itinerario del Evento",
        adultsOnly: "Evento solo para adultos",
        women: "Damas",
        men: "Caballeros",
        envelope: "Lluvia de Sobres",
        envelopeMsg: "Agradecemos tu detalle en efectivo el día del evento.",
        registryCode: "Código de Evento:",
    },
    en: {
        invitation: "Invitation",
        blessing: "With the blessing of our parents:",
        parents_bride: "Parents of the Bride",
        parents_groom: "Parents of the Groom",
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
        viewPass: "View My Digital Pass",
        itinerary: "Event Itinerary",
        adultsOnly: "Adults only event",
        women: "Ladies",
        men: "Gentlemen",
        envelope: "Envelope Shower",
        envelopeMsg: "We appreciate your cash gift on the day of the event.",
        registryCode: "Event Code:",
    }
};

// ─── Helpers ────────────────────────────────────────────────────────────────

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

const ITINERARY_ICONS_LIST = {
    church: <Church size={20} />,
    rings: <Heart size={20} />,
    car: <Car size={20} />,
    camera: <Camera size={20} />,
    music: <Music size={20} />,
    cake: <Cake size={20} />,
    dinner: <Utensils size={20} />,
    dessert: <IceCream size={20} />,
    bouquet: <Flower2 size={20} />,
    cheers: <Wine size={20} />,
    dance: <Music size={20} />
};

function ItineraryIcon({ id }: { id: string }) {
    return (ITINERARY_ICONS_LIST as any)[id] || <Clock size={20} />;
}

function DressIcon({ type, gender, size = 32 }: { type: string; gender: 'women' | 'men'; size?: number }) {
    const iconName = type ? type.toLowerCase().replace(/ /g, '_') : '';
    let src = '';

    if (gender === 'women') {
        if (type === 'Vestido largo') src = '/iconos/dress_code/vestido_largo.png';
        else if (type === 'Vestido de coctel') src = '/iconos/dress_code/vestido_coctel.png';
        else if (type === 'Vestido corto') src = '/iconos/dress_code/vestido_corto.png';
        else src = '/iconos/dress_code/vestido_largo.png'; // Fallback
    } else {
        if (iconName.includes('smoking')) src = '/iconos/dress_code/smoking.png';
        else if (iconName.includes('traje')) src = '/iconos/dress_code/traje.png';
        else if (iconName.includes('guayabera')) src = '/iconos/dress_code/guayabera.png';
        else src = '/iconos/dress_code/traje.png'; // Fallback
    }

    return <img src={src} alt={type} style={{ width: size, height: size, objectFit: 'contain' }} />;
}

// ─── RSVP Modal ──────────────────────────────────────────────────────────────
function RSVPModal({ event, guest, onClose, onRefresh }: { event: EventData; guest: Guest | null; onClose: () => void; onRefresh: () => void }) {
    const [step, setStep] = useState<'form' | 'success'>('form');
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(guest?.name || '');
    const [attending, setAttending] = useState<'yes' | 'no' | null>(guest?.rsvp?.status === 'confirmed' ? 'yes' : guest?.rsvp?.status === 'declined' ? 'no' : null);
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

    const { scrollYProgress } = useScroll();
    const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const scaleHero = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);

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

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-950 font-sans"><Loader2 className="animate-spin text-[#a35d6a]" size={42} /></div>;
    if (!event) return <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white p-10 font-sans"><h1 className="text-2xl font-bold mb-4">Invitación No Disponible</h1><p className="opacity-50 text-center text-sm">El link no es válido o ha sido despublicado por el anfitrión.</p></div>;

    const lang = event.language === 'en' ? 'en' : 'es';
    const t = TRANSLATIONS[lang];

    const theme = event.styles_json || {};
    const primary = theme.primary || '#a35d6a';
    const secondary = theme.secondary || '#7B2D8B';
    const headerFont = theme.font || 'Playfair Display';
    const bg = theme.background || '#fdf8f0';

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr + 'T12:00:00');
        const locale = lang === 'en' ? 'en-US' : 'es-MX';
        return date.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };

    const formatTime = (time: string) => {
        if (!time) return '';
        const [h, m] = time.split(':');
        const hour = parseInt(h);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const h12 = hour % 12 || 12;
        return `${h12}:${m} ${ampm}`;
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=${headerFont.replace(/ /g, '+')}:wght@400;700;900&family=Montserrat:wght@300;400;500;700;900&family=Dancing+Script:wght@700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,400;0,700;1,400&display=swap');
                .glass { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(12px); }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .floating { animation: float 6s ease-in-out infinite; }
                @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-15px); } 100% { transform: translateY(0px); } }
                .shadow-premium { shadow-xl shadow-[#a35d6a]/20; }
            `}</style>

            <div className="min-h-screen w-full relative select-none overflow-x-hidden" style={{ background: bg, fontFamily: "'Montserrat', sans-serif", color: theme.text || '#2d1b2d' }}>

                {/* Audio Engine */}
                {event.music_url && (
                    <audio ref={audioRef} src={event.music_url} loop onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
                )}

                {/* Floating Navigation Controls */}
                <div className="fixed top-6 right-6 z-[60] flex flex-col gap-3">
                    {event.music_url && (
                        <button onClick={toggleMusic} className="w-11 h-11 glass rounded-full flex items-center justify-center shadow-premium transition-all active:scale-90 border border-white/40 ring-4 ring-[#a35d6a05]">
                            {isPlaying ? <Volume2 size={18} className="animate-pulse text-[#a35d6a]" /> : <VolumeX size={18} className="text-gray-400" />}
                        </button>
                    )}
                    <button onClick={() => window.open(window.location.href, '_blank')} className="w-11 h-11 glass rounded-full flex items-center justify-center shadow-premium transition-all active:scale-90 border border-white/40 ring-4 ring-[#a35d6a05]">
                        <Share2 size={18} className="text-[#a35d6a]" />
                    </button>
                </div>

                {/* HERO AREA (TRANSFORMED) */}
                <header className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center">
                    <motion.div style={{ opacity: opacityHero, scale: scaleHero }} className="absolute inset-0 z-0">
                        {event.cover_image_url ? (
                            <>
                                <img src={event.cover_image_url} alt="Cover" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
                            </>
                        ) : (
                            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }} />
                        )}
                    </motion.div>

                    <div className="relative z-10 flex flex-col items-center px-8 text-center text-white">
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex flex-col items-center"
                        >
                            <span className="text-[10px] font-black tracking-[0.6em] uppercase mb-6 opacity-80 flex items-center gap-4">
                                <span className="w-6 h-[1px] bg-white/40" />
                                {lang === 'en' ? 'Invitation' : event.event_type}
                                <span className="w-6 h-[1px] bg-white/40" />
                            </span>
                            <h1 className="text-6xl md:text-8xl font-black mb-6 drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)] leading-[1.05]" style={{ fontFamily: `'${headerFont}', serif` }}>
                                {event.title}
                            </h1>
                            <div className="h-0.5 w-24 bg-white/30 rounded-full mb-8" />
                            <p className="text-lg md:text-xl font-medium tracking-[0.2em] uppercase opacity-90 drop-shadow-md">
                                {formatDate(event.event_date)}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="absolute bottom-12 flex flex-col items-center gap-2"
                        >
                            <span className="text-[9px] font-black uppercase tracking-widest opacity-50">Sigue deslizando</span>
                            <div className="w-5 h-8 border-2 border-white/20 rounded-full flex items-start justify-center p-1">
                                <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="w-1 h-2 bg-white/60 rounded-full" />
                            </div>
                        </motion.div>
                    </div>
                </header>

                {/* MAIN CONTENT AREA */}
                <main className="relative z-20 -mt-16 rounded-t-[60px] glass border-t border-white/40 pb-40">
                    
                    {/* WEDDING QUOTE / BLESSING */}
                    <section className="pt-24 pb-20 px-8 text-center flex flex-col items-center">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                            {(event.parents_bride_father || event.parents_bride_mother || event.parents_groom_father || event.parents_groom_mother) && (
                                <div className="space-y-8 mb-16">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#a35d6a] mb-6">{t.blessing}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-2xl mx-auto">
                                        <div className="space-y-3">
                                            <p className="text-[10px] uppercase tracking-widest opacity-40 font-black">{t.parents_bride}</p>
                                            <div className="space-y-1">
                                                {event.parents_bride_father && <p className="text-lg font-bold uppercase">{event.parents_bride_father_deceased && '✝'} {event.parents_bride_father}</p>}
                                                {event.parents_bride_mother && <p className="text-lg font-bold uppercase">{event.parents_bride_mother_deceased && '✝'} {event.parents_bride_mother}</p>}
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <p className="text-[10px] uppercase tracking-widest opacity-40 font-black">{t.parents_groom}</p>
                                            <div className="space-y-1">
                                                {event.parents_groom_father && <p className="text-lg font-bold uppercase">{event.parents_groom_father_deceased && '✝'} {event.parents_groom_father}</p>}
                                                {event.parents_groom_mother && <p className="text-lg font-bold uppercase">{event.parents_groom_mother_deceased && '✝'} {event.parents_groom_mother}</p>}
                                            </div>
                                        </div>
                                    </div>
                                    {event.godparents && (
                                        <div className="pt-8">
                                            <p className="text-[10px] uppercase tracking-widest opacity-40 font-black mb-3">{t.godparents}</p>
                                            <p className="text-xl font-bold uppercase tracking-tight">{event.godparents}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {event.message && (
                                <div className="max-w-xl mx-auto italic py-10 px-8 rounded-[40px] bg-rose-50/30 border border-rose-100/50 shadow-inner">
                                    <Sparkles size={24} className="mx-auto mb-6 text-[#a35d6a]/20" />
                                    <p className="text-2xl font-serif leading-relaxed opacity-80" style={{ fontFamily: `'${headerFont}', serif` }}>
                                        "{event.message}"
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </section>

                    {/* COUNTDOWN SECTION */}
                    <section className="py-20 flex flex-col items-center">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                            <h3 className="text-center text-[11px] font-black uppercase tracking-[0.5em] opacity-40 mb-10">{t.timeToWait}</h3>
                            <div className="flex gap-4 md:gap-8 justify-center">
                                {[
                                    { v: countdown.days, l: t.days }, { v: countdown.hours, l: t.hours },
                                    { v: countdown.minutes, l: t.minutes }, { v: countdown.seconds, l: t.seconds }
                                ].map((it, i) => (
                                    <div key={i} className="flex flex-col items-center w-16 md:w-24">
                                        <div className="w-full aspect-square glass rounded-[32px] md:rounded-[40px] shadow-premium flex items-center justify-center border border-white mb-3">
                                            <span className="text-3xl md:text-5xl font-black tabular-nums" style={{ color: primary }}>{String(it.v).padStart(2, '0')}</span>
                                        </div>
                                        <span className="text-[9px] font-black uppercase opacity-30 tracking-widest">{it.l}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </section>

                    {/* LOCATION & VENUE */}
                    <section className="py-24 px-8">
                        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="max-w-sm mx-auto">
                            <div className="p-10 rounded-[56px] text-center flex flex-col items-center shadow-premium border border-white glass">
                                <div className="w-16 h-16 rounded-[24px] flex items-center justify-center mb-6 shadow-lg bg-white text-[#a35d6a] rotate-12">
                                    <MapPin size={32} />
                                </div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-4">{t.venue}</h4>
                                <h2 className="text-3xl font-black mb-2 leading-[1.1]">{event.venue}</h2>
                                {event.venue_address && <p className="text-sm font-bold opacity-40 mb-3">{event.venue_address}</p>}
                                {event.event_time && (
                                    <div className="flex items-center gap-2 mb-10 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-100">
                                        <Clock size={12} className="text-[#a35d6a]" />
                                        <span className="text-xs font-black uppercase text-[#a35d6a]">{t.at} {formatTime(event.event_time)}</span>
                                    </div>
                                )}

                                <div className="flex flex-col w-full gap-3">
                                    {(event.location_url || event.location_waze_url) && (
                                        <div className="grid grid-cols-2 gap-2 w-full">
                                            {event.location_url && (
                                                <a href={event.location_url} target="_blank" className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-white border border-gray-100 font-black text-[10px] uppercase tracking-widest transition-all hover:bg-rose-50 shadow-sm active:scale-95">
                                                    <Navigation size={14} /> Maps
                                                </a>
                                            )}
                                            {event.location_waze_url && (
                                                <a href={event.location_waze_url} target="_blank" className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-white border border-gray-100 font-black text-[10px] uppercase tracking-widest transition-all hover:bg-rose-50 shadow-sm active:scale-95">
                                                    <ExternalLink size={14} /> Waze
                                                </a>
                                            )}
                                        </div>
                                    )}
                                    {event.calendar_enabled && (
                                        <button onClick={addToCalendar} className="flex items-center justify-center gap-3 py-4.5 rounded-[22px] bg-gray-950 text-white font-black text-[10px] uppercase tracking-widest shadow-2xl transition-all active:scale-95">
                                            <Calendar size={16} /> {t.addCalendar}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </section>

                    {/* ITINERARY (PREMIUM LIST) */}
                    {event.itinerary_items && event.itinerary_items.length > 0 && (
                        <section className="py-24 px-8 max-w-md mx-auto">
                            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                                <div className="text-center mb-16">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.5em] opacity-40 mb-4">{t.itinerary}</h3>
                                    <div className="w-12 h-1 bg-[#a35d6a] rounded-full mx-auto" />
                                </div>

                                <div className="space-y-12">
                                    {event.itinerary_items.map((item, i) => (
                                        <motion.div 
                                            key={i} 
                                            initial={{ x: -20, opacity: 0 }} 
                                            whileInView={{ x: 0, opacity: 1 }} 
                                            viewport={{ once: true }} 
                                            transition={{ delay: i * 0.1 }}
                                            className="flex gap-8 items-start relative"
                                        >
                                            {i < event.itinerary_items.length - 1 && (
                                                <div className="absolute left-[31px] top-16 bottom-[-48px] w-0.5 border-l-2 border-dashed border-[#a35d6a]/15" />
                                            )}
                                            <div className="w-16 h-16 rounded-3xl bg-white shadow-premium flex items-center justify-center shrink-0 border border-[#a35d6a05] z-10 transition-transform group-hover:scale-110">
                                                <div className="text-[#a35d6a]">
                                                    <ItineraryIcon id={item.icon} />
                                                </div>
                                            </div>
                                            <div className="flex flex-col pt-1.5 flex-1 p-6 rounded-[32px] glass border border-white/40 shadow-sm">
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#a35d6a] opacity-60">{item.time}</p>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#a35d6a]/20" />
                                                </div>
                                                <p className="text-lg font-black tracking-tight mb-1">{item.name}</p>
                                                {item.description && <p className="text-xs opacity-50 leading-relaxed">{item.description}</p>}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </section>
                    )}

                    {/* DRESS CODE */}
                    {event.dress_code && (
                        <section className="py-24 px-8">
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-sm mx-auto glass p-12 rounded-[56px] text-center border border-white shadow-premium">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 mb-4">{t.dressCode}</h4>
                                <p className="text-4xl font-bold italic mb-3" style={{ color: primary, fontFamily: `'${headerFont}', serif` }}>{event.dress_code}</p>
                                {event.dress_code_detail && <p className="text-xs font-medium opacity-50 mb-10 px-4 leading-relaxed">{event.dress_code_detail}</p>}

                                {event.dress_code_icons_enabled && (
                                    <div className="flex justify-center gap-16">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-20 h-20 rounded-full glass border border-white shadow-xl flex items-center justify-center p-3 animate-pulse">
                                                <DressIcon type={event.dress_code_women} gender="women" size={48} />
                                            </div>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-[#a35d6a]">{t.women}</span>
                                            <span className="text-[10px] font-bold opacity-40">{event.dress_code_women || 'Vestido'}</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-20 h-20 rounded-full glass border border-white shadow-xl flex items-center justify-center p-3">
                                                <DressIcon type={event.dress_code_men} gender="men" size={48} />
                                            </div>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-[#a35d6a]">{t.men}</span>
                                            <span className="text-[10px] font-bold opacity-40">{event.dress_code_men || 'Traje'}</span>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </section>
                    )}

                    {/* GALLERY */}
                    {event.gallery_urls && event.gallery_urls.length > 0 && (
                        <section className="py-24 px-4 overflow-hidden">
                            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                                <div className="text-center mb-12">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.5em] opacity-40 mb-2">{t.galleryTitle}</h3>
                                    <div className="w-8 h-1 bg-[#a35d6a] rounded-full mx-auto" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {event.gallery_urls.map((url, i) => (
                                        <motion.div 
                                            key={i} 
                                            whileHover={{ scale: 1.05, rotate: 0 }}
                                            className={`aspect-[4/5] rounded-[32px] overflow-hidden shadow-premium border-4 border-white ${i % 3 === 0 ? '-rotate-2' : i % 3 === 1 ? 'rotate-2' : ''}`}
                                        >
                                            <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </section>
                    )}

                    {/* GIFT REGISTRY (ENHANCED) */}
                    {event.gift_registry_enabled && (
                        <section className="py-24 px-8">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }} 
                                whileInView={{ opacity: 1, scale: 1 }} 
                                viewport={{ once: true }}
                                className="max-w-sm mx-auto p-12 rounded-[56px] glass border border-white text-center flex flex-col items-center gap-8 relative overflow-hidden group shadow-premium"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-200/20 blur-3xl rounded-full -mr-16 -mt-16" />
                                <div className="w-20 h-20 rounded-[28px] bg-white shadow-xl flex items-center justify-center text-[#a35d6a] rotate-12 group-hover:rotate-0 transition-transform duration-500">
                                    <Gift size={40} />
                                </div>
                                <div className="space-y-4">
                                    <h5 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#a35d6a]">{t.giftRegistry}</h5>
                                    <p className="text-sm font-bold opacity-60 leading-relaxed px-2">{t.giftSuggestion}</p>
                                </div>

                                {event.gift_registry_type === 'link' && (
                                    <a href={event.gift_registry_url} target="_blank" className="w-full py-5 bg-gray-950 text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 transition-all hover:scale-[1.03] active:scale-95">
                                        <ExternalLink size={18} /> {t.giftBtn}
                                    </a>
                                )}

                                {event.gift_registry_type === 'code' && (
                                    <div className="w-full p-6 rounded-3xl bg-white/50 border-2 border-dashed border-[#a35d6a]/20 flex flex-col items-center gap-2">
                                        <span className="text-[9px] font-black uppercase opacity-40">{t.registryCode}</span>
                                        <span className="text-2xl font-black tracking-tight" style={{ color: primary }}>{event.gift_registry_code}</span>
                                    </div>
                                )}

                                {event.gift_registry_type === 'envelope' && (
                                    <div className="flex flex-col items-center gap-2 text-center">
                                        <p className="text-lg font-black italic text-[#a35d6a]" style={{ fontFamily: `'${headerFont}', serif` }}>{t.envelope}</p>
                                        <p className="text-[10px] font-medium opacity-50 px-4">{t.envelopeMsg}</p>
                                    </div>
                                )}
                            </motion.div>
                        </section>
                    )}

                    {/* SOCIAL WALL */}
                    <section className="py-24 px-8 overflow-hidden bg-white/30">
                        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                            <div className="text-center mb-16">
                                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-50 rounded-full text-[9px] font-black uppercase tracking-widest text-[#a35d6a] border border-rose-100 mb-4 shadow-sm">
                                    <Sparkles size={12} /> {t.eventWall}
                                </span>
                                <h3 className="text-4xl font-black leading-tight" style={{ color: primary, fontFamily: `'${headerFont}', serif` }}>{t.sharePhotos}</h3>
                                <p className="text-xs opacity-40 mt-3 font-medium">{t.uploadDesc}</p>
                            </div>

                            <div className="flex flex-col gap-10">
                                <label className="flex flex-col items-center justify-center gap-4 w-full py-16 rounded-[56px] border-3 border-dashed border-rose-100 bg-white/60 transition-all hover:bg-white cursor-pointer group shadow-premium relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-rose-50/0 to-rose-50/100 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="w-20 h-20 rounded-full bg-white shadow-2xl flex items-center justify-center text-[#a35d6a] group-hover:scale-110 transition-transform relative z-10 border border-rose-50">
                                        {galleryLoading ? <Loader2 size={32} className="animate-spin" /> : <Camera size={32} />}
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-widest text-[#a35d6a] relative z-10">{t.uploadBtn}</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleLiveUpload(e.target.files[0])} disabled={galleryLoading} />
                                </label>

                                {liveUrls.length > 0 && (
                                    <div className="relative">
                                        <div className="flex overflow-x-auto gap-6 pb-8 snap-x no-scrollbar px-4 -mx-8">
                                            <div className="w-2 shrink-0" />
                                            {liveUrls.map((url, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, scale: 0.8, rotate: i % 2 === 0 ? -2 : 2 }}
                                                    whileInView={{ opacity: 1, scale: 1 }}
                                                    className="w-56 h-72 flex-shrink-0 rounded-[40px] overflow-hidden shadow-2xl snap-center border-6 border-white bg-white"
                                                >
                                                    <img src={url} alt={`live-${i}`} className="w-full h-full object-cover" />
                                                </motion.div>
                                            ))}
                                            <div className="w-8 shrink-0" />
                                        </div>
                                        <p className="text-center text-[9px] font-black text-gray-300 uppercase tracking-[0.3em] mt-2 animate-pulse">{t.swipeMore}</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </section>

                    {/* VIP PASS / SECURITY SECTION (IF CONFIRMED) */}
                    {event.security_enabled && guest?.rsvp?.status === 'confirmed' && (
                        <section className="py-24 px-8">
                            <motion.div 
                                initial={{ opacity: 0, y: 40 }} 
                                whileInView={{ opacity: 1, y: 0 }} 
                                viewport={{ once: true }}
                                className="max-w-[340px] mx-auto p-10 rounded-[64px] bg-gray-950 text-white shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] flex flex-col items-center gap-10 relative overflow-hidden border border-white/10"
                            >
                                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-[#a35d6a] to-transparent" />
                                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#a35d6a]/20 blur-[100px] rounded-full" />

                                <div className="flex flex-col items-center text-center gap-4">
                                    <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-[#a35d6a] bg-white/5 shadow-inner">
                                        <Shield size={28} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-black uppercase tracking-[0.2em]">{t.vipPass}</h3>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest opacity-60">{t.vipDesc}</p>
                                    </div>
                                </div>

                                <div className="bg-white p-7 rounded-[3rem] shadow-[0_0_80px_rgba(163,93,106,0.5)] ring-12 ring-white/5">
                                    <QRCodeCanvas
                                        value={`${process.env.NEXT_PUBLIC_APP_URL}/invite/${event.slug}?token=${guest.invitation_token}`}
                                        size={180}
                                        level="H"
                                        includeMargin={false}
                                    />
                                </div>

                                <div className="text-center font-sans space-y-6 w-full">
                                    <div className="flex flex-col gap-2">
                                        <span className="text-[8px] text-[#a35d6a] font-black uppercase tracking-[0.5em]">Invitado Confirmado</span>
                                        <p className="text-2xl font-black tracking-tight leading-tight">{guest.name}</p>
                                    </div>
                                    
                                    {guest.is_group && (
                                        <div className="flex flex-wrap justify-center gap-2 px-4">
                                            {guest.rsvp?.confirmed_members_json.map((m, i) => (
                                                <span key={i} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-widest text-[#a35d6a]">{m}</span>
                                            ))}
                                        </div>
                                    )}
                                    
                                    <div className="pt-4 border-t border-white/10 mt-6">
                                        <p className="text-[9px] text-gray-500 leading-relaxed font-bold uppercase tracking-tighter px-4 opacity-50">{t.passInstructions}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </section>
                    )}

                    {/* ADULTS ONLY BADGE */}
                    {event.adults_only && (
                        <div className="py-20 flex justify-center">
                            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="flex flex-col items-center gap-4">
                                <div className="w-12 h-[1px] bg-[#a35d6a]/20" />
                                <div className="flex items-center gap-3 px-6 py-2.5 rounded-full border border-rose-100 bg-white/50 shadow-sm">
                                    <div className="w-2 h-2 rounded-full bg-[#a35d6a] animate-ping" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#a35d6a]">{t.adultsOnly}</span>
                                </div>
                                <div className="w-12 h-[1px] bg-[#a35d6a]/20" />
                            </motion.div>
                        </div>
                    )}

                    {/* FOOTER BRANING */}
                    <footer className="pt-40 flex flex-col items-center gap-4 pb-10 opacity-20 transition-opacity hover:opacity-100">
                        <div className="h-0.5 w-12 bg-gray-400 rounded-full mb-2" />
                        <div className="flex items-center gap-3">
                            <Sparkles size={14} className="text-[#a35d6a]" />
                            <span className="text-[9px] font-black uppercase tracking-[0.4em]">Creado con EncantIA</span>
                        </div>
                        <p className="text-[8px] font-bold uppercase tracking-tighter text-gray-400">Hecho con amor para los momentos más especiales</p>
                    </footer>

                </main>

                {/* RSVP STICKY BUTTON (PREMIUM) */}
                <div className="fixed bottom-10 left-0 right-0 z-50 flex justify-center pointer-events-none px-6">
                    <motion.button
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 1, type: 'spring' }}
                        onClick={() => setShowRSVP(true)}
                        className="w-full max-w-sm pointer-events-auto group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/20 blur-xl scale-110 group-hover:scale-125 transition-transform" />
                        <div 
                            className="relative h-18 py-5 rounded-[28px] shadow-[0_25px_50px_-12px_rgba(163,93,106,0.5)] border-t border-white/30 flex items-center justify-center gap-4 transition-all active:scale-90 hover:scale-[1.03] overflow-hidden"
                            style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }}
                        >
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,white/20,transparent_50%)]" />
                            
                            {guest?.rsvp?.status === 'confirmed' ? (
                                <>
                                    <QrCode size={22} className="text-white" />
                                    <span className="text-white font-black uppercase tracking-[0.2em] text-[13px]">{t.viewPass}</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 size={22} className="text-white" />
                                    <span className="text-white font-black uppercase tracking-[0.2em] text-[13px]">{t.confirmBtn}</span>
                                </>
                            )}
                            
                            {/* Shine Effect */}
                            <motion.div 
                                animate={{ x: ['-100%', '200%'] }} 
                                transition={{ repeat: Infinity, duration: 3, ease: 'linear', repeatDelay: 1 }}
                                className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12" 
                            />
                        </div>
                    </motion.button>
                </div>

                {/* MODALS */}
                <AnimatePresence>
                    {showRSVP && <RSVPModal event={event} guest={guest} onClose={() => setShowRSVP(false)} onRefresh={loadData} />}
                </AnimatePresence>

            </div>
        </>
    );
}
