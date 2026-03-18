'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import PublishModal from '@/components/editor/PublishModal';
import { useParams, useRouter } from 'next/navigation';
import { EditorProvider, useEditor } from '@/context/EditorContext';
import { loadEvent, saveEvent } from '@/lib/editor-supabase';
import { useAutoSave } from '@/hooks/useAutoSave';
import { Loader2, ArrowLeft, Save, Globe, Palette, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EditorShell from '@/components/editor/EditorShell';
import Configuracion from '@/components/editor/sections/Configuracion';
import Protagonistas from '@/components/editor/sections/Protagonistas';
import Mensajes from '@/components/editor/sections/Mensajes';
import FechaLugar from '@/components/editor/sections/FechaLugar';
import Vestimenta from '@/components/editor/sections/Vestimenta';
import Itinerario from '@/components/editor/sections/Itinerario';
import Galeria from '@/components/editor/sections/Galeria';
import Confirmacion from '@/components/editor/sections/Confirmacion';
import Distribucion from '@/components/editor/sections/Distribucion';
import Regalos from '@/components/editor/sections/Regalos';
import Musica from '@/components/editor/sections/Musica';
import Firmas from '@/components/editor/sections/Firmas';
import Encuesta from '@/components/editor/sections/Encuesta';
import Hospedaje from '@/components/editor/sections/Hospedaje';

function EditorContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const {
    isLoading,
    setIsLoading,
    hydrate,
    eventData,
    setIsSaving,
    setLastSaved,
    isSaving,
    lastSaved,
    activeSection,
    updateField,
    setShowMobilePreview,
    setShowDesignPanel
  } = useEditor(); // Ahora usamos useEditor del contexto global
  console.log('EditorContent render:', { 
    activeSection, 
    title: eventData.title 
  });

  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // 1. Cargar datos iniciales desde Supabase
  useEffect(() => {
    if (!id) return;

    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const data = await loadEvent(id);
        if (data) {
          hydrate(data);
        } else {
          console.error('Evento no encontrado');
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error al cargar el evento:', error);
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [id]);

  // 2. Activar Auto-guardado (Debounce 1.5s)
  useAutoSave(id, eventData, setIsSaving, setLastSaved);

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'configuracion':
        return <Configuracion />;
      case 'protagonistas':
        return <Protagonistas />;
      case 'mensajes':
        return <Mensajes />;
      case 'fecha_lugar':
        return <FechaLugar />;
      case 'vestimenta':
        return <Vestimenta />;
      case 'itinerario':
        return <Itinerario />;
      case 'galeria':
        return <Galeria />;
      case 'confirmacion':
        return <Confirmacion />;
      case 'distribucion':
        return <Distribucion />;
      case 'regalos':
        return <Regalos />;
      case 'hospedaje':
        return <Hospedaje />;
      case 'musica':
        return <Musica />;
      case 'firmas':
        return <Firmas />;
      case 'encuesta':
        return <Encuesta />;
      default:
        return (
          <div className="bg-rose-50/30 border border-dashed border-rose-200 rounded-3xl p-12 text-center">
            <p className="text-[#a35d6a] text-sm italic">
              El formulario para la sección <strong>"{activeSection}"</strong> estará disponible en el siguiente paso.
            </p>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfafc]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <Loader2 className="animate-spin text-[#a35d6a]" size={48} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-[#7B2D8B] rounded-full" />
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-[#2d1b2d] font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
              Preparando tu editor
            </h2>
            <p className="text-[#a35d6a]/60 text-xs uppercase tracking-widest mt-1">
              Cargando invitaciones mágicas...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  const completionPercentage = (() => {
    let pct = 0;
    const d = eventData;
    if (d.title) pct += 15;
    if (d.event_date) pct += 15;
    if (d.venue) pct += 15;
    if (d.cover_image_url) pct += 15;
    if (d.message) pct += 10;
    if (d.template_id) pct += 10;
    if (d.parents_bride_father) pct += 10;
    if (d.gallery_urls && d.gallery_urls.length > 0) pct += 10;
    return pct;
  })();

  return (
    <div className="min-h-screen bg-[#fdfafc] flex flex-col overflow-hidden">
      {/* ── HEADER SUPERIOR ── */}
      <header className="h-16 bg-white/80 backdrop-blur-xl border-b px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm" style={{ borderColor: '#f0dde3' }}>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/dashboard')}
            className="p-2 hover:bg-rose-50 rounded-full transition-colors text-[#a35d6a]"
            title="Volver al dashboard"
          >
            <ArrowLeft size={20} />
          </button>
          <img src="/logo.png" className="h-7 w-auto object-contain hidden md:block" alt="EncantIA" />
          <div className="h-8 w-px bg-gray-100 hidden sm:block" />
          <div>
            <h1 className="text-sm font-black text-[#2d1b2d] uppercase tracking-tight truncate max-w-[120px] sm:max-w-md" style={{ fontFamily: "'Playfair Display', serif" }}>
              {eventData.title || 'Sin título'}
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#a35d6a]/60 uppercase tracking-widest">
                {eventData.event_type}
              </span>
              <div className="w-1 h-1 rounded-full bg-gray-300" />
              <AnimatePresence mode="wait">
                {isSaving ? (
                  <motion.span 
                    key="saving"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-[10px] font-bold text-amber-500 flex items-center gap-1 uppercase"
                  >
                    <Save size={10} className="animate-pulse" /> Guardando cambios...
                  </motion.span>
                ) : lastSaved ? (
                  <motion.span 
                    key="saved"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-[10px] font-bold text-green-500 uppercase flex items-center gap-1"
                  >
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500 }}
                      className="text-green-600 font-black text-xs"
                    >
                      ✓
                    </motion.span>
                    Guardado {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </motion.span>
                ) : (
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Sin cambios</span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden md:block text-[10px] font-black text-[#a35d6a]/70 uppercase tracking-tight">{completionPercentage}% lista</span>
          <div className="flex items-center gap-3">
          <Link 
            href={`/${eventData.slug}`} 
            target="_blank"
            className="hidden sm:flex items-center gap-2 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-[#7a5060] hover:bg-rose-50 rounded-xl transition-all border border-[#f0dde3]"
          >
            <Globe size={14} /> Ver pública
          </Link>
          <button
            onClick={() => setShowDesignPanel(true)}
            className="md:hidden p-2 rounded-xl bg-rose-50 text-[#a35d6a]"
          >
            <Palette size={16} />
          </button>
          <button
            onClick={() => setShowMobilePreview(true)}
            className="md:hidden p-2 rounded-xl bg-gradient-to-tr from-[#a35d6a] to-[#7B2D8B] text-white"
          >
            <Eye size={16} />
          </button>
          <button 
            onClick={() => {
              if (eventData.is_published) {
                if (confirm('¿Seguro que quieres despublicar tu invitación?')) {
                  updateField('is_published', false);
                  toast.success('Invitación despublicada');
                  saveEvent(id, { ...eventData, is_published: false });
                }
              } else {
                setIsPublishModalOpen(true);
              }
            }}
            className={`${
              eventData.is_published 
                ? 'bg-white border-2 border-rose-100 text-[#a35d6a]' 
                : 'bg-gradient-to-tr from-[#a35d6a] to-[#7B2D8B] text-white'
            } shadow-lg shadow-rose-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center font-black uppercase tracking-widest rounded-xl px-3 py-1.5 text-[9px] md:px-6 md:py-2 md:text-[11px]`}
          >
            {eventData.is_published ? 'Despublicar' : 'Publicar'}
          </button>
        </div>
        </div>

        {/* Barra de Progreso Header */}
        <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#a35d6a] to-[#7B2D8B] transition-all duration-500" style={{ width: `${completionPercentage}%` }} />
      </header>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <EditorShell>
        <div className="space-y-8">
          {/* Header de la sección activa */}
          <div className="mb-6">
            <h2 className="text-2xl font-black text-[#2d1b2d] capitalize" style={{ fontFamily: "'Playfair Display', serif" }}>
              {activeSection.replace('_', ' ')}
            </h2>
            <p className="text-[#a35d6a]/60 text-xs uppercase tracking-widest mt-1">
              Personaliza los detalles de tu evento
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderActiveSection()}
            </motion.div>
          </AnimatePresence>
        </div>
      </EditorShell>

      <PublishModal 
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onConfirm={() => {
          updateField('is_published', true);
          saveEvent(id, { ...eventData, is_published: true });
          setIsPublishModalOpen(false);
          toast.success('¡Tu invitación está publicada! ✨');
        }}
        eventData={eventData}
      />
    </div>
  );
}

export default function EditorPage() {
  return (
    <EditorProvider>
      <EditorContent />
    </EditorProvider>
  );
}
