export const BODA_BELLABESTIA = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Giovanna & Victor — Nuestra Boda</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300&family=Montserrat:wght@300;500&display=swap" rel="stylesheet">
    <style>
        :root {
            --color-primary: #630C16; /* Borgoña */
            --color-secondary: #D4AF37; /* Dorado */
            --color-bg: #FFFDF5; /* Marfil */
            --font-titulos: 'Cinzel Decorative', serif;
            --font-cuerpo: 'Cormorant Garamond', serif;
            --font-sans: 'Montserrat', sans-serif;
            --font-scale: 1;
            --transition: 1.2s cubic-bezier(0.22, 1, 0.36, 1);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; -webkit-font-smoothing: antialiased; }
        body { 
            background-color: var(--color-bg); 
            color: var(--color-primary); 
            font-family: var(--font-cuerpo); 
            overflow-x: hidden;
            line-height: 1.6;
        }

        /* --- UI Components --- */
        .fade-in { opacity: 0; transform: translateY(30px); transition: var(--transition); }
        .fade-in.visible { opacity: 1; transform: translateY(0); }
        
        .gold-btn {
            display: inline-block;
            padding: 15px 35px;
            border: 1px solid var(--color-secondary);
            color: var(--color-primary);
            text-decoration: none;
            font-family: var(--font-sans);
            font-size: 12px;
            letter-spacing: 2px;
            text-transform: uppercase;
            position: relative;
            overflow: hidden;
            transition: 0.5s;
            background: transparent;
            cursor: pointer;
        }
        .gold-btn:hover { background: var(--color-secondary); color: white; box-shadow: 0 10px 20px rgba(212, 175, 55, 0.2); }

        /* --- Canvas Pétalos --- */
        #petals-canvas {
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            pointer-events: none;
            z-index: 99;
        }

        /* --- 1. HERO --- */
        .hero {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
            padding: 20px;
        }
        .hero-img-container {
            position: absolute;
            width: 100%; height: 100%;
            left: 0; top: 0;
            z-index: 1;
        }
        .hero-img-container img {
            width: 100%; height: 100%;
            object-fit: cover;
            filter: sepia(20%) contrast(1.1);
            animation: slowZoom 20s infinite alternate;
        }
        @keyframes slowZoom { from { transform: scale(1); } to { transform: scale(1.15); } }

        .hero-content {
            position: relative;
            z-index: 2;
            text-align: center;
            background: rgba(255, 253, 245, 0.8);
            padding: 60px 40px;
            backdrop-filter: blur(5px);
            border: 1px solid var(--color-secondary);
        }
        .hero-names {
            font-family: var(--font-titulos);
            font-size: calc(3rem * var(--font-scale));
            margin-bottom: 10px;
            line-height: 1.2;
        }
        .hero-date {
            font-family: var(--font-sans);
            letter-spacing: 5px;
            text-transform: uppercase;
            font-size: 14px;
        }
        .hero-phrase {
            font-style: italic;
            margin-top: 20px;
            max-width: 300px;
            margin-inline: auto;
        }

        /* --- 3. COUNTDOWN --- */
        .countdown-section {
            padding: 100px 20px;
            text-align: center;
            background: linear-gradient(to bottom, var(--color-bg), #fff);
        }
        .cd-wrapper {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            max-width: 600px;
            margin: 40px auto;
            gap: 20px;
        }
        .cd-item { border-bottom: 1px solid var(--color-secondary); padding-bottom: 10px; }
        .cd-num { font-family: var(--font-titulos); font-size: 40px; display: block; }
        .cd-label { font-family: var(--font-sans); font-size: 10px; text-transform: uppercase; color: var(--color-secondary); }

        /* --- 4. FAMILIA (Asimétrico) --- */
        .familia-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 60px;
            padding: 80px 10%;
        }
        .family-group h3 { font-family: var(--font-titulos); margin-bottom: 30px; border-left: 3px solid var(--color-secondary); padding-left: 15px; }
        .parent-name { display: block; font-size: 24px; margin-bottom: 5px; }
        .padrinos-container { margin-top: 40px; grid-column: span 2; text-align: center; }
        .padrino-item { margin: 10px; display: inline-block; padding: 15px; border: 1px double var(--color-secondary); }
        .padrino-rol { display: block; font-family: var(--font-sans); font-size: 10px; color: var(--color-secondary); }
        .padrino-nombre { display: block; font-family: var(--font-cuerpo); font-size: 1.1rem; color: var(--color-primary); margin-top: 4px; }
        .firma-card { background: white; padding: 1.25rem 1.5rem; border: 1px solid rgba(212,175,55,.35); margin-bottom: .75rem; text-align: left; }
        .firma-card-nombre { font-family: var(--font-sans); font-size: .65rem; font-weight: 600; letter-spacing: .15em; text-transform: uppercase; color: var(--color-secondary); margin-bottom: .4rem; }
        .firma-card-msg { font-family: var(--font-cuerpo); font-style: italic; font-size: .95rem; color: var(--color-primary); opacity: .75; line-height: 1.6; }

        /* --- 5. EVENTOS --- */
        .event-card {
            max-width: 900px;
            margin: 40px auto;
            display: flex;
            background: white;
            box-shadow: 20px 20px 0px var(--color-primary);
            border: 1px solid #eee;
        }
        .event-info { padding: 50px; flex: 1; }
        .event-img { width: 40%; background-size: cover; background-position: center; }

        /* --- 6. VESTIMENTA --- */
        .dress-code-section {
            background: var(--color-primary);
            color: var(--color-bg);
            padding: 100px 20px;
            text-align: center;
            clip-path: polygon(0 10%, 100% 0, 100% 90%, 0 100%);
        }
        .dress-code-section h2 { font-family: var(--font-titulos); color: var(--color-secondary); font-size: 40px; }

        /* --- 7. ITINERARIO --- */
        .itinerary-section { padding: 100px 10%; }
        .itin-item {
            display: flex;
            gap: 30px;
            margin-bottom: 50px;
            align-items: flex-start;
        }
        .itin-time { font-family: var(--font-titulos); font-size: 28px; min-width: 120px; color: var(--color-secondary); }
        .itin-icon { font-size: 24px; }
        .itin-name { font-family: var(--font-sans); font-weight: 600; text-transform: uppercase; letter-spacing: 2px; }

        /* --- 8. GALERÍA --- */
        .gal-dynamic {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 15px;
            padding: 20px;
        }
        .gal-dynamic img { 
            width: 100%; height: 400px; object-fit: cover; 
            filter: grayscale(100%); transition: 0.8s;
        }
        .gal-dynamic img:hover { filter: grayscale(0%); transform: scale(1.02); }

        /* --- RSVP & FOOTER --- */
        .rsvp-section { padding: 100px 20px; text-align: center; border-top: 1px solid var(--color-secondary); }
        footer { padding: 60px; text-align: center; font-family: var(--font-titulos); opacity: 0.6; }

        /* Mobile Adjustments */
        @media (max-width: 768px) {
            .familia-grid { grid-template-columns: 1fr; }
            .event-card { flex-direction: column; }
            .event-img { width: 100%; height: 250px; }
            .hero-names { font-size: 2.5rem; }
        }
    </style>
</head>
<body>

    <canvas id="petals-canvas"></canvas>

    <section class="hero">
        <div class="hero-img-container">
            <div data-field="portada_url" style="background-image: url('https://images.unsplash.com/photo-1460978812857-470ed1c77af0?auto=format&fit=crop&w=1400'); width:100%; height:100%; background-size:cover; background-position:center;"></div>
        </div>
        <div class="hero-content fade-in">
            <p class="hero-date" data-field="fecha_hero">24 de Octubre de 2026</p>
            <h1 class="hero-names">
                <span data-field="novia">GIOVANNA</span> <br> 
                <small style="font-family: var(--font-cuerpo); font-size: 0.5em; vertical-align: middle;">&</small> <br>
                <span data-field="novio">VICTOR</span>
            </h1>
            <p class="hero-phrase" data-field="frase">"Amar no es mirarse el uno al otro; es mirar juntos en la misma dirección."</p>
            <p data-bilingual style="display:none; font-family: var(--font-sans); font-size: 11px; letter-spacing: .1em; color: var(--color-secondary); margin-top: 10px; opacity: .7;">We warmly invite you to our wedding</p>
        </div>
    </section>

    <div data-field="solo_adultos" style="display:none; text-align: center; padding: 20px; background: #fdf2f2; font-family: var(--font-sans); font-size: 12px; letter-spacing: 1px;">
        EVENTO EXCLUSIVO PARA ADULTOS
    </div>

    <section class="countdown-section fade-in">
        <p data-field="mensaje_secundario">Faltan pocos días para nuestro "felices por siempre"</p>
        <div class="cd-wrapper">
            <div class="cd-item"><span id="cd-dias" class="cd-num">00</span><span class="cd-label">Días</span></div>
            <div class="cd-item"><span id="cd-horas" class="cd-num">00</span><span class="cd-label">Horas</span></div>
            <div class="cd-item"><span id="cd-min" class="cd-num">00</span><span class="cd-label">Min</span></div>
            <div class="cd-item"><span id="cd-seg" class="cd-num">00</span><span class="cd-label">Seg</span></div>
        </div>
    </section>

    <section class="familia-grid fade-in">
        <div class="family-group">
            <h3>Padres de la Novia</h3>
            <span class="parent-name" data-field="madre_novia">Sra. Elena Villalobos</span>
            <span class="parent-name" data-field="padre_novia">Sr. Ricardo Mendieta</span>
        </div>
        <div class="family-group">
            <h3>Padres del Novio</h3>
            <span class="parent-name" data-field="madre_novio">Sra. Beatriz Alcázar</span>
            <span class="parent-name" data-field="padre_novio">Sr. Armando Castillo</span>
        </div>
        <div class="padrinos-container">
            <h3>Nuestros Padrinos de Velación</h3>
            <div data-field="padrinos_html">
                <div class="padrino-item">
                    <span class="padrino-rol">Padrinos Principales</span>
                    <span class="padrino-nombre">Sofía Mendieta & Carlos Torres</span>
                </div>
            </div>
        </div>
    </section>

    <section class="eventos-section">
        <div class="event-card fade-in">
            <div class="event-img" style="background-image: url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800')"></div>
            <div class="event-info">
                <h2 style="font-family: var(--font-titulos);">Ceremonia Religiosa</h2>
                <p class="itin-time" data-field="hora_ceremonia">18:00 HRS</p>
                <p><strong data-field="lugar_ceremonia">Ex Convento de San Hipólito</strong></p>
                <p data-field="direccion_ceremonia">Av. Hidalgo 107, Centro Histórico, CDMX.</p>
                <br>
                <a href="#" class="gold-btn" data-field="location_url">Ver Mapa</a>
            </div>
        </div>

        <div class="event-card fade-in" style="box-shadow: -20px 20px 0px var(--color-secondary);">
            <div class="event-info">
                <h2 style="font-family: var(--font-titulos);">Recepción</h2>
                <p class="itin-time" data-field="hora_recepcion">20:30 HRS</p>
                <p><strong data-field="lugar_recepcion">Salón de Cristal, Hacienda de los Morales</strong></p>
                <p data-field="direccion_recepcion">Vázquez de Mella 525, Polanco, CDMX.</p>
                <br>
                <a href="#" class="gold-btn" data-field="location_url_recepcion">Ver Mapa</a>
            </div>
            <div class="event-img" style="background-image: url('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800')"></div>
        </div>
    </section>

    <section class="dress-code-section fade-in">
        <h2 data-field="vestimenta">Etiqueta Rigurosa</h2>
        <div style="max-width: 600px; margin: 30px auto; font-family: var(--font-sans); font-size: 13px; letter-spacing: 2px;">
            <p>DAMAS: <span data-field="vestimenta_damas">Vestido largo de noche (Evitar tonos blancos y marfil)</span></p>
            <p>CABALLEROS: <span data-field="vestimenta_caballeros">Smoking o traje oscuro</span></p>
            <br>
            <p style="font-style: italic; opacity: 0.8;" data-field="vestimenta_nota">Inspirémonos en la elegancia de un baile real.</p>
        </div>
    </section>

    <section class="itinerary-section">
        <h2 style="text-align: center; font-family: var(--font-titulos); margin-bottom: 60px;">Cronología del Gran Día</h2>
        <div data-field="itin_html">
            <div class="itin-item">
                <div class="itin-time">18:00</div>
                <div class="itin-icon">🔔</div>
                <div class="itin-body">
                    <div class="itin-name">La Unión Sagrada</div>
                    <div class="itin-desc">Inicio de la ceremonia religiosa.</div>
                </div>
            </div>
            <div class="itin-item">
                <div class="itin-time">20:00</div>
                <div class="itin-icon">🥂</div>
                <div class="itin-body">
                    <div class="itin-name">Cóctel de Bienvenida</div>
                    <div class="itin-desc">Brindis y canapés en el jardín.</div>
                </div>
            </div>
            <div class="itin-item">
                <div class="itin-time">21:30</div>
                <div class="itin-icon">🍽️</div>
                <div class="itin-body">
                    <div class="itin-name">Banquete Real</div>
                    <div class="itin-desc">Cena formal de cuatro tiempos.</div>
                </div>
            </div>
            <div class="itin-item">
                <div class="itin-time">23:00</div>
                <div class="itin-icon">💃</div>
                <div class="itin-body">
                    <div class="itin-name">Primer Baile</div>
                    <div class="itin-desc">Nuestra primera pieza como esposos.</div>
                </div>
            </div>
            <div class="itin-item">
                <div class="itin-time">00:00</div>
                <div class="itin-icon">✨</div>
                <div class="itin-body">
                    <div class="itin-name">La Gran Fiesta</div>
                    <div class="itin-desc">Música en vivo y celebración eterna.</div>
                </div>
            </div>
        </div>
    </section>

    <section class="galeria-section">
        <h2 style="text-align: center; font-family: var(--font-titulos); margin-bottom: 30px;">Historias Guardadas</h2>
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

    <section data-section="musica" style="display:none; padding: 40px; text-align: center; background: #fdf2f2;">
        <button class="btn-play gold-btn" onclick="toggleMusic()">▶ Reproducir</button>
        <p data-field="music_url" style="font-size: 10px; margin-top: 10px;"></p>
        <audio id="audio-player"></audio>
    </section>

    <section data-section="regalos" style="display:none; padding: 100px 20px; text-align: center;">
        <h2 style="font-family: var(--font-titulos);">Mesa de Regalos</h2>
        <p data-field="regalo_mensaje" style="margin-bottom: 30px;"></p>
        <div data-field="regalos_html"></div>
    </section>

    <section data-section="firmas" style="display:none; padding: 100px 20px; background: white;">
        <h2 style="text-align: center; font-family: var(--font-titulos);">Libro de Deseos</h2>
        <div style="max-width: 500px; margin: 40px auto;">
            <input type="text" id="firma-nombre" placeholder="Tu Nombre" style="width:100%; padding:15px; margin-bottom:10px; border:1px solid var(--color-secondary);">
            <textarea id="firma-mensaje" placeholder="Tu mensaje para nosotros..." style="width:100%; padding:15px; height:100px; border:1px solid var(--color-secondary);"></textarea>
            <button class="gold-btn" style="width:100%;" onclick="enviarFirma()">Enviar Deseo</button>
        </div>
        <div id="firmas-lista" style="max-width: 800px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px;"></div>
    </section>

    <section class="rsvp-section fade-in">
        <h2 style="font-family: var(--font-titulos);">Confirmación</h2>
        <p>Agradecemos confirmar tu asistencia antes del:</p>
        <h3 data-field="confirmacion_fecha">10 de Septiembre de 2026</h3>
        <br>
        <a href="#" class="gold-btn" data-field="whatsapp_url" target="_blank">Confirmar por WhatsApp</a>
    </section>

    <footer>
        <p><span data-field="novia">GIOVANNA</span> & <span data-field="novio">VICTOR</span></p>
        <p style="font-size: 12px; margin-top: 10px; font-family: var(--font-sans);" data-field="fecha_hero">24.10.2026</p>
    </footer>

    <script>
        // --- PETALS ANIMATION ---
        const canvas = document.getElementById('petals-canvas');
        const ctx = canvas.getContext('2d');
        let petals = [];

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        const goldColors = ['#630C16','#8B1A2A','#A52035','#7A0F1E','#C0394E'];

        class Petal {
            constructor(randomY) {
                this.reset();
                if (randomY) this.y = Math.random() * canvas.height;
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = -20;
                this.size = Math.random() * 7 + 3;
                this.speed = Math.random() * .8 + .3;
                this.drift = (Math.random() - .5) * .5;
                this.angle = Math.random() * 360;
                this.spin = (Math.random() - .5) * 1.2;
                this.opacity = Math.random() * .25 + .1;
                this.color = goldColors[Math.floor(Math.random() * goldColors.length)];
            }
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle * Math.PI / 180);
                ctx.globalAlpha = this.opacity;
                ctx.beginPath();
                ctx.ellipse(0, 0, this.size, this.size * .55, 0, 0, 2 * Math.PI);
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.restore();
            }
            update() {
                this.y += this.speed;
                this.x += this.drift + Math.sin(this.y / 60) * .3;
                this.angle += this.spin;
                if (this.y > canvas.height + 20) this.reset();
            }
        }

        for (let i = 0; i < 35; i++) petals.push(new Petal(true));

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            petals.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animate);
        }
        animate();

        // --- SCRIPT OBLIGATORIO ---
        function updateCountdown(){const el=document.querySelector('[data-field="fecha_hero"]');const txt=el?el.textContent:'';let target=null;try{const p=txt.match(/(\d{1,2})\s*[·\-de ]+\s*(\w+)\s*[·\-de ]+\s*(\d{4})/i);if(p){const mo={enero:0,febrero:1,marzo:2,abril:3,mayo:4,junio:5,julio:6,agosto:7,septiembre:8,octubre:9,noviembre:10,diciembre:11};const m=mo[p[2].toLowerCase()];if(m!==undefined)target=new Date(parseInt(p[3]),m,parseInt(p[1]));}if(!target)target=new Date(txt);}catch(e){}if(!target||isNaN(target))return;const diff=target-new Date();if(diff<0)return;const fmt=n=>String(Math.floor(n)).padStart(2,'0');const dEl=document.getElementById('cd-dias');const hEl=document.getElementById('cd-horas');const mEl=document.getElementById('cd-min');const sEl=document.getElementById('cd-seg');if(dEl)dEl.textContent=fmt(diff/86400000);if(hEl)hEl.textContent=fmt((diff%86400000)/3600000);if(mEl)mEl.textContent=fmt((diff%3600000)/60000);if(sEl)sEl.textContent=fmt((diff%60000)/1000);}
        updateCountdown();setInterval(updateCountdown,1000);

        const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});},{threshold:0.1});
        document.querySelectorAll('.fade-in,[data-animate]').forEach(el=>obs.observe(el));

        window.toggleMusic=function(){const audio=document.getElementById('audio-player');if(!audio)return;const btn=document.querySelector('.btn-play');if(audio.paused){audio.play();if(btn)btn.textContent='⏸ Pausar';}else{audio.pause();if(btn)btn.textContent='▶ Reproducir';}};

        window.enviarFirma=function(){const nombre=document.getElementById('firma-nombre')?.value?.trim();const mensaje=document.getElementById('firma-mensaje')?.value?.trim();if(!nombre||!mensaje)return;const lista=document.getElementById('firmas-lista');if(lista){const card=document.createElement('div');card.className='firma-card';card.innerHTML=\`<div class="firma-card-nombre" style="font-weight:bold">\${nombre}</div><div class="firma-card-msg">"\${mensaje}"</div>\`;lista.prepend(card);}document.getElementById('firma-nombre').value='';document.getElementById('firma-mensaje').value='';};

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
        if(d.music_url){const audio=document.getElementById('audio-player');const sec=document.querySelector('[data-section="musica"]');if(audio){audio.src=d.music_url;audio.style.display='block';}if(sec)sec.style.display='block';const notaEl=document.querySelector('[data-field="music_url"]');if(notaEl)notaEl.textContent=d.music_url;}
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
