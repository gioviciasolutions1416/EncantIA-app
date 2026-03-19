const fs = require('fs');

const adaptiveScript = `        const re=d.rsvp_config?.enabled??d.rsvp_config?.confHabilitada??true;
        document.querySelectorAll('[data-field="whatsapp_url"]').forEach(el=>{el.style.pointerEvents=re?'auto':'none';el.style.opacity=re?'1':'.4';if(re)el.href=waUrl;});

        // ── DISEÑO ADAPTATIVO ──────────────────────────────────────────────
        const secShow = (sel, condition) => {
            const el = document.querySelector(sel);
            if (el) el.style.display = condition ? '' : 'none';
        };
        const fieldShow = (field, condition) => {
            document.querySelectorAll('[data-field="' + field + '"]').forEach(el => {
                const wrapper = el.closest('[data-section-field]') || el.parentElement;
                if (wrapper) wrapper.style.display = condition ? '' : 'none';
                else el.style.display = condition ? '' : 'none';
            });
        };

        secShow('[data-section="segunda_sede"]', d.segunda_sede_json?.lugar);
        secShow('[data-section="padrinos"]', d.padrinos_list?.length > 0);
        secShow('[data-section="galeria"]', d.gallery_urls?.length > 0);
        secShow('[data-section="itinerario"]', d.itinerary_items?.length > 0);
        secShow('[data-section="hospedaje"]', d.hotels?.length > 0);

        fieldShow('mensaje_secundario', d.message_secondary?.trim());
        fieldShow('vestimenta_damas', d.dress_code_women?.trim());
        fieldShow('vestimenta_caballeros', d.dress_code_men?.trim());
        fieldShow('vestimenta_nota', d.dress_code_detail?.trim());

        updateCountdown();`;

const commonScriptTarget = `const re=d.rsvp_config?.enabled??d.rsvp_config?.confHabilitada??true;\n        document.querySelectorAll('[data-field="whatsapp_url"]').forEach(el=>{el.style.pointerEvents=re?'auto':'none';el.style.opacity=re?'1':'.4';if(re)el.href=waUrl;});\n        updateCountdown();`;

function update(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf-8');
    for (const [target, replacement] of replacements) {
        if (!content.includes(target)) {
            console.error(`ERROR: Target not found in ${filePath}\n=== Target ===\n${target}\n===`);
            process.exit(1);
        }
        content = content.replace(target, replacement);
    }
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${filePath}`);
}

try {
    // 1. boda_bellabestia.ts
    update('src/templates/boda_bellabestia.ts', [
        [commonScriptTarget, adaptiveScript],
        ['<div class="padrinos-container">', '<div data-section="padrinos" class="padrinos-container">'],
        ['<div class="event-card fade-in" style="box-shadow: -20px 20px 0px var(--color-secondary);">', '<div data-section="segunda_sede" class="event-card fade-in" style="box-shadow: -20px 20px 0px var(--color-secondary);">'],
        ['<section class="itinerary-section">', '<section class="itinerary-section" data-section="itinerario">'],
        ['<section class="galeria-section">', '<section class="galeria-section" data-section="galeria">']
    ]);

    // 2. boda_editorial.ts
    update('src/templates/boda_editorial.ts', [
        [commonScriptTarget, adaptiveScript],
        ['<div class="familia-block fade-in">\n<h3>Corte de Honor</h3>', '<div data-section="padrinos" class="familia-block fade-in">\n<h3>Corte de Honor</h3>'],
        ['<div class="evento-card fade-in">\n<h2 class="evento-title">Recepción</h2>', '<div data-section="segunda_sede" class="evento-card fade-in">\n<h2 class="evento-title">Recepción</h2>'],
        ['<section class="itinerario-section">', '<section class="itinerario-section" data-section="itinerario">'],
        ['<section class="galeria-section">', '<section class="galeria-section" data-section="galeria">']
    ]);

    // 3. boda_etereo.ts
    update('src/templates/boda_etereo.ts', [
        [commonScriptTarget, adaptiveScript],
        ['<div class="padrinos-list fade-in">', '<div data-section="padrinos" class="padrinos-list fade-in">'],
        ['<div style="flex:1; padding:3rem; background:rgba(150,123,182,0.05); border-radius:0 20px 20px 0;">\n<h2 style="font-family:var(--font-titulos); margin-bottom:1rem;">Recepción</h2>', '<div data-section="segunda_sede" style="flex:1; padding:3rem; background:rgba(150,123,182,0.05); border-radius:0 20px 20px 0;">\n<h2 style="font-family:var(--font-titulos); margin-bottom:1rem;">Recepción</h2>'],
        ['<section class="itin-container">', '<section class="itin-container" data-section="itinerario">'],
        ['<!-- 8. GALERÍA -->\n<section class="fade-in">', '<!-- 8. GALERÍA -->\n<section class="fade-in" data-section="galeria">']
    ]);

    // 4. boda_fineart.ts
    update('src/templates/boda_fineart.ts', [
        [commonScriptTarget, adaptiveScript],
        ['<div class="glass-panel fade-in" style="padding:40px;">\n<h3 style="font-family:var(--font-titulos);font-size:1.8rem;margin-bottom:20px;">Nuestros Padrinos</h3>', '<div data-section="padrinos" class="glass-panel fade-in" style="padding:40px;">\n<h3 style="font-family:var(--font-titulos);font-size:1.8rem;margin-bottom:20px;">Nuestros Padrinos</h3>'],
        ['<div class="event-card glass-panel fade-in">\n<span style="font-size:3rem;">🥂</span>', '<div data-section="segunda_sede" class="event-card glass-panel fade-in">\n<span style="font-size:3rem;">🥂</span>'],
        ['<section class="section-padding itinerary-section">', '<section class="section-padding itinerary-section" data-section="itinerario">'],
        ['<!-- 8. GALERÍA -->\n<section class="section-padding">', '<!-- 8. GALERÍA -->\n<section class="section-padding" data-section="galeria">']
    ]);

    console.log('All templates updated successfully!');
} catch (e) {
    console.error(`Script Error: ${e.message}`);
    process.exit(1);
}
