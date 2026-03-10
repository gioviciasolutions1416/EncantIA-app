'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { MapPin, Calendar, CheckCircle2, X, Loader2, Music, Volume2, VolumeX, Navigation, ExternalLink, Gift, Clock, Camera } from 'lucide-react';
import confetti from 'canvas-confetti';

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
    styles_json: Record<string, string>;
    slug: string;
    dress_code: string;
    gift_registry_url: string;
    music_url: string;
    gallery_urls: string[];
    location_url: string;
    location_waze_url: string;
}

interface TimeLeft { days: number; hours: number; minutes: number; seconds: number; }

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
function RSVPModal({ event, onClose }: { event: EventData; onClose: () => void }) {
    const [step, setStep] = useState<'form' | 'success'>('form');
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [attending, setAttending] = useState<'yes' | 'no' | null>(null);
    const [companions, setCompanions] = useState(0);
    const [dietary, setDietary] = useState('');
    const [msg, setMsg] = useState('');

    const theme = event.styles_json || {};
    const primaryColor = theme.primary || '#a35d6a';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!attending || !name.trim()) return;
        setLoading(true);

        const { data: guest } = await supabase
            .from('guests')
            .insert({ event_id: event.id, name: name.trim() })
            .select()
            .single();

        if (guest) {
            await supabase.from('rsvp').insert({
                guest_id: guest.id,
                status: attending === 'yes' ? 'confirmed' : 'declined',
                companions: attending === 'yes' ? companions : 0,
                dietary_restrictions: dietary,
                message: msg,
                responded_at: new Date().toISOString(),
            });

            if (attending === 'yes') {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: [primaryColor, theme.secondary || '#7B2D8B', '#fdf8f0']
                });

                // Generate WhatsApp message
                const phone = ''; // Anfitrión (podríamos pedirle su celular en el dashboard después)
                const text = encodeURIComponent(`¡Hola! Confirmo mi asistencia a la invitación "${event.title}". Seremos ${companions + 1} persona(s) en total. ¡Nos vemos pronto!`);
                setTimeout(() => {
                    // Preparamos el link pero no abrimos a menos que el usuario quiera
                }, 2000);
            }
        }

        setLoading(false);
        setStep('success');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.6)', padding: '0' }}>
            <div className="w-full max-w-md rounded-t-3xl bg-white p-6 pb-12 animate-slide-up shadow-2xl"
                style={{ maxHeight: '92vh', overflowY: 'auto' }}>
                <div className="w-12 h-1.5 rounded-full bg-gray-200 mx-auto mb-6" />

                {step === 'success' ? (
                    <div className="text-center py-10 scale-in">
                        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100" style={{ background: '#f0fdf4' }}>
                            <CheckCircle2 size={42} className="text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3" style={{ fontFamily: `'${theme.font || 'Playfair Display'}', serif` }}>
                            {attending === 'yes' ? '¡Confirmación exitosa!' : '¡Gracias por avisar!'}
                        </h3>
                        <p className="text-sm text-gray-500 mb-8 leading-relaxed max-w-[280px] mx-auto">
                            {attending === 'yes' ? 'Tus anfitriones están felices de que los acompañes. 🎉' : 'Tu mensaje ha sido enviado correctamente.'}
                        </p>

                        <div className="flex flex-col gap-3">
                            <button onClick={onClose} className="w-full py-4 rounded-full text-white font-bold text-sm shadow-md transition-transform active:scale-95" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${theme.secondary || '#7B2D8B'})` }}>Entendido</button>

                            {attending === 'yes' && (
                                <div className="space-y-3">
                                    <a
                                        href={`https://wa.me/?text=${encodeURIComponent(`¡Hola! Confirmo mi asistencia a "${event.title}". Seremos ${companions + 1} persona(s) en total. ✨`)}`}
                                        target="_blank"
                                        className="w-full py-4 rounded-full border-2 border-green-500 text-green-600 font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-50 transition-colors"
                                    >
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" className="w-5 h-5" />
                                        Notificar por WhatsApp
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-800" style={{ fontFamily: `'${theme.font || 'Playfair Display'}', serif` }}>Confirmar asistencia</h3>
                            <button onClick={onClose} className="p-2 -mr-2 text-gray-300 hover:text-gray-500 transition-colors"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Nombre completo *</label>
                                <input type="text" placeholder="¿A nombre de quién?" value={name} onChange={(e) => setName(e.target.value)} required
                                    className="w-full px-4 py-3.5 rounded-xl border-2 text-sm bg-gray-50/50 outline-none focus:bg-white transition-all"
                                    style={{ borderColor: '#f3f4f6' }} />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2.5 block">¿Podrás asistir? *</label>
                                <div className="flex gap-4">
                                    {[{ v: 'yes', label: 'Sí estaré ahí' }, { v: 'no', label: 'No podré' }].map(({ v, label }) => (
                                        <button key={v} type="button" onClick={() => setAttending(v as any)}
                                            className="flex-1 py-3.5 rounded-xl text-sm font-bold border-2 transition-all flex flex-col items-center gap-1"
                                            style={{
                                                borderColor: attending === v ? primaryColor : '#f3f4f6',
                                                background: attending === v ? `${primaryColor}08` : '#fff',
                                                color: attending === v ? primaryColor : '#9ca3af',
                                            }}>
                                            <span className="text-lg">{v === 'yes' ? '💍' : '✉️'}</span>
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {attending === 'yes' && (
                                <div className="animate-fade-in flex flex-col gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Acompañantes adicionales</label>
                                        <div className="flex items-center gap-4">
                                            <button type="button" onClick={() => setCompanions(Math.max(0, companions - 1))} className="w-10 h-10 rounded-full border flex items-center justify-center font-bold text-gray-500">—</button>
                                            <span className="text-lg font-bold w-4 text-center">{companions}</span>
                                            <button type="button" onClick={() => setCompanions(companions + 1)} className="w-10 h-10 rounded-full border flex items-center justify-center font-bold text-gray-500">+</button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Alergias o dieta especial</label>
                                        <input type="text" placeholder="Ej: Sin nueces, vegano..." value={dietary} onChange={(e) => setDietary(e.target.value)}
                                            className="w-full px-4 py-3.5 rounded-xl border-2 text-sm outline-none" style={{ borderColor: '#f3f4f6' }} />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Mensaje (opcional)</label>
                                <textarea placeholder="Un mensaje para los anfitriones..." value={msg} onChange={(e) => setMsg(e.target.value)} rows={2}
                                    className="w-full px-4 py-3.5 rounded-xl border-2 text-sm outline-none resize-none" style={{ borderColor: '#f3f4f6' }} />
                            </div>

                            <button type="submit" disabled={loading || !attending || !name.trim()}
                                className="w-full py-4 rounded-full text-white font-bold text-base shadow-xl transition-all disabled:opacity-40"
                                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${theme.secondary || '#7B2D8B'})` }}>
                                {loading ? <Loader2 size={24} className="animate-spin mx-auto" /> : 'Confirmar ahora'}
                            </button>
                        </form>
                    </>
                )}
            </div>
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
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const loadEvent = async () => {
            const { data } = await supabase.from('events').select('*').eq('slug', slug).single();
            if (data && data.is_published) {
                setEvent(data as EventData);
                // Increment views
                await supabase.from('events').update({ views: (data.views || 0) + 1 }).eq('id', data.id);
            }
            setLoading(false);
        };
        loadEvent();
    }, [slug]);

    const timeLeft = useCountdown(event?.event_date || '2099-01-01');

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

    const theme = event.styles_json || {};
    const primary = theme.primary || '#a35d6a';
    const accent = theme.accent || '#e8c49a';
    const bg = theme.background || '#fdf8f0';
    const headerFont = theme.font || 'Playfair Display';

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
            `}</style>

            <div className="min-h-screen w-full relative select-none" style={{ background: bg, fontFamily: "'DM Sans', sans-serif", color: theme.text || '#2d1b2d' }}>

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
                        <span className="text-xs font-bold tracking-[0.4em] uppercase mb-4 opacity-70 animate-fade-in">{event.event_type}</span>
                        <h1 className="text-[42px] leading-[1.1] font-bold mb-6 drop-shadow-2xl" style={{ fontFamily: `'${headerFont}', serif` }}>{event.title}</h1>

                        {event.event_date && (
                            <div className="flex flex-col items-center gap-2 mb-8">
                                <div className="h-[1px] w-12 bg-white/40" />
                                <p className="text-base font-medium tracking-wide uppercase opacity-90">{event.event_date.split('-').reverse().join(' · ')}</p>
                                <div className="h-[1px] w-12 bg-white/40" />
                            </div>
                        )}
                    </div>
                </div>

                {/* MAIN CONTENT CARD */}
                <div className="relative z-10 -mt-8 rounded-t-[40px] px-6 pt-12 pb-32" style={{ background: bg }}>

                    {/* COUNTDOWN */}
                    {event.event_date && (
                        <div className="mb-14">
                            <h3 className="text-center text-[11px] font-bold uppercase tracking-[0.3em] opacity-30 mb-6">Solo faltan</h3>
                            <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
                                {[
                                    { v: timeLeft.days, l: 'Días' }, { v: timeLeft.hours, l: 'Hrs' },
                                    { v: timeLeft.minutes, l: 'Min' }, { v: timeLeft.seconds, l: 'Seg' }
                                ].map((it, i) => (
                                    <div key={i} className="flex flex-col items-center p-3 rounded-2xl bg-white shadow-sm border border-black/5">
                                        <span className="text-[26px] font-bold tabular-nums leading-none mb-1" style={{ color: primary }}>{String(it.v).padStart(2, '0')}</span>
                                        <span className="text-[9px] font-bold uppercase opacity-30 tracking-wider">{it.l}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* VENUE & MAPS */}
                    <div className="flex flex-col gap-4 max-w-sm mx-auto mb-14">
                        <div className="p-6 rounded-3xl text-center flex flex-col items-center shadow-sm border border-black/5" style={{ background: '#fff' }}>
                            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: `${primary}08`, color: primary }}>
                                <MapPin size={24} />
                            </div>
                            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-40 mb-2">Dónde y Cuándo</h4>
                            <p className="text-lg font-bold mb-1 leading-tight">{event.venue}</p>
                            {event.event_time && <p className="text-sm font-medium opacity-60 mb-6">A las {event.event_time.slice(0, 5)} hrs</p>}

                            <div className="flex flex-col w-full gap-2.5">
                                {event.location_url && (
                                    <a href={event.location_url} target="_blank" className="flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 font-bold text-xs transition-all hover:bg-gray-50" style={{ borderColor: '#f3f4f6' }}>
                                        <Navigation size={14} /> Abrir en Google Maps
                                    </a>
                                )}
                                {event.location_waze_url && (
                                    <a href={event.location_waze_url} target="_blank" className="flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 font-bold text-xs transition-all hover:bg-gray-50" style={{ borderColor: '#f3f4f6' }}>
                                        <ExternalLink size={14} /> Abrir en Waze
                                    </a>
                                )}
                                <button onClick={addToCalendar} className="flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 font-bold text-xs bg-gray-900 border-gray-900 text-white shadow-lg transition-transform active:scale-95">
                                    <Calendar size={14} /> Agendar en mi Calendario
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* DRESS CODE */}
                    {event.dress_code && (
                        <div className="text-center mb-14 px-4 flex flex-col items-center">
                            <div className="w-8 h-[1px] mb-4" style={{ background: accent }} />
                            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-40 mb-3">Código de Vestimenta</h4>
                            <p className="text-xl font-bold" style={{ color: primary }}>{event.dress_code}</p>
                        </div>
                    )}

                    {/* MESSAGE */}
                    {event.message && (
                        <div className="relative text-center mb-20 px-8 py-10 rounded-[40px] overflow-hidden border-2 border-dashed" style={{ borderColor: `${accent}44` }}>
                            <div className="text-3xl font-serif text-rose-200 absolute top-4 left-4 opacity-50">“</div>
                            <p className="text-lg leading-relaxed italic opacity-80" style={{ fontFamily: `'${headerFont}', serif` }}>{event.message}</p>
                            <div className="text-3xl font-serif text-rose-200 absolute bottom-4 right-4 opacity-50 rotate-180">“</div>
                        </div>
                    )}

                    {/* GALLERY */}
                    {event.gallery_urls?.length > 0 && (
                        <div className="mb-14">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="h-[1px] flex-1 bg-black/10"></span>
                                <div className="flex flex-col items-center">
                                    <Camera size={20} className="mb-1 opacity-20" />
                                    <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-40">Galería de Fotos</h4>
                                </div>
                                <span className="h-[1px] flex-1 bg-black/10"></span>
                            </div>
                            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 px-2 no-scrollbar">
                                {event.gallery_urls.map((url, i) => (
                                    <div key={i} className="min-w-[85%] aspect-[10/12] rounded-3xl overflow-hidden snap-center shadow-xl">
                                        <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-center text-[10px] text-gray-300 mt-2 font-medium">Desliza para ver más</p>
                        </div>
                    )}

                    {/* REGISTRY */}
                    {event.gift_registry_url && (
                        <div className="text-center mb-20 px-4">
                            <Gift size={28} className="mx-auto mb-4 opacity-20" />
                            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-40 mb-3">Mesa de Regalos</h4>
                            <p className="text-xs text-gray-500 mb-6 leading-relaxed">Tu presencia es nuestro mejor regalo, pero si deseas obsequiarnos algo:</p>
                            <a href={event.gift_registry_url} target="_blank" className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 font-bold text-sm transition-all" style={{ borderColor: primary, color: primary }}>
                                Ver mesa de regalos <ExternalLink size={14} />
                            </a>
                        </div>
                    )}

                    {/* BRADING */}
                    <div className="flex flex-col items-center justify-center opacity-30 mt-20 mb-10 pb-10">
                        <img src="/logo.png" alt="EncantIA" className="h-10 w-auto filter grayscale grayscale-100 mb-2" />
                        <p className="text-[9px] font-bold uppercase tracking-widest">Creado con EncantIA</p>
                    </div>
                </div>

                {/* FLOATING ACTION BAR */}
                <div className="fixed bottom-0 left-0 right-0 z-50 p-6 flex justify-center translate-y-0"
                    style={{ background: 'linear-gradient(to top, rgba(255,255,255,0.95) 70%, transparent)' }}>
                    <button onClick={() => setShowRSVP(true)}
                        className="w-full max-w-sm py-4.5 rounded-full text-white font-bold text-base shadow-2xl flex items-center justify-center gap-2.5 transition-all active:scale-90"
                        style={{ background: `linear-gradient(135deg, ${primary}, ${theme.secondary || '#7B2D8B'})` }}>
                        <CheckCircle2 size={20} /> Confirmar Asistencia
                    </button>
                </div>

                {/* RSVP MODAL */}
                {showRSVP && <RSVPModal event={event} onClose={() => setShowRSVP(false)} />}
            </div>
        </>
    );
}
