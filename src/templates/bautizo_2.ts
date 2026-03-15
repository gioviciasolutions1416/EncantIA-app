export const BAUTIZO_2 = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Bautizo — {{nombre_festejado}} · Linen Edition</title>
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400;1,600&family=Raleway:wght@200;300;400&family=Pacifico&display=swap" rel="stylesheet">
<style>
  :root {
    --color-primary: {{color_primary
    /* Mapeo adaptado a locales */
    --terr: var(--color-primary);
    --olive: var(--color-secondary);
    --warm-white: var(--color-bg);
  }};
    --color-secondary: {{color_secondary}};
    --color-bg: {{color_bg}};
    --font-titulos: '{{font_titulos}}', serif;
    --font-cuerpo: '{{font_cuerpo}}', sans-serif;
  --linen:#F5F0E8;
  --sand:#E8D9C0;
  --taupe:#B8A48A;
  --brown:#5C4433;
  --olive-pale:#C8D4B0;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Raleway',sans-serif;background:var(--linen);color:var(--brown);overflow-x:hidden}

/* ── GRAIN ── */
body::after{
  content:'';position:fixed;inset:0;pointer-events:none;z-index:999;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.035'/%3E%3C/svg%3E");
  opacity:.5;
}

/* ── WATERCOLOR BLOBS ── */
.blob{position:absolute;pointer-events:none;border-radius:50%;filter:blur(80px);animation:blob-drift ease-in-out infinite alternate}
@keyframes blob-drift{from{transform:translate(0,0) scale(1)}to{transform:translate(20px,30px) scale(1.08)}}

/* ── HERO ── */
.hero{
  min-height:100vh;
  position:relative;
  display:grid;grid-template-columns:1fr 1fr;
  overflow:hidden;
  background:var(--color-bg);
}
@media(max-width:700px){.hero{grid-template-columns:1fr;min-height:auto}}

.hero-img-side{
  position:relative;overflow:hidden;
  background:url('{{portada_url}}') center/cover no-repeat;
  min-height:60vw;
}
@media(max-width:700px){.hero-img-side{min-height:70vw}}
.hero-img-side::after{content:'';position:absolute;inset:0;background:linear-gradient(to right,rgba(251,248,242,.4),transparent)}
.hero-img-side::before{content:'';position:absolute;inset:0;background:rgba(92,68,51,.1)}

.hero-text-side{
  display:flex;flex-direction:column;justify-content:center;
  padding:clamp(3rem,6vw,6rem);
  position:relative;
}

.hero-text-side .blob.b1{width:300px;height:300px;background:rgba(200,212,176,.4);top:-50px;right:-80px;animation-duration:9s}
.hero-text-side .blob.b2{width:200px;height:200px;background:rgba(196,120,96,.2);bottom:0;left:-50px;animation-duration:7s}

.small-cross{
  display:inline-flex;align-items:center;gap:1rem;margin-bottom:2rem;
  opacity:0;animation:appear 1s .3s both;
}
@keyframes appear{from{opacity:0;transform:translateY(15px)}to{opacity:1;transform:translateY(0)}}
.cross-arm{width:30px;height:1px;background:var(--taupe)}
.cross-symbol{color:var(--color-secondary);font-size:1.2rem}

.overline-linen{font-size:.6rem;letter-spacing:.45em;text-transform:uppercase;color:var(--taupe);margin-bottom:1.5rem;font-weight:300;opacity:0;animation:appear 1s .4s both}

.baby-name-linen{
  font-family:'Pacifico',cursive;
  font-size:clamp(3rem,8vw,6rem);
  color:var(--brown);
  line-height:1;
  opacity:0;animation:appear 1s .5s both;
}

.divider-linen{
  display:flex;align-items:center;gap:1rem;margin:2rem 0;
  opacity:0;animation:appear 1s .7s both;
}
.dl-line{flex:1;max-width:50px;height:1px;background:var(--sand)}
.dl-leaf{color:var(--color-secondary);font-size:1rem}

.details-linen{opacity:0;animation:appear 1s .9s both}
.detail-row{display:flex;align-items:flex-start;gap:1rem;margin-bottom:1.2rem}
.dr-icon{color:var(--color-secondary);font-size:1rem;margin-top:.1rem;flex-shrink:0}
.dr-label{font-size:.55rem;letter-spacing:.35em;text-transform:uppercase;color:var(--taupe);margin-bottom:.2rem;font-weight:300}
.dr-val{font-size:.9rem;color:var(--brown);font-weight:300;line-height:1.5}

/* ── SECCIONES ── */
.linen-sec{background:var(--linen)}
.warm-white-sec{background:var(--color-bg)}
.sand-sec{background:var(--sand)}
.brown-sec{background:var(--brown);color:var(--linen)}
.pad{padding:6rem clamp(2rem,6vw,6rem)}

.sec-eyebrow{font-size:.58rem;letter-spacing:.45em;text-transform:uppercase;color:var(--taupe);margin-bottom:.8rem;font-weight:300}
.brown-sec .sec-eyebrow{color:var(--sand)}
.sec-h-linen{font-family:'Lora',serif;font-style:italic;font-size:clamp(1.8rem,5vw,3rem);color:var(--brown);margin-bottom:3rem;line-height:1.2}
.brown-sec .sec-h-linen{color:var(--linen)}

/* ── FAMILIA ── */
.fam-linen{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:2rem;max-width:800px;margin:0 auto}
.fl-card{
  padding:2.5rem 2rem;
  border:1px solid var(--sand);background:var(--color-bg);
  position:relative;
  opacity:0;transform:translateY(20px);
  transition:opacity .6s,transform .6s,box-shadow .4s;
}
.fl-card.visible{opacity:1;transform:translateY(0)}
.fl-card:hover{box-shadow:0 10px 40px rgba(92,68,51,.08)}
.fl-card::before{content:'✿';position:absolute;top:-.7rem;left:50%;transform:translateX(-50%);background:var(--color-bg);padding:0 .5rem;color:var(--color-secondary);font-size:1.1rem}
.fl-role{font-size:.55rem;letter-spacing:.4em;text-transform:uppercase;color:var(--taupe);margin-bottom:.8rem;font-weight:300}
.fl-name{font-family:'Lora',serif;font-style:italic;font-size:1.1rem;color:var(--brown);line-height:1.5}

/* ── VERSE ── */
.verse-block{
  max-width:600px;margin:0 auto;text-align:center;
  padding:4rem clamp(2rem,6vw,6rem);
  position:relative;
}
.verse-block::before,.verse-block::after{
  content:'"';font-family:'Lora',serif;font-size:5rem;color:var(--olive-pale);
  position:absolute;line-height:1;
}
.verse-block::before{top:2rem;left:2rem}
.verse-block::after{content:'"';bottom:1rem;right:2rem}
.verse-text{font-family:'Lora',serif;font-style:italic;font-size:clamp(1.1rem,3vw,1.4rem);line-height:1.8;color:var(--brown);opacity:0;transition:opacity .8s,transform .8s;transform:translateY(20px)}
.verse-text.visible{opacity:1;transform:translateY(0)}
.verse-ref{margin-top:1rem;font-size:.7rem;letter-spacing:.3em;color:var(--taupe);text-transform:uppercase}

/* ── CEREMONIA ── */
.cer-linen{
  max-width:550px;margin:0 auto;
  border:1px solid var(--sand);
  overflow:hidden;
  opacity:0;transform:scale(.97);
  transition:opacity .8s,transform .8s;
}
.cer-linen.visible{opacity:1;transform:scale(1)}
.cer-top{background:var(--color-secondary);padding:2.5rem;text-align:center}
.cer-label{font-size:.55rem;letter-spacing:.4em;text-transform:uppercase;color:rgba(255,255,255,.7);margin-bottom:.5rem}
.cer-name-big{font-family:'Pacifico',cursive;font-size:2.5rem;color:#fff;margin:.3rem 0}
.cer-time{font-family:'Lora',serif;font-style:italic;font-size:1rem;color:rgba(255,255,255,.8)}
.cer-body{background:var(--color-bg);padding:2.5rem}
.cer-item{display:flex;gap:1rem;align-items:flex-start;margin-bottom:1.5rem}
.cer-icon{color:var(--color-secondary);font-size:1.1rem;flex-shrink:0;margin-top:.1rem}
.cer-detail-label{font-size:.55rem;letter-spacing:.35em;text-transform:uppercase;color:var(--taupe);margin-bottom:.2rem}
.cer-detail-val{font-size:.9rem;color:var(--brown);font-weight:300}
.btn-olive{display:block;background:var(--brown);color:var(--linen);padding:1.1rem;text-align:center;font-size:.6rem;letter-spacing:.3em;text-transform:uppercase;text-decoration:none;transition:background .3s}
.btn-olive:hover{background:var(--color-secondary)}

/* ── ITINERARIO ── */
.it-linen{max-width:500px;margin:0 auto;display:grid;gap:0}
.il-row{
  display:grid;grid-template-columns:70px 1fr;gap:1.5rem;align-items:flex-start;
  padding:2rem 0;border-bottom:1px solid var(--sand);
  opacity:0;transition:opacity .6s,transform .6s;transform:translateX(-20px);
}
.il-row.visible{opacity:1;transform:translateX(0)}
.il-time{font-family:'Lora',serif;font-style:italic;font-size:1.5rem;color:var(--color-secondary);line-height:1}
.il-name{font-size:.95rem;color:var(--brown);font-weight:300;line-height:1.5}
.il-desc{font-size:.75rem;color:var(--taupe);margin-top:.2rem}

/* ── GALERÍA ── */
.gal-linen{display:grid;grid-template-columns:repeat(auto-fill, minmax(240px, 1fr));gap:8px;max-width:1000px;margin:0 auto;padding:0 1rem}
.gal-linen img{width:100%;height:240px;object-fit:cover;filter:sepia(.25) saturate(.9);transition:filter .4s,transform .4s;cursor:pointer;border-radius:1rem}
.gal-linen img:hover{filter:sepia(0) saturate(1.1);transform:scale(1.03)}
@media(max-width:600px){.gal-linen{grid-template-columns:1fr 1fr}}

/* ── RSVP ── */
.rsvp-linen{
  background:var(--color-bg);
  padding:8rem clamp(2rem,6vw,6rem);
  text-align:center;
  position:relative;
}
.rsvp-linen::before{
  content:'';position:absolute;
  top:3rem;left:50%;transform:translateX(-50%);
  width:80%;height:1px;background:var(--sand);
}
.rsvp-linen::after{
  content:'';position:absolute;
  bottom:3rem;left:50%;transform:translateX(-50%);
  width:80%;height:1px;background:var(--sand);
}
.rl-cross{font-size:2rem;color:var(--color-secondary);margin-bottom:1.5rem;display:block}
.rl-name{font-family:'Pacifico',cursive;font-size:clamp(2.5rem,8vw,5rem);color:var(--brown);line-height:1;margin-bottom:.5rem}
.rl-sub{font-family:'Lora',serif;font-style:italic;font-size:1rem;color:var(--taupe);margin-bottom:3rem}
.btn-terr{display:inline-block;background:var(--color-primary);color:#fff;padding:1.1rem 4rem;font-size:.6rem;letter-spacing:.35em;text-transform:uppercase;text-decoration:none;transition:background .3s,transform .3s}
.btn-terr:hover{background:var(--brown);transform:translateY(-3px)}
.rl-deadline{margin-top:1.5rem;font-size:.6rem;letter-spacing:.3em;color:var(--taupe);text-transform:uppercase}

footer{background:var(--brown);color:rgba(245,240,232,.3);text-align:center;padding:3rem;font-size:.75rem;letter-spacing:.1em}
.f-pac{font-family:'Pacifico',cursive;font-size:2rem;color:var(--sand);display:block;margin-bottom:.5rem}
</style>
</head>
<body>

<!-- HERO -->
<section class="hero">
  <div class="hero-img-side" data-field="portada_url"></div>
  <div class="hero-text-side">
    <div class="blob b1"></div>
    <div class="blob b2"></div>
    <div class="small-cross">
      <div class="cross-arm"></div>
      <div class="cross-symbol">✟</div>
      <div class="cross-arm"></div>
    </div>
    <p class="overline-linen" data-field="mensaje_secundario">{{mensaje_secundario}}</p>
    <h1 class="baby-name-linen" data-field="nombre_festejado">{{nombre_festejado}}</h1>
    <div class="divider-linen"><div class="dl-line"></div><div class="dl-leaf">🌿</div><div class="dl-line"></div></div>
    <div class="details-linen">
      <div class="detail-row"><div class="dr-icon">📅</div><div><div class="dr-label">Fecha</div><div class="dr-val" data-field="fecha_hero">{{fecha_hero}}</div></div></div>
      <div class="detail-row"><div class="dr-icon">⏰</div><div><div class="dr-label">Hora</div><div class="dr-val" data-field="hora_ceremonia">{{hora_ceremonia}}</div></div></div>
      <div class="detail-row"><div class="dr-icon">📍</div><div><div class="dr-label">Lugar</div><div class="dr-val"><span data-field="lugar_ceremonia">{{lugar_ceremonia}}</span><br><span data-field="direccion_ceremonia">{{direccion_ceremonia}}</span></div></div></div>
    </div>
  </div>
</section>

<!-- VERSICULO -->
<section class="warm-white-sec">
  <div class="verse-block">
    <p class="verse-text">
      "Bautícense, y cada uno de ustedes, en el nombre de Jesucristo, para perdón de sus pecados, y recibirán el don del Espíritu Santo."
      <br><span class="verse-ref">— Hechos 2:38</span>
    </p>
  </div>
</section>

<!-- FAMILIA -->
<section class="linen-sec pad">
  <div style="text-align:center">
    <p class="sec-eyebrow">Sus seres queridos</p>
    <h2 class="sec-h-linen">Familia &amp; Padrinos</h2>
  </div>
  <div class="fam-linen">
    <div class="fl-card"><div class="fl-role">Familia</div><div class="fl-name"><span data-field="madre">{{madre}}</span><br><span data-field="padre">{{padre}}</span></div></div>
    <div class="fl-card" style="transition-delay:.15s">
      <div class="fl-role">Madrina</div>
      <div class="fl-name" data-field="madrina">{{madrina}}</div>
    </div>
    <div class="fl-card" style="transition-delay:.20s">
      <div class="fl-role">Padrino</div>
      <div class="fl-name" data-field="padrino">{{padrino}}</div>
    </div>
  </div>
</section>

<!-- CEREMONIA -->
<section class="warm-white-sec pad">
  <div style="text-align:center">
    <p class="sec-eyebrow">El sacramento</p>
    <h2 class="sec-h-linen">El Gran Día</h2>
  </div>
  <div class="cer-linen">
    <div class="cer-top">
      <div class="cer-label">Bautismo de</div>
      <div class="cer-name-big" data-field="nombre_festejado">{{nombre_festejado}}</div>
      <div class="cer-time" data-field="fecha_hero">{{fecha_hero}}</div>
    </div>
    <div class="cer-body">
      <div class="cer-item"><div class="cer-icon">⛪</div><div><div class="cer-detail-label">Ceremonia</div><div class="cer-detail-val"><span data-field="lugar_ceremonia">{{lugar_ceremonia}}</span> · <span data-field="hora_ceremonia">{{hora_ceremonia}}</span><br><span data-field="direccion_ceremonia">{{direccion_ceremonia}}</span></div></div></div>
      <div class="cer-item"><div class="cer-icon">🌿</div><div><div class="cer-detail-label">Convivio</div><div class="cer-detail-val"><span data-field="lugar_recepcion">{{lugar_recepcion}}</span> · <span data-field="hora_recepcion">{{hora_recepcion}}</span><br><span data-field="direccion_recepcion">{{direccion_recepcion}}</span></div></div></div>
      <div class="cer-item"><div class="cer-icon">👗</div><div><div class="cer-detail-label">Dress code</div><div class="cer-detail-val" data-field="vestimenta">{{vestimenta}}</div></div></div>
    </div>
    <a href="#" class="btn-olive">Ver en el Mapa</a>
  </div>
</section>

<!-- ITINERARIO -->
<section class="linen-sec pad">
  <div style="text-align:center;max-width:800px;margin:0 auto">
    <p class="sec-eyebrow">El programa</p>
    <h2 class="sec-h-linen">El Día de <span data-field="nombre_festejado">{{nombre_festejado}}</span></h2>
    <div class="it-linen" data-field="itin_html">
      {{itin_html}}
    </div>
  </div>
</section>

<!-- GALERÍA -->
<section class="warm-white-sec" style="padding:5rem 0">
  <div style="text-align:center;padding:0 2rem 3rem">
    <p class="sec-eyebrow">Nuestro ángel</p>
    <h2 class="sec-h-linen">Momentos especiales</h2>
  </div>
  <div class="gal-linen" data-field="galeria_html">
    {{galeria_html}}
  </div>
</section>

<!-- RSVP -->
<section class="rsvp-linen">
  <span class="rl-cross">✟</span>
  <div class="rl-name" data-field="nombre_festejado">{{nombre_festejado}}</div>
  <p class="rl-sub">Nos honras con tu presencia</p>
  <a href="{{whatsapp_url}}" class="btn-terr" data-field="whatsapp_url">Confirmar Asistencia</a>
  <p class="rl-deadline">Confirma antes del <span data-field="confirmacion_fecha">{{confirmacion_fecha}}</span></p>
</section>

<footer>
  <span class="f-pac" data-field="nombre_festejado">{{nombre_festejado}}</span>
  Bautizo · <span data-field="fecha_hero">{{fecha_hero}}</span> · Con amor
</footer>

<script>
const obs=new IntersectionObserver(e=>e.forEach(x=>x.isIntersecting&&x.target.classList.add('visible')),{threshold:.1});
document.querySelectorAll('.fl-card,.cer-linen,.il-row,.verse-text').forEach(el=>obs.observe(el));
</script>
</body>
</html>
`;
