'use client';

import React from 'react';
import { useEditor } from '@/context/EditorContext';
import { 
  Shirt, 
  Sticker, 
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DRESS_CODE_OPTIONS = [
  'Formal',
  'Gala',
  'Semiformal',
  'Cocktail',
  'Guayabera',
  'Formal Playero',
  'Casual'
];

export default function Vestimenta() {
  const { eventData, updateField } = useEditor();

  return (
    <div className="space-y-10">
      {/* ── CÓDIGO GENERAL ── */}
      <section className="space-y-4">
        <label className="text-[11px] font-black text-[#a35d6a]/60 uppercase tracking-[0.2em] flex items-center gap-2">
          <Shirt size={14} /> Código de Vestimenta
        </label>
        <div className="flex flex-wrap gap-2">
          {DRESS_CODE_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => updateField('dress_code', option)}
              className={`px-5 py-3 rounded-2xl text-[11px] font-bold transition-all border ${
                eventData.dress_code === option
                  ? 'bg-[#a35d6a] text-white border-[#a35d6a] shadow-lg shadow-rose-200'
                  : 'bg-white text-[#7a5060]/70 border-rose-100 hover:border-rose-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </section>

      {/* ── DETALLE POR GÉNERO ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Damas */}
        <section className="space-y-4">
          <label className="text-[11px] font-black text-[#a35d6a]/60 uppercase tracking-[0.2em]">
            Sugerencia Damas
          </label>
          <div className="bg-white border border-rose-100 p-4 rounded-3xl shadow-sm focus-within:border-[#a35d6a] transition-colors">
            <input
              type="text"
              value={eventData.dress_code_women || ''}
              onChange={(e) => updateField('dress_code_women', e.target.value)}
              placeholder="Ej: Vestido largo o midi..."
              className="w-full bg-transparent border-none focus:ring-0 text-xs font-bold text-[#2d1b2d] p-0"
            />
          </div>
        </section>

        {/* Caballeros */}
        <section className="space-y-4">
          <label className="text-[11px] font-black text-[#a35d6a]/60 uppercase tracking-[0.2em]">
            Sugerencia Caballeros
          </label>
          <div className="bg-white border border-rose-100 p-4 rounded-3xl shadow-sm focus-within:border-[#a35d6a] transition-colors">
            <input
              type="text"
              value={eventData.dress_code_men || ''}
              onChange={(e) => updateField('dress_code_men', e.target.value)}
              placeholder="Ej: Traje oscuro o smoking..."
              className="w-full bg-transparent border-none focus:ring-0 text-xs font-bold text-[#2d1b2d] p-0"
            />
          </div>
        </section>
      </div>

      {/* ── NOTA ADICIONAL ── */}
      <section className="space-y-4">
        <label className="text-[11px] font-black text-[#a35d6a]/60 uppercase tracking-[0.2em] flex items-center gap-2">
          <Info size={14} /> Detalles o Notas
        </label>
        <div className="bg-rose-50/30 border border-rose-100 p-5 rounded-3xl">
          <textarea
            value={eventData.dress_code_detail || ''}
            onChange={(e) => updateField('dress_code_detail', e.target.value)}
            placeholder="Ej: Favor de no usar color blanco, solo adultos..."
            rows={3}
            className="w-full bg-transparent border-none focus:ring-0 text-xs font-bold text-[#7a5060] placeholder:text-rose-200 resize-none"
          />
        </div>
      </section>

      {/* ── CONFIGURACIÓN VISUAL (ICONOS) ── */}
      <section className="bg-gradient-to-br from-white to-rose-50/30 border border-rose-100 p-6 rounded-[2.5rem] shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-black text-[#a35d6a] uppercase tracking-widest flex items-center gap-2">
              <Sticker size={16} /> Mostrar Iconos Visuales
            </label>
            <p className="text-[10px] text-gray-400 font-medium max-w-[280px]">
              Añade iconos elegantes de vestido y traje junto al texto del Dress Code.
            </p>
          </div>
          
          <button
            onClick={() => updateField('dress_code_icons_enabled', !eventData.dress_code_icons_enabled)}
            className={`w-14 h-7 rounded-full transition-all relative ${
              eventData.dress_code_icons_enabled ? 'bg-[#a35d6a] shadow-inner' : 'bg-gray-200'
            }`}
          >
            <motion.div 
              animate={{ x: eventData.dress_code_icons_enabled ? 30 : 2 }}
              className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center"
            >
              {eventData.dress_code_icons_enabled && <div className="w-1 h-1 bg-[#a35d6a] rounded-full" />}
            </motion.div>
          </button>
        </div>

        {/* Preview Simple de los Iconos */}
        <AnimatePresence>
          {eventData.dress_code_icons_enabled && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-rose-100/50 flex justify-center gap-12"
            >
              <div className="flex flex-col items-center gap-2 opacity-40">
                <div className="w-12 h-12 bg-white rounded-2xl border border-rose-100 flex items-center justify-center">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2L15 8L21 9L17 14L18 21L12 18L6 21L7 14L3 9L9 8L12 2Z" />
                   </svg>
                </div>
                <span className="text-[9px] font-black uppercase tracking-tighter">Estilo Damas</span>
              </div>
              <div className="flex flex-col items-center gap-2 opacity-40">
                <div className="w-12 h-12 bg-white rounded-2xl border border-rose-100 flex items-center justify-center">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="6" y="3" width="12" height="18" rx="2" />
                      <path d="M12 3V21" />
                   </svg>
                </div>
                <span className="text-[9px] font-black uppercase tracking-tighter">Estilo Varones</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
