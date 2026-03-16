/**
 * ✅ TÉCNICA: defer
 *
 * Gracias al atributo "defer" en el <script> del <head>, el navegador
 * garantiza que este código se ejecuta DESPUÉS de que el DOM esté listo.
 *
 * Por eso NO necesitamos ningún envoltorio como DOMContentLoaded:
 * el código puede acceder directamente a los elementos del DOM,
 * igual que si el script estuviera al final del <body>.
 *
 * Ventaja adicional frente a "script al final del body":
 * el navegador descarga el archivo script.js en PARALELO mientras
 * parsea el HTML, por lo que la carga es más eficiente.
 */

/**
 * Dark mode
 * Accedemos directamente al DOM: el defer nos garantiza que ya está listo.
 */
document.getElementById('darkSwitch').addEventListener('change', () => toggleDarkMode());

/**
 * Text size
 */
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
