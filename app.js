/**
 * ================================================================
 * PROYECTO: AMIGO SECRETO - APLICACIÓN WEB DE SORTEO DE REGALOS
 * ================================================================
 * 
 * Descripción: Sistema web interactivo para organizar sorteos de amigo secreto
 *             con validaciones robustas y interfaz de usuario moderna
 * 
 * Autor: Carlos Fabián Mesa Muñoz
 * Email: fabianmesa24@hotmail.com
 * Fecha de Creación: Septiembre 2025
 * Última Modificación: Septiembre 2025
 * Versión: 2.0.0
 * 
 * Tecnologías Utilizadas:
 * - HTML5 semántico
 * - CSS3 con Flexbox y Grid
 * - JavaScript ES6+ (Vanilla JS)
 * - DOM Manipulation
 * - Local Storage (futuro)
 * 
 * Funcionalidades Principales:
 * - Agregar nombres con validación completa
 * - Prevención de duplicados inteligente
 * - Sorteo aleatorio matemáticamente justo
 * - Sistema de notificaciones dinámicas
 * - Interfaz responsive y accesible
 * 
 * Estructura del Archivo:
 * 1. Variables globales
 * 2. Sistema de notificaciones
 * 3. Inicialización de eventos
 * 4. Validación de datos
 * 5. Gestión de lista de amigos
 * 6. Algoritmo de sorteo
 * 7. Funciones de utilidad
 * 
 * Licencia: MIT License - Oracle Next Education - Alura Latam
 * ================================================================
 */

// autor: carlos fabian mesa muñoz 
// aplicacion amigo secreto - sorteo aleatorio de intercambio de regalos
// archivo principal que contiene toda la logica de la aplicacion web

// OPTIMIZACIÓN: Namespace para encapsular todas las funciones de la aplicación
const AmigoSecreto = {
    // Estado de la aplicación
    amigos: [],
    
    // Métodos públicos
    init() {
        DOM_CACHE.init();
        SCREEN_READER.init();
        this.setupEventListeners();
    },
    
    setupEventListeners() {
        // Delegación de eventos para mejor performance
        document.addEventListener('keypress', function(e) {
            if (e.target.id === 'amigo' && e.key === 'Enter') {
                e.preventDefault();
                e.target.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    e.target.style.transform = 'scale(1)';
                }, 100);
                AmigoSecreto.agregarAmigo();
            }
        });
        
        // Validación en tiempo real optimizada
        const inputAmigo = DOM_CACHE.get('amigo');
        if (inputAmigo) {
            const validacionTiempoReal = debounce(function() {
                AmigoSecreto.validarTiempoReal();
            }, VALIDACION_CONFIG.DEBOUNCE_DELAY);
            
            inputAmigo.addEventListener('input', validacionTiempoReal);
        }
    },
    
    validarTiempoReal() {
        const inputAmigo = DOM_CACHE.get('amigo');
        const valor = inputAmigo.value.trim();
        
        if (valor.length > 0) {
            const resultado = validarNombreAvanzado(valor); // usar validación AVANZADA
            if (resultado.valido) {
                inputAmigo.style.borderColor = '#4CAF50';
                inputAmigo.style.boxShadow = '0 0 5px rgba(76, 175, 80, 0.3)';
            } else {
                inputAmigo.style.borderColor = '#f44336';
                inputAmigo.style.boxShadow = '0 0 5px rgba(244, 67, 54, 0.3)';
            }
        } else {
            inputAmigo.style.borderColor = '';
            inputAmigo.style.boxShadow = '';
        }
    },
    
    agregarAmigo() {
        // Usar la función global existente pero acceder al estado interno
        this.amigos = listaDeAmigos;
        agregarAmigo();
    },
    
    sortearAmigo() {
        sortearAmigo();
    },
    
    reiniciar() {
        reiniciar();
    }
};

// Array global para mantener compatibilidad con código existente
// esta variable mantiene el estado de todos los amigos agregados durante la sesion
let listaDeAmigos = []; // declaracion de array vacio que sera poblado dinamicamente

/* ═══════════════════════════════════════════════════════════════════════════════ */
/* 🎯 SISTEMA DE SORTEOS ÚNICOS - Variables globales para control de rondas */
/* ═══════════════════════════════════════════════════════════════════════════════ */

// array que almacena nombres de amigos que ya fueron sorteados en la ronda actual
// se utiliza para evitar repeticiones y garantizar que cada amigo sea sorteado solo una vez por ronda
// se reinicia al comenzar nueva ronda pero mantiene historial durante ronda activa
let amigosYaSorteados = []; // declaracion de array vacio para control de sorteados

// contador numerico que lleva registro de la ronda actual de sorteos
// inicia en 1 y se incrementa cada vez que se completa una ronda
// se muestra en la interfaz para que el usuario sepa en que ronda esta
// se resetea solo con reinicio completo de la aplicacion
let rondaActual = 1; // declaracion de contador inicializado en primera ronda

// cache de expresiones regulares para mejorar performance
// evita recompilar la regex en cada validacion, optimizando el rendimiento
const REGEX_CACHE = {
    // expresion regular para validar caracteres permitidos
    // incluye: letras basicas, acentos latinos, diéresis, virgulilla, espacios
    caracteres: /^[a-záéíóúñüçàèìòùâêîôûäëïöüÿāēīōū\s]+$/i,
    // regex para detectar espacios multiples consecutivos
    espaciosMultiples: /\s{2,}/,
    // regex para eliminar marcas diacriticas (acentos) en normalizacion
    diacriticos: /[\u0300-\u036f]/g,
    // regex para normalizar espacios multiples a uno solo
    espaciosNormalizar: /\s+/g,
    // regex para validar que no sean solo números
    soloNumeros: /^\d+$/,
    // regex para validar caracteres repetitivos excesivos (más de 3 iguales seguidos)
    caracteresRepetitivos: /(.)\1{3,}/,
    // regex para validar que no sea solo un carácter repetido
    caracterUnicoRepetido: /^(.)\1+$/,
    // regex para detectar solo espacios
    soloEspacios: /^\s+$/
};

// constantes de configuracion para validacion
// centralizacion de valores magicos para mejor mantenibilidad
const VALIDACION_CONFIG = {
    LONGITUD_MINIMA: 2,
    LONGITUD_MAXIMA: 30,
    LONGITUD_NOMBRE_PEGADO: 12,
    DURACION_NOTIFICACION: 4000, // 4 segundos
    DURACION_ANIMACION_COUNTER: 400, // 0.4 segundos
    DEBOUNCE_DELAY: 300 // 300ms de delay para debounce de validacion en tiempo real
};

/**
 * funcion de utilidad para debouncing - optimizacion de performance
 * retrasa la ejecucion de una funcion hasta que pasen 'delay' milisegundos sin nuevas llamadas
 * util para eventos que se disparan frecuentemente como keypress o resize
 * @param {Function} func - funcion a ejecutar con delay
 * @param {number} delay - tiempo en milisegundos a esperar
 * @returns {Function} funcion debounced que se puede ejecutar
 */
function debounce(func, delay) {
    let timeoutId; // variable para almacenar el ID del timeout activo
    return function(...args) { // retornar funcion que acepta argumentos variables
        clearTimeout(timeoutId); // cancelar timeout anterior si existe
        timeoutId = setTimeout(() => func.apply(this, args), delay); // programar nueva ejecucion
    };
}

// OPTIMIZACIÓN: Sistema de anuncios para lectores de pantalla
const SCREEN_READER = {
    // Crear elemento oculto para anuncios a lectores de pantalla
    announcer: null,
    
    init() {
        this.announcer = document.createElement('div');
        this.announcer.setAttribute('aria-live', 'polite');
        this.announcer.setAttribute('aria-atomic', 'true');
        this.announcer.className = 'sr-only'; // clase para ocultar visualmente
        document.body.appendChild(this.announcer);
    },
    
    announce(message) {
        if (this.announcer) {
            this.announcer.textContent = message;
            // Limpiar después de 1 segundo para evitar spam
            setTimeout(() => {
                this.announcer.textContent = '';
            }, 1000);
        }
    }
};

// OPTIMIZACIÓN: Pool de objetos para elementos DOM reutilizables
const ELEMENT_POOL = {
    liElements: [], // pool de elementos li reutilizables
    
    // Obtener elemento del pool o crear uno nuevo
    getLiElement() {
        return this.liElements.pop() || document.createElement('li');
    },
    
    // Devolver elemento al pool para reutilización
    returnLiElement(element) {
        if (element && this.liElements.length < 50) { // limitar tamaño del pool
            element.textContent = ''; // limpiar contenido
            element.className = ''; // limpiar clases
            element.style.animationDelay = ''; // limpiar estilos
            this.liElements.push(element);
        }
    },
    
    // Limpiar pool para liberación de memoria
    clear() {
        this.liElements.length = 0;
    }
};

// OPTIMIZACIÓN: Cache de elementos DOM para evitar búsquedas repetidas
const DOM_CACHE = {
    inputAmigo: null,
    listaAmigos: null,
    resultado: null,
    numeroAmigos: null,
    estadoVacio: null,
    
    // Inicializar cache de elementos DOM
    init() {
        this.inputAmigo = document.getElementById('amigo');
        this.listaAmigos = document.getElementById('listaAmigos');
        this.resultado = document.getElementById('resultado');
        this.numeroAmigos = document.getElementById('numeroAmigos');
        this.estadoVacio = document.getElementById('estadoVacio');
    },
    
    // Método para obtener elemento con fallback si no está cacheado
    get(elementId) {
        switch(elementId) {
            case 'amigo': return this.inputAmigo || document.getElementById('amigo');
            case 'listaAmigos': return this.listaAmigos || document.getElementById('listaAmigos');
            case 'resultado': return this.resultado || document.getElementById('resultado');
            case 'numeroAmigos': return this.numeroAmigos || document.getElementById('numeroAmigos');
            case 'estadoVacio': return this.estadoVacio || document.getElementById('estadoVacio');
            default: return document.getElementById(elementId);
        }
    }
};

/**
 * sistema de notificaciones dinamicas con tipos y autoeliminacion
 * esta funcion crea mensajes temporales que aparecen en pantalla para dar feedback al usuario
 * incluye diferentes tipos de notificaciones con colores y estilos distintos
 * @param {string} mensaje - texto a mostrar en la notificacion
 * @param {string} tipo - tipo de notificacion ('success', 'error', 'warning')
 */
function mostrarNotificacion(mensaje, tipo = 'success') { // declaracion de funcion con parametro por defecto
    // eliminar cualquier notificacion existente para evitar acumulacion en pantalla
    // esto asegura que solo se muestre una notificacion a la vez
    const notificacionExistente = document.querySelector('.notification'); // buscar elemento con clase notification en el DOM
    if (notificacionExistente) { // verificar si existe una notificacion previa
        notificacionExistente.remove(); // eliminar notificacion anterior del DOM
    } // fin de la verificacion de notificacion existente
    
    // crear elemento div dinamicamente para la nueva notificacion
    const notificacion = document.createElement('div'); // crear nuevo elemento div en memoria
    // asignar clases css - clase base 'notification' y clase especifica del tipo
    notificacion.className = `notification ${tipo}`; // establecer clases CSS usando template literals
    // establecer el texto del mensaje que se mostrara al usuario
    notificacion.textContent = mensaje; // asignar contenido de texto al elemento
    
    /**
     * funcion interna para eliminar notificacion con animacion
     * implementa patron de closure para acceso a variable notificacion
     */
    const limpiarNotificacion = () => { // declaracion de arrow function para encapsular logica de limpieza
        // verificar que el elemento aun existe en el dom antes de manipular
        if (notificacion.parentNode) { // verificar si el elemento tiene un padre (esta en el DOM)
            // agregar clase css para animacion de salida
            notificacion.classList.add('hide'); // agregar clase que activa animacion CSS de salida
            // timeout para permitir que la animacion css se complete antes de remover
            setTimeout(() => { // crear delay asincronico para esperar animacion
                // verificacion adicional por seguridad antes de remover del dom
                if (notificacion.parentNode) { // doble verificacion por seguridad
                    notificacion.remove(); // remover definitivamente del DOM
                } // fin de verificacion de seguridad
            }, 300); // duracion coincide con animacion css definida en stylesheet
        } // fin de verificacion de existencia en DOM
    }; // fin de declaracion de funcion interna
    
    // agregar la notificacion al final del body para que aparezca en pantalla
    document.body.appendChild(notificacion); // insertar elemento en el DOM como ultimo hijo del body
    
    // timer automatico para eliminar notificacion usando configuracion centralizada
    // esto asegura que las notificaciones no se acumulen indefinidamente
    const autoLimpiarTimer = setTimeout(limpiarNotificacion, VALIDACION_CONFIG.DURACION_NOTIFICACION); // usar constante configurada
    
    // event listener para permitir cierre manual con click del usuario
    // proporciona control al usuario para cerrar notificaciones antes del tiempo automatico
    notificacion.addEventListener('click', () => { // agregar escuchador de evento click al elemento
        clearTimeout(autoLimpiarTimer); // cancelar timer automatico para evitar doble eliminacion
        limpiarNotificacion(); // ejecutar limpieza inmediata cuando usuario hace click
    }, { once: true }); // optimizacion: event listener se elimina automaticamente despues del primer uso
} // fin de la funcion mostrarNotificacion

/**
 * funcion especializada para mostrar notificaciones de confirmación con botones
 * implementa UX moderno para acciones destructivas que requieren confirmación del usuario
 * @param {string} mensaje - mensaje de advertencia a mostrar
 * @param {function} onConfirm - callback que se ejecuta si el usuario confirma
 * @param {function} onCancel - callback opcional que se ejecuta si el usuario cancela
 */
function mostrarConfirmacion(mensaje, onConfirm, onCancel = null) { // funcion para confirmaciones modernas
    // eliminar cualquier notificacion existente para evitar conflictos
    const notificacionExistente = document.querySelector('.notification'); // buscar notificacion previa
    if (notificacionExistente) { // verificar existencia
        notificacionExistente.remove(); // eliminar del DOM
    } // fin de limpieza previa
    
    // crear elemento principal para la notificacion de confirmacion
    const notificacion = document.createElement('div'); // crear contenedor principal
    notificacion.className = 'notification warning'; // establecer clases para estilo de advertencia
    
    // crear estructura interna con mensaje y botones
    notificacion.innerHTML = `
        <div class="notification-content">
            <span class="notification-text">${mensaje}</span>
            <div class="notification-buttons">
                <button class="notification-btn cancel">Cancelar</button>
                <button class="notification-btn confirm">Confirmar</button>
            </div>
        </div>
    `; // usar template literal para estructura HTML completa
    
    // obtener referencias a los botones para agregar event listeners
    const btnConfirmar = notificacion.querySelector('.notification-btn.confirm'); // boton de confirmacion
    const btnCancelar = notificacion.querySelector('.notification-btn.cancel'); // boton de cancelacion
    
    // event listener para botón confirmar - ejecuta callback y cierra notificacion
    btnConfirmar.addEventListener('click', (e) => { // escuchar click en confirmar
        e.stopPropagation(); // evitar que se propague el evento al contenedor padre
        notificacion.remove(); // eliminar notificacion del DOM
        if (typeof onConfirm === 'function') { // verificar que el callback sea una funcion valida
            onConfirm(); // ejecutar callback de confirmacion
        } // fin de verificacion de callback
    }); // fin de event listener confirmar
    
    // event listener para botón cancelar - opcional callback y cierre
    btnCancelar.addEventListener('click', (e) => { // escuchar click en cancelar
        e.stopPropagation(); // evitar propagacion del evento
        notificacion.remove(); // eliminar notificacion del DOM
        if (typeof onCancel === 'function') { // verificar callback opcional
            onCancel(); // ejecutar callback de cancelacion si existe
        } // fin de verificacion de callback cancelar
    }); // fin de event listener cancelar
    
    // agregar la notificacion al DOM para mostrarla
    document.body.appendChild(notificacion); // insertar en el body como ultimo elemento
    
    // no agregar timer automatico - requiere interaccion explicita del usuario
    // esto es intencional para confirmaciones que requieren decision consciente
} // fin de la funcion mostrarConfirmacion

/**
 * inicializacion de event listeners cuando el dom esta completamente cargado
 * esta funcion se ejecuta automaticamente cuando la pagina termina de cargar
 * implementa funcionalidad de tecla enter para agregar nombres y configuracion inicial
 */
document.addEventListener('DOMContentLoaded', function() { // agregar escuchador para evento de DOM completamente cargado
    // OPTIMIZACIÓN: Inicializar cache de elementos DOM
    DOM_CACHE.init();
    
    // OPTIMIZACIÓN: Inicializar sistema de accesibilidad
    SCREEN_READER.init();
    
    // OPTIMIZACIÓN: Delegación de eventos para mejor performance
    // Un solo listener en el documento maneja múltiples eventos
    document.addEventListener('keypress', function(e) {
        if (e.target.id === 'amigo' && e.key === 'Enter') {
            e.preventDefault();
            // efecto visual de feedback al presionar enter
            e.target.style.transform = 'scale(0.98)';
            setTimeout(() => {
                e.target.style.transform = 'scale(1)';
            }, 100);
            agregarAmigo();
        }
    });
    
    // OPTIMIZACIÓN: Event listener optimizado para input
    const inputAmigo = DOM_CACHE.get('amigo'); // usar cache en lugar de getElementById
    
    // verificacion defensiva de existencia del elemento para evitar errores
    if (inputAmigo) { // verificar que el elemento input existe antes de manipularlo
        // validacion en tiempo real con debounce para mejor experiencia de usuario
        // proporciona feedback inmediato sin sobrecargar el procesamiento
        const validacionTiempoReal = debounce(function() {
            const valor = inputAmigo.value.trim(); // obtener valor actual del input
            if (valor.length > 0) { // solo validar si hay contenido
                const resultado = validarNombreAvanzado(valor); // ejecutar validacion AVANZADA completa
                // aplicar estilos visuales segun resultado de validacion
                if (resultado.valido) {
                    inputAmigo.style.borderColor = '#4CAF50'; // verde para valido
                    inputAmigo.style.boxShadow = '0 0 5px rgba(76, 175, 80, 0.3)'; // sombra verde sutil
                } else {
                    inputAmigo.style.borderColor = '#f44336'; // rojo para invalido
                    inputAmigo.style.boxShadow = '0 0 5px rgba(244, 67, 54, 0.3)'; // sombra roja sutil
                }
            } else {
                // resetear estilos cuando el input esta vacio
                inputAmigo.style.borderColor = ''; // restaurar color original
                inputAmigo.style.boxShadow = ''; // remover sombra
            }
        }, VALIDACION_CONFIG.DEBOUNCE_DELAY); // usar constante configurada para delay

        // agregar event listener para validacion en tiempo real
        inputAmigo.addEventListener('input', validacionTiempoReal); // ejecutar validacion con debounce
    } // fin de verificacion de existencia del input
    
    // inicializar contador y estado vacio al cargar la pagina por primera vez
    // esto asegura que la interfaz muestre el estado correcto desde el inicio
    actualizarContador(); // llamar funcion que inicializa el estado visual de la aplicacion
}); // fin de event listener DOMContentLoaded

/**
 * funcion para actualizar contador visual de amigos con animacion
 * esta funcion se encarga de mostrar cuantos amigos se han agregado
 * controla la visibilidad del estado vacio y animaciones del contador dinamico
 */
function actualizarContador() { // declaracion de funcion sin parametros
    // obtener referencias a elementos del dom que necesitamos actualizar
    const numeroElement = DOM_CACHE.get('numeroAmigos'); // usar cache en lugar de getElementById
    const estadoVacio = DOM_CACHE.get('estadoVacio'); // usar cache en lugar de getElementById
    
    // verificacion defensiva de existencia del elemento contador para evitar errores
    if (numeroElement) { // verificar que el elemento del numero existe en el DOM
        // agregar clase css para animacion bounce del numero cuando cambia
        numeroElement.classList.add('bounce'); // añadir clase CSS que activa animacion de rebote
        // remover clase despues de la duracion configurada de la animacion para permitir futuras animaciones
        setTimeout(() => { // crear delay asincrono para remover clase
            numeroElement.classList.remove('bounce'); // quitar clase bounce para resetear animacion
        }, VALIDACION_CONFIG.DURACION_ANIMACION_COUNTER); // usar constante configurada en lugar de numero magico
        
        // actualizar el contenido numerico del contador con la cantidad actual de amigos
        numeroElement.textContent = listaDeAmigos.length; // asignar longitud del array como texto
    } // fin de verificacion de elemento numero
    
    // control inteligente de visibilidad del mensaje de estado vacio
    if (estadoVacio) { // verificar que el elemento de estado vacio existe
        // mostrar mensaje instructivo cuando no hay nombres en la lista
        if (listaDeAmigos.length === 0) { // verificar si el array esta vacio
            estadoVacio.classList.remove('hidden'); // mostrar elemento removiendo clase oculta
        } else { // caso contrario: hay elementos en la lista
            estadoVacio.classList.add('hidden'); // ocultar elemento agregando clase oculta
        } // fin de estructura condicional de visibilidad
    } // fin de verificacion de elemento estado vacio
} // fin de la funcion actualizarContador

/**
 * funcion de validacion robusta para nombres de usuario
 * esta funcion es crucial para mantener la calidad de los datos ingresados
 * implementa multiples checks de seguridad, formato y logica de negocio
 * @param {string} nombre - string a validar que contiene el nombre ingresado
 * @returns {Object} objeto con propiedades valido (boolean) y mensaje (string) explicativo
 */
function validarNombre(nombre) { // declaracion de funcion que recibe parametro nombre
    // limpiar espacios en blanco al inicio y final para normalizar entrada
    nombre = nombre.trim(); // aplicar metodo trim() para eliminar espacios laterales
    
    // validacion basica: verificar si el campo esta vacio o solo contiene espacios
    if (!nombre || nombre === '') { // verificar negacion de nombre O comparacion con string vacio
        return { valido: false, mensaje: 'El nombre no puede estar vacío' }; // retornar objeto con resultado negativo
    } // fin de validacion de campo vacio
    
    // validacion de longitud minima para evitar entradas muy cortas sin sentido
    if (nombre.length < VALIDACION_CONFIG.LONGITUD_MINIMA) { // usar constante en lugar de numero magico
        return { valido: false, mensaje: `El nombre debe tener al menos ${VALIDACION_CONFIG.LONGITUD_MINIMA} caracteres` }; // mensaje dinamico
    } // fin de validacion de longitud minima
    
    // validacion de longitud maxima para prevenir overflow de ui
    if (nombre.length > VALIDACION_CONFIG.LONGITUD_MAXIMA) { // usar constante en lugar de numero magico
        return { valido: false, mensaje: `El nombre no puede tener más de ${VALIDACION_CONFIG.LONGITUD_MAXIMA} caracteres` }; // mensaje dinamico
    } // fin de validacion de longitud maxima
    
    // usar regex cacheada para validar caracteres permitidos - optimizacion de performance
    if (!REGEX_CACHE.caracteres.test(nombre)) { // usar regex precacheada en lugar de recompilar
        return { valido: false, mensaje: 'El nombre solo puede contener letras y espacios' }; // retornar error de caracteres invalidos
    } // fin de validacion de caracteres permitidos
    
    // validacion de espacios multiples consecutivos usando regex cacheada
    if (REGEX_CACHE.espaciosMultiples.test(nombre)) { // usar regex precacheada para mejor performance
        return { valido: false, mensaje: 'No se permiten espacios múltiples consecutivos' }; // retornar error de espacios multiples
    } // fin de validacion de espacios consecutivos
    
    // validacion inteligente para detectar nombres pegados sin espacios
    // heuristica: nombres muy largos sin espacios probablemente son nombre+apellido pegados
    if (!nombre.includes(' ') && nombre.length > VALIDACION_CONFIG.LONGITUD_NOMBRE_PEGADO) { // usar constante configurada
        return { valido: false, mensaje: 'Si es nombre y apellido, sepárelos con espacio (ej: "Fabian Mesa")' }; // retornar sugerencia de formato
    } // fin de validacion de nombres pegados
    
    // si pasa todas las validaciones, el nombre es valido
    return { valido: true, mensaje: '' }; // retornar objeto con resultado positivo y mensaje vacio
} // fin de la funcion validarNombre

/**
 * funcion para normalizar nombres y realizar comparaciones consistentes
 * convierte a lowercase, elimina acentos y normaliza espacios
 * @param {string} nombre - nombre a normalizar
 * @returns {string} nombre normalizado para comparacion
 */
function normalizarNombre(nombre) { // declaracion de funcion que recibe nombre como parametro
    return nombre // iniciar cadena de metodos encadenados
        .trim() // eliminar espacios en extremos del string
        .toLowerCase() // convertir a minusculas para comparacion insensible a mayusculas
        .normalize("NFD") // descomponer caracteres acentuados en caracteres base + marcas diacriticas
        .replace(REGEX_CACHE.diacriticos, "") // usar regex cacheada para eliminar marcas diacriticas - optimizacion
        .replace(REGEX_CACHE.espaciosNormalizacion, ' '); // usar regex cacheada para normalizar espacios - optimizacion
} // fin de la funcion normalizarNombre

/**
 * funcion para limpiar el campo de input y mantener focus para mejor experiencia de usuario
 * esta funcion restablece el estado del campo de entrada despues de agregar un nombre
 * implementa validacion defensiva para evitar errores si el elemento no existe
 */
function limpiarCampos(){ // declaracion de funcion sin parametros para limpiar interface
    const inputElement = DOM_CACHE.get('amigo'); // usar cache en lugar de getElementById
    
    // validacion defensiva para verificar existencia del elemento antes de manipularlo
    if (inputElement) { // verificar que el elemento input existe en el DOM
        inputElement.value = ""; // asignar string vacio para limpiar contenido del input
        inputElement.focus(); // establecer focus para que el usuario pueda continuar escribiendo
    } else { // caso alternativo: elemento no existe
        // log de error para debugging en desarrollo - ayuda a detectar problemas
        console.error('Error: No se encontró el elemento input#amigo para limpiar'); // registrar error en consola
    } // fin de verificacion de existencia del elemento
} // fin de la funcion limpiarCampos

/**
 * función de validación avanzada con múltiples capas de verificación
 * implementa validaciones robustas para nombres de amigos secretos
 * @param {string} nombre - nombre a validar
 * @returns {object} objeto con propiedades valido (boolean) y mensaje (string)
 */
function validarNombreAvanzado(nombre) {
    // Limpiar espacios al inicio y final
    nombre = nombre.trim();
    
    // Verificar que no esté vacío después de limpiar
    if (!nombre) {
        return { valido: false, mensaje: "Por favor, ingrese un nombre." };
    }
    
    // Verificar que no sean solo espacios
    if (REGEX_CACHE.soloEspacios.test(nombre)) {
        return { valido: false, mensaje: "El nombre no puede contener solo espacios." };
    }
    
    // Verificar longitud mínima
    if (nombre.length < VALIDACION_CONFIG.LONGITUD_MINIMA) {
        return { valido: false, mensaje: `El nombre debe tener al menos ${VALIDACION_CONFIG.LONGITUD_MINIMA} caracteres.` };
    }
    
    // Verificar longitud máxima
    if (nombre.length > VALIDACION_CONFIG.LONGITUD_MAXIMA) {
        return { valido: false, mensaje: `El nombre no puede tener más de ${VALIDACION_CONFIG.LONGITUD_MAXIMA} caracteres.` };
    }
    
    // Verificar que no sean solo números
    if (REGEX_CACHE.soloNumeros.test(nombre)) {
        return { valido: false, mensaje: "Por favor, ingrese un nombre válido, no solo números." };
    }
    
    // Verificar que no contenga solo caracteres especiales
    if (!/[a-záéíóúñüçàèìòùâêîôûäëïöüÿāēīōū]/i.test(nombre)) {
        return { valido: false, mensaje: "El nombre debe contener al menos una letra." };
    }
    
    // Verificar caracteres repetitivos excesivos (más de 3 iguales seguidos)
    if (REGEX_CACHE.caracteresRepetitivos.test(nombre)) {
        return { valido: false, mensaje: "El nombre no puede tener más de 3 caracteres iguales seguidos." };
    }
    
    // Lista de palabras prohibidas/spam
    const palabrasProhibidas = ['test', 'prueba', 'spam', 'admin', 'null', 'undefined', 'delete', 'script', 'ejemplo', 'demo'];
    const nombreLower = nombre.toLowerCase();
    if (palabrasProhibidas.some(palabra => nombreLower.includes(palabra))) {
        return { valido: false, mensaje: "Por favor, ingrese un nombre real válido." };
    }
    
    // Verificar que no sea solo un carácter repetido
    if (REGEX_CACHE.caracterUnicoRepetido.test(nombre)) {
        return { valido: false, mensaje: "El nombre no puede ser solo un carácter repetido." };
    }
    
    return { valido: true, mensaje: "Nombre válido", nombre: nombre };
}

/**
 * función para detectar nombres similares usando algoritmo de similitud
 * previene duplicados inteligentemente considerando variaciones del mismo nombre
 * @param {string} nuevoNombre - nombre a comparar con la lista existente
 * @returns {object} objeto con información sobre similitud encontrada
 */
function detectarNombresSimilares(nuevoNombre) {
    const nombreNormalizado = nuevoNombre.normalize("NFD").replace(REGEX_CACHE.diacriticos, "").toLowerCase();
    
    for (let amigo of listaDeAmigos) {
        const amigoNormalizado = amigo.normalize("NFD").replace(REGEX_CACHE.diacriticos, "").toLowerCase();
        
        // Verificar nombres idénticos
        if (amigoNormalizado === nombreNormalizado) {
            return { similar: true, tipo: 'idéntico', nombre: amigo };
        }
        
        // Verificar nombres muy similares (diferencia de 1-2 caracteres)
        if (calcularSimilitud(nombreNormalizado, amigoNormalizado) > 0.8 && 
            Math.abs(nombreNormalizado.length - amigoNormalizado.length) <= 2) {
            return { similar: true, tipo: 'muy similar', nombre: amigo };
        }
    }
    
    return { similar: false };
}

/**
 * función para calcular similitud entre dos strings
 * implementa algoritmo simple pero efectivo para comparar nombres
 * @param {string} str1 - primer string a comparar
 * @param {string} str2 - segundo string a comparar
 * @returns {number} porcentaje de similitud entre 0 y 1
 */
function calcularSimilitud(str1, str2) {
    const len1 = str1.length;
    const len2 = str2.length;
    const maxLen = Math.max(len1, len2);
    
    if (maxLen === 0) return 1;
    
    let coincidencias = 0;
    for (let i = 0; i < Math.min(len1, len2); i++) {
        if (str1[i] === str2[i]) coincidencias++;
    }
    
    return coincidencias / maxLen;
}

/**
 * funcion principal para agregar nuevos amigos a la lista
 * esta es la funcion mas importante de la aplicacion para gestionar nombres
 * incluye validacion completa, verificacion de duplicados y actualizacion de interfaz
 */
function agregarAmigo() {
    const inputElement = DOM_CACHE.get('amigo');
    
    // validacion defensiva del elemento input para evitar errores criticos
    if (!inputElement) {
        console.error('Error: No se encontró el elemento input#amigo');
        return; // salida temprana para evitar errores que rompan la aplicacion
    }
    
    const nombre = inputElement.value; // obtener valor actual del input como variable local
    
    // validar el nombre usando la función AVANZADA de validación
    const validacion = validarNombreAvanzado(nombre); // usar nueva función robusta
    if (!validacion.valido) { // verificar si la validacion fue negativa
        mostrarNotificacion('❌ ' + validacion.mensaje, 'error'); // mostrar notificacion de error con mensaje especifico
        limpiarCampos(); // limpiar campo de entrada para nueva oportunidad
        return; // salir de la funcion si la validacion falla
    } // fin de verificacion de validacion
    
    // NUEVA: Verificar duplicados y nombres similares usando detección inteligente
    const similitud = detectarNombresSimilares(validacion.nombre);
    if (similitud.similar) {
        if (similitud.tipo === 'idéntico') {
            mostrarNotificacion('❌ Este nombre ya está en la lista', 'error');
            limpiarCampos();
            return;
        } else {
            // Mostrar confirmación para nombres similares
            const confirmar = confirm(`El nombre "${validacion.nombre}" es muy similar a "${similitud.nombre}" que ya está en la lista. ¿Desea agregarlo de todas formas?`);
            if (!confirmar) {
                limpiarCampos();
                return;
            }
        }
    }
    
    // agregar el nombre ORIGINAL (validado) a la lista para mostrar correctamente
    listaDeAmigos.push(validacion.nombre); // agregar nombre validado al array global
    
    // OPTIMIZACIÓN: Anuncio para lectores de pantalla
    SCREEN_READER.announce(`${validacion.nombre} agregado a la lista. Total: ${listaDeAmigos.length} amigos.`);
    
    mostrarNotificacion(`🎉 ¡${validacion.nombre} agregado exitosamente!`, 'success'); // feedback positivo con template literal
    mostrarAmigos(); // actualizar la lista visual en pantalla llamando funcion de renderizado
    
    // INTEGRACION: actualizar sistema de sorteos unicos tras modificacion de lista
    // sincronizar interfaz de estado para reflejar nuevos totales y disponibles
    actualizarInterfazSorteos(); // refrescar contadores y estado visual del sistema de rondas
    
    limpiarCampos(); // limpiar input para siguiente entrada y mantener focus
} // fin de la funcion agregarAmigo

/**
 * funcion optimizada para crear elementos de lista de manera eficiente
 * evita recrear elementos DOM innecesariamente para mejor performance
 * @param {string} nombre - nombre del amigo a agregar como elemento de lista
 * @param {number} index - indice del elemento para animaciones escalonadas
 * @returns {HTMLElement} elemento li configurado y listo para agregar al DOM
 */
function crearElementoLista(nombre, index) {
    // obtener elemento li del pool para reutilización eficiente de memoria
    const listItem = ELEMENT_POOL.getLiElement(); // usar pool en lugar de createElement para optimización
    listItem.className = 'amigo-item'; // agregar clase CSS base para estilos y animaciones
    
    // CREAR SPAN PARA EL NOMBRE: separar el texto del nombre en su propio elemento
    // esto permite mejor control de estilos y estructura semántica
    const nombreSpan = document.createElement('span'); // crear elemento span para contener solo el nombre
    nombreSpan.textContent = nombre; // asignar el nombre como contenido de texto
    nombreSpan.className = 'amigo-nombre'; // clase CSS para estilar específicamente el nombre
    
    // CREAR BOTÓN DE ELIMINAR: permite eliminar usuarios individuales de la lista
    // implementa funcionalidad crucial para gestión dinámica de participantes
    const botonEliminar = document.createElement('button'); // crear elemento button para acción de eliminar
    botonEliminar.textContent = '×'; // usar símbolo de multiplicación como icono de cerrar/eliminar
    botonEliminar.className = 'btn-eliminar'; // clase CSS para estilar el botón de eliminar
    // ACCESIBILIDAD: agregar descripción para lectores de pantalla
    botonEliminar.setAttribute('aria-label', `Eliminar ${nombre} de la lista`); // texto descriptivo para usuarios con discapacidad visual
    // EVENT HANDLER: conectar botón con función de eliminación usando arrow function
    botonEliminar.onclick = () => eliminarAmigo(index); // pasar índice para identificar qué elemento eliminar
    
    // ENSAMBLAR ELEMENTO: construir la estructura completa del item de lista
    listItem.innerHTML = ''; // limpiar cualquier contenido previo del elemento reutilizado
    listItem.appendChild(nombreSpan); // agregar span del nombre como primer hijo
    listItem.appendChild(botonEliminar); // agregar botón de eliminar como segundo hijo
    
    // ANIMACIÓN ESCALONADA: crear efecto visual elegante de aparición progresiva
    listItem.style.animationDelay = `${index * 0.1}s`; // cada elemento aparece 0.1s despues del anterior
    
    return listItem; // retornar elemento completamente configurado y listo para insertar en DOM
}

/**
 * funcion para mostrar amigos ingresados en la lista visual del DOM
 * actualiza la interfaz de usuario con todos los nombres agregados
 * utiliza optimizaciones de performance para mejor rendimiento
 */
function mostrarAmigos() { // declaracion de funcion sin parametros para renderizar lista
    const lista = DOM_CACHE.get('listaAmigos'); // usar cache en lugar de getElementById
    
    // validacion defensiva para evitar errores si el elemento no existe
    if (!lista) { // verificar que el elemento lista existe en el DOM
        console.error('Error: No se encontró el elemento #listaAmigos'); // registrar error en consola para debugging
        return; // salir de la funcion si no encuentra el elemento
    } // fin de validacion de existencia
    
    // optimizacion: solo actualizar si hay cambios reales en la lista
    // verificar si el numero de elementos en DOM coincide con el array
    const elementosActuales = lista.children.length; // contar elementos actuales en el DOM
    if (elementosActuales === listaDeAmigos.length) {
        // verificar si el contenido es identico para evitar actualizacion innecesaria
        let esIgual = true; // bandera para verificar igualdad de contenido
        for (let i = 0; i < listaDeAmigos.length; i++) {
            if (lista.children[i]?.textContent !== listaDeAmigos[i]) {
                esIgual = false; // marcar como diferente si encuentra discrepancia
                break; // salir del bucle en cuanto encuentra diferencia
            }
        }
        if (esIgual) return; // evitar re-renderizado innecesario si el contenido es identico
    }

    lista.innerHTML = ""; // limpiar la lista antes de mostrar los amigos actualizados

    // si no hay amigos, no crear elementos DOM innecesarios
    if (listaDeAmigos.length === 0) {
        actualizarContador(); // actualizar contador para mostrar estado vacio
        return; // salir temprano si no hay elementos que mostrar
    }
    
    // optimizacion: usar fragment para mejor performance en DOM
    // evita multiples manipulaciones del DOM que causan reflows
    const fragment = document.createDocumentFragment(); // crear fragment temporal para construccion offline del DOM
    
    // recorrer todos los amigos y crear elementos de lista optimizados
    listaDeAmigos.forEach((amigo, index) => { // usar forEach para codigo mas limpio y funcional
        const listItem = crearElementoLista(amigo, index); // crear elemento usando funcion optimizada
        fragment.appendChild(listItem); // agregar al fragment (no al DOM aun) para optimizacion
    }); // fin del forEach de creacion de elementos
    
    lista.appendChild(fragment); // agregar todo el fragment al DOM de una vez para mejor performance
    
    // actualizar contador despues de mostrar la lista
    actualizarContador(); // llamar funcion que actualiza contador y estado visual
} // fin de la funcion mostrarAmigos

/**
 * FUNCIÓN PARA ELIMINAR AMIGO INDIVIDUAL
 * =====================================
 * Esta función permite eliminar un participante específico de la lista
 * manteniendo la integridad de los datos y actualizando la interfaz
 * 
 * PROCESO COMPLETO:
 * 1. Captura el nombre antes de eliminarlo (para feedback)
 * 2. Elimina del array principal usando splice()
 * 3. Muestra notificación visual al usuario
 * 4. Anuncia cambio para accesibilidad
 * 5. Re-renderiza la lista actualizada
 * 
 * @param {number} indice - índice del amigo a eliminar en el array listaDeAmigos
 */
function eliminarAmigo(indice) {
    // PASO 1: CAPTURAR INFORMACIÓN ANTES DE ELIMINAR
    // necesario para mostrar feedback al usuario y para accesibilidad
    const nombreEliminado = listaDeAmigos[indice]; // obtener nombre que se va a eliminar
    
    // PASO 2: ELIMINAR DEL ARRAY PRINCIPAL
    // splice() elimina elemento en posición específica y reordena índices automáticamente
    listaDeAmigos.splice(indice, 1); // eliminar 1 elemento en la posición 'indice'
    
    // PASO 3: FEEDBACK VISUAL AL USUARIO
    // mostrar notificación tipo 'error' (roja) para indicar acción destructiva/eliminación
    mostrarNotificacion(`🗑️ ${nombreEliminado} eliminado de la lista`, 'error'); // emoji de papelera + mensaje en rojo
    
    // PASO 4: ACCESIBILIDAD - ANUNCIO PARA LECTORES DE PANTALLA
    // informar a usuarios con discapacidad visual sobre el cambio en la lista
    SCREEN_READER.announce(`${nombreEliminado} eliminado de la lista. Quedan ${listaDeAmigos.length} amigos.`);
    
    // PASO 5: ACTUALIZAR INTERFAZ VISUAL
    // re-renderizar la lista completa para reflejar el cambio
    // esto actualiza tanto la lista como el contador de participantes
    mostrarAmigos(); // llamar función que redibuja toda la lista desde el array actualizado
    
    // PASO 6: INTEGRACION CON SISTEMA DE SORTEOS UNICOS
    // mantener consistencia entre lista principal y sistema de control de rondas
    // verificar si el amigo eliminado estaba registrado como sorteado en ronda actual
    if (amigosYaSorteados.includes(nombreEliminado)) { // usar includes para verificar presencia en array de sorteados
        // LIMPIEZA: remover amigo del array de sorteados usando filter
        // filter crea nuevo array excluyendo elementos que cumplan condicion
        amigosYaSorteados = amigosYaSorteados.filter(amigo => amigo !== nombreEliminado); // filtrar usando comparacion de desigualdad
    } // fin de verificacion y limpieza de amigo sorteado
    
    // SINCRONIZACION: actualizar interfaz visual para reflejar cambios en totales
    // recalcular disponibles, sorteados y estado general del sistema
    actualizarInterfazSorteos(); // refrescar elementos visuales del sistema de rondas
} // fin de la función eliminarAmigo

/**
 * funcion principal para realizar el sorteo de amigo secreto
 * implementa logica de seleccion aleatoria y validaciones necesarias
 * muestra el resultado tanto en notificacion como en area dedicada
 */
function sortearAmigo() { // declaracion de funcion sin parametros para ejecutar sorteo
    // validacion: verificar que hay al menos 2 amigos en total para poder sortear
    if(listaDeAmigos.length < 2){ // verificar si el array tiene menos de 2 elementos
        mostrarNotificacion('❌ Debe haber al menos dos amigos para sortear', 'error'); // mostrar mensaje de error
        DOM_CACHE.get('resultado').textContent = ""; // usar cache para limpiar resultado anterior
        return; // salir de la funcion si no hay suficientes participantes
    } // fin de validacion de cantidad minima
    
    // validacion: verificar que hay amigos disponibles para sortear (no sorteados)
    const amigosDisponibles = obtenerAmigosDisponibles(); // obtener lista filtrada
    if(amigosDisponibles.length === 0){ // si no hay amigos disponibles
        // esto significa que todos fueron sorteados en la ronda actual
        mostrarNotificacion('🎉 ¡Todos los amigos ya fueron sorteados! Completa la ronda actual.', 'warning'); // mensaje informativo
        setTimeout(() => { // delay para mostrar mensaje antes de opciones
            manejarFinDeRonda(); // mostrar opciones de nueva ronda
        }, 1500); // delay de 1.5 segundos
        return; // salir de la funcion
    } // fin de validacion de disponibilidad

    // iniciar animacion de sorteo antes de mostrar resultado
    iniciarAnimacionSorteo(); // llamar funcion que maneja toda la animacion
} // fin de la funcion sortearAmigo

/**
 * funcion que maneja la animacion completa del sorteo
 * implementa efecto visual de "maquina de sorteo" con nombres cambiando
 * gradualmente reduce velocidad para generar suspense hasta revelar ganador
 */
function iniciarAnimacionSorteo() { // funcion para animacion de sorteo emocionante
    // preparar area de resultado con contenedor de animacion
    const contenedorResultado = DOM_CACHE.get('resultado'); // obtener referencia al area de resultados
    contenedorResultado.innerHTML = ''; // limpiar contenido previo
    
    // crear elemento especial para la animacion
    const animacionContainer = document.createElement('div'); // crear contenedor de animacion
    animacionContainer.className = 'sorteo-animacion sorteo-iniciando'; // agregar clases CSS para estilos
    animacionContainer.innerHTML = `
        <div>🎰 Sorteando...</div>
        <div class="nombre-sorteando" id="nombre-animado">Preparando...</div>
    `; // estructura HTML con emoji de slot machine
    
    contenedorResultado.appendChild(animacionContainer); // agregar al DOM
    
    // configuracion de la animacion: velocidad y duracion
    let velocidadInicial = 50; // milisegundos entre cambios (rapido al inicio)
    let velocidadActual = velocidadInicial; // velocidad que ira cambiando
    const incrementoVelocidad = 20; // cuanto aumentar el intervalo cada vez
    const duracionTotal = 3000; // duracion total de la animacion en milisegundos
    const tiempoInicio = Date.now(); // timestamp del inicio para calcular progreso
    
    // elemento donde se mostraran los nombres cambiando
    const elementoNombre = document.getElementById('nombre-animado'); // referencia al elemento de texto
    
    // funcion recursiva que ejecuta la animacion frame por frame
    function cicloAnimacion() { // funcion interna que maneja cada frame de animacion
        const tiempoTranscurrido = Date.now() - tiempoInicio; // calcular tiempo transcurrido
        const progreso = tiempoTranscurrido / duracionTotal; // calcular progreso (0 a 1)
        
        // verificar si la animacion debe continuar
        if (progreso < 1) { // si aun no hemos llegado al final
            // seleccionar nombre aleatorio para mostrar durante la animacion
            const nombreAleatorio = listaDeAmigos[Math.floor(Math.random() * listaDeAmigos.length)]; // nombre random
            elementoNombre.textContent = nombreAleatorio; // actualizar texto mostrado
            
            // calcular nueva velocidad: mas lento conforme avanza la animacion
            velocidadActual = velocidadInicial + (incrementoVelocidad * progreso * 10); // reducir velocidad gradualmente
            
            // programar el siguiente frame de animacion
            setTimeout(cicloAnimacion, velocidadActual); // llamada recursiva con delay variable
        } else { // cuando la animacion debe terminar
            finalizarAnimacionSorteo(animacionContainer); // llamar funcion de finalizacion
        } // fin de verificacion de progreso
    } // fin de funcion cicloAnimacion
    
    // iniciar el primer ciclo de animacion
    cicloAnimacion(); // comenzar la animacion recursiva
} // fin de la funcion iniciarAnimacionSorteo

/**
 * funcion que finaliza la animacion y muestra el resultado final
 * aplica efectos visuales especiales para la revelacion del ganador
 * utiliza el sistema de sorteos unicos para evitar repeticiones
 * @param {HTMLElement} contenedor - elemento que contiene la animacion
 */
function finalizarAnimacionSorteo(contenedor) { // funcion para finalizar animacion y mostrar ganador
    // obtener lista de amigos disponibles (no sorteados previamente)
    const amigosDisponibles = obtenerAmigosDisponibles(); // filtrar amigos no sorteados
    
    // verificar si hay amigos disponibles para sortear
    if (amigosDisponibles.length === 0) { // si no hay amigos disponibles
        // esto no deberia suceder por validacion previa, pero por seguridad
        console.error('Error: No hay amigos disponibles para sortear'); // log de error
        mostrarNotificacion('❌ Error interno: No hay amigos disponibles', 'error'); // notificacion de error
        return; // salir de la funcion
    } // fin de verificacion de disponibilidad
    
    // seleccionar ganador de la lista de disponibles usando algoritmo aleatorio
    const amigoGanador = amigosDisponibles[Math.floor(Math.random() * amigosDisponibles.length)]; // seleccion aleatoria de disponibles
    
    // registrar el amigo como sorteado en el sistema
    registrarAmigoSorteado(amigoGanador); // marcar como sorteado y actualizar interfaz
    
    // agregar clase CSS para animacion de finalizacion
    contenedor.classList.add('sorteo-finalizando'); // activar estilos de finalizacion
    
    // actualizar contenido con resultado final
    setTimeout(() => { // delay para sincronizar con animacion CSS
        contenedor.innerHTML = `
            <div>🏆 ¡Resultado del Sorteo!</div>
            <div class="nombre-final">${amigoGanador}</div>
        `; // estructura HTML final con emoji de trofeo
        
        // despues de mostrar resultado, activar notificacion y efectos adicionales
        setTimeout(() => { // segundo delay para permitir que se vea la revelacion
            // mostrar notificacion de exito
            mostrarNotificacion(`🎊 ¡El amigo secreto es: ${amigoGanador}!`, 'success'); // notificacion celebratoria
            
            // agregar texto adicional al area de resultados
            const textoAdicional = document.createElement('div'); // crear elemento adicional
            textoAdicional.textContent = `El amigo secreto sorteado es: ${amigoGanador}`; // texto descriptivo
            textoAdicional.style.marginTop = '15px'; // margen superior
            textoAdicional.style.fontSize = '1.1rem'; // tamaño de fuente
            textoAdicional.style.color = '#6b7280'; // color gris
            contenedor.appendChild(textoAdicional); // agregar al contenedor
            
            // verificar si todos los amigos han sido sorteados
            if (todosLoAmigosHanSidoSorteados()) { // si se completo la ronda
                setTimeout(() => { // delay adicional para que se vea el resultado
                    manejarFinDeRonda(); // mostrar opciones de nueva ronda
                }, 2000); // delay de 2 segundos para disfrutar el resultado
            } // fin de verificacion de ronda completa
            
            // OPTIMIZACIÓN: Anuncio para lectores de pantalla
            SCREEN_READER.announce(`Sorteo completado. El amigo secreto es: ${amigoGanador}`); // accesibilidad
        }, 1000); // delay de 1 segundo para la notificacion
    }, 300); // delay de 300ms para sincronizar con CSS
} // fin de la funcion finalizarAnimacionSorteo

/* ═══════════════════════════════════════════════════════════════════════════════ */
/* 🎯 SISTEMA DE SORTEOS ÚNICOS - Evita repeticiones y maneja ciclos completos */
/* ═══════════════════════════════════════════════════════════════════════════════ */

/**
 * funcion que obtiene la lista de amigos disponibles para sortear
 * excluye a aquellos que ya fueron sorteados en la ronda actual
 * utiliza filter() para crear nuevo array sin modificar originales
 * es la funcion clave del sistema de sorteos unicos
 * @returns {Array} array de nombres disponibles para sortear (subconjunto de listaDeAmigos)
 */
function obtenerAmigosDisponibles() { // declaracion de funcion para filtrado inteligente
    // usar metodo filter para crear nuevo array con elementos que cumplan condicion
    // la condicion es: amigo NO esta incluido en array de ya sorteados
    // includes() retorna true si encuentra el elemento, negamos con ! para obtener no incluidos
    return listaDeAmigos.filter(amigo => !amigosYaSorteados.includes(amigo)); // filtrar amigos usando negacion de includes
} // fin de la funcion obtenerAmigosDisponibles

/**
 * funcion que verifica si todos los amigos han sido sorteados en la ronda actual
 * utiliza comparacion de longitudes de arrays para determinar completitud
 * es fundamental para detectar cuando una ronda ha terminado
 * @returns {boolean} true si todos fueron sorteados, false en caso contrario
 */
function todosLoAmigosHanSidoSorteados() { // declaracion de funcion para verificacion de completitud
    // comparar cantidad de elementos en array de sorteados vs array total
    // si ambas longitudes son iguales significa que todos fueron sorteados
    // length es propiedad nativa de arrays que retorna cantidad de elementos
    return amigosYaSorteados.length === listaDeAmigos.length; // comparacion numerica de longitudes
} // fin de la funcion todosLoAmigosHanSidoSorteados

/**
 * funcion que registra un amigo como sorteado en la ronda actual
 * actualiza el array de control y sincroniza la interfaz visual
 * incluye validacion para evitar registros duplicados por seguridad
 * @param {string} nombreAmigo - nombre del amigo que fue sorteado
 */
function registrarAmigoSorteado(nombreAmigo) { // declaracion de funcion para registro de sorteo
    // VALIDACION: verificar que el amigo no este ya registrado como sorteado
    // esto previene errores de logica y duplicados accidentales en el array
    if (!amigosYaSorteados.includes(nombreAmigo)) { // usar negacion de includes para verificar ausencia
        // REGISTRO: agregar nombre al final del array de sorteados
        // push() es metodo nativo que agrega elemento al final del array
        amigosYaSorteados.push(nombreAmigo); // insertar nombre en array de control
        
        // ACTUALIZACION: sincronizar interfaz visual con nuevo estado
        // llamar funcion que recalcula y muestra contadores actualizados
        actualizarInterfazSorteos(); // refrescar visualizacion de estado en DOM
    } // fin de verificacion de no duplicados
} // fin de la funcion registrarAmigoSorteado

/**
 * funcion que inicia una nueva ronda de sorteos desde cero
 * resetea el sistema de control manteniendo la lista original de amigos
 * proporciona retroalimentacion visual al usuario sobre el cambio de estado
 * es llamada cuando usuario confirma continuar despues de completar ronda
 */
function iniciarNuevaRonda() { // declaracion de funcion para gestion de nuevas rondas
    // INCREMENTO: aumentar contador de ronda para tracking y visualizacion
    // operador ++ incrementa variable numerica en 1 unidad
    rondaActual++; // incrementar numero de ronda actual
    
    // RESETEO: limpiar completamente array de amigos sorteados
    // asignar array vacio para comenzar con todos los amigos disponibles
    amigosYaSorteados = []; // reinicializar array de control a estado vacio
    
    // SINCRONIZACION: actualizar interfaz visual para reflejar nuevo estado
    // mostrar ronda actualizada y resetear contadores de progreso
    actualizarInterfazSorteos(); // refrescar elementos visuales del DOM
    
    // FEEDBACK: informar al usuario sobre el cambio exitoso de ronda
    // usar template literal para mensaje dinamico con numero de ronda
    mostrarNotificacion(`🔄 ¡Nueva ronda ${rondaActual} iniciada! Todos los amigos están disponibles nuevamente.`, 'success'); // notificacion verde informativa
} // fin de la funcion iniciarNuevaRonda

/**
 * funcion que actualiza la interfaz visual para mostrar el estado actual de los sorteos
 * maneja la creacion dinamica del elemento de estado si no existe
 * muestra informacion contextual sobre ronda actual y progreso de sorteos
 * utiliza conditional rendering para mostrar estado apropiado segun progreso
 */
function actualizarInterfazSorteos() { // declaracion de funcion para gestion de interfaz de estado
    // CALCULOS: obtener metricas actuales del sistema de sorteos
    // usar funciones auxiliares y propiedades de arrays para datos precisos
    const disponibles = obtenerAmigosDisponibles().length; // cantidad de amigos no sorteados usando funcion filtro
    const sorteados = amigosYaSorteados.length; // cantidad de amigos ya sorteados usando propiedad length
    const total = listaDeAmigos.length; // cantidad total de amigos en la lista completa
    
    // BUSQUEDA: intentar encontrar elemento existente en DOM antes de crear uno nuevo
    // getElementById es metodo optimizado para busqueda por ID unico
    let estadoSorteos = document.getElementById('estado-sorteos'); // buscar elemento con ID especifico
    
    // CREACION CONDICIONAL: crear elemento solo si no existe previamente
    if (!estadoSorteos) { // verificar ausencia del elemento usando negacion
        // crear nuevo elemento div dinamicamente en memoria
        estadoSorteos = document.createElement('div'); // factory method para creacion de elementos
        estadoSorteos.id = 'estado-sorteos'; // asignar identificador unico para futuras busquedas
        estadoSorteos.className = 'estado-sorteos'; // asignar clase CSS para aplicar estilos
        
        // POSICIONAMIENTO: insertar elemento en ubicacion logica del DOM
        // buscar elemento contador como punto de referencia para insercion
        const contador = document.querySelector('.contador'); // buscar primer elemento con clase contador
        if (contador) { // verificar que el elemento de referencia existe
            // insertar nuevo elemento inmediatamente despues del contador
            contador.insertAdjacentElement('afterend', estadoSorteos); // metodo para insercion relativa
        } // fin de verificacion y posicionamiento
    } // fin de creacion condicional de elemento
    
    // RENDERIZADO CONDICIONAL: mostrar u ocultar segun estado de la aplicacion
    if (total === 0) { // si no hay amigos en la lista principal
        // ocultar elemento completo cuando no hay datos que mostrar
        estadoSorteos.style.display = 'none'; // aplicar estilo CSS para ocultar
    } else { // si hay amigos para mostrar estado
        // mostrar elemento y actualizar contenido dinamico
        estadoSorteos.style.display = 'block'; // aplicar estilo CSS para mostrar
        
        // GENERACION DE HTML: crear estructura completa usando template literals
        // utilizar conditional rendering con operador ternario para diferentes estados
        estadoSorteos.innerHTML = `
            <div class="ronda-info">
                <span class="ronda-numero">Ronda ${rondaActual}</span>
                <span class="sorteos-estado">${sorteados}/${total} sorteados</span>
            </div>
            <div class="disponibles-info">
                ${disponibles > 0 ? 
                    `<span class="disponibles-count">👥 ${disponibles} disponibles</span>` : 
                    `<span class="completado">🎉 ¡Ronda completa!</span>`
                }
            </div>
        `; // template literal con interpolacion de variables y conditional rendering
    } // fin de renderizado condicional
} // fin de la funcion actualizarInterfazSorteos

/**
 * funcion que maneja el final de una ronda completa de sorteos
 * presenta opciones al usuario usando sistema de confirmacion moderno
 * proporciona dos caminos: continuar con nueva ronda o finalizar sesion
 * utiliza callbacks para manejar diferentes decisiones del usuario
 */
function manejarFinDeRonda() { // declaracion de funcion para gestion de finalizacion de ronda
    // CONFIRMACION INTERACTIVA: usar sistema de notificaciones con botones
    // mostrarConfirmacion crea interfaz moderna en lugar de alert() nativo
    // utiliza patron callback para manejar respuestas de usuario de forma asincrona
    mostrarConfirmacion(
        // MENSAJE: template literal con informacion contextual sobre estado actual
        // incluir numero de ronda y cantidad total para claridad al usuario
        `🎊 ¡Felicitaciones! Has completado la ronda ${rondaActual}. 
        Todos los ${listaDeAmigos.length} amigos han sido sorteados.
        
        ¿Quieres iniciar una nueva ronda para sortear nuevamente?`, // mensaje descriptivo con interpolacion
        
        // CALLBACK CONFIRMACION: funcion que se ejecuta si usuario acepta continuar
        // arrow function para encapsular logica de continuacion
        () => { // callback de confirmacion usando arrow function
            iniciarNuevaRonda(); // llamar funcion que resetea sistema para nueva ronda
        }, // fin de callback de confirmacion
        
        // CALLBACK CANCELACION: funcion que se ejecuta si usuario decide finalizar
        // arrow function para encapsular logica de finalizacion
        () => { // callback de cancelacion usando arrow function
            // MENSAJE DE CIERRE: notificacion informativa sobre opciones disponibles
            // dar contexto al usuario sobre que puede hacer despues
            mostrarNotificacion('🏁 ¡Sorteos completados! Puedes agregar más amigos o reiniciar cuando quieras.', 'success'); // notificacion verde informativa
        } // fin de callback de cancelacion
    ); // fin de llamada a mostrarConfirmacion con todos los parametros
} // fin de la funcion manejarFinDeRonda

/**
 * funcion para reiniciar completamente la aplicacion
 * limpia todos los datos y restablece el estado inicial
 * incluye confirmacion del usuario para evitar perdida accidental de datos
 */
function reiniciar() { // declaracion de funcion sin parametros para resetear aplicacion
    // verificar si hay datos que se van a perder para mostrar confirmacion
    if (listaDeAmigos.length > 0) { // verificar si hay amigos en la lista
        // mostrar confirmacion moderna con notificacion warning (naranja)
        mostrarConfirmacion(
            '⚠️ ¿Estás seguro de que quieres reiniciar? Se perderán todos los nombres agregados.',
            () => { // callback que se ejecuta si el usuario confirma
                ejecutarReinicio(); // ejecutar la logica de reinicio
            },
            () => { // callback opcional que se ejecuta si el usuario cancela
                // no es necesario hacer nada al cancelar, solo informativo
                console.log('Reinicio cancelado por el usuario'); // log para debugging
            }
        ); // fin de llamada a mostrarConfirmacion
    } else { // si no hay datos que perder
        ejecutarReinicio(); // ejecutar reinicio directamente sin confirmacion
    } // fin de verificacion de datos existentes
} // fin de la funcion reiniciar

/**
 * funcion auxiliar que contiene la logica real de reinicio
 * separada para reutilizacion desde confirmacion y llamada directa
 * limpia todos los datos incluyendo el sistema de sorteos unicos
 */
function ejecutarReinicio() { // funcion que ejecuta el reinicio real de la aplicacion
    // limpiar completamente el array de amigos
    listaDeAmigos = []; // asignar array vacio para resetear datos
    // limpiar el sistema de sorteos unicos
    amigosYaSorteados = []; // limpiar array de sorteados
    rondaActual = 1; // resetear contador de ronda a 1
    
    // limpiar la lista visual del DOM
    DOM_CACHE.get('listaAmigos').innerHTML = ""; // usar cache para limpiar contenido HTML
    // limpiar el area de resultados
    DOM_CACHE.get('resultado').textContent = ""; // usar cache para limpiar texto de resultados
    
    // limpiar elemento de estado de sorteos si existe
    const estadoSorteos = document.getElementById('estado-sorteos'); // buscar elemento de estado
    if (estadoSorteos) { // si existe
        estadoSorteos.remove(); // eliminarlo del DOM
    } // fin de limpieza de estado
    
    // actualizar contador a 0 y mostrar estado vacio
    actualizarContador(); // llamar funcion que recalcula estado visual de la aplicacion
    // mostrar notificacion de confirmacion de reinicio exitoso (verde)
    mostrarNotificacion('🔄 Lista reiniciada correctamente', 'success'); // feedback positivo al usuario
    // limpiar y enfocar el input para nueva entrada
    limpiarCampos(); // llamar funcion que resetea campo de entrada
} // fin de la funcion ejecutarReinicio

