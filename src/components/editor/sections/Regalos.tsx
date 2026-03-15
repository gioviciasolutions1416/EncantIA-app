'use client';

import React from 'react';
import { useEditor } from '@/context/EditorContext';
import { 
  Gift, 
  Plus, 
  Trash2, 
  ExternalLink, 
  ShoppingBag,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Regalos() {
  const { eventData, updateField } = useEditor();
  
  const isEnabled = eventData.gift_registry_enabled ?? true;
  const config = eventData.gift_registry_config || {
    message: 'Nuestra mayor alegría es contar con su presencia, pero si desean tener un detalle con nosotros, estas son nuestras sugerencias.',
    links: [
      { name: 'Mesa de Regalos Amazon', url: '' },
      { name: 'Mesa de Regalos Liverpool', url: '' }
    ]
  };

  const updateConfig = (field: string, value: any) => {
    updateField('gift_registry_config', {
      ...config,
      [field]: value
    });
  };

  const addLink = () => {
    const links = [...(config.links || [])];
    links.push({ name: '', url: '' });
    updateConfig('links', links);
  };

  const removeLink = (index: number) => {
    const links = config.links.filter((_: any, i: number) => i !== index);
    updateConfig('links', links);
  };

  const updateLink = (index: number, field: string, value: string) => {
    const links = [...config.links];
    links[index] = { ...links[index], [field]: value };
    updateConfig('links', links);
  };

  return (
    <div className="space-y-10">
      {/* ── TOGGLE SECCIÓN ── */}
      <section className="bg-gradient-to-br from-white to-rose-50/30 border border-rose-100 p-6 rounded-[2.5rem] shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-black text-[#a35d6a] uppercase tracking-widest flex items-center gap-2">
              <Gift size={16} /> Mostrar Mesa de Regalos
            </label>
            <p className="text-[10px] text-gray-400 font-medium max-w-[280px]">
              Muestra a tus invitados tus sugerencias de regalos o información bancaria.
            </p>
          </div>
          
          <button
            onClick={() => updateField('gift_registry_enabled', !isEnabled)}
            className={`w-14 h-7 rounded-full transition-all relative ${
              isEnabled ? 'bg-[#a35d6a] shadow-inner' : 'bg-gray-200'
            }`}
          >
            <motion.div 
              animate={{ x: isEnabled ? 30 : 2 }}
              className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center"
            >
              {isEnabled && <div className="w-1 h-1 bg-[#a35d6a] rounded-full" />}
            </motion.div>
          </button>
        </div>
      </section>

      <AnimatePresence>
        {isEnabled && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-8"
          >
            {/* ── MENSAJE PERSONALIZADO ── */}
            <section className="space-y-4">
              <label className="text-[11px] font-black text-[#a35d6a]/60 uppercase tracking-[0.2em] flex items-center gap-2">
                Mensaje de Agradecimiento
              </label>
              <div className="bg-white border border-rose-100 p-5 rounded-[2rem] shadow-sm">
                <textarea
                  value={config.message || ''}
                  onChange={(e) => updateConfig('message', e.target.value)}
                  placeholder="Ej: Su presencia es nuestro mejor regalo..."
                  rows={3}
                  className="w-full bg-transparent border-none focus:ring-0 text-xs font-bold text-[#7a5060] placeholder:text-rose-200 resize-none"
                />
              </div>
            </section>

            {/* ── LISTA DE TIENDAS / LINKS ── */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-black text-[#a35d6a]/60 uppercase tracking-[0.2em] flex items-center gap-2">
                  <ShoppingBag size={14} /> Tiendas y Enlaces
                </label>
                <button
                  onClick={addLink}
                  className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 text-[#a35d6a] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-colors"
                >
                  <Plus size={14} /> Agregar
                </button>
              </div>

              <div className="space-y-3">
                {config.links.map((link: any, index: number) => (
                  <motion.div
                    key={index}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white border border-rose-100 p-4 rounded-3xl shadow-sm space-y-3 group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={link.name}
                        onChange={(e) => updateLink(index, 'name', e.target.value)}
                        placeholder="Nombre de la tienda (ej: Amazon)"
                        className="flex-1 bg-[#fdfafc] border-none focus:ring-1 focus:ring-rose-100 rounded-lg p-2 text-xs font-black text-[#2d1b2d]"
                      />
                      <button
                        onClick={() => removeLink(index)}
                        className="p-2 text-rose-200 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 text-[#a35d6a]/30">
                        <ExternalLink size={14} />
                      </div>
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => updateLink(index, 'url', e.target.value)}
                        placeholder="https://..."
                        className="flex-1 bg-transparent border-b border-rose-50 p-2 text-[11px] font-medium text-gray-500 focus:border-[#a35d6a] outline-none transition-colors"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* ── NOTA INFO ── */}
            <div className="bg-blue-50/30 p-4 rounded-2xl flex items-start gap-3 border border-blue-100/50">
              <Info className="text-blue-400 mt-0.5" size={18} />
              <div className="space-y-1">
                <h5 className="text-[10px] font-black uppercase text-blue-500 tracking-widest">Sugerencia</h5>
                <p className="text-[10px] text-blue-700/70 font-medium leading-relaxed">
                  Si prefieres "Lluvia de Sobres", puedes indicarlo en el mensaje de agradecimiento y dejar los enlaces vacíos.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
