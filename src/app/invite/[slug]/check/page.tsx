'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase-browser';
import { CheckCircle, XCircle, Clock, Ticket, User, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

interface Guest {
  id: string;
  name: string;
  passes: number;
  passes_used: number;
  phone?: string;
  rsvp_status: 'pending' | 'confirmed' | 'declined';
  notes?: string;
}

export default function CheckPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const guestId = searchParams.get('inv');
  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!guestId) { setLoading(false); return; }
    supabase
      .from('guests')
      .select('*')
      .eq('id', guestId)
      .single()
      .then(({ data, error }) => {
        if (!error && data) setGuest(data as Guest);
        setLoading(false);
      });
  }, [guestId]);

  const handleCheckIn = async () => {
    if (!guest) return;
    setChecking(true);
    const { error } = await supabase
      .from('guests')
      .update({ 
        passes_used: guest.passes,
        rsvp_status: 'confirmed'
      })
      .eq('id', guest.id);
    if (!error) {
      setGuest({ ...guest, passes_used: guest.passes, rsvp_status: 'confirmed' });
      setChecked(true);
    }
    setChecking(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfafc]">
      <div className="animate-spin w-8 h-8 border-2 border-[#a35d6a] border-t-transparent rounded-full" />
    </div>
  );

  if (!guestId || !guest) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfafc] p-6">
      <div className="text-center">
        <XCircle size={48} className="text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-black text-[#2d1b2d]">Invitado no encontrado</h2>
        <p className="text-gray-400 text-sm mt-2">El código QR no es válido</p>
      </div>
    </div>
  );

  const isUsed = guest.passes_used >= guest.passes;

  return (
    <div className="min-h-screen bg-[#fdfafc] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Status Banner */}
        <div className={`rounded-3xl p-6 mb-4 text-center ${
          checked || isUsed
            ? 'bg-emerald-50 border border-emerald-200'
            : 'bg-white border border-rose-100'
        }`}>
          {checked || isUsed ? (
            <>
              <CheckCircle size={48} className="text-emerald-500 mx-auto mb-3" />
              <h2 className="text-xl font-black text-emerald-700">¡Bienvenido!</h2>
              <p className="text-emerald-600 text-sm mt-1">Check-in completado</p>
            </>
          ) : (
            <>
              <Clock size={48} className="text-[#a35d6a] mx-auto mb-3" />
              <h2 className="text-xl font-black text-[#2d1b2d]">Verificación de Acceso</h2>
              <p className="text-gray-400 text-sm mt-1">Confirma la entrada del invitado</p>
            </>
          )}
        </div>

        {/* Guest Info */}
        <div className="bg-white border border-rose-100 rounded-3xl p-6 space-y-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center">
              <User size={20} className="text-[#a35d6a]" />
            </div>
            <div>
              <p className="font-black text-[#2d1b2d] text-lg">{guest.name}</p>
              {guest.phone && (
                <p className="text-gray-400 text-xs flex items-center gap-1">
                  <Phone size={10} /> {guest.phone}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between bg-rose-50 rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <Ticket size={16} className="text-[#a35d6a]" />
              <span className="text-sm font-black text-[#2d1b2d]">Pases asignados</span>
            </div>
            <span className="text-2xl font-black text-[#a35d6a]">{guest.passes}</span>
          </div>

          {guest.notes && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3">
              <p className="text-xs font-bold text-amber-700">📝 {guest.notes}</p>
            </div>
          )}

          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-gray-400 uppercase tracking-widest">Estado</span>
            {guest.rsvp_status === 'confirmed' ? (
              <span className="flex items-center gap-1 text-emerald-600 font-black">
                <CheckCircle size={12} /> Confirmado
              </span>
            ) : guest.rsvp_status === 'declined' ? (
              <span className="flex items-center gap-1 text-red-500 font-black">
                <XCircle size={12} /> No asiste
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-500 font-black">
                <Clock size={12} /> Pendiente
              </span>
            )}
          </div>
        </div>

        {/* Check-in Button */}
        {!checked && !isUsed && (
          <button
            onClick={handleCheckIn}
            disabled={checking}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#a35d6a] to-[#7B2D8B] text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-rose-300/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60"
          >
            {checking ? 'Procesando...' : '✓ Confirmar Entrada'}
          </button>
        )}

        {(checked || isUsed) && (
          <div className="text-center text-xs text-gray-400 font-bold uppercase tracking-widest">
            Entrada registrada correctamente
          </div>
        )}
      </motion.div>
    </div>
  );
}
