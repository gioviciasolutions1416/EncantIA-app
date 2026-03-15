export const GRADUACION_2 = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Graduación — {{nombre_festejado}}</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Mulish:wght@200;300;400;600&family=Imperial+Script&display=swap" rel="stylesheet">
<style>
  :root {
    --color-primary: {{color_primary
    /* Mapeo adaptado a locales */
    --gold: var(--color-primary);
    --navy: var(--color-secondary);
    --cream: var(--color-bg);
  }};
    --color-secondary: {{color_secondary}};
    --color-bg: {{color_bg}};
    --font-titulos: '{{font_titulos}}', serif;
    --font-cuerpo: '{{font_cuerpo}}', sans-serif;
  --navy2:#132944;
  --gold-light:#F2C04E;
  --gold-pale:#FBE9B0;
  --light-bg:#F4F2EC;
  --muted-navy:rgba(11,31,58,.55);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Mulish',sans-serif;background:var(--color-bg);color:var(--color-secondary);overflow-x:hidden}

/* ── CONFETTI CELEBRATION ── */
#confetti{position:fixed;inset:0;pointer-events:none;z-index:0}
.conf{position:absolute;width:8px;height:8px;animation:conf-anim linear infinite;opacity:0}
@keyframes conf-anim{
  0%{transform:translateY(-20px) rotate(0deg);opacity:0}
  5%{opacity:1}
  95%{opacity:.7}
  100%{transform:translateY(110vh) rotate(720deg);opacity:0}
}

/* ── HERO ── */
.hero{
  min-height:100vh;
  background:var(--color-secondary);
  position:relative;overflow:hidden;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  text-align:center;padding:3rem 2rem;
}
.hero::before{
  content:'';position:absolute;inset:0;
  background:url('{{portada_url}}') center/cover no-repeat;
  opacity:.15;
}
/* Rayos de luz */
.hero-rays{
  position:absolute;inset:0;
  background:conic-gradient(from 180deg at 50% 120%,
    rgba(201,151,28,0) 0deg,
    rgba(201,151,28,.04) 10deg,
    rgba(201,151,28,0) 20deg,
    rgba(201,151,28,.03) 30deg,
    rgba(201,151,28,0) 40deg,
    rgba(201,151,28,.04) 50deg,
    rgba(201,151,28,0) 60deg
  );
  animation:rotate-rays 30s linear infinite;
}
@keyframes rotate-rays{to{transform:rotate(360deg)}}

.hero-content{position:relative;z-index:2}

.diploma-frame{
  display:inline-block;
  border:1px solid rgba(201,151,28,.4);
  padding:clamp(2.5rem,5vw,4.5rem) clamp(2rem,5vw,5rem);
  position:relative;
  margin-bottom:0;
  animation:frame-reveal 1.5s ease both;
}
@keyframes frame-reveal{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}
.diploma-frame::before,.diploma-frame::after{
  content:'';position:absolute;
  width:clamp(25px,4vw,40px);height:clamp(25px,4vw,40px);
  border-color:var(--color-primary);border-style:solid;
}
.diploma-frame::before{top:-1px;left:-1px;border-width:2px 0 0 2px}
.diploma-frame::after{bottom:-1px;right:-1px;border-width:0 2px 2px 0}

.hero-seal{
  width:80px;height:80px;
  border:1px solid rgba(201,151,28,.5);
  border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  margin:0 auto 2rem;
  font-size:2rem;
  animation:rotate-seal 20s linear infinite;
  position:relative;
}
.hero-seal::before{
  content:'✦ GRADUACIÓN ✦ 2026 ✦ GENERACIÓN ✦';
  position:absolute;
  width:100%;height:100%;
  display:flex;align-items:center;justify-content:center;
  font-size:.3rem;letter-spacing:.3em;
  color:rgba(201,151,28,.4);
  top:-130%;
  white-space:nowrap;
  transform-origin:50% 130%;
  animation:rotate-text 20s linear infinite;
}
@keyframes rotate-seal{to{transform:rotate(360deg)}}
@keyframes rotate-text{to{transform:rotate(-360deg)}}

.hero-subtitle{font-size:.58rem;letter-spacing:.5em;text-transform:uppercase;color:var(--color-primary);margin-bottom:1.5rem;font-weight:300;animation:fade-up .9s .3s both}
@keyframes fade-up{from{opacity:0;transform:translateY(15px)}to{opacity:1;transform:translateY(0)}}

.hero-name-grad{
  font-family:'Imperial Script',cursive;
  font-size:clamp(3.5rem,10vw,7.5rem);
  color:var(--gold-pale);
  line-height:1;
  text-shadow:0 0 40px rgba(201,151,28,.4);
  animation:fade-up .9s .5s both;
  display:block;
}

.hero-degree-g{
  font-family:'Playfair Display',serif;
  font-size:clamp(.9rem,2.5vw,1.3rem);
  color:rgba(255,255,255,.65);
  letter-spacing:.1em;
  margin:1rem 0;
  animation:fade-up .9s .7s both;
}
.hero-degree-g strong{color:var(--gold-light);font-style:italic}

.hero-date-g{
  font-size:.7rem;letter-spacing:.35em;text-transform:uppercase;
  color:rgba(255,255,255,.35);
  animation:fade-up .9s .9s both;
}

/* ── RIBBON ── */
.ribbon{
  background:var(--color-primary);
  padding:1.5rem clamp(2rem,6vw,6rem);
  display:flex;align-items:center;justify-content:center;gap:2rem;
  flex-wrap:wrap;
}
.ribbon-item{text-align:center;color:var(--color-secondary)}
.ribbon-val{font-family:'Playfair Display',serif;font-size:1.8rem;font-style:italic}
.ribbon-key{font-size:.55rem;letter-spacing:.4em;text-transform:uppercase;margin-top:.2rem;opacity:.7}
.ribbon-sep{width:1px;height:40px;background:rgba(11,31,58,.2)}
@media(max-width:500px){.ribbon-sep{display:none}}

/* ── SECCIONES ── */
.light-sec{background:var(--light-bg)}
.cream-sec{background:var(--color-bg)}
.navy-sec{background:var(--color-secondary);color:var(--color-bg)}
.pad{padding:6rem clamp(2rem,6vw,6rem)}

.sec-eyebrow-g{font-size:.58rem;letter-spacing:.5em;text-transform:uppercase;color:var(--color-primary);margin-bottom:.7rem;font-weight:300}
.navy-sec .sec-eyebrow-g{color:var(--color-primary)}
.sec-h-g{font-family:'Playfair Display',serif;font-style:italic;font-size:clamp(2rem,5vw,3.2rem);line-height:1.15;margin-bottom:3rem}
.navy-sec .sec-h-g{color:var(--gold-pale)}

/* ── EVENTS GOLD ── */
.ev-gold-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;max-width:900px;margin:0 auto}
@media(max-width:600px){.ev-gold-grid{grid-template-columns:1fr}}
.ev-gold{
  background:var(--color-secondary);color:var(--color-bg);
  padding:3.5rem 2.5rem;
  position:relative;overflow:hidden;
  opacity:0;transform:translateY(30px);
  transition:opacity .7s,transform .7s;
}
.ev-gold.visible{opacity:1;transform:translateY(0)}
.ev-gold-stripe{position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(to right,var(--color-primary),var(--gold-light))}
.ev-gold-num{font-family:'Playfair Display',serif;font-style:italic;font-size:6rem;position:absolute;top:-1rem;right:1rem;color:rgba(255,255,255,.04);line-height:1}
.ev-gold-label{font-size:.55rem;letter-spacing:.4em;text-transform:uppercase;color:var(--color-primary);margin-bottom:1rem}
.ev-gold-name{font-family:'Playfair Display',serif;font-size:1.6rem;margin-bottom:.3rem;color:var(--color-bg)}
.ev-gold-time{font-family:'Imperial Script',cursive;font-size:3.5rem;color:var(--gold-light);line-height:1;margin:.3rem 0}
.ev-gold-place{font-size:.8rem;color:rgba(253,251,245,.45);line-height:1.7;margin-bottom:2rem;font-weight:200}
.btn-gold-g{
  display:inline-block;border:1px solid var(--color-primary);color:var(--color-primary);
  padding:.7rem 2rem;font-size:.58rem;letter-spacing:.3em;text-transform:uppercase;
  text-decoration:none;transition:background .3s,color .3s;
}
.btn-gold-g:hover{background:var(--color-primary);color:var(--color-secondary)}

/* ── TIMELINE ── */
.tl-gold{max-width:650px;margin:0 auto}
.tl-gold-row{
  display:grid;grid-template-columns:100px 1fr;gap:2rem;align-items:flex-start;
  padding-bottom:2.5rem;position:relative;
  opacity:0;transition:opacity .6s,transform .6s;transform:translateX(-20px);
}
.tl-gold-row.visible{opacity:1;transform:translateX(0)}
.tl-gold-row:not(:last-child)::after{content:'';position:absolute;left:49px;top:2rem;bottom:0;width:1px;background:linear-gradient(to bottom,var(--gold-pale),transparent)}
.tl-gold-time{font-family:'Playfair Display',serif;font-style:italic;font-size:1.5rem;color:var(--color-primary);text-align:right;line-height:1.2}
.tl-gold-body{border-left:1px solid rgba(201,151,28,.2);padding-left:2rem}
.tl-gold-name{font-size:1rem;color:var(--color-secondary);margin-bottom:.3rem;font-weight:300}
.tl-gold-desc{font-size:.75rem;color:var(--muted-navy)}

/* ── GALERÍA ── */
.gal-gold{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  grid-template-rows:220px 220px;
  gap:4px;
  max-width:1000px;margin:0 auto;
}
@media(max-width:650px){.gal-gold{grid-template-columns:1fr 1fr;grid-template-rows:auto}}
.gg-item{overflow:hidden;cursor:pointer;position:relative}
.gg-item img{width:100%;height:100%;object-fit:cover;filter:brightness(.85) saturate(.9);transition:filter .5s,transform .6s}
.gg-item:hover img{filter:brightness(1) saturate(1.1);transform:scale(1.06)}
.gg-item.r2{grid-row:span 2}
.gg-item.c2{grid-column:span 2}
.gg-item::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(201,151,28,.2),transparent);opacity:0;transition:opacity .4s}
.gg-item:hover::after{opacity:1}

/* ── RSVP ── */
.rsvp-gold{
  background:linear-gradient(160deg,var(--color-secondary) 0%,var(--navy2) 100%);
  padding:8rem clamp(2rem,6vw,6rem);
  text-align:center;position:relative;overflow:hidden;
}
.rsvp-gold::before{
  content:'';position:absolute;
  left:50%;top:50%;transform:translate(-50%,-50%);
  width:600px;height:600px;
  background:radial-gradient(circle,rgba(201,151,28,.07),transparent 70%);
  border-radius:50%;
}
.rsvp-gold-name{font-family:'Imperial Script',cursive;font-size:clamp(3rem,10vw,7rem);color:var(--gold-pale);line-height:1;margin-bottom:.5rem;text-shadow:0 0 30px rgba(201,151,28,.3)}
.rsvp-gold-desc{font-family:'Playfair Display',serif;font-style:italic;font-size:1rem;color:rgba(253,251,245,.5);margin-bottom:3.5rem}
.btn-gold-fill{
  display:inline-block;
  background:var(--color-primary);color:var(--color-secondary);
  padding:1.2rem 4.5rem;
  font-family:'Mulish',sans-serif;
  font-size:.65rem;letter-spacing:.4em;text-transform:uppercase;
  text-decoration:none;font-weight:600;
  box-shadow:0 8px 30px rgba(201,151,28,.3);
  transition:background .3s,transform .3s,box-shadow .3s;
}
.btn-gold-fill:hover{background:var(--gold-light);transform:translateY(-4px);box-shadow:0 15px 40px rgba(201,151,28,.5)}
.rsvp-gold-deadline{margin-top:2rem;font-size:.6rem;letter-spacing:.3em;color:rgba(255,255,255,.2);text-transform:uppercase}

footer{background:var(--color-secondary);border-top:1px solid rgba(201,151,28,.08);padding:3rem;text-align:center;color:rgba(201,151,28,.25);font-size:.75rem;letter-spacing:.15em}
.f-imp{font-family:'Imperial Script',cursive;font-size:2.5rem;color:var(--color-primary);display:block;margin-bottom:.5rem}
</style>
</head>
<body>

<div id="confetti"></div>

<!-- HERO -->
<section class="hero" data-field="portada_url">
  <div class="hero-rays"></div>
  <div class="hero-content">
    <div class="diploma-frame">
      <div class="hero-seal">🎓</div>
      <p class="hero-subtitle" data-field="mensaje_secundario">{{mensaje_secundario}}</p>
      <span class="hero-name-grad" data-field="nombre_festejado">{{nombre_festejado}}</span>
      <p class="hero-degree-g">Licenciatura en <strong data-field="carrera">{{carrera}}</strong></p>
      <p class="hero-date-g"><span data-field="institucion">{{institucion}}</span> · <span data-field="fecha_hero">{{fecha_hero}}</span></p>
    </div>
  </div>
</section>

<!-- RIBBON INFO -->
<div class="ribbon">
  <div class="ribbon-item"><div class="ribbon-val" style="font-size:1.2rem" data-field="generacion">{{generacion}}</div><div class="ribbon-key">Generación</div></div>
  <div class="ribbon-sep"></div>
  <div class="ribbon-item"><div class="ribbon-val">Éxito</div><div class="ribbon-key">Meta alcanzada</div></div>
  <div class="ribbon-sep"></div>
  <div class="ribbon-item"><div class="ribbon-val" data-field="carrera">{{carrera}}</div><div class="ribbon-key">Carrera</div></div>
  <div class="ribbon-sep"></div>
  <div class="ribbon-item"><div class="ribbon-val" data-field="institucion">{{institucion}}</div><div class="ribbon-key">Institución</div></div>
</div>

<!-- EVENTOS -->
<section class="cream-sec pad">
  <p class="sec-eyebrow-g">Dos momentos especiales</p>
  <h2 class="sec-h-g">Los Eventos</h2>
  <div class="ev-gold-grid">
    <div class="ev-gold">
      <div class="ev-gold-stripe"></div>
      <div class="ev-gold-num">01</div>
      <div class="ev-gold-label">Acto académico</div>
      <div class="ev-gold-name">Ceremonia de Graduación</div>
      <div class="ev-gold-time" data-field="hora_ceremonia">{{hora_ceremonia}}</div>
      <div class="ev-gold-place"><span data-field="lugar_ceremonia">{{lugar_ceremonia}}</span><br><span data-field="direccion_ceremonia">{{direccion_ceremonia}}</span></div>
      <a href="#" class="btn-gold-g">Ver mapa</a>
    </div>
    <div class="ev-gold" style="transition-delay:.15s">
      <div class="ev-gold-stripe"></div>
      <div class="ev-gold-num">02</div>
      <div class="ev-gold-label">Celebración privada</div>
      <div class="ev-gold-name">Festejo Familiar</div>
      <div class="ev-gold-time" data-field="hora_recepcion">{{hora_recepcion}}</div>
      <div class="ev-gold-place"><span data-field="lugar_recepcion">{{lugar_recepcion}}</span><br><span data-field="direccion_recepcion">{{direccion_recepcion}}</span></div>
      <a href="#" class="btn-gold-g">Ver mapa</a>
    </div>
  </div>
</section>

<!-- TIMELINE -->
<section class="light-sec pad">
  <p class="sec-eyebrow-g">El programa</p>
  <h2 class="sec-h-g">Agenda del Día</h2>
  <div class="tl-gold" data-field="itin_html">
    {{itin_html}}
  </div>
</section>

<!-- GALERÍA -->
<section class="navy-sec" style="padding:5rem 0">
  <div style="padding:0 clamp(2rem,6vw,6rem) 3rem;text-align:center">
    <p class="sec-eyebrow-g">El camino recorrido</p>
    <h2 class="sec-h-g">Momentos que definen</h2>
  </div>
  <div class="gal-gold" data-field="galeria_html">
    {{galeria_html}}
  </div>
</section>

<!-- RSVP -->
<section class="rsvp-gold">
  <div style="position:relative;z-index:1">
    <p style="font-size:.58rem;letter-spacing:.5em;text-transform:uppercase;color:var(--color-primary);margin-bottom:1rem">Confirma tu asistencia</p>
    <div class="rsvp-gold-name" data-field="nombre_festejado">{{nombre_festejado}}</div>
    <p class="rsvp-gold-desc"><span data-field="fecha_hero">{{fecha_hero}}</span> · <span data-field="institucion">{{institucion}}</span></p>
    <a href="{{whatsapp_url}}" class="btn-gold-fill" data-field="whatsapp_url">Confirmar por WhatsApp</a>
    <p class="rsvp-gold-deadline">Antes del <span data-field="confirmacion_fecha">{{confirmacion_fecha}}</span> · Cupo limitado</p>
  </div>
</section>

<footer>
  <span class="f-imp" data-field="nombre_festejado">{{nombre_festejado}}</span>
  Graduación <span data-field="generacion">{{generacion}}</span> · <span data-field="institucion">{{institucion}}</span> · Hecha con amor
</footer>

<script>
// Confetti dorado
const cc=document.getElementById('confetti');
const cols=['#C9971C','#F2C04E','#FBE9B0','#0B1F3A','#FFFFFF','#D4AF5A'];
for(let i=0;i<50;i++){
  const el=document.createElement('div');
  el.className='conf';
  const size=Math.random()*8+4;
  el.style.cssText=\`
    left:\${Math.random()*100}%;
    width:\${size}px;height:\${size*(Math.random()>.5?1:3)}px;
    background:\${cols[Math.floor(Math.random()*cols.length)]};
    animation-duration:\${Math.random()*10+8}s;
    animation-delay:\${Math.random()*12}s;
    border-radius:\${Math.random()>.5?'50%':'2px'};
    opacity:\${Math.random()*.5+.3};
  \`;
  cc.appendChild(el);
}

const obs=new IntersectionObserver(e=>e.forEach(x=>x.isIntersecting&&x.target.classList.add('visible')),{threshold:.1});
document.querySelectorAll('.ev-gold,.tl-gold-row').forEach(el=>obs.observe(el));
</script>
</body>
</html>
`;
