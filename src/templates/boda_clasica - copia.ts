export const BODA_CLASICA = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Giovanna & Victor - Boda Encantada</title>
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@300;400;600&display=swap" rel="stylesheet">
    
    <style>
        :root {
            --color-primary: #81D4FA;
            --color-secondary: #C0C0C0;
            --color-bg: #F0F8FF;
            --color-text: #2C3E50;
            --font-titulos: 'Cinzel Decorative', serif;
            --font-cuerpo: 'Montserrat', sans-serif;
            --font-scale: 1;
            --font-accent: 'Playfair Display', serif;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: var(--font-cuerpo); 
            background-color: var(--color-bg); 
            color: var(--color-text);
            overflow-x: hidden;
            line-height: 1.6;
        }

        /* ── Canvas de Partículas ── */
        #sparkles-canvas {
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            pointer-events: none;
            z-index: 50;
        }

        /* ── Cursor (solo desktop) ── */
        #magic-cursor {
            width: 20px; height: 20px;
            background: rgba(129, 212, 250, 0.4);
            border: 1px solid white;
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            box-shadow: 0 0 15px white;
            display: none; /* se activa solo en desktop via JS */
        }

        /* ── Animaciones reveal ── */
        .fade-in { opacity: 0; transform: translateY(30px); transition: all 0.8s ease-out; }
        .fade-in.visible { opacity: 1; transform: translateY(0); }

        /* ── HERO ── */
        .hero {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
            text-align: center;
        }

        .hero-img {
            position: absolute;
            width: 110%; height: 110%;
            object-fit: cover;
            z-index: -1;
            filter: brightness(0.85) contrast(1.1);
            animation: zoomSlow 20s infinite alternate;
        }

        @keyframes zoomSlow { from { transform: scale(1); } to { transform: scale(1.1) rotate(1deg); } }

        .hero-content {
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            padding: 60px;
            border: 1px solid rgba(255,255,255,0.5);
            border-radius: 2px;
            box-shadow: 0 0 50px rgba(129,212,250,0.2);
        }

        .hero h1 { 
            font-family: var(--font-titulos); 
            font-size: clamp(2rem, 8vw, 5rem); 
            color: white;
            text-shadow: 0 2px 20px rgba(0,0,0,0.3);
            margin-bottom: 20px;
        }

        /* ── COUNTDOWN ── */
        .countdown {
            padding: 80px 20px;
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
            background: white;
        }

        .cd-box {
            text-align: center;
            min-width: 100px;
            padding: 20px;
            border: 1px solid var(--color-primary);
        }

        .cd-num { font-size: 3rem; font-family: var(--font-titulos); color: var(--color-primary); display: block; }
        .cd-label { font-size: 0.8rem; letter-spacing: 2px; text-transform: uppercase; }

        /* ── FAMILIA ── */
        .family {
            padding: 100px 10%;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            align-items: start;
        }

        .family-card {
            padding: 40px;
            border-left: 4px solid var(--color-primary);
            background: rgba(255,255,255,0.5);
        }

        .padrino-item {
            margin-bottom: 8px;
            font-size: 0.95rem;
        }
        .padrino-rol {
            font-weight: 600;
            color: var(--color-primary);
            margin-right: 6px;
        }

        /* ── ITINERARIO ── */
        .itinerary { padding: 100px 10%; background: #fdfdfd; }
        .itin-item {
            display: flex;
            margin-bottom: 40px;
        }
        .itin-time { 
            font-family: var(--font-titulos); 
            font-size: 1.3rem; 
            color: var(--color-primary); 
            min-width: 150px;
            padding-top: 4px;
        }
        .itin-body { padding-left: 30px; border-left: 1px solid var(--color-secondary); }
        .itin-name { font-weight: 700; font-size: 1.1rem; text-transform: uppercase; margin-bottom: 6px; }
        .itin-desc { font-size: 0.95rem; color: #555; }
        .itin-icon { font-size: 1.4rem; margin-right: 12px; flex-shrink: 0; }
        .itin-empty { text-align: center; padding: 3rem; font-style: italic; opacity: .5; }
        .firma-card { background: white; padding: 1.25rem 1.5rem; border: 1px solid var(--color-primary); margin-bottom: .75rem; text-align: left; }
        .firma-card-nombre { font-family: var(--font-cuerpo); font-weight: 600; font-size: .7rem; letter-spacing: .2em; text-transform: uppercase; color: var(--color-primary); margin-bottom: .4rem; }
        .firma-card-msg { font-family: var(--font-accent); font-style: italic; font-size: .95rem; opacity: .75; line-height: 1.6; }

        /* ── GALERÍA ── */
        .gallery {
            padding: 80px 5%;
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            grid-template-rows: repeat(2, 300px);
            gap: 15px;
        }
        .gal-item { overflow: hidden; }
        .gal-item img { 
            width: 100%; height: 100%; object-fit: cover; 
            transition: transform 0.8s ease, filter 0.8s ease; 
            filter: saturate(0.8);
            display: block;
        }
        .gal-item:hover img { transform: scale(1.08); filter: saturate(1.2); }
        .gal-1 { grid-column: span 3; }
        .gal-2 { grid-column: span 3; }
        .gal-3 { grid-column: span 2; }
        .gal-4 { grid-column: span 2; }
        .gal-5 { grid-column: span 2; }

        /* ── BOTÓN MÁGICO ── */
        .btn-magic {
            display: inline-block;
            padding: 20px 50px;
            background: var(--color-primary);
            color: white;
            text-decoration: none;
            font-family: var(--font-titulos);
            font-size: 0.85rem;
            letter-spacing: 3px;
            transition: all 0.4s ease;
            cursor: pointer;
            border: none;
            box-shadow: 0 10px 20px rgba(129,212,250,0.3);
        }
        .btn-magic:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(129,212,250,0.5);
            background: var(--color-text);
            color: white;
        }
        .btn-small {
            padding: 10px 30px;
            font-size: 0.75rem;
        }

        /* ── RSVP ── */
        .rsvp {
            padding: 100px 10%;
            text-align: center;
            background: linear-gradient(to bottom, #ffffff, var(--color-bg));
        }

        /* ── VESTIMENTA ── */
        .vestimenta-section {
            padding: 100px 10%;
            text-align: center;
            background: var(--color-text);
            color: white;
        }

        /* ── MÚSICA ── */
        .music-section {
            display: none;
            padding: 60px 10%;
            background: white;
            text-align: center;
        }
        .music-section h3 {
            font-family: var(--font-titulos);
            margin-bottom: 16px;
            color: var(--color-text);
        }

        /* ── REGALOS ── */
        .regalos-section {
            display: none;
            padding: 80px 10%;
            text-align: center;
        }
        .regalo-link {
            display: inline-block;
            padding: 14px 30px;
            border: 2px solid var(--color-primary);
            color: var(--color-text);
            text-decoration: none;
            font-family: var(--font-titulos);
            font-size: 0.8rem;
            letter-spacing: 2px;
            transition: all 0.3s ease;
            margin: 8px;
        }
        .regalo-link:hover {
            background: var(--color-primary);
            color: white;
        }

        /* ── SOLO ADULTOS ── */
        .adultos-banner {
            display: none;
            padding: 30px;
            text-align: center;
            background: #f0f0f0;
            font-size: 0.9rem;
            letter-spacing: 3px;
            color: var(--color-text);
        }

        /* ── FOOTER ── */
        footer { padding: 60px; text-align: center; font-family: var(--font-titulos); color: var(--color-secondary); }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
            .family { grid-template-columns: 1fr; }
            .gallery { 
                grid-template-columns: 1fr 1fr; 
                grid-template-rows: auto; 
            }
            .gal-item { grid-column: span 1 !important; height: 220px; }
            .hero-content { padding: 30px 20px; }
            .countdown { gap: 10px; }
            .cd-box { min-width: 70px; padding: 15px 10px; }
            .cd-num { font-size: 2rem; }
            .itin-time { min-width: 110px; font-size: 1rem; }
            .btn-magic { padding: 16px 30px; font-size: 0.75rem; letter-spacing: 2px; }
        }

        @media (max-width: 480px) {
            .gallery { grid-template-columns: 1fr; }
            .gal-item { height: 250px; }
        }
    </style>
</head>
<body>

    <div id="magic-cursor"></div>
    <canvas id="sparkles-canvas"></canvas>

    <!-- ══════════════════════════════════════
         1. HERO
    ═══════════════════════════════════════ -->
    <section class="hero">
        <img 
            data-field="portada_url" 
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1400" 
            class="hero-img" 
            alt="Foto de portada boda Giovanna y Victor"
            loading="eager"
        >
        <div class="hero-content fade-in">
            <p data-field="mensaje_secundario" style="letter-spacing: 5px; color: white; margin-bottom: 20px; font-size: 0.85rem;">
                HABÍA UNA VEZ UN AMOR...
            </p>
            <h1>
                <span data-field="novia">GIOVANNA</span>
                <br>
                <small style="font-family: var(--font-accent); font-style: italic; font-size: 0.35em; text-transform: lowercase; margin: 12px 0; display: block; letter-spacing: 2px;">y</small>
                <span data-field="novio">VICTOR</span>
            </h1>
            <div 
                data-field="fecha_hero" 
                style="font-family: var(--font-titulos); font-size: 1.3rem; color: white; border-top: 1px solid rgba(255,255,255,0.6); border-bottom: 1px solid rgba(255,255,255,0.6); padding: 15px 30px; display: inline-block; margin-top: 24px; letter-spacing: 2px;"
            >
                24 de Octubre de 2026
            </div>
            <p data-field="frase" style="font-family: var(--font-accent); color: white; font-style: italic; margin-top: 28px; font-size: 1.1rem; opacity: 0.95;">
                "Nuestra historia mágica comienza con un sí eterno."
            </p>
            <p data-bilingual style="display:none; color:rgba(255,255,255,.7); font-style:italic; font-size:.85rem; margin-top:8px; letter-spacing:.05em;">We warmly invite you to our wedding</p>
        </div>
    </section>

    <!-- ══════════════════════════════════════
         2. SOLO ADULTOS (oculto por defecto)
    ═══════════════════════════════════════ -->
    <div class="adultos-banner" data-field="solo_adultos" style="display:none;">
        ✦ EVENTO EXCLUSIVO PARA ADULTOS ✦
    </div>

    <!-- ══════════════════════════════════════
         3. COUNTDOWN
    ═══════════════════════════════════════ -->
    <section class="countdown fade-in">
        <div class="cd-box">
            <span class="cd-num" id="cd-dias">--</span>
            <span class="cd-label">Días</span>
        </div>
        <div class="cd-box">
            <span class="cd-num" id="cd-horas">--</span>
            <span class="cd-label">Horas</span>
        </div>
        <div class="cd-box">
            <span class="cd-num" id="cd-min">--</span>
            <span class="cd-label">Minutos</span>
        </div>
        <div class="cd-box">
            <span class="cd-num" id="cd-seg">--</span>
            <span class="cd-label">Segundos</span>
        </div>
    </section>

    <!-- ══════════════════════════════════════
         4. FAMILIA
    ═══════════════════════════════════════ -->
    <section class="family">
        <div class="family-card fade-in">
            <h2 style="font-family: var(--font-titulos); margin-bottom: 20px; color: var(--color-primary); font-size: 1.1rem;">Padres de la Novia</h2>
            <p data-field="madre_novia">Sra. Elena Valenzuela</p>
            <p data-field="padre_novia">Sr. Fernando De la Torre</p>
        </div>
        <div class="family-card fade-in" style="border-left: 0; border-right: 4px solid var(--color-primary); text-align: right;">
            <h2 style="font-family: var(--font-titulos); margin-bottom: 20px; color: var(--color-primary); font-size: 1.1rem;">Padres del Novio</h2>
            <p data-field="madre_novio">Sra. Margarita Robles</p>
            <p data-field="padre_novio">Sr. Victor Manuel Méndez</p>
        </div>
        <div class="fade-in" style="grid-column: 1 / -1; text-align: center; margin-top: 50px;">
            <h3 style="font-family: var(--font-titulos); font-size: 1.8rem; margin-bottom: 24px;">Nuestros Padrinos</h3>
            <div data-field="padrinos_html">
                <div class="padrino-item">
                    <span class="padrino-rol">Velación:</span>
                    <span class="padrino-nombre">Luis Robles y Patricia Sánchez</span>
                </div>
            </div>
        </div>
    </section>

    <!-- ══════════════════════════════════════
         5. EVENTOS (Ceremonia + Recepción)
    ═══════════════════════════════════════ -->
    <section class="itinerary">
        <h2 class="fade-in" style="font-family: var(--font-titulos); text-align: center; font-size: 2.5rem; margin-bottom: 60px;">
            Dónde y Cuándo
        </h2>
        
        <div class="itin-item fade-in">
            <div class="itin-time" data-field="hora_ceremonia">17:00 HRS</div>
            <div class="itin-body">
                <div class="itin-name">Ceremonia Religiosa</div>
                <div data-field="lugar_ceremonia" style="font-weight: 600; margin-bottom: 4px;">Capilla de San Gabriel</div>
                <div data-field="direccion_ceremonia" style="color: #666; margin-bottom: 12px;">Hacienda San Gabriel de las Palmas, Morelos.</div>
                <a 
                    data-field="location_url" 
                    href="https://maps.google.com/?q=Hacienda+San+Gabriel+de+las+Palmas+Morelos" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="btn-magic btn-small"
                >VER MAPA</a>
            </div>
        </div>

        <div class="itin-item fade-in">
            <div class="itin-time" data-field="hora_recepcion">19:00 HRS</div>
            <div class="itin-body">
                <div class="itin-name">Recepción</div>
                <div data-field="lugar_recepcion" style="font-weight: 600; margin-bottom: 4px;">Jardín de los Espejos</div>
                <div data-field="direccion_recepcion" style="color: #666; margin-bottom: 12px;">Hacienda San Gabriel de las Palmas, Morelos.</div>
                <a 
                    data-field="location_url_recepcion" 
                    href="https://maps.google.com/?q=Hacienda+San+Gabriel+de+las+Palmas+Morelos" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="btn-magic btn-small"
                >VER MAPA</a>
            </div>
        </div>
    </section>

    <!-- ══════════════════════════════════════
         6. VESTIMENTA
    ═══════════════════════════════════════ -->
    <section class="vestimenta-section fade-in">
        <h2 style="font-family: var(--font-titulos); margin-bottom: 30px; font-size: 1.5rem;">Código de Vestimenta</h2>
        <div data-field="vestimenta" style="font-size: 2rem; letter-spacing: 5px; color: var(--color-primary);">
            FORMAL DE ETIQUETA
        </div>
        <div style="margin-top: 20px; display: flex; justify-content: center; gap: 40px; flex-wrap: wrap;">
            <div style="text-align: center;">
                <p style="font-size: .7rem; letter-spacing: .2em; text-transform: uppercase; opacity: .5; margin-bottom: .4rem;">Damas</p>
                <p data-field="vestimenta_damas" style="font-family: var(--font-accent); font-style: italic; font-size: 1.1rem;">Vestido Largo</p>
            </div>
            <div style="text-align: center;">
                <p style="font-size: .7rem; letter-spacing: .2em; text-transform: uppercase; opacity: .5; margin-bottom: .4rem;">Caballeros</p>
                <p data-field="vestimenta_caballeros" style="font-family: var(--font-accent); font-style: italic; font-size: 1.1rem;">Traje Formal</p>
            </div>
        </div>
        <p data-field="vestimenta_nota" style="margin-top: 20px; font-style: italic; opacity: 0.85;">
            "Sus mejores galas harán brillar nuestro cuento de hadas."
        </p>
    </section>

    <!-- ══════════════════════════════════════
         7. ITINERARIO DINÁMICO
    ═══════════════════════════════════════ -->
    <section class="itinerary">
        <h2 class="fade-in" style="font-family: var(--font-titulos); text-align: center; font-size: 2rem; margin-bottom: 50px;">
            Nuestra Historia en Horas
        </h2>
        <div data-field="itin_html" id="itin-dinamico">
            <!-- Se rellena por postMessage desde el editor externo -->
        </div>
    </section>

    <!-- ══════════════════════════════════════
         8. GALERÍA
    ═══════════════════════════════════════ -->
    <section class="gallery" data-field="galeria_html">
        <div class="gal-dynamic" style="display:contents">
        <div class="gal-item gal-1">
            <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800" alt="Foto boda 1" loading="lazy">
        </div>
        <div class="gal-item gal-2">
            <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800" alt="Foto boda 2" loading="lazy">
        </div>
        <div class="gal-item gal-3">
            <img src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800" alt="Foto boda 3" loading="lazy">
        </div>
        <div class="gal-item gal-4">
            <img src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800" alt="Foto boda 4" loading="lazy">
        </div>
        <div class="gal-item gal-5">
            <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800" alt="Foto boda 5" loading="lazy">
        </div>
        </div>
    </section>

    <!-- ══════════════════════════════════════
         9. MÚSICA (oculta por defecto)
    ═══════════════════════════════════════ -->
    <section class="music-section" data-section="musica">
        <h3>Nuestra Melodía</h3>
        <p data-field="music_url" style="font-style: italic; color: #666; margin-bottom: 20px;"></p>
        <button class="btn-play btn-magic" onclick="toggleMusic()">▶ REPRODUCIR</button>
        <audio id="audio-player" preload="none"></audio>
    </section>

    <!-- REGALOS -->
    <section class="regalos-section" data-section="regalos">
        <h2 style="font-family: var(--font-titulos); margin-bottom: 16px;">Mesa de Regalos</h2>
        <p data-field="regalo_mensaje" style="margin-bottom: 30px; color: #555;"></p>
        <div data-field="regalos_html" id="regalos-links"></div>
    </section>

    <!-- FIRMAS -->
    <section data-section="firmas" style="display:none; padding: 80px 10%; text-align: center; background: #fdfdfd;">
        <h2 style="font-family: var(--font-titulos); margin-bottom: 30px; font-size: 1.5rem;">Libro de Firmas</h2>
        <div style="max-width: 550px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem;">
            <input type="text" id="firma-nombre" placeholder="Tu nombre" style="padding: 1rem 1.5rem; border: 1px solid var(--color-primary); font-family: var(--font-cuerpo); font-size: .95rem; outline: none; background: white;">
            <textarea id="firma-mensaje" placeholder="Tu mensaje para los novios..." style="padding: 1rem 1.5rem; min-height: 120px; border: 1px solid var(--color-primary); font-family: var(--font-cuerpo); font-size: .95rem; resize: none; outline: none;"></textarea>
            <button onclick="enviarFirma()" class="btn-magic" style="padding: 1rem; letter-spacing: 3px; font-size: .8rem;">ENVIAR MENSAJE ✨</button>
        </div>
        <div id="firmas-lista" style="max-width: 700px; margin: 3rem auto 0; display: flex; flex-direction: column; gap: 1rem;"></div>
    </section>

    <!-- ══════════════════════════════════════
         11. RSVP
    ═══════════════════════════════════════ -->
    <section class="rsvp fade-in">
        <h2 style="font-family: var(--font-titulos); font-size: 2.5rem; margin-bottom: 16px;">¿Nos acompañas?</h2>
        <p style="margin-bottom: 8px; color: #666;">Favor de confirmar antes del:</p>
        <p 
            data-field="confirmacion_fecha" 
            style="font-weight: 700; color: var(--color-primary); font-size: 1.5rem; margin-bottom: 40px;"
        >24 de Septiembre, 2026</p>
        <a 
            id="whatsapp-btn"
            data-field="whatsapp_url" 
            href="https://wa.me/{{phone}}?text=Hola%2C%20confirmo%20mi%20asistencia%20a%20la%20boda%20de%20Giovanna%20%26%20Victor%20el%2024%20de%20octubre%20de%202026." 
            target="_blank"
            rel="noopener noreferrer"
            class="btn-magic"
        >CONFIRMAR POR WHATSAPP</a>
        <p style="margin-top: 16px; font-size: 0.8rem; color: #999;">
            (Reemplaza el número de teléfono en el enlace de WhatsApp)
        </p>
    </section>

    <!-- ══════════════════════════════════════
         FOOTER
    ═══════════════════════════════════════ -->
    <footer>
        <p style="font-size: 1rem;">
            <span data-field="novia">GIOVANNA</span> &amp; <span data-field="novio">VICTOR</span>
        </p>
        <p style="font-size: 0.75rem; margin-top: 10px; color: #bbb; font-family: var(--font-cuerpo); letter-spacing: 2px;">
            24 · 10 · 2026 &nbsp;•&nbsp; PARA SIEMPRE
        </p>
    </footer>


    <script>
    /* ═══════════════════════════════════════════
       PARTÍCULAS DE CRISTAL
    ═══════════════════════════════════════════ */
    const canvas = document.getElementById('sparkles-canvas');
    const ctx = canvas.getContext('2d');
    const particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.6 + 0.1;
            this.life = 0;
            this.maxLife = Math.random() * 200 + 100;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life++;
            if (this.life > this.maxLife || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
                this.life = 0;
            }
        }
        draw() {
            ctx.fillStyle = \`rgba(129, 212, 250, \${this.opacity})\`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 80; i++) particles.push(new Particle());

    function animateSparkles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateSparkles);
    }
    animateSparkles();

    /* ═══════════════════════════════════════════
       CURSOR PERSONALIZADO (solo desktop)
    ═══════════════════════════════════════════ */
    const cursor = document.getElementById('magic-cursor');
    const isTouch = () => window.matchMedia('(hover: none)').matches;

    if (!isTouch()) {
        cursor.style.display = 'block';
        document.addEventListener('mousemove', e => {
            cursor.style.transform = \`translate(\${e.clientX - 10}px, \${e.clientY - 10}px)\`;
        });
    }

    /* ═══════════════════════════════════════════
       COUNTDOWN
    ═══════════════════════════════════════════ */
    const MESES = {
        enero:0, febrero:1, marzo:2, abril:3, mayo:4, junio:5,
        julio:6, agosto:7, septiembre:8, octubre:9, noviembre:10, diciembre:11
    };

    function parseFechaEspanol(txt) {
        if (!txt) return null;
        const clean = txt.trim().toLowerCase();
        // "24 de octubre de 2026" o "24 octubre 2026"
        const m = clean.match(/(\d{1,2})\s+(?:de\s+)?(\w+)\s+(?:de\s+)?(\d{4})/);
        if (m) {
            const mes = MESES[m[2]];
            if (mes !== undefined) return new Date(parseInt(m[3]), mes, parseInt(m[1]), 17, 0, 0);
        }
        // Fallback ISO
        const d = new Date(txt);
        return isNaN(d) ? null : d;
    }

    function updateCountdown() {
        const el = document.querySelector('[data-field="fecha_hero"]');
        const txt = el ? el.textContent : '';
        let target = parseFechaEspanol(txt);

        if (!target || isNaN(target)) {
            target = new Date('2026-10-24T17:00:00');
        }

        const diff = target - new Date();

        if (diff <= 0) {
            ['cd-dias','cd-horas','cd-min','cd-seg'].forEach(id => {
                document.getElementById(id).textContent = '00';
            });
            return;
        }

        const fmt = n => String(Math.floor(n)).padStart(2, '0');
        document.getElementById('cd-dias').textContent  = fmt(diff / 86400000);
        document.getElementById('cd-horas').textContent = fmt((diff % 86400000) / 3600000);
        document.getElementById('cd-min').textContent   = fmt((diff % 3600000) / 60000);
        document.getElementById('cd-seg').textContent   = fmt((diff % 60000) / 1000);
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    /* ═══════════════════════════════════════════
       REVEAL CON INTERSECTION OBSERVER
    ═══════════════════════════════════════════ */
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    /* ═══════════════════════════════════════════
       MÚSICA
    ═══════════════════════════════════════════ */
    window.toggleMusic=function(){
        const audio=document.getElementById('audio-player');
        const btn=document.querySelector('.btn-play');
        if(!audio||!audio.src)return;
        if(audio.paused){audio.play().catch(()=>{});if(btn)btn.textContent='⏸ PAUSAR';}
        else{audio.pause();if(btn)btn.textContent='▶ REPRODUCIR';}
    };

    window.enviarFirma=function(){
        const nombre=document.getElementById('firma-nombre')?.value?.trim();
        const mensaje=document.getElementById('firma-mensaje')?.value?.trim();
        if(!nombre||!mensaje)return;
        const lista=document.getElementById('firmas-lista');
        if(lista){
            const card=document.createElement('div');
            card.className='firma-card';
            card.innerHTML='<div class="firma-card-nombre">✨ '+nombre+'</div><div class="firma-card-msg">"'+mensaje+'"</div>';
            lista.prepend(card);
        }
        document.getElementById('firma-nombre').value='';
        document.getElementById('firma-mensaje').value='';
    };

    window.addEventListener('message',(e)=>{
        if(e.data?.type!=='UPDATE_DATA')return;
        const d=e.data.data;if(!d)return;
        const set=(sel,val)=>{document.querySelectorAll(sel).forEach(el=>{if(el.tagName==='A')el.href=val||'#';else el.innerHTML=val||'';});};
        const novia=d.title?.split('&')[0]?.trim()||'';
        const novio=d.title?.split('&')[1]?.trim()||'';
        const phone=d.rsvp_config?.phone||d.rsvp_config?.confTelefono||'521234567890';
        const waUrl='https://wa.me/'+phone+'?text='+encodeURIComponent('Confirmo asistencia: '+d.title);
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
        const bp=(list)=>{if(!list||!list.length)return'';return list.map(p=>'<div class="padrino-item"><span class="padrino-rol">'+p.rol+'</span><span class="padrino-nombre">'+p.nombre+'</span></div>').join('');};
        document.querySelectorAll('[data-field="padrinos_html"]').forEach(el=>{if(d.padrinos_list?.length)el.innerHTML=bp(d.padrinos_list);});
        document.querySelectorAll('[data-field="portada_url"]').forEach(el=>{if(el.tagName==='IMG'&&d.cover_image_url)el.src=d.cover_image_url;else if(d.cover_image_url)el.style.backgroundImage='url('+d.cover_image_url+')';});
        const gal=d.gallery_urls||[];
        if(gal.length>0){document.querySelectorAll('[data-field="galeria_html"]').forEach(el=>{el.innerHTML='<div class="gal-dynamic" style="display:contents">'+gal.map((u,i)=>'<div class="gal-item gal-'+(i+1)+'"><img src="'+u+'" alt="" loading="lazy"></div>').join('')+'</div>';});}
        document.querySelectorAll('[data-field="itin_html"]').forEach(el=>{
            if(!d.itinerary_items||!d.itinerary_items.length){el.innerHTML='<div class="itin-empty">El itinerario aparecerá aquí</div>';return;}
            el.innerHTML=d.itinerary_items.map(item=>'<div class="itin-item fade-in visible"><div class="itin-time">'+(item.hora||'')+'</div><div class="itin-icon">'+(item.icono||'✦')+'</div><div class="itin-body"><div class="itin-name">'+(item.titulo||'')+'</div><div class="itin-desc">'+(item.descripcion||'')+'</div></div></div>').join('');
        });
        if(d.music_url){
            const sec=document.querySelector('[data-section="musica"]');if(sec)sec.style.display='block';
            const audio=document.getElementById('audio-player');if(audio)audio.src=d.music_url;
            set('[data-field="music_url"]',d.music_url);
        }
        const regSec=document.querySelector('[data-section="regalos"]');
        if(regSec)regSec.style.display=(d.gift_message||(d.regalos_list?.length>0))?'block':'none';
        set('[data-field="regalo_mensaje"]',d.gift_message||'');
        const regEl=document.querySelector('[data-field="regalos_html"]');
        if(regEl&&d.regalos_list?.length>0){regEl.innerHTML=d.regalos_list.map(r=>'<a href="'+(r.url||'#')+'" target="_blank" class="regalo-link">'+(r.nombre||'Ver mesa')+'</a>').join('');}
        const firSec=document.querySelector('[data-section="firmas"]');if(firSec&&d.firmas_enabled)firSec.style.display='block';
        const ae=document.querySelector('[data-field="solo_adultos"]');if(ae)ae.style.display=d.adults_only?'block':'none';
        document.querySelectorAll('[data-bilingual]').forEach(el=>{el.style.display=d.is_bilingual?'block':'none';});
        if(d.sections_styles){
            const s=d.sections_styles;const r=document.documentElement;
            if(s.color_primary)r.style.setProperty('--color-primary',s.color_primary);
            if(s.color_secondary)r.style.setProperty('--color-secondary',s.color_secondary);
            if(s.color_bg)r.style.setProperty('--color-bg',s.color_bg);
            if(s.font_scale)r.style.setProperty('--font-scale',s.font_scale);
            if(s.font_titulos||s.font_cuerpo){
                const fonts=[s.font_titulos,s.font_cuerpo].filter(Boolean).map(f=>f.replace(/ /g,'+')).join('&family=');
                const ex=document.getElementById('dynamic-fonts');if(ex)ex.remove();
                const lk=document.createElement('link');lk.id='dynamic-fonts';lk.rel='stylesheet';
                lk.href='https://fonts.googleapis.com/css2?family='+fonts+':wght@300;400;600;700&display=swap';
                document.head.appendChild(lk);
                lk.onload=()=>{if(s.font_titulos)r.style.setProperty('--font-titulos',"'"+s.font_titulos+"', serif");if(s.font_cuerpo)r.style.setProperty('--font-cuerpo',"'"+s.font_cuerpo+"', sans-serif");};
            }
            if(s.animaciones){
                const ex=document.getElementById('anim-override');if(ex)ex.remove();
                const st=document.createElement('style');st.id='anim-override';
                if(s.animaciones==='sin_animaciones'){st.innerHTML='*{animation:none!important;transition:none!important}.fade-in{opacity:1!important;transform:none!important}';}
                else if(s.animaciones==='dinamico'){st.innerHTML='.fade-in.visible{animation:dynamicIn .5s cubic-bezier(.34,1.56,.64,1) forwards}@keyframes dynamicIn{from{opacity:0;transform:translateX(-20px) scale(.97)}to{opacity:1;transform:translateX(0) scale(1)}}';}
                document.head.appendChild(st);
            }
        }
        const re=d.rsvp_config?.enabled??d.rsvp_config?.confHabilitada??true;
        document.querySelectorAll('[data-field="whatsapp_url"]').forEach(el=>{el.style.pointerEvents=re?'auto':'none';el.style.opacity=re?'1':'.4';if(re)el.href=waUrl;});
        updateCountdown();
    });
    </script>
</body>
</html>

`;
