//funciones que se mandan a llamar una vez cargado todo el DOM
document.addEventListener("DOMContentLoaded", function(){
    verificarCargaInformacionFunkos();
    cargarListaDinamicaFunkosEnLocalStorage();
    cargarCarritoCompra();
});

// Se crea un numero aleatorio que determina la ultima peticion de busqueda hecha
let numeroTransaccionBusqueda = parseInt(Math.random() * 1000);

//Funcion que reacciona al tecleo del input de busqueda
document.querySelector("#txtFiltroFunkos").addEventListener("keyup", function(event){

    let numeroTransaccionBusquedaLocal = parseInt(Math.random() * 1000);
    const valorBusqueda = document.getElementById("txtFiltroFunkos").value;
    
    //funcion que obtiene el 
    function realizarBusquedaFunkos(numeroTransaccionBusquedaActual){

        if (numeroTransaccionBusqueda == numeroTransaccionBusquedaActual){
            const listaFunkos = getListFunkosLocalStorage()
            .filter((el) => el.nombre.toLowerCase().includes(valorBusqueda.toLowerCase()));
    
            if (listaFunkos.length > 0){
    
                let elementoPadre = document.getElementById("divListFunkos");
    
                while (elementoPadre.firstChild) {
                    elementoPadre.removeChild(elementoPadre.firstChild);
                }
    
                agregarListaFunkoAContenedor(listaFunkos);
    
            }else{
                mostrarMensajeError("Sin Datos!!!","No hay funko con ese nombre.");
            }
        }
        
    }

    if(valorBusqueda != "" && valorBusqueda.length > 2){
        // si se presiona enter se busca de inmediato
        let code = (event.keyCode ? event.keyCode : event.which);
        if (code == 13) {
            realizarBusquedaFunkos(numeroTransaccionBusqueda);
        }
        /** Si no es enter se pone un timer para que el usuario ingrese lo que desee. 
         *  Si se cumple el tiempo se busca el resultado solo si es la transaccion actual
         */
        else {
            setTimeout(function() {
                realizarBusquedaFunkos(numeroTransaccionBusquedaLocal);       
            }, 1000);
        }
        
    }

    if (valorBusqueda == ""){
        let elementoPadre = document.getElementById("divListFunkos");
    
        while (elementoPadre.firstChild) {
            elementoPadre.removeChild(elementoPadre.firstChild);
        }
        cargarListaDinamicaFunkosEnLocalStorage();
    }
    
    // se establece la transaccion actual como la mas actualizada
    numeroTransaccionBusqueda = numeroTransaccionBusquedaLocal;

});


//funcion que carga la informacion de los funkos del localstorage y los pinta en la pantalla principal
function cargarListaDinamicaFunkosEnLocalStorage(){

    agregarListaFunkoAContenedor(getListFunkosLocalStorage());

}

// se intera la lista de la clase Funko para obtener los div's que se insertaran en el contenedor principal
function agregarListaFunkoAContenedor(lista){
    lista.forEach(element => {
        document.getElementById("divListFunkos").insertAdjacentHTML("beforeend" , element.getDivContainerAllInformation);
    });
}

/* 
    Funcion para agregar un funko en el JSON del localStorage si este es el primero se agrega un elemento de la clase ItemCarrito,
    sino solo se incrementa la propiedad cantidad del objecto en si
*/
function agregarFunkoCarrito(idFunko){
    const funkoAdd = getOneFunkoById(idFunko);

    let carritoCompra = getCarritoLocalStorage();

    if (carritoCompra.length  == 0){

        let item = new ItemCarrito(funkoAdd.id, funkoAdd.nombreImg, funkoAdd.nombre, funkoAdd.precio, 1, funkoAdd.descripcion);
        carritoCompra.push(item);

    }else{

        let itemCarritoEncontrado = false;

        carritoCompra.forEach( element => {
            if (element.idFunko == funkoAdd.id){
                itemCarritoEncontrado = true;
                element.cantidad++;
            }
        });

        if (!itemCarritoEncontrado){
            let item = new ItemCarrito(funkoAdd.id, funkoAdd.nombreImg, funkoAdd.nombre, funkoAdd.precio, 1, funkoAdd.descripcion);
            carritoCompra.push(item);
        }

    }

    saveCarritoCompra(carritoCompra);
    cargarCarritoCompra();
    mostrarMensajeCorrecto("Agregado!","Se agrego el funko al carrito correctamente.")

}

/*
    Funcion que carga del localStorage el json que contiene la informacion de los productos que anteriormente
    se agregaron para mostrarlo en el menu lateral (se construye y elimina dinamicamente en el DOM)
*/
function cargarCarritoCompra(){

    let elementoPadre = document.getElementById("divCarrito");
    
    while (elementoPadre.firstChild) {
        elementoPadre.removeChild(elementoPadre.firstChild);
    }

    const listaCarrito = getCarritoLocalStorage();

    if (listaCarrito.length > 0){

        let sumaProducto = listaCarrito.reduce((contador, itemCarrito) => {
            return contador + itemCarrito.cantidad;
        }, 0);

        let sumatotal = listaCarrito.reduce((suma, itemCarrito) => {
            return suma + itemCarrito.precioTotal;
        }, 0);

        document.getElementById("spanCarritoTotalProductos").innerText=sumaProducto;
        document.getElementById("spanCarritoTotalProductos").classList.remove("visually-hidden");
        document.getElementById("divButtonCancelarCarrito").classList.remove("visually-hidden");

        listaCarrito.forEach(element => {
            document.getElementById("divCarrito").insertAdjacentHTML("beforeend" , element.getDivChilderContainerCarrito);
        });

        document.getElementById("offcanvasDarkNavbarLabel").innerHTML 
            = `<span class="text-danger">Orden - Precio Total $${Number.parseFloat(sumatotal).toFixed(2)}</span>`;


    }else{
        document.getElementById("spanCarritoTotalProductos").innerText=0;
        document.getElementById("spanCarritoTotalProductos").classList.add("visually-hidden");
        document.getElementById("offcanvasDarkNavbarLabel").innerText = "Orden";
        document.getElementById("divButtonCancelarCarrito").classList.add("visually-hidden");
    }
}

//funcion que borra un funko de la lista, y de igual forma del json guardado en el localstorage
function borrarProductoCarrito(idFunko){
    let listaCarrito = getCarritoLocalStorage();

    listaCarrito =  listaCarrito.filter(function( itemCarrito ) {
        return itemCarrito.idFunko !== idFunko;
    });

    saveCarritoCompra(listaCarrito);
    cargarCarritoCompra();
    mostrarMensajeCorrecto("Borrado!", "Se quito el funko existosamente.")

}

//funcion para realizar la facturacion
function validarCarritoCompraFacturacion(){

    if (validarDisponibilidadCarritoByExistencias()){
        mostrarMensajeError("Error!", "Un producto excede la cantidad disponible del mismo revisar por favor");
        return;
    }

    Swal.fire({
        html: '&iquest;Est&aacute; seguro que desea pagar para realizar la factura?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0d1b5c',
        cancelButtonColor: '#d33',
        confirmButtonText: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;S&iacute;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
        cancelButtonText: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;No&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
        reverseButtons: true,
        backdrop:true,
        allowOutsideClick:false,
        showLoaderOnConfirm: true,
        preConfirm: () =>  {
                location.href = "facturacion.html";
          }
        });
}