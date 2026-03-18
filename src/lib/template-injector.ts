import { TEMPLATE_HTML_MAP } from '@/templates';
import { EventData } from './editor-supabase';

const buildItinerarioHtml = (items: any[]) => {
  if (!items || items.length === 0) return '<div class="itin-empty">El itinerario aparecerá aquí</div>';
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

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'Fecha por definir';
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
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
  const phone = eventData.rsvp_config?.phone || eventData.rsvp_config?.confTelefono || '521234567890';
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(`¡Hola! Confirmo mi asistencia a la invitación: ${eventData.title}. Link: https://giovis.app/${eventData.slug}`)}`;

  const vars: Record<string, string> = {
    novia: novia,
    novio: novio,
    fecha_hero: formatDate(eventData.event_date || ''),
    frase: eventData.message || '',
    mensaje_secundario: eventData.message_secondary || '',
    madre_novia: eventData.parents_bride_mother ? `${eventData.parents_bride_mother_deceased ? '† ' : ''}${eventData.parents_bride_mother}` : '',
    padre_novia: eventData.parents_bride_father ? `${eventData.parents_bride_father_deceased ? '† ' : ''}${eventData.parents_bride_father}` : '',
    madre_novio: eventData.parents_groom_mother ? `${eventData.parents_groom_mother_deceased ? '† ' : ''}${eventData.parents_groom_mother}` : '',
    padre_novio: eventData.parents_groom_father ? `${eventData.parents_groom_father_deceased ? '† ' : ''}${eventData.parents_groom_father}` : '',
    padrinos_html: padrinosHtml,
    lugar_ceremonia: eventData.venue || '',
    direccion_ceremonia: eventData.venue_address || '',
    hora_ceremonia: eventData.event_time || '',
    lugar_recepcion: eventData.segunda_sede_json?.lugar || eventData.venue || '',
    direccion_recepcion: eventData.segunda_sede_json?.direccion || eventData.venue_address || '',
    hora_recepcion: eventData.segunda_sede_json?.hora || eventData.event_time || '',
    confirmacion_fecha: eventData.rsvp_config?.deadline || eventData.rsvp_config?.confFechaLimite || (eventData as any).rsvp_deadline || 'Consultar fecha',
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
    vestimenta_damas: eventData.dress_code_women || '',
    vestimenta_caballeros: eventData.dress_code_men || '',
    vestimenta_nota: eventData.dress_code_detail || '',
    dress_code_icons_enabled: eventData.dress_code_icons_enabled ? 'block' : 'none',
    carrera: eventData.dress_code_detail || '',
    institucion: eventData.venue || '',
    generacion: eventData.segunda_sede_json?.generacion || '',
    madre: eventData.parents_bride_mother ? `${eventData.parents_bride_mother_deceased ? '† ' : ''}${eventData.parents_bride_mother}` : '',
    padre: eventData.parents_bride_father ? `${eventData.parents_bride_father_deceased ? '† ' : ''}${eventData.parents_bride_father}` : '',
    madrina: eventData.madrina ? eventData.madrina : (eventData.parents_bride_mother ? `${eventData.parents_bride_mother_deceased ? '† ' : ''}${eventData.parents_bride_mother}` : ''),
    padrino: eventData.padrino ? eventData.padrino : (eventData.parents_bride_father ? `${eventData.parents_bride_father_deceased ? '† ' : ''}${eventData.parents_bride_father}` : ''),
    regalo_mensaje: eventData.gift_message || '',
    tipo_evento: eventData.event_type || '',
    fecha_corta: eventData.event_date || '',
    fecha_larga: eventData.event_date || '',
    cover_image_url: eventData.cover_image_url || '',
    itin_html: buildItinerarioHtml(eventData.itinerary_items || []),
    redes_sociales: eventData.playlist || '',
    color_primary: eventData.sections_styles?.color_primary || '#a35d6a',
    color_secondary: eventData.sections_styles?.color_secondary || '#f0dde3',
    color_bg: eventData.sections_styles?.color_bg || '#fdfafc',
    font_titulos: eventData.sections_styles?.font_titulos || 'Playfair Display',
    font_cuerpo: eventData.sections_styles?.font_cuerpo || 'Jost',
    location_url: eventData.location_url || '#',
    location_waze_url: eventData.location_waze_url || '#',
    location_url_recepcion: eventData.segunda_sede_json?.location_url || eventData.location_url || '#',
    solo_adultos: `<div data-field="solo_adultos" style="display: ${eventData.adults_only ? 'block' : 'none'}; text-align: center; font-weight: bold; color: var(--color-primary); margin: 1rem 0; font-size: 0.8rem; letter-spacing: 0.1em;">🚫 EVENTO SOLO PARA ADULTOS</div>`,
    idioma_dual: `<div data-bilingual style="display: ${eventData.is_bilingual ? 'block' : 'none'}; text-align: center; font-style: italic; color: var(--warm); font-size: 0.8rem; margin-top: 0.5rem;">We would love for you to celebrate with us</div>`
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
.itin-empty { text-align: center; padding: 2rem; color: #a35d6a; font-style: italic; font-size: 0.9rem; }

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

  // Solo adultos
  const adultosEl = document.querySelector('[data-field="solo_adultos"]');
  if (adultosEl) {
    adultosEl.style.display = d.adults_only ? 'block' : 'none';
  }
  
  // Idioma dual
  document.querySelectorAll('[data-bilingual]').forEach(el => {
    el.style.display = d.is_bilingual ? 'block' : 'none';
  });

  const novia = d.title?.split('&')[0]?.trim() || d.title;
  const novio = d.title?.split('&')[1]?.trim() || '';
  
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
  const formatNameDeceased = (name, isDeceased) => name ? (isDeceased ? '† ' + name : name) : '';

  set('[data-field="madre_novia"]', formatNameDeceased(d.parents_bride_mother, d.parents_bride_mother_deceased));
  set('[data-field="padre_novia"]', formatNameDeceased(d.parents_bride_father, d.parents_bride_father_deceased));
  set('[data-field="madre_novio"]', formatNameDeceased(d.parents_groom_mother, d.parents_groom_mother_deceased));
  set('[data-field="padre_novio"]', formatNameDeceased(d.parents_groom_father, d.parents_groom_father_deceased));
  set('[data-field="madre"]', formatNameDeceased(d.parents_bride_mother, d.parents_bride_mother_deceased));
  set('[data-field="padre"]', formatNameDeceased(d.parents_bride_father, d.parents_bride_father_deceased));
  set('[data-field="madrina"]', formatNameDeceased(d.madrina || d.parents_bride_mother, d.parents_bride_mother_deceased));
  set('[data-field="padrino"]', formatNameDeceased(d.padrino || d.parents_bride_father, d.parents_bride_father_deceased));
  set('[data-field="nombre_festejada"]', novia);
  set('[data-field="nombre_festejado"]', novia);
  set('[data-field="nombre_madre"]', d.title);
  set('[data-field="fecha_bebe"]', d.segunda_sede_json?.fecha_bebe);
  set('[data-field="vestimenta"]', d.dress_code);
  set('[data-field="vestimenta_damas"]', d.dress_code_women);
  set('[data-field="vestimenta_caballeros"]', d.dress_code_men);
  set('[data-field="vestimenta_nota"]', d.dress_code_detail);
  const iconsEl = document.querySelector('[data-field="vestimenta_iconos"]');
  if (iconsEl) iconsEl.style.display = d.dress_code_icons_enabled ? 'block' : 'none';
  set('[data-field="carrera"]', d.dress_code_detail);
  set('[data-field="institucion"]', d.venue);
  set('[data-field="generacion"]', d.segunda_sede_json?.generacion);
  set('[data-field="regalo_mensaje"]', d.gift_message);
  set('[data-field="confirmacion_fecha"]', d.rsvp_config?.deadline || d.rsvp_config?.confFechaLimite || d.rsvp_deadline);

  const phone = d.rsvp_config?.phone || d.rsvp_config?.confTelefono || '521234567890';
  const waUrl = \`https://wa.me/\${phone}?text=\${encodeURIComponent('¡Hola! Confirmo mi asistencia a la invitación: ' + d.title + '. Link: https://giovis.app/' + d.slug)}\`;

  const isEn = document.getElementById('lang-toggle-btn') && document.getElementById('lang-en')?.style?.fontWeight === 'bold';

  const rsvpEnabled = d.rsvp_config?.enabled ?? d.rsvp_config?.confHabilitada ?? true;
  document.querySelectorAll('[data-field="whatsapp_url"]').forEach(el => {
    if (rsvpEnabled) {
      el.style.display = 'inline-block';
      el.innerText = isEn ? 'Confirm Attendance' : 'Confirmar Asistencia';
      el.style.pointerEvents = 'auto';
      el.style.background = '';
      el.style.color = '';
      el.href = waUrl;
    } else {
      el.style.display = 'inline-block';
      el.innerText = isEn ? 'Confirmation unavailable' : 'Confirmación no disponible';
      el.style.pointerEvents = 'none';
      el.style.background = '#ddd';
      el.style.color = '#888';
      el.href = '#';
    }
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString(isEn ? 'en-US' : 'es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };
  set('[data-field="fecha_hero"]', formatDate(d.event_date));

  // Ubicaciones (href)
  document.querySelectorAll('[data-field="location_url"]').forEach(el => el.href = d.location_url || '#');
  document.querySelectorAll('[data-field="location_waze_url"]').forEach(el => el.href = d.location_waze_url || '#');
  document.querySelectorAll('[data-field="location_url_recepcion"]').forEach(el => el.href = d.segunda_sede_json?.location_url || d.location_url || '#');
  
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
  const coverUrl = d.cover_image_url || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200';
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
    if (!d.itinerary_items || d.itinerary_items.length === 0) {
      el.innerHTML = '<div class="itin-empty">El itinerario aparecerá aquí</div>';
      return;
    }
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

  // Música
  if (d.music_url) {
    const audio = document.getElementById('audio-player');
    const musicaSection = document.querySelector('[data-section="musica"]');
    if (audio) { audio.src = d.music_url; }
    if (musicaSection) musicaSection.style.display = 'block';

    // ── ÍCONO MUSICAL FLOTANTE ──
    if (!document.getElementById('music-floating-icon')) {
      const icon = document.createElement('div');
      icon.id = 'music-floating-icon';
      icon.innerHTML = '♪';
      icon.style.cssText = \`
        position: fixed;
        bottom: 24px;
        left: 24px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255,255,255,0.15);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255,255,255,0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        color: rgba(255,255,255,0.7);
        cursor: pointer;
        z-index: 9999;
        animation: musicSpin 8s linear infinite;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
      \`;
      icon.addEventListener('mouseenter', () => {
        icon.style.background = 'rgba(255,255,255,0.25)';
        icon.style.transform = 'scale(1.1)';
      });
      icon.addEventListener('mouseleave', () => {
        icon.style.background = 'rgba(255,255,255,0.15)';
        icon.style.transform = 'scale(1)';
      });
      icon.addEventListener('click', () => {
        const a = document.getElementById('audio-player');
        if (!a) return;
        if (a.paused) {
          a.play();
          icon.style.animationPlayState = 'running';
          icon.style.opacity = '1';
        } else {
          a.pause();
          icon.style.animationPlayState = 'paused';
          icon.style.opacity = '0.4';
        }
      });
      document.body.appendChild(icon);

      // Inyectar animación CSS
      if (!document.getElementById('music-icon-style')) {
        const style = document.createElement('style');
        style.id = 'music-icon-style';
        style.innerHTML = \`
          @keyframes musicSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          #music-floating-icon {
            animation: musicSpin 8s linear infinite;
          }
          #music-floating-icon:hover {
            animation-play-state: paused;
          }
        \`;
        document.head.appendChild(style);
      }

      // Autoplay suave
      setTimeout(() => {
        const a = document.getElementById('audio-player');
        if (a) {
          a.volume = 0.4;
          a.play().catch(() => {});
        }
      }, 1000);
    }
  }

  // Regalos
  const regalosSection = document.querySelector('[data-section="regalos"]');
  if (regalosSection) {
    regalosSection.style.display = (d.gift_message || (d.regalos_list && d.regalos_list.length > 0)) ? 'block' : 'none';
  }
  set('[data-field="regalo_mensaje"]', d.gift_message || '');
  const regalosEl = document.querySelector('[data-field="regalos_html"]');
  if (regalosEl && d.regalos_list) {
    regalosEl.innerHTML = d.regalos_list.map(r => 
      \`<a href="\${r.url}" target="_blank" class="regalo-link">🎁 \${r.nombre}</a>\`
    ).join('');
  }

  // Firmas visibles
  const firmasSection = document.querySelector('[data-section="firmas"]');
  if (firmasSection) {
    firmasSection.style.display = 'block';
  }

  // Aplicar estilos por campo
  if (d.sections_styles?.fields) {
    applyFieldStyles(d.sections_styles.fields);
  }
});

// Toggle música global
window.toggleMusic = function() {
  const audio = document.getElementById('audio-player');
  if (!audio) return;
  if (audio.paused) { 
    audio.play(); 
    const btn = document.querySelector('.btn-play');
    if (btn) btn.textContent = '⏸ Pausar'; 
  } else { 
    audio.pause(); 
    const btn = document.querySelector('.btn-play');
    if (btn) btn.textContent = '▶ Reproducir'; 
  }
}

// Firmas enviar
window.enviarFirma = function() {
  const nombre = document.getElementById('firma-nombre')?.value;
  const mensaje = document.getElementById('firma-mensaje')?.value;
  if (!nombre || !mensaje) return;
  const lista = document.getElementById('firmas-lista');
  if (lista) {
    const card = document.createElement('div');
    card.className = 'firma-card';
    card.innerHTML = \`<div class="firma-card-nombre">💌 \${nombre}</div><div class="firma-card-msg">\${mensaje}</div>\`;
    lista.prepend(card);
  }
  if (document.getElementById('firma-nombre')) document.getElementById('firma-nombre').value = '';
  if (document.getElementById('firma-mensaje')) document.getElementById('firma-mensaje').value = '';
}
// ── APLICAR ESTILOS DE FORMATO POR CAMPO ─────────────────────────────
const applyFieldStyles = (fields) => {
  if (!fields) return;
  const sizeMap = {
    'xs': '0.75rem',
    'sm': '0.875rem',
    'base': '1rem',
    'lg': '1.125rem',
    'xl': '1.25rem',
    '2xl': '1.5rem',
  };
  const spacingMap = {
    'tight': '1.25',
    'normal': '1.5',
    'relaxed': '1.75',
    'loose': '2',
  };
  Object.entries(fields).forEach(([field, fmt]) => {
    document.querySelectorAll('[data-field="' + field + '"]').forEach(el => {
      if (fmt.bold !== undefined) el.style.fontWeight = fmt.bold ? 'bold' : 'normal';
      if (fmt.italic !== undefined) el.style.fontStyle = fmt.italic ? 'italic' : 'normal';
      if (fmt.align) el.style.textAlign = fmt.align;
      if (fmt.size && sizeMap[fmt.size]) el.style.fontSize = sizeMap[fmt.size];
      if (fmt.font) el.style.fontFamily = "'" + fmt.font + "', serif";
      if (fmt.color) el.style.color = fmt.color;
      if (fmt.opacity !== undefined) el.style.opacity = (fmt.opacity / 100).toString();
      if (fmt.spacing && spacingMap[fmt.spacing]) el.style.lineHeight = spacingMap[fmt.spacing];
    });
  });
};


</script>
`;

