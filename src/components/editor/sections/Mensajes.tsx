'use client';

import React from 'react';
import { useEditor } from '@/context/EditorContext';
import { 
  Type, 
  MessageSquare, 
  Sparkles,
  AlignLeft
} from 'lucide-react';

const FONTS = [
  { id: 'playfair', name: 'Playfair Display', family: "'Playfair Display', serif" },
  { id: 'parisienne', name: 'Parisienne (Script)', family: "'Parisienne', cursive" },
  { id: 'montserrat', name: 'Montserrat', family: "'Montserrat', sans-serif" },
  { id: 'great-vibes', name: 'Great Vibes (Elegant)', family: "'Great Vibes', cursive" },
  { id: 'cormorant', name: 'Cormorant Garamond', family: "'Cormorant Garamond', serif" },
  { id: 'dancing-script', name: 'Dancing Script', family: "'Dancing Script', cursive" },
];

export default function Mensajes() {
  const { eventData, updateField } = useEditor();
  console.log('EDITOR CONTEXT:', { 
    message: eventData.message, 
    updateField: typeof updateField 
  });

  const currentFont = FONTS.find(f => f.id === (eventData.sections_styles?.messages?.font_id || 'playfair')) || FONTS[0];

  const updateFontStyle = (fontId: string) => {
    const currentStyles = eventData.sections_styles || {};
    const selectedFont = FONTS.find(f => f.id === fontId);
    
    updateField('sections_styles', {
      ...currentStyles,
      font_accent: selectedFont ? selectedFont.name : undefined,
      messages: {
        ...currentStyles.messages,
        font_id: fontId
      }
    });
  };

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
      </section>

      {/* ── SELECTOR DE TIPOGRAFÍA ── */}
      <section className="space-y-6">
        <label className="text-[11px] font-black text-[#a35d6a]/60 uppercase tracking-[0.2em] flex items-center gap-2">
          <Type size={14} /> Estilo de Fuente
        </label>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {FONTS.map((font) => (
            <button
              key={font.id}
              onClick={() => updateFontStyle(font.id)}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                currentFont.id === font.id
                  ? 'border-[#a35d6a] bg-rose-50 shadow-md'
                  : 'border-transparent bg-gray-50 hover:bg-white hover:border-rose-100'
              }`}
            >
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                {font.name}
              </span>
              <span 
                className={`text-xl ${currentFont.id === font.id ? 'text-[#a35d6a]' : 'text-gray-600'}`}
                style={{ fontFamily: font.family }}
              >
                Abc
              </span>
              {currentFont.id === font.id && (
                <Sparkles size={12} className="text-[#a35d6a] animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
