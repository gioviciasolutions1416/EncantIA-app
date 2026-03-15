import { TEMPLATE_HTML_MAP } from '@/templates';
import { EventData } from './editor-supabase';

const buildItinerarioHtml = (items: any[]) => {
  if (!items || items.length === 0) return '<!-- Sin itinerario -->';
  return items.map(p => `
<div class="itin-item">
  <div class="itin-time">${p.hora || ''}</div>
  <div class="itin-icon">${p.icono || '⭐'}</div>
  <div class="itin-body">
    <div class="itin-name">${p.titulo || ''}</div>
    <div class="itin-desc">${p.descripcion || ''}</div>
  </div>
</div>`
  ).join('');
};

const buildGaleriaHtml = (urls: string[]) => {
  if (!urls || urls.length === 0) return '<!-- Sin fotos en galería -->';
  const imgList = urls.map(url => `<img src="${url}" alt="" loading="lazy" />`).join('');
  return `<div class="gal-dynamic">${imgList}</div>`;
};

export const injectData = (templateId: string, eventData: EventData): string => {
  const tpl = TEMPLATE_HTML_MAP[templateId];
  if (!tpl) return '<h1>Plantilla no encontrada</h1>';

  // Lógica de división de nombres si el título es "Novia & Novio"
  let novia = '';
  let novio = '';
  if (eventData.title.includes('&')) {
    const parts = eventData.title.split('&');
    novia = parts[0]?.trim() || '';
    novio = parts[1]?.trim() || '';
  } else {
    novia = eventData.title;
    novio = '';
  }

  let padrinosHtml = '';
  if (eventData.event_type === 'Bautizo') {
    const arr = [];
    if (eventData.padrino) arr.push(eventData.padrino);
    if (eventData.madrina) arr.push(eventData.madrina);
    padrinosHtml = arr.join('<br>');
  } else if (eventData.padrinos_list && eventData.padrinos_list.length > 0) {
    const items = eventData.padrinos_list.map((p: any) => {
      const isSpecificRol = p.rol && !['Padrino', 'Madrina', 'Otro'].includes(p.rol);
      const rolHtml = isSpecificRol ? `<span class="padrino-rol">${p.rol}</span>` : '';
      return `<div class="padrino-item">${rolHtml}<span class="padrino-nombre">${p.nombre}</span></div>`;
    }).join('');
    padrinosHtml = `<div class="padrinos-list">${items}</div>`;
  } else {
    padrinosHtml = eventData.padrinos || '';
  }

  const galeriaHtml = buildGaleriaHtml(eventData.gallery_urls || []);

  // Mapeo detallado de variables
  const whatsappUrl = `https://wa.me/521234567890?text=${encodeURIComponent(`¡Hola! Confirmo mi asistencia a la invitación: ${eventData.title}. Link: https://giovis.app/${eventData.slug}`)}`;

  const vars: Record<string, string> = {
    novia: novia,
    novio: novio,
    fecha_hero: eventData.event_date || 'Fecha por definir',
    frase: eventData.message || '',
    mensaje_secundario: eventData.message_secondary || '',
    madre_novia: eventData.parents_bride_mother || '',
    padre_novia: eventData.parents_bride_father || '',
    madre_novio: eventData.parents_groom_mother || '',
    padre_novio: eventData.parents_groom_father || '',
    padrinos_html: padrinosHtml,
    lugar_ceremonia: eventData.venue || '',
    direccion_ceremonia: eventData.venue_address || '',
    hora_ceremonia: eventData.event_time || '',
    lugar_recepcion: eventData.segunda_sede_json?.lugar || eventData.venue || '',
    direccion_recepcion: eventData.segunda_sede_json?.direccion || eventData.venue_address || '',
    hora_recepcion: eventData.segunda_sede_json?.hora || eventData.event_time || '',
    confirmacion_fecha: eventData.rsvp_config?.confFechaLimite || (eventData as any).rsvp_deadline || 'Próximamente',
    whatsapp_url: whatsappUrl,
    // Imágenes
    portada_url: eventData.cover_image_url || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
    galeria_html: galeriaHtml,
    // Compatibilidad con otros nombres
    padrinos: padrinosHtml,
    nombre_festejado: novia,
    nombre_festejada: novia,
    nombre_madre: eventData.title || '',
    fecha_bebe: eventData.segunda_sede_json?.fecha_bebe || '',
    vestimenta: eventData.dress_code || '',
    carrera: eventData.dress_code_detail || '',
    institucion: eventData.venue || '',
    generacion: eventData.segunda_sede_json?.generacion || '',
    madre: eventData.parents_bride_mother || '',
    padre: eventData.parents_bride_father || '',
    madrina: eventData.parents_bride_mother || '',
    padrino: eventData.parents_bride_father || '',
    regalo_mensaje: eventData.gift_message || '',
    tipo_evento: eventData.event_type || '',
    fecha_corta: eventData.event_date || '',
    fecha_larga: eventData.event_date || '',
    cover_image_url: eventData.cover_image_url || '',
    itin_html: buildItinerarioHtml(eventData.itinerary_items || []),
    color_primary: eventData.sections_styles?.color_primary || '#a35d6a',
    color_secondary: eventData.sections_styles?.color_secondary || '#f0dde3',
    color_bg: eventData.sections_styles?.color_bg || '#fdfafc',
    font_titulos: eventData.sections_styles?.font_titulos || 'Playfair Display',
    font_cuerpo: eventData.sections_styles?.font_cuerpo || 'Jost',
  };

  // CSS Global inyectado (eliminamos las etiquetas <style> y lo inyectamos antes del primer </style>)
  const globalCss = `
::-webkit-scrollbar{display:none!important}
*{scrollbar-width:none!important;-ms-overflow-style:none!important}

.padrinos-list { display: flex; flex-direction: column; gap: 8px; }
@media (min-width: 600px) {
  .padrinos-list { flex-direction: row; flex-wrap: wrap; justify-content: center; }
  .padrino-item { min-width: 150px; text-align: center; margin-bottom: 12px; display: flex; flex-direction: column; }
  .padrino-rol { font-weight: bold; }
}

/* Estilos de Itinerario Dinámico */
.itin-item { display: flex; align-items: flex-start; gap: 15px; margin-bottom: 20px; position: relative; padding-left: 20px; border-left: 2px solid #fdf2f4; }
.itin-icon { flex-shrink: 0; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; background: #fff; box-shadow: 0 2px 8px rgba(163,93,106,0.1); border: 1px solid #fdf2f4; margin-left: -37px; }
.itin-time { font-weight: bold; font-size: 13px; min-width: 60px; color: #a35d6a; margin-top: 6px; }
.itin-body { flex: 1; }
.itin-name { font-weight: 600; font-size: 15px; color: #333; }
.itin-desc { font-size: 12px; color: #777; margin-top: 2px; }

/* Estilos de Galería Dinámica */
.gal-dynamic { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 8px; width: 100%; }
.gal-dynamic img { width: 100%; height: 220px; object-fit: cover; border-radius: 4px; }
.gal-dynamic img:first-child { grid-column: span 2; height: 320px; }
@media (max-width: 500px) {
  .gal-dynamic img:first-child { grid-column: span 1; height: 220px; }
}
`;

  // Reemplazo global de {{key}}
  let finalHtml = tpl.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return vars[key] !== undefined ? vars[key] : `[[${key}]]`;
  });

  const styleIdx = finalHtml.indexOf('</style>');
  if (styleIdx !== -1) {
    finalHtml = finalHtml.slice(0, styleIdx) + globalCss + finalHtml.slice(styleIdx);
  }

  // Inyectamos el script de Live Update antes del </body>
  return finalHtml.replace('</body>', `${getLiveUpdateScript()}</body>`);
};

export const getLiveUpdateScript = (): string => `
<script>
window.addEventListener('message', (e) => {
  if (e.data?.type !== 'UPDATE_DATA') return;
  const d = e.data.data;
  
  const set = (sel, val) => { 
    document.querySelectorAll(sel).forEach(el => {
      if (el.tagName === 'A') {
        if (sel.includes('whatsapp_url') || el.href.includes('wa.me')) {
          el.href = val;
        }
      } else {
        el.innerHTML = val || '';
      }
    });
  };

  const novia = d.title?.split('&')[0]?.trim() || d.title;
  const novio = d.title?.split('&')[1]?.trim() || '';
  const waUrl = \`https://wa.me/521234567890?text=\${encodeURIComponent('¡Hola! Confirmo mi asistencia a la invitación: ' + d.title + '. Link: https://giovis.app/' + d.slug)}\`;

  const buildPadrinos = (list) => {
    if (!list || !list.length) return '';
    const items = list.map(p => {
      const isSpecificRol = p.rol && !['Padrino', 'Madrina', 'Otro'].includes(p.rol);
      const rolHtml = isSpecificRol ? \`<span class="padrino-rol">\${p.rol}</span>\` : '';
      return \`<div class="padrino-item">\${rolHtml}<span class="padrino-nombre">\${p.nombre}</span></div>\`;
    }).join('');
    return \`<div class="padrinos-list">\${items}</div>\`;
  };

  // Padrinos
  const padHtml = d.event_type === 'Bautizo' 
    ? [d.padrino, d.madrina].filter(Boolean).join('<br>')
    : buildPadrinos(d.padrinos_list);
  
  document.querySelectorAll('[data-field="padrinos"], [data-field="padrinos_html"]').forEach(el => {
    el.innerHTML = padHtml || d.padrinos || '';
  });

  set('[data-field="novia"]', novia);
  set('[data-field="novio"]', novio);
  set('[data-field="frase"]', d.message);
  set('[data-field="mensaje_secundario"]', d.message_secondary);
  set('[data-field="fecha_hero"]', d.event_date);
  set('[data-field="lugar_ceremonia"]', d.venue);
  set('[data-field="direccion_ceremonia"]', d.venue_address);
  set('[data-field="hora_ceremonia"]', d.event_time);
  set('[data-field="lugar_recepcion"]', d.segunda_sede_json?.lugar || d.venue);
  set('[data-field="direccion_recepcion"]', d.segunda_sede_json?.direccion || d.venue_address);
  set('[data-field="hora_recepcion"]', d.segunda_sede_json?.hora || d.event_time);
  set('[data-field="madre_novia"]', d.parents_bride_mother);
  set('[data-field="padre_novia"]', d.parents_bride_father);
  set('[data-field="madre_novio"]', d.parents_groom_mother);
  set('[data-field="padre_novio"]', d.parents_groom_father);
  set('[data-field="madre"]', d.parents_bride_mother);
  set('[data-field="padre"]', d.parents_bride_father);
  set('[data-field="madrina"]', d.madrina || d.parents_bride_mother);
  set('[data-field="padrino"]', d.padrino || d.parents_bride_father);
  set('[data-field="nombre_festejada"]', novia);
  set('[data-field="nombre_festejado"]', novia);
  set('[data-field="nombre_madre"]', d.title);
  set('[data-field="fecha_bebe"]', d.segunda_sede_json?.fecha_bebe);
  set('[data-field="vestimenta"]', d.dress_code);
  set('[data-field="carrera"]', d.dress_code_detail);
  set('[data-field="institucion"]', d.venue);
  set('[data-field="generacion"]', d.segunda_sede_json?.generacion);
  set('[data-field="regalo_mensaje"]', d.gift_message);
  set('[data-field="confirmacion_fecha"]', d.rsvp_config?.confFechaLimite || d.rsvp_deadline);
  set('[data-field="whatsapp_url"]', waUrl);
  
  // Actualizar colores y tipografía de sections_styles en tiempo real
  // Actualizar colores y tipografía de sections_styles en tiempo real
  if (d.sections_styles) {
    const s = d.sections_styles;
    const root = document.documentElement;
    if (s.color_primary) root.style.setProperty('--color-primary', s.color_primary);
    if (s.color_secondary) root.style.setProperty('--color-secondary', s.color_secondary);
    if (s.color_bg) root.style.setProperty('--color-bg', s.color_bg);
    
    // 1. Cargar fuentes dinámicas
    if (s.font_titulos || s.font_cuerpo) {
      const fonts = [s.font_titulos, s.font_cuerpo]
        .filter(Boolean)
        .map(f => f.replace(/ /g, '+'))
        .join('&family=');
      
      const existingLink = document.getElementById('dynamic-fonts');
      if (existingLink) existingLink.remove();
      
      const link = document.createElement('link');
      link.id = 'dynamic-fonts';
      link.rel = 'stylesheet';
      link.href = \`https://fonts.googleapis.com/css2?family=\${fonts}:wght@300;400;600;700&display=swap\`;
      document.head.appendChild(link);
      
      link.onload = () => {
        if (s.font_titulos) root.style.setProperty('--font-titulos', \`'\${s.font_titulos}', serif\`);
        if (s.font_cuerpo) root.style.setProperty('--font-cuerpo', \`'\${s.font_cuerpo}', sans-serif\`);
      };
    }

    // 2. Escala de fuentes
    if (s.font_scale) {
      root.style.setProperty('--font-scale', s.font_scale);
    }

    // 3. Animaciones
    if (s.animaciones) {
      const style = document.getElementById('anim-override');
      if (style) style.remove();
      
      const newStyle = document.createElement('style');
      newStyle.id = 'anim-override';
      
      if (s.animaciones === 'sin_animaciones') {
        newStyle.innerHTML = \`
          * { animation: none !important; transition: none !important; }
          .fade-in, .visible, [class*="anim"] { opacity: 1 !important; transform: none !important; }
        \`;
      } else if (s.animaciones === 'suave') {
        newStyle.innerHTML = \`
          .fade-in { animation: fadeInUp 0.8s ease forwards; }
          @keyframes fadeInUp { 
            from { opacity: 0; transform: translateY(20px); } 
            to { opacity: 1; transform: translateY(0); } 
          }
        \`;
      } else if (s.animaciones === 'dinamico') {
        newStyle.innerHTML = \`
          .fade-in { animation: slideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
          @keyframes slideIn { 
            from { opacity: 0; transform: translateX(-30px) scale(0.95); } 
            to { opacity: 1; transform: translateX(0) scale(1); } 
          }
        \`;
      }
      document.head.appendChild(newStyle);
    }
  }
  
  // Imagen de portada
  const coverUrl = d.cover_image_url || '';
  document.querySelectorAll('[data-field="portada_url"]').forEach(el => {
    if (el.tagName === 'IMG') el.src = coverUrl;
    else el.style.backgroundImage = \`url(\${coverUrl})\`;
  });

  // Galería
  const gallery = d.gallery_urls || [];
  const galHtml = gallery.length > 0 
    ? \`<div class="gal-dynamic">\${gallery.map(url => \`<img src="\${url}" alt="Galería" loading="lazy">\`).join('')}</div>\`
    : '<!-- Sin fotos -->';
  document.querySelectorAll('[data-field="galeria_html"]').forEach(el => {
    el.innerHTML = galHtml;
  });

  // Itinerario
  document.querySelectorAll('[data-field="itin_html"]').forEach(el => {
    if (!d.itinerary_items) return;
    el.innerHTML = d.itinerary_items.map(item => \`
      <div class="itin-item">
        <div class="itin-time">\${item.hora || ''}</div>
        <div class="itin-icon">\${item.icono || '⭐'}</div>
        <div class="itin-body">
          <div class="itin-name">\${item.titulo || ''}</div>
          <div class="itin-desc">\${item.descripcion || ''}</div>
        </div>
      </div>
    \`).join('');
  });

  // Imagen de portada (compatibilidad vieja)
  const coverEl = document.querySelector('[data-field="cover_image"]');
  if (coverEl && d.cover_image_url) {
    if (coverEl.tagName === 'IMG') coverEl.src = d.cover_image_url;
    else coverEl.style.backgroundImage = \`url(\${d.cover_image_url})\`;
  }
});
</script>
`;

