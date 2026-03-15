export const GRADUACION = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Graduación — {{nombre_festejado}}</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&family=DM+Serif+Display:ital@0;1&family=Anybody:wght@800;900&display=swap" rel="stylesheet">
<style>
    :root {
    --color-primary: {{color_primary
    /* Mapeo adaptado a locales */
    --accent: var(--color-primary);
    --accent2: var(--color-secondary);
    --bg: var(--color-bg);
  }};
    --color-secondary: {{color_secondary}};
    --color-bg: {{color_bg}};
    --font-titulos: '{{font_titulos}}', serif;
    --font-cuerpo: '{{font_cuerpo}}', sans-serif;
    --bg2: #111118;
    --text: #F0EEE8;
    --muted: rgba(240,238,232,0.45);
    --border: rgba(245,200,66,0.2);
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Space Grotesk', sans-serif; background: var(--color-bg); color: var(--text); overflow-x: hidden; }

  /* ── SCANLINES overlay ── */
  body::after {
    content: '';
    position: fixed; inset: 0;
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px);
    pointer-events: none; z-index: 9999;
  }

  /* ── HERO ── */
  .hero {
    min-height: 100vh;
    display: grid; grid-template-rows: 1fr auto;
    position: relative; overflow: hidden;
  }

  .hero-bg {
    position: absolute; inset: 0;
    background: url('{{portada_url}}') center/cover no-repeat;
    filter: brightness(0.12) saturate(0.3);
    animation: subtle-drift 20s ease-in-out infinite alternate;
  }
  @keyframes subtle-drift {
    from { transform: scale(1.05) translateX(0); }
    to   { transform: scale(1.1) translateX(-15px); }
  }

  .hero-grid-overlay {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(245,200,66,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(245,200,66,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
  }

  .hero-content {
    position: relative; z-index: 2;
    display: flex; flex-direction: column;
    align-items: flex-start; justify-content: center;
    padding: clamp(3rem, 8vw, 8rem);
    max-width: 1100px;
  }

  .class-year {
    font-family: 'Anybody', sans-serif;
    font-size: clamp(5rem, 20vw, 15rem);
    font-weight: 900;
    color: transparent;
    -webkit-text-stroke: 1px rgba(245,200,66,0.15);
    line-height: 1;
    position: absolute;
    right: -2rem; top: 50%; transform: translateY(-50%);
    pointer-events: none; user-select: none;
    letter-spacing: -0.03em;
  }

  .tag {
    display: inline-flex; align-items: center; gap: 0.5rem;
    border: 1px solid var(--border);
    padding: 0.4rem 1rem;
    font-size: 0.6rem; letter-spacing: 0.35em; text-transform: uppercase;
    color: var(--color-primary); margin-bottom: 2.5rem;
    animation: fade-right 1s 0.2s both;
  }
  .tag-dot { width: 6px; height: 6px; background: var(--color-primary); border-radius: 50%; animation: blink 1.5s infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
  @keyframes fade-right { from{opacity:0;transform:translateX(-30px)} to{opacity:1;transform:translateX(0)} }

  .hero-name {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(3rem, 8vw, 6rem);
    font-style: italic;
    line-height: 1.05;
    color: var(--text);
    margin-bottom: 0.5rem;
    animation: fade-right 1s 0.4s both;
  }

  .hero-degree {
    font-family: 'Anybody', sans-serif;
    font-size: clamp(1.5rem, 4vw, 3rem);
    font-weight: 800;
    color: var(--color-primary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    line-height: 1;
    margin-bottom: 2rem;
    animation: fade-right 1s 0.6s both;
  }

  .hero-meta { display: flex; gap: 3rem; animation: fade-right 1s 0.8s both; }
  @media (max-width: 500px) { .hero-meta { flex-direction: column; gap: 1rem; } }
  .meta-item { }
  .meta-label { font-size: 0.55rem; letter-spacing: 0.35em; color: var(--muted); text-transform: uppercase; margin-bottom: 0.3rem; }
  .meta-value { font-size: 0.9rem; color: var(--text); font-weight: 300; }

  .hero-cta {
    position: absolute; bottom: 3rem; right: clamp(2rem, 5vw, 5rem);
    z-index: 2; animation: fade-right 1s 1.2s both;
  }
  .scroll-cta { color: var(--muted); font-size: 0.6rem; letter-spacing: 0.3em; text-transform: uppercase; writing-mode: vertical-rl; display: flex; align-items: center; gap: 0.7rem; }
  .scroll-cta::after { content: ''; width: 1px; height: 60px; background: linear-gradient(to bottom, var(--muted), transparent); }

  /* ── SECCIONES ── */
  .pad { padding: 6rem clamp(2rem, 6vw, 6rem); }

  .sec-label { font-size: 0.58rem; letter-spacing: 0.45em; color: var(--color-primary); text-transform: uppercase; margin-bottom: 1rem; font-weight: 500; }
  .sec-title { font-family: 'DM Serif Display', serif; font-size: clamp(2rem, 5vw, 3.5rem); line-height: 1.1; margin-bottom: 3rem; color: var(--text); }
  .sec-title em { color: var(--color-primary); font-style: italic; }

  /* ── QUOTE ── */
  .quote-block {
    max-width: 900px; margin: 0 auto;
    padding: 6rem clamp(2rem, 6vw, 6rem);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    position: relative;
  }
  .quote-mark { font-family: 'DM Serif Display', serif; font-size: 8rem; color: var(--color-primary); opacity: 0.15; position: absolute; top: 1.5rem; left: 2rem; line-height: 1; }
  .quote-body { font-family: 'DM Serif Display', serif; font-style: italic; font-size: clamp(1.3rem, 3vw, 2rem); line-height: 1.6; color: var(--text); opacity: 0; transform: translateY(30px); transition: opacity 0.8s, transform 0.8s; }
  .quote-body.visible { opacity: 1; transform: translateY(0); }
  .quote-author { margin-top: 1.5rem; font-size: 0.7rem; letter-spacing: 0.3em; color: var(--color-primary); text-transform: uppercase; }

  /* ── EVENTO ── */
  .events-layout { max-width: 900px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--border); }
  @media (max-width: 600px) { .events-layout { grid-template-columns: 1fr; } }
  .ev-panel { background: var(--bg2); padding: 3rem 2.5rem; position: relative; overflow: hidden; transition: background 0.4s; opacity: 0; transform: translateY(30px); }
  .ev-panel.visible { opacity: 1; transform: translateY(0); transition: opacity 0.7s, transform 0.7s, background 0.4s; }
  .ev-panel:hover { background: #1a1a24; }
  .ev-panel::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(to right, var(--color-primary), var(--color-secondary));
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.4s;
  }
  .ev-panel:hover::before { transform: scaleX(1); }
  .ev-number { font-family: 'Anybody', sans-serif; font-size: 5rem; font-weight: 900; color: rgba(245,200,66,0.06); position: absolute; top: 0.5rem; right: 1rem; line-height: 1; }
  .ev-label { font-size: 0.55rem; letter-spacing: 0.4em; color: var(--color-primary); text-transform: uppercase; margin-bottom: 1rem; }
  .ev-name-grad { font-family: 'DM Serif Display', serif; font-size: 1.6rem; margin-bottom: 0.5rem; color: var(--text); }
  .ev-time-grad { font-family: 'Anybody', sans-serif; font-weight: 800; font-size: 2.5rem; color: var(--color-primary); letter-spacing: -0.02em; margin-bottom: 0.5rem; }
  .ev-place-grad { font-size: 0.85rem; color: var(--muted); line-height: 1.6; margin-bottom: 2rem; font-weight: 300; }
  .btn-grad {
    display: inline-block;
    border: 1px solid var(--color-primary);
    color: var(--color-primary);
    padding: 0.7rem 2rem;
    font-size: 0.6rem; letter-spacing: 0.3em; text-transform: uppercase;
    text-decoration: none; font-weight: 500;
    transition: background 0.3s, color 0.3s;
  }
  .btn-grad:hover { background: var(--color-primary); color: var(--color-bg); }

  /* ── ITINERARIO ── */
  .grad-timeline { max-width: 700px; margin: 0 auto; }
  .gt-item {
    display: grid; grid-template-columns: 120px 1px 1fr; gap: 2rem; align-items: flex-start;
    margin-bottom: 0;
    opacity: 0; transition: opacity 0.6s, transform 0.6s;
    transform: translateX(-20px);
  }
  .gt-item.visible { opacity: 1; transform: translateX(0); }
  .gt-time { font-family: 'Anybody', sans-serif; font-weight: 800; font-size: 1.6rem; color: var(--color-primary); text-align: right; padding-top: 0.2rem; }
  .gt-line-wrap { display: flex; flex-direction: column; align-items: center; }
  .gt-dot { width: 10px; height: 10px; background: var(--color-primary); flex-shrink: 0; margin-top: 0.4rem; }
  .gt-bar { width: 1px; flex: 1; background: var(--border); min-height: 50px; }
  .gt-body { padding-bottom: 3rem; }
  .gt-name { font-size: 1.1rem; color: var(--text); margin-bottom: 0.3rem; font-weight: 300; }
  .gt-desc { font-size: 0.8rem; color: var(--muted); }

  /* ── GALERÍA ── */
  .gallery-grad {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 12px;
    background: var(--color-bg);
    padding: 3rem clamp(2rem, 6vw, 6rem);
  }
  .gallery-grad img { width: 100%; height: 260px; object-fit: cover; filter: grayscale(0.6) brightness(0.8); transition: filter 0.4s, transform 0.4s; cursor: pointer; border-radius: 4px; border: 1px solid var(--border); }
  .gallery-grad img:hover { filter: grayscale(0) brightness(1); transform: scale(1.02); }

  /* ── RSVP ── */
  .rsvp-grad {
    padding: 8rem clamp(2rem, 6vw, 6rem);
    display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center;
    max-width: 1000px; margin: 0 auto;
  }
  @media (max-width: 650px) { .rsvp-grad { grid-template-columns: 1fr; } }
  .rsvp-big-text { font-family: 'Anybody', sans-serif; font-weight: 900; font-size: clamp(3rem, 10vw, 7rem); color: var(--color-primary); line-height: 0.85; letter-spacing: -0.03em; }
  .rsvp-small { font-family: 'DM Serif Display', serif; font-style: italic; font-size: 1.5rem; color: var(--muted); margin-top: 0.5rem; }
  .rsvp-right { }
  .rsvp-right p { font-size: 0.9rem; color: var(--muted); line-height: 1.8; margin-bottom: 2.5rem; font-weight: 300; }
  .btn-grad-fill {
    display: inline-block;
    background: var(--color-primary);
    color: var(--color-bg);
    padding: 1rem 3rem;
    font-family: 'Anybody', sans-serif;
    font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 800;
    text-decoration: none;
    transition: background 0.3s, transform 0.3s;
  }
  .btn-grad-fill:hover { background: var(--color-secondary); transform: translateY(-3px); }

  .border-t { border-top: 1px solid var(--border); }

  footer { border-top: 1px solid var(--border); padding: 2.5rem clamp(2rem, 6vw, 6rem); display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--muted); }
  @media (max-width: 500px) { footer { flex-direction: column; gap: 1rem; text-align: center; } }
</style>
</head>
<body>

<!-- HERO -->
<section class="hero" data-field="portada_url">
  <div class="hero-bg"></div>
  <div class="hero-grid-overlay"></div>
  <div class="class-year" data-field="generacion">{{generacion}}</div>

  <div class="hero-content">
    <div class="tag"><div class="tag-dot"></div><span data-field="mensaje_secundario">{{mensaje_secundario}}</span></div>
    <h1 class="grad-name" data-field="nombre_festejado">{{nombre_festejado}}</h1>
    <p class="grad-degree"><span data-field="carrera">{{carrera}}</span> 🎓</p>
    <p class="grad-school" data-field="institucion">{{institucion}}</p>
    <div class="hero-meta">
      <div class="meta-item">
        <div class="meta-label">Fecha</div>
        <div class="meta-value" data-field="fecha_hero">{{fecha_hero}}</div>
      </div>
      <div class="meta-item">
        <div class="meta-label">Generación</div>
        <div class="meta-value" data-field="generacion">{{generacion}}</div>
      </div>
      <div class="meta-item">
        <div class="meta-label">Institución</div>
        <div class="meta-value" data-field="institucion">{{institucion}}</div>
      </div>
    </div>
  </div>

  <div class="hero-cta">
    <div class="scroll-cta">Desplázate</div>
  </div>
</section>

<!-- QUOTE -->
<div class="quote-block" style="border-top:1px solid var(--border);border-bottom:1px solid var(--border);max-width:100%">
  <div class="quote-mark">"</div>
  <p class="quote-body" data-field="frase">{{frase}}</p>
</div>

<!-- EVENTOS -->
<section class="pad border-t">
  <p class="sec-label">Los Eventos</p>
  <p class="sec-title">Dos momentos <em>que importan</em></p>
  <div class="events-layout">
    <div class="ev-panel">
      <div class="ev-number">01</div>
      <div class="ev-label">Ceremonia Oficial</div>
      <div class="ev-name-grad">Graduación</div>
      <div class="ev-time-grad" data-field="hora_ceremonia">{{hora_ceremonia}}</div>
      <div class="ev-place-grad"><span data-field="lugar_ceremonia">{{lugar_ceremonia}}</span><br><span data-field="direccion_ceremonia">{{direccion_ceremonia}}</span></div>
      <a href="#" class="btn-grad">Ver Ubicación →</a>
    </div>
    <div class="ev-panel" style="transition-delay:.15s">
      <div class="ev-number">02</div>
      <div class="ev-label">Celebración Privada</div>
      <div class="ev-name-grad">Festejo</div>
      <div class="ev-time-grad" data-field="hora_recepcion">{{hora_recepcion}}</div>
      <div class="ev-place-grad"><span data-field="lugar_recepcion">{{lugar_recepcion}}</span><br><span data-field="direccion_recepcion">{{direccion_recepcion}}</span></div>
      <a href="#" class="btn-grad">Ver Ubicación →</a>
    </div>
  </div>
</section>

<!-- ITINERARIO -->
<section class="pad border-t" style="background:var(--bg2)">
  <p class="sec-label">Programa</p>
  <p class="sec-title">Agenda <em>del día</em></p>
  <div class="grad-timeline" data-field="itin_html">
    {{itin_html}}
  </div>
</section>

<!-- GALERÍA -->
<section style="overflow:hidden">
  <div class="gallery-grad" data-field="galeria_html">
    {{galeria_html}}
  </div>
</section>

<!-- RSVP -->
<section class="border-t">
  <div class="rsvp-grad">
    <div>
      <div class="rsvp-big-text">¿VAS<br>A VENIR?</div>
      <div class="rsvp-small">
        <ul>
          <li><b>Confirmación:</b> Antes del <span data-field="confirmacion_fecha">{{confirmacion_fecha}}</span></li>
        </ul>
      </div>
    </div>
    <div class="rsvp-right">
      <p>Será un honor tenerte en este momento tan especial. Confírmanos tu asistencia para poderte dar todos los detalles del festejo.</p>
      <a href="{{whatsapp_url}}" class="btn-grad-fill" data-field="whatsapp_url">Confirmar por WhatsApp</a>
    </div>
  </div>
</section>

<footer>
  <span><span data-field="nombre_festejado">{{nombre_festejado}}</span> · Graduación <span data-field="generacion">{{generacion}}</span></span>
  <span style="color:var(--color-primary)">Hecha con orgullo</span>
</footer>

<script>
const obs = new IntersectionObserver(e => e.forEach(x => x.isIntersecting && x.target.classList.add('visible')), { threshold: 0.1 });
document.querySelectorAll('.quote-body, .ev-panel, .gt-item').forEach(el => obs.observe(el));
</script>
</body>
</html>
`;
