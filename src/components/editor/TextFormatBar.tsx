'use client';

import { useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FONTS = [
  { id: 'Playfair Display', label: 'Playfair' },
  { id: 'Parisienne', label: 'Parisienne' },
  { id: 'Montserrat', label: 'Montserrat' },
  { id: 'Great Vibes', label: 'Great Vibes' },
  { id: 'Cormorant Garamond', label: 'Cormorant' },
  { id: 'Dancing Script', label: 'Dancing' },
];

const SIZES = ['xs', 'sm', 'base', 'lg', 'xl', '2xl'];
const SIZE_LABELS = ['XS', 'S', 'M', 'L', 'XL', '2X'];

const COLORS = [
  { id: 'primary', label: 'Principal', value: 'var(--color-primary)' },
  { id: 'secondary', label: 'Secundario', value: 'var(--color-secondary)' },
  { id: 'dark', label: 'Oscuro', value: '#2d1b2d' },
  { id: 'light', label: 'Claro', value: '#ffffff' },
  { id: 'gray', label: 'Gris', value: '#6b7280' },
];

const SPACING = [
  { id: 'tight', label: 'Compacto' },
  { id: 'normal', label: 'Normal' },
  { id: 'relaxed', label: 'Amplio' },
  { id: 'loose', label: 'Extra' },
];

const OPACITY = [60, 80, 100];

interface TextFormatBarProps {
  field: string;
}

export default function TextFormatBar({ field }: TextFormatBarProps) {
  const { eventData, updateField, effectivePlan } = useEditor();
  const [visible, setVisible] = useState(false);

  const planLevel = { prueba: 0, plata: 1, oro: 2, diamante: 3 };
  const currentLevel = planLevel[effectivePlan as keyof typeof planLevel] || 1;
  const canOro = currentLevel >= 2;
  const canDiamante = currentLevel >= 3;

  const styles = eventData.sections_styles?.fields?.[field] || {};

  const updateStyle = (key: string, value: any) => {
    const current = eventData.sections_styles || {};
    updateField('sections_styles', {
      ...current,
      fields: {
        ...(current.fields || {}),
        [field]: {
          ...(current.fields?.[field] || {}),
          [key]: value,
        },
      },
    });
  };

  const toggle = (key: string) => updateStyle(key, !styles[key]);

  const hasStyles = Object.keys(styles).length > 0;

  return (
    <div
      className="relative"
      onFocus={() => setVisible(true)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={(e) => {
        // Solo ocultar si el foco no está dentro
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setVisible(false);
        }
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setVisible(false);
        }
      }}
    >
      {/* Trigger — siempre visible pero muy sutil */}
      <div className={`flex items-center gap-1.5 mb-1.5 transition-opacity duration-300 ${visible || hasStyles ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}>
        <div className="flex-1 h-px bg-rose-100" />
        <button
          onClick={() => setVisible(!visible)}
          className="flex items-center gap-1 text-[9px] font-black text-[#a35d6a]/40 uppercase tracking-widest hover:text-[#a35d6a] transition-colors"
        >
          ✦ Formato
          <ChevronDown size={9} className={`transition-transform duration-200 ${visible ? 'rotate-180' : ''}`} />
        </button>
        <div className="flex-1 h-px bg-rose-100" />
      </div>

      {/* Panel de formato */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute z-20 top-full left-0 right-0 bg-white/95 backdrop-blur-sm border border-rose-100 rounded-2xl p-3 space-y-3 shadow-lg mt-1"
          >
            {/* Fila 1 — B I Alineación Tamaño (Plata) */}
            <div className="flex items-center gap-1 flex-wrap">
              <button
                onClick={() => toggle('bold')}
                className={`p-1.5 rounded-lg transition-all ${styles.bold ? 'bg-[#a35d6a] text-white shadow-sm' : 'bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-[#a35d6a]'}`}
                title="Negrita"
              >
                <Bold size={12} />
              </button>

              <button
                onClick={() => toggle('italic')}
                className={`p-1.5 rounded-lg transition-all ${styles.italic ? 'bg-[#a35d6a] text-white shadow-sm' : 'bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-[#a35d6a]'}`}
                title="Cursiva"
              >
                <Italic size={12} />
              </button>

              <div className="w-px h-4 bg-gray-100 mx-0.5" />

              {(['left', 'center', 'right'] as const).map((align, i) => {
                const Icon = [AlignLeft, AlignCenter, AlignRight][i];
                return (
                  <button
                    key={align}
                    onClick={() => updateStyle('align', align)}
                    className={`p-1.5 rounded-lg transition-all ${styles.align === align ? 'bg-[#a35d6a] text-white shadow-sm' : 'bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-[#a35d6a]'}`}
                  >
                    <Icon size={12} />
                  </button>
                );
              })}

              <div className="w-px h-4 bg-gray-100 mx-0.5" />

              {SIZES.map((size, i) => (
                <button
                  key={size}
                  onClick={() => updateStyle('size', size)}
                  className={`px-1.5 py-1 rounded-lg text-[9px] font-black transition-all ${styles.size === size ? 'bg-[#a35d6a] text-white shadow-sm' : 'bg-gray-50 text-gray-400 hover:bg-rose-50'}`}
                >
                  {SIZE_LABELS[i]}
                </button>
              ))}
            </div>

            {/* Fila 2 — Fuente (Oro) */}
            <div className={`space-y-1.5 ${!canOro ? 'opacity-40 pointer-events-none' : ''}`}>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Fuente</span>
                {!canOro && <span className="text-[8px] bg-amber-50 text-amber-500 font-black px-1.5 py-0.5 rounded-full">ORO</span>}
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {FONTS.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => updateStyle('font', font.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] transition-all border ${styles.font === font.id ? 'border-[#a35d6a] bg-rose-50 text-[#a35d6a] font-black' : 'border-gray-100 text-gray-500 hover:border-rose-100'}`}
                    style={{ fontFamily: `'${font.id}', serif` }}
                  >
                    {font.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Fila 3 — Avanzado (Diamante) */}
            <div className={`space-y-2 ${!canDiamante ? 'opacity-40 pointer-events-none' : ''}`}>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Avanzado</span>
                {!canDiamante && <span className="text-[8px] bg-purple-50 text-purple-500 font-black px-1.5 py-0.5 rounded-full">DIAMANTE</span>}
              </div>

              {/* Colores */}
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-gray-300 uppercase tracking-widest w-12">Color</span>
                <div className="flex gap-1.5">
                  {COLORS.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => updateStyle('color', color.value)}
                      title={color.label}
                      className={`w-5 h-5 rounded-full border-2 transition-all ${styles.color === color.value ? 'border-[#a35d6a] scale-110' : 'border-transparent hover:border-gray-300'}`}
                      style={{
                        background: color.value === 'var(--color-primary)'
                          ? '#a35d6a'
                          : color.value === 'var(--color-secondary)'
                          ? '#f0dde3'
                          : color.value
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Opacidad */}
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-gray-300 uppercase tracking-widest w-12">Opacidad</span>
                <div className="flex gap-1.5">
                  {OPACITY.map((op) => (
                    <button
                      key={op}
                      onClick={() => updateStyle('opacity', op)}
                      className={`px-2 py-0.5 rounded-lg text-[9px] font-black transition-all ${styles.opacity === op ? 'bg-[#a35d6a] text-white' : 'bg-gray-50 text-gray-400 hover:bg-rose-50'}`}
                    >
                      {op}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Espaciado */}
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-gray-300 uppercase tracking-widest w-12">Espacio</span>
                <div className="flex gap-1.5">
                  {SPACING.map((sp) => (
                    <button
                      key={sp.id}
                      onClick={() => updateStyle('spacing', sp.id)}
                      className={`px-2 py-0.5 rounded-lg text-[9px] font-black transition-all ${styles.spacing === sp.id ? 'bg-[#a35d6a] text-white' : 'bg-gray-50 text-gray-400 hover:bg-rose-50'}`}
                    >
                      {sp.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
