const fs = require('fs');

const file = 'src/templates/boda_clasica.ts';
let content = fs.readFileSync(file, 'utf-8');

const translations = [
    ['<span class="cd-label">Días</span>', '<span class="cd-label"><span data-es>Días</span><span data-bilingual style="display:none;">Days</span></span>'],
    ['<span class="cd-label">Horas</span>', '<span class="cd-label"><span data-es>Horas</span><span data-bilingual style="display:none;">Hours</span></span>'],
    ['<span class="cd-label">Minutos</span>', '<span class="cd-label"><span data-es>Minutos</span><span data-bilingual style="display:none;">Minutes</span></span>'],
    ['<span class="cd-label">Segundos</span>', '<span class="cd-label"><span data-es>Segundos</span><span data-bilingual style="display:none;">Seconds</span></span>'],
    ['Padres de la Novia</h2>', '<span data-es>Padres de la Novia</span><span data-bilingual style="display:none;">Bride\'s Parents</span></h2>'],
    ['Padres del Novio</h2>', '<span data-es>Padres del Novio</span><span data-bilingual style="display:none;">Groom\'s Parents</span></h2>'],
    ['Nuestros Padrinos</h3>', '<span data-es>Nuestros Padrinos</span><span data-bilingual style="display:none;">Our Sponsors</span></h3>'],
    ['Dónde y Cuándo', '<span data-es>Dónde y Cuándo</span><span data-bilingual style="display:none;">Where & When</span>'],
    ['Ceremonia Religiosa', '<span data-es>Ceremonia Religiosa</span><span data-bilingual style="display:none;">Religious Ceremony</span>'],
    ['Jardín de los Espejos', '<span data-es>Jardín de los Espejos</span><span data-bilingual style="display:none;">Mirror Garden</span>'],
    ['Código de Vestimenta', '<span data-es>Código de Vestimenta</span><span data-bilingual style="display:none;">Dress Code</span>'],
    ['Damas</p>', '<span data-es>Damas</span><span data-bilingual style="display:none;">Women</span></p>'],
    ['Caballeros</p>', '<span data-es>Caballeros</span><span data-bilingual style="display:none;">Men</span></p>'],
    ['Nuestra Historia en Horas', '<span data-es>Nuestra Historia en Horas</span><span data-bilingual style="display:none;">Our Story in Hours</span>'],
    ['Nuestra Melodía', '<span data-es>Nuestra Melodía</span><span data-bilingual style="display:none;">Our Melody</span>'],
    ['▶ REPRODUCIR', '<span data-es>▶ REPRODUCIR</span><span data-bilingual style="display:none;">▶ PLAY</span>'],
    ['Mesa de Regalos', '<span data-es>Mesa de Regalos</span><span data-bilingual style="display:none;">Gift Table</span>'],
    ['Libro de Firmas', '<span data-es>Libro de Firmas</span><span data-bilingual style="display:none;">Guest Book</span>'],
    ['Tu nombre"', 'Tu nombre" data-field="label_name"'], // To handle dynamically via placeholder later if needed, but let's just do static placeholder translation or set placeholder split support:
    ['Tu mensaje para los novios...', 'Tu mensaje para los novios...'],
    ['¿Nos acompañas?', '<span data-es>¿Nos acompañas?</span><span data-bilingual style="display:none;">Will you join us?</span>'],
    ['Favor de confirmar antes del:', '<span data-es>Favor de confirmar antes del:</span><span data-bilingual style="display:none;">Please confirm before:</span>'],
    ['>CONFIRMAR POR WHATSAPP</a>', '><span data-es>CONFIRMAR POR WHATSAPP</span><span data-bilingual style="display:none;">CONFIRM VIA WHATSAPP</span></a>'],
    ['>VER MAPA</a>', '><span data-es>VER MAPA</span><span data-bilingual style="display:none;">VIEW MAP</span></a>']
];

translations.forEach(([target, replace]) => {
    if (content.includes(target)) {
        content = content.replace(target, replace);
    } else {
        console.warn(`Warning: Target not found: ${target}`);
    }
});

fs.writeFileSync(file, content, 'utf-8');
console.log('Static elements translated successfully!');
