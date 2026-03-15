export const BAUTIZO = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Bautizo — {{nombre_festejado}}</title>
<link href="https://fonts.googleapis.com/css2?family=Gilda+Display&family=Nunito:wght@200;300;400;600&family=Pinyon+Script&display=swap" rel="stylesheet">
<style>
    :root {
    --color-primary: {{color_primary
    /* Mapeo adaptado a locales */
    --sky-deep: var(--color-primary);
    --gold: var(--color-secondary);
    --cloud: var(--color-bg);
  }};
    --color-secondary: {{color_secondary}};
    --color-bg: {{color_bg}};
    --font-titulos: '{{font_titulos}}', serif;
    --font-cuerpo: '{{font_cuerpo}}', sans-serif;
    --sky: #A8C8E8;
    --sky-pale: #E8F4FD;
    --navy: #1A3A5C;
    --white: #FFFFFF;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Nunito', sans-serif; background: var(--color-bg); color: var(--navy); overflow-x: hidden; }

  /* ── BURBUJAS ── */
  #bubbles { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
  .bubble {
    position: absolute; bottom: -50px;
    background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(168,200,232,0.3));
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.5);
    animation: rise linear infinite;
  }
  @keyframes rise {
    to { transform: translateY(-110vh) translateX(30px); opacity: 0; }
  }

  /* ── CLOUDS SVG ── */
  .clouds-svg { position: absolute; bottom: 0; left: 0; right: 0; pointer-events: none; }

  /* ── HERO ── */
  .hero {
    min-height: 100vh;
    position: relative;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center; overflow: hidden;
    background: linear-gradient(rgba(214,234,248,0.75), var(--sky-pale)), url('{{portada_url}}') center/cover no-repeat;
  }
  .hero::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 80% 60% at 50% 30%, rgba(255,255,255,0.6), transparent);
  }

  .hero-content { position: relative; z-index: 2; padding: 2rem; }

  .dove { font-size: 3.5rem; margin-bottom: 1rem; display: inline-block; animation: flutter 3s ease-in-out infinite; }
  @keyframes flutter {
    0%,100%{transform:translateY(0) rotate(-3deg)}
    25%{transform:translateY(-12px) rotate(3deg)}
    75%{transform:translateY(-6px) rotate(-1deg)}
  }

  .label-top {
    font-weight: 200; letter-spacing: 0.45em; font-size: 0.65rem;
    color: var(--color-primary); text-transform: uppercase; margin-bottom: 1.5rem;
    opacity: 0; animation: slide-down 1s 0.3s forwards;
  }
  @keyframes slide-down { from{opacity:0;transform:translateY(-15px)} to{opacity:1;transform:translateY(0)} }

  .baby-name {
    font-family: 'Pinyon Script', cursive;
    font-size: clamp(4rem, 14vw, 8.5rem);
    color: var(--navy);
    line-height: 1;
    opacity: 0; animation: slide-down 1s 0.5s forwards;
    text-shadow: 0 2px 20px rgba(91,155,200,0.2);
  }

  .cross-divider {
    margin: 2rem auto;
    display: flex; align-items: center; gap: 1rem;
    width: fit-content;
    opacity: 0; animation: slide-down 1s 0.7s forwards;
  }
  .cross-line { width: 70px; height: 1px; background: linear-gradient(to right, transparent, var(--color-primary)); }
  .cross-line.rev { background: linear-gradient(to left, transparent, var(--color-primary)); }
  .cross { font-size: 1.3rem; color: var(--color-primary); }

  .date-hero { font-weight: 300; letter-spacing: 0.2em; font-size: 0.9rem; color: var(--navy); opacity: 0; animation: slide-down 1s 0.9s forwards; }

  /* ── SECCIONES ── */
  .blue-section { background: var(--sky-pale); }
  .white-section { background: var(--white); }
  .cloud-section { background: var(--color-bg); }

  .pad { padding: 6rem 2rem; }

  .sec-title {
    font-family: 'Gilda Display', serif;
    font-size: clamp(2rem, 5vw, 3rem);
    color: var(--navy);
    text-align: center; margin-bottom: 0.5rem;
  }
  .sec-sub {
    font-weight: 200; letter-spacing: 0.4em; font-size: 0.6rem;
    color: var(--color-primary); text-transform: uppercase;
    text-align: center; margin-bottom: 4rem;
  }
  .sec-line {
    width: 60px; height: 2px;
    background: linear-gradient(to right, var(--sky), var(--color-primary));
    margin: 0.8rem auto 4rem;
    border-radius: 2px;
  }

  /* ── PARENTS ── */
  .parents-block { text-align: center; max-width: 550px; margin: 0 auto; }
  .parents-verse {
    font-family: 'Gilda Display', serif;
    font-style: italic;
    font-size: 1.2rem;
    color: var(--color-primary);
    line-height: 1.7;
    margin-bottom: 2.5rem;
    opacity: 0; transition: opacity 0.8s, transform 0.8s;
    transform: translateY(20px);
  }
  .parents-verse.visible { opacity: 1; transform: translateY(0); }
  .parents-names { margin-top: 2rem; }
  .parent-pair {
    display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 1rem;
    margin-bottom: 2rem;
    opacity: 0; transition: opacity 0.6s, transform 0.6s;
    transform: translateY(20px);
  }
  .parent-pair.visible { opacity: 1; transform: translateY(0); }
  .parent-name { font-family: 'Gilda Display', serif; font-size: 1.05rem; color: var(--navy); }
  .parent-role { font-size: 0.6rem; letter-spacing: 0.3em; color: var(--color-primary); text-transform: uppercase; font-weight: 300; }
  .ampersand { font-family: 'Pinyon Script', cursive; font-size: 2rem; color: var(--color-primary); }

  /* ── EVENTO ── */
  .event-central {
    max-width: 450px; margin: 0 auto; text-align: center;
    border: 1px solid rgba(91,155,200,0.3);
    padding: 3.5rem 2.5rem;
    position: relative;
    background: var(--white);
    box-shadow: 0 10px 60px rgba(91,155,200,0.08);
    opacity: 0; transition: opacity 0.8s, transform 0.8s;
    transform: scale(0.95);
  }
  .event-central.visible { opacity: 1; transform: scale(1); }
  .event-central::before {
    content: '✦';
    position: absolute; top: -0.8rem; left: 50%; transform: translateX(-50%);
    background: var(--white); padding: 0 0.8rem;
    color: var(--color-primary); font-size: 1.1rem;
  }
  .ev-icon-big { font-size: 3rem; margin-bottom: 1.5rem; }
  .ev-ceremony { font-family: 'Gilda Display', serif; font-size: 1.5rem; color: var(--navy); margin-bottom: 0.5rem; }
  .ev-time-big { font-family: 'Pinyon Script', cursive; font-size: 3rem; color: var(--color-primary); margin: 0.5rem 0; }
  .ev-location { font-weight: 300; color: var(--color-primary); font-size: 0.9rem; line-height: 1.7; margin-bottom: 2rem; }
  .btn-sky {
    display: inline-block;
    background: var(--navy);
    color: var(--white);
    padding: 0.9rem 3rem;
    font-size: 0.6rem; letter-spacing: 0.35em; text-transform: uppercase;
    text-decoration: none; font-weight: 400;
    transition: background 0.3s, transform 0.3s;
  }
  .btn-sky:hover { background: var(--color-primary); transform: translateY(-2px); }

  /* Recepción card */
  .reception-card {
    max-width: 450px; margin: 2rem auto 0;
    padding: 2rem 2.5rem;
    background: var(--sky-pale);
    border: 1px solid rgba(91,155,200,0.2);
    text-align: center;
    opacity: 0; transition: opacity 0.8s 0.2s, transform 0.8s 0.2s;
    transform: translateY(20px);
  }
  .reception-card.visible { opacity: 1; transform: translateY(0); }

  /* ── ITINERARIO ── */
  .it-sky { max-width: 480px; margin: 0 auto; }
  .it-row {
    display: flex; align-items: flex-start; gap: 1.5rem;
    margin-bottom: 2.5rem;
    opacity: 0; transition: opacity 0.6s, transform 0.6s;
    transform: translateX(-20px);
  }
  .it-row.visible { opacity: 1; transform: translateX(0); }
  .it-circle {
    flex-shrink: 0; width: 44px; height: 44px;
    background: var(--sky);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem;
  }
  .it-time-sky { font-size: 0.6rem; letter-spacing: 0.3em; color: var(--color-primary); text-transform: uppercase; margin-bottom: 0.3rem; }
  .it-title-sky { font-family: 'Gilda Display', serif; font-size: 1rem; color: var(--navy); }

  /* ── GALERÍA ── */
  .gal-sky {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 8px;
    max-width: 900px; margin: 0 auto;
    padding: 0 1rem;
  }
  .gal-sky img { width: 100%; height: 260px; object-fit: cover; transition: filter 0.4s, transform 0.4s; cursor: pointer; border-radius: 1.5rem; }
  .gal-sky img:hover { filter: brightness(1) saturate(1); transform: scale(1.02); }

  /* ── RSVP ── */
  .rsvp-sky {
    background: linear-gradient(160deg, var(--navy) 0%, #264d73 100%);
    padding: 7rem 2rem; text-align: center;
    position: relative; overflow: hidden;
  }
  .rsvp-sky::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse 80% 80% at 50% 100%, rgba(168,200,232,0.15), transparent);
  }
  .rsvp-sky-title { font-family: 'Pinyon Script', cursive; font-size: clamp(3rem,10vw,6rem); color: var(--sky); margin-bottom: 1rem; }
  .rsvp-sky-sub { font-weight: 200; letter-spacing: 0.05em; color: rgba(255,255,255,0.65); margin-bottom: 3rem; font-size: 0.9rem; line-height: 1.8; }
  .btn-white {
    display: inline-block;
    background: transparent;
    border: 1.5px solid var(--sky);
    color: var(--sky);
    padding: 1rem 3.5rem;
    font-size: 0.6rem; letter-spacing: 0.35em; text-transform: uppercase;
    text-decoration: none;
    transition: background 0.3s, color 0.3s;
  }
  .btn-white:hover { background: var(--sky); color: var(--navy); }
  .dress-code { margin-top: 2rem; font-size: 0.7rem; letter-spacing: 0.3em; color: rgba(255,255,255,0.3); text-transform: uppercase; }

  footer { background: var(--navy); color: rgba(255,255,255,0.3); text-align: center; padding: 2.5rem 2rem; font-size: 0.8rem; }
  .footer-script { font-family: 'Pinyon Script', cursive; font-size: 2rem; color: var(--sky); display: block; margin-bottom: 0.5rem; }
</style>
</head>
<body>

<div id="bubbles"></div>

<!-- HERO -->
<section class="hero" data-field="portada_url">
  <div class="hero-content">
    <div class="dove">🕊️</div>
    <p class="label-top" data-field="mensaje_secundario">{{mensaje_secundario}}</p>
    <h1 class="baby-name" data-field="nombre_festejado">{{nombre_festejado}}</h1>
    <div class="cross-divider">
      <div class="cross-line"></div>
      <div class="cross">✟</div>
      <div class="cross-line rev"></div>
    </div>
    <p class="date-hero" data-field="fecha_hero">{{fecha_hero}}</p>
  </div>
  <!-- Nubes SVG -->
  <svg class="clouds-svg" viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <path d="M0,80 C200,40 400,100 600,70 C800,40 1000,90 1200,60 C1320,45 1380,70 1440,60 L1440,120 L0,120 Z" fill="#F0F7FC"/>
  </svg>
</section>

<!-- PADRES / PADRINOS -->
<section class="cloud-section pad">
  <p class="sec-title">Su Familia</p>
  <div class="sec-line"></div>
  <div class="parents-block">
    <p class="parents-verse">
      "Dejen que los niños vengan a mí, y no se lo impidan, porque el reino de los cielos es de quienes son como ellos."<br><span style="font-size:.85rem;color:var(--color-primary)">— Mateo 19:14</span>
    </p>
    <div class="parent-pair">
      <div><div class="parent-name" data-field="madre">{{madre}}</div><div class="parent-role">Mamá</div></div>
      <div class="ampersand">&amp;</div>
      <div><div class="parent-name" data-field="padre">{{padre}}</div><div class="parent-role">Papá</div></div>
    </div>
    <div class="parent-pair" style="transition-delay:.2s">
      <div><div class="parent-name" data-field="madrina">{{madrina}}</div><div class="parent-role">Madrina</div></div>
      <div class="ampersand">&amp;</div>
      <div><div class="parent-name" data-field="padrino">{{padrino}}</div><div class="parent-role">Padrino</div></div>
    </div>
  </div>
</section>

<!-- EVENTO -->
<section class="blue-section pad">
  <p class="sec-title">El Sacramento</p>
  <div class="sec-line"></div>
  <div class="event-central">
    <div class="ev-icon-big">⛪</div>
    <div class="ev-ceremony">Bautismo de <span data-field="nombre_festejado">{{nombre_festejado}}</span></div>
    <div class="ev-time-big" data-field="hora_ceremonia">{{hora_ceremonia}}</div>
    <div class="ev-location">
      <div data-field="lugar_ceremonia">{{lugar_ceremonia}}</div>
      <div data-field="direccion_ceremonia">{{direccion_ceremonia}}</div>
    </div>
    <a href="#" class="btn-sky">Ver en el mapa</a>
  </div>
  <div class="reception-card">
    <div class="sec-sub" style="margin-bottom:0.5rem">Después de la ceremonia</div>
    <p class="sec-title" style="font-size:1.4rem;margin-bottom:0.5rem">Convivio de Celebración</p>
    <p style="font-weight:300;color:var(--color-primary);font-size:0.9rem;line-height:1.7;margin-bottom:1.5rem">
      <span data-field="lugar_recepcion">{{lugar_recepcion}}</span> · <span data-field="direccion_recepcion">{{direccion_recepcion}}</span><br><span data-field="hora_recepcion">{{hora_recepcion}}</span> — hasta que la fiesta lo decida
    </p>
    <a href="#" class="btn-sky" style="background:var(--color-primary)">Ver ubicación</a>
  </div>
</section>

<!-- ITINERARIO -->
<section class="white-section pad">
  <p class="sec-title">El Día de <span data-field="nombre_festejado">{{nombre_festejado}}</span></p>
  <div class="sec-line"></div>
  <div class="it-sky" data-field="itin_html">
    {{itin_html}}
  </div>
</section>

<!-- GALERÍA -->
<section class="cloud-section pad" style="padding-bottom:0">
  <p class="sec-title">Un Ángel en Casa</p>
  <div class="sec-line"></div>
</section>
<div class="gal-sky" data-field="galeria_html">
  {{galeria_html}}
</div>

<!-- RSVP -->
<section class="rsvp-sky">
  <h2 class="rsvp-sky-title">¡Celebra con nosotros!</h2>
  <p class="rsvp-sky-sub">Confirma tu asistencia antes del <strong data-field="confirmacion_fecha">{{confirmacion_fecha}}</strong><br>Para organizar mejor el festejo</p>
  <a href="{{whatsapp_url}}" class="btn-white" data-field="whatsapp_url">Confirmar Asistencia</a>
  <p class="dress-code">Código de vestimenta · <span data-field="vestimenta">{{vestimenta}}</span></p>
</section>

<footer>
  <span class="footer-script" data-field="nombre_festejado">{{nombre_festejado}}</span>
  Bautizo · <span data-field="fecha_hero">{{fecha_hero}}</span> · Hecha con amor
</footer>

<script>
// Burbujas
const bContainer = document.getElementById('bubbles');
for (let i = 0; i < 20; i++) {
  const b = document.createElement('div');
  b.className = 'bubble';
  const size = Math.random() * 30 + 10;
  b.style.cssText = \`
    left:\${Math.random()*100}%;
    width:\${size}px; height:\${size}px;
    animation-duration:\${Math.random()*15+10}s;
    animation-delay:\${Math.random()*10}s;
    opacity:\${Math.random()*0.4+0.1};
  \`;
  bContainer.appendChild(b);
}

// Scroll reveal
const obs = new IntersectionObserver(e => e.forEach(x => x.isIntersecting && x.target.classList.add('visible')), { threshold: 0.1 });
document.querySelectorAll('.parents-verse,.parent-pair,.event-central,.reception-card,.it-row').forEach(el => obs.observe(el));
</script>
</body>
</html>
`;
