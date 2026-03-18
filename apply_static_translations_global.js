const fs = require('fs');

const file = 'src/templates/boda_clasica.ts';
let content = fs.readFileSync(file, 'utf-8');

// Usaremos una función que reemplace TODO (global)
function globalReplace(target, replacement) {
    // Si target no tiene caracteres especiales, podemos usar replaceAll de Node
    // o un Regex global
    let count = 0;
    while(content.includes(target)) {
        content = content.replace(target, replacement);
        count++;
    }
    if (count > 0) {
        console.log(`Reemplazado "${target}" [${count} veces]`);
    } else {
        console.warn(`No se encontró: "${target}"`);
    }
}

const translations = [
    // Cuenta regresiva
    ['<span class="cd-label">Días</span>', '<span class="cd-label"><span data-es>Días</span><span data-bilingual style="display:none;">Days</span></span>'],
    ['<span class="cd-label">Horas</span>', '<span class="cd-label"><span data-es>Horas</span><span data-bilingual style="display:none;">Hours</span></span>'],
    ['<span class="cd-label">Minutos</span>', '<span class="cd-label"><span data-es>Minutos</span><span data-bilingual style="display:none;">Minutes</span></span>'],
    ['<span class="cd-label">Segundos</span>', '<span class="cd-label"><span data-es>Segundos</span><span data-bilingual style="display:none;">Seconds</span></span>'],
    
    // Familia
    ['Padres de la Novia</h2>', '<span data-es>Padres de la Novia</span><span data-bilingual style="display:none;">Bride\'s Parents</span></h2>'],
    ['Padres del Novio</h2>', '<span data-es>Padres del Novio</span><span data-bilingual style="display:none;">Groom\'s Parents</span></h2>'],
    ['Nuestros Padrinos</h3>', '<span data-es>Nuestros Padrinos</span><span data-bilingual style="display:none;">Our Sponsors</span></h3>'],
    
    // Eventos (Ceremonia / Recepción)
    ['Dónde y Cuándo', '<span data-es>Dónde y Cuándo</span><span data-bilingual style="display:none;">Where & When</span>'],
    ['Ceremonia Religiosa', '<span data-es>Ceremonia Religiosa</span><span data-bilingual style="display:none;">Religious Ceremony</span>'],
    ['Recepción', '<span data-es>Recepción</span><span data-bilingual style="display:none;">Reception</span>'],
    ['Jardín de los Espejos', '<span data-es>Jardín de los Espejos</span><span data-bilingual style="display:none;">Mirror Garden</span>'],
    ['>VER MAPA</a>', '><span data-es>VER MAPA</span><span data-bilingual style="display:none;">VIEW MAP</span></a>'],

    // Vestimenta
    ['Código de Vestimenta', '<span data-es>Código de Vestimenta</span><span data-bilingual style="display:none;">Dress Code</span>'],
    ['Damas</p>', '<span data-es>Damas</span><span data-bilingual style="display:none;">Women</span></p>'],
    ['Caballeros</p>', '<span data-es>Caballeros</span><span data-bilingual style="display:none;">Men</span></p>'],
    ['"Sus mejores galas harán brillar nuestro cuento de hadas."', '<span data-es>"Sus mejores galas harán brillar nuestro cuento de hadas."</span><span data-bilingual style="display:none;">"Your best attire will make our fairy tale shine."</span>'],

    // Itinerario y Música
    ['Nuestra Historia en Horas', '<span data-es>Nuestra Historia en Horas</span><span data-bilingual style="display:none;">Our Story in Hours</span>'],
    ['Nuestra Melodía', '<span data-es>Nuestra Melodía</span><span data-bilingual style="display:none;">Our Melody</span>'],
    ['▶ REPRODUCIR', '<span data-es>▶ REPRODUCIR</span><span data-bilingual style="display:none;">▶ PLAY</span>'],
    
    // Regalos / Firmas
    ['Mesa de Regalos', '<span data-es>Mesa de Regalos</span><span data-bilingual style="display:none;">Gift Registry</span>'],
    ['Libro de Firmas', '<span data-es>Libro de Firmas</span><span data-bilingual style="display:none;">Guest Book</span>'],
    ['ENVIAR MENSAJE ✨', '<span data-es>ENVIAR MENSAJE ✨</span><span data-bilingual style="display:none;">SEND MESSAGE ✨</span>'],
    
    // RSVP
    ['¿Nos acompañas?', '<span data-es>¿Nos acompañas?</span><span data-bilingual style="display:none;">Will you join us?</span>'],
    ['Favor de confirmar antes del:', '<span data-es>Favor de confirmar antes del:</span><span data-bilingual style="display:none;">Please confirm before:</span>'],
    ['CONFIRMAR POR WHATSAPP', '<span data-es>CONFIRMAR POR WHATSAPP</span><span data-bilingual style="display:none;">CONFIRM VIA WHATSAPP</span>'],
    ['(Reemplaza el número de teléfono en el enlace de WhatsApp)', '<span data-es>(Reemplaza el número de teléfono en el enlace de WhatsApp)</span><span data-bilingual style="display:none;">(Replace the phone number in the WhatsApp link)</span>'],
    
    // Footer
    ['PARA SIEMPRE', '<span data-es>PARA SIEMPRE</span><span data-bilingual style="display:none;">FOREVER</span>']
];

translations.forEach(([target, replace]) => {
    globalReplace(target, replace);
});

fs.writeFileSync(file, content, 'utf-8');
console.log('--- GLOBAL REPLACEMENT COMPLETE ---');
