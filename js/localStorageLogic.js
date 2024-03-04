//funcion que cargara la informacion de los funkos en el localStorage si no esta, solo se hace una vez
function verificarCargaInformacionFunkos(){
    const coleccionFunkosEnMemoria = localStorage.getItem('listaFunkosDisponibles');
    if (coleccionFunkosEnMemoria == null || coleccionFunkosEnMemoria == undefined){
        cargarListaFunkos();
    }

    const coleccionItemsCarrito = localStorage.getItem("listItemsCarrito");
    if (coleccionItemsCarrito == null || coleccionItemsCarrito == undefined){
        cargarCarritoVacio();
    }
}

//Funcion que carga una lista Json en el localStorage para darle dinamismo al aplicativo
function cargarListaFunkos(){
    const listafunkos = [
        {id:1, nombre: 'One Piece - Luffy',descripcion:'POP! RED HAWK LUFFY', precio: 15.00, cantidadDisponible: 3, nombreImg: 'OPluffy'},
        {id:2, nombre: 'One Piece - Nami',descripcion:'POP! ONAMI IN WANO OUTFIT', precio: 12.00, cantidadDisponible: 1, nombreImg: 'OPnami'},
        {id:3, nombre: 'One Piece - Robin',descripcion:'POP! OROBI IN WANO OUTFIT', precio: 12.00, cantidadDisponible: 0, nombreImg: 'OProbin'},
        {id:4, nombre: 'One Piece - Yamato',descripcion:'POP! DELUXE YAMATO (MAN-BEAST FORM)', precio: 30.50, cantidadDisponible: 5, nombreImg: 'OPyamato'},
        {id:5, nombre: 'One Piece - Zoro',descripcion:'POP! RORONOA ZORO (GLOW)', precio: 15.00, cantidadDisponible: 5, nombreImg: 'OPzoro'},
        {id:6, nombre: 'Marvel - Spiderman',descripcion:'POP! JUMBO SPIDER-MAN (MILES MORALES) (BLACK LIGHT)', precio: 45.50, cantidadDisponible: 5, nombreImg: 'MarvelSpiderman'},
        {id:7, nombre: 'Marvel - Capitan America',descripcion:'POP! CAPTAIN AMERICA (RETRO REIMAGINED)', precio: 15.99, cantidadDisponible: 10, nombreImg: 'MarvelCapitanAmerica'},
        {id:8, nombre: 'Marvel - Thor',descripcion:'POP! THOR WITH PIN', precio: 15.99, cantidadDisponible: 10, nombreImg: 'MarvelThor'},
        {id:9, nombre: 'Marvel - Scarlet',descripcion:'POP! SCARLET WITCH', precio: 11.99, cantidadDisponible: 10, nombreImg: 'MarvelScarlet'},
        {id:10, nombre: 'Marvel - Iroman',descripcion:'POP! CIVIL WAR: IRON MAN', precio: 15.00, cantidadDisponible: 10, nombreImg: 'MarvelIronMan'},
        {id:11, nombre: 'Tokyo Ghoul - Ken Kaneki',descripcion:'POP! KEN KANEKI (FINAL BATTLE)', precio: 19.99, cantidadDisponible: 10, nombreImg: 'TokyoGhoulKaneki'},
        {id:12, nombre: 'Tokyo Ghoul - Juzo',descripcion:'POP! JUZO SUZUYA', precio: 19.99, cantidadDisponible: 0, nombreImg: 'TokyoGhoulJuzoSuzuya'},
        ];
    
    localStorage.setItem("listaFunkosDisponibles", JSON.stringify(listafunkos));
    
}

function cargarCarritoVacio(){
    localStorage.setItem("listItemsCarrito", "[]");
}

//funcion para retorna una lista de la clase Funko que seria List<Funko>
function getListFunkosLocalStorage(){
    return JSON.parse(localStorage.getItem("listaFunkosDisponibles"))
    .map(a => new Funko(a.id, a.nombre, a.descripcion, a.precio, a.cantidadDisponible, a.nombreImg));
}

//funcion que retorna los datos del funko seleccionado
function getOneFunkoById(idFunko){
    const list = getListFunkosLocalStorage();
    return list.find((element) => element.id == idFunko);
}

//Funcion que elimina un objecto del localStorage y si se envia un objecto nuevo lo crea para simular la actualizacion
function actualizarObjetoEnLocalStorage(nombreItem, objetoActualizar){
    localStorage.removeItem(nombreItem);

    if (objetoActualizar != null && objetoActualizar != undefined){
        localStorage.setItem(nombreItem, JSON.stringify(objetoActualizar));
    }
    
}

//funcion para retorna una lista de la clase ItemCarrito que seria List<ItemCarrito>
function getCarritoLocalStorage(){
    return JSON.parse(localStorage.getItem("listItemsCarrito"))
    .map(item => new ItemCarrito(item.idFunko, item.imgFunko, item.nombreFunko, item.precioUnitario, item.cantidad));
}

//Funcion que guardar el JSON en el localStorage
function saveCarritoCompra(listCarrito) {
    actualizarObjetoEnLocalStorage("listItemsCarrito", listCarrito);
}

/*
    Funcion que simula la compra de los items del carrito por lo cual se disminuye la disponibilidad del producto,
    (Se actualiza los json's del localStorage)
*/
function realizarTransaccionCompra(){

    let datosFunkos = getListFunkosLocalStorage();
    let datosCarrito = getCarritoLocalStorage();

    datosFunkos.forEach(funkoStorage => {
        
        datosCarrito.forEach(carritoItem =>{

            if (carritoItem.idFunko == funkoStorage.id){
                funkoStorage.cantidadDisponible = funkoStorage.cantidadDisponible - carritoItem.cantidad;
            }

        });

    });


    actualizarObjetoEnLocalStorage("listaFunkosDisponibles",datosFunkos);
    cargarCarritoVacio("[]");

}

/*
    funcion que valida la disponibilidad de la compra de funkos en el localstorage
    se retorna true si el usuario ha agregado un funko que en disponibilidad tenga menos de lo que se quiere comprar
    se retorna false si no hay problema
*/
function validarDisponibilidadCarritoByExistencias(){
    let errorValidacion = false;
    let datosFunkos = getListFunkosLocalStorage();
    let datosCarrito = getCarritoLocalStorage();

    datosFunkos.forEach(funkoStorage => {
        
        datosCarrito.forEach(carritoItem =>{

            if (carritoItem.idFunko == funkoStorage.id){
               if (funkoStorage.cantidadDisponible - carritoItem.cantidad < 0){
                errorValidacion = true;
               }
            }

        });

    });

    return errorValidacion;
}

//Funcion que muestra una alerta de mensaje del tipo Error
function mostrarMensajeError(titulo, descripcion){
    Swal.fire({
        icon: "error",
        title: titulo,
        text: descripcion
    });
}

//Funcion que muestra una alerta de mensaje del tipo success
function mostrarMensajeCorrecto(titulo, descripcion){
    Swal.fire({
        icon: "success",
        title: titulo,
        text: descripcion
    });
}