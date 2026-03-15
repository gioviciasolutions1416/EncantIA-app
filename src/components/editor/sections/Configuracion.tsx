'use client';

import React from 'react';
import { useEditor } from '@/context/EditorContext';
import { 
  Globe, 
  UserCheck, 
  Link as LinkIcon, 
  PartyPopper,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EVENT_TYPES = [
  'Boda', 
  'XV Años', 
  'Baby Shower', 
  'Bautizo', 
  'Graduación'
];

const TEMPLATES_BY_TYPE: Record<string, { id: string, name: string, previewColor: string }[]> = {
  'Boda': [
    { id: 'boda_1', name: 'Minimal Floral', previewColor: '#F5E6E8' },
    { id: 'boda_2', name: 'Elegant Gold', previewColor: '#FDF5E6' },
  ],
  'XV Años': [
    { id: 'xv_anos', name: 'Princess Sparkle', previewColor: '#F8E8F5' },
    { id: 'xv_2', name: 'Modern Rose', previewColor: '#FDF2F4' },
  ],
  'Baby Shower': [
    { id: 'baby_shower', name: 'Pastel Dreams', previewColor: '#E8F5F8' },
    { id: 'baby_shower_2', name: 'Little Star', previewColor: '#F8F8E8' },
  ],
  'Bautizo': [
    { id: 'bautizo', name: 'Classic Blue', previewColor: '#EDF5FA' },
    { id: 'bautizo_2', name: 'Holy Spirit', previewColor: '#F9F9F9' },
  ],
  'Graduación': [
    { id: 'graduacion', name: 'Modern Cap', previewColor: '#F0F4F8' },
    { id: 'graduacion_2', name: 'Class of 2024', previewColor: '#F5F5F5' },
  ],
};

export default function Configuracion() {
  const { eventData, updateField } = useEditor();

  const handleEventTypeChange = (type: string) => {
    updateField('event_type', type);
    // Cambiar automáticamente a la primera plantilla de ese tipo si está disponible
    const firstTemplate = TEMPLATES_BY_TYPE[type]?.[0]?.id;
    if (firstTemplate) {
      updateField('template_id', firstTemplate);
    }
  };



  return (
    <div className="space-y-10">
      {/* ── TIPO DE EVENTO ── */}
      <section className="space-y-4">
        <label className="text-[11px] font-black text-[#a35d6a]/60 uppercase tracking-[0.2em] flex items-center gap-2">
          <PartyPopper size={14} /> Tipo de Evento
        </label>
        <div className="flex flex-wrap gap-2">
          {EVENT_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => handleEventTypeChange(type)}
              className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all border ${
                eventData.event_type === type
                  ? 'bg-[#a35d6a] text-white border-[#a35d6a] shadow-lg shadow-rose-200'
                  : 'bg-white text-[#7a5060]/70 border-rose-100 hover:border-rose-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </section>

      {/* ── SELECCIÓN DE PLANTILLA (DINÁMICA) ── */}
      <section className="space-y-4">
        <label className="text-[11px] font-black text-[#a35d6a]/60 uppercase tracking-[0.2em] flex items-center gap-2">
          Diseño de la Invitación
        </label>
        <div className="grid grid-cols-2 gap-4">
          {(TEMPLATES_BY_TYPE[eventData.event_type] || []).map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => updateField('template_id', tpl.id)}
              className={`relative aspect-[4/5] rounded-3xl border-2 transition-all p-2 overflow-hidden group ${
                eventData.template_id === tpl.id
                  ? 'border-[#a35d6a] bg-rose-50 shadow-md'
                  : 'border-transparent bg-gray-50 hover:bg-white hover:border-rose-100'
              }`}
            >
              <div 
                className="w-full h-full rounded-2xl shadow-inner flex items-center justify-center transition-transform group-hover:scale-[1.02]"
                style={{ backgroundColor: tpl.previewColor }}
              >
                <span className="text-[10px] font-black uppercase text-[#a35d6a]/40 tracking-widest px-4 text-center">
                  {tpl.name}
                </span>
                {eventData.template_id === tpl.id && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-[#a35d6a] text-white rounded-full flex items-center justify-center shadow-lg">
                    <Check size={14} />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── AJUSTES GENERALES (Toggles) ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Idioma */}
        <div className="bg-white border border-rose-100 p-5 rounded-3xl space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-black text-[#a35d6a] uppercase tracking-widest flex items-center gap-2">
               <Globe size={14} /> Idioma Dual
            </label>
            <button
              onClick={() => updateField('is_bilingual', !eventData.is_bilingual)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                eventData.is_bilingual ? 'bg-[#a35d6a]' : 'bg-gray-200'
              }`}
            >
              <motion.div 
                animate={{ x: eventData.is_bilingual ? 26 : 2 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
              />
            </button>
          </div>
          <p className="text-[10px] text-gray-400 font-medium">
            Habilita textos en Español e Inglés para tus invitados internacionales.
          </p>
        </div>

        {/* Solo Adultos */}
        <div className="bg-white border border-rose-100 p-5 rounded-3xl space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-black text-[#a35d6a] uppercase tracking-widest flex items-center gap-2">
               <UserCheck size={14} /> Solo Adultos
            </label>
            <button
              onClick={() => updateField('adults_only', !eventData.adults_only)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                eventData.adults_only ? 'bg-[#a35d6a]' : 'bg-gray-200'
              }`}
            >
              <motion.div 
                animate={{ x: eventData.adults_only ? 26 : 2 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
              />
            </button>
          </div>
          <p className="text-[10px] text-gray-400 font-medium">
            Agrega una nota elegante indicando que el evento es exclusivo para adultos.
          </p>
        </div>
      </section>

      {/* ── ENLACE PERSONALIZADO (Slug) ── */}
      <section className="space-y-4">
        <label className="text-[11px] font-black text-[#a35d6a] uppercase tracking-widest flex items-center gap-2">
          <LinkIcon size={14} /> URL Personalizada
        </label>
        <div className="flex items-center gap-2 bg-rose-50/50 p-4 rounded-3xl border border-rose-100/50">
          <span className="text-[11px] font-bold text-[#a35d6a]/40">giovanni.ai/invite/</span>
          <input
            type="text"
            value={eventData.slug}
            onChange={(e) => updateField('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
            placeholder="mi-super-evento"
            className="flex-1 bg-transparent border-none focus:ring-0 text-[11px] font-black text-[#a35d6a] p-0 placeholder:text-rose-200"
          />
        </div>
        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">
          * Este será el enlace que compartirás con tus invitados.
        </p>
      </section>
    </div>
  );
}
