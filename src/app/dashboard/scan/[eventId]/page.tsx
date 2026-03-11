'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import {
    ShieldCheck,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    XCircle,
    Users,
    Camera,
    Clock,
    AlertCircle,
    RotateCcw
} from 'lucide-react';
import { toast, Toaster } from 'sonner';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface GuestInfo {
    id: string;
    name: string;
    is_group: boolean;
    members_json: string[];
    rsvp: {
        status: string;
        is_checked_in: boolean;
        checked_in_at: string | null;
        confirmed_members_json: string[];
    } | null;
}

export default function ReceptionScanner() {
    const { eventId } = useParams() as { eventId: string };
    const router = useRouter();

    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [scanning, setScanning] = useState(true);
    const [scannedResult, setScannedResult] = useState<string | null>(null);
    const [guest, setGuest] = useState<GuestInfo | null>(null);
    const [checkInLoading, setCheckInLoading] = useState(false);

    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    // ─── AUTH & EVENT CHECK ───────────────────────────────────────────────────
    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { router.replace('/login'); return; }

            const { data: ev } = await supabase
                .from('events')
                .select('*')
                .eq('id', eventId)
                .eq('user_id', session.user.id)
                .single();

            if (!ev) { router.replace('/dashboard'); return; }
            setEvent(ev);
            setLoading(false);
        };
        init();
    }, [eventId, router]);

    // ─── SCANNER INITIALIZATION ────────────────────────────────────────────────
    useEffect(() => {
        if (!loading && scanning && !guest) {
            scannerRef.current = new Html5QrcodeScanner(
                "qr-reader",
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE]
                },
                /* verbose= */ false
            );

            scannerRef.current.render(onScanSuccess, onScanFailure);
        }

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(e => console.error(e));
                scannerRef.current = null;
            }
        };
    }, [loading, scanning, guest]);

    const onScanSuccess = async (decodedText: string) => {
        if (scannedResult === decodedText) return; // Prevent loop if logic hangs

        // Stop scanner to show guest info
        if (scannerRef.current) {
            scannerRef.current.clear().catch(e => console.error(e));
        }

        setScannedResult(decodedText);
        setScanning(false);
        fetchGuestData(decodedText);
    };

    const onScanFailure = (error: any) => {
        // quiet fail on every frame scan error
    };

    const fetchGuestData = async (token: string) => {
        const { data: g, error } = await supabase
            .from('guests')
            .select('*, rsvp(status, is_checked_in, checked_in_at, confirmed_members_json)')
            .eq('invitation_token', token)
            .eq('event_id', eventId)
            .single();

        if (error || !g) {
            toast.error('Código no válido para este evento.');
            setScanning(true);
            setScannedResult(null);
            return;
        }

        setGuest(g as GuestInfo);
    };

    const handleCheckIn = async () => {
        if (!guest) return;
        setCheckInLoading(true);

        const { error } = await supabase
            .from('rsvp')
            .update({
                is_checked_in: true,
                checked_in_at: new Date().toISOString()
            })
            .eq('guest_id', guest.id);

        if (!error) {
            toast.success('¡Check-in realizado con éxito!');
            setGuest(null);
            setScannedResult(null);
            setScanning(true);
        } else {
            toast.error('Error al realizar check-in.');
        }
        setCheckInLoading(false);
    };

    const resetScan = () => {
        setGuest(null);
        setScannedResult(null);
        setScanning(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fdf8f0] flex items-center justify-center p-6">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 size={40} className="animate-spin text-[#a35d6a]" />
                    <p className="text-sm font-bold text-[#a35d6a] animate-pulse">Iniciando recepción...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fdf8f0] pb-24">
            <Toaster position="top-center" />

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-40 border-b border-rose-100 px-6 py-4 flex items-center justify-between">
                <button onClick={() => router.back()} className="p-2 text-rose-300 hover:text-[#a35d6a] transition-colors rounded-full">
                    <ArrowLeft size={24} />
                </button>
                <div className="text-center">
                    <h1 className="text-sm font-black uppercase tracking-widest text-gray-400">Escáner de Recepción</h1>
                    <p className="text-xs font-bold truncate max-w-[180px]" style={{ color: '#a35d6a' }}>{event.title}</p>
                </div>
                <div className="w-10" /> {/* Spacer */}
            </header>

            <main className="pt-24 px-6 max-w-md mx-auto flex flex-col items-center gap-8">

                {scanning && !guest && (
                    <div className="w-full animate-fade-in group">
                        <div className="relative">
                            <div id="qr-reader" className="w-full overflow-hidden rounded-[40px] border-4 border-white shadow-2xl bg-black aspect-square"></div>
                            {/* Scanning Overlay Overlay */}
                            <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-[2px] bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.8)] animate-scan z-10" />
                        </div>
                        <div className="mt-8 text-center flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-[#a35d6a] mb-2">
                                <Camera size={24} />
                            </div>
                            <p className="font-black text-[#2d1b2d] uppercase tracking-widest text-xs">Escaneando Invitación</p>
                            <p className="text-[10px] text-gray-400 leading-relaxed px-10">Centra el código QR que se encuentra en el Pase Digital VIP del invitado.</p>
                        </div>
                    </div>
                )}

                {guest && (
                    <div className="w-full animate-scale-in">
                        <div className="bg-white rounded-[40px] shadow-2xl border border-rose-100 p-8 overflow-hidden relative">
                            {/* Status Icon */}
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Users size={120} />
                            </div>

                            <div className="relative z-10 flex flex-col items-center gap-6">
                                {guest.rsvp?.is_checked_in ? (
                                    <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-2">
                                        <AlertCircle size={48} />
                                    </div>
                                ) : (
                                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-2">
                                        <CheckCircle2 size={48} />
                                    </div>
                                )}

                                <div className="text-center">
                                    <h2 className="font-black text-2xl text-[#2d1b2d] mb-1">{guest.name}</h2>
                                    {guest.is_group ? (
                                        <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                                            {guest.rsvp?.confirmed_members_json?.length ? (
                                                guest.rsvp.confirmed_members_json.map(m => (
                                                    <span key={m} className="px-3 py-1 bg-green-50 text-[10px] font-bold text-green-700 rounded-full border border-green-100">
                                                        {m}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-xs text-rose-500 font-bold">Sin integrantes confirmados</span>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 justify-center mt-2">
                                            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-tighter rounded-full ${guest.rsvp?.status === 'confirmed' ? 'bg-green-100 text-green-600' : 'bg-rose-100 text-rose-600'}`}>
                                                {guest.rsvp?.status === 'confirmed' ? 'Confirmado' : 'Pendiente/Cancelado'}
                                            </span>
                                            {guest.rsvp?.companions && (
                                                <span className="text-[10px] font-bold text-gray-400">+{guest.rsvp.companions} acompañantes</span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {guest.rsvp?.is_checked_in && (
                                    <div className="bg-rose-50 text-rose-700 p-4 rounded-3xl w-full text-center border border-rose-100 flex flex-col gap-1 items-center">
                                        <span className="text-[10px] font-black uppercase tracking-widest">Ya ingresó</span>
                                        <div className="flex items-center gap-1.5 text-xs font-bold">
                                            <Clock size={12} />
                                            {new Date(guest.rsvp.checked_in_at!).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })} hrs
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col gap-3 w-full mt-4">
                                    {!guest.rsvp?.is_checked_in && (
                                        <button
                                            onClick={handleCheckIn}
                                            disabled={checkInLoading || guest.rsvp?.status !== 'confirmed'}
                                            className="w-full py-4 rounded-full text-white font-bold text-base shadow-xl flex items-center justify-center gap-2.5 transition-all active:scale-95 disabled:opacity-50"
                                            style={{ background: 'linear-gradient(135deg, #a35d6a, #7B2D8B)' }}
                                        >
                                            {checkInLoading ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                                            Registrar Entrada
                                        </button>
                                    )}
                                    <button
                                        onClick={resetScan}
                                        className="w-full py-4 rounded-full border-2 border-rose-100 text-[#a35d6a] font-bold text-sm bg-rose-50/30 hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
                                    >
                                        <RotateCcw size={16} /> Volver a Escanear
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Bottom Nav Stats */}
            <div className="fixed bottom-0 left-0 right-0 p-6 z-40">
                <div className="max-w-md mx-auto bg-[#2d1b2d] rounded-full py-3 px-8 shadow-2xl flex items-center justify-between text-white/90">
                    <div className="flex items-center gap-2">
                        <Users size={16} className="text-rose-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Control Acceso</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-white/50 leading-none">Status</span>
                            <span className="text-xs font-bold text-green-400">Activo</span>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes scan {
                    0% { top: 30%; opacity: 0; }
                    50% { opacity: 0.8; }
                    100% { top: 70%; opacity: 0; }
                }
                .animate-scan {
                    animation: scan 2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
                }
                .animate-fade-in {
                    animation: fadeIn 0.4s ease-out;
                }
                .animate-scale-in {
                    animation: scaleIn 0.3s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
}
