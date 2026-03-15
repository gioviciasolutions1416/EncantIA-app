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
  plan: 'prueba' | 'basico' | 'rsvp' | 'diamante';
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
  gift_message?: string;
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
}

export const loadEvent = async (id: string): Promise<EventData | null> => {
  if (id === 'local-test') {
    return {
      id: 'local-test',
      title: 'Mi Boda de Prueba',
      event_type: 'Boda',
      event_date: '2026-12-31',
      plan: 'basico',
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
    plan: data.plan || 'basico'
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
