export const XV_ANOS = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>XV Años — {{nombre_festejada}}</title>
<link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Josefin+Sans:wght@200;300;400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<style>
    :root {
    --color-primary: {{color_primary
    /* Mapeo adaptado a locales */
    --rose: var(--color-primary);
    --blush: var(--color-secondary);
    --cream: var(--color-bg);
  }};
    --color-secondary: {{color_secondary}};
    --color-bg: {{color_bg}};
    --font-titulos: '{{font_titulos}}', serif;
    --font-cuerpo: '{{font_cuerpo}}', sans-serif;
    --rose-light: #E8A0B0;
    --blush2: #FAEEF2;
    --mauve: #8B4F5E;
    --dark: #2D1A22;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Josefin Sans', sans-serif; background: var(--color-bg); color: var(--dark); overflow-x: hidden; }

  /* ── CONFETI ── */
  #confetti { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
  .petal {
    position: absolute; width: 8px; height: 8px;
    border-radius: 50% 0 50% 0;
    animation: petal-fall linear infinite;
    opacity: 0;
  }
  @keyframes petal-fall {
    0%   { transform: translateY(-10px) rotate(0deg); opacity: 0; }
    5%   { opacity: 0.7; }
    95%  { opacity: 0.4; }
    100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
  }

  /* ── HERO ── */
  .hero {
    min-height: 100vh;
    position: relative;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
    background: linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), url('{{portada_url}}') center/cover no-repeat;
  }

  /* SVG flores decorativas */
  .flower-bg {
    position: absolute; inset: 0;
    opacity: 0.12;
    pointer-events: none;
  }

  .hero-content {
    position: relative; z-index: 2;
    text-align: center; padding: 3rem;
    animation: bloom-in 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }
  @keyframes bloom-in {
    from { opacity: 0; transform: scale(0.85); }
    to   { opacity: 1; transform: scale(1); }
  }

  .crown { font-size: 2.5rem; margin-bottom: 1rem; animation: rotate-crown 6s ease-in-out infinite; display: inline-block; }
  @keyframes rotate-crown { 0%,100%{transform:rotate(-5deg)} 50%{transform:rotate(5deg)} }

  .subtitle-hero {
    font-family: 'Josefin Sans', sans-serif;
    font-weight: 200;
    letter-spacing: 0.5em;
    font-size: 0.7rem;
    color: var(--mauve);
    text-transform: uppercase;
    margin-bottom: 1.5rem;
  }

  .name-big {
    font-family: 'Great Vibes', cursive;
    font-size: clamp(4.5rem, 14vw, 9rem);
    color: var(--color-primary);
    line-height: 1;
    text-shadow: 2px 4px 30px rgba(212,96,122,0.2);
    animation: bloom-in 1.5s 0.3s both;
  }

  .xv-badge {
    display: inline-flex; align-items: center; gap: 1rem;
    margin: 2rem auto;
    animation: bloom-in 1.5s 0.6s both;
  }
  .xv-line { width: 60px; height: 1px; background: var(--rose-light); }
  .xv-number {
    font-family: 'Libre Baskerville', serif;
    font-size: 1.6rem;
    font-style: italic;
    color: var(--color-primary);
    letter-spacing: 0.1em;
  }

  .date-hero {
    font-weight: 200;
    letter-spacing: 0.3em;
    font-size: 0.85rem;
    color: var(--mauve);
    animation: bloom-in 1.5s 0.9s both;
  }

  .scroll-arrow {
    position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%);
    color: var(--rose-light);
    font-size: 1.8rem;
    animation: pulse-down 1.8s ease-in-out infinite;
    z-index: 2;
  }
  @keyframes pulse-down {
    0%,100%{transform:translateX(-50%) translateY(0);opacity:.5}
    50%{transform:translateX(-50%) translateY(8px);opacity:1}
  }

  /* ── SECCIONES ── */
  .pink-section { background: var(--blush2); }
  .white-section { background: #fff; }
  .cream-section { background: var(--color-bg); }

  .pad { padding: 5rem 2rem; }
  .pad-lg { padding: 7rem 2rem; }

  .sec-title {
    font-family: 'Great Vibes', cursive;
    font-size: clamp(2.5rem, 7vw, 4rem);
    color: var(--color-primary);
    text-align: center;
    margin-bottom: 0.5rem;
  }
  .sec-sub {
    font-family: 'Josefin Sans', sans-serif;
    font-weight: 200;
    letter-spacing: 0.4em;
    font-size: 0.65rem;
    color: var(--mauve);
    text-transform: uppercase;
    text-align: center;
    margin-bottom: 4rem;
  }

  /* ── PADRES/PADRINOS ── */
  .family-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(200px,1fr));
    gap: 2.5rem; max-width: 700px; margin: 0 auto;
  }
  .family-card {
    text-align: center;
    padding: 2rem 1.5rem;
    border: 1px solid var(--color-secondary);
    background: #fff;
    position: relative;
    opacity: 0; transform: translateY(20px);
    transition: opacity 0.6s, transform 0.6s;
  }
  .family-card.visible { opacity: 1; transform: translateY(0); }
  .family-card::before {
    content: '✿';
    position: absolute; top: -0.7rem; left: 50%; transform: translateX(-50%);
    background: #fff; padding: 0 0.5rem;
    color: var(--rose-light); font-size: 1.2rem;
  }
  .fam-role { font-size: 0.6rem; letter-spacing: 0.4em; color: var(--mauve); text-transform: uppercase; margin-bottom: 1rem; font-weight: 400; }
  .fam-name { font-family: 'Libre Baskerville', serif; font-style: italic; font-size: 1.05rem; color: var(--dark); line-height: 1.6; }

  /* ── EVENTOS ── */
  .events-wrap { max-width: 750px; margin: 0 auto; display: grid; gap: 2rem; }
  .ev-card {
    display: grid; grid-template-columns: 80px 1fr auto;
    align-items: center; gap: 2rem;
    background: #fff; padding: 2.5rem;
    border-left: 3px solid var(--rose-light);
    box-shadow: 0 4px 30px rgba(212,96,122,0.06);
    opacity: 0; transform: translateX(-20px);
    transition: opacity 0.6s, transform 0.6s, box-shadow 0.3s;
  }
  .ev-card.visible { opacity: 1; transform: translateX(0); }
  .ev-card:hover { box-shadow: 0 8px 40px rgba(212,96,122,0.12); }
  @media (max-width: 550px) { .ev-card { grid-template-columns: 1fr; text-align: center; } }
  .ev-time { font-family: 'Libre Baskerville', serif; font-style: italic; font-size: 1.8rem; color: var(--color-primary); line-height: 1; }
  .ev-name { font-size: 1.1rem; color: var(--dark); margin-bottom: 0.3rem; font-weight: 300; letter-spacing: 0.05em; }
  .ev-place { font-size: 0.8rem; color: var(--mauve); letter-spacing: 0.05em; }
  .btn-pink {
    white-space: nowrap;
    border: 1.5px solid var(--rose-light);
    color: var(--color-primary);
    padding: 0.6rem 1.5rem;
    font-size: 0.6rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    text-decoration: none;
    font-family: 'Josefin Sans', sans-serif;
    font-weight: 400;
    transition: background 0.3s, color 0.3s;
  }
  .btn-pink:hover { background: var(--color-primary); color: #fff; }

  /* ── ITINERARIO FLORAL ── */
  .itinerary { max-width: 500px; margin: 0 auto; }
  .it-item {
    display: flex; gap: 2rem; align-items: flex-start;
    padding-bottom: 2.5rem;
    position: relative;
    opacity: 0; transform: translateY(20px);
    transition: opacity 0.6s, transform 0.6s;
  }
  .it-item.visible { opacity: 1; transform: translateY(0); }
  .it-item:not(:last-child)::after {
    content: '';
    position: absolute; left: 1.15rem; top: 2.5rem; bottom: 0; width: 1px;
    background: linear-gradient(to bottom, var(--rose-light), transparent);
  }
  .it-dot {
    flex-shrink: 0; width: 2.3rem; height: 2.3rem;
    background: var(--color-secondary); border: 2px solid var(--rose-light);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.9rem;
  }
  .it-body {}
  .it-time { font-size: 0.65rem; letter-spacing: 0.3em; color: var(--mauve); text-transform: uppercase; margin-bottom: 0.3rem; }
  .it-title { font-size: 1rem; color: var(--dark); font-weight: 300; }

  /* ── GALERÍA ── */
  .gal-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 8px;
    max-width: 1000px; margin: 0 auto;
  }
  .gal-grid img { width: 100%; height: 260px; object-fit: cover; filter: saturate(0.8); transition: transform 0.5s, filter 0.5s; cursor: pointer; border-radius: 1rem; }
  .gal-grid img:hover { transform: scale(1.05); filter: saturate(1.1); }
  @media (max-width: 600px) { .gal-grid { grid-template-columns: 1fr 1fr; } }

  /* ── REGALOS ── */
  .gift-section { padding: 6rem 2rem; text-align: center; max-width: 600px; margin: 0 auto; }
  .gift-icon { font-size: 3rem; margin-bottom: 1.5rem; animation: float 3s ease-in-out infinite; display: inline-block; }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  .gift-text { font-weight: 200; letter-spacing: 0.05em; color: var(--mauve); line-height: 1.8; margin-bottom: 2.5rem; }
  .btn-rose-fill {
    display: inline-block;
    background: var(--color-primary);
    color: #fff;
    padding: 1rem 3.5rem;
    font-family: 'Josefin Sans', sans-serif;
    font-size: 0.65rem;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    text-decoration: none;
    transition: background 0.3s, transform 0.3s;
  }
  .btn-rose-fill:hover { background: var(--mauve); transform: translateY(-2px); }

  /* ── RSVP ── */
  .rsvp-section {
    background: linear-gradient(135deg, var(--color-secondary) 0%, #fce8ef 100%);
    padding: 7rem 2rem; text-align: center;
    position: relative; overflow: hidden;
  }
  .rsvp-section::before { content: '✿ ✾ ✿'; font-size: 3rem; display: block; color: var(--rose-light); opacity: 0.4; margin-bottom: 2rem; }
  .rsvp-title { font-family: 'Great Vibes', cursive; font-size: clamp(2.5rem,8vw,5rem); color: var(--color-primary); margin-bottom: 0.5rem; }
  .rsvp-msg { font-weight: 200; letter-spacing: 0.05em; color: var(--mauve); margin-bottom: 3rem; font-size: 0.95rem; }
  .deadline { font-size: 0.7rem; letter-spacing: 0.3em; color: var(--rose-light); text-transform: uppercase; margin-top: 1.5rem; }

  footer { background: var(--dark); color: rgba(255,255,255,0.4); text-align: center; padding: 3rem 2rem; font-style: italic; font-size: 0.85rem; }
  .footer-name { font-family: 'Great Vibes', cursive; font-size: 2rem; color: var(--rose-light); display: block; margin-bottom: 0.5rem; }
</style>
</head>
<body>

<div id="confetti"></div>

<!-- HERO -->
<section class="hero" data-field="portada_url">
  <svg class="flower-bg" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="60" fill="#D4607A"/>
    <circle cx="100" cy="40" r="35" fill="#D4607A"/>
    <circle cx="100" cy="160" r="35" fill="#D4607A"/>
    <circle cx="40" cy="100" r="35" fill="#D4607A"/>
    <circle cx="160" cy="100" r="35" fill="#D4607A"/>
    <circle cx="700" cy="600" r="80" fill="#D4607A"/>
    <circle cx="700" cy="520" r="45" fill="#D4607A"/>
    <circle cx="700" cy="680" r="45" fill="#D4607A"/>
    <circle cx="620" cy="600" r="45" fill="#D4607A"/>
    <circle cx="780" cy="600" r="45" fill="#D4607A"/>
    <circle cx="400" cy="750" r="50" fill="#D4607A"/>
    <circle cx="400" cy="700" r="30" fill="#D4607A"/>
    <circle cx="350" cy="750" r="30" fill="#D4607A"/>
    <circle cx="450" cy="750" r="30" fill="#D4607A"/>
    <circle cx="400" cy="800" r="30" fill="#D4607A"/>
    <circle cx="650" cy="80" r="40" fill="#D4607A"/>
    <circle cx="650" cy="40" r="25" fill="#D4607A"/>
    <circle cx="610" cy="80" r="25" fill="#D4607A"/>
    <circle cx="690" cy="80" r="25" fill="#D4607A"/>
    <circle cx="650" cy="120" r="25" fill="#D4607A"/>
  </svg>
  <div class="hero-content">
    <div class="crown">👑</div>
    <p class="subtitle-hero" data-field="mensaje_secundario">{{mensaje_secundario}}</p>
    <h1 class="name-big" data-field="nombre_festejada">{{nombre_festejada}}</h1>
    <div class="xv-badge">
      <div class="xv-line"></div>
      <div class="xv-number">XV Años</div>
      <div class="xv-line"></div>
    </div>
    <p class="date-hero" data-field="fecha_hero">{{fecha_hero}}</p>
  </div>
  <div class="scroll-arrow">↓</div>
</section>

<!-- FAMILIA -->
<section class="pink-section pad">
  <p class="sec-title">Con el amor de...</p>
  <p class="sec-sub">Familia y padrinos</p>
  <div class="family-grid">
    <div class="family-card">
      <div class="fam-role">Padres</div>
      <div class="fam-name"><span data-field="madre">{{madre}}</span><br><span data-field="padre">{{padre}}</span></div>
    </div>
    <div class="family-card" style="transition-delay:.15s">
      <div class="fam-role">Padrinos de Honor</div>
      <div class="fam-name" data-field="padrinos_html">{{padrinos_html}}</div>
    </div>
    <div class="family-card" style="transition-delay:.3s">
      <div class="fam-role">Madrina de Lazo</div>
      <div class="fam-name">Isabella Ramírez</div>
    </div>
  </div>
</section>

<!-- EVENTOS -->
<section class="white-section pad">
  <p class="sec-title">Los Eventos</p>
  <p class="sec-sub">Dos momentos especiales</p>
  <div class="events-wrap">
    <div class="ev-card">
      <div class="ev-time" data-field="hora_ceremonia">{{hora_ceremonia}}</div>
      <div>
        <div class="ev-name">Misa de Acción de Gracias</div>
      <div class="ev-place" data-field="lugar_ceremonia">{{lugar_ceremonia}}</div>
      <div class="ev-place" data-field="direccion_ceremonia">{{direccion_ceremonia}}</div>
      <a href="#" class="btn-pink">Ubicación</a>
    </div>
    <div class="ev-card" style="transition-delay:.2s">
      <div class="ev-time" data-field="hora_recepcion">{{hora_recepcion}}</div>
      <div>
        <div class="ev-name">Recepción</div>
      <div class="ev-place" data-field="lugar_recepcion">{{lugar_recepcion}}</div>
      <div class="ev-place" data-field="direccion_recepcion">{{direccion_recepcion}}</div>
      <a href="#" class="btn-pink">Ubicación</a>
    </div>
  </div>
</section>

<!-- ITINERARIO -->
<section class="cream-section pad">
  <p class="sec-title">La Noche Perfecta</p>
  <p class="sec-sub">Itinerario</p>
  <div class="itinerary" data-field="itin_html">
    {{itin_html}}
  </div>
</section>

<!-- GALERÍA -->
<section class="gallery-section pink-section">
  <p class="sec-title">Sesión de Fotos</p>
  <p class="sec-sub" style="margin-bottom:2.5rem">Un vistazo especial</p>
  <div class="gal-grid" data-field="galeria_html">
    {{galeria_html}}
  </div>
</section>

<!-- REGALOS -->
<section class="white-section">
  <div class="gift-section">
    <div class="gift-icon">🎀</div>
    <p class="sec-title">Mesa de Regalos</p>
    <p class="sec-sub" style="margin-bottom:1.5rem">Detalles especiales</p>
    <p class="gift-text" data-field="regalo_mensaje">{{regalo_mensaje}}</p>
    <a href="#" class="btn-rose-fill">Ver Lista de Regalos</a>
  </div>
</section>

<!-- RSVP -->
<section class="rsvp-section">
  <p class="rsvp-title">¿Nos acompañas?</p>
  <p class="rsvp-msg">Confirma tu asistencia antes del <strong data-field="confirmacion_fecha">{{confirmacion_fecha}}</strong></p>
  <a href="{{whatsapp_url}}" class="btn-rose-fill" data-field="whatsapp_url">Confirmar por WhatsApp</a>
  <p class="deadline">✿ Código de vestimenta: Formal ✿</p>
</section>

<footer>
  <span class="footer-name" data-field="nombre_festejada">{{nombre_festejada}}</span>
  XV Años · <span data-field="fecha_hero">{{fecha_hero}}</span> · Hecha con amor
</footer>

<script>
// Pétalos animados
const confettiEl = document.getElementById('confetti');
const petalColors = ['#D4607A','#E8A0B0','#F7C5D2','#8B4F5E','#f9d4de'];
for (let i = 0; i < 30; i++) {
  const p = document.createElement('div');
  p.className = 'petal';
  p.style.cssText = \`
    left:\${Math.random()*100}%;
    background:\${petalColors[Math.floor(Math.random()*petalColors.length)]};
    width:\${Math.random()*8+4}px; height:\${Math.random()*8+4}px;
    animation-duration:\${Math.random()*12+8}s;
    animation-delay:\${Math.random()*8}s;
    border-radius:\${Math.random()>0.5?'50% 0 50% 0':'50%'};
  \`;
  confettiEl.appendChild(p);
}

// Scroll reveal
const obs = new IntersectionObserver(e => e.forEach(x => x.isIntersecting && x.target.classList.add('visible')), { threshold: 0.1 });
document.querySelectorAll('.family-card, .ev-card, .it-item').forEach(el => obs.observe(el));
</script>
</body>
</html>
`;
