'use client';

import React from 'react';
import { useEditor } from '@/context/EditorContext';
import TextFormatBar from '@/components/editor/TextFormatBar';
import { 
  MessageSquare, 
  AlignLeft
} from 'lucide-react';

export default function Mensajes() {
  const { eventData, updateField } = useEditor();
  console.log('EDITOR CONTEXT:', { 
    message: eventData.message, 
    updateField: typeof updateField 
  });

  return (
    <div className="space-y-10">
      {/* ── MENSAJE PRINCIPAL ── */}
      <section className="space-y-4">
        <label className="text-[11px] font-black text-[#a35d6a]/60 uppercase tracking-[0.2em] flex items-center gap-2">
          <MessageSquare size={14} /> Mensaje de Bienvenida
        </label>
        <div className="bg-white border border-rose-100 rounded-3xl p-6 shadow-sm">
          <textarea
            value={eventData.message ?? ''}
            onChange={(e) => {
              updateField('message', e.target.value);
            }}
            placeholder="Escribe una frase inspiradora..."
            rows={4}
            className="w-full bg-transparent border-none focus:ring-0 text-lg font-medium text-[#2d1b2d] placeholder:text-rose-100 resize-none text-center"
          />
        </div>
        <TextFormatBar field="frase" />
        <p className="text-[10px] text-gray-400 font-medium text-center italic">
          Tip: Este mensaje suele aparecer justo después de los nombres.
        </p>
      </section>

      {/* ── MENSAJE SECUNDARIO ── */}
      <section className="space-y-4">
        <label className="text-[11px] font-black text-[#a35d6a]/60 uppercase tracking-[0.2em] flex items-center gap-2">
          <AlignLeft size={14} /> Texto Secundario
        </label>
        <div className="bg-white border border-rose-100 rounded-3xl p-5 shadow-sm">
          <textarea
            value={eventData.message_secondary || ''}
            onChange={(e) => updateField('message_secondary', e.target.value)}
            placeholder="Detalles adicionales o invitación formal..."
            rows={3}
            className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-[#7a5060] placeholder:text-rose-100 resize-none"
          />
        </div>
        <TextFormatBar field="mensaje_secundario" />
      </section>
    </div>
  );
}
