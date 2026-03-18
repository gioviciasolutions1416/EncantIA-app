'use client';

import { useState, ReactNode, useEffect, useRef } from 'react';
import { useEditor } from '@/context/EditorContext';
import { 
  Settings, Users, MessageSquare, Calendar, Shirt, 
  Clock, Gift, Image as ImageIcon, Hotel, CheckCircle2, 
  PenTool, Music, BarChart3, Share2, Lock, X, Eye, Phone, Palette, Sparkles, Grid, Pencil
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { injectData } from '@/lib/template-injector';
import DesignPanel from './DesignPanel';
import { SECCIONES_POR_EVENTO } from '@/config/event-sections';

const MOBILE_TABS = [
  { id: 'evento', label: 'Evento', icon: Calendar, sections: ['configuracion', 'fecha_lugar'] },
  { id: 'personas', label: 'Personas', icon: Users, sections: ['protagonistas', 'vestimenta'] },
  { id: 'detalles', label: 'Detalles', icon: Sparkles, sections: ['mensajes', 'itinerario', 'regalos', 'fecha_lugar'] },
  { id: 'fotos', label: 'Fotos', icon: ImageIcon, sections: ['galeria'] },
  { id: 'mas', label: 'Más', icon: Grid, sections: ['confirmacion', 'hospedaje', 'musica', 'firmas', 'encuesta', 'distribucion'] },
];

const SECTIONS = [
  { id: 'configuracion', icon: Settings, label: 'Configuración', plan: 'prueba' },
  { id: 'protagonistas', icon: Users, label: 'Protagonistas', plan: 'prueba' },
  { id: 'mensajes', icon: MessageSquare, label: 'Mensajes', plan: 'prueba' },
  { id: 'fecha_lugar', icon: Calendar, label: 'Fecha y Lugar', plan: 'plata' },
  { id: 'vestimenta', icon: Shirt, label: 'Vestimenta', plan: 'plata' },
  { id: 'distribucion', icon: Share2, label: 'Distribución', plan: 'plata' },
  { id: 'itinerario', icon: Clock, label: 'Itinerario', plan: 'oro' },
  { id: 'galeria', icon: ImageIcon, label: 'Galería', plan: 'oro' },
  { id: 'confirmacion', icon: CheckCircle2, label: 'RSVP', plan: 'oro' },
  { id: 'regalos', icon: Gift, label: 'Regalos', plan: 'diamante' },
  { id: 'hospedaje', icon: Hotel, label: 'Hospedaje', plan: 'diamante' },
  { id: 'musica', icon: Music, label: 'Música', plan: 'diamante' },
  { id: 'firmas', icon: PenTool, label: 'Firmas', plan: 'diamante' },
  { id: 'encuesta', icon: BarChart3, label: 'Encuesta', plan: 'diamante' },
];

const PLAN_HIERARCHY = {
  prueba: 0,
  plata: 1,
  oro: 2,
  diamante: 3,
};

interface EditorShellProps {
  children: ReactNode;
}

export default function EditorShell({ children }: EditorShellProps) {
  const { activeSection, setActiveSection, eventData, showMobilePreview, setShowMobilePreview, showDesignPanel, setShowDesignPanel, effectivePlan, profile } = useEditor();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [activeTabDrawer, setActiveTabDrawer] = useState<string | null>(null);

  const tipoKey = eventData.event_type
    ?.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_')
    .replace('anos', 'anos') || 'boda';
  
  const config = SECCIONES_POR_EVENTO[tipoKey] 
    || SECCIONES_POR_EVENTO['boda'];

  const ALWAYS_SHOW = ['configuracion', 'protagonistas', 'mensajes', 'fecha_lugar', 'distribucion', 'confirmacion'];

  const filteredSections = SECTIONS.filter(section => {
    if (ALWAYS_SHOW.includes(section.id)) return true;
    return config[section.id] === true;
  }).map(section => {
    if (section.id === 'protagonistas' && config.protagonistas?.label) {
      return { ...section, label: config.protagonistas.label };
    }
    return section;
  });
  
  // ── PREVIEW CON postMessage ──
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const mobileIframeRef = useRef<HTMLIFrameElement>(null);
  
  // Cargamos el HTML inicial solo una vez o cuando cambia la plantilla
  const [initialHtml, setInitialHtml] = useState('');
  
  useEffect(() => {
    const html = injectData(eventData.template_id || 'boda_1', eventData);
    setInitialHtml(html);
  }, [eventData.template_id]);

  const eventDataStr = JSON.stringify(eventData);

  const sendDataToIframe = (iframeNode: HTMLIFrameElement | null) => {
    if (!iframeNode?.contentWindow) return;
    
    // Si el evento no tiene título ni fecha, no enviar nada
    // para que la plantilla muestre sus datos de ejemplo
    if (!eventData?.title && !eventData?.event_date) return;
    
    const data = { 
      type: 'UPDATE_DATA', 
      data: {
        ...eventData,
        firmas_enabled: eventData.signatures?.enabled ?? false
      } 
    };
    iframeNode.contentWindow.postMessage(data, '*');
    setTimeout(() => iframeNode?.contentWindow?.postMessage(data, '*'), 300);
    setTimeout(() => iframeNode?.contentWindow?.postMessage(data, '*'), 800);
  };

  useEffect(() => {
    if (!eventData?.title && !eventData?.event_date) return;
    const timer = setTimeout(() => {
      const msg = { 
        type: 'UPDATE_DATA', 
        data: {
          ...eventData,
          firmas_enabled: eventData.signatures?.enabled ?? false
        } 
      };
      iframeRef.current?.contentWindow?.postMessage(msg, '*');
      mobileIframeRef.current?.contentWindow?.postMessage(msg, '*');
    }, 500); 
    return () => clearTimeout(timer);
  }, [eventDataStr]);

  // ── SCROLL TO TOP ──
  const formRef = useRef<HTMLElement>(null);
  const lastSectionRef = useRef(activeSection);
  useEffect(() => {
    if (activeSection !== lastSectionRef.current) {
      if (formRef.current) {
        formRef.current.scrollTop = 0;
      }
      lastSectionRef.current = activeSection;
    }
  }, [activeSection]);

  const currentPlanLevel = PLAN_HIERARCHY[effectivePlan as keyof typeof PLAN_HIERARCHY] || 1;

  const isLocked = (plan: string) => {
    if (effectivePlan === 'diamante') return false;
    return PLAN_HIERARCHY[plan as keyof typeof PLAN_HIERARCHY] > currentPlanLevel;
  };

  return (
    <div className="flex-1 flex overflow-hidden relative">


      {/* ── SIDEBAR DESKTOP ── */}
      <aside className="hidden md:flex flex-col w-64 bg-white/70 backdrop-blur-md border-r overflow-y-auto" style={{ borderColor: '#f0dde3' }}>
        <nav className="p-4 space-y-1">
          <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Secciones</p>
          {filteredSections.map((section) => {
            const locked = isLocked(section.plan);
            const active = activeSection === section.id;
            
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                  active 
                    ? 'bg-rose-50 text-[#a35d6a] border-l-4 border-[#a35d6a] shadow-sm' 
                    : locked 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-[#7a5060]/70 hover:bg-rose-50/50 hover:shadow-[inset_0_0_20px_rgba(163,93,106,0.05)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <section.icon size={16} className={active ? 'text-[#a35d6a]' : locked ? 'text-gray-300' : 'text-[#7a5060]/50'} />
                  {section.label}
                </div>
                {locked && <Lock size={12} className="text-gray-300" />}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ── ÁREA DE FORMULARIO (CENTRO) ── */}
      <section 
        ref={formRef}
        className="flex-1 flex flex-col bg-gradient-to-b from-rose-50/30 to-white overflow-y-auto w-full md:max-w-xl lg:max-w-2xl mx-auto border-r pt-14 md:pt-0" 
        style={{ borderColor: '#f0dde3', height: 'calc(100vh - 64px)' }}
      >
        <div className="p-6 md:p-8 pb-32 md:pb-8">
          {(() => {
            const activeSectionObj = filteredSections.find(s => s.id === activeSection);
            const locked = activeSectionObj ? isLocked(activeSectionObj.plan) : false;
            const requiredPlanText = activeSectionObj?.plan === 'plata' ? 'Plata' : activeSectionObj?.plan === 'oro' ? 'Oro' : 'Diamante';

            return (
              <div className="relative">
                {children}
                {locked && (
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center rounded-3xl z-10 p-12 text-center">
                    <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mb-4 border border-rose-100 shadow-sm">
                      <Lock className="text-[#a35d6a]" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-[#2d1b2d] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Sección Bloqueada</h3>
                    <p className="text-xs text-gray-500 mb-6 max-w-sm">
                      Esta sección requiere el plan <strong className="text-[#a35d6a]">{requiredPlanText}</strong>.
                    </p>
                    <button 
                      onClick={() => setIsUpgradeModalOpen(true)}
                      className="bg-gradient-to-tr from-[#a35d6a] to-[#7B2D8B] text-white px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-rose-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      Mejorar Plan
                    </button>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
        
        <div className="h-24 md:hidden" />
      </section>

      {/* ── IFrame PREVIEW (DERECHA - DESKTOP) ── */}
      <section className="hidden lg:flex flex-[1.2] items-center justify-center p-8" style={{ background: 'radial-gradient(ellipse at center, #fce4ec 0%, #fdfafc 70%)' }}>
        <div className="relative w-full max-w-[400px] aspect-[9/18.5] bg-[#1a1a1a] rounded-[3rem] p-3 shadow-2xl border-4 border-[#2d1b2d]">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1a1a1a] rounded-b-2xl z-10" />
          
          <div className="w-full h-full bg-white rounded-[2.2rem] overflow-hidden relative">
              <iframe 
                ref={iframeRef}
                srcDoc={initialHtml}
                onLoad={() => sendDataToIframe(iframeRef.current)}
                sandbox="allow-scripts allow-same-origin allow-popups"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  border: 'none',
                  imageRendering: 'crisp-edges'
                }}
                title="Live Preview"
              />
          </div>
        </div>
      </section>

        {/* Barra navegación móvil style tabs native */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-rose-100 shadow-xl flex items-center justify-around px-2 py-2">
        {MOBILE_TABS.map((tab) => {
          const active = tab.sections.includes(activeSection) || activeTabDrawer === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.sections.length > 1) {
                  setActiveTabDrawer(activeTabDrawer === tab.id ? null : tab.id);
                } else if (tab.sections.length === 1) {
                  setActiveTabDrawer(null);
                  const available = filteredSections.find(s => s.id === tab.sections[0]);
                  if (available) setActiveSection(available.id);
                }
              }}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${
                active ? 'text-[#a35d6a]' : 'text-gray-400 hover:text-[#a35d6a]'
              }`}
            >
              <tab.icon size={20} strokeWidth={active ? 2.5 : 1.5} />
              <span className="text-[8px] font-black uppercase tracking-tight">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Drawer Dinámico para Tabs con Múltiples Secciones */}
      <AnimatePresence>
        {activeTabDrawer && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={() => setActiveTabDrawer(null)}
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden fixed bottom-14 left-0 right-0 bg-white rounded-t-3xl p-6 z-40 border-t border-rose-100 shadow-2xl max-h-[70vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black uppercase tracking-wider text-[#2d1b2d] flex items-center gap-2">
                  {(() => {
                    const currentTab = MOBILE_TABS.find(t => t.id === activeTabDrawer);
                    return currentTab ? (
                      <>
                        <currentTab.icon size={14} className="text-[#a35d6a]" /> Secciones: {currentTab.label}
                      </>
                    ) : 'Secciones';
                  })()}
                </span>
                <button onClick={() => setActiveTabDrawer(null)} className="p-1 hover:bg-rose-50 rounded-full text-gray-400"><X size={16} /></button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {filteredSections.filter(s => {
                  const currentTab = MOBILE_TABS.find(t => t.id === activeTabDrawer);
                  return currentTab ? currentTab.sections.includes(s.id) : false;
                }).map(section => {
                  const locked = isLocked(section.plan);
                  const active = activeSection === section.id;
                  const requiredPlanText = section.plan === 'basico' ? 'Plata' : section.plan === 'rsvp' ? 'Oro' : 'Diamante';
                  return (
                    <button
                      key={section.id}
                      disabled={locked}
                      onClick={() => { setActiveSection(section.id); setActiveTabDrawer(null); }}
                      className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                        active ? 'border-[#a35d6a] bg-rose-50/40 shadow-sm' : 'border-gray-100 hover:border-rose-100'
                      } ${locked ? 'opacity-50 cursor-not-allowed bg-gray-50/50' : 'hover:shadow-sm'}`}
                    >
                      <section.icon size={16} className={active ? 'text-[#a35d6a]' : locked ? 'text-gray-300' : 'text-[#a35d6a]/70'} />
                      <div className="text-left">
                        <p className={`text-[10px] font-bold uppercase tracking-tight ${active ? 'text-[#a35d6a]' : 'text-gray-600'}`}>{section.label}</p>
                        {locked && <span className="text-[7px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded-full">{requiredPlanText}</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── MOBILE PREVIEW OVERLAY ── */}
      <AnimatePresence>
        {showMobilePreview && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-white flex flex-col"
          >
            <div className="h-14 px-4 flex items-center justify-between border-b" 
              style={{ borderColor: '#f0dde3' }}>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-[#a35d6a]" />
                <span className="text-xs font-black uppercase tracking-tight" 
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                  Vista Previa
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowMobilePreview(false)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-tr from-[#a35d6a] to-[#7B2D8B] text-white rounded-xl text-[10px] font-black uppercase tracking-widest"
                >
                  <Pencil size={12} /> Editar
                </button>
                <button 
                  onClick={() => setShowMobilePreview(false)}
                  className="p-2 hover:bg-rose-50 rounded-full text-gray-400"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-[#1a1a1a] p-2">
               <div className="w-full h-full rounded-2xl overflow-hidden bg-white">
                 <iframe 
                    ref={mobileIframeRef}
                    srcDoc={initialHtml}
                    onLoad={() => sendDataToIframe(mobileIframeRef.current)}
                    className="w-full h-full border-none"
                    title="Mobile Live Preview"
                 />
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón Personalizar (Desktop) */}
      <button
        onClick={() => setShowDesignPanel(true)}
        className="hidden lg:flex fixed bottom-6 right-6 z-50 items-center gap-2 px-5 py-3 bg-gradient-to-tr from-[#a35d6a] to-[#7B2D8B] text-white rounded-2xl shadow-xl shadow-rose-300 hover:scale-105 transition-all text-[11px] font-black uppercase tracking-widest"
      >
        <Palette size={16} /> Personalizar
      </button>

      <DesignPanel isOpen={showDesignPanel} onClose={() => setShowDesignPanel(false)} />

      <AnimatePresence>
        {isUpgradeModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsUpgradeModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative z-10 border border-rose-100 text-center">
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4"><Lock className="text-[#a35d6a]" size={24} /></div>
              <h3 className="text-lg font-black text-[#2d1b2d] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Mejorar tu plan</h3>
              <p className="text-xs text-[#a35d6a]/70 mb-6 font-bold">Contacta a soporte para mejorar tu plan</p>
              <a href={`https://wa.me/521234567890?text=${encodeURIComponent('Hola, me gustaría mejorar mi plan para mi invitación ID: ' + eventData.slug)}`} target="_blank" className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg active:shadow-md"><Phone size={14} /> WhatsApp Soporte</a>
              <button onClick={() => setIsUpgradeModalOpen(false)} className="w-full py-2.5 mt-2 rounded-xl text-[11px] font-bold text-gray-400 hover:bg-gray-50 transition-colors">Cerrar</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
