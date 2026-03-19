import { supabase } from './supabase-browser';

export interface EventData {
  id?: string;
  user_id?: string;
  title: string;
  event_type: string;
  event_date: string;
  event_time?: string;
  venue?: string;
  venue_address?: string;
  location_url?: string;
  location_waze_url?: string;
  message?: string;
  message_secondary?: string;
  dress_code?: string;
  dress_code_women?: string;
  dress_code_men?: string;
  dress_code_detail?: string;
  dress_code_icons_enabled?: boolean;
  cover_image_url?: string;
  gallery_urls?: string[];
  music_url?: string;
  itinerary_items?: any[];
  playlist?: any;
  signatures?: any;
  is_published?: boolean;
  plan: 'prueba' | 'plata' | 'oro' | 'diamante';
  slug: string;
  adults_only?: boolean;
  is_bilingual?: boolean;
  sections_styles?: any;
  sections_done?: any;
  history?: any;
  template_id: string;
  segunda_sede_json?: any;
  rsvp_config?: any;
  parents_bride_father?: string;
  parents_bride_father_deceased?: boolean;
  parents_bride_mother?: string;
  parents_bride_mother_deceased?: boolean;
  parents_groom_father?: string;
  parents_groom_father_deceased?: boolean;
  parents_groom_mother?: string;
  parents_groom_mother_deceased?: boolean;
  padrinos?: string;
  padrino?: string;
  madrina?: string;
  padrinos_list?: any[];
  institucion?: string;
  career?: string;
  chambelanes?: string;
  gift_message?: string;
  regalos_list?: any[];
  gift_registry_enabled?: boolean;
  gift_registry_config?: {
    message: string;
    links: { name: string; url: string }[];
  };
  security_pin_enabled?: boolean;
  security_pin?: string;
  video_url?: string;
  voice_url?: string;
  survey_active?: boolean;
  updated_at?: string;

  // Campos traducidos EN
  message_en?: string;
  message_secondary_en?: string;
  dress_code_en?: string;
  dress_code_women_en?: string;
  dress_code_men_en?: string;
  dress_code_detail_en?: string;
  gift_message_en?: string;
  venue_en?: string;
  venue_address_en?: string;
  itinerary_items_en?: any[];
  padrinos_list_en?: any[];
}

export const loadEvent = async (id: string): Promise<EventData | null> => {
  if (id === 'local-test') {
    return {
      id: 'local-test',
      title: 'Mi Boda de Prueba',
      event_type: 'Boda',
      event_date: '2026-12-31',
      plan: 'plata',
      slug: 'boda-local-test',
      template_id: 'boda_1'
    } as EventData;
  }

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error loading event:', error.message);
    return null;
  }

  return {
    ...data,
    plan: data.plan || 'plata'
  } as EventData;
};

export const saveEvent = async (id: string, data: Partial<EventData>) => {
  if (id === 'local-test') {
    console.log('MOCK SAVE:', data);
    return;
  }

  const { error } = await supabase
    .from('events')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Error saving event:', error.message);
    throw error;
  }
};

// ─── GUESTS ────────────────────────────────────────────────────────────────

export interface Guest {
  id?: string;
  event_id: string;
  name: string;
  passes: number;
  passes_used: number;
  phone?: string;
  rsvp_status: 'pending' | 'confirmed' | 'declined';
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// Obtener todos los invitados de un evento
export const getGuests = async (eventId: string): Promise<Guest[]> => {
  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error loading guests:', error.message);
    return [];
  }
  return data as Guest[];
};

// Crear invitado
export const createGuest = async (guest: Omit<Guest, 'id' | 'created_at' | 'updated_at'>): Promise<Guest | null> => {
  const { data, error } = await supabase
    .from('guests')
    .insert(guest)
    .select()
    .single();

  if (error) {
    console.error('Error creating guest:', error.message);
    return null;
  }
  return data as Guest;
};

// Actualizar invitado
export const updateGuest = async (id: string, updates: Partial<Guest>): Promise<boolean> => {
  const { error } = await supabase
    .from('guests')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Error updating guest:', error.message);
    return false;
  }
  return true;
};

// Eliminar invitado
export const deleteGuest = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('guests')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting guest:', error.message);
    return false;
  }
  return true;
};

// Resumen de pases
export const getGuestsSummary = async (eventId: string) => {
  const guests = await getGuests(eventId);
  return {
    total_invitados: guests.length,
    total_pases: guests.reduce((acc, g) => acc + (g.passes || 0), 0),
    confirmados: guests.filter(g => g.rsvp_status === 'confirmed').length,
    pendientes: guests.filter(g => g.rsvp_status === 'pending').length,
    declinados: guests.filter(g => g.rsvp_status === 'declined').length,
  };
};
