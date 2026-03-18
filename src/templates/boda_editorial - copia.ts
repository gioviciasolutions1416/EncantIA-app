export const BODA_EDITORIAL = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Giovanna & Victor — Nuestra Boda</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link id="dynamic-fonts" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300&family=Montserrat:wght@200;400;600&family=Playfair+Display:ital,wght@0,900;1,900&display=swap" rel="stylesheet">
    <style>
        :root {
            --color-primary: #C5A059;
            --color-secondary: #1A2421;
            --color-bg: #F9F7F2;
            --font-titulos: 'Playfair Display', serif;
            --font-cuerpo: 'Montserrat', sans-serif;
            --font-serif: 'Cormorant Garamond', serif;
            --font-scale: 1;
            --transition-elegant: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; -webkit-font-smoothing: antialiased; }
        body {
            background-color: var(--color-bg);
            color: var(--color-secondary);
            font-family: var(--font-cuerpo);
            overflow-x: hidden;
            line-height: 1.6;
        }

        /* BOKEH */
        .bokeh-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; overflow: hidden; }
        .bokeh-light { position: absolute; background: radial-gradient(circle, rgba(197,160,89,0.2) 0%, rgba(197,160,89,0) 70%); border-radius: 50%; filter: blur(40px); animation: float-bokeh 15s infinite ease-in-out; }
        @keyframes float-bokeh { 0%,100% { transform: translate(0,0) scale(1); opacity: .3; } 50% { transform: translate(100px,-50px) scale(1.5); opacity: .6; } }

        /* UTILITIES */
        .fade-in { opacity: 0; transform: translateY(30px); transition: var(--transition-elegant); }
        .fade-in.visible { opacity: 1; transform: translateY(0); }

        .btn-gold {
            display: inline-block; padding: 15px 35px;
            border: 1px solid var(--color-primary);
            color: var(--color-secondary); text-decoration: none;
            text-transform: uppercase; letter-spacing: 2px; font-size: .8rem;
            position: relative; overflow: hidden;
            transition: var(--transition-elegant);
            background: transparent; cursor: pointer;
        }
        .btn-gold:hover { background: var(--color-primary); color: white; transform: translateY(-3px); }

        /* HERO */
        .hero { height: 100vh; display: flex; align-items: center; padding: 5%; position: relative; background-color: #fff; }
        .hero-img-container { position: absolute; right: 0; top: 0; width: 60%; height: 100%; clip-path: polygon(15% 0, 100% 0, 100% 100%, 0% 100%); overflow: hidden; }
        .hero-img-container img { width: 100%; height: 100%; object-fit: cover; animation: slow-zoom 20s infinite alternate; }
        @keyframes slow-zoom { from { transform: scale(1); } to { transform: scale(1.1); } }
        .hero-content { z-index: 2; width: 50%; }
        .hero-names { font-family: var(--font-titulos); font-size: clamp(3rem, 10vw, 6rem); line-height: .9; margin-bottom: 20px; }
        .hero-names span { display: block; }
        .hero-date { font-family: var(--font-serif); font-style: italic; font-size: 1.5rem; color: var(--color-primary); margin-bottom: 30px; }

        /* COUNTDOWN */
        .countdown-section { padding: 80px 5%; text-align: center; background: white; border-bottom: 1px solid #eee; }
        .cd-wrapper { display: grid; grid-template-columns: repeat(4,1fr); max-width: 600px; margin: 0 auto; }
        .cd-item span { font-size: 2.5rem; font-family: var(--font-titulos); display: block; }
        .cd-item label { text-transform: uppercase; font-size: .7rem; letter-spacing: 2px; opacity: .6; }

        /* FAMILIA */
        .familia-section { padding: 100px 10%; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; }
        .familia-block h3 { font-family: var(--font-serif); font-style: italic; font-size: 2rem; border-bottom: 1px solid var(--color-primary); margin-bottom: 20px; display: inline-block; }
        .parents-grid { margin-bottom: 40px; }
        .padrino-item { margin-bottom: 15px; display: flex; flex-direction: column; }
        .padrino-rol { font-size: .7rem; color: var(--color-primary); font-weight: 600; text-transform: uppercase; }
        .padrino-nombre { font-family: var(--font-serif); font-size: 1.2rem; }

        /* EVENTOS */
        .eventos-section { padding: 100px 5%; background: #fdfdfd; }
        .eventos-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
        .evento-card { padding: 60px; background: white; border: 1px solid #f0f0f0; box-shadow: 20px 20px 0px var(--color-bg); transition: var(--transition-elegant); }
        .evento-card:hover { transform: translateY(-10px); box-shadow: 10px 10px 0px var(--color-primary); }
        .evento-title { font-family: var(--font-titulos); font-size: 2rem; margin-bottom: 15px; }

        /* VESTIMENTA */
        .vestimenta-section { padding: 100px 10%; text-align: center; background: var(--color-secondary); color: white; }
        .vestimenta-icons { display: flex; justify-content: center; gap: 50px; margin: 40px 0; flex-wrap: wrap; }
        .v-box h4 { font-family: var(--font-serif); font-size: 1.5rem; color: var(--color-primary); margin-bottom: .5rem; }

        /* ITINERARIO */
        .itinerario-section { padding: 100px 5%; position: relative; }
        .itin-container { max-width: 800px; margin: 0 auto; border-left: 1px solid var(--color-primary); padding-left: 40px; }
        .itin-item { margin-bottom: 40px; position: relative; display: flex; align-items: flex-start; gap: 1rem; }
        .itin-item::before { content: ''; position: absolute; left: -46px; top: 10px; width: 10px; height: 10px; background: var(--color-primary); border-radius: 50%; }
        .itin-time { font-weight: 600; color: var(--color-primary); min-width: 70px; flex-shrink: 0; }
        .itin-icon { font-size: 1.2rem; flex-shrink: 0; }
        .itin-body { flex: 1; }
        .itin-name { font-family: var(--font-titulos); font-size: 1.4rem; margin-bottom: 4px; }
        .itin-desc { font-size: .9rem; opacity: .7; }
        .itin-empty { text-align: center; padding: 3rem; font-style: italic; opacity: .5; }

        /* GALERÍA */
        .gal-dynamic { display: grid; grid-template-columns: repeat(3,1fr); grid-auto-rows: 300px; gap: 15px; padding: 15px; }
        .gal-dynamic img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(1); transition: .5s; cursor: pointer; }
        .gal-dynamic img:hover { filter: grayscale(0); transform: scale(.98); }
        .gal-dynamic img:nth-child(2n) { grid-row: span 2; }

        /* FIRMAS */
        .firma-card { background: white; padding: 1.25rem 1.5rem; border: 1px solid #f0e8d8; border-left: 3px solid var(--color-primary); margin-bottom: .75rem; text-align: left; }
        .firma-card-nombre { font-family: var(--font-cuerpo); font-size: .65rem; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; color: var(--color-primary); margin-bottom: .4rem; }
        .firma-card-msg { font-family: var(--font-serif); font-style: italic; font-size: .95rem; opacity: .75; line-height: 1.6; }

        /* MÚSICA */
        .btn-play { display: inline-block; padding: 12px 30px; background: var(--color-primary); color: white; border: none; font-family: var(--font-cuerpo); font-size: .8rem; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: .3s; }
        .btn-play:hover { opacity: .85; transform: translateY(-2px); }
        .regalo-link { display: inline-block; margin: .5rem; padding: 10px 24px; border: 1px solid var(--color-primary); color: var(--color-primary); text-decoration: none; font-size: .8rem; letter-spacing: 1px; transition: .3s; }
        .regalo-link:hover { background: var(--color-primary); color: white; }

        /* RSVP */
        .rsvp-section { padding: 100px 5%; text-align: center; }
        .rsvp-card { background: white; padding: 60px; max-width: 700px; margin: 0 auto; border: 1px solid var(--color-primary); }

        /* MOBILE */
        @media (max-width: 600px) {
            .hero { flex-direction: column; overflow-y: auto; height: auto; min-height: 100vh; }
            .hero-img-container { width: 100%; height: 50vh; top: 50vh; clip-path: none; position: relative; }
            .hero-content { width: 100%; }
            .familia-section, .eventos-grid { grid-template-columns: 1fr; }
            .gal-dynamic { grid-template-columns: 1fr 1fr; }
            .gal-dynamic img:nth-child(2n) { grid-row: span 1; }
        }
    </style>
</head>
<body>

    <div class="bokeh-container">
        <div class="bokeh-light" style="width:300px;height:300px;top:10%;left:10%;"></div>
        <div class="bokeh-light" style="width:400px;height:400px;top:60%;right:-5%;animation-delay:-5s;"></div>
        <div class="bokeh-light" style="width:250px;height:250px;top:40%;left:50%;animation-delay:-2s;"></div>
    </div>

    <!-- 1. HERO -->
    <section class="hero">
        <div class="hero-content">
            <p class="fade-in" data-field="frase" style="margin-bottom:1.5rem; font-family:var(--font-serif); font-style:italic; font-size:1.1rem; opacity:.8;">"En la profundidad del bosque y bajo el destello de mil luces, comenzamos nuestro 'siempre'."</p>
            <h1 class="hero-names">
                <span data-field="novia">GIOVANNA</span>
                <span style="font-family:var(--font-serif);font-size:.4em;font-style:italic;margin-left:20px;">&</span>
                <span data-field="novio">VICTOR</span>
            </h1>
            <p class="hero-date fade-in" data-field="fecha_hero">Sábado, 24 de Octubre de 2026</p>
            <p class="fade-in" data-field="mensaje_secundario" style="letter-spacing:3px;font-size:.8rem;text-transform:uppercase;">San Miguel de Allende, México</p>
            <p data-bilingual style="display:none;font-family:var(--font-serif);font-style:italic;font-size:.85rem;color:var(--color-primary);margin-top:.75rem;opacity:.7;">We warmly invite you to our wedding</p>
        </div>
        <div class="hero-img-container">
            <div data-field="portada_url" style="background-image: url('https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=1400'); width:100%; height:100%; background-size:cover; background-position:center;"></div>
        </div>
    </section>

    <!-- 2. SOLO ADULTOS -->
    <div data-field="solo_adultos" style="display:none;background:var(--color-primary);color:white;text-align:center;padding:10px;font-size:.7rem;letter-spacing:2px;">
        EVENTO EXCLUSIVO PARA ADULTOS
    </div>

    <!-- 3. COUNTDOWN -->
    <section class="countdown-section">
        <h2 style="font-family:var(--font-serif);font-style:italic;margin-bottom:30px;">Estamos a punto de comenzar...</h2>
        <div class="cd-wrapper">
            <div class="cd-item"><span id="cd-dias">00</span><label>Días</label></div>
            <div class="cd-item"><span id="cd-horas">00</span><label>Horas</label></div>
            <div class="cd-item"><span id="cd-min">00</span><label>Min</label></div>
            <div class="cd-item"><span id="cd-seg">00</span><label>Seg</label></div>
        </div>
    </section>

    <!-- 4. FAMILIA -->
    <section class="familia-section">
        <div class="familia-block fade-in">
            <h3>Padres de la Novia</h3>
            <div class="parents-grid">
                <p data-field="madre_novia">Sra. Elena María Rodríguez</p>
                <p data-field="padre_novia">Sr. Roberto Carlos Gallegos</p>
            </div>
            <h3>Padres del Novio</h3>
            <div class="parents-grid">
                <p data-field="madre_novio">Sra. Beatriz Adriana Torres</p>
                <p data-field="padre_novio">Sr. Victor Manuel Espinoza</p>
            </div>
        </div>
        <div class="familia-block fade-in">
            <h3>Corte de Honor</h3>
            <div data-field="padrinos_html">
                <div class="padrino-item">
                    <span class="padrino-rol">Padrinos de Velación</span>
                    <span class="padrino-nombre">Luis Miguel & Aracely Arámbula</span>
                </div>
                <div class="padrino-item">
                    <span class="padrino-rol">Anillos</span>
                    <span class="padrino-nombre">Carlos Rivera & Cynthia Rodríguez</span>
                </div>
            </div>
        </div>
    </section>

    <!-- 5. EVENTOS -->
    <section class="eventos-section">
        <div class="eventos-grid">
            <div class="evento-card fade-in">
                <h2 class="evento-title">Ceremonia Religiosa</h2>
                <p class="itin-time" data-field="hora_ceremonia" style="color:var(--color-primary);font-size:1.1rem;margin-bottom:1rem;">17:00 HRS</p>
                <p><strong data-field="lugar_ceremonia">Parroquia de San Miguel Arcángel</strong></p>
                <p data-field="direccion_ceremonia" style="opacity:.7;margin-top:.25rem;">Principal S/N, Centro, San Miguel de Allende, Gto.</p>
                <a href="#" class="btn-gold" data-field="location_url" style="margin-top:20px;">Ver Mapa</a>
            </div>
            <div class="evento-card fade-in">
                <h2 class="evento-title">Recepción</h2>
                <p class="itin-time" data-field="hora_recepcion" style="color:var(--color-primary);font-size:1.1rem;margin-bottom:1rem;">19:30 HRS</p>
                <p><strong data-field="lugar_recepcion">Hacienda San José Lavista</strong></p>
                <p data-field="direccion_recepcion" style="opacity:.7;margin-top:.25rem;">Km 10.2 Carretera a Dolores Hidalgo, San Miguel de Allende.</p>
                <a href="#" class="btn-gold" data-field="location_url_recepcion" style="margin-top:20px;">Ver Mapa</a>
            </div>
        </div>
    </section>

    <!-- 6. VESTIMENTA -->
    <section class="vestimenta-section">
        <h2 style="font-family:var(--font-titulos);font-size:2.5rem;">Dress Code</h2>
        <p data-field="vestimenta" style="font-size:1.5rem;letter-spacing:4px;margin-top:10px;">FORMAL DE ETIQUETA</p>
        <div class="vestimenta-icons">
            <div class="v-box">
                <h4>Damas</h4>
                <p data-field="vestimenta_damas">Vestido largo de gala. Se reservan los colores blanco y champagne.</p>
            </div>
            <div class="v-box">
                <h4>Caballeros</h4>
                <p data-field="vestimenta_caballeros">Smoking o traje formal oscuro.</p>
            </div>
        </div>
        <p data-field="vestimenta_nota" style="font-style:italic;opacity:.8;">Tu presencia es nuestro mejor regalo, luce espectacular.</p>
    </section>

    <!-- 7. ITINERARIO -->
    <section class="itinerario-section">
        <h2 style="text-align:center;font-family:var(--font-titulos);margin-bottom:50px;">Nuestra Historia en Horas</h2>
        <div class="itin-container" data-field="itin_html">
            <div class="itin-item visible">
                <div class="itin-time">17:00</div>
                <div class="itin-icon">⛪</div>
                <div class="itin-body">
                    <div class="itin-name">Ceremonia</div>
                    <div class="itin-desc">El momento del "Sí, acepto".</div>
                </div>
            </div>
            <div class="itin-item visible">
                <div class="itin-time">18:30</div>
                <div class="itin-icon">🥂</div>
                <div class="itin-body">
                    <div class="itin-name">Coctel de Bienvenida</div>
                    <div class="itin-desc">Mixología de autor y canapés mexicanos.</div>
                </div>
            </div>
            <div class="itin-item visible">
                <div class="itin-time">20:00</div>
                <div class="itin-icon">🍽️</div>
                <div class="itin-body">
                    <div class="itin-name">Cena de Gala</div>
                    <div class="itin-desc">Banquete de 4 tiempos en los jardines.</div>
                </div>
            </div>
            <div class="itin-item visible">
                <div class="itin-time">22:00</div>
                <div class="itin-icon">💃</div>
                <div class="itin-body">
                    <div class="itin-name">Primer Baile</div>
                    <div class="itin-desc">Bajo una lluvia de chispas frías y estrellas.</div>
                </div>
            </div>
            <div class="itin-item visible">
                <div class="itin-time">23:00</div>
                <div class="itin-icon">🎉</div>
                <div class="itin-body">
                    <div class="itin-name">After Party</div>
                    <div class="itin-desc">DJ Set & Open Bar hasta el amanecer.</div>
                </div>
            </div>
        </div>
    </section>

    <!-- 8. GALERÍA -->
    <section class="galeria-section">
        <div data-field="galeria_html">
            <div class="gal-dynamic">
                <img src="https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=1400" alt="">
                <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800" alt="">
                <img src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800" alt="">
                <img src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800" alt="">
                <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800" alt="">
                <img src="https://images.unsplash.com/photo-1460978812857-470ed1c77af0?auto=format&fit=crop&q=80&w=800" alt="">
            </div>
        </div>
    </section>

    <!-- 9. MÚSICA -->
    <section data-section="musica" style="display:none;text-align:center;padding:60px 5%;">
        <h3 style="font-family:var(--font-titulos);margin-bottom:1rem;">Nuestra Melodía</h3>
        <p data-field="music_url" style="font-family:var(--font-serif);font-style:italic;margin-bottom:1.5rem;opacity:.7;">Perfect - Ed Sheeran</p>
        <button class="btn-play" onclick="toggleMusic()">▶ Reproducir</button>
        <audio id="audio-player" loop></audio>
    </section>

    <!-- 10. REGALOS -->
    <section data-section="regalos" style="display:none;text-align:center;padding:100px 5%;background:white;">
        <h2 style="font-family:var(--font-titulos);margin-bottom:1rem;">Mesa de Regalos</h2>
        <p data-field="regalo_mensaje" style="margin-bottom:30px;opacity:.7;">Su presencia es nuestro mejor regalo, pero si desean tener un detalle con nosotros...</p>
        <div data-field="regalos_html" style="display:flex;flex-wrap:wrap;justify-content:center;gap:.5rem;"></div>
    </section>

    <!-- 11. FIRMAS -->
    <section data-section="firmas" style="display:none;padding:80px 10%;">
        <h2 style="font-family:var(--font-titulos);text-align:center;margin-bottom:2rem;">Libro de Honor</h2>
        <div style="max-width:550px;margin:0 auto;display:flex;flex-direction:column;gap:1rem;">
            <input type="text" id="firma-nombre" placeholder="Tu nombre" style="padding:1rem 1.5rem;border:1px solid #f0e8d8;border-bottom:2px solid var(--color-primary);font-family:var(--font-cuerpo);font-size:1rem;outline:none;background:white;">
            <textarea id="firma-mensaje" placeholder="Tu mensaje para los novios..." style="padding:1rem 1.5rem;min-height:120px;border:1px solid #f0e8d8;border-bottom:2px solid var(--color-primary);font-family:var(--font-cuerpo);font-size:1rem;resize:none;outline:none;"></textarea>
            <button onclick="enviarFirma()" class="btn-gold" style="padding:1rem;text-align:center;">ENVIAR MENSAJE ✦</button>
        </div>
        <div id="firmas-lista" style="max-width:700px;margin:3rem auto 0;display:flex;flex-direction:column;gap:1rem;"></div>
    </section>

    <!-- 12. RSVP -->
    <section class="rsvp-section">
        <div class="rsvp-card">
            <h2 style="font-family:var(--font-titulos);font-size:3rem;margin-bottom:1rem;">RSVP</h2>
            <p>Por favor, confirma tu asistencia antes del:</p>
            <p data-field="confirmacion_fecha" style="font-weight:bold;font-size:1.2rem;color:var(--color-primary);margin:15px 0;">15 de Septiembre de 2026</p>
            <a href="#" class="btn-gold" data-field="whatsapp_url">Confirmar vía WhatsApp</a>
        </div>
    </section>

    <!-- FOOTER -->
    <footer style="padding:50px;text-align:center;background:var(--color-bg);border-top:1px solid #eee;">
        <p style="font-family:var(--font-serif);font-size:1.5rem;"><span data-field="novia">GIOVANNA</span> & <span data-field="novio">VICTOR</span></p>
        <p style="font-size:.7rem;letter-spacing:2px;opacity:.5;margin-top:10px;" data-field="fecha_hero">OCTUBRE 2026</p>
    </footer>

    <script>
    function updateCountdown(){const el=document.querySelector('[data-field="fecha_hero"]');const txt=el?el.textContent:'';let target=null;try{const p=txt.match(/(\d{1,2})\s*[·\-de ]+\s*(\w+)\s*[·\-de ]+\s*(\d{4})/i);if(p){const mo={enero:0,febrero:1,marzo:2,abril:3,mayo:4,junio:5,julio:6,agosto:7,septiembre:8,octubre:9,noviembre:10,diciembre:11};const m=mo[p[2].toLowerCase()];if(m!==undefined)target=new Date(parseInt(p[3]),m,parseInt(p[1]));}if(!target)target=new Date(txt);}catch(e){}if(!target||isNaN(target))return;const diff=target-new Date();if(diff<0)return;const fmt=n=>String(Math.floor(n)).padStart(2,'0');const dEl=document.getElementById('cd-dias');const hEl=document.getElementById('cd-horas');const mEl=document.getElementById('cd-min');const sEl=document.getElementById('cd-seg');if(dEl)dEl.textContent=fmt(diff/86400000);if(hEl)hEl.textContent=fmt((diff%86400000)/3600000);if(mEl)mEl.textContent=fmt((diff%3600000)/60000);if(sEl)sEl.textContent=fmt((diff%60000)/1000);}
    updateCountdown();setInterval(updateCountdown,1000);

    const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});},{threshold:0.1});
    document.querySelectorAll('.fade-in,[data-animate]').forEach(el=>obs.observe(el));

    window.toggleMusic=function(){const audio=document.getElementById('audio-player');if(!audio)return;const btn=document.querySelector('.btn-play');if(audio.paused){audio.play().catch(()=>{});if(btn)btn.textContent='⏸ Pausar';}else{audio.pause();if(btn)btn.textContent='▶ Reproducir';}};

    window.enviarFirma=function(){const nombre=document.getElementById('firma-nombre')?.value?.trim();const mensaje=document.getElementById('firma-mensaje')?.value?.trim();if(!nombre||!mensaje)return;const lista=document.getElementById('firmas-lista');if(lista){const card=document.createElement('div');card.className='firma-card';card.innerHTML=\`<div class="firma-card-nombre">✦ \${nombre}</div><div class="firma-card-msg">"\${mensaje}"</div>\`;lista.prepend(card);}document.getElementById('firma-nombre').value='';document.getElementById('firma-mensaje').value='';};

    window.addEventListener('message',(e)=>{
    if(e.data?.type!=='UPDATE_DATA')return;
    const d=e.data.data;
    const set=(sel,val)=>{document.querySelectorAll(sel).forEach(el=>{if(el.tagName==='A')el.href=val||'#';else el.innerHTML=val||'';});};
    const novia=d.title?.split('&')[0]?.trim()||d.title||'';
    const novio=d.title?.split('&')[1]?.trim()||'';
    const phone=d.rsvp_config?.phone||d.rsvp_config?.confTelefono||'521234567890';
    const waUrl=\`https://wa.me/\${phone}?text=\${encodeURIComponent('Confirmo asistencia: '+d.title)}\`;
    const fnd=(n,dec)=>n?(dec?'† '+n:n):'';
    const fmtDate=(s)=>{if(!s)return'';try{return new Date(s+'T12:00:00').toLocaleDateString('es-MX',{weekday:'long',day:'numeric',month:'long',year:'numeric'});}catch(e){return s;}};
    set('[data-field="novia"]',novia);
    set('[data-field="novio"]',novio);
    set('[data-field="frase"]',d.message);
    set('[data-field="mensaje_secundario"]',d.message_secondary);
    set('[data-field="fecha_hero"]',fmtDate(d.event_date)||d.event_date);
    set('[data-field="hora_ceremonia"]',d.event_time);
    set('[data-field="lugar_ceremonia"]',d.venue);
    set('[data-field="direccion_ceremonia"]',d.venue_address);
    set('[data-field="hora_recepcion"]',d.segunda_sede_json?.hora||d.event_time);
    set('[data-field="lugar_recepcion"]',d.segunda_sede_json?.lugar||d.venue);
    set('[data-field="direccion_recepcion"]',d.segunda_sede_json?.direccion||d.venue_address);
    set('[data-field="madre_novia"]',fnd(d.parents_bride_mother,d.parents_bride_mother_deceased));
    set('[data-field="padre_novia"]',fnd(d.parents_bride_father,d.parents_bride_father_deceased));
    set('[data-field="madre_novio"]',fnd(d.parents_groom_mother,d.parents_groom_mother_deceased));
    set('[data-field="padre_novio"]',fnd(d.parents_groom_father,d.parents_groom_father_deceased));
    set('[data-field="vestimenta"]',d.dress_code);
    set('[data-field="vestimenta_damas"]',d.dress_code_women);
    set('[data-field="vestimenta_caballeros"]',d.dress_code_men);
    set('[data-field="vestimenta_nota"]',d.dress_code_detail);
    set('[data-field="confirmacion_fecha"]',d.rsvp_config?.confFechaLimite||'Consultar fecha');
    set('[data-field="location_url"]',d.location_url||'#');
    set('[data-field="location_url_recepcion"]',d.segunda_sede_json?.location_url||d.location_url||'#');
    set('[data-field="whatsapp_url"]',waUrl);
    const bp=(list)=>{if(!list||!list.length)return'';return list.map(p=>\`<div class="padrino-item"><span class="padrino-rol">\${p.rol||''}</span><span class="padrino-nombre">\${p.nombre||''}</span></div>\`).join('');};
    document.querySelectorAll('[data-field="padrinos_html"]').forEach(el=>{if(d.padrinos_list?.length)el.innerHTML=bp(d.padrinos_list);});
    document.querySelectorAll('[data-field="portada_url"]').forEach(el=>{if(el.tagName==='IMG'&&d.cover_image_url)el.src=d.cover_image_url;else if(d.cover_image_url)el.style.backgroundImage=\`url(\${d.cover_image_url})\`;});
    const gal=d.gallery_urls||[];
    if(gal.length>0){document.querySelectorAll('[data-field="galeria_html"]').forEach(el=>{el.innerHTML=\`<div class="gal-dynamic">\${gal.map(u=>\`<img src="\${u}" alt="" loading="lazy">\`).join('')}</div>\`;});}
    document.querySelectorAll('[data-field="itin_html"]').forEach(el=>{if(!d.itinerary_items||!d.itinerary_items.length){el.innerHTML='<div class="itin-empty">El itinerario aparecerá aquí</div>';return;}el.innerHTML=d.itinerary_items.map(item=>\`<div class="itin-item visible"><div class="itin-time">\${item.hora||''}</div><div class="itin-icon">\${item.icono||'✦'}</div><div class="itin-body"><div class="itin-name">\${item.titulo||''}</div><div class="itin-desc">\${item.descripcion||''}</div></div></div>\`).join('');});
    const ae=document.querySelector('[data-field="solo_adultos"]');if(ae)ae.style.display=d.adults_only?'block':'none';
    document.querySelectorAll('[data-bilingual]').forEach(el=>{el.style.display=d.is_bilingual?'block':'none';});
    if(d.music_url){const audio=document.getElementById('audio-player');const sec=document.querySelector('[data-section="musica"]');if(audio){audio.src=d.music_url;}if(sec)sec.style.display='block';const notaEl=document.querySelector('[data-field="music_url"]');if(notaEl)notaEl.textContent=d.music_url;}
    const regSec=document.querySelector('[data-section="regalos"]');if(regSec)regSec.style.display=(d.gift_message||(d.regalos_list?.length>0))?'block':'none';
    set('[data-field="regalo_mensaje"]',d.gift_message||'');
    const regEl=document.querySelector('[data-field="regalos_html"]');if(regEl&&d.regalos_list?.length>0){regEl.innerHTML=d.regalos_list.map(r=>\`<a href="\${r.url||'#'}" target="_blank" class="regalo-link">\${r.nombre}</a>\`).join('');}
    const firSec=document.querySelector('[data-section="firmas"]');if(firSec&&d.firmas_enabled)firSec.style.display='block';
    if(d.sections_styles){const s=d.sections_styles;const r=document.documentElement;if(s.color_primary)r.style.setProperty('--color-primary',s.color_primary);if(s.color_secondary)r.style.setProperty('--color-secondary',s.color_secondary);if(s.color_bg)r.style.setProperty('--color-bg',s.color_bg);if(s.font_scale)r.style.setProperty('--font-scale',s.font_scale);if(s.font_titulos||s.font_cuerpo){const fonts=[s.font_titulos,s.font_cuerpo].filter(Boolean).map(f=>f.replace(/ /g,'+')).join('&family=');const ex=document.getElementById('dynamic-fonts');if(ex)ex.remove();const lk=document.createElement('link');lk.id='dynamic-fonts';lk.rel='stylesheet';lk.href=\`https://fonts.googleapis.com/css2?family=\${fonts}:wght@300;400;600;700&display=swap\`;document.head.appendChild(lk);lk.onload=()=>{if(s.font_titulos)r.style.setProperty('--font-titulos',\`'\${s.font_titulos}', serif\`);if(s.font_cuerpo)r.style.setProperty('--font-cuerpo',\`'\${s.font_cuerpo}', sans-serif\`);};}if(s.animaciones){const ex=document.getElementById('anim-override');if(ex)ex.remove();const st=document.createElement('style');st.id='anim-override';if(s.animaciones==='sin_animaciones'){st.innerHTML='*{animation:none!important;transition:none!important}.fade-in{opacity:1!important;transform:none!important}';}else if(s.animaciones==='dinamico'){st.innerHTML='.fade-in.visible{animation:dynamicIn .5s cubic-bezier(.34,1.56,.64,1) forwards}@keyframes dynamicIn{from{opacity:0;transform:translateX(-20px) scale(.97)}to{opacity:1;transform:translateX(0) scale(1)}}';}document.head.appendChild(st);}}
    const re=d.rsvp_config?.enabled??d.rsvp_config?.confHabilitada??true;
    document.querySelectorAll('[data-field="whatsapp_url"]').forEach(el=>{el.style.pointerEvents=re?'auto':'none';el.style.opacity=re?'1':'.4';if(re)el.href=waUrl;});
    updateCountdown();
    });
    </script>
</body>
</html>

`;
