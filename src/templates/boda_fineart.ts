export const BODA_FINEART = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Giovanna & Victor - Boda Fine Art</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link id="dynamic-fonts" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300&family=Montserrat:wght@200;400&family=Pinyon+Script&display=swap" rel="stylesheet">
    <style>
        :root {
            --color-primary: #8fa18d;
            --color-secondary: #e2c2c6;
            --color-bg: #fdfaf1;
            --glass: rgba(253,250,241,0.65);
            --font-titulos: 'Cormorant Garamond', serif;
            --font-cuerpo: 'Montserrat', sans-serif;
            --font-script: 'Pinyon Script', cursive;
            --font-scale: 1;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; -webkit-font-smoothing: antialiased; }
        body { background-color: var(--color-bg); font-family: var(--font-cuerpo); color: #4a4a4a; overflow-x: hidden; line-height: 1.6; }

        /* BOKEH */
        .bokeh-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; overflow: hidden; }
        .bokeh-light { position: absolute; background: radial-gradient(circle, rgba(143,161,141,0.15) 0%, rgba(143,161,141,0) 70%); border-radius: 50%; filter: blur(40px); animation: float-bokeh 15s infinite ease-in-out; }
        @keyframes float-bokeh { 0%,100% { transform: translate(0,0) scale(1); opacity:.3; } 50% { transform: translate(80px,-40px) scale(1.4); opacity:.6; } }

        /* UTILITIES */
        .fade-in { opacity: 0; transform: translateY(30px); transition: all 1.2s cubic-bezier(0.22,1,0.36,1); }
        .fade-in.visible { opacity: 1; transform: translateY(0); }

        .glass-panel {
            background: var(--glass);
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            border: 1px solid rgba(255,255,255,0.4);
            border-radius: 2px;
            box-shadow: 0 8px 32px rgba(143,161,141,0.1);
        }

        /* CURSOR */
        #custom-cursor { width: 20px; height: 20px; background: var(--color-primary); border-radius: 50%; position: fixed; pointer-events: none; z-index: 9999; mix-blend-mode: multiply; transition: transform .1s ease; display: none; }
        @media (min-width: 1024px) { #custom-cursor { display: block; } }

        /* HERO */
        .hero { height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; padding: 20px; }
        .hero-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-size: cover; background-position: center; filter: brightness(.9); animation: slowZoom 20s infinite alternate; z-index: 1; }
        @keyframes slowZoom { from { transform: scale(1); } to { transform: scale(1.1); } }
        .hero-content { text-align: center; padding: 60px 40px; max-width: 800px; z-index: 2; }
        .hero-script { font-family: var(--font-script); font-size: 3.5rem; color: var(--color-primary); margin-bottom: -15px; }
        .hero-names { font-family: var(--font-titulos); font-size: clamp(3rem,8vw,5rem); text-transform: uppercase; letter-spacing: 8px; font-weight: 300; margin: 20px 0; }
        .hero-date { font-family: var(--font-cuerpo); letter-spacing: 5px; font-size: .9rem; text-transform: uppercase; }

        /* COUNTDOWN */
        .countdown-container { display: grid; grid-template-columns: repeat(4,1fr); gap: 15px; margin-top: 40px; padding: 20px; }
        .cd-item { text-align: center; }
        .cd-num { font-family: var(--font-titulos); font-size: 2.5rem; display: block; color: var(--color-primary); }
        .cd-lab { font-size: .6rem; text-transform: uppercase; letter-spacing: 2px; }

        /* FAMILIA */
        .section-padding { padding: 100px 10%; position: relative; }
        .botanical-decoration { position: absolute; width: 300px; opacity: .4; pointer-events: none; z-index: -1; }
        .family-grid { display: grid; grid-template-columns: 1.2fr .8fr; gap: 60px; align-items: center; }
        .parents-box h3 { font-family: var(--font-titulos); font-size: 2.2rem; margin-bottom: 30px; border-bottom: 1px solid var(--color-secondary); padding-bottom: 10px; }
        .parent-name { display: block; font-size: 1.2rem; margin: 10px 0; font-family: var(--font-titulos); }
        .parents-grid { margin-bottom: 40px; }
        .padrinos-container { margin-top: 50px; display: flex; flex-wrap: wrap; gap: 20px; }
        .padrino-item { background: white; padding: 15px 25px; border-left: 3px solid var(--color-primary); }
        .padrino-rol { display: block; font-size: .7rem; color: var(--color-primary); text-transform: uppercase; font-weight: bold; }
        .padrino-nombre { display: block; font-family: var(--font-titulos); font-size: 1.1rem; margin-top: 3px; }

        /* EVENTOS */
        .events-grid { display: flex; gap: 40px; flex-wrap: wrap; justify-content: center; }
        .event-card { flex: 1; min-width: 300px; padding: 50px; text-align: center; transition: transform .5s ease; }
        .event-card:hover { transform: translateY(-10px); }
        .event-card h4 { font-family: var(--font-titulos); font-size: 2rem; margin-bottom: 20px; }
        .btn-map { display: inline-block; margin-top: 25px; padding: 12px 30px; background: var(--color-primary); color: white; text-decoration: none; font-size: .8rem; letter-spacing: 2px; text-transform: uppercase; transition: .3s; border: none; cursor: pointer; }
        .btn-map:hover { background: var(--color-secondary); box-shadow: 0 5px 15px rgba(0,0,0,.1); }

        /* MÚSICA */
        .btn-play { display: inline-block; padding: 12px 30px; background: var(--color-primary); color: white; font-family: var(--font-cuerpo); font-size: .8rem; letter-spacing: 2px; text-transform: uppercase; border: none; cursor: pointer; transition: .3s; }
        .btn-play:hover { opacity: .85; transform: translateY(-2px); }

        /* REGALO LINKS */
        .regalo-link { display: inline-block; margin: .5rem; padding: 10px 24px; border: 1px solid var(--color-primary); color: var(--color-primary); text-decoration: none; font-size: .8rem; letter-spacing: 1px; transition: .3s; }
        .regalo-link:hover { background: var(--color-primary); color: white; }

        /* ITINERARIO */
        .itinerary-section { background: #f7f3e9; }
        .itin-wrapper { max-width: 900px; margin: 0 auto; }
        .itin-item { display: flex; align-items: flex-start; margin-bottom: 40px; position: relative; gap: 1rem; }
        .itin-time { font-family: var(--font-titulos); font-size: 1.8rem; width: 120px; flex-shrink: 0; color: var(--color-secondary); }
        .itin-icon { font-size: 1.3rem; flex-shrink: 0; padding-top: .3rem; }
        .itin-body { padding-left: 30px; border-left: 1px solid #d1d1d1; flex: 1; }
        .itin-name { font-weight: 600; text-transform: uppercase; font-size: .9rem; margin-bottom: 5px; letter-spacing: 1px; }
        .itin-desc { font-size: .9rem; opacity: .7; }
        .itin-empty { text-align: center; padding: 3rem; font-style: italic; opacity: .5; }

        /* GALERÍA */
        .gal-dynamic { display: grid; grid-template-columns: repeat(6,1fr); grid-template-rows: repeat(2,250px); gap: 15px; }
        .gal-dynamic img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(30%); transition: .8s; }
        .gal-dynamic img:hover { filter: grayscale(0%); transform: scale(1.02); }
        .gal-dynamic img:nth-child(1) { grid-column: span 3; }
        .gal-dynamic img:nth-child(2) { grid-column: span 3; }
        .gal-dynamic img:nth-child(3) { grid-column: span 2; }
        .gal-dynamic img:nth-child(4) { grid-column: span 2; }
        .gal-dynamic img:nth-child(5) { grid-column: span 2; }

        /* FIRMAS */
        .firma-card { background: white; padding: 1.25rem 1.5rem; border: 1px solid rgba(143,161,141,.2); border-left: 3px solid var(--color-primary); margin-bottom: .75rem; }
        .firma-card-nombre { font-family: var(--font-cuerpo); font-size: .65rem; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; color: var(--color-primary); margin-bottom: .4rem; }
        .firma-card-msg { font-family: var(--font-titulos); font-style: italic; font-size: .95rem; opacity: .75; line-height: 1.6; }

        /* RESPONSIVE */
        @media (max-width: 768px) {
            /* HERO */
            .hero-content { padding: 30px 20px; }
            .hero-names { font-size: clamp(1.8rem, 8vw, 3rem); letter-spacing: 4px; }
            .hero-script { font-size: 2.5rem; }
            .hero-date { font-size: .8rem; letter-spacing: 3px; }
            .countdown-container { grid-template-columns: repeat(2, 1fr); gap: 10px; padding: 15px 10px; }

            /* FAMILIA */
            .family-grid { grid-template-columns: 1fr; gap: 20px; }
            .parents-box > div[style*="grid"] { grid-template-columns: 1fr; gap: 20px; }
            .parents-box h3 { font-size: 1.6rem; }
            .parent-name { font-size: 1rem; }

            /* EVENTOS */
            .events-grid { flex-direction: column; gap: 20px; }
            .event-card { min-width: auto; padding: 30px 20px; }
            .event-card h4 { font-size: 1.5rem; }
            .btn-map { width: 100%; text-align: center; padding: 12px 20px; }

            /* VESTIMENTA */
            .glass-panel > div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr; gap: 15px; }

            /* ITINERARIO */
            .itin-wrapper { padding: 0 5px; }
            .itin-item { gap: .5rem; margin-bottom: 25px; }
            .itin-time { font-size: 1.3rem; width: 80px; }
            .itin-body { padding-left: 15px; }
            .itin-name { font-size: .8rem; letter-spacing: .5px; }

            /* GALERÍA */
            .gal-dynamic { grid-template-columns: repeat(2,1fr); grid-template-rows: auto; gap: 8px; }
            .gal-dynamic img { grid-column: span 1 !important; height: 180px; }

            /* SECCIONES */
            .section-padding { padding: 60px 5%; }

            /* FIRMAS */
            section[data-section="firmas"] .glass-panel { padding: 20px 15px; }
        }

        @media (max-width: 480px) {
            .hero-names { font-size: 1.5rem; letter-spacing: 2px; }
            .countdown-container { grid-template-columns: repeat(2, 1fr); max-width: 260px; margin: 20px auto; }
            .cd-num { font-size: 1.8rem; }
            .gal-dynamic { grid-template-columns: 1fr; }
            .gal-dynamic img { height: 220px; }
            .section-padding { padding: 40px 5%; }
            .event-card { padding: 25px 15px; }
        }
    </style>
</head>
<body>

    <div id="custom-cursor"></div>

    <div class="bokeh-container">
        <div class="bokeh-light" style="width:350px;height:350px;top:15%;left:5%;"></div>
        <div class="bokeh-light" style="width:450px;height:450px;top:55%;right:-5%;animation-delay:-6s;"></div>
        <div class="bokeh-light" style="width:280px;height:280px;top:35%;left:45%;animation-delay:-3s;"></div>
    </div>

    <!-- 1. HERO -->
    <section class="hero">
        <img src="https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1200"
             class="hero-bg" data-field="portada_url" alt="Boda Giovanna y Victor">
        <div class="hero-content glass-panel fade-in">
            <p class="hero-script">Nuestra Boda</p>
            <h1 class="hero-names">
                <span data-field="novia">GIOVANNA</span><br>
                <span style="font-size:2rem;font-family:var(--font-script);text-transform:lowercase;">&</span><br>
                <span data-field="novio">VICTOR</span>
            </h1>
            <p class="hero-date" data-field="fecha_hero">Sábado · 17 de Octubre · 2026</p>
            <div style="margin-top:20px;font-style:italic;font-family:var(--font-titulos);font-size:1.2rem;" data-field="frase">
                "En el jardín de la vida, nuestro amor es la flor más bella."
            </div>
            <p data-field="mensaje_secundario" style="margin-top:.75rem;font-size:.8rem;letter-spacing:2px;text-transform:uppercase;opacity:.7;"></p>
            <p data-bilingual style="display:none;font-family:var(--font-titulos);font-style:italic;font-size:.85rem;color:var(--color-primary);margin-top:.5rem;opacity:.75;">We warmly invite you to our wedding</p>
            <div class="countdown-container">
                <div class="cd-item"><span class="cd-num" id="cd-dias">00</span><span class="cd-lab">Días</span></div>
                <div class="cd-item"><span class="cd-num" id="cd-horas">00</span><span class="cd-lab">Hrs</span></div>
                <div class="cd-item"><span class="cd-num" id="cd-min">00</span><span class="cd-lab">Min</span></div>
                <div class="cd-item"><span class="cd-num" id="cd-seg">00</span><span class="cd-lab">Seg</span></div>
            </div>
        </div>
    </section>

    <!-- 2. SOLO ADULTOS -->
    <div data-field="solo_adultos" style="display:none;text-align:center;padding:20px;background:var(--color-secondary);color:white;letter-spacing:3px;font-size:.7rem;">
        EVENTO EXCLUSIVO PARA ADULTOS
    </div>

    <!-- 4. FAMILIA -->
    <section class="section-padding">
        <div class="family-grid">
            <div class="parents-box fade-in">
                <h3 style="color:var(--color-primary)">Con la bendición de nuestros padres</h3>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;">
                    <div>
                        <p style="font-weight:bold;font-size:.8rem;letter-spacing:2px;">PADRES DE LA NOVIA</p>
                        <span class="parent-name" data-field="madre_novia">Sra. Elena Margarita Ramos</span>
                        <span class="parent-name" data-field="padre_novia">Sr. Alejandro Villaseñor</span>
                    </div>
                    <div>
                        <p style="font-weight:bold;font-size:.8rem;letter-spacing:2px;">PADRES DEL NOVIO</p>
                        <span class="parent-name" data-field="madre_novio">Sra. Beatriz Eugenia Solís</span>
                        <span class="parent-name" data-field="padre_novio">Sr. Roberto Carlos Méndez</span>
                    </div>
                </div>
            </div>
            <div class="glass-panel fade-in" style="padding:40px;">
                <h3 style="font-family:var(--font-titulos);font-size:1.8rem;margin-bottom:20px;">Nuestros Padrinos</h3>
                <div data-field="padrinos_html">
                    <div class="padrino-item">
                        <span class="padrino-rol">Padrinos de Velación</span>
                        <span class="padrino-nombre">Luis Alberto Castro & Sofía Reyes</span>
                    </div>
                    <div class="padrino-item" style="margin-top:15px">
                        <span class="padrino-rol">Padrinos de Anillos</span>
                        <span class="padrino-nombre">Ricardo Méndez & Lucía Villaseñor</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- 5. EVENTOS -->
    <section class="section-padding" style="background:white;">
        <h2 style="text-align:center;font-family:var(--font-titulos);font-size:3rem;margin-bottom:60px;font-weight:300;">Dónde & Cuándo</h2>
        <div class="events-grid">
            <div class="event-card glass-panel fade-in">
                <span style="font-size:3rem;">⛪</span>
                <h4>Ceremonia Religiosa</h4>
                <p style="color:var(--color-primary);font-weight:bold;" data-field="hora_ceremonia">17:00 HRS</p>
                <p data-field="lugar_ceremonia" style="font-weight:600;margin-top:10px;">Parroquia de San José el Alto</p>
                <p data-field="direccion_ceremonia" style="font-size:.85rem;opacity:.8;">Av. de los Arcos 120, Querétaro, México.</p>
                <a href="#" class="btn-map" data-field="location_url">Ver Mapa</a>
            </div>
            <div class="event-card glass-panel fade-in">
                <span style="font-size:3rem;">🥂</span>
                <h4>Recepción</h4>
                <p style="color:var(--color-primary);font-weight:bold;" data-field="hora_recepcion">19:30 HRS</p>
                <p data-field="lugar_recepcion" style="font-weight:600;margin-top:10px;">Hacienda de los Laureles</p>
                <p data-field="direccion_recepcion" style="font-size:.85rem;opacity:.8;">Carr. a San Miguel Km 15, Querétaro.</p>
                <a href="#" class="btn-map" data-field="location_url_recepcion">Ver Mapa</a>
            </div>
        </div>
    </section>

    <!-- 6. VESTIMENTA -->
    <section class="section-padding fade-in" style="text-align:center;">
        <div class="glass-panel" style="max-width:700px;margin:0 auto;padding:60px;">
            <h3 style="font-family:var(--font-titulos);font-size:2.2rem;margin-bottom:20px;">Código de Vestimenta</h3>
            <p data-field="vestimenta" style="font-size:1.2rem;letter-spacing:4px;text-transform:uppercase;color:var(--color-primary);">Formal de Etiqueta</p>
            <hr style="width:50px;margin:25px auto;border-color:var(--color-secondary);">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;font-size:.9rem;">
                <div>
                    <strong style="display:block;margin-bottom:5px;">DAMAS</strong>
                    <span data-field="vestimenta_damas">Vestido largo, tonos pastel preferentemente.</span>
                </div>
                <div>
                    <strong style="display:block;margin-bottom:5px;">CABALLEROS</strong>
                    <span data-field="vestimenta_caballeros">Tuxedo o Traje obscuro formal.</span>
                </div>
            </div>
            <p data-field="vestimenta_nota" style="margin-top:30px;font-style:italic;opacity:.7;">* Nos reservamos el color blanco y crema para la novia.</p>
        </div>
    </section>

    <!-- 7. ITINERARIO -->
    <section class="section-padding itinerary-section">
        <h2 style="text-align:center;font-family:var(--font-titulos);font-size:2.5rem;margin-bottom:60px;">Nuestra Historia en Horas</h2>
        <div class="itin-wrapper" data-field="itin_html">
            <div class="itin-item fade-in">
                <div class="itin-time">17:00</div>
                <div class="itin-icon">⛪</div>
                <div class="itin-body"><div class="itin-name">Ceremonia</div><div class="itin-desc">El momento del "Sí, acepto".</div></div>
            </div>
            <div class="itin-item fade-in">
                <div class="itin-time">18:30</div>
                <div class="itin-icon">🥂</div>
                <div class="itin-body"><div class="itin-name">Cóctel de Bienvenida</div><div class="itin-desc">Bebidas de autor y canapés finos en el jardín principal.</div></div>
            </div>
            <div class="itin-item fade-in">
                <div class="itin-time">20:00</div>
                <div class="itin-icon">🍽️</div>
                <div class="itin-body"><div class="itin-name">Banquete de Gala</div><div class="itin-desc">Cena formal de tres tiempos.</div></div>
            </div>
            <div class="itin-item fade-in">
                <div class="itin-time">21:30</div>
                <div class="itin-icon">💃</div>
                <div class="itin-body"><div class="itin-name">Primer Baile</div><div class="itin-desc">Nuestra primera pieza como esposos.</div></div>
            </div>
            <div class="itin-item fade-in">
                <div class="itin-time">22:00</div>
                <div class="itin-icon">🎉</div>
                <div class="itin-body"><div class="itin-name">Party Time</div><div class="itin-desc">DJ Set & Open Bar hasta el amanecer.</div></div>
            </div>
        </div>
    </section>

    <!-- 8. GALERÍA -->
    <section class="section-padding">
        <h2 style="text-align:center;font-family:var(--font-titulos);font-size:2.5rem;margin-bottom:50px;">Love Gallery</h2>
        <div data-field="galeria_html">
            <div class="gal-dynamic">
                <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800" alt="">
                <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800" alt="">
                <img src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800" alt="">
                <img src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800" alt="">
                <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800" alt="">
                <img src="https://images.unsplash.com/photo-1460978812857-470ed1c77af0?auto=format&fit=crop&q=80&w=800" alt="">
            </div>
        </div>
    </section>

    <!-- 9. MÚSICA -->
    <section data-section="musica" style="display:none;text-align:center;padding:60px;background:var(--color-bg);">
        <h3 style="font-family:var(--font-titulos);font-size:2rem;margin-bottom:1rem;">Nuestra Melodía</h3>
        <audio id="audio-player" loop></audio>
        <p style="font-size:.7rem;letter-spacing:2px;margin-bottom:.75rem;">MÚSICA PARA ESTE MOMENTO</p>
        <p data-field="music_url" style="font-family:var(--font-titulos);font-style:italic;margin:10px 0;opacity:.7;"></p>
        <button onclick="toggleMusic()" class="btn-play">▶ Reproducir</button>
    </section>

    <!-- 10. REGALOS -->
    <section data-section="regalos" style="display:none;" class="section-padding">
        <div class="glass-panel" style="max-width:600px;margin:0 auto;padding:40px;text-align:center;">
            <h3 style="font-family:var(--font-titulos);font-size:2rem;margin-bottom:1rem;">Mesa de Regalos</h3>
            <p data-field="regalo_mensaje" style="margin:20px 0;opacity:.7;"></p>
            <div data-field="regalos_html" style="display:flex;flex-wrap:wrap;justify-content:center;gap:.5rem;"></div>
        </div>
    </section>

    <!-- 11. FIRMAS -->
    <section data-section="firmas" style="display:none;" class="section-padding">
        <div style="max-width:600px;margin:0 auto;">
            <h3 style="font-family:var(--font-titulos);font-size:2rem;text-align:center;margin-bottom:1.5rem;">Libro de Deseos</h3>
            <div class="glass-panel" style="padding:30px;display:flex;flex-direction:column;gap:1rem;">
                <input type="text" id="firma-nombre" placeholder="Tu Nombre" style="width:100%;padding:12px 15px;border:1px solid #ddd;font-family:var(--font-cuerpo);font-size:.95rem;outline:none;background:white;">
                <textarea id="firma-mensaje" placeholder="Tu Mensaje" style="width:100%;padding:12px 15px;height:110px;border:1px solid #ddd;font-family:var(--font-cuerpo);font-size:.95rem;resize:none;outline:none;"></textarea>
                <button onclick="enviarFirma()" class="btn-map" style="border:none;cursor:pointer;">Enviar Mensaje ✦</button>
            </div>
            <div id="firmas-lista" style="margin-top:30px;display:flex;flex-direction:column;gap:.75rem;"></div>
        </div>
    </section>

    <!-- 12. RSVP -->
    <section class="section-padding" style="background:var(--color-primary);color:white;text-align:center;">
        <h2 style="font-family:var(--font-titulos);font-size:3rem;margin-bottom:20px;">RSVP</h2>
        <p>Tu presencia es nuestro mejor regalo.</p>
        <p style="margin:20px 0;font-size:.9rem;">Favor de confirmar antes del:<br>
           <strong data-field="confirmacion_fecha">15 de Septiembre, 2026</strong></p>
        <a href="#" class="btn-map" style="background:white;color:var(--color-primary);font-weight:bold;" data-field="whatsapp_url">Confirmar por WhatsApp</a>
    </section>

    <!-- FOOTER -->
    <footer style="padding:60px;text-align:center;opacity:.6;font-size:.8rem;letter-spacing:3px;">
        <span data-field="novia">GIOVANNA</span> & <span data-field="novio">VICTOR</span><br>
        <span data-field="fecha_hero" style="font-size:.7rem;">2026</span>
    </footer>

    <script>
    // Cursor
    const cursor = document.getElementById('custom-cursor');
    document.addEventListener('mousemove', e => {
        if(cursor){ cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; }
    });

    // Countdown
    function updateCountdown(){const el=document.querySelector('[data-field="fecha_hero"]');const txt=el?el.textContent:'';let target=null;try{const p=txt.match(/(\d{1,2})\s*[·\-de ]+\s*(\w+)\s*[·\-de ]+\s*(\d{4})/i);if(p){const mo={enero:0,febrero:1,marzo:2,abril:3,mayo:4,junio:5,julio:6,agosto:7,septiembre:8,octubre:9,noviembre:10,diciembre:11};const m=mo[p[2].toLowerCase()];if(m!==undefined)target=new Date(parseInt(p[3]),m,parseInt(p[1]));}if(!target)target=new Date(txt);}catch(e){}if(!target||isNaN(target))return;const diff=target-new Date();if(diff<0)return;const fmt=n=>String(Math.floor(n)).padStart(2,'0');const dEl=document.getElementById('cd-dias');const hEl=document.getElementById('cd-horas');const mEl=document.getElementById('cd-min');const sEl=document.getElementById('cd-seg');if(dEl)dEl.textContent=fmt(diff/86400000);if(hEl)hEl.textContent=fmt((diff%86400000)/3600000);if(mEl)mEl.textContent=fmt((diff%3600000)/60000);if(sEl)sEl.textContent=fmt((diff%60000)/1000);}
    updateCountdown();setInterval(updateCountdown,1000);

    // Observer
    const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});},{threshold:0.1});
    document.querySelectorAll('.fade-in,[data-animate]').forEach(el=>obs.observe(el));

    // Música
    window.toggleMusic=function(){const audio=document.getElementById('audio-player');if(!audio)return;const btn=document.querySelector('.btn-play');if(audio.paused){audio.play().catch(()=>{});if(btn)btn.textContent='⏸ Pausar';}else{audio.pause();if(btn)btn.textContent='▶ Reproducir';}};

    // Firmas
    window.enviarFirma=function(){const nombre=document.getElementById('firma-nombre')?.value?.trim();const mensaje=document.getElementById('firma-mensaje')?.value?.trim();if(!nombre||!mensaje)return;const lista=document.getElementById('firmas-lista');if(lista){const card=document.createElement('div');card.className='firma-card';card.innerHTML=\`<div class="firma-card-nombre">✦ \${nombre}</div><div class="firma-card-msg">"\${mensaje}"</div>\`;lista.prepend(card);}document.getElementById('firma-nombre').value='';document.getElementById('firma-mensaje').value='';};

    // PostMessage
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
