// Carlos Fabián Mesa Muñoz 
let listaDeAmigos = [];
let ganadoresAnteriores = []; // Array para rastrear quién ya ganó

function limpiarCampos(){
    const input = document.getElementById("amigo");
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
    
    // Verificar que no contenga números (nueva validación)
    if (/\d/.test(nombre)) {
        return { valido: false, error: "El nombre no puede contener números. Solo letras y espacios están permitidos." };
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
    const input = document.getElementById("amigo");
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
            limpiarCampos();
            return;
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
    const lista = document.getElementById("listaAmigos");
    lista.innerHTML = ""; // Limpiar la lista antes de mostrar los amigos
    
    // Crear fragmento para mejor performance
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < listaDeAmigos.length; i++) {
        let amigo = listaDeAmigos[i];
        let listItem = document.createElement("li");
        
        // Verificar si este amigo ya ganó
        const yaGano = ganadoresAnteriores.includes(amigo);
        listItem.className = yaGano ? "amigo-item amigo-ganador" : "amigo-item";
        
        // Crear span para el nombre
        let nombreSpan = document.createElement("span");
        nombreSpan.textContent = amigo;
        nombreSpan.className = "amigo-nombre";
        
        // Agregar indicador de ganador si corresponde
        if (yaGano) {
            let indicadorGanador = document.createElement("span");
            indicadorGanador.textContent = "🏆";
            indicadorGanador.className = "indicador-ganador";
            indicadorGanador.setAttribute('title', 'Ya fue sorteado');
            nombreSpan.appendChild(indicadorGanador);
        }
        
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

// Función para actualizar la lista visual sin regenerar todo
function actualizarListaVisual() {
    mostrarAmigos(); // Por simplicidad, regeneramos la lista completa
}

function eliminarAmigo(indice) {
    const nombreEliminado = listaDeAmigos[indice];
    listaDeAmigos.splice(indice, 1);
    
    // También eliminar de la lista de ganadores si estaba ahí
    const indiceGanador = ganadoresAnteriores.indexOf(nombreEliminado);
    if (indiceGanador !== -1) {
        ganadoresAnteriores.splice(indiceGanador, 1);
    }
    
    mostrarAmigos();
    
    // Anunciar eliminación para accesibilidad
    anunciarCambio(`${nombreEliminado} eliminado de la lista. Quedan ${listaDeAmigos.length} amigos.`);
}

function actualizarContador() {
    const contador = document.getElementById("contador");
    if (contador) {
        const cantidad = listaDeAmigos.length;
        contador.textContent = `${cantidad} amigo${cantidad !== 1 ? 's' : ''} agregado${cantidad !== 1 ? 's' : ''}`;
    }
}

function anunciarCambio(mensaje) {
    const anunciador = document.getElementById("anunciador");
    if (anunciador) {
        anunciador.textContent = mensaje;
        // Limpiar después de un momento
        setTimeout(() => {
            anunciador.textContent = "";
        }, 3000);
    }
}

function sortearAmigo() {
    const resultado = document.getElementById("resultado");
    
    if(listaDeAmigos.length < 2){
        alert("Debe haber al menos dos amigos para sortear.");
        resultado.innerHTML = "";
        return;
    }

    // Obtener lista de candidatos que no han ganado
    const candidatos = listaDeAmigos.filter(amigo => !ganadoresAnteriores.includes(amigo));
    
    // Verificar si todos ya han sido sorteados
    if (candidatos.length === 0) {
        resultado.innerHTML = `
            <div class="resultado-simple">
                <div class="ganador-mensaje">
                    <span class="icono-ganador">🏆</span>
                    <span class="ganador-texto">¡Todos ya han sido sorteados! Reinicia para un nuevo sorteo.</span>
                    <span class="icono-ganador">🏆</span>
                </div>
            </div>
        `;
        anunciarCambio("Todos los participantes ya han sido sorteados. Reinicia para continuar.");
        return;
    }

    // Mostrar animación de sorteo
    resultado.innerHTML = `
        <div class="sorteo-loading">
            <div class="spinner"></div>
            <p>🎲 Sorteando entre ${candidatos.length} candidato${candidatos.length > 1 ? 's' : ''}...</p>
        </div>
    `;
    
    // Simular tiempo de sorteo para crear suspense
    setTimeout(() => {
        let amigoGanador = candidatos[Math.floor(Math.random() * candidatos.length)];
        
        // Agregar al array de ganadores anteriores
        ganadoresAnteriores.push(amigoGanador);
        
        // Crear resultado simple y limpio
        resultado.innerHTML = `
            <div class="resultado-simple">
                <div class="ganador-mensaje">
                    <span class="icono-ganador">🎉</span>
                    <span class="ganador-texto">¡El Amigo Secreto es: <strong>${amigoGanador}</strong>!</span>
                    <span class="icono-ganador">🎉</span>
                </div>
            </div>
        `;
        
        // Actualizar la lista visual para mostrar quién ya ganó
        actualizarListaVisual();
        
        // Anunciar resultado
        anunciarCambio(`¡Sorteo realizado! El ganador es ${amigoGanador}.`);
        
    }, 1000); // 1 segundo de suspense
}


function reiniciar() {
    if (listaDeAmigos.length > 0) {
        const confirmar = confirm("¿Está seguro de que desea reiniciar? Se perderán todos los nombres.");
        if (!confirmar) return;
    }
    
    listaDeAmigos = [];
    ganadoresAnteriores = []; // Limpiar también la lista de ganadores
    const lista = document.getElementById("listaAmigos");
    const resultado = document.getElementById("resultado");
    
    lista.innerHTML = "";
    resultado.textContent = "";
    actualizarContador();
    limpiarCampos();
    
    anunciarCambio("Lista reiniciada. Todos los nombres han sido eliminados.");
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

