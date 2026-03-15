export const BABY_SHOWER_2 = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Baby Shower — {{nombre_madre}}</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Fraunces:ital,wght@0,300;0,400;1,400;1,600&family=Righteous&display=swap" rel="stylesheet">
<style>
  :root {
    --color-primary: {{color_primary
    /* Mapeo adaptado a locales */
    --peach: var(--color-primary);
    --lemon: var(--color-secondary);
    --cream: var(--color-bg);
  }};
    --color-secondary: {{color_secondary}};
    --color-bg: {{color_bg}};
    --font-titulos: '{{font_titulos}}', serif;
    --font-cuerpo: '{{font_cuerpo}}', sans-serif;
  --peach-pale:#FAD4BE;
  --mint:#7ECFB3;
  --mint-pale:#C2EBE0;
  --lilac:#C4A8E0;
  --dark:#1C1C2E;
  --warm-dark:#2D1F0E;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Syne',sans-serif;background:var(--color-bg);color:var(--warm-dark);overflow-x:hidden}

/* ── FLOATING SHAPES ── */
#shapes{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden}
.shape{position:absolute;animation:shape-float ease-in-out infinite alternate}
@keyframes shape-float{from{transform:translate(0,0) rotate(0deg)}to{transform:translate(15px,25px) rotate(15deg)}}

/* ── HERO ── */
.hero{
  min-height:100vh;
  display:grid;grid-template-rows:1fr auto;
  position:relative;overflow:hidden;
  background: linear-gradient(rgba(250,212,190,0.75), var(--peach-pale)), url('{{portada_url}}') center/cover no-repeat;
}

.hero-waves{
  position:absolute;bottom:0;left:0;right:0;pointer-events:none;
}

.hero-content{
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  text-align:center;padding:clamp(3rem,8vw,6rem) 2rem 0;
  position:relative;z-index:2;
}

.sticker{
  display:inline-flex;align-items:center;justify-content:center;
  width:100px;height:100px;
  background:var(--color-secondary);
  border-radius:50%;
  font-size:3rem;
  margin-bottom:2rem;
  animation:sticker-wobble 3s ease-in-out infinite;
  box-shadow:4px 4px 0 var(--warm-dark);
}
@keyframes sticker-wobble{0%,100%{transform:rotate(-5deg) scale(1)}50%{transform:rotate(5deg) scale(1.05)}}

.hero-eyebrow{
  font-size:.7rem;letter-spacing:.4em;text-transform:uppercase;
  color:var(--warm-dark);opacity:.6;
  margin-bottom:1rem;font-weight:400;
  animation:rise-in 1s .2s both;
}
@keyframes rise-in{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}

.hero-name-bs{
  font-family:'Righteous',cursive;
  font-size:clamp(4rem,16vw,11rem);
  line-height:.9;
  color:var(--dark);
  position:relative;
  animation:rise-in 1s .4s both;
}
.hero-name-bs .outline-txt{
  -webkit-text-stroke:2px var(--dark);
  color:transparent;
  display:block;
  font-size:.6em;
  letter-spacing:.05em;
}

.hero-tag-row{
  display:flex;flex-wrap:wrap;gap:.8rem;justify-content:center;
  margin:2rem 0;
  animation:rise-in 1s .6s both;
}
.hero-tag{
  background:var(--dark);color:var(--color-bg);
  padding:.5rem 1.3rem;border-radius:50px;
  font-size:.65rem;font-weight:400;letter-spacing:.1em;
}
.hero-tag.accent{background:var(--mint);color:var(--dark)}
.hero-tag.accent2{background:var(--color-secondary);color:var(--dark)}

.hero-date-bs{
  font-family:'Fraunces',serif;font-style:italic;
  font-size:clamp(1rem,3vw,1.4rem);
  color:var(--warm-dark);opacity:.7;
  animation:rise-in 1s .8s both;
}

/* ── MARQUEE ── */
.marquee-wrap{
  overflow:hidden;
  background:var(--dark);
  padding:.8rem 0;
  position:relative;z-index:2;
}
.marquee-track{
  display:flex;gap:2rem;
  animation:marquee-roll 20s linear infinite;
  white-space:nowrap;
}
@keyframes marquee-roll{to{transform:translateX(-50%)}}
.marquee-item{
  font-family:'Righteous',cursive;
  font-size:.9rem;letter-spacing:.2em;
  color:var(--color-primary);
  flex-shrink:0;
}
.marquee-item.alt{color:var(--mint)}
.marquee-item.alt2{color:var(--color-secondary)}

/* ── SECCIONES ── */
.mint-sec{background:var(--mint-pale)}
.lemon-sec{background:var(--color-secondary)}
.lilac-sec{background:var(--lilac);color:var(--dark)}
.dark-sec{background:var(--dark);color:var(--color-bg)}
.cream-sec{background:var(--color-bg)}
.peach-sec{background:var(--peach-pale)}
.pad{padding:6rem clamp(2rem,6vw,6rem)}

.sec-num{
  font-family:'Syne',sans-serif;font-weight:800;
  font-size:6rem;color:rgba(0,0,0,.05);
  line-height:1;margin-bottom:-.5rem;
}
.dark-sec .sec-num{color:rgba(255,255,255,.05)}
.sec-h-bs{
  font-family:'Righteous',cursive;
  font-size:clamp(2rem,6vw,4rem);
  line-height:1;margin-bottom:3rem;letter-spacing:.02em;
}
.accent-word{color:var(--color-primary)}
.accent-word2{color:var(--mint)}
.dark-sec .accent-word{color:var(--color-primary)}

/* ── FAMILIA ── */
.fam-retro-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1.5rem;max-width:800px;margin:0 auto}
.fam-retro-card{
  background:var(--color-bg);
  border:2px solid var(--dark);
  padding:2rem 1.5rem;
  position:relative;
  box-shadow:4px 4px 0 var(--dark);
  transition:transform .2s,box-shadow .2s;
  opacity:0;transform:translateY(20px);
}
.fam-retro-card.visible{opacity:1;transform:translateY(0);transition:opacity .6s,transform .6s,box-shadow .2s}
.fam-retro-card:hover{transform:translate(-3px,-3px);box-shadow:7px 7px 0 var(--dark)}
.frc-badge{
  position:absolute;top:-14px;left:1.5rem;
  background:var(--color-primary);color:var(--dark);
  font-size:.55rem;letter-spacing:.3em;text-transform:uppercase;
  padding:.3rem .8rem;border:2px solid var(--dark);font-weight:700;
}
.frc-name{font-family:'Fraunces',serif;font-style:italic;font-size:1.2rem;color:var(--dark);margin-top:1rem;line-height:1.4}

/* ── EVENTO ── */
.ev-retro-grid{display:grid;grid-template-columns:1fr 1fr;gap:2rem;max-width:900px;margin:0 auto}
@media(max-width:600px){.ev-retro-grid{grid-template-columns:1fr}}
.ev-retro{
  border:2px solid var(--color-bg);
  padding:3rem 2.5rem;
  position:relative;
  opacity:0;transform:scale(.95);
  transition:opacity .7s,transform .7s;
}
.ev-retro.visible{opacity:1;transform:scale(1)}
.ev-retro-num{
  position:absolute;top:1rem;right:1.5rem;
  font-family:'Syne',sans-serif;font-weight:800;
  font-size:5rem;color:rgba(255,255,255,.06);line-height:1;
}
.ev-retro-tag{
  display:inline-block;
  background:var(--color-primary);color:var(--dark);
  font-size:.55rem;letter-spacing:.3em;text-transform:uppercase;
  padding:.3rem 1rem;margin-bottom:1.5rem;font-weight:700;
  border:1px solid rgba(0,0,0,.15);
}
.ev-retro:nth-child(2) .ev-retro-tag{background:var(--mint)}
.ev-retro-name{font-family:'Righteous',cursive;font-size:1.8rem;letter-spacing:.02em;color:var(--color-bg);margin-bottom:.3rem}
.ev-retro-time{font-family:'Fraunces',serif;font-style:italic;font-size:4rem;color:var(--color-secondary);line-height:1;margin:.2rem 0}
.ev-retro:nth-child(2) .ev-retro-time{color:var(--mint)}
.ev-retro-place{font-size:.8rem;color:rgba(255,255,255,.45);line-height:1.7;margin-bottom:2rem;font-weight:300}
.btn-retro{
  display:inline-block;
  background:var(--color-bg);color:var(--dark);
  padding:.7rem 2rem;font-size:.6rem;letter-spacing:.25em;text-transform:uppercase;
  text-decoration:none;font-weight:700;border:2px solid var(--color-bg);
  transition:background .3s,color .3s;
}
.btn-retro:hover{background:transparent;color:var(--color-bg)}

/* ── ITINERARIO ── */
.it-retro-list{max-width:600px;margin:0 auto}
.it-retro-row{
  display:grid;grid-template-columns:80px 1fr;gap:2rem;
  padding:1.8rem 0;border-bottom:2px dashed rgba(0,0,0,.1);
  align-items:center;
  opacity:0;transition:opacity .6s,transform .6s;transform:translateX(-20px);
}
.it-retro-row.visible{opacity:1;transform:translateX(0)}
.it-retro-time{
  font-family:'Syne',sans-serif;font-weight:800;
  font-size:1.4rem;color:var(--color-primary);line-height:1;text-align:center;
}
.it-retro-name{font-size:1rem;color:var(--warm-dark);font-weight:400}
.it-retro-emoji{font-size:1.3rem;float:right}

/* ── WISHLIST ── */
.wl-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1.5rem;max-width:800px;margin:0 auto}
.wl-card{
  border:2px solid var(--dark);
  padding:2rem 1.5rem;text-align:center;
  background:var(--color-bg);
  position:relative;overflow:hidden;
  opacity:0;transform:translateY(20px);transition:opacity .6s,transform .6s;
}
.wl-card.visible{opacity:1;transform:translateY(0)}
.wl-card:hover{background:var(--color-secondary)}
.wl-emoji{font-size:2.5rem;margin-bottom:1rem}
.wl-title{font-family:'Righteous',cursive;font-size:1.1rem;margin-bottom:.5rem}
.wl-text{font-size:.8rem;font-weight:300;color:rgba(45,31,14,.6);line-height:1.6}

/* ── GALERÍA ── */
.gal-retro{display:grid;grid-template-columns:repeat(auto-fill, minmax(220px, 1fr));gap:1rem;padding:0 1.5rem;max-width:1000px;margin:0 auto}
.gal-retro img{width:100%;height:240px;object-fit:cover;transition:transform .5s,filter .4s;filter:saturate(.85);border:2px solid var(--dark);cursor:pointer}
.gal-retro img:hover{transform:scale(1.05);filter:saturate(1.2)}
@media(max-width:600px){.gal-retro{grid-template-columns:1fr 1fr}}

/* ── RSVP ── */
.rsvp-retro{
  padding:8rem clamp(2rem,6vw,6rem);
  background:var(--color-primary);
  text-align:center;position:relative;overflow:hidden;
}
.rsvp-retro::before{
  content:'';position:absolute;
  width:500px;height:500px;
  background:rgba(255,255,255,.2);
  border-radius:50%;
  top:-200px;right:-150px;
}
.rsvp-retro-badge{
  display:inline-block;
  background:var(--dark);color:var(--color-secondary);
  font-size:.6rem;letter-spacing:.4em;text-transform:uppercase;
  padding:.5rem 1.5rem;margin-bottom:2rem;font-weight:700;
}
.rsvp-retro-name{
  font-family:'Righteous',cursive;
  font-size:clamp(3.5rem,12vw,8rem);
  line-height:.9;color:var(--dark);margin-bottom:.5rem;
}
.rsvp-retro-sub{font-family:'Fraunces',serif;font-style:italic;font-size:1.1rem;color:var(--warm-dark);opacity:.7;margin-bottom:3rem}
.btn-dark-retro{
  display:inline-block;
  background:var(--dark);color:var(--color-bg);
  padding:1.2rem 4.5rem;
  font-family:'Syne',sans-serif;font-weight:700;
  font-size:.65rem;letter-spacing:.3em;text-transform:uppercase;
  text-decoration:none;
  border:2px solid var(--dark);
  box-shadow:5px 5px 0 rgba(0,0,0,.2);
  transition:transform .2s,box-shadow .2s,background .3s;
}
.btn-dark-retro:hover{transform:translate(-3px,-3px);box-shadow:8px 8px 0 rgba(0,0,0,.2);background:var(--warm-dark)}
.rsvp-code{margin-top:2rem;font-size:.6rem;letter-spacing:.3em;color:var(--warm-dark);opacity:.5;text-transform:uppercase}

footer{background:var(--dark);padding:3rem;text-align:center;color:rgba(255,255,255,.25);font-size:.75rem}
.f-right{font-family:'Righteous',cursive;font-size:2.5rem;color:var(--color-primary);display:block;margin-bottom:.5rem}
</style>
</head>
<body>

<div id="shapes"></div>

<!-- HERO -->
<section class="hero" data-field="portada_url">
  <!-- Olas -->
  <svg class="hero-waves" viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="position:absolute;bottom:0">
    <path d="M0,60 C360,120 720,0 1080,80 C1260,110 1380,50 1440,70 L1440,120 L0,120 Z" fill="#FFFBF4" opacity=".8"/>
    <path d="M0,80 C200,20 500,100 800,60 C1100,20 1300,90 1440,50 L1440,120 L0,120 Z" fill="#FFFBF4"/>
  </svg>

  <div class="hero-content">
    <div class="sticker">🍭</div>
    <p class="hero-eyebrow" data-field="mensaje_secundario">{{mensaje_secundario}}</p>
    <h1 class="hero-name-bs">
      <span data-field="nombre_madre">{{nombre_madre}}</span>
      <span class="outline-txt">Baby Shower</span>
    </h1>
    <div class="hero-tag-row">
      <span class="hero-tag">Mamá primeriza 🌸</span>
      <span class="hero-tag accent" data-field="fecha_bebe">Llegada: {{fecha_bebe}}</span>
      <span class="hero-tag accent2">¡Es sorpresa! 🎁</span>
    </div>
    <p class="hero-date-bs" data-field="fecha_hero">{{fecha_hero}}</p>
  </div>
</section>

<!-- MARQUEE -->
<div class="marquee-wrap">
  <div class="marquee-track">
    <span class="marquee-item">¡BIENVENIDO BEBÉ!</span>
    <span class="marquee-item alt">✦</span>
    <span class="marquee-item alt2">BABY SHOWER DE <span data-field="nombre_madre">{{nombre_madre}}</span></span>
    <span class="marquee-item">✦</span>
    <span class="marquee-item" data-field="fecha_hero">{{fecha_hero}}</span>
    <span class="marquee-item alt">✦</span>
    <span class="marquee-item alt2">¡VIENE UN ÁNGEL!</span>
    <span class="marquee-item">✦</span>
    <!-- duplicado para loop -->
    <span class="marquee-item">¡BIENVENIDO BEBÉ!</span>
    <span class="marquee-item alt">✦</span>
    <span class="marquee-item alt2">BABY SHOWER DE <span data-field="nombre_madre">{{nombre_madre}}</span></span>
    <span class="marquee-item">✦</span>
    <span class="marquee-item" data-field="fecha_hero">{{fecha_hero}}</span>
    <span class="marquee-item alt">✦</span>
    <span class="marquee-item alt2">¡VIENE UN ÁNGEL!</span>
    <span class="marquee-item">✦</span>
  </div>
</div>

<!-- FAMILIA -->
<section class="mint-sec pad">
  <div class="sec-num">01</div>
  <h2 class="sec-h-bs">La familia <span class="accent-word">celebra</span></h2>
  <div class="fam-retro-grid">
    <div class="fam-retro-card"><div class="frc-badge">Familia</div><div class="frc-name"><span data-field="madre">{{madre}}</span><br><span data-field="padre">{{padre}}</span></div></div>
    <div class="fam-retro-card" style="transition-delay:.1s"><div class="frc-badge">Padrinos</div><div class="frc-name" data-field="padrinos_html">{{padrinos_html}}</div></div>
    <div class="fam-retro-card" style="transition-delay:.2s"><div class="frc-badge">Madrina del evento</div><div class="frc-name">Raquel López</div></div>
  </div>
</section>

<!-- EVENTOS -->
<section class="dark-sec pad">
  <div class="sec-num">02</div>
  <h2 class="sec-h-bs">El <span class="accent-word2">festejo</span></h2>
  <div class="ev-retro-grid">
    <div class="ev-retro">
      <div class="ev-retro-num">01</div>
      <div class="ev-retro-tag">Celebración principal</div>
      <div class="ev-retro-name">Baby Shower</div>
      <div class="ev-retro-time" data-field="hora_ceremonia">{{hora_ceremonia}}</div>
      <div class="ev-retro-place"><span data-field="lugar_ceremonia">{{lugar_ceremonia}}</span><br><span data-field="direccion_ceremonia">{{direccion_ceremonia}}</span></div>
      <a href="#" class="btn-retro">Ver mapa →</a>
    </div>
    <div class="ev-retro" style="transition-delay:.15s">
      <div class="ev-retro-num">02</div>
      <div class="ev-retro-tag">Actividad especial</div>
      <div class="ev-retro-name">Gender Reveal</div>
      <div class="ev-retro-time">3 PM</div>
      <div class="ev-retro-place">¡La gran sorpresa!<br>Durante el festejo</div>
      <a href="#" class="btn-retro">Más info →</a>
    </div>
  </div>
</section>

<!-- ITINERARIO -->
<section class="lemon-sec pad">
  <div class="sec-num">03</div>
  <h2 class="sec-h-bs">El programa <span class="accent-word">✦</span></h2>
  <div class="it-retro-list" data-field="itin_html">
    {{itin_html}}
  </div>
</section>

<!-- LISTA DE DESEOS -->
<section class="cream-sec pad">
  <div class="sec-num">04</div>
  <h2 class="sec-h-bs">Lista de <span class="accent-word">regalos</span></h2>
  <div class="wl-grid">
    <div class="wl-card"><div class="wl-emoji">🎁</div><div class="wl-title">Mesa de Regalos</div><div class="wl-text" data-field="regalo_mensaje">{{regalo_mensaje}}</div></div>
    <div class="wl-card" style="transition-delay:.1s"><div class="wl-emoji">💳</div><div class="wl-title">Aportación libre</div><div class="wl-text">Cualquier cantidad para ayudar con los gastos del bebé</div></div>
    <div class="wl-card" style="transition-delay:.2s"><div class="wl-emoji">🤍</div><div class="wl-title">Tu presencia</div><div class="wl-text">¡Tu compañía es lo más valioso para nosotros!</div></div>
  </div>
</section>

<!-- GALERÍA -->
<section class="peach-sec" style="padding:5rem 0">
  <div style="padding:0 clamp(2rem,6vw,6rem) 3rem">
    <div class="sec-num">05</div>
    <h2 class="sec-h-bs">Mamá <span class="accent-word2">brilla</span></h2>
  </div>
  <div class="gal-retro" data-field="galeria_html">
    {{galeria_html}}
  </div>
</section>

<!-- RSVP -->
<section class="rsvp-retro">
  <div style="position:relative;z-index:1">
    <div class="rsvp-retro-badge">✦ Te esperamos ✦</div>
    <div class="rsvp-retro-name">¡Ven!</div>
    <p class="rsvp-retro-sub">Baby Shower de <span data-field="nombre_madre">{{nombre_madre}}</span> · <span data-field="fecha_hero">{{fecha_hero}}</span> · <span data-field="hora_ceremonia">{{hora_ceremonia}}</span></p>
    <a href="{{whatsapp_url}}" class="btn-dark-retro" data-field="whatsapp_url">Confirmar por WhatsApp</a>
    <p class="rsvp-code" data-field="vestimenta">Dress code: {{vestimenta}} — Confetti Welcome!</p>
  </div>
</section>

<footer>
  <span class="f-right"><span data-field="nombre_madre">{{nombre_madre}}</span> &amp; Bebé</span>
  Baby Shower · <span data-field="fecha_hero">{{fecha_hero}}</span> · Con mucho amor
</footer>

<script>
// Formas flotantes
const sh=document.getElementById('shapes');
const shapeTypes=[
  {bg:'rgba(244,165,123,.12)',w:80,h:80,br:'50%'},
  {bg:'rgba(126,207,179,.1)',w:60,h:60,br:'0'},
  {bg:'rgba(245,233,106,.1)',w:100,h:40,br:'50px'},
  {bg:'rgba(196,168,224,.1)',w:50,h:50,br:'50%'},
];
for(let i=0;i<12;i++){
  const s=shapeTypes[i%shapeTypes.length];
  const el=document.createElement('div');
  el.className='shape';
  el.style.cssText=\`
    left:\${Math.random()*100}%;top:\${Math.random()*100}%;
    width:\${s.w+(Math.random()*40)}px;height:\${s.h+(Math.random()*30)}px;
    background:\${s.bg};border-radius:\${s.br};
    animation-duration:\${Math.random()*5+4}s;
    animation-delay:\${Math.random()*4}s;
  \`;
  sh.appendChild(el);
}

const obs=new IntersectionObserver(e=>e.forEach(x=>x.isIntersecting&&x.target.classList.add('visible')),{threshold:.1});
document.querySelectorAll('.fam-retro-card,.ev-retro,.it-retro-row,.wl-card').forEach(el=>obs.observe(el));
</script>
</body>
</html>
`;
