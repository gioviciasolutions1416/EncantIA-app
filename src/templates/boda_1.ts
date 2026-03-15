export const BODA_1 = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{novia}} & {{novio}}</title>
<link href="https://fonts.googleapis.com/css2?family=Italiana&family=Jost:ital,wght@0,200;0,300;0,400;1,300&family=Bodoni+Moda:ital,opsz,wght@1,6,300;1,6,400;1,72,400&display=swap" rel="stylesheet">
<style>
  :root {
    --color-primary: {{color_primary
    /* Mapeo adaptado a locales */
    --rose: var(--color-primary);
    --petal: var(--color-secondary);
    --ivory: var(--color-bg);
  }};
    --color-secondary: {{color_secondary}};
    --color-bg: {{color_bg}};
    --font-titulos: '{{font_titulos}}', serif;
    --font-cuerpo: '{{font_cuerpo}}', sans-serif;
  --blush:#F5E2DC;
  --moss:#7A8B6A;
  --dark:#2B2218;
  --warm:#8C6B50;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Jost',sans-serif;background:var(--color-bg);color:var(--dark);overflow-x:hidden;cursor:none}

/* ── CUSTOM CURSOR ── */
.cursor{position:fixed;width:10px;height:10px;background:var(--color-primary);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:transform .15s,width .3s,height .3s,opacity .3s;mix-blend-mode:multiply}
.cursor-ring{position:fixed;width:36px;height:36px;border:1px solid rgba(194,123,112,0.5);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:transform .08s linear,width .4s,height .4s}

/* ── PETALS ── */
#petals-canvas{position:fixed;inset:0;pointer-events:none;z-index:1;opacity:.5}

/* ── HERO ── */
.hero{
  min-height:100vh;position:relative;
  display:grid;grid-template-columns:1fr 1fr;
  overflow:hidden;
}
@media(max-width:700px){.hero{grid-template-columns:1fr}}

.hero-left{
  position:relative;
  background:var(--blush);
  display:flex;flex-direction:column;justify-content:center;
  padding:clamp(3rem,8vw,7rem);
  z-index:2;
}
.hero-left::after{
  content:'';
  position:absolute;right:-80px;top:0;bottom:0;width:160px;
  background:var(--blush);
  clip-path:ellipse(80px 100% at 0% 50%);
  z-index:1;
}

.hero-right{
  position:relative;overflow:hidden;
  background:url('{{portada_url}}') center/cover no-repeat;
}
.hero-right::before{content:'';position:absolute;inset:0;background:rgba(43,34,24,0.15)}
@media(max-width:700px){.hero-right{height:50vh}}

.leaf-ornament{
  position:absolute;
  font-size:clamp(8rem,15vw,14rem);
  color:rgba(122,139,106,0.08);
  pointer-events:none;user-select:none;
  font-family:'Italiana',serif;
  line-height:1;
}
.leaf-ornament.tl{top:-2rem;left:-2rem}
.leaf-ornament.br{bottom:-3rem;right:-2rem}

.overline{font-size:.6rem;letter-spacing:.5em;text-transform:uppercase;color:var(--warm);margin-bottom:2rem;font-weight:300;
  opacity:0;animation:slide-up 1s .2s forwards}
@keyframes slide-up{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}

.bride-name{
  font-family:'Bodoni Moda',serif;font-style:italic;
  font-size:clamp(2.5rem,6vw,5rem);
  line-height:1.1;color:var(--dark);
  opacity:0;animation:slide-up 1s .4s forwards;
}
.bride-name .amp{
  display:block;font-family:'Italiana',serif;
  font-size:.5em;font-style:normal;
  color:var(--color-primary);margin:.2em 0;
  letter-spacing:.1em;
}

.date-pill{
  display:inline-flex;align-items:center;gap:.8rem;
  background:var(--color-primary);color:#fff;
  padding:.6rem 1.6rem;
  font-size:.65rem;letter-spacing:.25em;text-transform:uppercase;
  margin:2rem 0;font-weight:300;
  opacity:0;animation:slide-up 1s .6s forwards;
}

.hero-desc{
  font-size:.9rem;color:var(--warm);line-height:1.8;font-weight:300;font-style:italic;
  max-width:340px;
  opacity:0;animation:slide-up 1s .8s forwards;
}

.scroll-line{
  position:absolute;bottom:2.5rem;right:2.5rem;
  display:flex;flex-direction:column;align-items:center;gap:.8rem;
  z-index:3;color:var(--warm);font-size:.55rem;letter-spacing:.3em;text-transform:uppercase;font-weight:300;
  opacity:0;animation:slide-up 1s 1.2s forwards;
}
.scroll-line::after{content:'';width:1px;height:60px;background:linear-gradient(to bottom,var(--color-primary),transparent)}

/* ── SECTIONS ── */
.blush-sec{background:var(--blush)}
.ivory-sec{background:var(--color-bg)}
.moss-sec{background:#3D4A35;color:var(--color-bg)}

.pad{padding:6rem clamp(2rem,6vw,7rem)}

/* ── FAMILY SECTION ── */
.family-wrap{max-width:800px;margin:0 auto;text-align:center}
.sec-eyebrow{font-size:.6rem;letter-spacing:.5em;text-transform:uppercase;color:var(--color-primary);margin-bottom:.8rem;font-weight:300}
.sec-h{font-family:'Italiana',serif;font-size:clamp(2rem,5vw,3.5rem);color:var(--dark);margin-bottom:3rem;line-height:1.1}
.mosaic{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--color-secondary);margin-top:3rem}
@media(max-width:600px){.mosaic{grid-template-columns:1fr}}
.mosaic-cell{background:var(--color-bg);padding:2.5rem 1.5rem;text-align:center;transition:background .4s;
  opacity:0;transform:scale(.95);transition:opacity .7s,transform .7s,background .4s}
.mosaic-cell.visible{opacity:1;transform:scale(1)}
.mosaic-cell:hover{background:var(--blush)}
.mc-role{font-size:.55rem;letter-spacing:.4em;text-transform:uppercase;color:var(--color-primary);margin-bottom:.8rem}
.mc-name{font-family:'Bodoni Moda',serif;font-style:italic;font-size:1.1rem;color:var(--dark);line-height:1.5}

/* ── EVENTS ── */
.ev-strip{display:grid;grid-template-columns:1fr 1fr;gap:0;max-width:100%}
@media(max-width:650px){.ev-strip{grid-template-columns:1fr}}
.ev-s{
  padding:5rem clamp(2rem,5vw,5rem);position:relative;overflow:hidden;
  opacity:0;transform:translateY(40px);
  transition:opacity .8s,transform .8s;
}
.ev-s.visible{opacity:1;transform:translateY(0)}
.ev-s.left{background:var(--color-bg)}
.ev-s.right{background:var(--dark);color:var(--color-bg)}
.ev-num{font-family:'Italiana',serif;font-size:8rem;color:rgba(194,123,112,.08);position:absolute;top:-1rem;right:1rem;line-height:1}
.ev-s.right .ev-num{color:rgba(255,255,255,.05)}
.ev-type{font-size:.55rem;letter-spacing:.5em;text-transform:uppercase;color:var(--color-primary);margin-bottom:.8rem}
.ev-s.right .ev-type{color:var(--color-secondary)}
.ev-title{font-family:'Italiana',serif;font-size:2rem;margin-bottom:.5rem}
.ev-hour{font-family:'Bodoni Moda',serif;font-style:italic;font-size:3.5rem;line-height:1;color:var(--color-primary);margin:.5rem 0}
.ev-s.right .ev-hour{color:var(--color-secondary)}
.ev-place{font-size:.85rem;color:var(--warm);line-height:1.7;font-weight:300;margin-bottom:2rem}
.ev-s.right .ev-place{color:rgba(255,255,255,.5)}
.btn-outline{border:1px solid;padding:.7rem 2rem;font-size:.6rem;letter-spacing:.3em;text-transform:uppercase;text-decoration:none;display:inline-block;transition:background .3s,color .3s}
.ev-s.left .btn-outline{border-color:var(--color-primary);color:var(--color-primary)}
.ev-s.left .btn-outline:hover{background:var(--color-primary);color:#fff}
.ev-s.right .btn-outline{border-color:rgba(255,255,255,.4);color:var(--color-bg)}
.ev-s.right .btn-outline:hover{background:var(--color-bg);color:var(--dark)}

/* ── TIMELINE ── */
.tl-wrap{max-width:600px;margin:0 auto}
.tl-row{
  display:flex;gap:2rem;padding-bottom:3rem;position:relative;
  opacity:0;transform:translateX(-25px);
  transition:opacity .7s,transform .7s;
}
.tl-row.visible{opacity:1;transform:translateX(0)}
.tl-row:not(:last-child)::after{content:'';position:absolute;left:1.1rem;top:2.5rem;bottom:0;width:1px;background:var(--color-secondary)}
.tl-icon{flex-shrink:0;width:2.2rem;height:2.2rem;border:1px solid var(--color-primary);background:var(--color-bg);display:flex;align-items:center;justify-content:center;font-size:.9rem;border-radius:50%}
.tl-t{font-size:.58rem;letter-spacing:.35em;text-transform:uppercase;color:var(--color-primary);margin-bottom:.3rem}
.tl-name{font-family:'Italiana',serif;font-size:1.2rem;color:var(--dark)}

/* ── GALERÍA ── */
.gallery-boda{display:grid;grid-template-columns:repeat(auto-fill, minmax(240px, 1fr));gap:6px;max-width:1200px;margin:0 auto;padding:0 2rem}
.gallery-boda img{width:100%;height:240px;object-fit:cover;transition:transform .6s,filter .4s;filter:brightness(.85);cursor:pointer}
.gallery-boda img:hover{transform:scale(1.04);filter:brightness(1)}
@media(max-width:700px){.gallery-boda{grid-template-columns:1fr 1fr}}

/* ── RSVP ── */
.rsvp-wrap{
  padding:8rem clamp(2rem,6vw,7rem);
  background:var(--dark);color:var(--color-bg);
  position:relative;overflow:hidden;
  text-align:center;
}
.rsvp-wrap::before{
  content:'';position:absolute;
  width:600px;height:600px;
  background:radial-gradient(circle,rgba(194,123,112,.12),transparent 70%);
  left:50%;top:50%;transform:translate(-50%,-50%);
  border-radius:50%;
}
.rsvp-sub{font-size:.6rem;letter-spacing:.5em;text-transform:uppercase;color:var(--color-secondary);margin-bottom:1rem;font-weight:300}
.rsvp-h{font-family:'Bodoni Moda',serif;font-style:italic;font-size:clamp(2.5rem,7vw,5.5rem);color:var(--color-bg);line-height:1.1;margin-bottom:1.5rem}
.rsvp-detail{font-size:.85rem;color:rgba(255,255,255,.45);letter-spacing:.1em;margin-bottom:3.5rem;font-weight:300}
.btn-rose{display:inline-block;background:var(--color-primary);color:#fff;padding:1.1rem 4rem;font-size:.65rem;letter-spacing:.35em;text-transform:uppercase;text-decoration:none;transition:background .3s,transform .3s}
.btn-rose:hover{background:var(--color-secondary);color:var(--dark);transform:translateY(-3px)}

footer{background:var(--dark);border-top:1px solid rgba(255,255,255,.06);padding:3rem;text-align:center;color:rgba(255,255,255,.25);font-size:.8rem;letter-spacing:.1em}
.f-name{font-family:'Italiana',serif;font-size:2rem;color:var(--color-secondary);display:block;margin-bottom:.5rem}
</style>
</head>
<body>

<!-- Cursor personalizado -->
<div class="cursor" id="cur"></div>
<div class="cursor-ring" id="curR"></div>

<!-- Canvas de pétalos -->
<canvas id="petals-canvas"></canvas>

<!-- HERO -->
<section class="hero">
  <div class="hero-left">
    <div class="leaf-ornament tl">✿</div>
    <p class="overline" data-field="frase">{{frase}}</p>
    <h1 class="bride-name">
      <span data-field="novia">{{novia}}</span><span class="amp">&amp;</span><span data-field="novio">{{novio}}</span>
    </h1>
    <div class="date-pill" data-field="fecha_hero">{{fecha_hero}}</div>
    <p class="hero-desc" data-field="mensaje_secundario">{{mensaje_secundario}}</p>
    <div class="leaf-ornament br">❧</div>
  </div>
  <div class="hero-right" data-field="portada_url">
    <div class="scroll-line">Scroll</div>
  </div>
</section>

<!-- FAMILIA -->
<section class="ivory-sec pad">
  <div class="family-wrap">
    <p class="sec-eyebrow">Con el amor de</p>
    <h2 class="sec-h">Familia &amp; Padrinos</h2>
    <div class="mosaic">
      <div class="mosaic-cell"><div class="mc-role">Padres de la novia</div><div class="mc-name" data-field="madre_novia">{{madre_novia}}</div><div class="mc-name" data-field="padre_novia">{{padre_novia}}</div></div>
      <div class="mosaic-cell" style="transition-delay:.15s"><div class="mc-role">Padres del novio</div><div class="mc-name" data-field="madre_novio">{{madre_novio}}</div><div class="mc-name" data-field="padre_novio">{{padre_novio}}</div></div>
      <div class="mosaic-cell" style="transition-delay:.3s"><div class="mc-role">Padrinos principales</div><div class="mc-name" data-field="padrinos_html">{{padrinos_html}}</div></div>
    </div>
  </div>
</section>

<!-- EVENTOS -->
<div class="ev-strip">
  <div class="ev-s left">
    <div class="ev-num">I</div>
    <div class="ev-type">Ceremonia religiosa</div>
    <div class="ev-title">La Boda</div>
    <div class="ev-hour" data-field="hora_ceremonia">{{hora_ceremonia}}</div>
    <div class="ev-place"><span data-field="lugar_ceremonia">{{lugar_ceremonia}}</span><br><span data-field="direccion_ceremonia">{{direccion_ceremonia}}</span></div>
    <a href="#" class="btn-outline">Ver Mapa →</a>
  </div>
  <div class="ev-s right" style="transition-delay:.15s">
    <div class="ev-num">II</div>
    <div class="ev-type">Celebración</div>
    <div class="ev-title">La Fiesta</div>
    <div class="ev-hour" data-field="hora_recepcion">{{hora_recepcion}}</div>
    <div class="ev-place"><span data-field="lugar_recepcion">{{lugar_recepcion}}</span><br><span data-field="direccion_recepcion">{{direccion_recepcion}}</span></div>
    <a href="#" class="btn-outline">Ver Mapa →</a>
  </div>
</div>

<!-- ITINERARIO -->
<section class="blush-sec pad">
  <div style="max-width:800px;margin:0 auto">
    <p class="sec-eyebrow">Itinerario</p>
    <h2 class="sec-h">La noche perfecta</h2>
    <div class="tl-wrap" data-field="itin_html">
      {{itin_html}}
    </div>
  </div>
</section>

<!-- GALERÍA -->
<section class="ivory-sec" style="padding-top:5rem">
  <div style="text-align:center;padding:0 2rem 3rem">
    <p class="sec-eyebrow">Nuestra historia</p>
    <h2 class="sec-h">En imágenes</h2>
  </div>
  <div class="gallery-boda" data-field="galeria_html">
    {{galeria_html}}
  </div>
</section>

<!-- RSVP -->
<section class="rsvp-wrap">
  <div style="position:relative;z-index:1">
    <p class="rsvp-sub">Te esperamos</p>
    <h2 class="rsvp-h"><span data-field="novia">{{novia}}</span> &amp;<br><span data-field="novio">{{novio}}</span></h2>
    <p class="rsvp-detail"><span data-field="fecha_hero">{{fecha_hero}}</span> · <span data-field="lugar_recepcion">{{lugar_recepcion}}</span><br>Confirma antes del <span data-field="confirmacion_fecha">{{confirmacion_fecha}}</span></p>
    <a href="{{whatsapp_url}}" class="btn-rose" data-field="whatsapp_url">Confirmar Asistencia</a>
  </div>
</section>

<footer>
  <span class="f-name"><span data-field="novia">{{novia}}</span> &amp; <span data-field="novio">{{novio}}</span></span>
  Boda · <span data-field="fecha_hero">{{fecha_hero}}</span>
</footer>

<script>
// Cursor
const cur=document.getElementById('cur'), curR=document.getElementById('curR');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px'});
setInterval(()=>{rx+=(mx-rx)*.12;ry+=(my-ry)*.12;curR.style.left=rx+'px';curR.style.top=ry+'px'},16);
document.querySelectorAll('a,button').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cur.style.transform='translate(-50%,-50%) scale(2.5)';cur.style.opacity='.4'});
  el.addEventListener('mouseleave',()=>{cur.style.transform='translate(-50%,-50%) scale(1)';cur.style.opacity='1'});
});

// Pétalos en canvas
const canvas=document.getElementById('petals-canvas');
canvas.width=window.innerWidth;canvas.height=window.innerHeight;
const ctx=canvas.getContext('2d');
const petals=Array.from({length:25},()=>({
  x:Math.random()*canvas.width,
  y:Math.random()*canvas.height,
  r:Math.random()*8+4,
  sx:Math.random()*.8-.4,
  sy:Math.random()*1+.5,
  a:Math.random()*Math.PI*2,
  da:Math.random()*.02-.01,
  opacity:Math.random()*.5+.2,
  hue:Math.random()*20+340
}));
function drawPetal(p){
  ctx.save();ctx.globalAlpha=p.opacity;
  ctx.translate(p.x,p.y);ctx.rotate(p.a);
  ctx.beginPath();
  ctx.ellipse(0,0,p.r*1.5,p.r*.8,0,0,Math.PI*2);
  ctx.fillStyle=\`hsl(\${p.hue},60%,80%)\`;
  ctx.fill();ctx.restore();
}
function animatePetals(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  petals.forEach(p=>{
    p.x+=p.sx;p.y+=p.sy;p.a+=p.da;
    if(p.y>canvas.height+20){p.y=-20;p.x=Math.random()*canvas.width}
    drawPetal(p);
  });
  requestAnimationFrame(animatePetals);
}
animatePetals();
window.addEventListener('resize',()=>{canvas.width=window.innerWidth;canvas.height=window.innerHeight});

// Scroll reveal
const obs=new IntersectionObserver(e=>e.forEach(x=>x.isIntersecting&&x.target.classList.add('visible')),{threshold:.1});
document.querySelectorAll('.mosaic-cell,.ev-s,.tl-row').forEach(el=>obs.observe(el));
</script>
</body>
</html>
`;
