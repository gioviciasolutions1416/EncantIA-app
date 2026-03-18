'use client';

import React from 'react';
import { useEditor } from '@/context/EditorContext';
import TextFormatBar from '@/components/editor/TextFormatBar';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Map as MapIcon, 
  Navigation,
  Plus,
  Trash2,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FechaLugar() {
  const { eventData, updateField } = useEditor();

  const handleSecondVenueToggle = () => {
    const current = eventData.segunda_sede_json || { enabled: false };
    updateField('segunda_sede_json', {
      ...current,
      enabled: !current.enabled
    });
  };

  const updateSecondVenueField = (field: string, value: any) => {
    const current = eventData.segunda_sede_json || {};
    updateField('segunda_sede_json', {
      ...current,
      [field]: value
    });
  };

  return (
    <div className="space-y-10">
      {/* ── SEDE PRINCIPAL (O RECEPCIÓN) ── */}
      <section className="bg-white border border-rose-100 rounded-[2.5rem] p-6 md:p-8 space-y-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
          <MapPin size={120} />
        </div>

        <label className="text-[11px] font-black text-[#a35d6a] uppercase tracking-[0.2em] flex items-center gap-2">
          <div className="w-6 h-6 bg-rose-50 rounded-lg flex items-center justify-center">
            <MapPin size={14} />
          </div>
          Sede Principal / Recepción
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase ml-2 flex items-center gap-1">
              <Calendar size={10} /> Fecha del Evento
            </span>
            <input
              type="date"
              value={eventData.event_date}
              onChange={(e) => updateField('event_date', e.target.value)}
              className="w-full bg-[#fdfafc] border border-rose-100 p-4 rounded-2xl text-sm font-bold text-[#2d1b2d] focus:ring-2 focus:ring-[#7B2D8B]/10 outline-none"
            />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase ml-2 flex items-center gap-1">
              <Clock size={10} /> Hora de Inicio
            </span>
            <input
              type="time"
              value={eventData.event_time || ''}
              onChange={(e) => updateField('event_time', e.target.value)}
              className="w-full bg-[#fdfafc] border border-rose-100 p-4 rounded-2xl text-sm font-bold text-[#2d1b2d] focus:ring-2 focus:ring-[#7B2D8B]/10 outline-none"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase ml-2">Nombre del Lugar</span>
            <input
              type="text"
              value={eventData.venue || ''}
              onChange={(e) => updateField('venue', e.target.value)}
              placeholder="Ej: Jardín de los Olivos"
              className="w-full bg-[#fdfafc] border border-rose-100 p-4 rounded-2xl text-sm font-bold text-[#2d1b2d] outline-none focus:border-[#a35d6a]"
            />
            <TextFormatBar field="lugar_ceremonia" />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase ml-2">Dirección Completa</span>
            <textarea
              value={eventData.venue_address || ''}
              onChange={(e) => updateField('venue_address', e.target.value)}
              placeholder="Calle, número, colonia y ciudad..."
              rows={2}
              className="w-full bg-[#fdfafc] border border-rose-100 p-4 rounded-2xl text-sm font-bold text-[#2d1b2d] outline-none focus:border-[#a35d6a] resize-none"
            />
            <TextFormatBar field="direccion_ceremonia" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase ml-2 flex items-center gap-1">
              <MapIcon size={10} /> Google Maps URL
            </span>
            <input
              type="text"
              value={eventData.location_url || ''}
              onChange={(e) => updateField('location_url', e.target.value)}
              placeholder="https://maps.google.com/..."
              className="w-full bg-[#fdfafc] border border-rose-100 p-4 rounded-2xl text-[11px] font-medium text-[#7a5060] outline-none focus:border-[#a35d6a]"
            />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase ml-2 flex items-center gap-1">
              <Navigation size={10} /> Waze URL
            </span>
            <input
              type="text"
              value={eventData.location_waze_url || ''}
              onChange={(e) => updateField('location_waze_url', e.target.value)}
              placeholder="https://waze.com/ul/..."
              className="w-full bg-[#fdfafc] border border-rose-100 p-4 rounded-2xl text-[11px] font-medium text-[#7a5060] outline-none focus:border-[#a35d6a]"
            />
          </div>
        </div>
      </section>

      {/* ── SECCIÓN DINÁMICA: SEGUNDA SEDE ── */}
      <section className="space-y-4">
        {!eventData.segunda_sede_json?.enabled ? (
          <button
            onClick={handleSecondVenueToggle}
            className="w-full py-6 border-2 border-dashed border-rose-100 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 text-rose-300 hover:text-[#a35d6a] hover:border-rose-200 hover:bg-rose-50/30 transition-all group"
          >
            <div className="w-10 h-10 bg-white rounded-full shadow-sm border border-rose-100 flex items-center justify-center transition-transform group-active:scale-90">
              <Plus size={20} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest">Agregar Segunda Sede (ej: Ceremonia Religiosa)</span>
          </button>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#fdfafc] border-2 border-[#a35d6a]/20 rounded-[2.5rem] p-6 md:p-8 space-y-6 relative"
          >
            <button 
              onClick={handleSecondVenueToggle}
              className="absolute top-6 right-6 p-2 text-rose-200 hover:text-red-400 transition-colors"
              title="Dar de baja segunda sede"
            >
              <Trash2 size={18} />
            </button>

            <label className="text-[11px] font-black text-[#a35d6a] uppercase tracking-[0.2em] flex items-center gap-2">
              <div className="w-6 h-6 bg-[#a35d6a] text-white rounded-lg flex items-center justify-center">
                <MapPin size={14} />
              </div>
              Segunda Sede / Ceremonia
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase ml-2 flex items-center gap-1">
                  <Calendar size={10} /> Fecha del Evento
                </span>
                <input
                  type="date"
                  value={eventData.segunda_sede_json?.event_date || ''}
                  onChange={(e) => updateSecondVenueField('event_date', e.target.value)}
                  className="w-full bg-white border border-rose-100 p-4 rounded-2xl text-sm font-bold text-[#2d1b2d] outline-none"
                />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase ml-2 flex items-center gap-1">
                  <Clock size={10} /> Hora de Inicio
                </span>
                <input
                  type="time"
                  value={eventData.segunda_sede_json?.hora || ''}
                  onChange={(e) => updateSecondVenueField('hora', e.target.value)}
                  className="w-full bg-white border border-rose-100 p-4 rounded-2xl text-sm font-bold text-[#2d1b2d] outline-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase ml-2">Nombre del Lugar</span>
                <input
                  type="text"
                  value={eventData.segunda_sede_json?.venue || ''}
                  onChange={(e) => updateSecondVenueField('venue', e.target.value)}
                  placeholder="Ej: Parroquia de la Santa Cruz"
                  className="w-full bg-white border border-rose-100 p-4 rounded-2xl text-sm font-bold text-[#2d1b2d] outline-none"
                />
                <TextFormatBar field="lugar_recepcion" />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase ml-2">Dirección Completa</span>
                <textarea
                  value={eventData.segunda_sede_json?.venue_address || ''}
                  onChange={(e) => updateSecondVenueField('venue_address', e.target.value)}
                  placeholder="Calle, número, colonia..."
                  rows={2}
                  className="w-full bg-white border border-rose-100 p-4 rounded-2xl text-sm font-bold text-[#2d1b2d] outline-none resize-none"
                />
                <TextFormatBar field="direccion_recepcion" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase ml-2 flex items-center gap-1">
                  <MapIcon size={10} /> Google Maps URL
                </span>
                <input
                  type="text"
                  value={eventData.segunda_sede_json?.location_url || ''}
                  onChange={(e) => updateSecondVenueField('location_url', e.target.value)}
                  className="w-full bg-white border border-rose-100 p-4 rounded-2xl text-[11px] font-medium text-[#7a5060] outline-none"
                />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase ml-2 flex items-center gap-1">
                  <Navigation size={10} /> Waze URL
                </span>
                <input
                  type="text"
                  value={eventData.segunda_sede_json?.waze_url || ''}
                  onChange={(e) => updateSecondVenueField('waze_url', e.target.value)}
                  className="w-full bg-white border border-rose-100 p-4 rounded-2xl text-[11px] font-medium text-[#7a5060] outline-none"
                />
              </div>
            </div>
          </motion.div>
        )}
      </section>
    </div>
  );
}
