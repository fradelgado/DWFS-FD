/**
 * ✅ TÉCNICA: window.onload
 *
 * El script se carga desde el <head>. Para acceder al DOM de forma segura,
 * asignamos nuestra lógica a window.onload.
 *
 * window.onload se ejecuta cuando la página está COMPLETAMENTE cargada:
 * HTML, CSS externo, imágenes, iframes... absolutamente todo.
 *
 * ¿Cuándo usarlo?
 *   → Cuando tu código depende de que los recursos (imágenes, canvas, etc.)
 *     estén disponibles, no solo el DOM.
 *
 * ¿Cuándo NO usarlo?
 *   → Si solo necesitas el DOM (que es lo habitual), DOMContentLoaded o defer
 *     son mejores: se ejecutan antes y hacen la página más responsive.
 *
 * ⚠️ Atención: window.onload solo admite UNA función. Si asignas otra
 * función después, machacará esta. Si necesitas múltiples listeners,
 * usa addEventListener('load', ...) en su lugar.
 */
window.onload = function() {

    /**
     * Dark mode
     * El DOM y todos los recursos están listos: es seguro acceder a cualquier elemento.
     */
    document.getElementById('darkSwitch').addEventListener('change', () => toggleDarkMode());

    /**
     * Text size
     */
    document.getElementById('textSize').addEventListener('change', function() {
        modifyFontSize(this.value);
    });

};

const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
}

const modifyFontSize = (size) => {
    document.body.classList.remove('text-small', 'text-medium', 'text-large');
    document.body.classList.add(size);
}
