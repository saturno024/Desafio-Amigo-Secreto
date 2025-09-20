// autor: carlos fabian mesa muñoz 
// aplicacion amigo secreto - sorteo aleatorio de intercambio de regalos

// array global para almacenar la lista de nombres ingresados por el usuario
let listaDeAmigos = [];

/**
 * sistema de notificaciones dinamicas con tipos y autoeliminacion
 * @param {string} mensaje - texto a mostrar en la notificacion
 * @param {string} tipo - tipo de notificacion ('success', 'error', 'warning')
 */
function mostrarNotificacion(mensaje, tipo = 'success') {
    // eliminar cualquier notificacion existente para evitar acumulacion
    const notificacionExistente = document.querySelector('.notification');
    if (notificacionExistente) {
        notificacionExistente.remove();
    }
    
    // crear elemento div para la nueva notificacion
    const notificacion = document.createElement('div');
    // asignar clases css - base 'notification' y tipo especifico
    notificacion.className = `notification ${tipo}`;
    // establecer el texto del mensaje
    notificacion.textContent = mensaje;
    
    /**
     * funcion interna para eliminar notificacion con animacion
     * implementa patron de closure para acceso a variable notificacion
     */
    const limpiarNotificacion = () => {
        // verificar que el elemento aun existe en el dom antes de manipular
        if (notificacion.parentNode) {
            // agregar clase css para animacion de salida
            notificacion.classList.add('hide');
            // timeout para permitir que la animacion css se complete antes de remover
            setTimeout(() => {
                // verificacion adicional por seguridad antes de remover del dom
                if (notificacion.parentNode) {
                    notificacion.remove();
                }
            }, 300); // duracion coincide con animacion css
        }
    };
    
    // agregar la notificacion al final del body
    document.body.appendChild(notificacion);
    
    // timer automatico para eliminar notificacion despues de 4 segundos
    const autoLimpiarTimer = setTimeout(limpiarNotificacion, 4000);
    
    // event listener para permitir cierre manual con click
    notificacion.addEventListener('click', () => {
        clearTimeout(autoLimpiarTimer); // cancelar timer automatico
        limpiarNotificacion(); // ejecutar limpieza inmediata
    }, { once: true }); // optimizacion: event listener se elimina automaticamente despues del primer uso
}

/**
 * inicializacion de event listeners cuando el dom esta completamente cargado
 * implementa funcionalidad de tecla enter para agregar nombres
 */
document.addEventListener('DOMContentLoaded', function() {
    // obtener referencia al input principal
    const inputAmigo = document.getElementById('amigo');
    
    // verificacion defensiva de existencia del elemento
    if (inputAmigo) {
        // event listener para detectar presion de teclas en el input
        inputAmigo.addEventListener('keypress', function(e) {
            // verificar si la tecla presionada es enter
            if (e.key === 'Enter') {
                e.preventDefault(); // evitar comportamiento default del form
                // efecto visual de feedback al presionar enter
                inputAmigo.style.transform = 'scale(0.98)'; // ligera reduccion de escala
                setTimeout(() => {
                    inputAmigo.style.transform = 'scale(1)'; // retorno a escala normal
                }, 100); // duracion rapida para feedback inmediato
                agregarAmigo(); // ejecutar funcion principal de agregar
            }
        });
    }
    
    // inicializar contador y estado vacio al cargar la pagina
    actualizarContador();
});

/**
 * funcion para actualizar contador visual de amigos con animacion
 * controla la visibilidad del estado vacio y animaciones del contador
 */
function actualizarContador() {
    // obtener referencias a elementos del dom
    const numeroElement = document.getElementById('numeroAmigos');
    const estadoVacio = document.getElementById('estadoVacio');
    
    // verificacion defensiva de existencia del elemento contador
    if (numeroElement) {
        // agregar clase css para animacion bounce del numero
        numeroElement.classList.add('bounce');
        // remover clase despues de la duracion de la animacion
        setTimeout(() => {
            numeroElement.classList.remove('bounce');
        }, 400); // duracion coincide con animacion css
        
        // actualizar el contenido numerico del contador
        numeroElement.textContent = listaDeAmigos.length;
    }
    
    // control de visibilidad del mensaje de estado vacio
    if (estadoVacio) {
        // mostrar mensaje cuando no hay nombres en la lista
        if (listaDeAmigos.length === 0) {
            estadoVacio.classList.remove('hidden'); // mostrar elemento
        } else {
            estadoVacio.classList.add('hidden'); // ocultar elemento
        }
    }
}

/**
 * funcion de validacion robusta para nombres de usuario
 * implementa multiples checks de seguridad y formato
 * @param {string} nombre - string a validar
 * @returns {Object} objeto con propiedades valido (boolean) y mensaje (string)
 */
function validarNombre(nombre) {
    // limpiar espacios en blanco al inicio y final
    nombre = nombre.trim();
    
    // validacion de campo vacio
    if (!nombre || nombre === '') {
        return { valido: false, mensaje: 'El nombre no puede estar vacío' };
    }
    
    // validacion de longitud minima para evitar entradas muy cortas
    if (nombre.length < 2) {
        return { valido: false, mensaje: 'El nombre debe tener al menos 2 caracteres' };
    }
    
    // validacion de longitud maxima para prevenir overflow de ui
    if (nombre.length > 30) {
        return { valido: false, mensaje: 'El nombre no puede tener más de 30 caracteres' };
    }
    
    // expresion regular para validar caracteres permitidos
    // incluye: letras basicas, acentos latinos, diéresis, virgulilla, espacios
    const regex = /^[a-záéíóúñüçàèìòùâêîôûäëïöüÿāēīōū\s]+$/i;
    if (!regex.test(nombre)) {
        return { valido: false, mensaje: 'El nombre solo puede contener letras y espacios' };
    }
    
    // validacion adicional para evitar strings que solo contengan espacios
    if (nombre.replace(/\s/g, '') === '') {
        return { valido: false, mensaje: 'El nombre no puede contener solo espacios' };
    }
    
    // validacion de espacios multiples consecutivos
    if (/\s{2,}/.test(nombre)) {
        return { valido: false, mensaje: 'No se permiten espacios múltiples consecutivos' };
    }
    
    // validacion inteligente para detectar nombres pegados sin espacios
    // heuristica: nombres muy largos sin espacios probablemente son nombre+apellido pegados
    if (!nombre.includes(' ') && nombre.length > 12) {
        return { valido: false, mensaje: 'Si es nombre y apellido, sepárelos con espacio (ej: "Fabian Mesa")' };
    }
    
    // si pasa todas las validaciones, el nombre es valido
    return { valido: true, mensaje: '' };
}

/**
 * funcion para normalizar nombres y realizar comparaciones consistentes
 * convierte a lowercase, elimina acentos y normaliza espacios
 * @param {string} nombre - nombre a normalizar
 * @returns {string} nombre normalizado para comparacion
 */
function normalizarNombre(nombre) {
    return nombre
        .trim() // eliminar espacios en extremos
        .toLowerCase() // convertir a minusculas
        .normalize("NFD") // descomponer caracteres acentuados
        .replace(/[\u0300-\u036f]/g, "") // eliminar marcas diacriticas (acentos)
        .replace(/\s+/g, ' '); // reemplazar multiples espacios por uno solo
}

/**
 * funcion para limpiar el campo de input y mantener focus para mejor ux
 * implementa validacion defensiva para evitar errores si el elemento no existe
 */
function limpiarCampos(){
    const inputElement = document.getElementById("amigo");
    
    // validacion defensiva para verificar existencia del elemento
    if (inputElement) {
        inputElement.value = ""; // limpiar contenido del input
        inputElement.focus(); // mantener focus para continuar escribiendo
    } else {
        // log de error para debugging en desarrollo
        console.error('Error: No se encontró el elemento input#amigo para limpiar');
    }
}

/**
 * funcion principal para agregar nuevos amigos a la lista
 * incluye validacion completa, verificacion de duplicados y actualizacion de ui
 */
function agregarAmigo() {
    const inputElement = document.getElementById("amigo");
    
    // validacion defensiva del elemento input
    if (!inputElement) {
        console.error('Error: No se encontró el elemento input#amigo');
        return; // salida temprana para evitar errores
    }
    
    const nombre = inputElement.value; // ✅ VARIABLE LOCAL
    
    // Validar el nombre con la nueva función robusta
    const validacion = validarNombre(nombre);
    if (!validacion.valido) {
        mostrarNotificacion('❌ ' + validacion.mensaje, 'error');
        limpiarCampos();
        return;
    }
    
    // Normalizar el nombre para comparaciones consistentes
    const nombreNormalizado = normalizarNombre(nombre);
    
    // Verificar si el nombre ya existe (usando nombre normalizado)
    if (listaDeAmigos.some(amigo => normalizarNombre(amigo) === nombreNormalizado)) {
        mostrarNotificacion('⚠️ Este nombre ya está en la lista', 'warning');
        limpiarCampos();
        return;
    }
    
    // Agregar el nombre ORIGINAL (no normalizado) a la lista para mostrar
    const nombreLimpio = nombre.trim();
    listaDeAmigos.push(nombreLimpio);
    mostrarNotificacion(`🎉 ¡${nombreLimpio} agregado exitosamente!`, 'success');
    mostrarAmigos();
    limpiarCampos();
}

// mostrar amigos ingresados en la ListaDeAmigos
function mostrarAmigos() {
    const lista = document.getElementById("listaAmigos");
    
    // 🛡️ VALIDACIÓN DEFENSIVA
    if (!lista) {
        console.error('Error: No se encontró el elemento #listaAmigos');
        return;
    }
    
    lista.innerHTML = ""; // Limpiar la lista antes de mostrar los amigos
    
    // 🎯 OPTIMIZACIÓN: usar fragment para mejor performance
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < listaDeAmigos.length; i++) {
        const amigo = listaDeAmigos[i];
        const listItem = document.createElement("li");
        listItem.textContent = amigo;
        fragment.appendChild(listItem);
    }
    
    lista.appendChild(fragment);
    
    // 📊 Actualizar contador
    actualizarContador();
}

function sortearAmigo() {
    if(listaDeAmigos.length < 2){
        mostrarNotificacion('❌ Debe haber al menos dos amigos para sortear', 'error');
        document.getElementById("resultado").textContent = "";
        return;
    }

    let amigoGanador = listaDeAmigos[Math.floor(Math.random()*listaDeAmigos.length)];
    
    mostrarNotificacion(`🎊 ¡El amigo secreto es: ${amigoGanador}!`, 'success');
    document.getElementById("resultado").textContent = "El amigo secreto sorteado es: " + amigoGanador;

}

function reiniciar() {
    // 🚨 Confirmación antes de reiniciar
    if (listaDeAmigos.length > 0) {
        const confirmar = confirm('¿Estás seguro de que quieres reiniciar? Se perderán todos los nombres agregados.');
        if (!confirmar) {
            return; // Cancelar si el usuario no confirma
        }
    }
    
    listaDeAmigos = [];
    document.getElementById("listaAmigos").innerHTML = "";
    document.getElementById("resultado").textContent = "";
    actualizarContador(); // 📊 Actualizar contador a 0
    mostrarNotificacion('🔄 Lista reiniciada correctamente', 'success');
    limpiarCampos();
}

