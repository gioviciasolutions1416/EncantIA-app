export const BABY_SHOWER = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Baby Shower — {{nombre_madre}}</title>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@200;300;400&family=Dancing+Script:wght@400;700&display=swap" rel="stylesheet">
<style>
    :root {
    --color-primary: {{color_primary
    /* Mapeo adaptado a locales */
    --sage: var(--color-primary);
    --terracotta: var(--color-secondary);
    --sage-bg: var(--color-bg);
  }};
    --color-secondary: {{color_secondary}};
    --color-bg: {{color_bg}};
    --font-titulos: '{{font_titulos}}', serif;
    --font-cuerpo: '{{font_cuerpo}}', sans-serif;
    --sage-pale: #D4E6D5;
    --terracotta-pale: #EDD5C8;
    --cream: #FAF7F2;
    --warm: #F5EEE4;
    --dark: #2D3A2E;
    --muted: #7A8D7B;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--dark); overflow-x: hidden; }

  /* ── CONFETTI FALLING ── */
  #confetti { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
  .conf-piece {
    position: absolute;
    top: -20px;
    animation: conf-fall linear infinite;
    border-radius: 2px;
  }
  @keyframes conf-fall {
    to { transform: translateY(110vh) rotate(720deg); opacity: 0; }
  }

  /* ── HERO ── */
  .hero {
    min-height: 100vh;
    position: relative;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
    background: linear-gradient(rgba(239,247,239,0.75), var(--color-bg)), url('{{portada_url}}') center/cover no-repeat;
  }

  /* Arcos decorativos */
  .arch-left, .arch-right {
    position: absolute;
    width: 300px; height: 600px;
    border-radius: 200px 200px 0 0;
    opacity: 0.15;
  }
  .arch-left { left: -100px; top: 50%; transform: translateY(-50%); background: var(--color-primary); }
  .arch-right { right: -100px; top: 50%; transform: translateY(-50%); background: var(--color-secondary); }

  /* Estrellas */
  .stars { position: absolute; inset: 0; pointer-events: none; }
  .star { position: absolute; opacity: 0; animation: twinkle ease-in-out infinite; }
  @keyframes twinkle { 0%,100%{opacity:0;transform:scale(0)} 50%{opacity:0.6;transform:scale(1)} }

  .hero-content { position: relative; z-index: 2; text-align: center; padding: 3rem; max-width: 700px; }

  .hero-graphic {
    width: 110px; height: 110px;
    background: var(--terracotta-pale);
    border-radius: 50%;
    margin: 0 auto 2rem;
    display: flex; align-items: center; justify-content: center;
    font-size: 3rem;
    animation: gentle-bounce 3s ease-in-out infinite;
    box-shadow: 0 10px 40px rgba(196,120,90,0.2);
  }
  @keyframes gentle-bounce {
    0%,100%{transform:translateY(0) scale(1)}
    50%{transform:translateY(-10px) scale(1.03)}
  }

  .label-bs {
    font-family: 'DM Sans', sans-serif;
    font-weight: 200; letter-spacing: 0.45em; font-size: 0.6rem;
    color: var(--muted); text-transform: uppercase; margin-bottom: 1rem;
    opacity: 0; animation: fade-up 1s 0.2s forwards;
  }
  @keyframes fade-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

  .mom-name {
    font-family: 'Dancing Script', cursive;
    font-size: clamp(3rem, 12vw, 7rem);
    color: var(--color-secondary);
    line-height: 1;
    opacity: 0; animation: fade-up 1s 0.4s forwards;
    text-shadow: 0 4px 20px rgba(196,120,90,0.2);
  }

  .expecting {
    font-family: 'Fraunces', serif; font-style: italic;
    font-size: 1.3rem; color: var(--color-primary);
    margin: 1rem 0 1.5rem;
    opacity: 0; animation: fade-up 1s 0.6s forwards;
  }

  .baby-pills {
    display: flex; justify-content: center; gap: 0.7rem; flex-wrap: wrap;
    margin-bottom: 2rem;
    opacity: 0; animation: fade-up 1s 0.8s forwards;
  }
  .baby-pill {
    background: var(--sage-pale);
    color: var(--dark);
    padding: 0.4rem 1.2rem;
    border-radius: 50px;
    font-size: 0.7rem; font-weight: 300; letter-spacing: 0.1em;
  }

  .date-bs {
    font-weight: 300; letter-spacing: 0.15em; font-size: 0.9rem; color: var(--muted);
    opacity: 0; animation: fade-up 1s 1s forwards;
  }

  /* ── SECCIONES ── */
  .pad { padding: 6rem 2rem; }
  .padx { padding: 6rem clamp(2rem, 6vw, 6rem); }

  .sage-section { background: var(--color-bg); }
  .terra-section { background: var(--terracotta-pale); }
  .warm-section { background: var(--warm); }
  .white-section { background: #fff; }

  .sec-title-bs {
    font-family: 'Dancing Script', cursive;
    font-size: clamp(2rem, 6vw, 3.5rem);
    color: var(--color-secondary);
    text-align: center; margin-bottom: 0.5rem;
  }
  .sec-sub-bs {
    font-weight: 200; letter-spacing: 0.4em; font-size: 0.6rem;
    color: var(--muted); text-transform: uppercase;
    text-align: center; margin-bottom: 3.5rem;
  }

  /* ── DETALLE DEL EVENTO ── */
  .event-bs {
    max-width: 550px; margin: 0 auto;
    background: #fff;
    border-radius: 2px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.07);
    opacity: 0; transform: translateY(30px);
    transition: opacity 0.8s, transform 0.8s;
  }
  .event-bs.visible { opacity: 1; transform: translateY(0); }
  .event-bs-top {
    background: var(--color-primary);
    padding: 2.5rem;
    text-align: center;
  }
  .ev-label-bs { font-size: 0.6rem; letter-spacing: 0.4em; color: rgba(255,255,255,0.7); text-transform: uppercase; margin-bottom: 0.5rem; }
  .ev-time-bs { font-family: 'Dancing Script', cursive; font-size: 3.5rem; color: #fff; line-height: 1; }
  .ev-date-bs { font-family: 'Fraunces', serif; font-style: italic; color: rgba(255,255,255,0.85); font-size: 1rem; margin-top: 0.5rem; }
  .event-bs-body { padding: 2.5rem; }
  .ev-detail-row { display: flex; gap: 1rem; align-items: flex-start; margin-bottom: 1.5rem; }
  .ev-icon-bs { font-size: 1.3rem; flex-shrink: 0; }
  .ev-detail-label { font-size: 0.55rem; letter-spacing: 0.35em; color: var(--muted); text-transform: uppercase; margin-bottom: 0.2rem; }
  .ev-detail-val { font-size: 0.95rem; color: var(--dark); font-weight: 300; }
  .btn-terra {
    display: block;
    text-align: center;
    background: var(--color-secondary);
    color: #fff;
    padding: 1rem;
    font-size: 0.6rem; letter-spacing: 0.3em; text-transform: uppercase;
    text-decoration: none;
    transition: background 0.3s;
  }
  .btn-terra:hover { background: #b0694e; }

  /* ── WISHLIST ── */
  .wish-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; max-width: 800px; margin: 0 auto; }
  .wish-card {
    background: #fff;
    padding: 2rem 1.5rem; text-align: center;
    border-radius: 2px;
    transition: transform 0.3s, box-shadow 0.3s;
    opacity: 0; transform: translateY(20px);
  }
  .wish-card.visible { opacity: 1; transform: translateY(0); transition: opacity 0.6s, transform 0.6s, box-shadow 0.3s; }
  .wish-card:hover { transform: translateY(-5px); box-shadow: 0 15px 40px rgba(0,0,0,0.08); }
  .wish-emoji { font-size: 2.5rem; margin-bottom: 1rem; }
  .wish-title { font-family: 'Fraunces', serif; font-size: 1.1rem; color: var(--dark); margin-bottom: 0.5rem; }
  .wish-text { font-size: 0.8rem; color: var(--muted); line-height: 1.7; font-weight: 300; }

  /* ── ITINERARIO ── */
  .steps-bs { max-width: 500px; margin: 0 auto; }
  .step-bs {
    display: flex; gap: 1.5rem; align-items: flex-start;
    padding-bottom: 2.5rem; position: relative;
    opacity: 0; transform: translateX(-20px);
    transition: opacity 0.6s, transform 0.6s;
  }
  .step-bs.visible { opacity: 1; transform: translateX(0); }
  .step-bs:not(:last-child)::after {
    content: '';
    position: absolute; left: 1.1rem; top: 2.5rem; bottom: 0; width: 1px;
    background: linear-gradient(to bottom, var(--sage-pale), transparent);
  }
  .step-num {
    flex-shrink: 0; width: 2.2rem; height: 2.2rem;
    background: var(--sage-pale);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; font-weight: 400; color: var(--color-primary);
  }
  .step-time { font-size: 0.6rem; letter-spacing: 0.3em; color: var(--muted); text-transform: uppercase; margin-bottom: 0.3rem; }
  .step-name { font-size: 0.95rem; color: var(--dark); font-weight: 300; }

  /* ── GALERÍA ── */
  .gal-bs {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 8px;
    max-width: 900px; margin: 0 auto;
    padding: 0 1rem;
  }
  .gal-bs img { width: 100%; height: 260px; object-fit: cover; transition: filter 0.4s; filter: saturate(0.85); cursor: pointer; border-radius: 2rem; }
  .gal-bs img:hover { filter: saturate(1.1); transform: scale(1.02); }

  /* ── RSVP ── */
  .rsvp-bs {
    background: var(--color-secondary);
    padding: 7rem 2rem; text-align: center;
    position: relative; overflow: hidden;
  }
  .rsvp-bs::before {
    content: '✿ ✦ ✿ ✦ ✿';
    position: absolute; top: 1.5rem; left: 50%; transform: translateX(-50%);
    white-space: nowrap;
    font-size: 1rem; color: rgba(255,255,255,0.2); letter-spacing: 2rem;
  }
  .rsvp-bs-title { font-family: 'Dancing Script', cursive; font-size: clamp(3rem, 10vw, 5.5rem); color: #fff; margin-bottom: 1rem; }
  .rsvp-bs-msg { font-weight: 200; color: rgba(255,255,255,0.8); margin-bottom: 0.5rem; font-size: 0.95rem; }
  .deadline-bs { font-size: 0.7rem; letter-spacing: 0.2em; color: rgba(255,255,255,0.55); text-transform: uppercase; margin-bottom: 3rem; }
  .btn-white-bs {
    display: inline-block;
    background: #fff;
    color: var(--color-secondary);
    padding: 1rem 3.5rem;
    font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase;
    text-decoration: none; font-weight: 400;
    transition: background 0.3s, transform 0.3s;
  }
  .btn-white-bs:hover { background: var(--sage-pale); transform: translateY(-2px); }

  footer { background: var(--dark); color: rgba(255,255,255,0.35); text-align: center; padding: 3rem 2rem; font-size: 0.8rem; }
  .footer-dancing { font-family: 'Dancing Script', cursive; font-size: 2rem; color: var(--sage-pale); display: block; margin-bottom: 0.5rem; }
</style>
</head>
<body>

<div id="confetti"></div>

<!-- HERO -->
<section class="hero" data-field="portada_url">
  <div class="arch-left"></div>
  <div class="arch-right"></div>
  <div class="stars" id="stars"></div>
  <div class="hero-content">
    <div class="hero-graphic">🍃</div>
    <p class="label-bs">¡Viene un bebé!</p>
    <h1 class="mom-name" data-field="nombre_madre">{{nombre_madre}}</h1>
    <p class="expecting" data-field="mensaje_secundario">{{mensaje_secundario}}</p>
    <div class="baby-pills">
      <span class="baby-pill">Mamá primeriza</span>
      <span class="baby-pill" data-field="fecha_bebe">Llegada estimada: {{fecha_bebe}}</span>
    </div>
    <p class="date-bs" data-field="fecha_hero">{{fecha_hero}}</p>
  </div>
</section>

<!-- EVENTO -->
<section class="sage-section pad">
  <p class="sec-title-bs">El Festejo</p>
  <p class="sec-sub-bs">¡Ven a celebrar con nosotros!</p>
  <div class="event-bs">
    <div class="event-bs-top">
      <div class="ev-label-bs">Baby Shower de <span data-field="nombre_madre">{{nombre_madre}}</span></div>
      <div class="ev-time-bs" data-field="hora_ceremonia">{{hora_ceremonia}}</div>
      <div class="ev-date-bs" data-field="fecha_hero">{{fecha_hero}}</div>
    </div>
    <div class="event-bs-body">
      <div class="ev-detail-row">
        <div class="ev-icon-bs">📍</div>
        <div>
          <div class="ev-detail-label">Lugar</div>
          <div class="ev-detail-val" data-field="lugar_ceremonia">{{lugar_ceremonia}}</div>
          <div class="ev-detail-val" data-field="direccion_ceremonia">{{direccion_ceremonia}}</div>
        </div>
      </div>
      <div class="ev-detail-row">
        <div class="ev-icon-bs">🕐</div>
        <div>
          <div class="ev-detail-label">Horario</div>
          <div class="ev-detail-val" data-field="hora_ceremonia">{{hora_ceremonia}}</div>
        </div>
      </div>
      <div class="ev-detail-row">
        <div class="ev-icon-bs">👗</div>
        <div>
          <div class="ev-detail-label">Vestimenta</div>
          <div class="ev-detail-val" data-field="vestimenta">{{vestimenta}}</div>
        </div>
      </div>
    </div>
    <a href="#" class="btn-terra">Ver en el Mapa</a>
  </div>
</section>

<!-- ITINERARIO -->
<section class="warm-section pad">
  <p class="sec-title-bs">El Programa</p>
  <p class="sec-sub-bs">Una tarde llena de amor</p>
  <div class="steps-bs" data-field="itin_html">
    {{itin_html}}
  </div>
</section>

<!-- LISTA DE DESEOS -->
<section class="white-section pad">
  <p class="sec-title-bs">Lista de Regalos</p>
  <p class="sec-sub-bs">¡Todo ayuda!</p>
  <div class="wish-grid">
    <div class="wish-card">
      <div class="wish-emoji">🛍️</div>
      <div class="wish-title">Mesa de Regalos</div>
      <div class="wish-text" data-field="regalo_mensaje">{{regalo_mensaje}}</div>
    </div>
    <div class="wish-card" style="transition-delay:.15s">
      <div class="wish-emoji">💰</div>
      <div class="wish-title">Aportación libre</div>
      <div class="wish-text">Si prefieres dar un regalo económico, será bienvenido con mucho amor</div>
    </div>
    <div class="wish-card" style="transition-delay:.3s">
      <div class="wish-emoji">💌</div>
      <div class="wish-title">Carta al bebé</div>
      <div class="wish-text">Escríbele un mensaje al bebé que guardará para siempre</div>
    </div>
  </div>
</section>

<!-- GALERÍA -->
<section class="sage-section" style="padding: 5rem 1rem">
  <p class="sec-title-bs">Mamá Resplandece</p>
  <p class="sec-sub-bs" style="margin-bottom:2rem">Sesión de fotos de embarazo</p>
  <div class="gal-bs" data-field="galeria_html">
    {{galeria_html}}
  </div>
</section>

<!-- RSVP -->
<section class="rsvp-bs">
  <h2 class="rsvp-bs-title">¡Te esperamos!</h2>
  <p class="rsvp-bs-msg">Confirma tu asistencia a este hermoso festejo</p>
  <p class="deadline-bs">Antes del <span data-field="confirmacion_fecha">{{confirmacion_fecha}}</span></p>
  <a href="{{whatsapp_url}}" class="btn-white-bs" data-field="whatsapp_url">Confirmar por WhatsApp</a>
</section>

<footer>
  <span class="footer-dancing"><span data-field="nombre_madre">{{nombre_madre}}</span> &amp; Bebé</span>
  Baby Shower · <span data-field="fecha_hero">{{fecha_hero}}</span> · Hecho con amor
</footer>

<script>
// Confetti de colores pastel
const cc = document.getElementById('confetti');
const confColors = ['#8FAF90','#C4785A','#D4E6D5','#EDD5C8','#FAF7F2','#b8d4b9','#e8b89a'];
for (let i = 0; i < 40; i++) {
  const p = document.createElement('div');
  p.className = 'conf-piece';
  const size = Math.random() * 10 + 4;
  p.style.cssText = \`
    left:\${Math.random()*100}%;
    width:\${size}px; height:\${size * (Math.random() > 0.5 ? 1 : 2.5)}px;
    background:\${confColors[Math.floor(Math.random()*confColors.length)]};
    animation-duration:\${Math.random()*10+8}s;
    animation-delay:\${Math.random()*10}s;
    opacity:\${Math.random()*0.5+0.3};
    border-radius:\${Math.random()>0.5?'50%':'2px'};
  \`;
  cc.appendChild(p);
}

// Estrellas
const starsEl = document.getElementById('stars');
for (let i = 0; i < 15; i++) {
  const s = document.createElement('div');
  s.className = 'star';
  s.style.cssText = \`
    left:\${Math.random()*100}%; top:\${Math.random()*100}%;
    animation-duration:\${Math.random()*3+2}s;
    animation-delay:\${Math.random()*5}s;
    font-size:\${Math.random()*0.8+0.4}rem;
  \`;
  s.textContent = ['✦','✧','✿','❀','·'][Math.floor(Math.random()*5)];
  s.style.color = ['#8FAF90','#C4785A','#D4E6D5'][Math.floor(Math.random()*3)];
  starsEl.appendChild(s);
}

// Scroll reveal
const obs = new IntersectionObserver(e => e.forEach(x => x.isIntersecting && x.target.classList.add('visible')), { threshold: 0.1 });
document.querySelectorAll('.event-bs, .wish-card, .step-bs').forEach(el => obs.observe(el));
</script>
</body>
</html>
`;
