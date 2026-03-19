'use client';

import React from 'react';
import { useEditor } from '@/context/EditorContext';
import TextFormatBar from '@/components/editor/TextFormatBar';
import { 
  CheckCircle2, 
  Calendar, 
  Users, 
  Utensils, 
  MessageSquare,
  Plus,
  Trash2,
  BellRing,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const COUNTRIES = [
    { code: '52', flag: '🇲🇽', name: 'México' },
    { code: '1', flag: '🇺🇸', name: 'USA' },
    { code: '34', flag: '🇪🇸', name: 'España' },
    { code: '57', flag: '🇨🇴', name: 'Colombia' },
    { code: '54', flag: '🇦🇷', name: 'Argentina' },
    { code: '56', flag: '🇨🇱', name: 'Chile' },
    { code: '51', flag: '🇵🇪', name: 'Perú' },
    { code: '58', flag: '🇻🇪', name: 'Venezuela' },
    { code: '55', flag: '🇧🇷', name: 'Brasil' },
    { code: '502', flag: '🇬🇹', name: 'Guatemala' }
];

export default function Confirmacion() {
  const { eventData, updateField } = useEditor();
  const [countryMenuOpen, setCountryMenuOpen] = React.useState(false);
  
  // Inicializar rsvp_config si no existe
  const config = eventData.rsvp_config || {
    enabled: true,
    confFechaLimite: '',
    max_passes: 2,
    menu_options: ['Estandar', 'Vegetariano', 'Infantil'],
    custom_message: 'Por favor, confirma tu asistencia antes de la fecha límite.'
  };

  console.log('RSVP CONFIG:', JSON.stringify(eventData.rsvp_config));

  const updateConfig = (field: string, value: any) => {
    updateField('rsvp_config', {
      ...config,
      [field]: value
    });
  };

  const addMenuOption = () => {
    const options = [...(config.menu_options || [])];
    options.push('Nueva Opción');
    updateConfig('menu_options', options);
  };

  const removeMenuOption = (index: number) => {
    const options = config.menu_options.filter((_: any, i: number) => i !== index);
    updateConfig('menu_options', options);
  };

  const updateMenuOption = (index: number, value: string) => {
    const options = [...config.menu_options];
    options[index] = value;
    updateConfig('menu_options', options);
  };

  return (
    <div className="space-y-10">
      {/* ── TOGGLE PRINCIPAL ── */}
      <section className="bg-gradient-to-br from-white to-rose-50/30 border border-rose-100 p-6 rounded-[2.5rem] shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-black text-[#a35d6a] uppercase tracking-widest flex items-center gap-2">
              <CheckCircle2 size={16} /> Habilitar Confirmación (RSVP)
            </label>
            <p className="text-[10px] text-gray-400 font-medium max-w-[280px]">
              Permite que tus invitados confirmen su asistencia directamente desde la invitación.
            </p>
          </div>
          
          <button
            onClick={() => updateConfig('enabled', !config.enabled)}
            className={`w-14 h-7 rounded-full transition-all relative ${
              config.enabled ? 'bg-[#a35d6a] shadow-inner' : 'bg-gray-200'
            }`}
          >
            <motion.div 
              animate={{ x: config.enabled ? 30 : 2 }}
              className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center"
            >
              {config.enabled && <div className="w-1 h-1 bg-[#a35d6a] rounded-full" />}
            </motion.div>
          </button>
        </div>
      </section>

      <AnimatePresence>
        {config.enabled && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-8"
          >
            {/* ── AJUSTES BÁSICOS ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section className="space-y-4">
                <label className="text-[11px] font-black text-[#a35d6a]/60 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Calendar size={14} /> Fecha Límite
                </label>
                <div className="bg-white border border-rose-100 p-4 rounded-3xl shadow-sm">
                  <input
                    type="date"
                    value={config.confFechaLimite || ''}
                    onChange={(e) => updateConfig('confFechaLimite', e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 text-xs font-bold text-[#2d1b2d] p-0"
                  />
                </div>
              </section>

              <section className="space-y-4">
                <label className="text-[11px] font-black text-[#a35d6a]/60 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Users size={14} /> Pases por Invitación
                </label>
                <div className="bg-white border border-rose-100 p-4 rounded-3xl shadow-sm flex items-center gap-4">
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={config.max_passes || 1}
                    onChange={(e) => updateConfig('max_passes', parseInt(e.target.value))}
                    className="w-full bg-transparent border-none focus:ring-0 text-xs font-bold text-[#2d1b2d] p-0"
                  />
                  <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter shrink-0">Máx sugerido</span>
                </div>
              </section>

              <section className="space-y-3">
                <label className="text-[11px] font-black text-[#a35d6a]/60 uppercase tracking-[0.2em] flex items-center gap-2">
                  <MessageSquare size={14} /> WhatsApp del Organizador
                </label>
                <div className="bg-white border border-rose-100 rounded-3xl shadow-sm p-4 space-y-3">
                  <div className="flex gap-2">
                    {/* Selector de País Custom */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setCountryMenuOpen(!countryMenuOpen)}
                        className="bg-rose-50 border border-rose-100 rounded-2xl px-3 py-2.5 text-xs font-black text-[#a35d6a] flex items-center gap-1.5 hover:bg-rose-100/50 transition-colors"
                      >
                        <span className="text-sm">{COUNTRIES.find(c => c.code === (config.phone_country || '52'))?.flag}</span>
                        <span className="text-[10px]">+{config.phone_country || '52'}</span>
                        <ChevronDown size={12} className={`transition-transform ${countryMenuOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {countryMenuOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setCountryMenuOpen(false)} />
                          <div className="absolute top-full left-0 mt-1 bg-white border border-rose-100 shadow-xl rounded-2xl w-44 z-50 p-1 divide-y divide-rose-50/40 overflow-hidden max-h-48 overflow-y-auto">
                            {COUNTRIES.map((c) => (
                              <button
                                key={c.code}
                                type="button"
                                onClick={() => {
                                  updateField('rsvp_config', {
                                    ...config,
                                    phone_country: c.code,
                                    phone: `${c.code}${config.phone_number || ''}`
                                  });
                                  setCountryMenuOpen(false);
                                }}
                                className="w-full flex items-center gap-2 p-2 hover:bg-rose-50/60 rounded-xl text-left transition-colors"
                              >
                                <span className="text-base">{c.flag}</span>
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-black text-[#2d1b2d]">{c.name}</span>
                                  <span className="text-[8px] text-gray-400 font-bold">+{c.code}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Input de Número */}
                    <input
                      type="tel"
                      value={config.phone_number || ''}
                      onChange={(e) => {
                        const num = e.target.value.replace(/\D/g, '').slice(0, 10);
                        const country = config.phone_country || '52';
                        updateField('rsvp_config', {
                          ...config,
                          phone_number: num,
                          phone: `${country}${num}`
                        });
                      }}
                      placeholder="Ej: 5512345678"
                      className="flex-1 bg-rose-50/30 border border-rose-100 rounded-2xl px-4 py-2.5 text-xs font-bold text-[#2d1b2d] outline-none placeholder:text-rose-200 focus:border-[#a35d6a] transition-colors"
                    />
                  </div>

                  {config.phone_number && (
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-2xl px-3 py-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <p className="text-[10px] font-black text-emerald-600">
                        +{config.phone_country || '52'} {config.phone_number}
                      </p>
                    </div>
                  )}
                </div>
                <p className="text-[9px] text-gray-400 font-medium pl-1">
                  Los invitados confirmarán su asistencia a este número.
                </p>
              </section>
            </div>

            {/* ── MENSAJE PERSONALIZADO ── */}
            <section className="space-y-4">
              <label className="text-[11px] font-black text-[#a35d6a]/60 uppercase tracking-[0.2em] flex items-center gap-2">
                <MessageSquare size={14} /> Mensaje para el Invitado
              </label>
              <div className="bg-white border border-rose-100 p-5 rounded-[2rem] shadow-sm">
                <textarea
                  value={config.custom_message || ''}
                  onChange={(e) => updateConfig('custom_message', e.target.value)}
                  placeholder="Ej: Nos encantaría contar con tu presencia..."
                  rows={3}
                  className="w-full bg-transparent border-none focus:ring-0 text-xs font-bold text-[#7a5060] placeholder:text-rose-200 resize-none"
                />
              </div>
              <TextFormatBar field="rsvp_mensaje" />
            </section>

            {/* ── OPCIONES DE MENÚ ── */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-black text-[#a35d6a]/60 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Utensils size={14} /> Opciones de Platillos
                </label>
                <button
                  onClick={addMenuOption}
                  className="p-2 bg-rose-50 text-[#a35d6a] rounded-xl hover:bg-rose-100 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(config.menu_options || []).map((option: string, index: number) => (
                  <motion.div
                    key={index}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 bg-white border border-rose-100 p-3 rounded-2xl shadow-sm group"
                  >
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateMenuOption(index, e.target.value)}
                      className="flex-1 bg-transparent border-none focus:ring-0 text-xs font-bold text-[#2d1b2d] p-0"
                    />
                    <button
                      onClick={() => removeMenuOption(index)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-rose-200 hover:text-red-400 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* ── NOTIFICACIÓN ── */}
            <div className="bg-rose-50/50 p-6 rounded-[2.5rem] border border-rose-100 flex items-start gap-4">
               <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-[#a35d6a] shadow-sm">
                 <BellRing size={20} />
               </div>
               <div className="space-y-1">
                 <h5 className="text-[11px] font-black uppercase text-[#a35d6a] tracking-widest">Notificaciones en tiempo real</h5>
                 <p className="text-[10px] text-[#7a5060] font-medium leading-relaxed">
                   Recibirás un correo electrónico automáticamente cada vez que un invitado confirme su asistencia. Podrás ver la lista completa en tu Panel de Control.
                 </p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
