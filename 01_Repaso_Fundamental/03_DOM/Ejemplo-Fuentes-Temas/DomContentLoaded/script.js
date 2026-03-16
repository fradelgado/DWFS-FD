/**
 * ✅ TÉCNICA: DOMContentLoaded
 *
 * El script se carga desde el <head>, ANTES de que el navegador haya
 * construido el DOM. Si accediéramos a getElementById aquí directamente,
 * obtendríamos null porque los elementos todavía no existen.
 *
 * La solución es envolver todo el código dentro del evento DOMContentLoaded,
 * que se dispara cuando el HTML ha sido completamente parseado y el DOM
 * está listo, aunque las imágenes y CSS externos aún no hayan cargado.
 *
 * Equivale en comportamiento a colocar el <script> al final del <body>,
 * pero manteniendo el script en el <head>.
 */
document.addEventListener('DOMContentLoaded', () => {

    /**
     * Dark mode
     * Ahora sí es seguro buscar el elemento, porque el DOM ya está construido.
     */
    document.getElementById('darkSwitch').addEventListener('change', () => toggleDarkMode());

    /**
     * Text size
     */
    document.getElementById('textSize').addEventListener('change', function() {
        modifyFontSize(this.value);
    });

});

const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
}

const modifyFontSize = (size) => {
    document.body.classList.remove('text-small', 'text-medium', 'text-large');
    document.body.classList.add(size);
}
