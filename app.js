// Carlos Fabián Mesa Muñoz 
let listaDeAmigos = [];
let nombre;

function limpiarCampos(){
    document.getElementById("amigo").value = "";
}

function agregarAmigo() {
    nombre = document.getElementById("amigo").value;
    nombre = nombre.toLowerCase();
    //validacion para que no se permitan numeros
    if (!isNaN(nombre)) {
        alert("Por favor, ingrese un nombre válido, no se permiten numeros.");
        limpiarCampos();
        return;
    }else{
        if (nombre) {
            if (!listaDeAmigos.includes(nombre)) {
                listaDeAmigos.push(nombre);
            } else {
                alert("Este nombre ya está en la lista.");
        }
        mostrarAmigos();
        limpiarCampos();
        }
        else{
        alert("Por favor, ingrese un nombre.");
        }
    }
}

// mostrar amigos ingresados en la ListaDeAmigos
function mostrarAmigos() {
    let lista = document.getElementById("listaAmigos");
    lista.innerHTML = ""; // Limpiar la lista antes de mostrar los amigos
    for (let i = 0; i < listaDeAmigos.length; i++) {
        let amigo = listaDeAmigos[i];
        let listItem = document.createElement("li");
        listItem.textContent = amigo;
        lista.appendChild(listItem);
    }
}

function sortearAmigo() {
    if(listaDeAmigos.length < 2){
        alert("Debe haber al menos dos amigos para sortear.");
        document.getElementById("resultado").textContent = "";
        return;
    }

    let amigoGanador = listaDeAmigos[Math.floor(Math.random()*listaDeAmigos.length)];
    
    document.getElementById("resultado").textContent = amigoGanador;
    
}

function reiniciar() {
    listaDeAmigos = [];
    document.getElementById("listaAmigos").innerHTML = "";
    document.getElementById("resultado").textContent = "";
    limpiarCampos();
}

