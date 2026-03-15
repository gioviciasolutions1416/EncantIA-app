import { useEffect, useRef } from 'react';
import { EventData, saveEvent } from '@/lib/editor-supabase';

export const useAutoSave = (
  id: string,
  data: EventData,
  setIsSaving: (val: boolean) => void,
  setLastSaved: (date: Date) => void
) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstLoad = useRef(true);
  const prevDataRef = useRef<string>('');

  useEffect(() => {
    // Evitar guardar si no hay ID o datos iniciales
    if (!id) return;

    const currentDataStr = JSON.stringify(data);

    // En la primera carga real de datos (hidratación), solo guardamos como referencia para detectar cambios futuros
    if (isFirstLoad.current) {
      if (data.id) { // Solo marcamos como "hidratado" si el objeto ya tiene un ID real de la DB
        prevDataRef.current = currentDataStr;
        isFirstLoad.current = false;
      }
      return;
    }

    // Si los datos son idénticos a los últimos guardados/referenciados, no hacer nada
    if (currentDataStr === prevDataRef.current) return;

    // Limpiar timeout previo si el usuario sigue escribiendo (debounce 1.5s)
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setIsSaving(true);
    timeoutRef.current = setTimeout(async () => {
      try {
        await saveEvent(id, data);
        prevDataRef.current = currentDataStr;
        setLastSaved(new Date());
      } catch (error) {
        console.error('Error en auto-guardado:', error);
      } finally {
        setIsSaving(false);
      }
    }, 1500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [id, data, setIsSaving, setLastSaved]);
};
