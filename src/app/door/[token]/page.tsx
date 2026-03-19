'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase-browser';
import { CheckCircle, Clock, XCircle, Search, QrCode, X, Users, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Guest {
  id: string;
  name: string;
  passes: number;
  passes_used: number;
  phone?: string;
  status: 'pending' | 'confirmed' | 'declined';
  notes?: string;
}

interface EventData {
  id: string;
  title: string;
  event_date: string;
  venue: string;
  cover_image_url?: string;
}

export default function DoorPage() {
  const { token } = useParams();
  const [event, setEvent] = useState<EventData | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkingIn, setCheckingIn] = useState<string | null>(null);
  const [lastCheckedIn, setLastCheckedIn] = useState<Guest | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed'>('all');
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<any>(null);

  const loadData = useCallback(async () => {
    try {
      const res = await fetch(`/api/door?token=${token}`);
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Acceso inválido'); setLoading(false); return; }
      setEvent(data.event);
      // Cargar invitados
      const { data: guestsData } = await supabase
        .from('guests')
        .select('*')
        .eq('event_id', data.event.id)
        .order('name');
      if (guestsData) setGuests(guestsData as Guest[]);
    } catch {
      setError('Error al cargar');
    }
    setLoading(false);
  }, [token]);

  useEffect(() => { loadData(); }, [loadData]);

  // Polling cada 10 segundos para tiempo real
  useEffect(() => {
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleCheckIn = async (guest: Guest) => {
    setCheckingIn(guest.id);
    const { error } = await supabase
      .from('guests')
      .update({ status: 'confirmed', rsvp_status: 'confirmed', passes_used: guest.passes, checked_in: true, checked_in_at: new Date().toISOString() })
      .eq('id', guest.id);
    if (!error) {
      setLastCheckedIn(guest);
      setGuests(prev => prev.map(g => g.id === guest.id ? { ...g, status: 'confirmed', passes_used: guest.passes } : g));
      setTimeout(() => setLastCheckedIn(null), 3000);
    }
    setCheckingIn(null);
  };

  const startScanner = async () => {
    setShowScanner(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      // Importar jsQR para escanear
      // @ts-ignore
      const jsQR = (await import('jsqr')).default;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      scannerRef.current = setInterval(() => {
        if (!videoRef.current || !ctx) return;
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code?.data) {
          try {
            const url = new URL(code.data);
            const guestId = url.searchParams.get('inv');
            if (guestId) {
              const guest = guests.find(g => g.id === guestId);
              if (guest) {
                stopScanner();
                handleCheckIn(guest);
              }
            }
          } catch(e) {}
        }
      }, 500);
    } catch {
      setShowScanner(false);
    }
  };

  const stopScanner = () => {
    clearInterval(scannerRef.current);
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    }
    setShowScanner(false);
  };

  const filteredGuests = guests.filter(g => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || g.status === filter;
    return matchSearch && matchFilter;
  });

  const confirmedCount = guests.filter(g => g.status === 'confirmed').length;
  const pendingCount = guests.filter(g => g.status === 'pending').length;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
      <Loader2 className="animate-spin text-white" size={36} />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] p-6">
      <div className="text-center">
        <XCircle size={48} className="text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-black text-white mb-2">Acceso Denegado</h2>
        <p className="text-gray-400 text-sm">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">

      {/* Header */}
      <div className="relative">
        {event?.cover_image_url && (
          <img src={event.cover_image_url} className="w-full h-36 object-cover opacity-40" alt="" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0f0f0f]" />
        <div className="relative p-5">
          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Control de Acceso</p>
          <h1 className="text-xl font-black text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{event?.title}</h1>
          <p className="text-white/40 text-xs mt-0.5">{event?.venue}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 grid grid-cols-3 gap-2 mb-4">
        <div className="bg-white/5 rounded-2xl p-3 text-center">
          <p className="text-2xl font-black text-white">{guests.length}</p>
          <p className="text-[9px] text-white/40 uppercase tracking-widest font-bold">Total</p>
        </div>
        <div className="bg-emerald-500/20 rounded-2xl p-3 text-center border border-emerald-500/20">
          <p className="text-2xl font-black text-emerald-400">{confirmedCount}</p>
          <p className="text-[9px] text-emerald-400/60 uppercase tracking-widest font-bold">Ingresaron</p>
        </div>
        <div className="bg-amber-500/20 rounded-2xl p-3 text-center border border-amber-500/20">
          <p className="text-2xl font-black text-amber-400">{pendingCount}</p>
          <p className="text-[9px] text-amber-400/60 uppercase tracking-widest font-bold">Pendientes</p>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="px-4 mb-4">
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${guests.length > 0 ? (confirmedCount / guests.length) * 100 : 0}%` }}
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
          />
        </div>
        <p className="text-[10px] text-white/30 mt-1 text-right font-bold">{guests.length > 0 ? Math.round((confirmedCount / guests.length) * 100) : 0}% ingresado</p>
      </div>

      {/* Botón escáner */}
      <div className="px-4 mb-4">
        <button
          onClick={startScanner}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#a35d6a] to-[#7B2D8B] text-white font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30"
        >
          <QrCode size={20} /> Escanear QR
        </button>
      </div>

      {/* Filtros */}
      <div className="px-4 mb-3 flex gap-2">
        {(['all', 'pending', 'confirmed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-white text-[#0f0f0f]' : 'bg-white/10 text-white/40'}`}
          >
            {f === 'all' ? 'Todos' : f === 'pending' ? 'Pendientes' : 'Ingresaron'}
          </button>
        ))}
      </div>

      {/* Búsqueda */}
      <div className="px-4 mb-4">
        <div className="bg-white/10 rounded-2xl flex items-center gap-2 px-3 py-2.5">
          <Search size={14} className="text-white/30 shrink-0" />
          <input
            type="text"
            placeholder="Buscar invitado..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-xs font-bold text-white outline-none placeholder:text-white/20"
          />
        </div>
      </div>

      {/* Lista */}
      <div className="px-4 pb-10 space-y-2">
        {filteredGuests.map(guest => (
          <motion.div
            key={guest.id}
            layout
            className={`rounded-2xl p-4 flex items-center gap-3 border transition-all ${
              guest.status === 'confirmed'
                ? 'bg-emerald-500/10 border-emerald-500/20'
                : 'bg-white/5 border-white/5'
            }`}
          >
            {/* Avatar */}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
              guest.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/60'
            }`}>
              {guest.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <p className={`font-black truncate ${guest.status === 'confirmed' ? 'text-emerald-400' : 'text-white'}`}>
                {guest.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-white/30 font-bold">{guest.passes} pases</span>
                {guest.notes && <span className="text-[10px] text-white/20 truncate">{guest.notes}</span>}
              </div>
            </div>

            {guest.status === 'confirmed' ? (
              <div className="flex items-center gap-1 text-emerald-400">
                <CheckCircle size={20} />
              </div>
            ) : (
              <button
                onClick={() => handleCheckIn(guest)}
                disabled={checkingIn === guest.id}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-emerald-500/20 text-white hover:text-emerald-400 text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-40"
              >
                {checkingIn === guest.id ? '...' : 'Entrada'}
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Escáner modal */}
      <AnimatePresence>
        {showScanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-black flex flex-col"
          >
            <div className="flex items-center justify-between p-4">
              <p className="font-black text-white uppercase tracking-widest text-sm">Escanear QR</p>
              <button onClick={stopScanner} className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 relative">
              <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
              {/* Overlay con cuadro de escaneo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-56 h-56 border-2 border-white/60 rounded-2xl relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl" />
                </div>
              </div>
              <p className="absolute bottom-8 left-0 right-0 text-center text-white/60 text-xs font-bold">Apunta al código QR del invitado</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast de check-in exitoso */}
      <AnimatePresence>
        {lastCheckedIn && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-4 right-4 z-50 bg-emerald-500 rounded-2xl p-4 flex items-center gap-3 shadow-2xl"
          >
            <CheckCircle size={24} className="text-white shrink-0" />
            <div>
              <p className="font-black text-white">{lastCheckedIn.name}</p>
              <p className="text-emerald-100 text-xs font-bold">{lastCheckedIn.passes} pases — Entrada confirmada ✅</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
