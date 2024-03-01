//Clase del Tipo Funko para el manejo de los objetos y su renderizado en el HTML
class Funko {

    constructor(id, nombre, descripcion, precio, cantidadDisponible, nombreImg){
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.cantidadDisponible = cantidadDisponible;
        this.nombreImg = nombreImg;
    }

    get urlImagen(){
        return `img/${this.nombreImg}.webp`;
    }

    get precioFormateado(){
        return `$ ${Number.parseFloat(this.precio).toFixed(2)}`;
    }

    //funcion que devuele el html ya con la transpolacion de los valores del objecto
    get getDivContainerAllInformation() {
        return `<div class="col">
        <div class="card h-100" id-funko="${this.id}">
          <img src="${this.urlImagen}" class="card-img-top" alt="${this.nombre}">
          <div class="card-body">
            <h5 class="card-title">${this.nombre}</h5>
            <p class="card-text">${this.descripcion}</p>
            <p class="card-text fw-bold">Cantidad Disponible: ${this.cantidadDisponible}</p>
            <p class="card-text fw-bold text-primary">Precio unitario: ${this.precioFormateado}</p>
          </div>
          <div class="card-footer text-center">
            ${this.#getBotonPorDisponibilidad()}
        </div>
        </div>
      </div>`;
    }
    
    //Metodo privado
    #getBotonPorDisponibilidad(){
        if (this.cantidadDisponible > 0){
            return `<button type="button" onclick="agregarFunkoCarrito(${this.id})" class="btn btn-primary btn-agregar-carrito"> <i class="bi bi-cart-plus"></i> Agregar al Carrito</button>`;
        }else{
            return `<button type="button" class="btn btn-danger"> <i class="bi bi-emoji-frown"></i> Sin existencias por el momento!!!</button>`;
        }
    }
}

//Clase ItemCarrito que se ocupa para cada uno de los Funkos que se quieren comprar
class ItemCarrito {

    constructor (idFunko, imgFunko, nombreFunko, precioUnitario, cantidad ){
        this.idFunko = idFunko;
        this.imgFunko = imgFunko;
        this.nombreFunko = nombreFunko;
        this.precioUnitario = precioUnitario;
        this.cantidad = cantidad;
    }

    get pathImagen(){
        return `img/${this.imgFunko}.webp`;
    }

    get precioTotal(){
        return Number.parseFloat(this.precioUnitario).toFixed(2)  * this.cantidad;
    }

    get getDivChilderContainerCarrito() {
        return `<div class="card mb-3" style="max-width: 540px; max-height: 250px;">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="${this.pathImagen}" class="img-fluid rounded-start" alt="${this.nombreFunko}">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${this.nombreFunko}</h5>
                                <p class="card-text">Cantidad: ${this.cantidad}. <br>Precio Unitario : $ ${this.precioUnitario}<br>Precio Total
                                    Producto: $${this.precioTotal}</p>
                            </div>
                            <div class="card-footer text-center">
                                <button type="button" onclick="borrarProductoCarrito(${this.idFunko})" class="btn btn-danger"> <i class="bi bi-trash"></i>Quitar</button>
                            </div>
                        </div>
                    </div>
                </div>`;
    }

}