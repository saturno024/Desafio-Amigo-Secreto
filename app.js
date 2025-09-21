// Carlos Fabián Mesa Muñoz 
let listaDeAmigos = [];

// Cache de elementos DOM para mejor performance
const DOM_CACHE = {
    amigo: null,
    listaAmigos: null,
    resultado: null,
    contador: null,
    anunciador: null,
    
    init() {
        this.amigo = document.getElementById("amigo");
        this.listaAmigos = document.getElementById("listaAmigos");
        this.resultado = document.getElementById("resultado");
        this.contador = document.getElementById("contador");
        this.anunciador = document.getElementById("anunciador");
    },
    
    get(element) {
        return this[element];
    }
};

// Inicializar cache cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    DOM_CACHE.init();
});

function limpiarCampos(){
    const input = DOM_CACHE.get('amigo') || document.getElementById("amigo");
    input.value = "";
    input.focus(); // Mantener foco para mejor UX
}

function validarNombre(nombre) {
    // Limpiar espacios al inicio y final
    nombre = nombre.trim();
    
    // Verificar que no esté vacío después de limpiar
    if (!nombre) {
        return { valido: false, error: "Por favor, ingrese un nombre." };
    }
    
    // Verificar que no sean solo espacios
    if (/^\s+$/.test(nombre)) {
        return { valido: false, error: "El nombre no puede contener solo espacios." };
    }
    
    // Verificar longitud mínima
    if (nombre.length < 2) {
        return { valido: false, error: "El nombre debe tener al menos 2 caracteres." };
    }
    
    // Verificar longitud máxima
    if (nombre.length > 30) {
        return { valido: false, error: "El nombre no puede tener más de 30 caracteres." };
    }
    
    // Verificar que no sean solo números
    if (/^\d+$/.test(nombre)) {
        return { valido: false, error: "Por favor, ingrese un nombre válido, no solo números." };
    }
    
    // Verificar que no contenga solo caracteres especiales
    if (/^[^a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/.test(nombre)) {
        return { valido: false, error: "El nombre debe contener al menos una letra." };
    }
    
    // Verificar caracteres repetitivos excesivos (más de 3 iguales seguidos)
    if (/(.)\1{3,}/.test(nombre)) {
        return { valido: false, error: "El nombre no puede tener más de 3 caracteres iguales seguidos." };
    }
    
    // Lista de palabras prohibidas/spam
    const palabrasProhibidas = ['test', 'prueba', 'spam', 'admin', 'null', 'undefined', 'delete', 'script'];
    const nombreLower = nombre.toLowerCase();
    if (palabrasProhibidas.some(palabra => nombreLower.includes(palabra))) {
        return { valido: false, error: "Por favor, ingrese un nombre real válido." };
    }
    
    // Verificar que no sea solo un carácter repetido
    if (/^(.)\1+$/.test(nombre)) {
        return { valido: false, error: "El nombre no puede ser solo un carácter repetido." };
    }
    
    return { valido: true, nombre: nombre };
}

function detectarNombresSimilares(nuevoNombre) {
    const nombreNormalizado = nuevoNombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    
    for (let amigo of listaDeAmigos) {
        const amigoNormalizado = amigo.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        
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

function agregarAmigo() {
    const input = DOM_CACHE.get('amigo') || document.getElementById("amigo");
    let nombre = input.value;
    
    // Validar nombre
    const validacion = validarNombre(nombre);
    if (!validacion.valido) {
        alert(validacion.error);
        limpiarCampos();
        return;
    }
    
    // Normalizar para comparación (quitar tildes para evitar duplicados)
    const nombreNormalizado = validacion.nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    
    // Verificar duplicados y nombres similares
    const similitud = detectarNombresSimilares(validacion.nombre);
    if (similitud.similar) {
        if (similitud.tipo === 'idéntico') {
            alert("Este nombre ya está en la lista.");
        } else {
            const confirmar = confirm(`El nombre "${validacion.nombre}" es muy similar a "${similitud.nombre}" que ya está en la lista. ¿Desea agregarlo de todas formas?`);
            if (!confirmar) {
                limpiarCampos();
                return;
            }
        }
    }
    
    // Agregar el nombre original (manteniendo mayúsculas y tildes)
    listaDeAmigos.push(validacion.nombre);
    mostrarAmigos();
    limpiarCampos();
    
    // Anunciar adición para accesibilidad
    anunciarCambio(`${validacion.nombre} agregado. Total: ${listaDeAmigos.length} amigos.`);
}

// mostrar amigos ingresados en la ListaDeAmigos
function mostrarAmigos() {
    const lista = DOM_CACHE.get('listaAmigos') || document.getElementById("listaAmigos");
    lista.innerHTML = ""; // Limpiar la lista antes de mostrar los amigos
    
    // Crear fragmento para mejor performance
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < listaDeAmigos.length; i++) {
        let amigo = listaDeAmigos[i];
        let listItem = document.createElement("li");
        listItem.className = "amigo-item";
        
        // Crear span para el nombre
        let nombreSpan = document.createElement("span");
        nombreSpan.textContent = amigo;
        nombreSpan.className = "amigo-nombre";
        
        // Crear botón para eliminar
        let botonEliminar = document.createElement("button");
        botonEliminar.textContent = "×";
        botonEliminar.className = "btn-eliminar";
        botonEliminar.setAttribute('aria-label', `Eliminar ${amigo} de la lista`);
        botonEliminar.onclick = () => eliminarAmigo(i);
        
        listItem.appendChild(nombreSpan);
        listItem.appendChild(botonEliminar);
        listItem.setAttribute('tabindex', '0'); // Hacer accesible por teclado
        fragment.appendChild(listItem);
    }
    
    lista.appendChild(fragment);
    actualizarContador();
}

function eliminarAmigo(indice) {
    const nombreEliminado = listaDeAmigos[indice];
    listaDeAmigos.splice(indice, 1);
    mostrarAmigos();
    
    // Anunciar eliminación para accesibilidad
    anunciarCambio(`${nombreEliminado} eliminado de la lista. Quedan ${listaDeAmigos.length} amigos.`);
}

function actualizarContador() {
    const contador = DOM_CACHE.get('contador') || document.getElementById("contador");
    if (contador) {
        const cantidad = listaDeAmigos.length;
        contador.textContent = `${cantidad} amigo${cantidad !== 1 ? 's' : ''} agregado${cantidad !== 1 ? 's' : ''}`;
    }
}

function anunciarCambio(mensaje) {
    const anunciador = DOM_CACHE.get('anunciador') || document.getElementById("anunciador");
    if (anunciador) {
        anunciador.textContent = mensaje;
        // Limpiar después de un momento
        setTimeout(() => {
            anunciador.textContent = "";
        }, 3000);
    }
}

function sortearAmigo() {
    const resultado = DOM_CACHE.get('resultado') || document.getElementById("resultado");
    
    if(listaDeAmigos.length < 2){
        alert("Debe haber al menos dos amigos para sortear.");
        resultado.innerHTML = "";
        return;
    }

    // Mostrar animación de sorteo
    resultado.innerHTML = `
        <div class="sorteo-loading">
            <div class="spinner"></div>
            <p>🎲 Sorteando...</p>
        </div>
    `;
    
    // Simular tiempo de sorteo para crear suspense
    setTimeout(() => {
        let amigoGanador = listaDeAmigos[Math.floor(Math.random() * listaDeAmigos.length)];
        
        // Crear resultado festivo
        resultado.innerHTML = `
            <div class="resultado-festivo">
                <div class="confeti">🎊</div>
                <div class="corona">👑</div>
                <div class="ganador-container">
                    <h3 class="ganador-titulo">¡El Amigo Secreto es!</h3>
                    <div class="ganador-nombre">${amigoGanador}</div>
                    <div class="celebracion">🎉✨🎁✨🎉</div>
                </div>
                <div class="confeti">🎊</div>
            </div>
        `;
        
        // Agregar clase de animación
        resultado.classList.add('resultado-animado');
        
        // Crear efecto de confeti flotante
        crearConfeti();
        
        // Anunciar resultado
        anunciarCambio(`¡Sorteo realizado! El ganador es ${amigoGanador}.`);
        
        // Quitar animación después de un tiempo
        setTimeout(() => {
            resultado.classList.remove('resultado-animado');
        }, 3000);
        
    }, 1500); // 1.5 segundos de suspense
}

function crearConfeti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'];
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    document.body.appendChild(confettiContainer);
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confettiContainer.appendChild(confetti);
    }
    
    // Limpiar confeti después de 5 segundos
    setTimeout(() => {
        confettiContainer.remove();
    }, 5000);
}

function reiniciar() {
    if (listaDeAmigos.length > 0) {
        const confirmar = confirm("¿Está seguro de que desea reiniciar? Se perderán todos los nombres.");
        if (!confirmar) return;
    }
    
    listaDeAmigos = [];
    const lista = DOM_CACHE.get('listaAmigos') || document.getElementById("listaAmigos");
    const resultado = DOM_CACHE.get('resultado') || document.getElementById("resultado");
    
    lista.innerHTML = "";
    resultado.textContent = "";
    actualizarContador();
    limpiarCampos();
    
    anunciarCambio("Lista reiniciada. Todos los nombres han sido eliminados.");
}

function mostrarInfo() {
    alert(`🎁 Amigo Secreto v2.1.0

✨ Funcionalidades:
• Agregar amigos con validaciones robustas
• Eliminar amigos individuales con el botón ×
• Sorteo aleatorio justo con animaciones festivas
• Navegación completa por teclado
• Compatible con lectores de pantalla
• Detección de nombres similares

🔧 Desarrollado por Carlos Fabián Mesa Muñoz
📱 Optimizado para accesibilidad y performance

¡Disfruta tu intercambio de regalos! 🎄`);
}

// Agregar soporte para Enter en el input
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById("amigo");
    if (input) {
        input.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                agregarAmigo();
            }
        });
    }
});

