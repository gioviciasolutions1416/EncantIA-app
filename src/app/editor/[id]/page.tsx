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
    Music, Image as ImageIcon, ExternalLink, Eye, Info, Plus, Layout, Shield,
    Hash, Target, Navigation, Zap, Quote, FileText, Trash2, Camera, CreditCard, Lock, Menu, Users, 
    Church, Car, Cake, Utensils, IceCream, Flower2, Wine, Heart, CalendarClock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    styles_json: Record<string, any>;
    is_published: boolean;
    slug: string;
    // New fields
    music_url: string;
    gallery_urls: string[];
    views: number;
    location_url: string;
    location_waze_url: string;
    security_enabled: boolean;
    plan: string;
    language: string;
    date_format: string;
    time_format: string;
    timezone: string;
    parents_bride: string;
    parents_groom: string;
    godparents: string;
    parents_bride_father: string;
    parents_bride_father_deceased: boolean;
    parents_bride_mother: string;
    parents_bride_mother_deceased: boolean;
    parents_groom_father: string;
    parents_groom_father_deceased: boolean;
    parents_groom_mother: string;
    parents_groom_mother_deceased: boolean;
    // Section: Datos del Evento
    message_secondary: string;
    venue_address: string;
    venue_image_url: string;
    adults_only: boolean;
    calendar_enabled: boolean;
    // Section: Vestimenta
    dress_code_show_title: boolean;
    dress_code_detail: string;
    dress_code_women: string;
    dress_code_men: string;
    dress_code_icons_enabled: boolean;
    // Section: Regalos
    gift_registry_enabled: boolean;
    gift_registry_type: 'link' | 'code' | 'envelope';
    gift_registry_code: string;
    gift_registry_url: string;
    // Security and Access
    security_enabled: boolean;
    password_enabled: boolean;
    access_password: string;
    // Itinerary
    itinerary_ceremony_type: string;
    itinerary_date: string;
    itinerary_items: { name: string; time: string; icon: string; description?: string }[];
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

const PRESET_THEMES: Theme[] = [
    {
        style: 'Minimal Gold',
        primary: '#C5A059',
        secondary: '#2D2D2D',
        background: '#FFFFFF',
        text: '#2D2D2D',
        accent: '#F4EBE0',
        font: 'Playfair Display'
    },
    {
        style: 'Royal Navy',
        primary: '#1B2B48',
        secondary: '#C5A059',
        background: '#F8F9FA',
        text: '#1B2B48',
        accent: '#D4AF37',
        font: 'Cinzel'
    },
    {
        style: 'Tropical Bloom',
        primary: '#E94E77',
        secondary: '#2E8B57',
        background: '#FDFCF0',
        text: '#2D2D2D',
        accent: '#F1D4D4',
        font: 'Montserrat'
    },
    {
        style: 'Modern Rose',
        primary: '#A35D6A',
        secondary: '#7B2D8B',
        background: '#FAF5F7',
        text: '#4A2C2C',
        accent: '#E8C49A',
        font: 'Cormorant Garamond'
    },
    {
        style: 'Boda Clásica',
        primary: '#7a5060',
        secondary: '#4a2c2c',
        background: '#fdf8f0',
        text: '#4a2c2c',
        accent: '#e8c49a',
        font: 'Alex Brush'
    },
    {
        style: 'Dulce Quince',
        primary: '#ff8fab',
        secondary: '#fb6f92',
        background: '#fff0f3',
        text: '#590d22',
        accent: '#ffe5ec',
        font: 'Parisienne'
    }
];

// ─── Itinerary Icons Mapping ───────────────────────────────────────────────
const ITINERARY_ICONS_LIST = [
    { id: 'church', icon: <Church size={14} />, label: 'Iglesia' },
    { id: 'rings', icon: <Heart size={14} />, label: 'Anillos' },
    { id: 'car', icon: <Car size={14} />, label: 'Carro' },
    { id: 'camera', icon: <Camera size={14} />, label: 'Cámara' },
    { id: 'music', icon: <Music size={14} />, label: 'Música' },
    { id: 'cake', icon: <Cake size={14} />, label: 'Pastel' },
    { id: 'dinner', icon: <Utensils size={14} />, label: 'Cena' },
    { id: 'dessert', icon: <IceCream size={14} />, label: 'Postre' },
    { id: 'bouquet', icon: <Flower2 size={14} />, label: 'Ramo' },
    { id: 'cheers', icon: <Wine size={14} />, label: 'Salud' },
    { id: 'dance', icon: <Music size={14} />, label: 'Vals' }
];

function ItineraryIcon({ id, size = 16 }: { id: string; size?: number }) {
    const item = ITINERARY_ICONS_LIST.find(i => i.id === id);
    if (!item) return <Clock size={size} />;
    return item.icon;
}

// ─── SVG Icons for Dress Code (Premium Artistic Style) ──────────────────────
function DressIcon({ type, gender, size = 32 }: { type: string; gender: 'women' | 'men'; color?: string; size?: number }) {
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

// ─── Invitation Preview (Real-time Sync) ────────────────────────────────────
function Preview({ data }: { data: EventData }) {
    const lang = data.language === 'en' ? 'en' : 'es';
    const t = {
        es: { 
            parents: 'Nuestros Padres', 
            parents_bride: 'Padres de la Novia',
            parents_groom: 'Padres del Novio',
            godparents: 'Nuestros Padrinos', 
            blessing: 'Con la bendición de Dios', 
            date: 'Fecha', 
            venue: 'Lugar', 
            dress: 'Código de Vestimenta', 
            adults: 'Solo Adultos', 
            women: 'Damas', 
            men: 'Caballeros', 
            gallery: 'Galería de Fotos',
            invitation: 'Invitación',
            itinerary: 'Itinerario',
            gift: 'Mesa de Regalos',
            gift_msg: 'Tu presencia es nuestro mejor regalo, pero si deseas obsequiarnos algo:',
            envelope: 'Lluvia de Sobres',
            envelope_msg: 'Agradecemos tu detalle en efectivo el día del evento.',
            code: 'Código:',
            add_calendar: 'Añadir al Calendario'
        },
        en: { 
            parents: 'Our Parents', 
            parents_bride: 'Parents of the Bride',
            parents_groom: 'Parents of the Groom',
            godparents: 'Godparents', 
            blessing: 'With God\'s blessing', 
            date: 'Date', 
            venue: 'Venue', 
            dress: 'Dress Code', 
            adults: 'Adults Only', 
            women: 'Ladies', 
            men: 'Gentlemen', 
            gallery: 'Photo Gallery',
            invitation: 'Invitation',
            itinerary: 'Itinerary',
            gift: 'Gift Registry',
            gift_msg: 'Your presence is our best gift, but if you wish to give us something:',
            envelope: 'Envelope Shower',
            envelope_msg: 'We appreciate your cash gift on the day of the event.',
            code: 'Code:',
            add_calendar: 'Add to Calendar'
        }
    }[lang];

    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.log("Audio play blocked", e));
        }
        setIsPlaying(!isPlaying);
    };

    const theme = data.styles_json || {};
    const bg = theme.background || '#fdf8f0';
    const primary = theme.primary || '#a35d6a';
    const font = theme.font || 'Playfair Display';

    // Load Font
    useEffect(() => {
        if (font) {
            const link = document.createElement('link');
            link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}:wght@400;700&display=swap`;
            link.rel = 'stylesheet';
            document.head.appendChild(link);
            return () => { document.head.removeChild(link); };
        }
    }, [font]);

    const formats: Record<string, Intl.DateTimeFormatOptions> = {
        long: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
        short: { day: '2-digit', month: '2-digit', year: 'numeric' },
        abbrev: { weekday: 'short', day: 'numeric', month: 'short' },
    };
    const dateFormatOptions: Intl.DateTimeFormatOptions = formats[data.date_format || 'long'] || formats.long;

    const timeFormats: Record<string, Intl.DateTimeFormatOptions> = {
        '24h': { hour: '2-digit', minute: '2-digit', hour12: false },
        '12h': { hour: '2-digit', minute: '2-digit', hour12: true },
    };
    const timeFormatOptions: Intl.DateTimeFormatOptions = timeFormats[data.time_format || '24h'] || timeFormats['24h'];

    const formattedDate = data.event_date
        ? new Date(data.event_date + 'T12:00:00').toLocaleDateString(lang === 'en' ? 'en-US' : 'es-MX', dateFormatOptions)
        : null;

    const formattedTime = data.event_time
        ? new Date(`2000-01-01T${data.event_time}`).toLocaleTimeString(lang === 'en' ? 'en-US' : 'es-MX', timeFormatOptions)
        : null;

    return (
        <div className="w-full min-h-full flex flex-col items-center bg-white relative overflow-x-hidden pb-20" style={{ background: bg, fontFamily: `'${font}', serif`, color: theme.text || '#2d1b2d' }}>
            {data.music_url && (
                <>
                    <audio key={data.music_url} ref={audioRef} src={data.music_url} loop />
                    <button 
                        onClick={togglePlay}
                        className="fixed bottom-6 right-6 z-[100] w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-90 border border-black/5"
                        style={{ color: primary }}
                    >
                        <motion.div
                            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        >
                            <Music size={20} className={isPlaying ? 'text-[#a35d6a]' : 'text-gray-300'} />
                        </motion.div>
                        {isPlaying && (
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                            </span>
                        )}
                    </button>
                </>
            )}
            {/* Hero / Cover */}
            <div className="w-full h-[280px] relative shrink-0">
                {data.cover_image_url ? (
                    <img src={data.cover_image_url} className="w-full h-full object-cover" alt="Hero" />
                ) : (
                    <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${primary}, ${theme.secondary || '#7B2D8B'})` }} />
                )}
                <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t" style={{ backgroundImage: `linear-gradient(to top, ${bg}, ${bg}E6 40%, transparent)` }} />
            </div>

            <div className="px-6 py-10 w-full flex flex-col items-center gap-6 -mt-32 relative z-10 backdrop-blur-sm rounded-t-[50px] transition-all duration-700" style={{ borderColor: `${primary}20` }}>
                <span className="text-[9px] font-black tracking-[0.4em] uppercase opacity-40" style={{ color: primary }}>{t.invitation}</span>
                <h1 className="text-3xl font-bold leading-tight uppercase text-center animate-fade-in" style={{ color: primary, fontFamily: `'${font}', serif` }}>{data.title || 'Título del Evento'}</h1>

                {(data.parents_bride_father || data.parents_bride_mother || data.parents_groom_father || data.parents_groom_mother) && (
                    <div className="flex flex-col gap-4 text-center mt-2">
                        <p className="text-[10px] italic opacity-50" style={{ color: theme.text }}>{t.blessing}</p>
                        <div className="space-y-3">
                            {(data.parents_bride_father || data.parents_bride_mother) && (
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{t.parents_bride}</p>
                                    {data.parents_bride_father && <p className="text-xs font-bold uppercase">{data.parents_bride_father_deceased && '✝'} {data.parents_bride_father}</p>}
                                    {data.parents_bride_mother && <p className="text-xs font-bold uppercase">{data.parents_bride_mother_deceased && '✝'} {data.parents_bride_mother}</p>}
                                </div>
                            )}
                            {(data.parents_bride_father || data.parents_bride_mother) && (data.parents_groom_father || data.parents_groom_mother) && (
                                <div className="w-6 h-[1px] mx-auto opacity-20" style={{ backgroundColor: primary }} />
                            )}
                            {(data.parents_groom_father || data.parents_groom_mother) && (
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{t.parents_groom}</p>
                                    {data.parents_groom_father && <p className="text-xs font-bold uppercase">{data.parents_groom_father_deceased && '✝'} {data.parents_groom_father}</p>}
                                    {data.parents_groom_mother && <p className="text-xs font-bold uppercase">{data.parents_groom_mother_deceased && '✝'} {data.parents_groom_mother}</p>}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {data.message && <p className="text-sm italic opacity-80 max-w-[240px] text-center leading-relaxed">"{data.message}"</p>}
                {data.message_secondary && <p className="text-[10px] font-bold opacity-60 max-w-[200px] text-center leading-relaxed mt-[-10px]">{data.message_secondary}</p>}

                <div className="w-full py-10 border-y flex flex-col items-center gap-5" style={{ borderColor: `${primary}15` }}>
                    {formattedDate && <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">{formattedDate}</p>}
                    <div className="flex flex-col items-center gap-1">
                        <p className="text-2xl font-bold" style={{ color: primary }}>{data.venue || 'Nombre del Lugar'}</p>
                        <p className="text-[10px] opacity-60 uppercase tracking-widest font-bold">{data.venue_address || 'Dirección'}</p>
                    </div>
                    {formattedTime && <p className="text-xs font-black uppercase tracking-widest opacity-40">{formattedTime}</p>}

                    {data.calendar_enabled && (
                        <button className="mt-2 px-6 py-2.5 rounded-full border text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-black hover:text-white transition-all shadow-sm" style={{ borderColor: `${primary}30`, color: primary }}>
                            <Calendar size={12} /> {t.add_calendar}
                        </button>
                    )}
                </div>

                <div className="flex flex-col items-center gap-10 py-6 w-full">
                    {data.dress_code && (
                        <div className="text-center w-full">
                            {data.dress_code_show_title && <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-4" style={{ color: primary }}>{t.dress}</p>}
                            <p className="text-lg font-bold italic mb-1" style={{ color: primary }}>{data.dress_code}</p>
                            {data.dress_code_detail && <p className="text-[10px] opacity-60 mb-6 max-w-[200px] mx-auto leading-relaxed">{data.dress_code_detail}</p>}

                            {data.dress_code_icons_enabled && (
                                <div className="flex justify-center gap-12 mt-4">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-14 h-14 rounded-full flex items-center justify-center bg-white shadow-sm border border-black/5">
                                            <DressIcon type={data.dress_code_women} gender="women" color={primary} />
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <p className="text-[8px] font-black uppercase opacity-40 tracking-widest">{t.women}</p>
                                            <p className="text-[10px] font-bold">{data.dress_code_women || 'Vestido'}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-14 h-14 rounded-full flex items-center justify-center bg-white shadow-sm border border-black/5">
                                            <DressIcon type={data.dress_code_men} gender="men" color={primary} />
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <p className="text-[8px] font-black uppercase opacity-40 tracking-widest">{t.men}</p>
                                            <p className="text-[10px] font-bold">{data.dress_code_men || 'Traje'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {data.itinerary_items && data.itinerary_items.length > 0 && (
                        <div className="w-full space-y-8 mt-6">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-8 h-[1px] opacity-20" style={{ backgroundColor: primary }} />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40" style={{ color: primary }}>{t.itinerary}</h3>
                            </div>
                            <div className="flex flex-col gap-8 px-4">
                                {data.itinerary_items.map((item, i) => (
                                    <div key={i} className="flex gap-6 items-start relative">
                                        {i < data.itinerary_items.length - 1 && (
                                            <div className="absolute left-[23px] top-12 bottom-[-32px] w-[1px] border-l border-dashed border-gray-200" />
                                        )}
                                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-black/5 flex items-center justify-center shrink-0">
                                            <ItineraryIcon id={item.icon} size={20} />
                                        </div>
                                        <div className="flex flex-col gap-1 pt-1 text-left">
                                            <p className="text-[9px] font-black uppercase tracking-widest opacity-40">{item.time}</p>
                                            <p className="text-sm font-bold">{item.name}</p>
                                            {item.description && <p className="text-[10px] text-gray-500 leading-relaxed max-w-[200px]">{item.description}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {data.gallery_urls && data.gallery_urls.length > 0 && (
                        <div className="w-full space-y-6 mt-4">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-8 h-[1px] opacity-20" style={{ backgroundColor: primary }} />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40" style={{ color: primary }}>{t.gallery}</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-3 px-2">
                                {data.gallery_urls.map((url: string, i: number) => (
                                    <div key={i} className={`aspect-[4/5] rounded-3xl overflow-hidden shadow-sm border-4 border-white transform transition-transform hover:scale-[1.02] ${i % 2 === 0 ? '-rotate-1' : 'rotate-1'}`}>
                                        <img src={url} className="w-full h-full object-cover" alt={`Gallery ${i}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {data.adults_only && (
                        <div className="mt-10 px-6 py-2.5 rounded-full border text-[9px] font-black uppercase tracking-widest flex items-center gap-3 shadow-sm" style={{ borderColor: `${primary}20`, color: primary }}>
                            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: primary }} />
                            {t.adults}
                        </div>
                    )}

                    {data.gift_registry_enabled && (
                        <div className="mt-16 w-[90%] p-10 rounded-[40px] border-2 border-dashed flex flex-col items-center gap-6 group transition-all" style={{ borderColor: `${primary}15`, background: `${primary}05` }}>
                            <div className="w-16 h-16 rounded-3xl bg-white shadow-xl flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform">
                                <Gift size={32} style={{ color: primary }} />
                            </div>
                            <div className="text-center space-y-2">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">{t.gift}</h4>
                                <p className="text-xs opacity-60 max-w-[200px] leading-relaxed italic">{t.gift_msg}</p>
                            </div>
                            
                            {data.gift_registry_type === 'link' && data.gift_registry_url && (
                                <a href={data.gift_registry_url} target="_blank" className="w-full py-4 rounded-2xl bg-black text-white text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all">
                                    <ExternalLink size={14} /> {lang === 'en' ? 'Open Registry' : 'Ver Mesa'}
                                </a>
                            )}

                            {data.gift_registry_type === 'code' && data.gift_registry_code && (
                                <div className="w-full py-4 rounded-2xl border-2 bg-white flex flex-col items-center justify-center gap-1 shadow-sm" style={{ borderColor: `${primary}20` }}>
                                    <span className="text-[9px] font-black opacity-30 uppercase">{t.code}</span>
                                    <span className="text-xl font-bold tracking-tight" style={{ color: primary }}>{data.gift_registry_code}</span>
                                </div>
                            )}

                            {data.gift_registry_type === 'envelope' && (
                                <div className="text-center">
                                    <p className="text-[10px] font-bold uppercase tracking-widest leading-loose" style={{ color: primary }}>{t.envelope}</p>
                                    <p className="text-[9px] opacity-40 uppercase max-w-[180px] mx-auto">{t.envelope_msg}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Shared Components ──────────────────────────────────────────────────────
function SectionHeader({ icon, title, open, onToggle }: any) {
    return (
        <button onClick={onToggle} className={`w-full flex items-center justify-between p-5 transition-all group ${open ? 'bg-gradient-to-r from-rose-50/50 to-transparent' : 'hover:bg-gray-50'}`}>
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-sm border ${open ? 'bg-[#a35d6a] text-white border-[#a35d6a] rotate-3' : 'bg-white text-[#a35d6a] border-rose-100 group-hover:rotate-6'}`}>
                    {icon}
                </div>
                <div className="flex flex-col items-start gap-0.5">
                    <span className={`text-[11px] font-black uppercase tracking-[0.1em] transition-colors ${open ? 'text-[#a35d6a]' : 'text-[#7a5060]'}`}>{title}</span>
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">{open ? 'Cerrar sección' : 'Personalizar'}</span>
                </div>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${open ? 'bg-[#a35d6a]/10 text-[#a35d6a] rotate-180' : 'bg-gray-100 text-gray-400'}`}>
                <ChevronDown size={14} />
            </div>
        </button>
    );
}

// ─── Main Editor Component ──────────────────────────────────────────────────
export default function EditorPage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [eventData, setEventData] = useState<EventData | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [isPublished, setIsPublished] = useState(false);
    const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');
    const [uploadLoading, setUploadLoading] = useState(false);
    const [galleryLoading, setGalleryLoading] = useState(false);
    const [isGeneratingTheme, setIsGeneratingTheme] = useState(false);
    const [themePrompt, setThemePrompt] = useState('');
    const [generatedTheme, setGeneratedTheme] = useState<Theme | null>(null);
    const [rsvpCount, setRsvpCount] = useState(0);

    const [openSections, setOpenSections] = useState({
        info: true,
        invitation: false,
        personal: false,
        dressCode: false,
        gallery: false,
        templates: false,
        extra: false,
        security: false,
        theme: false,
        design: true,
        itinerary: false
    });
    const [expandedItineraryItems, setExpandedItineraryItems] = useState<number[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeGroup, setActiveGroup] = useState<'content' | 'design' | 'security'>('content');

    const [lastSaved, setLastSaved] = useState<string | null>(null);

    const calculateCompletion = useCallback(() => {
        if (!eventData) return 0;
        const criticalFields = ['title', 'slug', 'event_date', 'event_time', 'venue', 'venue_address', 'cover_image_url'];
        const completed = criticalFields.filter(f => !!(eventData as any)[f]).length;
        return Math.round((completed / criticalFields.length) * 100);
    }, [eventData]);

    const fetchEvent = useCallback(async () => {
        const { data, error } = await supabase.from('events').select('*').eq('id', params.id).single();
        if (error) {
            toast.error('Error al cargar invitación');
            router.push('/dashboard');
        } else {
            setEventData(data);
            setIsPublished(data.is_published);
            
            // Fetch RSVP count
            const { count } = await supabase
                .from('rsvp')
                .select('*', { count: 'exact', head: true })
                .eq('event_id', params.id)
                .eq('status', 'confirmed');
            
            setRsvpCount(count || 0);
        }
        setLoading(false);
    }, [params.id, router]);

    useEffect(() => {
        fetchEvent();
    }, [fetchEvent]);

    const update = (field: string, value: any) => {
        if (!eventData) return;
        setEventData(prev => prev ? ({ ...prev, [field]: value }) : null);
        setHasChanges(true);
    };

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section as keyof typeof openSections]: !prev[section as keyof typeof openSections] }));
    };

    const handleSave = async (auto = false) => {
        if (!eventData || (auto && !hasChanges)) return;
        setIsSaving(true);

        // Extraemos id y campos que no deben actualizarse directamente
        const { id, created_at, user_id, ...updateData } = eventData as any;

        const { error } = await supabase.from('events').update({
            ...updateData,
            updated_at: new Date().toISOString()
        }).eq('id', id);

        if (!error && !auto) {
            toast.success('Cambios guardados');
            setHasChanges(false);
            setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        } else if (error) {
            console.error('Error saving invitation:', error);
            toast.error('Error al guardar: ' + error.message);
        }
        setIsSaving(false);
    };

    const addItineraryItem = () => {
        const newItem = { name: 'Recepción', time: '', icon: 'church', description: '' };
        const updatedItems = [...(eventData?.itinerary_items || []), newItem];
        update('itinerary_items', updatedItems);
        // Expandimos el nuevo item automáticamente
        setExpandedItineraryItems(prev => [...prev, updatedItems.length - 1]);
    };

    const removeItineraryItem = (index: number) => {
        const updated = [...(eventData?.itinerary_items || [])];
        updated.splice(index, 1);
        update('itinerary_items', updated);
    };

    const updateItineraryItem = (index: number, field: string, value: any) => {
        const updated = [...(eventData?.itinerary_items || [])];
        updated[index] = { ...updated[index], [field]: value };
        update('itinerary_items', updated);
    };

    const handlePublish = async () => {
        if (!eventData) return;
        if (eventData.plan === 'Prueba') {
            toast.error('El plan Prueba no permite publicación. Por favor sube de nivel tu plan.');
            return;
        }
        const newState = !isPublished;
        const { error } = await supabase.from('events').update({ is_published: newState }).eq('id', eventData.id);
        if (!error) {
            setIsPublished(newState);
            toast.success(newState ? 'Invitación publicada' : 'Invitación retirada');
        }
    };

    const handleGalleryUpload = async (files: FileList) => {
        if (!eventData) return;
        setGalleryLoading(true);
        const updatedUrls = [...(eventData.gallery_urls || [])];

        for (const file of Array.from(files)) {
            const ext = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
            const path = `${eventData.id}/gallery/${fileName}`;
            const { error: uploadError } = await supabase.storage.from('gallery').upload(path, file);
            if (!uploadError) {
                const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(path);
                updatedUrls.push(publicUrl);
            }
        }

        update('gallery_urls', updatedUrls);
        // Persistir inmediatamente para que el usuario no pierda el progreso de subida
        await supabase.from('events').update({ gallery_urls: updatedUrls }).eq('id', eventData.id);
        setGalleryLoading(false);
        toast.success('Fotos añadidas a la galería y guardadas');
    };

    const removeGalleryImage = async (url: string) => {
        if (!eventData) return;
        const updated = eventData.gallery_urls.filter(u => u !== url);
        update('gallery_urls', updated);
        await supabase.from('events').update({ gallery_urls: updated }).eq('id', eventData.id);
    };

    const handleCoverImageUpload = async (file: File) => {
        if (!eventData) return;
        setUploadLoading(true);
        try {
            const ext = file.name.split('.').pop();
            const fileName = `cover_${Date.now()}.${ext}`;
            const path = `${eventData.id}/${fileName}`;
            const { error: uploadError } = await supabase.storage.from('covers').upload(path, file, { upsert: true });
            if (uploadError) throw uploadError;
            const { data: { publicUrl } } = supabase.storage.from('covers').getPublicUrl(path);

            // Actualizar estado y persistir en BD inmediatamente
            setEventData(prev => prev ? { ...prev, cover_image_url: publicUrl } : null);
            await supabase.from('events').update({ cover_image_url: publicUrl }).eq('id', eventData.id);
            setHasChanges(false);

            toast.success('Imagen de portada actualizada');
        } catch (e: any) {
            console.error('Upload error:', e);
            toast.error('Error al subir portada: ' + e.message);
        } finally {
            setUploadLoading(false);
        }
    };

    const handleMusicUpload = async (file: File) => {
        if (!eventData) return;
        setUploadLoading(true);
        try {
            const ext = file.name.split('.').pop();
            const fileName = `music_${Date.now()}.${ext}`;
            const path = `${eventData.id}/${fileName}`;
            const { error: uploadError } = await supabase.storage.from('covers').upload(path, file, { upsert: true });
            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage.from('covers').getPublicUrl(path);
            update('music_url', publicUrl);
            await supabase.from('events').update({ music_url: publicUrl }).eq('id', eventData.id);
            toast.success('Música actualizada');
        } catch (err: any) {
            toast.error('Error al subir música: ' + (err.message || 'Error desconocido'));
        } finally {
            setUploadLoading(false);
        }
    };

    const handleVenueImageUpload = async (file: File) => {
        if (!eventData) return;
        setUploadLoading(true);
        try {
            const ext = file.name.split('.').pop();
            const fileName = `venue_${Date.now()}.${ext}`;
            const path = `${eventData.id}/${fileName}`;
            const { error: uploadError } = await supabase.storage.from('covers').upload(path, file, { upsert: true });
            if (uploadError) throw uploadError;
            const { data: { publicUrl } } = supabase.storage.from('covers').getPublicUrl(path);
            update('venue_image_url', publicUrl);
            toast.success('Imagen del lugar cargada');
        } catch (e: any) { toast.error('Error al subir imagen del lugar: ' + e.message); }
        finally { setUploadLoading(false); }
    };

    const handleGenerateTheme = async () => {
        if (!themePrompt.trim()) return;
        setIsGeneratingTheme(true);
        setGeneratedTheme(null);
        try {
            const response = await fetch('/api/ai/theme', {
                method: 'POST',
                body: JSON.stringify({ prompt: themePrompt, eventType: eventData.event_type })
            });
            const data = await response.json();
            if (data && data.colors) {
                // Mapear respuesta de la API al formato esperado por el componente
                const mappedTheme: Theme = {
                    style: data.theme_name || 'IA Style',
                    primary: data.colors.primary,
                    secondary: data.colors.secondary,
                    accent: data.colors.accent,
                    background: data.colors.background,
                    text: data.colors.text,
                    font: data.fonts.heading
                };
                setGeneratedTheme(mappedTheme);
            } else {
                toast.error('La IA no pudo generar un tema válido');
            }
        } catch (e) {
            toast.error('Error con IA');
        } finally {
            setIsGeneratingTheme(false);
        }
    };

    const applyTheme = () => {
        if (!generatedTheme) return;
        update('styles_json', { ...generatedTheme });
        toast.success('Nuevo tema aplicado');
        setGeneratedTheme(null);
    };

    if (loading || !eventData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-[#a35d6a]" size={40} />
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Sincronizando invitación...</p>
                </div>
            </div>
        );
    }

    const inputCls = "w-full px-4 py-3 rounded-xl border bg-white focus:ring-2 focus:ring-[#a35d6a]/20 outline-none transition-all text-sm";
    const borderColor = "#f3e8eb";

    return (
        <div className="flex flex-col h-screen bg-white">
            {/* ── TOP NAV ─────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-6 py-3 border-b shrink-0 bg-white/95 backdrop-blur-xl z-50 shadow-sm">
                <div className="flex items-center gap-4">
                    {/* Mobile Menu Trigger */}
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="md:hidden p-2 hover:bg-rose-50 rounded-xl text-[#a35d6a] transition-all"
                    >
                        <Menu size={20} />
                    </button>

                    <div className="flex items-center gap-3">
                        <Link href="/dashboard" className="hidden sm:flex p-2.5 hover:bg-rose-50 rounded-2xl transition-all text-gray-400 hover:text-[#a35d6a] bg-gray-50/50"><ArrowLeft size={18} /></Link>
                        <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2">
                                <h2 className="text-[8px] font-black text-[#a35d6a] uppercase tracking-[0.2em] whitespace-nowrap">Editor</h2>
                                {lastSaved && <span className="hidden xs:inline text-[7px] text-gray-400 font-bold uppercase">• {lastSaved}</span>}
                            </div>
                            <h1 className="text-[12px] sm:text-sm font-black text-gray-900 truncate max-w-[120px] sm:max-w-[200px] flex items-center gap-2">
                                {eventData.title}
                                {isPublished && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />}
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Progress Indicator (Premium Upgrade) */}
                <div className="hidden lg:flex flex-col items-center gap-1.5 min-w-[240px]">
                    <div className="flex justify-between w-full px-1">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#a35d6a] animate-pulse" />
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Estado de Preparación</span>
                        </div>
                        <span className="text-[10px] font-bold text-[#a35d6a] bg-rose-50 px-2 py-0.5 rounded-full">{calculateCompletion()}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-50 p-[2px] shadow-inner">
                        <div
                            className="h-full bg-gradient-to-r from-[#a35d6a] via-[#7B2D8B] to-[#a35d6a] bg-[length:200%_auto] animate-gradient transition-all duration-1000 ease-out rounded-full shadow-[0_0_8px_rgba(163,93,106,0.4)]"
                            style={{ width: `${calculateCompletion()}%` }}
                        />
                    </div>
                </div>

                <div className="md:hidden flex bg-gray-100/30 rounded-xl p-0.5 border border-gray-100 shrink-0">
                    <button onClick={() => setMobileTab('edit')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${mobileTab === 'edit' ? 'bg-white shadow-sm text-[#a35d6a]' : 'text-gray-400'}`}>Edit</button>
                    <button onClick={() => setMobileTab('preview')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${mobileTab === 'preview' ? 'bg-white shadow-sm text-[#a35d6a]' : 'text-gray-400'}`}>View</button>
                </div>

                <div className="hidden md:flex items-center gap-3">
                    <div className="flex flex-col items-end mr-2">
                        <span className={`text-[9px] font-black uppercase tracking-tighter ${isPublished ? 'text-emerald-500' : 'text-gray-400'}`}>
                            {isPublished ? 'Invitación Pública' : 'Modo Borrador'}
                        </span>
                        {hasChanges && <span className="text-[8px] text-amber-500 font-bold animate-pulse uppercase">Cambios sin guardar</span>}
                    </div>
                    <button onClick={() => handleSave()} disabled={isSaving || !hasChanges} className="flex items-center gap-2 px-6 py-2.5 bg-[#a35d6a] text-white rounded-2xl text-xs font-bold hover:opacity-90 active:scale-95 disabled:opacity-30 disabled:grayscale transition-all shadow-lg shadow-[#a35d6a]/20">
                        {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        {isSaving ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                {/* ── DESKTOP SIDEBAR ────────────────────────────────────────── */}
                <aside 
                    className="hidden md:flex flex-col w-[90px] border-r border-white/5 z-40 items-center py-10 gap-10 shadow-2xl"
                    style={{ background: 'linear-gradient(180deg, #2d1b2d 0%, #1a0f1a 100%)' }}
                >
                    <div className="w-12 h-12 rounded-[1.2rem] bg-white/5 flex items-center justify-center text-white/80 mb-2 border border-white/10 shadow-sm">
                        <Wand2 size={24} className="animate-pulse" />
                    </div>
                    
                    <nav className="flex-1 flex flex-col gap-6 items-center">
                        {[
                            { id: 'content', icon: <Layout size={20} />, label: 'Contenido', group: 'content' },
                            { id: 'design', icon: <Palette size={20} />, label: 'Diseño', group: 'design' },
                            { id: 'security', icon: <Shield size={20} />, label: 'Seguridad', group: 'security' },
                            { id: 'rsvp', icon: <Users size={20} />, label: 'Invitados', href: `/dashboard/rsvp/${eventData.id}` },
                        ].map((item) => {
                            const isActive = item.group ? activeGroup === item.group : false;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        if (item.href) {
                                            router.push(item.href);
                                            return;
                                        }
                                        if (item.group) {
                                            setActiveGroup(item.group as any);
                                            // Reset all open sections first, then open the primary one for the group
                                            setOpenSections({
                                                info: item.group === 'content',
                                                invitation: false,
                                                personal: false,
                                                dressCode: false,
                                                gallery: false,
                                                templates: false,
                                                extra: false,
                                                security: item.group === 'security',
                                                theme: false,
                                                design: false,
                                                itinerary: item.group === 'content'
                                            });
                                        }
                                        setMobileTab('edit');
                                    }}
                                    className={`group relative flex flex-col items-center gap-1.5 p-4 rounded-2xl transition-all duration-300 ${
                                        isActive 
                                            ? 'bg-white/10 text-white shadow-xl shadow-black/20 border border-white/10 active:scale-95' 
                                            : 'text-white/40 hover:text-white/70 hover:bg-white/5 active:scale-95'
                                    }`}
                                >
                                    {item.icon}
                                    <span className={`text-[8px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}>
                                        {item.label}
                                    </span>
                                    {item.id === 'rsvp' && rsvpCount > 0 && (
                                        <div className="absolute top-2 right-2 flex items-center justify-center min-w-[16px] h-[16px] px-1 rounded-full bg-rose-500 text-white text-[7px] font-bold shadow-lg shadow-rose-900/50 animate-scale-in">
                                            {rsvpCount}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    <div className="mt-auto flex flex-col gap-8 items-center pb-4">
                        <Link href="/dashboard" className="p-3 text-white/20 hover:text-white/60 hover:bg-white/5 rounded-xl transition-all"><ArrowLeft size={20} /></Link>
                        <div className="relative group cursor-help">
                            <div className="w-10 h-10 rounded-2xl bg-[#a35d6a] flex items-center justify-center text-[12px] font-black text-white shadow-xl shadow-rose-900/20 border border-white/10 group-hover:scale-110 transition-transform">
                                {eventData.plan[0]}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* ── MOBILE SIDEBAR DRAWER ────────────────────────────────────── */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsSidebarOpen(false)}
                                className="md:hidden fixed inset-0 bg-[#2d1b2d]/60 backdrop-blur-sm z-[100]"
                            />
                            <motion.aside
                                initial={{ x: '-100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '-100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="md:hidden fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[110] shadow-2xl flex flex-col"
                            >
                                <div className="px-6 py-10 flex flex-col gap-8">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#a35d6a] to-[#7B2D8B] p-0.5 shadow-lg">
                                                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                                                    <Wand2 size={16} className="text-[#a35d6a]" />
                                                </div>
                                            </div>
                                            <span className="text-xs font-black uppercase tracking-widest text-[#2d1b2d]">Opciones</span>
                                        </div>
                                        <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-rose-50 rounded-xl text-gray-400"><X size={18} /></button>
                                    </div>

                                    <nav className="flex flex-col gap-2">
                                        {[
                                            { id: 'content', icon: <Layout size={16} />, label: 'Contenido', group: 'content' },
                                            { id: 'design', icon: <Palette size={16} />, label: 'Diseño', group: 'design' },
                                            { id: 'security', icon: <Shield size={16} />, label: 'Seguridad / QR', group: 'security' },
                                            { id: 'rsvp', icon: <Users size={16} />, label: 'Gestiòn de Invitados', href: `/dashboard/rsvp/${eventData.id}` },
                                            { id: 'back', icon: <ArrowLeft size={16} />, label: 'Volver al Inicio', href: '/dashboard' }
                                        ].map((item) => {
                                            if (item.href) {
                                                return (
                                                    <Link key={item.id} href={item.href} className="relative flex items-center gap-3 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-[#7a5060]/70 hover:bg-rose-50 hover:text-[#a35d6a] transition-all group">
                                                        {item.icon} {item.label}
                                                        {item.id === 'rsvp' && rsvpCount > 0 && (
                                                            <span className="ml-auto w-5 h-5 flex items-center justify-center rounded-full bg-rose-500 text-white text-[9px] font-bold shadow-sm">
                                                                {rsvpCount}
                                                            </span>
                                                        )}
                                                    </Link>
                                                );
                                            }
                                            return (
                                                <button
                                                    key={item.id}
                                                    onClick={() => {
                                                        if (item.group) {
                                                            setActiveGroup(item.group as any);
                                                            setOpenSections({
                                                                info: item.group === 'content',
                                                                invitation: false,
                                                                personal: false,
                                                                dressCode: false,
                                                                gallery: false,
                                                                templates: false,
                                                                extra: false,
                                                                security: item.group === 'security',
                                                                theme: false,
                                                                design: false,
                                                                itinerary: item.group === 'content'
                                                            });
                                                        }
                                                        setIsSidebarOpen(false);
                                                        setMobileTab('edit');
                                                    }}
                                                    className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeGroup === item.group ? 'bg-rose-50 text-[#a35d6a]' : 'text-[#7a5060]/70 hover:bg-rose-50 hover:text-[#a35d6a]'}`}
                                                >
                                                    {item.icon} {item.label}
                                                </button>
                                            );
                                        })}
                                    </nav>
                                </div>
                                <div className="mt-auto p-6 border-t border-rose-100 flex flex-col gap-4">
                                     <div className="flex flex-col gap-1 px-2">
                                         <span className="text-[9px] font-black uppercase text-[#a35d6a]/40 tracking-[0.2em]">Suscripción</span>
                                         <span className="text-[11px] font-bold text-[#2d1b2d] uppercase">Plan {eventData.plan}</span>
                                     </div>
                                </div>
                            </motion.aside>
                        </>
                    )}
                </AnimatePresence>

                <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
                    {/* ── LEFT PANEL (Scrollable) ────────────────────────────────────── */}
                <div className={`${mobileTab === 'edit' ? 'flex' : 'hidden'} md:flex w-full md:w-[45%] md:min-w-[420px] flex-col border-r overflow-y-auto bg-white/80 backdrop-blur-2xl custom-scrollbar focus:outline-none relative z-10`} style={{ borderColor }}>
                    <AnimatePresence mode="wait">
                        {/* ── GRUPO 1: CONTENIDO ────────────────────────────────────────── */}
                        {activeGroup === 'content' && (
                        <motion.div 
                            key="content"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex flex-col pb-32"
                        >
                            <div className="px-6 py-10 border-b bg-gradient-to-br from-rose-50/30 to-transparent flex flex-col justify-center min-h-[120px]" style={{ borderColor }}>
                                <h2 className="text-[14px] font-bold text-[#2d1b2d] uppercase tracking-[0.4em] flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#a35d6a]" />
                                    Contenido
                                </h2>
                            </div>

                            <div className="flex flex-col">
                                {/* 1. Página Principal */}
                                <div className={`transition-all duration-500 ${openSections.info ? 'my-6 mx-2 rounded-[2.5rem] border-2 bg-white shadow-2xl shadow-[#a35d6a]/10 overflow-hidden ring-4 ring-rose-50/50' : 'border-b'} `} style={{ borderColor: openSections.info ? '#a35d6a20' : borderColor }}>
                                    <SectionHeader icon={<Layout size={15} />} title="Página principal" open={openSections.info} onToggle={() => toggleSection('info')} />
                                    {openSections.info && (
                                        <div className="px-6 pb-6 pt-2 flex flex-col gap-6 animate-fade-in text-left">
                                            <div className="space-y-5">
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-[10px] font-bold text-[#7a5060] uppercase tracking-widest flex items-center gap-2">
                                                        <CreditCard size={11} className="text-[#a35d6a]" /> Plan de Invitación
                                                    </label>
                                                    <select
                                                        value={eventData.plan || 'Prueba'}
                                                        onChange={(e) => update('plan', e.target.value)}
                                                        className={inputCls + ' h-11 border-2 font-bold text-xs focus:border-[#a35d6a] bg-white shadow-sm'}
                                                        style={{ borderColor }}
                                                    >
                                                        <option value="Prueba">Prueba (Gratis)</option>
                                                        <option value="Plata">Plata ($299 MXN)</option>
                                                        <option value="Oro">Oro ($499 MXN)</option>
                                                        <option value="Diamante">Diamante ($799 MXN)</option>
                                                    </select>
                                                </div>

                                                <div className="flex flex-col gap-3">
                                                    <label className="text-[10px] font-bold text-[#7a5060] uppercase tracking-widest flex items-center gap-2">
                                                        <ImageIcon size={11} className="text-[#a35d6a]" /> Imagen de Portada
                                                    </label>
                                                    <div className="flex gap-2">
                                                        <label className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-[#e8d0d7] text-[10px] font-black text-[#a35d6a] cursor-pointer hover:bg-rose-50 transition-all">
                                                            {uploadLoading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                                                            {eventData.cover_image_url ? 'CAMBIAR PORTADA' : 'SUBIR PORTADA'}
                                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleCoverImageUpload(e.target.files[0])} />
                                                        </label>
                                                        {eventData.cover_image_url && (
                                                            <button onClick={() => update('cover_image_url', '')} className="p-3 rounded-2xl border bg-white text-red-500 hover:bg-red-50 transition-all">
                                                                <Trash2 size={14} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-3">
                                                    <div className="flex items-center justify-between px-1">
                                                        <label className="text-[10px] font-bold text-[#a35d6a] uppercase tracking-widest">Idioma</label>
                                                        <span className="text-[9px] font-bold text-gray-400 uppercase">{eventData.language === 'en' ? 'Inglés' : 'Español'}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between p-4 bg-rose-50/40 rounded-2xl border border-rose-100">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[10px] font-black text-[#7a5060] uppercase">Activar Inglés</span>
                                                            <span className="text-[9px] text-gray-400 font-bold uppercase">Multilenguaje</span>
                                                        </div>
                                                        <button 
                                                            onClick={() => update('language', eventData.language === 'en' ? 'es' : 'en')}
                                                            className={`w-12 h-6 rounded-full p-1 transition-colors relative ${eventData.language === 'en' ? 'bg-[#a35d6a]' : 'bg-gray-300'}`}
                                                        >
                                                            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-500 ${eventData.language === 'en' ? 'translate-x-6' : 'translate-x-0'}`} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-3">
                                                    <label className="text-[10px] font-bold text-[#7a5060] uppercase tracking-widest flex items-center gap-2">
                                                        <Music size={11} className="text-[#a35d6a]" /> Música de Fondo
                                                    </label>
                                                    <div className="space-y-3">
                                                        <input 
                                                            value={eventData.music_url || ''} 
                                                            onChange={(e) => update('music_url', e.target.value)} 
                                                            placeholder="URL de YouTube, Spotify o MP3..." 
                                                            className={inputCls} 
                                                        />
                                                        <div className="flex items-center gap-2">
                                                            <label className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-[#e8d0d7] text-[10px] font-black text-[#a35d6a] cursor-pointer hover:bg-rose-50 transition-all">
                                                                {uploadLoading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                                                                {eventData.music_url ? 'CAMBIAR ARCHIVO' : 'SUBIR MP3'}
                                                                <input type="file" accept="audio/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleMusicUpload(e.target.files[0])} />
                                                            </label>
                                                            {eventData.music_url && (
                                                                <button onClick={() => update('music_url', '')} className="p-3 rounded-2xl border bg-white text-red-500 hover:bg-red-50 transition-all">
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* 2. Invitación */}
                                <div className={`transition-all duration-500 ${openSections.invitation ? 'my-6 mx-2 rounded-[2.5rem] border-2 bg-white shadow-2xl shadow-[#a35d6a]/10 overflow-hidden ring-4 ring-rose-50/50' : 'border-b'} `} style={{ borderColor: openSections.invitation ? '#a35d6a20' : borderColor }}>
                                    <SectionHeader icon={<FileText size={15} />} title="Invitación" open={openSections.invitation} onToggle={() => toggleSection('invitation')} />
                                    {openSections.invitation && (
                                        <div className="px-6 pb-6 pt-2 flex flex-col gap-6 animate-fade-in text-left">
                                            <div className="space-y-4">
                                                <textarea
                                                    value={eventData.message || ''}
                                                    onChange={(e) => update('message', e.target.value)}
                                                    style={{ borderColor }}
                                                />
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-[10px] font-bold text-[#a35d6a] uppercase tracking-widest px-1">Segundo Mensaje / Frase</label>
                                                    <textarea
                                                        value={eventData.message_secondary || ''}
                                                        onChange={(e) => update('message_secondary', e.target.value)}
                                                        placeholder="Frase secundaria o agradecimiento..."
                                                        rows={2}
                                                        className={inputCls + ' resize-none text-[11px]'}
                                                        style={{ borderColor }}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-1 gap-4">
                                                    <div className="space-y-2">
                                                        <p className="text-[9px] font-bold text-[#a35d6a] uppercase tracking-widest border-b pb-1">Padres de la Novia</p>
                                                        <div className="grid grid-cols-1 gap-2">
                                                            <div className="flex gap-2">
                                                                <input value={eventData.parents_bride_father || ''} onChange={(e) => update('parents_bride_father', e.target.value)} placeholder="Papá de la novia" className={inputCls + ' h-9'} />
                                                                <button onClick={() => update('parents_bride_father_deceased', !eventData.parents_bride_father_deceased)} className={`px-2 rounded-lg border text-[10px] font-bold ${eventData.parents_bride_father_deceased ? 'bg-black text-white' : 'bg-white text-gray-400'}`}>†</button>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <input value={eventData.parents_bride_mother || ''} onChange={(e) => update('parents_bride_mother', e.target.value)} placeholder="Mamá de la novia" className={inputCls + ' h-9'} />
                                                                <button onClick={() => update('parents_bride_mother_deceased', !eventData.parents_bride_mother_deceased)} className={`px-2 rounded-lg border text-[10px] font-bold ${eventData.parents_bride_mother_deceased ? 'bg-black text-white' : 'bg-white text-gray-400'}`}>†</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <p className="text-[9px] font-bold text-[#a35d6a] uppercase tracking-widest border-b pb-1">Padres del Novio</p>
                                                        <div className="grid grid-cols-1 gap-2">
                                                            <div className="flex gap-2">
                                                                <input value={eventData.parents_groom_father || ''} onChange={(e) => update('parents_groom_father', e.target.value)} placeholder="Papá del novio" className={inputCls + ' h-9'} />
                                                                <button onClick={() => update('parents_groom_father_deceased', !eventData.parents_groom_father_deceased)} className={`px-2 rounded-lg border text-[10px] font-bold ${eventData.parents_groom_father_deceased ? 'bg-black text-white' : 'bg-white text-gray-400'}`}>†</button>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <input value={eventData.parents_groom_mother || ''} onChange={(e) => update('parents_groom_mother', e.target.value)} placeholder="Mamá del novio" className={inputCls + ' h-9'} />
                                                                <button onClick={() => update('parents_groom_mother_deceased', !eventData.parents_groom_mother_deceased)} className={`px-2 rounded-lg border text-[10px] font-bold ${eventData.parents_groom_mother_deceased ? 'bg-black text-white' : 'bg-white text-gray-400'}`}>†</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* 3. Datos de Evento */}
                                <div className={`transition-all duration-500 ${openSections.personal ? 'my-6 mx-2 rounded-[2.5rem] border-2 bg-white shadow-2xl shadow-[#a35d6a]/10 overflow-hidden ring-4 ring-rose-50/50' : 'border-b'} `} style={{ borderColor: openSections.personal ? '#a35d6a20' : borderColor }}>
                                    <SectionHeader icon={<Info size={15} />} title="Datos de evento" open={openSections.personal} onToggle={() => toggleSection('personal')} />
                                    {openSections.personal && (
                                        <div className="px-6 pb-6 pt-2 flex flex-col gap-6 animate-fade-in text-left">
                                            <div className="grid grid-cols-1 gap-4">
                                                <select value={eventData.event_type || 'Boda'} onChange={(e) => update('event_type', e.target.value)} className={inputCls}>
                                                    <option value="Boda">Boda</option>
                                                    <option value="XV Años">XV Años</option>
                                                    <option value="Bautizo">Bautizo</option>
                                                    <option value="Cumpleaños">Cumpleaños</option>
                                                </select>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <input type="date" value={eventData.event_date || ''} onChange={(e) => update('event_date', e.target.value)} className={inputCls} />
                                                    <input type="time" value={eventData.event_time || ''} onChange={(e) => update('event_time', e.target.value)} className={inputCls} />
                                                </div>
                                                <div className="space-y-2">
                                                    <input value={eventData.venue || ''} onChange={(e) => update('venue', e.target.value)} placeholder="Lugar / Salón" className={inputCls} />
                                                    <input value={eventData.venue_address || ''} onChange={(e) => update('venue_address', e.target.value)} placeholder="Dirección" className={inputCls} />
                                                </div>
                                                <div className="space-y-4 pt-2">
                                                    <label className="text-[10px] font-bold text-[#7a5060] uppercase tracking-widest flex items-center gap-2">
                                                        <Navigation size={12} className="text-[#a35d6a]" /> Enlaces de Navegación
                                                    </label>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="relative group/map">
                                                            <div className="absolute -inset-1 bg-blue-500/10 rounded-2xl blur-md opacity-0 group-hover/map:opacity-100 transition-opacity" />
                                                            <div className="relative p-3 rounded-2xl border-2 border-gray-50 bg-gray-50/50 flex flex-col gap-2 group-focus-within/map:border-blue-200 transition-all">
                                                                <div className="flex items-center gap-2 text-[10px] font-black text-blue-600/60 uppercase">
                                                                    <MapPin size={10} /> Google Maps
                                                                </div>
                                                                <input value={eventData.location_url || ''} onChange={(e) => update('location_url', e.target.value)} placeholder="Pegar link..." className="bg-transparent border-none p-0 focus:ring-0 text-xs font-bold text-gray-800 placeholder:text-gray-300 w-full" />
                                                            </div>
                                                        </div>
                                                        <div className="relative group/waze">
                                                            <div className="absolute -inset-1 bg-cyan-500/10 rounded-2xl blur-md opacity-0 group-hover/waze:opacity-100 transition-opacity" />
                                                            <div className="relative p-3 rounded-2xl border-2 border-gray-50 bg-gray-50/50 flex flex-col gap-2 group-focus-within/waze:border-cyan-200 transition-all">
                                                                <div className="flex items-center gap-2 text-[10px] font-black text-cyan-600/60 uppercase">
                                                                    <Zap size={10} /> Waze App
                                                                </div>
                                                                <input value={eventData.location_waze_url || ''} onChange={(e) => update('location_waze_url', e.target.value)} placeholder="Pegar link..." className="bg-transparent border-none p-0 focus:ring-0 text-xs font-bold text-gray-800 placeholder:text-gray-300 w-full" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 gap-4 pt-4 border-t border-rose-50">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="flex flex-col gap-2">
                                                            <label className="text-[10px] font-bold text-[#a35d6a] uppercase tracking-widest px-1">Formato de Fecha</label>
                                                            <select value={eventData.date_format || 'long'} onChange={(e) => update('date_format', e.target.value)} className={inputCls + ' h-10'}>
                                                                <option value="long">Largo (Lunes 12 de Octubre)</option>
                                                                <option value="short">Corto (12/10/2026)</option>
                                                                <option value="abbrev">Abreviado (Lun 12 Oct)</option>
                                                            </select>
                                                        </div>
                                                        <div className="flex flex-col gap-2">
                                                            <label className="text-[10px] font-bold text-[#a35d6a] uppercase tracking-widest px-1">Formato de Hora</label>
                                                            <select value={eventData.time_format || '12h'} onChange={(e) => update('time_format', e.target.value)} className={inputCls + ' h-10'}>
                                                                <option value="12h">12 Horas (08:30 PM)</option>
                                                                <option value="24h">24 Horas (20:30)</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <label className="text-[10px] font-bold text-[#a35d6a] uppercase tracking-widest px-1">Zona Horaria</label>
                                                        <select value={eventData.timezone || 'America/Mexico_City'} onChange={(e) => update('timezone', e.target.value)} className={inputCls + ' h-10 font-bold uppercase'}>
                                                            <option value="America/Mexico_City">México (CDMX)</option>
                                                            <option value="America/Monterrey">Monterrey</option>
                                                            <option value="America/New_York">New York (EST)</option>
                                                            <option value="Europe/Madrid">Madrid (CET)</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* 4. Código de Vestimenta */}
                                <div className={`transition-all duration-500 ${openSections.dressCode ? 'my-6 mx-2 rounded-[2.5rem] border-2 bg-white shadow-2xl shadow-[#a35d6a]/10 overflow-hidden ring-4 ring-rose-50/50' : 'border-b'} `} style={{ borderColor: openSections.dressCode ? '#a35d6a20' : borderColor }}>
                                    <SectionHeader icon={<Shirt size={15} />} title="Código de vestimenta" open={openSections.dressCode} onToggle={() => toggleSection('dressCode')} />
                                    {openSections.dressCode && (
                                        <div className="px-6 pb-12 pt-2 flex flex-col gap-6 animate-fade-in text-left">
                                            <div className="space-y-4">
                                                <select value={eventData.dress_code || 'Formal'} onChange={(e) => update('dress_code', e.target.value)} className={inputCls}>
                                                    <option value="Etiqueta Rigurosa o White Tie">Etiqueta Rigurosa o White Tie</option>
                                                    <option value="Gala / Black Tie">Gala / Black Tie</option>
                                                    <option value="Formal">Formal</option>
                                                    <option value="Semiformal">Semiformal</option>
                                                    <option value="Casual">Casual</option>
                                                    <option value="Guayabera">Guayabera / Quinta</option>
                                                </select>

                                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-[10px] font-black text-[#7a5060] uppercase tracking-wider">Mostrar Íconos</span>
                                                        <span className="text-[9px] text-gray-400 font-bold uppercase">Diseño artístico</span>
                                                    </div>
                                                    <button onClick={() => update('dress_code_icons_enabled', !eventData.dress_code_icons_enabled)} className={`w-10 h-5 rounded-full p-1 transition-colors relative ${eventData.dress_code_icons_enabled ? 'bg-[#a35d6a]' : 'bg-gray-200'}`}>
                                                        <div className={`w-3 h-3 bg-white rounded-full transition-transform ${eventData.dress_code_icons_enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                                                    </button>
                                                </div>

                                                {eventData.dress_code_icons_enabled && (
                                                    <div className="space-y-4 animate-fade-in pb-8">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-3">
                                                                <label className="text-[10px] font-bold text-[#7a5060] uppercase tracking-widest px-1">Damas</label>
                                                                <div className="flex flex-col gap-2">
                                                                    <select value={eventData.dress_code_women || ''} onChange={(e) => update('dress_code_women', e.target.value)} className={inputCls + ' h-12 text-xs font-bold border-2'}>
                                                                        <option value="">Opcional</option>
                                                                        <option value="Vestido largo">Vestido largo</option>
                                                                        <option value="Vestido de coctel">Vestido de coctel</option>
                                                                        <option value="Vestido corto">Vestido corto</option>
                                                                    </select>
                                                                    {eventData.dress_code_women && (
                                                                        <div className="bg-white border rounded-2xl p-2 flex items-center justify-center h-16 shadow-sm">
                                                                            <DressIcon type={eventData.dress_code_women} gender="women" size={40} />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="space-y-3">
                                                                <label className="text-[10px] font-bold text-[#7a5060] uppercase tracking-widest px-1">Caballeros</label>
                                                                <div className="flex flex-col gap-2">
                                                                    <select value={eventData.dress_code_men || ''} onChange={(e) => update('dress_code_men', e.target.value)} className={inputCls + ' h-12 text-xs font-bold border-2'}>
                                                                        <option value="">Opcional</option>
                                                                        <option value="traje">Traje</option>
                                                                        <option value="smoking">Smoking</option>
                                                                        <option value="guayabera">Guayabera</option>
                                                                    </select>
                                                                    {eventData.dress_code_men && (
                                                                        <div className="bg-white border rounded-2xl p-2 flex items-center justify-center h-16 shadow-sm">
                                                                            <DressIcon type={eventData.dress_code_men} gender="men" size={40} />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* 5. Itinerario */}
                                <div className={`transition-all duration-500 ${openSections.itinerary ? 'my-6 mx-2 rounded-[2.5rem] border-2 bg-white shadow-2xl shadow-[#a35d6a]/10 overflow-hidden ring-4 ring-rose-50/50' : 'border-b'} `} style={{ borderColor: openSections.itinerary ? '#a35d6a20' : borderColor }}>
                                    <SectionHeader icon={<CalendarClock size={15} />} title="Itinerario" open={openSections.itinerary} onToggle={() => toggleSection('itinerary')} />
                                    {openSections.itinerary && (
                                        <div className="px-6 pb-6 pt-2 flex flex-col gap-6 animate-fade-in text-left">
                                            <div className="flex items-end gap-4 overflow-hidden">
                                                <div className="flex-1 flex flex-col gap-2 min-w-0">
                                                    <label className="text-[10px] font-bold text-[#a35d6a] uppercase tracking-widest px-1">Tipo de Ceremonia</label>
                                                    <select value={eventData.itinerary_ceremony_type || 'Misa'} onChange={(e) => update('itinerary_ceremony_type', e.target.value)} className={inputCls + ' h-12 text-[11px] font-medium'}>
                                                        <option value="Misa">Misa</option>
                                                        <option value="Civil">Civil</option>
                                                        <option value="Espiritual">Espiritual</option>
                                                    </select>
                                                </div>
                                                <div className="flex-1 flex flex-col gap-2 min-w-0">
                                                    <label className="text-[10px] font-bold text-[#a35d6a] uppercase tracking-widest px-1">Fecha General</label>
                                                    <input type="date" value={eventData.itinerary_date || eventData.event_date || ''} onChange={(e) => update('itinerary_date', e.target.value)} className={inputCls + ' h-12 font-medium'} />
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between px-1">
                                                    <label className="text-[10px] font-bold text-[#7a5060] uppercase tracking-widest">Eventos del Itinerario</label>
                                                    <button onClick={addItineraryItem} className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 text-[#a35d6a] rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-rose-100 transition-all shadow-sm">
                                                        <Plus size={12} /> Crear Evento
                                                    </button>
                                                </div>

                                                <div className="space-y-4">
                                                    {(eventData.itinerary_items || []).map((item: any, index: number) => {
                                                        const isExpanded = expandedItineraryItems.includes(index);
                                                        
                                                        return (
                                                            <div key={index} className="rounded-[2.5rem] bg-white border-2 border-rose-50 overflow-hidden shadow-xl shadow-rose-900/5 animate-scale-in transition-all">
                                                                {!isExpanded ? (
                                                                    // Vista Resumida (Ya agregado)
                                                                    <div className="p-5 flex items-center justify-between group bg-white/50">
                                                                        <div className="flex items-center gap-4">
                                                                            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#a35d6a] flex items-center justify-center border border-rose-100/50 shadow-sm shadow-rose-900/5">
                                                                                <ItineraryIcon id={item.icon} size={20} />
                                                                            </div>
                                                                            <div className="flex flex-col gap-0.5">
                                                                                <span className="text-[9px] font-bold text-[#a35d6a] uppercase tracking-widest">{item.time || '--:--'}</span>
                                                                                <h4 className="text-xs font-semibold text-gray-800 tracking-tight">{item.name}</h4>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <button 
                                                                                onClick={() => setExpandedItineraryItems(prev => [...prev, index])}
                                                                                className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-[#a35d6a] hover:bg-rose-50 transition-all shadow-sm"
                                                                            >
                                                                                <Palette size={14} />
                                                                            </button>
                                                                            <button 
                                                                                onClick={() => removeItineraryItem(index)}
                                                                                className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm"
                                                                            >
                                                                                <Trash2 size={14} />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    // Formulario de Edición
                                                                    <div className="p-6 space-y-5 relative">
                                                                        <div className="flex flex-col gap-4">
                                                                            <div className="flex flex-col gap-1.5">
                                                                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Nombre del Momento</label>
                                                                                <select 
                                                                                    value={item.name} 
                                                                                    onChange={(e) => updateItineraryItem(index, 'name', e.target.value)} 
                                                                                    className={inputCls + ' h-12 text-[11px] font-medium border-2 focus:border-[#a35d6a] bg-white'}
                                                                                >
                                                                                    <option value="Ceremonia">Ceremonia</option>
                                                                                    <option value="Recepción">Recepción</option>
                                                                                    <option value="Banquete">Banquete</option>
                                                                                    <option value="Cóctel de Bienvenida">Cóctel de Bienvenida</option>
                                                                                    <option value="Brindis">Brindis</option>
                                                                                    <option value="Primer Baile">Primer Baile</option>
                                                                                    <option value="Sesión de Fotos">Sesión de Fotos</option>
                                                                                    <option value="Apertura de Pista">Apertura de Pista</option>
                                                                                    <option value="Protocolo Familiar">Protocolo Familiar</option>
                                                                                    <option value="Pastel y Dulces">Pastel y Dulces</option>
                                                                                    <option value="Tornaboda">Tornaboda</option>
                                                                                    <option value="Civil">Boda Civil</option>
                                                                                    <option value="Otro">Otro</option>
                                                                                </select>
                                                                            </div>

                                                                            <div className="grid grid-cols-1 gap-4">
                                                                                <div className="flex flex-col gap-1.5">
                                                                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Hora del Evento</label>
                                                                                    <input type="time" value={item.time} onChange={(e) => updateItineraryItem(index, 'time', e.target.value)} className={inputCls + ' h-11 border-2 font-medium'} />
                                                                                </div>
                                                                                
                                                                                <div className="flex flex-col gap-1.5">
                                                                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Breve Descripción</label>
                                                                                    <textarea 
                                                                                        value={item.description || ''} 
                                                                                        onChange={(e) => updateItineraryItem(index, 'description', e.target.value)} 
                                                                                        placeholder="Ej: Salón principal, código de acceso o detalles especiales..."
                                                                                        rows={2}
                                                                                        className={inputCls + ' p-3 text-[11px] font-medium border-2 h-auto resize-none'}
                                                                                    />
                                                                                </div>
                                                                            </div>

                                                                            <div className="space-y-3">
                                                                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Seleccionar Ícono</label>
                                                                                <div className="grid grid-cols-6 gap-2">
                                                                                    {ITINERARY_ICONS_LIST.map(iconObj => (
                                                                                        <button 
                                                                                            key={iconObj.id} 
                                                                                            onClick={() => updateItineraryItem(index, 'icon', iconObj.id)}
                                                                                            title={iconObj.label}
                                                                                            className={`flex items-center justify-center p-2 rounded-xl border-2 transition-all ${item.icon === iconObj.id ? 'bg-[#a35d6a] text-white border-[#a35d6a] scale-105 shadow-md' : 'bg-gray-50 text-gray-400 border-transparent hover:border-rose-100'}`}
                                                                                        >
                                                                                            {iconObj.icon}
                                                                                        </button>
                                                                                    ))}
                                                                                </div>
                                                                            </div>

                                                                            <div className="pt-4 mt-2 border-t border-rose-50">
                                                                                <button 
                                                                                    onClick={() => {
                                                                                        setExpandedItineraryItems(prev => prev.filter(i => i !== index));
                                                                                        handleSave(false);
                                                                                        toast.success('Evento guardado correctamente');
                                                                                    }}
                                                                                    className="w-full py-4 bg-gradient-to-r from-[#a35d6a] to-[#7B2D8B] text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-rose-900/10 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                                                                                >
                                                                                     <CheckCircle2 size={14} /> Finalizar Edición
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}

                                                    {(!eventData.itinerary_items || eventData.itinerary_items.length === 0) && (
                                                        <div className="py-12 flex flex-col items-center justify-center text-center gap-3 border-2 border-dashed border-rose-100 rounded-[3rem] bg-rose-50/20">
                                                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#a35d6a] shadow-sm">
                                                                <Plus size={20} />
                                                            </div>
                                                            <p className="text-[10px] font-black text-[#a35d6a]/40 uppercase tracking-widest px-6">Comienza agregando momentos clave de tu evento</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* 6. Galería de Fotos */}
                                <div className={`transition-all duration-500 ${openSections.gallery ? 'my-6 mx-2 rounded-[2.5rem] border-2 bg-white shadow-2xl shadow-[#a35d6a]/10 overflow-hidden ring-4 ring-rose-50/50' : 'border-b'} `} style={{ borderColor: openSections.gallery ? '#a35d6a20' : borderColor }}>
                                    <SectionHeader icon={<ImageIcon size={15} />} title="Galería de fotos" open={openSections.gallery} onToggle={() => toggleSection('gallery')} />
                                    {openSections.gallery && (
                                        <div className="px-6 pb-6 pt-2 flex flex-col gap-6 animate-fade-in text-left">
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-4 gap-2">
                                                    {(eventData.gallery_urls || []).map((url, i) => (
                                                        <div key={i} className="aspect-square rounded-lg overflow-hidden relative group border">
                                                            <img src={url} className="w-full h-full object-cover" />
                                                            <button onClick={() => removeGalleryImage(url)} className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Trash2 size={12} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <label className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-all text-gray-400">
                                                        {galleryLoading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={16} />}
                                                        <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => e.target.files && handleGalleryUpload(e.target.files)} />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* 7. Mesa de Regalos */}
                                <div className={`transition-all duration-500 ${openSections.extra ? 'my-6 mx-2 rounded-[2.5rem] border-2 bg-white shadow-2xl shadow-[#a35d6a]/10 overflow-hidden ring-4 ring-rose-50/50' : 'border-b'} `} style={{ borderColor: openSections.extra ? '#a35d6a20' : borderColor }}>
                                    <SectionHeader icon={<Gift size={15} />} title="Mesa de regalos" open={openSections.extra} onToggle={() => toggleSection('extra')} />
                                    {openSections.extra && (
                                        <div className="px-6 pb-12 pt-2 flex flex-col gap-6 animate-fade-in text-left">
                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-[10px] font-black text-[#7a5060] uppercase tracking-wider">Activar Regalos</span>
                                                    <span className="text-[9px] text-gray-400 font-bold uppercase">Mesa o efectivo</span>
                                                </div>
                                                <button onClick={() => update('gift_registry_enabled', !eventData.gift_registry_enabled)} className={`w-10 h-5 rounded-full p-1 transition-colors relative ${eventData.gift_registry_enabled ? 'bg-[#a35d6a]' : 'bg-gray-200'}`}>
                                                    <div className={`w-3 h-3 bg-white rounded-full transition-transform ${eventData.gift_registry_enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                                                </button>
                                            </div>

                                            {eventData.gift_registry_enabled && (
                                                <div className="space-y-6 animate-fade-in">
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {[
                                                            { id: 'link', label: 'Link', icon: <ExternalLink size={12} /> },
                                                            { id: 'code', label: 'Código', icon: <Hash size={12} /> },
                                                            { id: 'envelope', label: 'Sobres', icon: <FileText size={12} /> }
                                                        ].map(type => (
                                                            <button
                                                                key={type.id}
                                                                onClick={() => update('gift_registry_type', type.id as any)}
                                                                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${eventData.gift_registry_type === type.id ? 'border-[#a35d6a] bg-rose-50 text-[#a35d6a]' : 'border-gray-50 bg-white text-gray-400 hover:border-rose-100'}`}
                                                            >
                                                                {type.icon}
                                                                <span className="text-[9px] font-bold uppercase">{type.label}</span>
                                                            </button>
                                                        ))}
                                                    </div>

                                                    {eventData.gift_registry_type === 'link' && (
                                                        <div className="flex flex-col gap-2">
                                                            <label className="text-[10px] font-bold text-[#a35d6a] uppercase tracking-widest px-1">Enlace de la Mesa</label>
                                                            <input value={eventData.gift_registry_url || ''} onChange={(e) => update('gift_registry_url', e.target.value)} placeholder="https://mexico.liverpool.com.mx/mesa-de-regalos/..." className={inputCls} />
                                                        </div>
                                                    )}

                                                    {eventData.gift_registry_type === 'code' && (
                                                        <div className="flex flex-col gap-2">
                                                            <label className="text-[10px] font-bold text-[#a35d6a] uppercase tracking-widest px-1">Número de Evento / Código</label>
                                                            <input value={eventData.gift_registry_code || ''} onChange={(e) => update('gift_registry_code', e.target.value)} placeholder="Ej: 50493821" className={inputCls} />
                                                        </div>
                                                    )}

                                                    {eventData.gift_registry_type === 'envelope' && (
                                                        <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 text-center">
                                                            <p className="text-[10px] text-[#a35d6a] font-bold uppercase tracking-tight">Se mostrará un mensaje para recepción de efectivo el día del evento.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                        )}

                        {/* ── GRUPO 2: DISEÑO ─────────────────────────────────────────── */}
                        {activeGroup === 'design' && (
                        <motion.div 
                            key="design"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex flex-col pb-32"
                        >
                            <div className="px-6 py-10 border-b bg-gradient-to-br from-purple-50/30 to-transparent flex flex-col justify-center min-h-[120px]" style={{ borderColor }}>
                                <h2 className="text-[14px] font-bold text-[#2d1b2d] uppercase tracking-[0.4em] flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#7B2D8B]" />
                                    Diseño
                                </h2>
                            </div>

                            {/* Temas con IA */}
                            <div className={`transition-all duration-500 ${openSections.theme ? 'my-6 mx-2 rounded-[2.5rem] border-2 bg-white shadow-2xl shadow-[#a35d6a]/10 overflow-hidden ring-4 ring-rose-50/50' : 'border-b'} `} style={{ borderColor: openSections.theme ? '#a35d6a20' : borderColor }}>
                                <SectionHeader icon={<Wand2 size={15} />} title="Temas con Inteligencia Artificial" open={openSections.theme} onToggle={() => toggleSection('theme')} />
                                {openSections.theme && (
                                    <div className="px-6 pb-8 pt-2 animate-fade-in">
                                        <div className="p-6 rounded-[2.5rem] bg-gradient-to-br from-rose-50 via-white to-rose-50 border-2 border-rose-100/50 space-y-6 shadow-xl relative overflow-hidden group transition-all">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-200/20 blur-[50px] rounded-full -mr-10 -mt-10 animate-pulse" />
                                            <div className="relative z-10 flex flex-col gap-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] font-black text-[#a35d6a] uppercase tracking-[0.2em]">Magia Visual</span>
                                                    <h3 className="text-sm font-black uppercase text-gray-800">Generador de Estilo Único</h3>
                                                </div>
                                                <div className="relative">
                                                    <textarea 
                                                        value={themePrompt}
                                                        onChange={(e) => setThemePrompt(e.target.value)}
                                                        placeholder="Describe tu atmósfera ideal: 'Boda elegante en la playa al atardecer con toques dorados y rosas pálidos...'"
                                                        className="w-full bg-white/80 border border-rose-100 rounded-2xl p-4 text-xs font-bold text-gray-800 placeholder:text-gray-300 focus:ring-2 focus:ring-[#a35d6a]/20 outline-none transition-all resize-none min-h-[100px]"
                                                    />
                                                </div>
                                                <button 
                                                    onClick={handleGenerateTheme}
                                                    disabled={isGeneratingTheme || !themePrompt.trim()}
                                                    className="w-full py-4 bg-gradient-to-r from-[#a35d6a] to-[#7B2D8B] rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:scale-100 shadow-xl shadow-[#a35d6a]/20"
                                                >
                                                    {isGeneratingTheme ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                                                    {isGeneratingTheme ? 'Creando Obra Maestra...' : 'Generar Tema Exclusivo'}
                                                </button>
                                            </div>

                                            {generatedTheme && (
                                                <div className="mt-4 p-4 rounded-3xl bg-white/5 border border-white/10 animate-fade-in flex flex-col gap-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[9px] font-bold text-[#a35d6a] uppercase tracking-widest">Vista Previa IA</span>
                                                        <div className="flex gap-1.5">
                                                            {[generatedTheme.primary, generatedTheme.secondary, generatedTheme.background].map((c, i) => (
                                                                <div key={i} className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: c }} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <button onClick={applyTheme} className="w-full py-2.5 bg-white text-[#a35d6a] rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-50 transition-colors">
                                                        Aplicar este diseño
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Temas Predeterminados */}
                            <div className={`transition-all duration-500 ${openSections.templates ? 'my-6 mx-2 rounded-[2.5rem] border-2 bg-white shadow-2xl shadow-[#a35d6a]/10 overflow-hidden ring-4 ring-rose-50/50' : 'border-b'} `} style={{ borderColor: openSections.templates ? '#a35d6a20' : borderColor }}>
                                <SectionHeader icon={<Target size={15} />} title="Temas ya creados" open={openSections.templates} onToggle={() => toggleSection('templates')} />
                                {openSections.templates && (
                                    <div className="px-6 pb-8 pt-2 animate-fade-in">
                                        <div className="grid grid-cols-4 gap-2">
                                            {PRESET_THEMES.map((theme, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => update('styles_json', theme)}
                                                    className={`group relative aspect-square rounded-xl overflow-hidden border-[3px] transition-all hover:scale-[1.05] active:scale-95 ${eventData.styles_json?.style === theme.style ? 'border-[#a35d6a] shadow-md shadow-[#a35d6a]/20' : 'border-gray-200'}`}
                                                >
                                                    <div className="absolute inset-0 bg-white" style={{ background: theme.background }} />
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-2 gap-1">
                                                        <span className="text-[8px] font-black uppercase tracking-tighter text-center leading-none opacity-40" style={{ color: theme.primary }}>{theme.style}</span>
                                                        <div className="flex gap-0.5 mt-1">
                                                            <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: theme.primary }} />
                                                            <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: theme.secondary }} />
                                                        </div>
                                                    </div>
                                                    {eventData.styles_json?.style === theme.style && (
                                                        <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#a35d6a] rounded-full flex items-center justify-center text-white shadow-lg">
                                                            <CheckCircle2 size={10} />
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Personalización Manual */}
                            <div className={`transition-all duration-500 ${openSections.design ? 'my-6 mx-2 rounded-[2.5rem] border-2 bg-white shadow-2xl shadow-[#a35d6a]/10 overflow-hidden ring-4 ring-rose-50/50' : 'border-b'} `} style={{ borderColor: openSections.design ? '#a35d6a20' : borderColor }}>
                                <SectionHeader icon={<Palette size={15} />} title="Diseño Personalizado" open={openSections.design} onToggle={() => toggleSection('design')} />
                                {openSections.design && (
                                    <div className="px-6 pb-12 pt-2 flex flex-col gap-8 animate-fade-in">
                                        {/* Tipografía */}
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-bold text-[#a35d6a] uppercase tracking-widest flex items-center gap-2">
                                                <Type size={12} /> Tipografías y Títulos
                                            </label>

                                            <div className="p-6 rounded-3xl bg-white border-2 border-rose-50 space-y-4 shadow-sm animate-fade-in">
                                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Previsualización de Título</span>
                                                <div className="py-4 border-y border-rose-50 flex items-center justify-center text-center">
                                                    <h2 className="text-2xl font-bold leading-tight uppercase transition-all duration-500" 
                                                        style={{ color: eventData.styles_json?.primary || '#a35d6a', fontFamily: `'${eventData.styles_json?.font || 'Playfair Display'}', serif` }}>
                                                        {eventData.title || 'Tu Título Aquí'}
                                                    </h2>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-3">
                                                <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100 space-y-3">
                                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Estilo Boda / XV Años (Cursivas)</span>
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                        {['Alex Brush', 'Parisienne', 'Great Vibes', 'Dancing Script', 'Pinyon Script', 'Rochester'].map(f => (
                                                            <button 
                                                                key={f} 
                                                                onClick={() => update('styles_json', { ...eventData.styles_json, font: f })}
                                                                className={`p-2 rounded-xl border-2 text-[10px] text-center transition-all ${eventData.styles_json?.font === f ? 'border-[#a35d6a] bg-white text-[#a35d6a]' : 'border-transparent bg-white/50 text-gray-600 hover:border-rose-100'}`}
                                                                style={{ fontFamily: `'${f}', cursive` }}
                                                            >
                                                                {f}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100 space-y-3">
                                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Moderno / Elegante (Serif)</span>
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                        {['Playfair Display', 'Cormorant Garamond', 'EB Garamond', 'Lora', 'Libre Baskerville', 'Inter', 'Montserrat'].map(f => (
                                                            <button 
                                                                key={f} 
                                                                onClick={() => update('styles_json', { ...eventData.styles_json, font: f })}
                                                                className={`p-2 rounded-xl border-2 text-[10px] text-center transition-all ${eventData.styles_json?.font === f ? 'border-[#a35d6a] bg-white text-[#a35d6a]' : 'border-transparent bg-white/50 text-gray-600 hover:border-rose-100'}`}
                                                                style={{ fontFamily: `'${f}', ${f === 'Montserrat' || f === 'Inter' ? 'sans-serif' : 'serif'}` }}
                                                            >
                                                                {f}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Colores */}
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-bold text-[#a35d6a] uppercase tracking-widest flex items-center gap-2">
                                                <Palette size={12} /> Paleta de Colores
                                            </label>
                                            <div className="p-6 rounded-[2.5rem] bg-gray-50/50 border border-gray-100 space-y-6">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <span className="text-[9px] font-black text-gray-400 uppercase ml-1">Color Principal</span>
                                                        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border shadow-sm">
                                                            <input type="color" value={eventData.styles_json?.primary || '#a35d6a'} onChange={(e) => update('styles_json', { ...eventData.styles_json, primary: e.target.value })} className="w-10 h-10 rounded-xl border-none cursor-pointer bg-transparent" />
                                                            <span className="text-[10px] font-mono font-bold uppercase">{eventData.styles_json?.primary || '#a35d6a'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <span className="text-[9px] font-black text-gray-400 uppercase ml-1">Fondo Invitación</span>
                                                        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border shadow-sm">
                                                            <input type="color" value={eventData.styles_json?.background || '#fdf8f0'} onChange={(e) => update('styles_json', { ...eventData.styles_json, background: e.target.value })} className="w-10 h-10 rounded-xl border-none cursor-pointer bg-transparent" />
                                                            <span className="text-[10px] font-mono font-bold uppercase">{eventData.styles_json?.background || '#fdf8f0'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                        )}

                        {/* ── GRUPO 3: SEGURIDAD ──────────────────────────────────────── */}
                        {activeGroup === 'security' && (
                        <motion.div 
                            key="security"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex flex-col pb-32"
                        >
                            <div className="px-6 py-10 border-b bg-gradient-to-br from-gray-50/50 to-transparent flex flex-col justify-center min-h-[120px]" style={{ borderColor }}>
                                <h2 className="text-[14px] font-bold text-[#2d1b2d] uppercase tracking-[0.4em] flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a]" />
                                    Seguridad
                                </h2>
                            </div>

                            <div className={`transition-all duration-500 ${openSections.security ? 'my-6 mx-2 rounded-[2.5rem] border-2 bg-white shadow-2xl shadow-[#a35d6a]/10 overflow-hidden ring-4 ring-rose-50/50' : 'border-b'} `} style={{ borderColor: openSections.security ? '#a35d6a20' : borderColor }}>
                                <SectionHeader icon={<Shield size={15} />} title="Código QR y Acceso" open={openSections.security} onToggle={() => toggleSection('security')} />
                                {openSections.security && (
                                    <div className="px-6 pb-6 pt-2 flex flex-col gap-6 animate-fade-in text-left">
                                        <div className="relative p-7 rounded-[2.5rem] bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 space-y-6 overflow-hidden shadow-xl group">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100/30 blur-[40px] rounded-full -mr-10 -mt-10" />
                                            
                                            <div className="flex items-center justify-between relative z-10">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${eventData.security_enabled ? 'bg-emerald-50 text-emerald-500 shadow-sm border border-emerald-100' : 'bg-gray-100 text-gray-400'}`}>
                                                        <Hash size={24} />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-800">Modo Recepción</span>
                                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">Control de acceso QR</span>
                                                    </div>
                                                </div>
                                                <button onClick={() => update('security_enabled', !eventData.security_enabled)} className={`w-14 h-7 rounded-full p-1.5 transition-all relative ${eventData.security_enabled ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                                                    <div className={`w-4 h-4 bg-white rounded-full shadow-lg transition-transform ${eventData.security_enabled ? 'translate-x-7' : 'translate-x-0'}`} />
                                                </button>
                                            </div>
                                            
                                            <div className="flex flex-col items-center gap-4 py-4 relative z-10">
                                                <div className={`w-40 h-40 rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center p-6 transition-all duration-700 ${eventData.security_enabled ? 'border-emerald-400/50 bg-emerald-50 shadow-inner' : 'border-gray-100 opacity-40'}`}>
                                                    <Hash size={48} className={eventData.security_enabled ? 'text-emerald-500' : 'text-gray-300'} />
                                                    <span className={`mt-4 text-[9px] font-black uppercase tracking-[0.3em] ${eventData.security_enabled ? 'text-emerald-500' : 'text-gray-400'}`}>QR Activo</span>
                                                </div>
                                                <p className="text-[10px] text-gray-400 leading-relaxed font-bold text-center px-4 uppercase tracking-tighter">
                                                    Activa esta opción para generar códigos únicos y validar invitados en tiempo real.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between px-1">
                                                <label className="text-[10px] font-bold text-[#7a5060] uppercase tracking-widest flex items-center gap-2">
                                                    <Lock size={12} className="text-[#a35d6a]" /> Pin de Acceso General
                                                </label>
                                                <button onClick={() => update('password_enabled', !eventData.password_enabled)} className={`w-10 h-5 rounded-full p-1 transition-colors relative ${eventData.password_enabled ? 'bg-[#a35d6a]' : 'bg-gray-200'}`}>
                                                    <div className={`w-3 h-3 bg-white rounded-full transition-transform ${eventData.password_enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                                                </button>
                                            </div>
                                            {eventData.password_enabled && (
                                                <div className="animate-fade-in">
                                                    <input 
                                                        value={eventData.access_password || ''} 
                                                        onChange={(e) => update('access_password', e.target.value)} 
                                                        placeholder="Establece un pin para ver la invitación..." 
                                                        className={inputCls} 
                                                    />
                                                    <p className="text-[8px] text-gray-400 font-bold uppercase mt-2 px-1">Los invitados deberán ingresar este pin para ver el contenido.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                        )}
                </AnimatePresence>

                    {/* Botones de acción (Inferior) */}
                    <div className="p-6 flex flex-col gap-3 mt-auto sticky bottom-0 bg-white/80 backdrop-blur-md border-t" style={{ borderColor }}>
                        <button onClick={() => handleSave()} disabled={isSaving || !hasChanges} className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all disabled:opacity-40 hover:bg-gray-50 shadow-sm" style={{ borderColor, color: '#7a5060' }}>
                            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Guardar Borrador
                        </button>
                        <button onClick={handlePublish} className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all hover:scale-[1.02] shadow-xl active:scale-95" style={{ background: isPublished ? '#ef4444' : 'linear-gradient(135deg, #a35d6a, #7B2D8B)' }}>
                            {isPublished ? <GlobeLock size={15} /> : <Globe size={15} />} {isPublished ? 'Despublicar' : 'Publicar'}
                        </button>
                        
                        {isPublished && (
                            <button 
                                onClick={() => {
                                    const baseUrl = window.location.origin.includes('localhost') 
                                        ? 'https://giovis-app-invitaciones.vercel.app' 
                                        : window.location.origin;
                                    const shareUrl = `${baseUrl}/invite/${eventData.slug}`;
                                    const message = `✨ ¡HOLA! ✨\n\nNos encantaría que nos acompañes en nuestro gran día. 💍\n\nTe compartimos tu invitación digital personalizada aquí:\n👉 ${shareUrl}\n\n¡Por favor, no olvides confirmar tu asistencia! 💖`;
                                    navigator.clipboard.writeText(message);
                                    toast.success('Mensaje copiado para WhatsApp');
                                }} 
                                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 transition-all hover:bg-emerald-100 active:scale-95 shadow-sm"
                            >
                                <MessageSquare size={14} /> Compartir por WhatsApp
                            </button>
                        )}
                    </div>
                </div>

                {/* ── RIGHT PANEL (Preview - Phone) ────────────────────────── */}
                <div className={`${mobileTab === 'preview' ? 'flex' : 'hidden'} md:flex flex-1 bg-[#fcfafc] flex-col items-center justify-start p-4 md:p-12 overflow-y-auto relative`}>
                    <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,#a35d6a08,transparent_50%)]" />

                    <div className="sticky top-8 w-full max-w-[320px] mx-auto pb-10 group">
                        {/* Shadow & Glow */}
                        <div className="absolute -inset-4 bg-gradient-to-b from-rose-100/50 to-purple-100/50 rounded-[4rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                        <div className="relative mx-auto w-full aspect-[9/19.5] bg-[#0f0f0f] rounded-[3.8rem] p-[10px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3),0_0_20px_rgba(163,93,106,0.1)] border-[1px] border-white/10 group-hover:scale-[1.02] transition-transform duration-700 ease-out animate-float">
                            {/* Inner Frame */}
                            <div className="absolute inset-[3px] rounded-[3.4rem] border-[1px] border-white/5 pointer-events-none z-50" />

                            {/* Camera / Notch */}
                            <div className="absolute top-[3px] left-1/2 -translate-x-1/2 w-28 h-7 bg-[#0f0f0f] rounded-b-[1.8rem] z-[60] flex items-center justify-center">
                                <div className="w-12 h-1 bg-white/5 rounded-full" />
                                <div className="absolute right-6 w-1.5 h-1.5 rounded-full bg-white/5" />
                            </div>

                            {/* Content */}
                            <div className="absolute inset-[4px] bg-white rounded-[3.2rem] overflow-hidden">
                                <div className="absolute inset-0 overflow-y-auto overflow-x-hidden no-scrollbar">
                                    {eventData && <Preview data={eventData} />}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col items-center animate-fade-in">
                            <div className="flex items-center gap-3 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-2xl border border-rose-100 shadow-sm">
                                <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                                <span className="text-[10px] font-bold text-[#a35d6a] uppercase tracking-widest whitespace-nowrap">Vista previa interactiva</span>
                            </div>
                             <button 
                                onClick={() => {
                                    const baseUrl = window.location.origin.includes('localhost') 
                                        ? 'https://giovis-app-invitaciones.vercel.app' 
                                        : window.location.origin;
                                    window.open(`${baseUrl}/invite/${eventData.slug}`, '_blank');
                                }}
                                className="mt-4 flex flex-col items-center gap-1 group/link cursor-pointer hover:bg-rose-50 px-4 py-2 rounded-xl transition-all"
                            >
                                <ExternalLink size={10} className="text-[#a35d6a] opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter group-hover/link:text-[#a35d6a] transition-colors flex items-center gap-1">
                                    Ver pantalla completa
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
}
