export const XV_2 = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>XV Años — {{nombre_festejada}}</title>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Unbounded:wght@200;300;400;700;900&family=Kaushan+Script&display=swap" rel="stylesheet">
<style>
  :root {
    --color-primary: {{color_primary
    /* Mapeo adaptado a locales */
    --hot: var(--color-primary);
    --cyan: var(--color-secondary);
    --dark: var(--color-bg);
  }};
    --color-secondary: {{color_secondary}};
    --color-bg: {{color_bg}};
    --font-titulos: '{{font_titulos}}', serif;
    --font-cuerpo: '{{font_cuerpo}}', sans-serif;
  --purple:#9B00FF;
  --yellow:#FFE600;
  --dark2:#0D0024;
  --white:#FFFFFF;
  --pink-pale:#FFB3D9;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Unbounded',sans-serif;background:var(--color-bg);color:var(--white);overflow-x:hidden}

/* ── GLITCH TEXT ── */
@keyframes glitch1{
  0%,95%{clip-path:inset(0 0 100% 0);transform:translate(0)}
  2%{clip-path:inset(10% 0 60% 0);transform:translate(-3px,1px)}
  4%{clip-path:inset(50% 0 20% 0);transform:translate(3px,-1px)}
  6%,100%{clip-path:inset(0 0 100% 0)}
}
@keyframes glitch2{
  0%,90%{clip-path:inset(0 0 100% 0);transform:translate(0)}
  92%{clip-path:inset(60% 0 10% 0);transform:translate(3px,2px)}
  94%{clip-path:inset(20% 0 50% 0);transform:translate(-3px,-2px)}
  96%,100%{clip-path:inset(0 0 100% 0)}
}

/* ── HERO ── */
.hero{
  min-height:100vh;
  position:relative;
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  text-align:center;
  overflow:hidden;
  background:radial-gradient(ellipse 70% 50% at 30% 40%,rgba(155,0,255,.3),transparent),
             radial-gradient(ellipse 60% 60% at 70% 60%,rgba(255,0,128,.2),transparent),
             linear-gradient(rgba(8,0,26,.8), var(--color-bg)),
             url('{{portada_url}}') center/cover no-repeat;
}

/* Grid líneas de fondo */
.hero-grid{
  position:absolute;inset:0;
  background-image:
    linear-gradient(rgba(255,0,128,.06) 1px,transparent 1px),
    linear-gradient(90deg,rgba(255,0,128,.06) 1px,transparent 1px);
  background-size:50px 50px;
  animation:grid-move 20s linear infinite;
}
@keyframes grid-move{to{background-position:50px 50px}}

/* Orbes flotantes */
.orb{position:absolute;border-radius:50%;filter:blur(60px);animation:orb-float ease-in-out infinite alternate}
@keyframes orb-float{from{transform:translate(0,0)}to{transform:translate(30px,40px)}}

.hero-content{position:relative;z-index:2;padding:2rem}

.hero-year{
  font-family:'Bebas Neue',sans-serif;
  font-size:clamp(8rem,25vw,22rem);
  line-height:.85;
  color:transparent;
  -webkit-text-stroke:1px rgba(255,0,128,.3);
  position:absolute;
  left:50%;top:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;user-select:none;
  letter-spacing:-0.05em;
  z-index:0;
}

.badge{
  display:inline-flex;align-items:center;gap:.6rem;
  background:rgba(255,0,128,.15);
  border:1px solid rgba(255,0,128,.4);
  backdrop-filter:blur(10px);
  padding:.5rem 1.5rem;
  font-size:.55rem;letter-spacing:.4em;text-transform:uppercase;
  color:var(--color-primary);margin-bottom:2rem;
  animation:badge-in 1s .2s both;
}
@keyframes badge-in{from{opacity:0;transform:translateY(-20px) scale(.9)}to{opacity:1;transform:translateY(0) scale(1)}}
.badge-dot{width:6px;height:6px;background:var(--color-primary);border-radius:50%;animation:pulse-dot 1.5s infinite}
@keyframes pulse-dot{0%,100%{box-shadow:0 0 0 0 rgba(255,0,128,.6)}50%{box-shadow:0 0 0 8px rgba(255,0,128,0)}}

.xv-name-wrap{position:relative;display:inline-block}
.xv-name{
  font-family:'Kaushan Script',cursive;
  font-size:clamp(4rem,15vw,11rem);
  color:var(--white);
  line-height:1;
  display:block;
  text-shadow:0 0 30px rgba(255,0,128,.5),0 0 60px rgba(155,0,255,.3);
  animation:name-in 1.2s .4s both;
}
@keyframes name-in{from{opacity:0;transform:scale(1.2)}to{opacity:1;transform:scale(1)}}
.xv-name-ghost{
  position:absolute;inset:0;
  font-family:'Kaushan Script',cursive;
  font-size:clamp(4rem,15vw,11rem);
  color:var(--color-primary);
  line-height:1;
  opacity:.4;
  animation:glitch1 5s 2s infinite;
}
.xv-name-ghost2{
  position:absolute;inset:0;
  font-family:'Kaushan Script',cursive;
  font-size:clamp(4rem,15vw,11rem);
  color:var(--color-secondary);
  line-height:1;
  opacity:.3;
  animation:glitch2 5s 2.5s infinite;
}

.xv-tag{
  font-size:clamp(.6rem,2vw,.8rem);
  font-weight:700;letter-spacing:.5em;
  color:var(--color-primary);
  text-transform:uppercase;
  margin:1rem 0;
  animation:badge-in 1s .6s both;
}
.date-neon{
  font-size:clamp(.8rem,2vw,1rem);
  font-weight:200;letter-spacing:.3em;
  color:rgba(255,255,255,.6);
  margin-top:1rem;
  animation:badge-in 1s .8s both;
}

/* Neon decorativo */
.neon-bar{
  width:80px;height:2px;
  background:linear-gradient(to right,var(--color-primary),var(--purple));
  margin:1.5rem auto;
  box-shadow:0 0 10px var(--color-primary),0 0 20px var(--purple);
  animation:badge-in 1s 1s both;
}

.scroll-neon{
  position:absolute;bottom:2rem;left:50%;transform:translateX(-50%);
  font-size:.55rem;letter-spacing:.3em;text-transform:uppercase;
  color:rgba(255,255,255,.3);
  animation:bounce-neon 2s ease-in-out infinite;
}
@keyframes bounce-neon{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(8px)}}

/* ── SECCIONES ── */
.dark2-sec{background:var(--dark2)}
.dark-sec{background:var(--color-bg)}
.pad{padding:6rem clamp(2rem,6vw,7rem)}

.sec-chip{
  display:inline-block;
  background:rgba(255,0,128,.15);border:1px solid rgba(255,0,128,.3);
  font-size:.55rem;letter-spacing:.4em;text-transform:uppercase;
  color:var(--color-primary);padding:.3rem 1rem;margin-bottom:1rem;
}
.sec-h-neon{
  font-family:'Bebas Neue',sans-serif;
  font-size:clamp(2.5rem,7vw,5rem);
  line-height:1;margin-bottom:3rem;
  letter-spacing:.05em;
}
.sec-h-neon .hot{color:var(--color-primary);text-shadow:0 0 20px rgba(255,0,128,.5)}
.sec-h-neon .cyans{color:var(--color-secondary);text-shadow:0 0 20px rgba(0,229,255,.4)}

/* ── FAMILIA ── */
.fam-neon-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1px;background:rgba(255,255,255,.05);max-width:900px;margin:0 auto}
.fam-neon-cell{
  background:var(--color-bg);padding:2.5rem 2rem;
  position:relative;overflow:hidden;
  border:1px solid rgba(255,0,128,.08);
  opacity:0;transform:translateY(20px);
  transition:opacity .6s,transform .6s,border-color .4s;
}
.fam-neon-cell.visible{opacity:1;transform:translateY(0)}
.fam-neon-cell:hover{border-color:rgba(255,0,128,.4)}
.fam-neon-cell::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(to right,transparent,var(--color-primary),transparent);opacity:0;transition:opacity .4s}
.fam-neon-cell:hover::before{opacity:1}
.fn-role{font-size:.5rem;letter-spacing:.4em;text-transform:uppercase;color:rgba(255,0,128,.7);margin-bottom:.8rem;font-weight:400}
.fn-name{font-family:'Kaushan Script',cursive;font-size:1.5rem;color:var(--white);line-height:1.5}

/* ── EVENTS NEON ── */
.ev-neon-wrap{max-width:900px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:1.5rem}
@media(max-width:600px){.ev-neon-wrap{grid-template-columns:1fr}}
.ev-neon{
  border:1px solid rgba(155,0,255,.3);
  padding:3rem 2rem;
  position:relative;overflow:hidden;
  background:rgba(155,0,255,.05);
  opacity:0;transform:translateX(-30px);
  transition:opacity .7s,transform .7s,border-color .4s;
}
.ev-neon:nth-child(2){border-color:rgba(0,229,255,.3);background:rgba(0,229,255,.03);transform:translateX(30px)}
.ev-neon.visible{opacity:1;transform:translateX(0)}
.ev-neon:hover{border-color:var(--purple)}
.ev-neon:nth-child(2):hover{border-color:var(--color-secondary)}
.ev-neon-num{font-family:'Bebas Neue',sans-serif;font-size:6rem;position:absolute;top:-1rem;right:1rem;opacity:.05;color:var(--white)}
.ev-neon-type{font-size:.5rem;letter-spacing:.4em;text-transform:uppercase;color:var(--purple);margin-bottom:.8rem;font-weight:400}
.ev-neon:nth-child(2) .ev-neon-type{color:var(--color-secondary)}
.ev-neon-name{font-family:'Bebas Neue',sans-serif;font-size:2rem;letter-spacing:.05em;margin-bottom:.3rem}
.ev-neon-time{font-family:'Kaushan Script',cursive;font-size:3rem;color:var(--color-primary);margin:.3rem 0;text-shadow:0 0 15px rgba(255,0,128,.4)}
.ev-neon:nth-child(2) .ev-neon-time{color:var(--color-secondary);text-shadow:0 0 15px rgba(0,229,255,.4)}
.ev-neon-place{font-size:.75rem;color:rgba(255,255,255,.4);line-height:1.7;font-weight:200;margin-bottom:2rem}
.btn-neon{
  display:inline-block;
  border:1px solid var(--color-primary);
  color:var(--color-primary);
  padding:.6rem 1.8rem;
  font-size:.55rem;letter-spacing:.3em;text-transform:uppercase;
  text-decoration:none;font-weight:400;
  transition:background .3s,box-shadow .3s;
}
.btn-neon:hover{background:rgba(255,0,128,.2);box-shadow:0 0 20px rgba(255,0,128,.3)}
.ev-neon:nth-child(2) .btn-neon{border-color:var(--color-secondary);color:var(--color-secondary)}
.ev-neon:nth-child(2) .btn-neon:hover{background:rgba(0,229,255,.1);box-shadow:0 0 20px rgba(0,229,255,.2)}

/* ── ITINERARIO NEON ── */
.it-neon-list{max-width:600px;margin:0 auto}
.it-neon-row{
  display:flex;gap:2rem;align-items:center;padding:1.5rem 0;
  border-bottom:1px solid rgba(255,255,255,.05);
  opacity:0;transform:translateX(-20px);
  transition:opacity .5s,transform .5s;
}
.it-neon-row.visible{opacity:1;transform:translateX(0)}
.it-neon-row:hover .it-icon-n{box-shadow:0 0 20px var(--color-primary)}
.it-icon-n{
  width:44px;height:44px;flex-shrink:0;
  background:rgba(255,0,128,.1);border:1px solid rgba(255,0,128,.3);
  border-radius:50%;display:flex;align-items:center;justify-content:center;
  font-size:1.1rem;transition:box-shadow .3s;
}
.it-neon-time{font-size:.55rem;letter-spacing:.35em;color:var(--color-primary);text-transform:uppercase;margin-bottom:.2rem;font-weight:400}
.it-neon-name{font-size:.9rem;color:var(--white);font-weight:300}

/* ── GALERÍA NEON ── */
.gal-neon{display:grid;grid-template-columns:repeat(auto-fill, minmax(240px, 1fr));gap:6px;padding:2rem}
.gal-neon img{width:100%;height:260px;object-fit:cover;filter:saturate(0) brightness(.7);transition:filter .5s,transform .5s;cursor:pointer}
.gal-neon img:hover{filter:saturate(1.3) brightness(1);transform:scale(1.05)}
@media(max-width:600px){.gal-neon{grid-template-columns:1fr 1fr}}

/* ── RSVP ── */
.rsvp-neon{
  padding:8rem clamp(2rem,6vw,7rem);
  text-align:center;position:relative;overflow:hidden;
  background:radial-gradient(ellipse 80% 60% at 50% 50%,rgba(155,0,255,.2),transparent),
             radial-gradient(ellipse 60% 40% at 30% 70%,rgba(255,0,128,.15),transparent),
             var(--color-bg);
}
.rsvp-neon-name{
  font-family:'Kaushan Script',cursive;
  font-size:clamp(3rem,12vw,8rem);
  color:var(--white);
  text-shadow:0 0 30px var(--color-primary),0 0 60px var(--purple);
  line-height:1;margin-bottom:1rem;
}
.rsvp-neon-date{font-size:.75rem;font-weight:200;letter-spacing:.2em;color:rgba(255,255,255,.4);margin-bottom:3.5rem}
.btn-neon-fill{
  display:inline-block;
  background:linear-gradient(135deg,var(--color-primary),var(--purple));
  color:#fff;
  padding:1.2rem 4.5rem;
  font-size:.65rem;letter-spacing:.35em;text-transform:uppercase;
  text-decoration:none;font-weight:700;
  box-shadow:0 0 30px rgba(255,0,128,.4),0 0 60px rgba(155,0,255,.3);
  transition:transform .3s,box-shadow .3s;
}
.btn-neon-fill:hover{transform:translateY(-4px);box-shadow:0 0 50px rgba(255,0,128,.6),0 0 80px rgba(155,0,255,.5)}
.dresscode-n{margin-top:2rem;font-size:.55rem;letter-spacing:.4em;text-transform:uppercase;color:rgba(255,255,255,.2)}

footer{background:var(--dark2);border-top:1px solid rgba(255,0,128,.1);padding:3rem;text-align:center;color:rgba(255,255,255,.2);font-size:.7rem;letter-spacing:.15em}
.f-kaushan{font-family:'Kaushan Script',cursive;font-size:2rem;color:var(--color-primary);display:block;margin-bottom:.5rem;text-shadow:0 0 15px rgba(255,0,128,.4)}
</style>
</head>
<body>

<!-- HERO -->
<section class="hero" data-field="portada_url">
  <div class="hero-grid"></div>
  <div class="orb" style="width:400px;height:400px;background:rgba(255,0,128,.15);top:-100px;left:-100px;animation-duration:8s"></div>
  <div class="orb" style="width:500px;height:500px;background:rgba(155,0,255,.1);bottom:-150px;right:-100px;animation-duration:10s;animation-delay:-4s"></div>
  <div class="orb" style="width:300px;height:300px;background:rgba(0,229,255,.08);top:50%;left:70%;animation-duration:7s;animation-delay:-2s"></div>

  <div class="hero-year">XV</div>

  <div class="hero-content">
    <div class="badge"><div class="badge-dot"></div><span data-field="mensaje_secundario">{{mensaje_secundario}}</span></div>
    <div class="xv-name-wrap">
      <span class="xv-name" data-field="nombre_festejada">{{nombre_festejada}}</span>
      <span class="xv-name-ghost" aria-hidden="true" data-field="nombre_festejada">{{nombre_festejada}}</span>
      <span class="xv-name-ghost2" aria-hidden="true" data-field="nombre_festejada">{{nombre_festejada}}</span>
    </div>
    <div class="xv-tag">XV ◆ Años</div>
    <div class="neon-bar"></div>
    <div class="date-neon" data-field="fecha_hero">{{fecha_hero}}</div>
  </div>
  <div class="scroll-neon">↓ desplázate</div>
</section>

<!-- FAMILIA -->
<section class="dark2-sec pad">
  <div style="margin-bottom:3rem">
    <div class="sec-chip">Con el amor de</div>
    <h2 class="sec-h-neon"><span class="hot">Familia</span> &amp; Padrinos</h2>
  </div>
  <div class="fam-neon-grid">
    <div class="fam-neon-cell"><div class="fn-role">Familia</div><div class="fn-name"><span data-field="madre">{{madre}}</span><br><span data-field="padre">{{padre}}</span></div></div>
    <div class="fam-neon-cell" style="transition-delay:.1s"><div class="fn-role">Padrinos</div><div class="fn-name" data-field="padrinos_html">{{padrinos_html}}</div></div>
    <div class="fam-neon-cell" style="transition-delay:.2s"><div class="fn-role">Madrina de Honor</div><div class="fn-name">Paola Ríos</div></div>
    <div class="fam-neon-cell" style="transition-delay:.3s"><div class="fn-role">Padrino de Corona</div><div class="fn-name">David Castro</div></div>
  </div>
</section>

<!-- EVENTOS -->
<section class="dark-sec pad">
  <div style="margin-bottom:3rem">
    <div class="sec-chip">Dos momentos épicos</div>
    <h2 class="sec-h-neon">Los <span class="cyans">Eventos</span></h2>
  </div>
  <div class="ev-neon-wrap">
    <div class="ev-neon">
      <div class="ev-neon-num">01</div>
      <div class="ev-neon-type">Misa de XV años</div>
      <div class="ev-neon-name">La Ceremonia</div>
      <div class="ev-neon-time" data-field="hora_ceremonia">{{hora_ceremonia}}</div>
      <div class="ev-neon-place"><span data-field="lugar_ceremonia">{{lugar_ceremonia}}</span><br><span data-field="direccion_ceremonia">{{direccion_ceremonia}}</span></div>
      <a href="#" class="btn-neon">Ver ubicación →</a>
    </div>
    <div class="ev-neon">
      <div class="ev-neon-num">02</div>
      <div class="ev-neon-type">Recepción &amp; Fiesta</div>
      <div class="ev-neon-name">La Celebración</div>
      <div class="ev-neon-time" data-field="hora_recepcion">{{hora_recepcion}}</div>
      <div class="ev-neon-place"><span data-field="lugar_recepcion">{{lugar_recepcion}}</span><br><span data-field="direccion_recepcion">{{direccion_recepcion}}</span></div>
      <a href="#" class="btn-neon">Ver ubicación →</a>
    </div>
  </div>
</section>

<!-- ITINERARIO -->
<section class="dark2-sec pad">
  <div style="margin-bottom:3rem">
    <div class="sec-chip">La noche</div>
    <h2 class="sec-h-neon">Programa <span class="hot">✦</span></h2>
  </div>
  <div class="it-neon-list" data-field="itin_html">
    {{itin_html}}
  </div>
</section>

<!-- GALERÍA -->
<section>
  <div class="gal-neon" data-field="galeria_html">
    {{galeria_html}}
  </div>
</section>

<!-- RSVP -->
<section class="rsvp-neon">
  <div class="rsvp-neon-name" data-field="nombre_festejada">{{nombre_festejada}}</div>
  <p class="rsvp-neon-date">XV Años · <span data-field="fecha_hero">{{fecha_hero}}</span><br>Confirma antes del <span data-field="confirmacion_fecha">{{confirmacion_fecha}}</span></p>
  <a href="{{whatsapp_url}}" class="btn-neon-fill" data-field="whatsapp_url">Confirmar por WhatsApp</a>
  <p class="dresscode-n">✦ Dress code: Glam &amp; Elegante ✦</p>
</section>

<footer>
  <span class="f-kaushan" data-field="nombre_festejada">{{nombre_festejada}}</span>
  XV Años · <span data-field="fecha_hero">{{fecha_hero}}</span> · Hecha con mucho amor ✦
</footer>

<script>
const obs=new IntersectionObserver(e=>e.forEach(x=>x.isIntersecting&&x.target.classList.add('visible')),{threshold:.1});
document.querySelectorAll('.fam-neon-cell,.ev-neon,.it-neon-row').forEach(el=>obs.observe(el));
</script>
</body>
</html>
`;
