/**
 * ❌ CÓDIGO INCORRECTO — Para uso didáctico
 *
 * Este script se ejecuta desde el <head> SIN defer y SIN DOMContentLoaded.
 *
 * Cuando el navegador llega al <script> en el <head>, el <body> todavía
 * no ha sido parseado. Por tanto:
 *
 *   document.getElementById('darkSwitch')  →  null
 *   document.getElementById('textSize')    →  null
 *
 * Al intentar llamar a .addEventListener() sobre null, el navegador
 * lanza el siguiente error en la consola:
 *
 *   TypeError: Cannot read properties of null (reading 'addEventListener')
 *
 * Abre las DevTools (F12 → Consola) para verlo en acción.
 * Los controles de la página NO funcionarán.
 */

// ❌ darkSwitch es null aquí → TypeError en tiempo de ejecución
document.getElementById('darkSwitch').addEventListener('change', () => toggleDarkMode());

// ❌ textSize es null aquí → TypeError en tiempo de ejecución
document.getElementById('textSize').addEventListener('change', function() {
    modifyFontSize(this.value);
});


const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
}

const modifyFontSize = (size) => {
    document.body.classList.remove('text-small', 'text-medium', 'text-large');
    document.body.classList.add(size);
}
