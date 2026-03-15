'use client';

import React, { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';
import { EventData } from '@/lib/editor-supabase';

interface EditorContextType {
  // Estados
  activeSection: string;
  setActiveSection: (section: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isSaving: boolean;
  setIsSaving: (saving: boolean) => void;
  lastSaved: Date | null;
  setLastSaved: (date: Date | null) => void;
  eventData: EventData;
  setEventData: React.Dispatch<React.SetStateAction<EventData>>;

  // Acciones
  updateField: (field: keyof EventData, value: any) => void;
  updateFields: (fields: Partial<EventData>) => void;
  hydrate: (data: EventData) => void;
  showMobilePreview: boolean;
  setShowMobilePreview: React.Dispatch<React.SetStateAction<boolean>>;
  showDesignPanel: boolean;
  setShowDesignPanel: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  const hasHydrated = useRef(false);
  // UI States
  const [activeSection, setActiveSection] = useState('configuracion');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [showDesignPanel, setShowDesignPanel] = useState(false);

  // Form States
  const [eventData, setEventData] = useState<EventData>({
    title: '',
    event_type: 'Boda',
    event_date: '',
    event_time: '',
    venue: '',
    venue_address: '',
    location_url: '',
    location_waze_url: '',
    message: 'Con la bendición de Dios y el amor de nuestros Padres',
    message_secondary: 'Tenemos el honor de invitarte a celebrar nuestra unión.',
    dress_code: 'Formal',
    dress_code_women: 'Vestido Largo',
    dress_code_men: 'Traje',
    dress_code_detail: '',
    dress_code_icons_enabled: true,
    cover_image_url: '',
    gallery_urls: [],
    music_url: '',
    itinerary_items: [],
    is_published: false,
    plan: 'diamante',
    slug: '',
    adults_only: false,
    is_bilingual: false,
    template_id: 'boda_1',
    padrinos_list: [],
    parents_bride_father: '',
    parents_bride_father_deceased: false,
    parents_bride_mother: '',
    parents_bride_mother_deceased: false,
    parents_groom_father: '',
    parents_groom_father_deceased: false,
    parents_groom_mother: '',
    parents_groom_mother_deceased: false,
    gift_message: 'Tu presencia es nuestro mejor regalo, pero si deseas hacernos un obsequio...',
    security_pin_enabled: false,
    security_pin: '',
    sections_done: {},
    sections_styles: {},
  });

  const updateField = useCallback((field: keyof EventData, value: any) => {
    console.log('updateField llamado:', field, value);
    setEventData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const updateFields = useCallback((fields: Partial<EventData>) => {
    setEventData((prev) => ({
      ...prev,
      ...fields,
    }));
  }, []);

  const hydrate = useCallback((data: EventData) => {
    if (!hasHydrated.current) {
      hasHydrated.current = true;
      setEventData(data); // Solo hidrata UNA vez al inicio
    }
    setIsLoading(false);
  }, []);

  return (
    <EditorContext.Provider
      value={{
        activeSection,
        setActiveSection,
        isLoading,
        setIsLoading,
        isSaving,
        setIsSaving,
        lastSaved,
        setLastSaved,
        eventData,
        setEventData,
        updateField,
        updateFields,
        hydrate,
        showMobilePreview,
        setShowMobilePreview,
        showDesignPanel,
        setShowDesignPanel,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor debe usarse dentro de un EditorProvider');
  }
  return context;
};
