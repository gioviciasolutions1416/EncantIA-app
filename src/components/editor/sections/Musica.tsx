'use client';

import React from 'react';
import { useEditor } from '@/context/EditorContext';
import { 
  Music, 
  Play, 
  Trash2, 
  Search,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SUGGESTED_TRACKS = [
  { id: '1', title: 'Perfect', artist: 'Ed Sheeran', url: 'https://cdn.pixabay.com/audio/2022/10/25/audio_2267812cc9.mp3' },
  { id: '2', title: 'A Thousand Years', artist: 'Christina Perri', url: 'https://cdn.pixabay.com/audio/2022/11/22/audio_febc508520.mp3' },
  { id: '3', title: 'Canon in D', artist: 'Pachelbel', url: 'https://cdn.pixabay.com/audio/2022/01/05/audio_10bb218fb4.mp3' },
  { id: '4', title: 'Thinking Out Loud', artist: 'Ed Sheeran', url: 'https://cdn.pixabay.com/audio/2022/08/02/audio_346b0e8ce2.mp3' },
];

export default function Musica() {
  const { eventData, updateField } = useEditor();

  const handleSelectTrack = (url: string) => {
    updateField('music_url', url);
  };

  const removeTrack = () => {
    updateField('music_url', '');
  };

  return (
    <div className="space-y-10">
      {/* ── TRACK ACTUAL ── */}
      <section className="bg-gradient-to-br from-[#fdfafc] to-rose-50/30 border border-rose-100 p-6 rounded-[2.5rem] shadow-sm">
        <label className="text-[11px] font-black text-[#a35d6a]/60 uppercase tracking-[0.2em] flex items-center gap-2 mb-6">
          <Music size={16} /> Música de Fondo
        </label>
        
        {eventData.music_url ? (
          <div className="bg-white border-2 border-[#a35d6a] p-4 rounded-3xl shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0 animate-[spin_3s_linear_infinite]">
                <Music size={20} className="text-[#a35d6a]" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-black text-[#2d1b2d] truncate max-w-[200px]">Pista Seleccionada</p>
                <p className="text-[10px] text-gray-400 font-medium truncate max-w-[200px]">{eventData.music_url}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              {/* Controles de audio nativos ocultos temporalmente, podrías agregar un previewer real aquí */}
              <audio src={eventData.music_url} controls className="h-8 w-40 md:w-48" />
              <button
                onClick={removeTrack}
                className="p-2.5 text-rose-200 hover:text-red-500 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors shrink-0"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-white border border-rose-100 rounded-[2rem] flex items-center justify-center mx-auto mb-3">
              <Music size={24} className="text-[#a35d6a]/30" />
            </div>
            <p className="text-[11px] font-black uppercase tracking-widest text-[#a35d6a]/60">Sin Música</p>
            <p className="text-[10px] font-medium text-gray-400 mt-1 max-w-[250px] mx-auto">
              Añade una canción de fondo para darle ambiente a tu invitación digital.
            </p>
          </div>
        )}
      </section>

      {/* ── ENTRADA MANUAL ── */}
      <section className="space-y-4">
        <label className="text-[11px] font-black text-[#a35d6a]/60 uppercase tracking-[0.2em] flex items-center gap-2">
          URL Personalizada
        </label>
        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-rose-100">
          <input
            type="url"
            value={eventData.music_url || ''}
            onChange={(e) => updateField('music_url', e.target.value)}
            placeholder="Pegar enlace de MP3 (ej: https://.../cancion.mp3)"
            className="flex-1 bg-transparent border-none focus:ring-0 text-xs font-bold text-[#7a5060] p-3 outline-none"
          />
        </div>
        <p className="text-[10px] text-gray-400 font-medium italic px-2">
          Asegúrate de que enlace termine en .mp3 para garantizar la reproducción automática.
        </p>
      </section>

      {/* ── CAROUSEL DE SUGERENCIAS ── */}
      <section className="space-y-4">
        <label className="text-[11px] font-black text-[#a35d6a]/60 uppercase tracking-[0.2em] flex items-center gap-2">
          Pistas Sugeridas
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SUGGESTED_TRACKS.map((track) => {
            const isSelected = eventData.music_url === track.url;
            return (
              <button
                key={track.id}
                onClick={() => handleSelectTrack(track.url)}
                className={`p-4 rounded-3xl border-2 transition-all flex items-center justify-between group flex-wrap gap-2 ${
                  isSelected
                    ? 'border-[#a35d6a] bg-rose-50 shadow-sm'
                    : 'border-transparent bg-white hover:border-rose-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${isSelected ? 'bg-[#a35d6a] text-white' : 'bg-rose-50 text-[#a35d6a] group-hover:bg-[#a35d6a] group-hover:text-white'}`}>
                    <Play size={14} className="ml-1" />
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] font-black text-[#2d1b2d]">{track.title}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{track.artist}</p>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 bg-[#a35d6a] text-white rounded-full flex items-center justify-center">
                    <Check size={12} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
