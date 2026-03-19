'use client';

import React from 'react';
import { useEditor } from '@/context/EditorContext';

import { 
  Globe, 
  UserCheck, 
  Link as LinkIcon,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';





export default function Configuracion() {
  const { eventData, updateField } = useEditor();





  return (
    <div className="space-y-10">
      {/* ── TIPO DE EVENTO ── */}
      <section className="bg-white border border-rose-100 p-5 rounded-3xl space-y-3">
        <label className="text-[11px] font-black text-[#a35d6a] uppercase tracking-widest flex items-center gap-2">
           Tipo de Evento
        </label>
        <select
          value={eventData.event_type || ''}
          onChange={(e) => updateField('event_type', e.target.value)}
          className="w-full bg-rose-50/50 border border-rose-100 p-3 rounded-2xl text-sm font-bold text-[#a35d6a] outline-none"
        >
          <option value="">Selecciona...</option>
          <option value="Boda">Boda</option>
          <option value="XV Años">XV Años</option>
          <option value="Bautizo">Bautizo</option>
          <option value="Baby Shower">Baby Shower</option>
        </select>
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

        {/* PIN de Seguridad */}
        <div className="bg-white border border-rose-100 p-5 rounded-3xl space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-black text-[#a35d6a] uppercase tracking-widest flex items-center gap-2">
               <Lock size={14} /> PIN de Seguridad
            </label>
            <button
              onClick={() => updateField('security_pin_enabled', !eventData.security_pin_enabled)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                eventData.security_pin_enabled ? 'bg-[#a35d6a]' : 'bg-gray-200'
              }`}
            >
              <motion.div 
                animate={{ x: eventData.security_pin_enabled ? 26 : 2 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
              />
            </button>
          </div>
          <p className="text-[10px] text-gray-400 font-medium">
            Protege el acceso a tu invitación con un código numérico de 4 dígitos.
          </p>
          <AnimatePresence>
            {eventData.security_pin_enabled && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden space-y-2 pt-2"
              >
                <label className="text-[9px] font-bold text-[#a35d6a]/70 uppercase tracking-widest">Código de 4 Dígitos</label>
                <input
                  type="text"
                  maxLength={4}
                  value={eventData.security_pin || ''}
                  onChange={(e) => updateField('security_pin', e.target.value.replace(/\D/g, '').substring(0, 4))}
                  placeholder="Ej: 1234"
                  className="w-full bg-rose-50/30 border border-rose-100 p-3 rounded-2xl text-center font-black tracking-[0.2em] text-[#a35d6a] outline-none"
                />
              </motion.div>
            )}
          </AnimatePresence>
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
