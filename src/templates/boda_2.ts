export const BODA_2 = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{novia}} & {{novio}}</title>
<link href="https://fonts.googleapis.com/css2?family=Marcellus+SC&family=Tenor+Sans&family=Alex+Brush&display=swap" rel="stylesheet">
<style>
  :root {
    --color-primary: {{color_primary
    /* Mapeo adaptado a locales */
    --emerald: var(--color-primary);
    --champagne: var(--color-secondary);
    --ivory: var(--color-bg);
  }};
    --color-secondary: {{color_secondary}};
    --color-bg: {{color_bg}};
    --font-titulos: '{{font_titulos}}', serif;
    --font-cuerpo: '{{font_cuerpo}}', sans-serif;
  --emerald2:#164D3A;
  --champ-pale:#F0DFA0;
  --champ2:#A88A3A;
  --white:#FFFDF5;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Tenor Sans',sans-serif;background:var(--color-primary);color:var(--color-bg);overflow-x:hidden}

/* ── NOISE TEXTURE ── */
body::before{
  content:'';position:fixed;inset:0;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E");
  pointer-events:none;z-index:0;opacity:.6;
}

/* ── DECO LINES ── */
.deco-lines{
  position:absolute;inset:0;pointer-events:none;overflow:hidden;
}
.deco-lines svg{width:100%;height:100%;opacity:.12}

/* ── HERO ── */
.hero{
  min-height:100vh;
  position:relative;
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  text-align:center;
  overflow:hidden;
  background:linear-gradient(rgba(13,61,46,.85),var(--color-primary)), url('{{portada_url}}') center/cover no-repeat;
}

.hero-frame{
  position:absolute;inset:2rem;
  border:1px solid rgba(212,175,90,.25);
  pointer-events:none;
  animation:frame-draw 2s ease forwards;
}
@keyframes frame-draw{
  from{clip-path:inset(50% 50% 50% 50%)}
  to{clip-path:inset(0% 0% 0% 0%)}
}
.hero-frame::before,.hero-frame::after{
  content:'';position:absolute;
  width:40px;height:40px;
  border-color:var(--color-secondary);
  border-style:solid;
  opacity:.8;
}
.hero-frame::before{top:-1px;left:-1px;border-width:2px 0 0 2px}
.hero-frame::after{bottom:-1px;right:-1px;border-width:0 2px 2px 0}

/* Estrellas destellantes */
.sparks{position:absolute;inset:0;pointer-events:none}
.spark{
  position:absolute;width:2px;height:2px;
  background:var(--color-secondary);border-radius:50%;
  animation:spark-blink ease-in-out infinite;
}
@keyframes spark-blink{0%,100%{opacity:0;transform:scale(0)}50%{opacity:1;transform:scale(1.5)}}

.hero-top-ornament{
  font-family:'Alex Brush',cursive;
  font-size:clamp(1rem,3vw,1.8rem);
  color:var(--color-secondary);
  letter-spacing:.3em;
  margin-bottom:1rem;
  opacity:0;animation:deco-in 1.2s .3s forwards;
}
@keyframes deco-in{from{opacity:0;transform:translateY(-20px) scaleX(.8)}to{opacity:1;transform:translateY(0) scaleX(1)}}

/* Arco Art Déco SVG */
.deco-arch{
  width:clamp(200px,50vw,400px);
  height:clamp(300px,60vh,500px);
  margin:0 auto .5rem;
  opacity:0;animation:deco-in 1.2s .1s forwards;
  position:relative;display:flex;align-items:center;justify-content:center;
}
.deco-arch svg{position:absolute;inset:0;width:100%;height:100%}
.arch-names{position:relative;z-index:1;text-align:center}

.bride-deco{
  font-family:'Alex Brush',cursive;
  font-size:clamp(3rem,8vw,6rem);
  color:var(--champ-pale);
  line-height:1;
  display:block;
  text-shadow:0 0 40px rgba(212,175,90,.4);
}
.groom-deco{
  font-family:'Alex Brush',cursive;
  font-size:clamp(3rem,8vw,6rem);
  color:var(--champ-pale);
  line-height:1;
  display:block;
}
.amp-deco{
  font-family:'Marcellus SC',serif;
  font-size:1rem;letter-spacing:.4em;
  color:var(--color-secondary);
  display:block;margin:.3rem 0;
}

.hero-date-deco{
  font-family:'Marcellus SC',serif;
  font-size:.85rem;letter-spacing:.35em;
  color:var(--color-secondary);
  margin-top:1.5rem;
  opacity:0;animation:deco-in 1.2s .7s forwards;
}

.hero-bottom-orn{
  font-size:clamp(.8rem,2vw,1.2rem);
  color:rgba(212,175,90,.4);
  letter-spacing:.5em;
  margin-top:1rem;
  opacity:0;animation:deco-in 1.2s .9s forwards;
}

/* ── SEPARATOR ── */
.deco-sep{display:flex;align-items:center;justify-content:center;gap:1.5rem;padding:3rem 2rem}
.sep-line{flex:1;max-width:200px;height:1px;background:linear-gradient(to right,transparent,var(--color-secondary))}
.sep-line.rev{background:linear-gradient(to left,transparent,var(--color-secondary))}
.sep-diamond{
  width:16px;height:16px;background:var(--color-secondary);
  transform:rotate(45deg);
  position:relative;
}
.sep-diamond::before,.sep-diamond::after{
  content:'';position:absolute;
  top:50%;left:50%;
  transform:translate(-50%,-50%);
  background:var(--color-primary);
  border:1px solid var(--color-secondary);
  border-radius:0;
}
.sep-diamond::before{width:8px;height:8px;transform:translate(-50%,-50%) rotate(45deg)}

/* ── SECCIONES ── */
.ivory-sec{background:var(--white);color:var(--color-primary)}
.champ-sec{background:var(--color-secondary);color:var(--color-primary)}
.dark-sec{background:var(--color-primary);color:var(--color-bg)}
.pad{padding:6rem clamp(2rem,6vw,7rem)}

.sec-sup{font-family:'Marcellus SC',serif;font-size:.65rem;letter-spacing:.5em;color:var(--color-secondary);margin-bottom:.8rem}
.ivory-sec .sec-sup{color:var(--emerald2)}
.champ-sec .sec-sup{color:var(--color-primary)}
.sec-h2{font-family:'Alex Brush',cursive;font-size:clamp(2.5rem,6vw,4.5rem);line-height:1.1;margin-bottom:3rem}
.ivory-sec .sec-h2{color:var(--color-primary)}
.champ-sec .sec-h2{color:var(--color-primary)}

/* ── FAMILY DECO ── */
.family-deco{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:2px;background:var(--color-secondary);max-width:900px;margin:0 auto}
.fd-cell{
  background:var(--white);padding:3rem 2rem;text-align:center;
  position:relative;overflow:hidden;
  opacity:0;transform:translateY(20px);
  transition:opacity .6s,transform .6s;
}
.fd-cell.visible{opacity:1;transform:translateY(0)}
.fd-cell::before{content:'◆';position:absolute;top:.8rem;left:50%;transform:translateX(-50%);color:var(--color-secondary);font-size:.8rem}
.fd-role{font-size:.55rem;letter-spacing:.5em;text-transform:uppercase;color:var(--champ2);margin-bottom:.8rem}
.fd-name{font-family:'Alex Brush',cursive;font-size:1.5rem;color:var(--color-primary);line-height:1.4}

/* ── EVENTS DECO ── */
.ev-deco-grid{display:grid;grid-template-columns:1fr 1fr;max-width:900px;margin:0 auto;gap:3rem}
@media(max-width:650px){.ev-deco-grid{grid-template-columns:1fr}}
.ev-deco{
  border:1px solid rgba(212,175,90,.3);padding:3.5rem 2.5rem;text-align:center;
  position:relative;
  opacity:0;transform:scale(.97);
  transition:opacity .7s,transform .7s;
}
.ev-deco.visible{opacity:1;transform:scale(1)}
.ev-deco::before,.ev-deco::after{
  content:'';position:absolute;
  width:20px;height:20px;
  border-color:var(--color-secondary);border-style:solid;
}
.ev-deco::before{top:-1px;left:-1px;border-width:2px 0 0 2px}
.ev-deco::after{bottom:-1px;right:-1px;border-width:0 2px 2px 0}
.ev-deco-icon{font-size:1.5rem;margin-bottom:1.5rem}
.ev-deco-type{font-size:.55rem;letter-spacing:.5em;text-transform:uppercase;color:var(--color-secondary);margin-bottom:.8rem}
.ev-deco-name{font-family:'Alex Brush',cursive;font-size:2.2rem;color:var(--champ-pale);margin-bottom:.3rem}
.ev-deco-time{font-family:'Marcellus SC',serif;font-size:1.5rem;color:var(--color-secondary);margin:.5rem 0}
.ev-deco-place{font-size:.8rem;color:rgba(249,244,232,.5);line-height:1.7;margin-bottom:2rem}
.btn-champ{display:inline-block;border:1px solid var(--color-secondary);color:var(--color-secondary);padding:.7rem 2.5rem;font-family:'Marcellus SC',serif;font-size:.6rem;letter-spacing:.3em;text-transform:uppercase;text-decoration:none;transition:background .3s,color .3s}
.btn-champ:hover{background:var(--color-secondary);color:var(--color-primary)}

/* ── ITINERARIO ── */
.it-deco-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;background:var(--color-secondary);max-width:900px;margin:0 auto}
@media(max-width:600px){.it-deco-grid{grid-template-columns:1fr}}
.it-deco-cell{
  background:var(--color-primary);padding:2.5rem 2rem;text-align:center;
  opacity:0;transform:translateY(20px);transition:opacity .5s,transform .5s;
}
.it-deco-cell.visible{opacity:1;transform:translateY(0)}
.it-num{font-family:'Marcellus SC',serif;font-size:2rem;color:rgba(212,175,90,.2);margin-bottom:.5rem}
.it-t{font-size:.55rem;letter-spacing:.4em;text-transform:uppercase;color:var(--color-secondary);margin-bottom:.5rem}
.it-n{font-family:'Alex Brush',cursive;font-size:1.6rem;color:var(--champ-pale)}

/* ── GALERÍA ── */
.gal-deco{display:grid;grid-template-columns:repeat(auto-fill, minmax(280px, 1fr));gap:6px;max-width:1100px;margin:0 auto;padding:0 2rem}
.gal-deco img{width:100%;height:300px;object-fit:cover;filter:sepia(.2) brightness(.85);transition:filter .5s,transform .6s;cursor:pointer}
.gal-deco img:hover{filter:sepia(0) brightness(1);transform:scale(1.03)}
@media(max-width:650px){.gal-deco{grid-template-columns:1fr 1fr}}

/* ── RSVP ── */
.rsvp-deco{
  background:linear-gradient(160deg,var(--color-primary),var(--emerald2));
  padding:8rem clamp(2rem,6vw,7rem);
  text-align:center;position:relative;overflow:hidden;
}
.rsvp-deco::before{
  content:'';position:absolute;inset:2rem;
  border:1px solid rgba(212,175,90,.15);pointer-events:none;
}
.rsvp-diamond-deco{font-size:1.5rem;color:var(--color-secondary);letter-spacing:1em;margin-bottom:2rem;opacity:.5}
.rsvp-deco-name{font-family:'Alex Brush',cursive;font-size:clamp(3rem,10vw,7rem);color:var(--champ-pale);line-height:1;margin-bottom:.5rem}
.rsvp-deco-date{font-family:'Marcellus SC',serif;font-size:.8rem;letter-spacing:.4em;color:var(--color-secondary);opacity:.7;margin-bottom:3rem}
.btn-champ-fill{display:inline-block;background:var(--color-secondary);color:var(--color-primary);padding:1.1rem 4.5rem;font-family:'Marcellus SC',serif;font-size:.65rem;letter-spacing:.4em;text-transform:uppercase;text-decoration:none;transition:background .3s,transform .3s}
.btn-champ-fill:hover{background:var(--champ-pale);transform:translateY(-3px)}

footer{background:var(--color-primary);border-top:1px solid rgba(212,175,90,.1);padding:3rem;text-align:center;color:rgba(212,175,90,.3);font-size:.75rem;letter-spacing:.2em}
.f-script{font-family:'Alex Brush',cursive;font-size:2.5rem;color:var(--color-secondary);display:block;margin-bottom:.5rem}
</style>
</head>
<body>

<!-- HERO -->
<section class="hero" data-field="portada_url">
  <div class="sparks" id="sparks"></div>
  <div class="hero-frame"></div>

  <p class="hero-top-ornament" data-field="frase">{{frase}}</p>

  <div class="deco-arch">
    <svg viewBox="0 0 320 480" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Arco exterior -->
      <path d="M20 480 L20 180 Q20 20 160 20 Q300 20 300 180 L300 480" stroke="#D4AF5A" stroke-width="1" fill="none" opacity=".6"/>
      <!-- Arco interior -->
      <path d="M45 480 L45 190 Q45 55 160 55 Q275 55 275 190 L275 480" stroke="#D4AF5A" stroke-width=".5" fill="none" opacity=".3"/>
      <!-- Líneas horizontales decorativas -->
      <line x1="20" y1="200" x2="45" y2="200" stroke="#D4AF5A" stroke-width=".5" opacity=".5"/>
      <line x1="275" y1="200" x2="300" y2="200" stroke="#D4AF5A" stroke-width=".5" opacity=".5"/>
      <line x1="20" y1="250" x2="45" y2="250" stroke="#D4AF5A" stroke-width=".5" opacity=".5"/>
      <line x1="275" y1="250" x2="300" y2="250" stroke="#D4AF5A" stroke-width=".5" opacity=".5"/>
      <!-- Detalles en el arco -->
      <circle cx="160" cy="20" r="5" fill="#D4AF5A" opacity=".6"/>
      <circle cx="160" cy="20" r="12" stroke="#D4AF5A" stroke-width=".5" fill="none" opacity=".3"/>
      <!-- Rombo superior -->
      <path d="M150 0 L160 -12 L170 0 L160 12 Z" fill="#D4AF5A" opacity=".5"/>
    </svg>
    <div class="arch-names">
      <span class="bride-deco" data-field="novia">{{novia}}</span>
      <span class="amp-deco">◆ &amp; ◆</span>
      <span class="groom-deco" data-field="novio">{{novio}}</span>
    </div>
  </div>

  <div class="hero-date-deco" data-field="fecha_hero">{{fecha_hero}}</div>
  <div class="hero-bottom-orn">◆ ◇ ◆ ◇ ◆</div>
</section>

<div class="deco-sep">
  <div class="sep-line"></div>
  <div class="sep-diamond"></div>
  <div class="sep-line rev"></div>
</div>

<!-- FAMILIA -->
<section class="ivory-sec pad">
  <div style="text-align:center;margin-bottom:1rem"><p class="sec-sup">Con el amor de</p><h2 class="sec-h2">Familia &amp; Padrinos</h2></div>
  <div class="family-deco">
    <div class="fd-cell"><div class="fd-role">Padres de la novia</div><div class="fd-name" data-field="madre_novia">{{madre_novia}}</div><div class="fd-name" data-field="padre_novia">{{padre_novia}}</div></div>
    <div class="fd-cell" style="transition-delay:.15s"><div class="fd-role">Padres del novio</div><div class="fd-name" data-field="madre_novio">{{madre_novio}}</div><div class="fd-name" data-field="padre_novio">{{padre_novio}}</div></div>
    <div class="fd-cell" style="transition-delay:.3s;grid-column: span 2"><div class="fd-role">Padrinos</div><div class="fd-name" data-field="padrinos_html">{{padrinos_html}}</div></div>
  </div>
</section>

<!-- EVENTOS -->
<section class="dark-sec pad">
  <div style="text-align:center;margin-bottom:1rem"><p class="sec-sup">Los Momentos</p><h2 class="sec-h2" style="color:var(--champ-pale)">Los Eventos</h2></div>
  <div class="ev-deco-grid">
    <div class="ev-deco">
      <div class="ev-deco-icon">⛪</div>
      <div class="ev-deco-type">Ceremonia</div>
      <div class="ev-deco-name">La Iglesia</div>
      <div class="ev-deco-time" data-field="hora_ceremonia">{{hora_ceremonia}}</div>
      <div class="ev-deco-place"><span data-field="lugar_ceremonia">{{lugar_ceremonia}}</span><br><span data-field="direccion_ceremonia">{{direccion_ceremonia}}</span></div>
      <a href="#" class="btn-champ">Ir al mapa</a>
    </div>
    <div class="ev-deco" style="transition-delay:.15s">
      <div class="ev-deco-icon">✨</div>
      <div class="ev-deco-type">Recepción</div>
      <div class="ev-deco-name">El Festejo</div>
      <div class="ev-deco-time" data-field="hora_recepcion">{{hora_recepcion}}</div>
      <div class="ev-deco-place"><span data-field="lugar_recepcion">{{lugar_recepcion}}</span><br><span data-field="direccion_recepcion">{{direccion_recepcion}}</span></div>
      <a href="#" class="btn-champ">Ir al mapa</a>
    </div>
  </div>
</section>

<!-- ITINERARIO -->
<section class="ivory-sec pad">
  <div style="text-align:center;margin-bottom:3rem"><p class="sec-sup">La noche especial</p><h2 class="sec-h2">Programa</h2></div>
  <div class="it-deco-grid" data-field="itin_html">
    {{itin_html}}
  </div>
</section>

<section style="background:var(--color-primary);padding:5rem 0">
  <div style="text-align:center;padding:0 2rem 3rem"><p class="sec-sup">Nuestra historia</p><h2 class="sec-h2" style="color:var(--champ-pale)">En imágenes</h2></div>
  <div class="gal-deco" data-field="galeria_html">
    {{galeria_html}}
  </div>
</section>

<!-- RSVP -->
<section class="rsvp-deco">
  <div style="position:relative;z-index:1">
    <div class="rsvp-diamond-deco">◆ ◆ ◆</div>
    <div class="rsvp-deco-name"><span data-field="novia">{{novia}}</span> &amp; <span data-field="novio">{{novio}}</span></div>
    <div class="rsvp-deco-date"><span data-field="fecha_hero">{{fecha_hero}}</span> · <span data-field="lugar_recepcion">{{lugar_recepcion}}</span><br>Confirma antes del <span data-field="confirmacion_fecha">{{confirmacion_fecha}}</span></div>
    <a href="{{whatsapp_url}}" class="btn-champ-fill" data-field="whatsapp_url">Confirmar Asistencia</a>
  </div>
</section>

<footer>
  <span class="f-script"><span data-field="novia">{{novia}}</span> &amp; <span data-field="novio">{{novio}}</span></span>
  Boda · <span data-field="fecha_hero">{{fecha_hero}}</span> ◆ Hecha con amor
</footer>

<script>
// Destellos
const s=document.getElementById('sparks');
for(let i=0;i<40;i++){
  const el=document.createElement('div');
  el.className='spark';
  el.style.cssText=\`left:\${Math.random()*100}%;top:\${Math.random()*100}%;animation-duration:\${Math.random()*3+2}s;animation-delay:\${Math.random()*5}s;width:\${Math.random()*3+1}px;height:\${Math.random()*3+1}px\`;
  s.appendChild(el);
}

const obs=new IntersectionObserver(e=>e.forEach(x=>x.isIntersecting&&x.target.classList.add('visible')),{threshold:.1});
document.querySelectorAll('.fd-cell,.ev-deco,.it-deco-cell').forEach(el=>obs.observe(el));
</script>
</body>
</html>
`;
