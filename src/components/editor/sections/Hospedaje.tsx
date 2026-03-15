'use client';

import React from 'react';
import { useEditor } from '@/context/EditorContext';
import { 
  Hotel, 
  MapPin, 
  Phone, 
  ExternalLink, 
  Plus, 
  Trash2,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Hospedaje() {
  const { eventData, updateField } = useEditor();
  
  const hotels = (eventData as any).hotels || [];

  const updateHotels = (newHotels: any[]) => {
    updateField('hotels' as any, newHotels);
  };

  const addHotel = () => {
    updateField('hotels' as any, [
      ...hotels,
      { 
        id: Math.random().toString(36).substr(2, 9),
        name: 'Nombre del Hotel',
        address: '',
        phone: '',
        booking_url: '',
        discount_code: ''
      }
    ]);
  };

  const removeHotel = (id: string) => {
    updateField('hotels' as any, hotels.filter((h: any) => h.id !== id));
  };

  const updateHotel = (id: string, field: string, value: string) => {
    const newHotels = hotels.map((h: any) => 
      h.id === id ? { ...h, [field]: value } : h
    );
    updateField('hotels' as any, newHotels);
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-black text-[#a35d6a]/60 uppercase tracking-[0.2em] flex items-center gap-2">
          <Hotel size={16} /> Sugerencias de Hospedaje
        </label>
        <button
          onClick={addHotel}
          className="flex items-center gap-2 px-4 py-2 bg-[#a35d6a] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-200 hover:scale-105 transition-transform"
        >
          <Plus size={14} /> Agregar Hotel
        </button>
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {hotels.map((hotel: any) => (
            <motion.div
              key={hotel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-rose-100 rounded-[2.5rem] p-6 shadow-sm space-y-4 relative group"
            >
              <button
                onClick={() => removeHotel(hotel.id)}
                className="absolute top-4 right-4 p-2 text-rose-200 hover:text-red-400 transition-colors"
              >
                <Trash2 size={18} />
              </button>

              <div className="space-y-4">
                {/* Nombre */}
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-gray-400 uppercase ml-1">Nombre del Hotel</span>
                  <input
                    type="text"
                    value={hotel.name}
                    onChange={(e) => updateHotel(hotel.id, 'name', e.target.value)}
                    placeholder="Ej: Hotel Real de Minas"
                    className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold text-[#2d1b2d] outline-none"
                  />
                </div>

                {/* Dirección */}
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-gray-400 uppercase ml-1">Dirección</span>
                  <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3">
                    <MapPin size={14} className="text-gray-300" />
                    <input
                      type="text"
                      value={hotel.address}
                      onChange={(e) => updateHotel(hotel.id, 'address', e.target.value)}
                      placeholder="Calle y número..."
                      className="flex-1 bg-transparent border-none p-3 text-xs font-medium text-[#7a5060] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Teléfono */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-gray-400 uppercase ml-1">Teléfono / Reservas</span>
                    <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3">
                      <Phone size={14} className="text-gray-300" />
                      <input
                        type="tel"
                        value={hotel.phone || ''}
                        onChange={(e) => updateHotel(hotel.id, 'phone', e.target.value)}
                        placeholder="55 1234 5678"
                        className="flex-1 bg-transparent border-none p-3 text-xs font-medium text-[#7a5060] outline-none"
                      />
                    </div>
                  </div>

                  {/* Código de descuento */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-gray-400 uppercase ml-1">Código de Evento</span>
                    <input
                      type="text"
                      value={hotel.discount_code || ''}
                      onChange={(e) => updateHotel(hotel.id, 'discount_code', e.target.value)}
                      placeholder="Ej: BODA-MARIA"
                      className="w-full bg-slate-50 border-none rounded-xl p-3 text-xs font-bold text-[#a35d6a] outline-none"
                    />
                  </div>
                </div>

                {/* Enlace de reserva */}
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-gray-400 uppercase ml-1">Enlace de Reserva (URL)</span>
                  <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3">
                    <ExternalLink size={14} className="text-gray-300" />
                    <input
                      type="url"
                      value={hotel.booking_url || ''}
                      onChange={(e) => updateHotel(hotel.id, 'booking_url', e.target.value)}
                      placeholder="https://..."
                      className="flex-1 bg-transparent border-none p-3 text-[10px] font-medium text-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {hotels.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-rose-100 rounded-[2.5rem]">
            <p className="text-[#a35d6a]/40 text-xs font-bold uppercase tracking-widest">No hay hoteles registrados aún</p>
          </div>
        )}
      </div>

      {/* Sugerencia */}
      <div className="bg-blue-50/30 p-5 rounded-3xl border border-blue-100/50 flex items-start gap-4">
        <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
          <Info className="text-blue-400" size={20} />
        </div>
        <div className="space-y-1">
          <h4 className="text-[11px] font-black uppercase text-blue-500 tracking-wider">Ayuda a tus invitados</h4>
          <p className="text-[10px] text-blue-700/70 font-medium leading-relaxed">
            Recomendamos añadir hoteles cercanos al lugar de la recepción. Si tienes un convenio o tarifa especial, no olvides incluir el código de descuento.
          </p>
        </div>
      </div>
    </div>
  );
}
