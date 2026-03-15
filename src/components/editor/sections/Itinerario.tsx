'use client';

import React from 'react';
import { useEditor } from '@/context/EditorContext';
import { 
  Clock, 
  MapPin, 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown,
  Music,
  Camera,
  Utensils,
  GlassWater,
  PartyPopper,
  Zap,
  Sparkles
} from 'lucide-react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';

const ICON_OPTIONS = [
  { id: 'clock', icon: Clock },
  { id: 'map', icon: MapPin },
  { id: 'music', icon: Music },
  { id: 'camera', icon: Camera },
  { id: 'food', icon: Utensils },
  { id: 'drink', icon: GlassWater },
  { id: 'party', icon: PartyPopper },
  { id: 'zap', icon: Zap },
];

export default function Itinerario() {
  const { eventData, updateField } = useEditor();
  const items = eventData.itinerary_items || [];

  const addItem = () => {
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      time: '18:00',
      title: 'Nuevo Evento',
      description: '',
      icon: 'clock'
    };
    updateField('itinerary_items', [...items, newItem]);
  };

  const removeItem = (id: string) => {
    updateField('itinerary_items', items.filter((item: any) => item.id !== id));
  };

  const updateItem = (id: string, field: string, value: string) => {
    const newItems = items.map((item: any) => 
      item.id === id ? { ...item, [field]: value } : item
    );
    updateField('itinerary_items', newItems);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;
    
    const newItems = [...items];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    updateField('itinerary_items', newItems);
  };

  const loadSuggested = () => {
    let suggested: any[] = [];
    if (eventData.event_type === 'Bautizo') {
      suggested = [
        { id: '1', time: '11:00', title: 'Misa de Bautismo', description: '', icon: 'clock' },
        { id: '2', time: '12:30', title: 'Sesión de Fotos', description: '', icon: 'camera' },
        { id: '3', time: '13:00', title: 'Comida de Celebración', description: '', icon: 'food' },
        { id: '4', time: '15:00', title: 'Pastel y Brindis', description: '', icon: 'drink' },
        { id: '5', time: '15:30', title: 'Entrega de Recuerdos', description: '', icon: 'party' },
      ];
    } else {
      suggested = [
        { id: '1', time: '16:00', title: 'Ceremonia', description: 'Ceremonia Religiosa', icon: 'clock' },
        { id: '2', time: '18:00', title: 'Recepción', description: 'Llegada al salón', icon: 'music' },
        { id: '3', time: '20:30', title: 'Banquete', description: 'Cena y brindis', icon: 'food' },
        { id: '4', time: '22:00', title: 'Fiesta', description: 'Música y baile', icon: 'party' },
      ];
    }
    updateField('itinerary_items', suggested);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-black text-[#a35d6a]/60 uppercase tracking-[0.2em] flex items-center gap-2">
          Itinerario del Evento
        </label>
        <button
          onClick={addItem}
          className="flex items-center gap-2 px-4 py-2 bg-[#a35d6a] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-200 hover:scale-105 transition-transform"
        >
          <Plus size={14} /> Sugerir Item
        </button>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {items.map((item: any, index: number) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-rose-100 rounded-[2rem] p-5 shadow-sm space-y-4 group relative"
            >
              {/* Controles de orden */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 flex flex-col gap-1 bg-white border border-rose-100 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => moveItem(index, 'up')} className="p-1 hover:text-[#a35d6a] disabled:opacity-20" disabled={index === 0}>
                  <ChevronUp size={14} />
                </button>
                <button onClick={() => moveItem(index, 'down')} className="p-1 hover:text-[#a35d6a] disabled:opacity-20" disabled={index === items.length - 1}>
                  <ChevronDown size={14} />
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                {/* Hora e Icono */}
                <div className="flex md:flex-col gap-3 items-center md:items-start md:min-w-[100px]">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-gray-400 uppercase ml-1">Hora</span>
                    <input
                      type="time"
                      value={item.time}
                      onChange={(e) => updateItem(item.id, 'time', e.target.value)}
                      className="bg-[#fdfafc] border border-rose-100 rounded-xl p-2 text-xs font-bold text-[#2d1b2d] outline-none"
                    />
                  </div>
                  
                  {/* Selector de Icono Simple */}
                  <div className="flex flex-wrap gap-1.5 md:pt-2">
                    {ICON_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => updateItem(item.id, 'icon', opt.id)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          item.icon === opt.id 
                            ? 'bg-rose-50 border-[#a35d6a] text-[#a35d6a]' 
                            : 'bg-white border-rose-50 text-gray-300 hover:border-rose-200'
                        }`}
                      >
                        <opt.icon size={14} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Título y Descripción */}
                <div className="flex-1 space-y-3">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-gray-400 uppercase ml-1">Título de la Actividad</span>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                      placeholder="Ej: Ceremonia Religiosa"
                      className="w-full bg-white border-b border-rose-50 p-2 text-sm font-black text-[#2d1b2d] focus:border-[#a35d6a] outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-gray-400 uppercase ml-1">Breve Descripción</span>
                    <textarea
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder="Detalles sobre este momento..."
                      rows={1}
                      className="w-full bg-transparent border-none focus:ring-0 text-[11px] font-medium text-[#7a5060] p-2 resize-none"
                    />
                  </div>
                </div>

                {/* Eliminar */}
                <div className="flex items-center justify-end">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-3 text-rose-200 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {items.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-rose-100 rounded-[2rem] flex flex-col items-center gap-4">
            <p className="text-[#a35d6a]/40 text-xs font-bold uppercase tracking-widest">No hay momentos registrados aún</p>
            <button
              onClick={loadSuggested}
              className="px-6 py-2.5 bg-rose-50 text-[#a35d6a] hover:bg-[#a35d6a] hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Sparkles size={14} /> Cargar Itinerario Base
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
