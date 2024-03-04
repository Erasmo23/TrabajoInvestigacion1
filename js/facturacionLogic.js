//funciones que se mandan a llamar una vez cargado todo el DOM
document.addEventListener("DOMContentLoaded", function(){
    cargarResumeFactura();
});


function cargarResumeFactura() {
    const listaCarrito = getCarritoLocalStorage();
    var dataList = document.getElementById('listItemResume');
    var subtotalLabel = document.getElementById('subtotal');
    var totalLabel = document.getElementById('total');

    let subTotal = listaCarrito.reduce((sum, itemCarrito) => {
        return sum + itemCarrito.precioUnitario;
    }, 0);

    let sumatotal = 5 + subTotal;
    sumatotal = sumatotal.toFixed(2);

    
    subtotalLabel.innerHTML = `<span>Sub-total </span> <span class="text-success">$${subTotal}</span>`;
    totalLabel.innerHTML = `<span>Total </span> <span class="text-success">$${sumatotal}</span>`;

    var divTotal = document.createElement('div');

    for(let item of listaCarrito) {
        var itemDiv = document.createElement('div');
        itemDiv.innerHTML  = `
            <h5 class="mb-3">${item.nombreFunko}</h5>
                <div>
                  <div class="d-flex justify-content-between">
                    <div class="d-flex flex-row mt-1">
                      <h6>Precio</h6>
                      <h6 class="fw-bold text-success ms-1">$ ${item.precioUnitario}</h6>
                    </div>
                    <div class="d-flex flex-row mt-1">
                      <h6>Cantidad</h6>
                      <h6 class="fw-bold text-success ms-1"> ${item.cantidad}</h6>
                    </div>
                  </div>
                  <div class="p-2 d-flex justify-content-between align-items-center" style="background-color: #eee;">
                  <img src="${item.pathImagen}" class="img-fluid rounded-start" alt="${item.nombreFunko}">
                  </div>
            <hr />
        `;

         dataList.before(itemDiv);
    }

}