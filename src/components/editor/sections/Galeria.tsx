'use client';

import React, { useState, useRef } from 'react';
import { useEditor } from '@/context/EditorContext';
import { supabase } from '@/lib/supabase-browser';
import { 
  Camera, 
  Plus, 
  Trash2, 
  Loader2, 
  Image as ImageIcon,
  UploadCloud,
  X,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Galeria() {
  const { eventData, updateField } = useEditor();
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  
  const galleryUrls = eventData.gallery_urls || [];
  const coverImageUrl = eventData.cover_image_url || '';

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('eventData.id:', eventData.id);
    console.log('eventData.user_id:', eventData.user_id);
    if (!file || !eventData.id) return;

    setIsUploadingCover(true);
    try {
      const userId = eventData.user_id || 'anonymous';
      const fileExt = file.name.split('.').pop();
      const filePath = `covers/${userId}/${eventData.id}/cover.${fileExt}`;

      // Upload with upsert: true to replace existing
      const { error: uploadError } = await supabase.storage
        .from('covers')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('covers')
        .getPublicUrl(filePath);

      // Force refresh by adding timestamp if needed, or just update
      updateField('cover_image_url', `${publicUrl}?t=${Date.now()}`);
    } catch (error) {
      console.error('Error al subir portada:', error);
      alert('Error al subir la imagen de portada. Verifica que el bucket "covers" exista.');
    } finally {
      setIsUploadingCover(false);
      if (coverFileInputRef.current) coverFileInputRef.current.value = '';
    }
  };

  const removeCover = async () => {
    updateField('cover_image_url', '');
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log('eventData.id:', eventData.id);
    console.log('eventData.user_id:', eventData.user_id);
    if (!files || files.length === 0 || !eventData.id) return;

    if (galleryUrls.length + files.length > 10) {
      alert('Puedes subir hasta 10 fotos en total.');
      return;
    }

    setIsUploadingGallery(true);
    const newUrls: string[] = [...galleryUrls];

    try {
      const userId = eventData.user_id || 'anonymous';
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const timestamp = Date.now();
        const fileName = `${timestamp}_${i}.${fileExt}`;
        const filePath = `gallery/${userId}/${eventData.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('gallery')
          .getPublicUrl(filePath);

        newUrls.push(publicUrl);
      }

      updateField('gallery_urls', newUrls);
    } catch (error) {
      console.error('Error al subir fotos:', error);
      alert('Hubo un error al subir algunas imágenes. Verifica que el bucket "gallery" exista.');
    } finally {
      setIsUploadingGallery(false);
      if (galleryFileInputRef.current) galleryFileInputRef.current.value = '';
    }
  };

  const removeGalleryImage = (url: string) => {
    const newUrls = galleryUrls.filter(u => u !== url);
    updateField('gallery_urls', newUrls);
  };

  return (
    <div className="space-y-12">
      {/* SECCIÓN PORTADA */}
      <div className="space-y-4">
        <label className="text-[11px] font-black text-[#a35d6a]/60 uppercase tracking-[0.2em] flex items-center gap-2">
          Imagen de Portada (Hero principal)
        </label>
        
        <div className="relative aspect-[16/9] w-full rounded-[2rem] overflow-hidden border-2 border-dashed border-rose-100 bg-rose-50/30 group">
          {coverImageUrl ? (
            <>
              <img 
                src={coverImageUrl} 
                className="w-full h-full object-cover"
                alt="Portada"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={() => coverFileInputRef.current?.click()}
                  className="px-4 py-2 bg-white text-[#a35d6a] rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                >
                  Cambiar
                </button>
                <button
                  onClick={removeCover}
                  className="p-2 bg-red-500 text-white rounded-xl hover:scale-105 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </>
          ) : (
            <div 
              onClick={() => coverFileInputRef.current?.click()}
              className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-rose-50 transition-colors"
            >
              {isUploadingCover ? (
                <Loader2 size={32} className="animate-spin text-[#a35d6a]/40" />
              ) : (
                <>
                  <Upload size={32} className="text-[#a35d6a]/20 mb-3" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#a35d6a]/40">Click para subir portada</p>
                </>
              )}
            </div>
          )}
          <input 
            type="file" 
            className="hidden" 
            ref={coverFileInputRef} 
            accept="image/*"
            onChange={handleCoverUpload}
          />
        </div>
      </div>

      {/* SECCIÓN GALERÍA */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-black text-[#a35d6a]/60 uppercase tracking-[0.2em] flex items-center gap-2">
            Galería de Fotos ({galleryUrls.length}/10)
          </label>
          
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            ref={galleryFileInputRef}
            onChange={handleGalleryUpload}
          />
          
          <button
            onClick={() => galleryFileInputRef.current?.click()}
            disabled={isUploadingGallery || galleryUrls.length >= 10}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#a35d6a] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-200 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
          >
            {isUploadingGallery ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            Subir Fotos
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <AnimatePresence>
            {galleryUrls.map((url, index) => (
              <motion.div
                key={url}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative aspect-square rounded-[2rem] overflow-hidden group border border-rose-100 bg-gray-50 shadow-sm"
              >
                <img 
                  src={url} 
                  alt={`Gallery ${index}`} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => removeGalleryImage(url)}
                    className="w-10 h-10 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {galleryUrls.length === 0 && !isUploadingGallery && (
            <div className="col-span-full py-20 border-2 border-dashed border-rose-100 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-rose-200">
              <div className="w-16 h-16 bg-rose-50 rounded-3xl flex items-center justify-center">
                <ImageIcon size={32} />
              </div>
              <div className="text-center">
                <p className="text-xs font-black uppercase tracking-widest text-[#a35d6a]/40">No hay fotos</p>
                <p className="text-[10px] font-bold mt-1">Comparte tus mejores momentos.</p>
              </div>
            </div>
          )}

          {isUploadingGallery && (
            <div className="aspect-square rounded-[2rem] border-2 border-dashed border-rose-200 bg-rose-50/30 flex flex-col items-center justify-center gap-2 animate-pulse">
              <Loader2 size={24} className="animate-spin text-[#a35d6a]" />
              <span className="text-[9px] font-black uppercase text-[#a35d6a]/60">Subiendo...</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-rose-50/50 p-4 rounded-2xl flex items-start gap-3 border border-rose-100/50">
        <UploadCloud className="text-[#a35d6a]/40 mt-0.5" size={18} />
        <div className="space-y-1">
          <h5 className="text-[10px] font-black uppercase text-[#a35d6a] tracking-widest">Recomendaciones</h5>
          <p className="text-[10px] text-[#7a5060] font-medium leading-relaxed">
            Portada: Imagen horizontal recomendada. <br/>
            Galería: Hasta 10 imágenes.
          </p>
        </div>
      </div>
    </div>
  );
}
