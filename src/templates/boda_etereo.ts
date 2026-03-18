export const BODA_ETEREO = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Giovanna & Victor | Boda Etérea</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link id="dynamic-fonts" href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300&family=Montserrat:wght@200;400&display=swap" rel="stylesheet">
    <style>
        :root {
            --color-primary: #967bb6;
            --color-secondary: #e0e0e0;
            --color-bg: #fdfbff;
            --accent-glow: rgba(150, 123, 182, 0.2);
            --font-titulos: 'Cinzel Decorative', serif;
            --font-cuerpo: 'Cormorant Garamond', serif;
            --font-sans: 'Montserrat', sans-serif;
            --font-scale: 1;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; scroll-behavior: smooth; }
        body {
            background-color: var(--color-bg);
            color: #4a4a4a;
            font-family: var(--font-cuerpo);
            overflow-x: hidden;
            line-height: 1.6;
        }

        #canvas-ambient {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            z-index: -1;
            background: linear-gradient(180deg, #fdfbff 0%, #f3efff 100%);
        }

        .fog-container {
            position: fixed;
            bottom: 0; width: 100%; height: 40vh;
            opacity: 0.3; pointer-events: none; z-index: 0;
            filter: blur(40px);
        }

        /* ANIMACIONES */
        .fade-in { opacity: 0; transform: translateY(30px); transition: all 1s ease-out; }
        .fade-in.visible { opacity: 1; transform: translateY(0); }

        .glass-card {
            background: rgba(255,255,255,0.4);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255,255,255,0.6);
            border-radius: 20px;
            box-shadow: 0 8px 32px var(--accent-glow);
        }

        /* HERO */
        .hero {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
            text-align: center;
        }
        .hero-img-container {
            position: absolute;
            width: 100%; height: 100%;
            top: 0; left: 0;
            z-index: 1;
            filter: grayscale(20%) brightness(85%);
            animation: slowZoom 20s infinite alternate;
        }
        @keyframes slowZoom { from { transform: scale(1); } to { transform: scale(1.1); } }
        .hero-content { z-index: 2; padding: 2rem; }
        .hero-names {
            font-family: var(--font-titulos);
            font-size: clamp(2.5rem, 8vw, 5rem);
            color: var(--color-primary);
            text-shadow: 2px 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 1rem;
        }

        /* COUNTDOWN */
        .countdown-section {
            padding: 5rem 1rem;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
            gap: 1rem;
            max-width: 600px;
            margin: 0 auto;
        }
        .cd-box { text-align: center; padding: 1.5rem 0.5rem; }
        .cd-num { font-size: 2.5rem; font-family: var(--font-sans); font-weight: 200; color: var(--color-primary); }
        .cd-lab { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 2px; }

        /* FAMILIA */
        .family-grid {
            display: grid;
            grid-template-columns: 1.2fr 0.8fr;
            gap: 2rem;
            padding: 4rem 10%;
        }
        .parents-card { padding: 3rem; position: relative; }
        .padrinos-list {
            background: var(--color-primary);
            color: white;
            padding: 3rem;
            transform: translateY(50px);
            border-radius: 20px;
        }

        /* EVENTOS */
        .event-card {
            margin: 4rem auto;
            max-width: 900px;
            display: flex;
            flex-direction: row;
        }
        @media (max-width: 768px) { .event-card { flex-direction: column; } }
        .btn-maps {
            display: inline-block;
            margin-top: 1rem;
            padding: 12px 30px;
            background: transparent;
            border: 1px solid var(--color-primary);
            color: var(--color-primary);
            text-decoration: none;
            transition: 0.4s;
            font-family: var(--font-sans);
            font-size: 0.8rem;
            letter-spacing: 2px;
        }
        .btn-maps:hover { background: var(--color-primary); color: white; }

        /* ITINERARIO */
        .itin-container { padding: 4rem 5%; }
        .itin-item {
            display: flex;
            align-items: center;
            margin-bottom: 3rem;
            position: relative;
        }
        .itin-item:nth-child(even) { flex-direction: row-reverse; text-align: right; }
        .itin-time { font-family: var(--font-sans); font-size: 1.2rem; color: var(--color-primary); width: 100px; flex-shrink: 0; }
        .itin-icon { font-size: 1.4rem; margin: 0 1rem; flex-shrink: 0; }
        .itin-body { flex: 1; padding: 0 2rem; }
        .itin-name { font-family: var(--font-titulos); font-size: 1.5rem; margin-bottom: 5px; }
        .itin-desc { font-size: 1rem; opacity: .7; }
        .itin-empty { text-align: center; padding: 3rem; font-style: italic; opacity: .5; }

        /* GALERÍA */
        .gal-dynamic {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            padding: 10px;
        }
        .gal-dynamic img { width: 100%; aspect-ratio: 1; object-fit: cover; filter: saturate(0.5); transition: 0.6s; }
        .gal-dynamic img:hover { filter: saturate(1); transform: scale(0.98); }

        /* RSVP */
        .rsvp-section { padding: 6rem 1rem; text-align: center; }
        .btn-wa {
            background: #25d366;
            color: white;
            padding: 20px 40px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: bold;
            display: inline-block;
            box-shadow: 0 10px 20px rgba(37,211,102,0.3);
            transition: all .3s;
        }
        .btn-wa:hover { transform: translateY(-3px); box-shadow: 0 16px 30px rgba(37,211,102,.4); }

        /* COMPONENTES DINÁMICOS */
        .padrino-item { margin-bottom: 15px; display: block; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 10px; }
        .padrino-rol { font-size: 0.7rem; text-transform: uppercase; display: block; opacity: 0.8; }
        .padrino-nombre { font-size: 1.2rem; display: block; }

        /* FIRMA CARDS */
        .firma-card { background: white; padding: 1.25rem 1.5rem; border: 1px solid var(--color-secondary); border-radius: 12px; margin-bottom: .75rem; text-align: left; }
        .firma-card-nombre { font-family: var(--font-sans); font-size: .65rem; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; color: var(--color-primary); margin-bottom: .4rem; }
        .firma-card-msg { font-family: var(--font-cuerpo); font-style: italic; font-size: .95rem; opacity: .75; line-height: 1.6; }

        /* MÚSICA / REGALOS */
        .btn-play {
            display: inline-block;
            padding: 12px 30px;
            background: var(--color-primary);
            color: white;
            border: none;
            border-radius: 50px;
            font-family: var(--font-sans);
            font-size: .8rem;
            letter-spacing: 2px;
            cursor: pointer;
            transition: all .3s;
            margin-bottom: 1rem;
        }
        .btn-play:hover { opacity: .85; transform: translateY(-2px); }
        .regalo-link {
            display: inline-block;
            margin: .5rem;
            padding: 10px 24px;
            border: 1px solid var(--color-primary);
            color: var(--color-primary);
            text-decoration: none;
            border-radius: 50px;
            font-family: var(--font-sans);
            font-size: .8rem;
            letter-spacing: 1px;
            transition: all .3s;
        }
        .regalo-link:hover { background: var(--color-primary); color: white; }

        [data-section] { padding: 4rem 10%; margin-top: 2rem; }

        @media (max-width: 768px) {
            /* HERO */
            .hero-content { padding: 25px 15px; }
            .hero-names { font-size: clamp(2rem, 9vw, 4rem); }

            /* COUNTDOWN */
            .countdown-section { padding: 40px 10px; }
            .cd-box { padding: 1rem .25rem; }
            .cd-num { font-size: 2rem; }

            /* FAMILIA */
            .family-grid { grid-template-columns: 1fr; gap: 20px; padding: 40px 5%; }
            .parents-card { padding: 25px 20px; }
            .padrinos-list { transform: translateY(0); padding: 25px 20px; }

            /* EVENTOS */
            .event-card { flex-direction: column; margin: 20px 10px; }
            .event-card > div { padding: 25px 20px; }
            .event-card > div:last-child { border-radius: 0 0 20px 20px; }
            .btn-maps { width: 100%; text-align: center; padding: 12px 20px; }

            /* VESTIMENTA */
            section.fade-in[style*="text-align:center"] { padding: 60px 5%; }

            /* ITINERARIO */
            .itin-container { padding: 40px 5%; }
            .itin-item { flex-direction: column !important; text-align: left !important; gap: 8px; margin-bottom: 25px; }
            .itin-time { width: auto; font-size: 1rem; }
            .itin-body { padding: 10px 0 0 0; border-left: none; border-top: 1px solid var(--color-secondary); }

            /* GALERÍA */
            .gal-dynamic { grid-template-columns: 1fr 1fr; gap: 6px; padding: 6px; }

            /* RSVP */
            .rsvp-section { padding: 60px 5%; }
            .btn-wa { padding: 16px 30px; font-size: .85rem; }

            /* FIRMAS */
            section[data-section="firmas"] { padding: 40px 5%; }
        }

        @media (max-width: 480px) {
            .hero-names { font-size: 1.8rem; }
            .cd-num { font-size: 1.6rem; }
            .gal-dynamic { grid-template-columns: 1fr; }
            .family-grid { padding: 30px 5%; }
        }
    </style>
</head>
<body>

    <canvas id="canvas-ambient"></canvas>
    <div class="fog-container"></div>

    <!-- 1. HERO -->
    <section class="hero">
        <div class="hero-img-container">
            <img data-field="portada_url" src="https://images.pexels.com/photos/2253879/pexels-photo-2253879.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Hero" style="width:100%; height:100%; object-fit:cover;">
        </div>
        <div class="hero-content">
            <p style="letter-spacing:5px; text-transform:uppercase; font-size:.8rem; margin-bottom:1rem;" data-field="frase">NUESTRA AVENTURA COMIENZA AQUÍ</p>
            <h1 class="hero-names">
                <span data-field="novia">GIOVANNA</span><br>
                <span style="font-size:1.5rem; font-family:var(--font-cuerpo);">&</span><br>
                <span data-field="novio">VICTOR</span>
            </h1>
            <p class="fade-in" data-field="fecha_hero" style="font-family:var(--font-sans); font-weight:200; margin-top:1rem;">24 de Octubre de 2026</p>
            <p data-field="mensaje_secundario" style="font-family:var(--font-cuerpo); font-style:italic; margin-top:.75rem; opacity:.7;"></p>
            <p data-bilingual style="display:none; font-family:var(--font-sans); font-size:.75rem; letter-spacing:.1em; color:var(--color-primary); margin-top:.5rem; opacity:.7;">We warmly invite you to our wedding</p>
        </div>
    </section>

    <!-- 2. SOLO ADULTOS -->
    <div data-field="solo_adultos" style="display:none; text-align:center; background:#eee; padding:12px; font-size:.8rem; letter-spacing:2px; font-family:var(--font-sans);">
        EVENTO EXCLUSIVO PARA ADULTOS
    </div>

    <!-- 3. COUNTDOWN -->
    <section class="countdown-section fade-in">
        <div class="cd-box glass-card">
            <div class="cd-num" id="cd-dias">00</div>
            <div class="cd-lab">Días</div>
        </div>
        <div class="cd-box glass-card">
            <div class="cd-num" id="cd-horas">00</div>
            <div class="cd-lab">Hrs</div>
        </div>
        <div class="cd-box glass-card">
            <div class="cd-num" id="cd-min">00</div>
            <div class="cd-lab">Min</div>
        </div>
        <div class="cd-box glass-card">
            <div class="cd-num" id="cd-seg">00</div>
            <div class="cd-lab">Seg</div>
        </div>
    </section>

    <!-- 4. FAMILIA -->
    <section class="family-grid">
        <div class="parents-card glass-card fade-in">
            <h3 style="font-family:var(--font-titulos); margin-bottom:2rem; color:var(--color-primary);">Nuestros Padres</h3>
            <div style="margin-bottom:1.5rem;">
                <p style="font-size:.8rem; opacity:.6;">Padres de la Novia</p>
                <p data-field="madre_novia" style="font-size:1.3rem;">Elena Villarreal</p>
                <p data-field="padre_novia" style="font-size:1.3rem;">Ricardo Munguía</p>
            </div>
            <div>
                <p style="font-size:.8rem; opacity:.6;">Padres del Novio</p>
                <p data-field="madre_novio" style="font-size:1.3rem;">Sofía Casillas</p>
                <p data-field="padre_novio" style="font-size:1.3rem;">Alberto Gallegos</p>
            </div>
        </div>
        <div class="padrinos-list fade-in">
            <h3 style="font-family:var(--font-titulos); margin-bottom:1.5rem;">Corte de Honor</h3>
            <div data-field="padrinos_html">
                <div class="padrino-item">
                    <span class="padrino-rol">Padrinos de Velación</span>
                    <span class="padrino-nombre">Luis Gallegos & Mónica Ruiz</span>
                </div>
                <div class="padrino-item">
                    <span class="padrino-rol">Padrinos de Anillos</span>
                    <span class="padrino-nombre">Fernando Munguía & Lucía Sosa</span>
                </div>
            </div>
        </div>
    </section>

    <!-- 5. EVENTOS -->
    <section style="padding:2rem 1rem;">
        <div class="event-card glass-card fade-in">
            <div style="flex:1; padding:3rem;">
                <h2 style="font-family:var(--font-titulos); margin-bottom:1rem;">Ceremonia</h2>
                <p data-field="hora_ceremonia" style="color:var(--color-primary); font-size:1.2rem;">18:00 HRS</p>
                <p data-field="lugar_ceremonia" style="font-weight:bold; margin-top:1rem;">Parroquia de Santa Teresita</p>
                <p data-field="direccion_ceremonia" style="opacity:.7; margin-top:.25rem;">Av. Reforma 120, Lomas de Chapultepec, CDMX</p>
                <a href="#" data-field="location_url" class="btn-maps">VER MAPA</a>
            </div>
            <div style="flex:1; padding:3rem; background:rgba(150,123,182,0.05); border-radius:0 20px 20px 0;">
                <h2 style="font-family:var(--font-titulos); margin-bottom:1rem;">Recepción</h2>
                <p data-field="hora_recepcion" style="color:var(--color-primary); font-size:1.2rem;">20:30 HRS</p>
                <p data-field="lugar_recepcion" style="font-weight:bold; margin-top:1rem;">Ex-Hacienda Santa Mónica</p>
                <p data-field="direccion_recepcion" style="opacity:.7; margin-top:.25rem;">Calle de la Amargura 45, Tlalnepantla, México</p>
                <a href="#" data-field="location_url_recepcion" class="btn-maps">VER MAPA</a>
            </div>
        </div>
    </section>

    <!-- 6. VESTIMENTA -->
    <section class="fade-in" style="text-align:center; padding:5rem 10%;">
        <div style="font-size:3rem; margin-bottom:1rem;">✧</div>
        <h2 style="font-family:var(--font-titulos); letter-spacing:5px; margin-bottom:1.5rem;">CÓDIGO DE VESTIMENTA</h2>
        <p data-field="vestimenta" style="font-size:1.5rem; color:var(--color-primary);">Gala Etérea (Black Tie)</p>
        <div style="margin-top:2rem; display:flex; justify-content:center; gap:3rem; flex-wrap:wrap;">
            <div>
                <p style="font-weight:bold; margin-bottom:.5rem;">Damas</p>
                <p data-field="vestimenta_damas">Vestido largo (Evitar blanco y lavanda)</p>
            </div>
            <div>
                <p style="font-weight:bold; margin-bottom:.5rem;">Caballeros</p>
                <p data-field="vestimenta_caballeros">Tuxedo o Traje formal oscuro</p>
            </div>
        </div>
        <p data-field="vestimenta_nota" style="margin-top:2rem; font-style:italic; opacity:.7;">"Su presencia es nuestro mejor regalo, su elegancia nuestro mayor honor."</p>
    </section>

    <!-- 7. ITINERARIO -->
    <section class="itin-container">
        <h2 style="text-align:center; font-family:var(--font-titulos); margin-bottom:4rem;">El Itinerario del Sueño</h2>
        <div data-field="itin_html">
            <div class="itin-item fade-in">
                <div class="itin-time">18:00</div>
                <div class="itin-icon">⛪</div>
                <div class="itin-body">
                    <div class="itin-name">Ceremonia Religiosa</div>
                    <div class="itin-desc">El momento en que dos almas se vuelven una.</div>
                </div>
            </div>
            <div class="itin-item fade-in">
                <div class="itin-time">20:30</div>
                <div class="itin-icon">🥂</div>
                <div class="itin-body">
                    <div class="itin-name">Cocktail de Bienvenida</div>
                    <div class="itin-desc">Mixología de autor bajo las estrellas.</div>
                </div>
            </div>
            <div class="itin-item fade-in">
                <div class="itin-time">21:30</div>
                <div class="itin-icon">🍽️</div>
                <div class="itin-body">
                    <div class="itin-name">Banquete de Gala</div>
                    <div class="itin-desc">Cena gourmet de tres tiempos.</div>
                </div>
            </div>
            <div class="itin-item fade-in">
                <div class="itin-time">23:00</div>
                <div class="itin-icon">💃</div>
                <div class="itin-body">
                    <div class="itin-name">Primer Baile</div>
                    <div class="itin-desc">Sobre una nube de humo seco y luces láser.</div>
                </div>
            </div>
            <div class="itin-item fade-in">
                <div class="itin-time">00:00</div>
                <div class="itin-icon">✨</div>
                <div class="itin-body">
                    <div class="itin-name">Celebración Infinita</div>
                    <div class="itin-desc">DJ en vivo y sorpresas visuales.</div>
                </div>
            </div>
        </div>
    </section>

    <!-- 8. GALERÍA -->
    <section class="fade-in">
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
    <section data-section="musica" style="display:none; text-align:center; padding:4rem 10%;">
        <h3 style="font-family:var(--font-titulos); margin-bottom:2rem;">Nuestra Melodía</h3>
        <p data-field="music_url" style="font-style:italic; opacity:.7; margin-bottom:1.5rem;"></p>
        <button class="btn-play" onclick="toggleMusic()">▶ Reproducir Canción</button>
        <audio id="audio-player" loop></audio>
    </section>

    <!-- 10. REGALOS -->
    <section data-section="regalos" style="display:none; text-align:center;" class="glass-card">
        <h2 style="font-family:var(--font-titulos); margin-bottom:1rem;">Mesa de Regalos</h2>
        <p data-field="regalo_mensaje" style="margin-bottom:1.5rem; opacity:.7;"></p>
        <div data-field="regalos_html" style="display:flex; flex-wrap:wrap; justify-content:center; gap:.5rem;"></div>
    </section>

    <!-- 11. FIRMAS -->
    <section data-section="firmas" style="display:none; padding:4rem 10%;">
        <h2 style="font-family:var(--font-titulos); text-align:center; margin-bottom:2rem;">Libro de Deseos</h2>
        <div style="max-width:550px; margin:0 auto; display:flex; flex-direction:column; gap:1rem;">
            <input type="text" id="firma-nombre" placeholder="Tu nombre" style="padding:1rem 1.5rem; border:1px solid var(--color-secondary); font-family:var(--font-cuerpo); font-size:1rem; outline:none; border-radius:10px; background:white;">
            <textarea id="firma-mensaje" placeholder="Tu mensaje para nosotros" style="padding:1rem 1.5rem; min-height:120px; border:1px solid var(--color-secondary); font-family:var(--font-cuerpo); font-size:1rem; resize:none; outline:none; border-radius:10px; background:white;"></textarea>
            <button onclick="enviarFirma()" style="padding:1rem; background:var(--color-primary); color:white; border:none; border-radius:50px; font-family:var(--font-sans); font-size:.8rem; letter-spacing:2px; cursor:pointer; transition:all .3s;">ENVIAR DESEO ✨</button>
        </div>
        <div id="firmas-lista" style="max-width:700px; margin:3rem auto 0; display:flex; flex-direction:column; gap:1rem;"></div>
    </section>

    <!-- 12. RSVP -->
    <section class="rsvp-section fade-in">
        <h2 style="font-family:var(--font-titulos); margin-bottom:1rem;">Confirmación</h2>
        <p>Agradecemos confirmar antes del <span data-field="confirmacion_fecha">15 de Septiembre de 2026</span></p>
        <br><br>
        <a href="#" data-field="whatsapp_url" class="btn-wa">CONFIRMAR VÍA WHATSAPP</a>
    </section>

    <!-- FOOTER -->
    <footer style="padding:4rem; text-align:center; font-family:var(--font-titulos); opacity:.5;">
        <p><span data-field="novia">GIOVANNA</span> & <span data-field="novio">VICTOR</span></p>
        <p style="font-size:.7rem; letter-spacing:3px; margin-top:.5rem;" data-field="fecha_hero">2026</p>
    </footer>

    <!-- CANVAS PARTÍCULAS -->
    <script>
        const canvas = document.getElementById('canvas-ambient');
        const ctx = canvas.getContext('2d');
        let particles = [];
        function initCanvas(){
            canvas.width=window.innerWidth;
            canvas.height=window.innerHeight;
            particles=[];
            for(let i=0;i<100;i++){
                particles.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,size:Math.random()*2,speed:Math.random()*.5,opacity:Math.random()});
            }
        }
        function draw(){
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle="rgba(150,123,182,0.5)";
            particles.forEach(p=>{
                ctx.globalAlpha=p.opacity;
                ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill();
                p.y-=p.speed;if(p.y<0)p.y=canvas.height;
            });
            requestAnimationFrame(draw);
        }
        window.addEventListener('resize',initCanvas);
        initCanvas();draw();
    </script>

    <!-- SCRIPT PRINCIPAL -->
    <script>
    function updateCountdown(){const el=document.querySelector('[data-field="fecha_hero"]');const txt=el?el.textContent:'';let target=null;try{const p=txt.match(/(\d{1,2})\s*[·\-de ]+\s*(\w+)\s*[·\-de ]+\s*(\d{4})/i);if(p){const mo={enero:0,febrero:1,marzo:2,abril:3,mayo:4,junio:5,julio:6,agosto:7,septiembre:8,octubre:9,noviembre:10,diciembre:11};const m=mo[p[2].toLowerCase()];if(m!==undefined)target=new Date(parseInt(p[3]),m,parseInt(p[1]));}if(!target)target=new Date(txt);}catch(e){}if(!target||isNaN(target))return;const diff=target-new Date();if(diff<0)return;const fmt=n=>String(Math.floor(n)).padStart(2,'0');const dEl=document.getElementById('cd-dias');const hEl=document.getElementById('cd-horas');const mEl=document.getElementById('cd-min');const sEl=document.getElementById('cd-seg');if(dEl)dEl.textContent=fmt(diff/86400000);if(hEl)hEl.textContent=fmt((diff%86400000)/3600000);if(mEl)mEl.textContent=fmt((diff%3600000)/60000);if(sEl)sEl.textContent=fmt((diff%60000)/1000);}
    updateCountdown();setInterval(updateCountdown,1000);

    const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});},{threshold:0.1});
    document.querySelectorAll('.fade-in,[data-animate]').forEach(el=>obs.observe(el));

    window.toggleMusic=function(){const audio=document.getElementById('audio-player');if(!audio)return;const btn=document.querySelector('.btn-play');if(audio.paused){audio.play().catch(()=>{});if(btn)btn.textContent='⏸ Pausar';}else{audio.pause();if(btn)btn.textContent='▶ Reproducir Canción';}};

    window.enviarFirma=function(){const nombre=document.getElementById('firma-nombre')?.value?.trim();const mensaje=document.getElementById('firma-mensaje')?.value?.trim();if(!nombre||!mensaje)return;const lista=document.getElementById('firmas-lista');if(lista){const card=document.createElement('div');card.className='firma-card';card.innerHTML=\`<div class="firma-card-nombre">✨ \${nombre}</div><div class="firma-card-msg">"\${mensaje}"</div>\`;lista.prepend(card);}document.getElementById('firma-nombre').value='';document.getElementById('firma-mensaje').value='';};

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
