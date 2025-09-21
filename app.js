/**
 * ================================================================
 * PROYECTO: AMIGO SECRETO - APLICACIÓN WEB DE SORTEO DE REGALOS
 * ================================================================
 * 
 * Descripción: Sistema web interactivo para organizar sorteos de amigo secreto
 *             con validaciones robustas y interfaz de usuario moderna
 * 
 * Autor: [NOMBRE DEL DESARROLLADOR]
 * Email: [EMAIL DEL DESARROLLADOR]
 * Fecha de Creación: [FECHA]
 * Última Modificación: [FECHA]
 * Versión: 1.0.0
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
 * Licencia: [TIPO DE LICENCIA]
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
            const resultado = validarNombre(valor);
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
    espaciosNormalizacion: /\s+/g
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
                const resultado = validarNombre(valor); // ejecutar validacion completa
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
    
    // validacion adicional para evitar strings que solo contengan espacios
    if (nombre.replace(/\s/g, '') === '') { // usar replace() con regex global para eliminar todos los espacios
        return { valido: false, mensaje: 'El nombre no puede contener solo espacios' }; // retornar error de solo espacios
    } // fin de validacion de solo espacios
    
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
    
    // validar el nombre usando la funcion robusta de validacion
    const validacion = validarNombre(nombre); // llamar funcion que retorna objeto con estado y mensaje
    if (!validacion.valido) { // verificar si la validacion fue negativa
        mostrarNotificacion('❌ ' + validacion.mensaje, 'error'); // mostrar notificacion de error con mensaje especifico
        limpiarCampos(); // limpiar campo de entrada para nueva oportunidad
        return; // salir de la funcion si la validacion falla
    } // fin de verificacion de validacion
    
    // normalizar el nombre para comparaciones consistentes (sin acentos, minusculas)
    const nombreNormalizado = normalizarNombre(nombre); // aplicar normalizacion para comparacion uniforme
    
    // verificar si el nombre ya existe usando comparacion normalizada para evitar duplicados
    if (listaDeAmigos.some(amigo => normalizarNombre(amigo) === nombreNormalizado)) { // usar metodo some() con callback de comparacion
        mostrarNotificacion('⚠️ Este nombre ya está en la lista', 'warning'); // notificar sobre duplicado encontrado
        limpiarCampos(); // limpiar campo para permitir nuevo intento
        return; // salir de la funcion si el nombre ya existe
    } // fin de verificacion de duplicados
    
    // agregar el nombre ORIGINAL (no normalizado) a la lista para mostrar correctamente
    const nombreLimpio = nombre.trim(); // aplicar trim para limpiar espacios laterales del nombre original
    listaDeAmigos.push(nombreLimpio); // agregar nombre al array global usando metodo push()
    
    // OPTIMIZACIÓN: Anuncio para lectores de pantalla
    SCREEN_READER.announce(`${nombreLimpio} agregado a la lista. Total: ${listaDeAmigos.length} amigos.`);
    
    mostrarNotificacion(`🎉 ¡${nombreLimpio} agregado exitosamente!`, 'success'); // feedback positivo con template literal
    mostrarAmigos(); // actualizar la lista visual en pantalla llamando funcion de renderizado
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
    const listItem = ELEMENT_POOL.getLiElement(); // usar pool en lugar de createElement
    listItem.textContent = nombre; // establecer el nombre como contenido de texto del elemento
    listItem.className = 'amigo-item'; // agregar clase CSS para estilos y animaciones
    // agregar delay escalonado para animacion de entrada elegante
    listItem.style.animationDelay = `${index * 0.1}s`; // cada elemento aparece 0.1s despues del anterior
    return listItem; // retornar elemento configurado listo para usar
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
 * funcion principal para realizar el sorteo de amigo secreto
 * implementa logica de seleccion aleatoria y validaciones necesarias
 * muestra el resultado tanto en notificacion como en area dedicada
 */
function sortearAmigo() { // declaracion de funcion sin parametros para ejecutar sorteo
    // validacion: verificar que hay al menos 2 amigos para poder sortear
    if(listaDeAmigos.length < 2){ // verificar si el array tiene menos de 2 elementos
        mostrarNotificacion('❌ Debe haber al menos dos amigos para sortear', 'error'); // mostrar mensaje de error
        DOM_CACHE.get('resultado').textContent = ""; // usar cache para limpiar resultado anterior
        return; // salir de la funcion si no hay suficientes participantes
    } // fin de validacion de cantidad minima

    // algoritmo de seleccion aleatoria usando Math.random()
    // Math.floor redondea hacia abajo y Math.random() genera numero entre 0 y 1
    let amigoGanador = listaDeAmigos[Math.floor(Math.random() * listaDeAmigos.length)]; // seleccionar indice aleatorio del array
    
    // mostrar resultado con notificacion de exito y emoji celebratorio
    mostrarNotificacion(`🎊 ¡El amigo secreto es: ${amigoGanador}!`, 'success'); // usar template literal para mensaje dinamico
    // tambien mostrar resultado en area dedicada del DOM
    DOM_CACHE.get('resultado').textContent = "El amigo secreto sorteado es: " + amigoGanador; // usar cache para asignar resultado
    
    // OPTIMIZACIÓN: Anuncio para lectores de pantalla
    SCREEN_READER.announce(`Sorteo completado. El amigo secreto es: ${amigoGanador}`);
} // fin de la funcion sortearAmigo

/**
 * funcion para reiniciar completamente la aplicacion
 * limpia todos los datos y restablece el estado inicial
 * incluye confirmacion del usuario para evitar perdida accidental de datos
 */
function reiniciar() { // declaracion de funcion sin parametros para resetear aplicacion
    // confirmacion de seguridad antes de reiniciar para evitar perdida accidental de datos
    if (listaDeAmigos.length > 0) { // verificar si hay datos que se van a perder
        const confirmar = confirm('¿Estás seguro de que quieres reiniciar? Se perderán todos los nombres agregados.'); // mostrar dialogo de confirmacion
        if (!confirmar) { // verificar si el usuario cancelo la operacion
            return; // salir de la funcion si el usuario no confirma
        } // fin de verificacion de confirmacion
    } // fin de verificacion de datos existentes
    
    // limpiar completamente el array de amigos
    listaDeAmigos = []; // asignar array vacio para resetear datos
    // limpiar la lista visual del DOM
    DOM_CACHE.get('listaAmigos').innerHTML = ""; // usar cache para limpiar contenido HTML
    // limpiar el area de resultados
    DOM_CACHE.get('resultado').textContent = ""; // usar cache para limpiar texto de resultados
    // actualizar contador a 0 y mostrar estado vacio
    actualizarContador(); // llamar funcion que recalcula estado visual de la aplicacion
    // mostrar notificacion de confirmacion de reinicio exitoso
    mostrarNotificacion('🔄 Lista reiniciada correctamente', 'success'); // feedback positivo al usuario
    // limpiar y enfocar el input para nueva entrada
    limpiarCampos(); // llamar funcion que resetea campo de entrada
} // fin de la funcion reiniciar

