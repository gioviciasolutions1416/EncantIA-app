'use client';

import React from 'react';
import { useEditor } from '@/context/EditorContext';
import TextFormatBar from '@/components/editor/TextFormatBar';
import { 
  PenTool, 
  MessageCircleHeart,
  BookHeart,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Firmas() {
  const { eventData, updateField } = useEditor();
  
  const isEnabled = eventData.signatures?.enabled ?? false;

  const toggleSignatures = () => {
    updateField('signatures', {
      ...eventData.signatures,
      enabled: !isEnabled
    });
  };

  const updateConfig = (field: string, value: any) => {
    updateField('signatures', {
      ...eventData.signatures,
      [field]: value
    });
  };

  return (
    <div className="space-y-10">
      {/* ── TOGGLE SECCIÓN ── */}
      <section className="bg-gradient-to-br from-white to-rose-50/30 border border-rose-100 p-6 rounded-[2.5rem] shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-black text-[#a35d6a] uppercase tracking-widest flex items-center gap-2">
              <PenTool size={16} /> Libro de Firmas
            </label>
            <p className="text-[10px] text-gray-400 font-medium max-w-[280px]">
              Permite que tus invitados te dejen mensajes de cariño y felicitaciones en tu web.
            </p>
          </div>
          
          <button
            onClick={toggleSignatures}
            className={`w-14 h-7 rounded-full transition-all relative ${
              isEnabled ? 'bg-[#a35d6a] shadow-inner' : 'bg-gray-200'
            }`}
          >
            <motion.div 
              animate={{ x: isEnabled ? 30 : 2 }}
              className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center"
            >
              {isEnabled && <div className="w-1 h-1 bg-[#a35d6a] rounded-full" />}
            </motion.div>
          </button>
        </div>
      </section>

      <AnimatePresence>
        {isEnabled && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-8"
          >
            {/* ── TITULO DEL LIBRO ── */}
            <section className="space-y-4">
              <label className="text-[11px] font-black text-[#a35d6a]/60 uppercase tracking-[0.2em] flex items-center gap-2">
                <BookHeart size={14} /> Título de la Sección
              </label>
              <div className="bg-white border border-rose-100 p-3 rounded-2xl shadow-sm">
                <input
                  type="text"
                  value={eventData.signatures?.title || 'Libro de Firmas'}
                  onChange={(e) => updateConfig('title', e.target.value)}
                  placeholder="Ej: Mensajes de nuestros seres queridos"
                  className="w-full bg-transparent border-none focus:ring-0 text-xs font-bold text-[#7a5060] placeholder:text-rose-200 outline-none"
                />
              </div>
              <TextFormatBar field="firmas_titulo" />
            </section>

            {/* ── MENSAJE INVITACIÓN ── */}
            <section className="space-y-4">
              <label className="text-[11px] font-black text-[#a35d6a]/60 uppercase tracking-[0.2em] flex items-center gap-2">
                <MessageCircleHeart size={14} /> Mensaje de Invitación
              </label>
              <div className="bg-white border border-rose-100 p-5 rounded-[2rem] shadow-sm">
                <textarea
                  value={eventData.signatures?.message || 'Déjanos un hermoso recuerdo de este momento tan especial.'}
                  onChange={(e) => updateConfig('message', e.target.value)}
                  placeholder="Ej: Sus buenos deseos nos llenan de alegría..."
                  rows={3}
                  className="w-full bg-transparent border-none focus:ring-0 text-xs font-bold text-[#7a5060] placeholder:text-rose-200 resize-none"
                />
              </div>
              <TextFormatBar field="firmas_mensaje" />
            </section>

            {/* ── NOTA INFO ── */}
            <div className="bg-rose-50/50 p-4 rounded-2xl flex items-start gap-3 border border-rose-100/50">
              <Info className="text-[#a35d6a]/40 mt-0.5" size={18} />
              <div className="space-y-1">
                <h5 className="text-[10px] font-black uppercase text-[#a35d6a] tracking-widest">¿Cómo funciona?</h5>
                <p className="text-[10px] text-[#7a5060] font-medium leading-relaxed">
                  Los mensajes que escriban tus invitados aparecerán dinámicamente en tu invitación de manera pública. ¡Te notificaremos cuando recibas uno nuevo!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
