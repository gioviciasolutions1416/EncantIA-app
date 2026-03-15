import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Palette, Type, Sparkles, Check } from 'lucide-react';
import { useEditor } from '@/context/EditorContext';

const COLOR_PALETTES: Record<string, { label: string; primary: string; secondary: string; bg: string }[]> = {
  Boda: [
    { label: 'Rosa Romántico', primary: '#a35d6a', secondary: '#f0dde3', bg: '#fdfafc' },
    { label: 'Sage & Ivory', primary: '#7a8b6a', secondary: '#e8ede4', bg: '#faf9f6' },
    { label: 'Champagne Gold', primary: '#b8960c', secondary: '#f5e6c8', bg: '#fffdf5' },
    { label: 'Navy & White', primary: '#1e3a5f', secondary: '#e8eef5', bg: '#f8fafc' },
    { label: 'Terracota', primary: '#c4652a', secondary: '#f5e0d0', bg: '#fffaf7' },
    { label: 'Midnight', primary: '#2d1b2d', secondary: '#e8d5e8', bg: '#fdf8fd' },
  ],
  'XV Años': [
    { label: 'Rosa Princesa', primary: '#d4669a', secondary: '#fce4f3', bg: '#fff8fc' },
    { label: 'Lila Mágico', primary: '#7b4fa6', secondary: '#ede0f8', bg: '#fbf7ff' },
    { label: 'Neon Vibes', primary: '#00d4ff', secondary: '#001a2c', bg: '#000d1a' },
    { label: 'Dorado Real', primary: '#c9971c', secondary: '#1a1a2e', bg: '#0f0f23' },
    { label: 'Mint Fresh', primary: '#4caf8f', secondary: '#e0f5ed', bg: '#f5fffa' },
    { label: 'Coral Sunset', primary: '#e8704a', secondary: '#fde8df', bg: '#fff8f5' },
  ],
  'Baby Shower': [
    { label: 'Sage Natural', primary: '#7a9e7e', secondary: '#e8f0e9', bg: '#f5f9f5' },
    { label: 'Lavanda Suave', primary: '#9b7ec8', secondary: '#ede0f8', bg: '#fbf7ff' },
    { label: 'Amarillo Sol', primary: '#e8c840', secondary: '#fdf8d0', bg: '#fffef5' },
    { label: 'Melocotón', primary: '#e89070', secondary: '#fde8df', bg: '#fff8f5' },
    { label: 'Azul Bebé', primary: '#6aadcf', secondary: '#dff0f8', bg: '#f5fbff' },
    { label: 'Rosa Bebé', primary: '#e8a0b4', secondary: '#fce4ec', bg: '#fff8fb' },
  ],
  Bautizo: [
    { label: 'Cielo Azul', primary: '#5b9fd4', secondary: '#ddeef8', bg: '#f5faff' },
    { label: 'Linen Sagrado', primary: '#8b7355', secondary: '#f0ead8', bg: '#fdfaf5' },
    { label: 'Blanco Puro', primary: '#6b9e8f', secondary: '#e0f0ec', bg: '#f5faf8' },
    { label: 'Dorado Celestial', primary: '#c9971c', secondary: '#f5e6c8', bg: '#fffdf5' },
    { label: 'Verde Olivo', primary: '#7a9e6a', secondary: '#e8f0e4', bg: '#f5f9f3' },
    { label: 'Malva Suave', primary: '#9b6e8f', secondary: '#f0e0ec', bg: '#fdf5fa' },
  ],
  Graduación: [
    { label: 'Navy Gold', primary: '#c9971c', secondary: '#1e3a5f', bg: '#0f1f35' },
    { label: 'Moderno Negro', primary: '#ffffff', secondary: '#333333', bg: '#111111' },
    { label: 'Esmeralda', primary: '#2e8b6e', secondary: '#e0f5ed', bg: '#f5fff9' },
    { label: 'Rojo Académico', primary: '#c0392b', secondary: '#fde8e6', bg: '#fff8f7' },
    { label: 'Gris Platino', primary: '#8e9eab', secondary: '#edf2f7', bg: '#f8fafc' },
    { label: 'Violeta', primary: '#6c3483', secondary: '#ede0f8', bg: '#fbf7ff' },
  ]
};

const FONTS_TITULOS = [
  { group: 'Elegantes', fonts: ['Playfair Display', 'Cormorant Garamond', 'EB Garamond', 'Libre Baskerville'] },
  { group: 'Caligráficas', fonts: ['Dancing Script', 'Alex Brush', 'Pinyon Script', 'Great Vibes'] },
  { group: 'Modernas', fonts: ['Jost', 'Mulish', 'DM Sans', 'Raleway'] },
  { group: 'Con personalidad', fonts: ['Anybody', 'Fraunces', 'Italiana'] }
];

const FONTS_CUERPO = [
  { group: 'Modernas', fonts: ['Jost', 'Mulish', 'DM Sans', 'Raleway'] },
  { group: 'Elegantes', fonts: ['Playfair Display', 'Cormorant Garamond', 'EB Garamond', 'Libre Baskerville'] }
];

const ANIMATIONS = [
  { id: 'sin_animaciones', label: 'Sin animaciones', desc: 'Estático, carga rápida' },
  { id: 'suave', label: 'Suave', desc: 'Fade-in elegante' },
  { id: 'dinamico', label: 'Dinámico', desc: 'Slides y efectos' }
];

const TEXT_SIZES = [
  { id: 'pequeno', label: 'Pequeño', scale: '0.85' },
  { id: 'normal', label: 'Normal', scale: '1' },
  { id: 'grande', label: 'Grande', scale: '1.15' },
];

interface DesignPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DesignPanel({ isOpen, onClose }: DesignPanelProps) {
  const { eventData, updateField } = useEditor();
  const currentStyles = eventData.sections_styles || {};
  const currentEventType = eventData.event_type || 'Boda';

  const updateStyle = (key: string, value: any) => {
    updateField('sections_styles', {
      ...currentStyles,
      [key]: value
    });
  };

  const palettesForEvent = COLOR_PALETTES[currentEventType] || COLOR_PALETTES['Boda'];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
            onClick={onClose}
          />

          {/* Sidebar Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 240 }}
            className="relative w-full max-w-[320px] h-full bg-white shadow-2xl flex flex-col border-l border-rose-100/50"
          >
            {/* Header */}
            <div className="h-16 px-6 flex items-center justify-between border-b border-rose-100 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Palette className="text-[#a35d6a]" size={18} />
                <h3 className="text-sm font-black text-[#2d1b2d] uppercase tracking-wider" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Personalización
                </h3>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-rose-50 rounded-full text-gray-400 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Content Scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-7 custom-scrollbar">
              {/* 1. PALETAS DE COLORES */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold text-[#a35d6a] bg-rose-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Paletas de Colores</span>
                </div>
                <p className="text-[10px] text-gray-400 mb-3">Sugeridas para {currentEventType}</p>
                <div className="grid grid-cols-2 gap-2">
                  {palettesForEvent.map((palette, i) => {
                    const isActive = currentStyles.color_primary === palette.primary;
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          updateField('sections_styles', {
                            ...currentStyles,
                            color_primary: palette.primary,
                            color_secondary: palette.secondary,
                            color_bg: palette.bg
                          });
                        }}
                        className={`p-2 rounded-xl text-left border transition-all ${
                          isActive ? 'border-[#a35d6a] bg-rose-50/20 shadow-sm' : 'border-gray-100 hover:border-rose-100 hover:bg-rose-50/10'
                        }`}
                      >
                        <div className="flex h-6 rounded-md overflow-hidden mb-1 border border-gray-100/50">
                          <div className="flex-1" style={{ backgroundColor: palette.primary }} />
                          <div className="flex-1" style={{ backgroundColor: palette.secondary }} />
                          <div className="flex-1" style={{ backgroundColor: palette.bg }} />
                        </div>
                        <span className="text-[9px] font-bold text-gray-600 truncate block">{palette.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. TIPOGRAFÍA - TÍTULOS */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold text-[#a35d6a] bg-rose-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Tipografía Títulos</span>
                </div>
                <select
                  value={currentStyles.font_titulos || 'Playfair Display'}
                  onChange={(e) => updateStyle('font_titulos', e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs text-[#2d1b2d] bg-white focus:outline-none focus:ring-2 focus:ring-rose-200 mb-2"
                >
                  {FONTS_TITULOS.map((g) => (
                    <optgroup key={g.group} label={g.group}>
                      {g.fonts.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <div className="p-3 bg-gray-50 rounded-xl text-center border border-dashed border-gray-200">
                  <span style={{ fontFamily: currentStyles.font_titulos || 'Playfair Display' }} className="text-sm font-bold text-[#2d1b2d]">
                    Tu Nombre Aquí
                  </span>
                </div>
              </div>

              {/* 3. TIPOGRAFÍA - CUERPO */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold text-[#a35d6a] bg-rose-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Tipografía Texto</span>
                </div>
                <select
                  value={currentStyles.font_cuerpo || 'Jost'}
                  onChange={(e) => updateStyle('font_cuerpo', e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs text-[#2d1b2d] bg-white focus:outline-none focus:ring-2 focus:ring-rose-200 mb-2"
                >
                  {FONTS_CUERPO.map((g) => (
                    <optgroup key={g.group} label={g.group}>
                      {g.fonts.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <div className="p-3 bg-gray-50 rounded-xl text-center border border-dashed border-gray-200">
                  <span style={{ fontFamily: currentStyles.font_cuerpo || 'Jost' }} className="text-xs text-gray-600">
                    Tu Nombre Aquí
                  </span>
                </div>
              </div>

              {/* 4. TAMAÑO DE TEXTO */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold text-[#a35d6a] bg-rose-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Tamaño de Texto</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {TEXT_SIZES.map((size) => {
                    const isActive = (currentStyles.font_scale || '1') === size.scale;
                    return (
                      <button
                        key={size.id}
                        onClick={() => updateStyle('font_scale', size.scale)}
                        className={`p-2 rounded-xl text-center border transition-all ${
                          isActive ? 'border-[#a35d6a] bg-rose-50/20 shadow-sm font-bold text-[#a35d6a]' : 'border-gray-100 hover:border-rose-100 hover:shadow-sm text-gray-500'
                        }`}
                      >
                        <span className="text-[10px] uppercase tracking-wider">{size.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. ANIMACIONES */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold text-[#a35d6a] bg-rose-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Animaciones</span>
                </div>
                <div className="space-y-2">
                  {ANIMATIONS.map((anim) => {
                    const isActive = (currentStyles.animaciones || 'suave') === anim.id;
                    return (
                      <button
                        key={anim.id}
                        onClick={() => updateStyle('animaciones', anim.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                          isActive ? 'border-[#a35d6a] bg-rose-50/20 shadow-sm' : 'border-gray-100 hover:border-rose-100 hover:bg-rose-50/10'
                        }`}
                      >
                        <div>
                          <p className="text-[11px] font-bold text-[#2d1b2d]">{anim.label}</p>
                          <p className="text-[9px] text-gray-400">{anim.desc}</p>
                        </div>
                        {isActive && <Check className="text-[#a35d6a]" size={14} strokeWidth={3} />}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
