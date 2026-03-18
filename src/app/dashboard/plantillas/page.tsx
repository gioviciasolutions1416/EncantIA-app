'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { injectData } from '@/lib/template-injector';
import { TEMPLATE_HTML_MAP } from '@/templates';
import { supabase } from '@/lib/supabase-browser';
import { toast } from 'sonner';
import { Loader2, Eye, Check, X, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TABS = [
  { id: 'boda', label: 'Boda' }
];

const PLANTILLAS = [
  {
    id: 'boda_bellabestia',
    name: 'La Bella y la Bestia',
    type: 'boda',
    plan: 'Plata',
    thumbnail: null,
  },
  {
    id: 'boda_clasica',
    name: 'Clásica Romántica',
    type: 'boda',
    plan: 'Plata',
    thumbnail: null,
  },
  {
    id: 'boda_editorial',
    name: 'Editorial Dorado',
    type: 'boda',
    plan: 'Oro',
    thumbnail: null,
  },
  {
    id: 'boda_etereo',
    name: 'Etéreo & Lavanda',
    type: 'boda',
    plan: 'Oro',
    thumbnail: null,
  },
  {
    id: 'boda_fineart',
    name: 'Fine Art Verde Té',
    type: 'boda',
    plan: 'Diamante',
    thumbnail: null,
  },
];

const MOCK_EVENT_DATA = {
  title: 'Giovanna & Victor',
  event_type: 'Boda',
  event_date: '2026-10-24',
  event_time: '17:00 HRS',
  venue: 'Parroquia de San Miguel Arcángel',
  venue_address: 'Plaza Principal S/N, Centro, San Miguel de Allende',
  message: 'En el jardín de la vida, nuestro amor es la flor más bella.',
  message_secondary: 'San Miguel de Allende, México',
  dress_code: 'Formal de Etiqueta',
  dress_code_women: 'Vestido largo de gala. Se reservan los colores blanco y champagne.',
  dress_code_men: 'Smoking o traje formal oscuro.',
  dress_code_detail: 'Tu presencia es nuestro mejor regalo, luce espectacular.',
  cover_image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400',
  is_published: true,
  plan: 'diamante',
  slug: 'demo-view',
  parents_bride_mother: 'Sra. Elena María Rodríguez',
  parents_bride_father: 'Sr. Roberto Carlos Gallegos',
  parents_groom_mother: 'Sra. Beatriz Adriana Torres',
  parents_groom_father: 'Sr. Victor Manuel Espinoza',
  padrinos_list: [
    { rol: 'Padrinos de Velación', nombre: 'Luis Miguel & Aracely Arámbula' },
    { rol: 'Padrinos de Anillos', nombre: 'Carlos Rivera & Cynthia Rodríguez' },
  ],
  segunda_sede_json: {
    lugar: 'Hacienda San José Lavista',
    direccion: 'Km 10.2 Carretera a Dolores Hidalgo, San Miguel de Allende',
    hora: '19:30 HRS',
    location_url: 'https://maps.google.com',
  },
  location_url: 'https://maps.google.com',
  gallery_urls: [
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800',
    'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?auto=format&fit=crop&w=800',
  ],
  itinerary_items: [
    { hora: '17:00', icono: '⛪', titulo: 'Ceremonia Religiosa', descripcion: 'El momento del Sí, acepto.' },
    { hora: '18:30', icono: '🥂', titulo: 'Cóctel de Bienvenida', descripcion: 'Bebidas de autor y canapés finos.' },
    { hora: '20:00', icono: '🍽️', titulo: 'Banquete de Gala', descripcion: 'Cena formal de tres tiempos.' },
    { hora: '21:30', icono: '💃', titulo: 'Primer Baile', descripcion: 'Nuestra primera pieza como esposos.' },
    { hora: '22:00', icono: '🎉', titulo: 'After Party', descripcion: 'DJ Set & Open Bar hasta el amanecer.' },
  ],
  rsvp_config: {
    confFechaLimite: '15 de Septiembre, 2026',
    confHabilitada: true,
    phone: '5215512345678',
  },
  gift_message: 'Tu presencia es nuestro mejor regalo. Si deseas obsequiarnos algo, aquí nuestra lista.',
  regalos_list: [
    { nombre: 'Liverpool', url: 'https://mesaderegalos.liverpool.com.mx' },
    { nombre: 'Amazon', url: 'https://www.amazon.com.mx' },
  ],
  adults_only: false,
  is_bilingual: false,
  sections_styles: {
    color_primary: null,
    color_secondary: null,
    color_bg: null,
    font_titulos: null,
    font_cuerpo: null,
    font_scale: '1',
    animaciones: 'suave',
  },
};

const MOCK_VARIANTS: Record<string, any> = {
  boda_bellabestia: {
    title: 'Giovanna & Victor',
    event_date: '2026-10-24',
    message: 'Como la rosa encantada que florece eternamente, nuestro amor nunca se marchitará.',
    message_secondary: 'Hacienda La Providencia, Estado de México',
    cover_image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400',
    dress_code: 'Gala',
  },
  boda_clasica: {
    title: 'Giovanna & Victor',
    event_date: '2026-10-24',
    message: 'Nuestra historia mágica comienza con un sí eterno.',
    message_secondary: 'San Miguel de Allende, México',
    cover_image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400',
    dress_code: 'Formal',
  },
  boda_editorial: {
    title: 'Giovanna & Victor',
    event_date: '2026-10-24',
    message: 'En la profundidad del bosque y bajo el destello de mil luces, comenzamos nuestro siempre.',
    message_secondary: 'Hacienda San José Lavista, Querétaro',
    cover_image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400',
    dress_code: 'Formal de Etiqueta',
  },
  boda_etereo: {
    title: 'Giovanna & Victor',
    event_date: '2026-10-24',
    message: 'Bajo el destello de mil velas y el aroma de las flores en flor, comenzamos nuestra eternidad.',
    message_secondary: 'Ex-Hacienda Santa Mónica, Tlalnepantla',
    cover_image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400',
    dress_code: 'Gala Etérea',
  },
  boda_fineart: {
    title: 'Giovanna & Victor',
    event_date: '2026-10-24',
    message: 'Cada momento a tu lado es una obra de arte pintada con amor eterno.',
    message_secondary: 'Parroquia de San José el Alto, Querétaro',
    cover_image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400',
    dress_code: 'Black Tie',
  },
};

export default function PlantillasPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('boda');
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [userEvents, setUserEvents] = useState<any[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from('events')
          .select('id, title')
          .eq('user_id', user.id);
        
        setUserEvents(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoadingEvents(false);
      }
    };
    fetchUserEvents();
  }, []);

  const handleUseTemplate = (template: any) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const createEvent = async (templateId: string) => {
    setActionLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Debes iniciar sesión para crear un evento');
        return;
      }

      const variantData = MOCK_VARIANTS[templateId] || {};
      const { data, error } = await supabase
        .from('events')
        .insert({
          user_id: user.id,
          title: variantData.title || ('Nuevo Evento ' + templateId),
          event_type: TABS.find(t => t.id === activeTab)?.label || 'Boda',
          template_id: templateId,
          slug: 'invitacion-' + Math.random().toString(36).substring(2, 7),
          plan: 'prueba', 
          event_date: variantData.event_date || new Date(Date.now() + 60*24*60*60*1000).toISOString().split('T')[0],
          message: variantData.message || '',
          message_secondary: variantData.message_secondary || '',
          cover_image_url: variantData.cover_image_url || '',
          dress_code: variantData.dress_code || ''
        })
        .select()
        .single();
      
      if (error) throw error;
      toast.success('¡Evento creado exitosamente! Redirigiendo...');
      router.push(`/editor/${data.id}`);

    } catch (e: any) {
      toast.error('Error al crear el evento: ' + e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const applyToExisting = async (eventId: string, templateId: string) => {
    setActionLoading(true);
    try {
      const template = PLANTILLAS.find(p => p.id === templateId);
      const { error } = await supabase
        .from('events')
        .update({ 
          template_id: templateId,
          event_type: template?.type === 'boda' ? 'Boda' : 'XV Años'
        })
        .eq('id', eventId);
      
      if (error) throw error;
      toast.success('¡Plantilla aplicada! Redirigiendo...');
      router.push(`/editor/${eventId}`);
    } catch (e: any) {
      toast.error('Error al aplicar plantilla: ' + e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredPlantillas = PLANTILLAS.filter(p => p.type === activeTab);

  return (
    <div className="min-h-screen bg-[#fdfafc] p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/dashboard')} className="p-2 hover:bg-rose-50 rounded-full text-[#a35d6a]">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-[#2d1b2d]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Nuestras Plantillas
            </h1>
            <p className="text-[#a35d6a]/60 text-xs uppercase tracking-widest mt-1">Elegantes diseños para tu gran día</p>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-2 bg-rose-50/50 p-2 rounded-2xl border border-rose-100/50 overflow-x-auto no-scrollbar">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-tr from-[#a35d6a] to-[#7B2D8B] text-white shadow-md' 
                  : 'text-[#a35d6a]/60 hover:text-[#a35d6a] hover:bg-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* GRID PLANTILLAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPlantillas.map(tpl => (
            <div key={tpl.id} className="bg-white rounded-[2.5rem] border border-rose-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-500">
              
              {/* iframe Container */}
              <div className="flex justify-center pt-6 px-4 bg-transparent">
                <div style={{ width: '280px', height: '400px', overflow: 'hidden', borderRadius: '24px', position: 'relative', boxShadow: '0 10px 30px rgba(163,93,106,0.1)' }} className="group-hover:shadow-2xl transition-shadow duration-300">
                  <iframe 
                    srcDoc={(TEMPLATE_HTML_MAP[tpl.id] || '').replace('</style>', '\n.fade-in { opacity: 1 !important; transform: none !important; }\n</style>')}
                    style={{
                      width: '1200px',
                      height: '1716px', 
                      transform: 'scale(0.233)',
                      transformOrigin: 'top left',
                      pointerEvents: 'none',
                      border: 'none',
                    }}
                    title={tpl.name}
                    scrolling="no"

                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 z-20 group-hover:via-transparent group-hover:to-black/10 transition-all pointer-events-none" />
                  
                  {/* Float Action buttons overlay */}
                  <div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 backdrop-blur-[1px]">
                    <button 
                      onClick={() => setPreviewId(tpl.id)}
                      className="p-4 bg-white rounded-full shadow-xl text-[#a35d6a] hover:scale-110 active:scale-95 transition-transform"
                      title="Ver Vista Previa"
                    >
                      <Eye size={22} />
                    </button>
                  </div>
                </div>
              </div>

              {/* CARD FOOTER */}
              <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-[#2d1b2d]">{tpl.name}</h3>
                    <span className="px-2 py-1 bg-rose-50 text-[9px] font-black uppercase tracking-widest rounded-lg text-[#a35d6a] border border-rose-100">
                      {tpl.plan}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => setPreviewId(tpl.id)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-[#f0dde3] text-[10px] font-black uppercase tracking-widest text-[#a35d6a] hover:bg-rose-50 transition-all shadow-sm active:scale-95"
                  >
                    Ver Preview
                  </button>
                  <button 
                    onClick={() => handleUseTemplate(tpl)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-tr from-[#a35d6a] to-[#7B2D8B] text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-200/50 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Usar esta Plantilla
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* MODAL PREVIEW GRANDE */}
      <AnimatePresence>
        {previewId && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 lg:p-10"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white w-full max-w-lg lg:max-w-xl aspect-[9/16] rounded-[32px] overflow-hidden shadow-2xl relative flex flex-col"
            >
              <div className="absolute top-4 right-4 z-10">
                <button onClick={() => setPreviewId(null)} className="p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors">
                  <X size={18} fill="currentColor" />
                </button>
              </div>

              <div className="flex-1 w-full h-full">
                <iframe 
                  srcDoc={injectData(previewId, { ...MOCK_EVENT_DATA, ...MOCK_VARIANTS[previewId], event_type: TABS.find(t => t.id === activeTab)?.label || 'Boda' } as any).replace('</style>', '\n@media (max-width: 900px) { .hero { flex-direction: row !important; height: 100vh !important; overflow: hidden !important; } .hero-img-container { width: 60% !important; height: 100% !important; top: 0 !important; position: absolute !important; right: 0 !important; clip-path: polygon(15% 0, 100% 0, 100% 100%, 0% 100%) !important; } .hero-content { width: 50% !important; text-align: left !important; } }\n</style>')}
                  className="w-full h-full border-none"
                  title="Preview"
                  onLoad={(e) => {
                    const iframe = e.currentTarget;
                    const variantData = previewId ? MOCK_VARIANTS[previewId] : {};
                    const data = { 
                      type: 'UPDATE_DATA', 
                      data: { 
                        ...MOCK_EVENT_DATA, 
                        ...variantData,
                        event_type: TABS.find(t => t.id === activeTab)?.label || 'Boda' 
                      } 
                    };
                    iframe.contentWindow?.postMessage(data, '*');
                    setTimeout(() => iframe.contentWindow?.postMessage(data, '*'), 300);
                    setTimeout(() => iframe.contentWindow?.postMessage(data, '*'), 800);
                  }}
                />
              </div>

              <div className="p-5 border-t border-gray-100 bg-white shadow-inner flex shrink-0">
                <button 
                  onClick={() => {
                    setPreviewId(null);
                    handleUseTemplate(PLANTILLAS.find(p => p.id === previewId));
                  }}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-tr from-[#a35d6a] to-[#7B2D8B] text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-100"
                >
                  <Check size={16} /> Usar esta Plantilla
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL ELEGIR EVENTO */}
      <AnimatePresence>
        {isModalOpen && selectedTemplate && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-md rounded-[2.5rem] p-6 lg:p-8 flex flex-col gap-5 shadow-2xl"
            >
              <div className="text-center">
                <h3 className="text-xl font-black text-[#2d1b2d]" style={{ fontFamily: "'Playfair Display', serif" }}>¿Dónde aplicar esta plantilla?</h3>
                <p className="text-xs text-gray-400 mt-1">Selecciona una opción para continuar</p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => createEvent(selectedTemplate.id)}
                  disabled={actionLoading}
                  className="w-full py-4 rounded-2xl bg-rose-50 text-[#a35d6a] font-black text-xs uppercase tracking-widest hover:bg-rose-100 transition-colors flex items-center justify-center gap-2"
                >
                  {actionLoading ? <Loader2 className="animate-spin" size={16} /> : 'Crear nuevo evento'}
                </button>

                <div className="relative flex items-center justify-center py-2">
                  <div className="absolute inset-x-0 h-px bg-gray-100" />
                  <span className="relative z-10 px-3 bg-white text-[10px] font-bold text-gray-300">O aplicar a existente</span>
                </div>

                <div className="max-h-40 overflow-y-auto space-y-2 border p-2 rounded-2xl border-gray-100 no-scrollbar">
                  {userEvents.map(event => (
                    <button
                      key={event.id}
                      disabled={actionLoading}
                      onClick={() => applyToExisting(event.id, selectedTemplate.id)}
                      className="w-full p-4 rounded-xl border border-rose-50 hover:bg-rose-50/40 text-left text-xs font-bold text-[#2d1b2d] flex items-center justify-between transition-colors"
                    >
                      <span className="truncate max-w-[200px]">{event.title || 'Sin Título'}</span>
                      <span className="text-[9px] text-gray-300 font-normal">Aplicar</span>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-full py-3 rounded-2xl bg-[#a35d6a] text-white font-bold text-xs uppercase tracking-widest text-center"
              >
                Cancelar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
