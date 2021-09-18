let products = [
    {
        id: 1,
        imagen: 'images/dulce.PNG',
        nombre: 'Nombre del producto',
        precio: 1000,
        stock: 5
    },
    {
        id: 2,
        imagen: 'images/dulce.PNG',
        nombre: 'Nombre del producto',
        precio: 1000,
        stock: 5
    },
    {
        id: 3,
        imagen: 'images/dulce.PNG',
        nombre: 'Nombre del producto',
        precio: 1000,
        stock: 5
    },
    {
        id: 4,
        imagen: 'images/dulce.PNG',
        nombre: 'Nombre del producto',
        precio: 1000,
        stock: 5
    },
    {
        id: 5,
        imagen: 'images/dulce.PNG',
        nombre: 'Nombre del producto',
        precio: 1000,
        stock: 5
    },
    {
        id: 6,
        imagen: 'images/dulce.PNG',
        nombre: 'Nombre del producto',
        precio: 1000,
        stock: 5
    }
], 
carrito = [],
cacheDeEventos = [],
logeado = false

const respaldoProductos = [...products], 
usuario = "materjs",
password = "quiero120puntospls",
seccionProductos = document.getElementById("products"),
restaurarProductosBoton = document.getElementById("restaurarProductos"),
loginBoton = document.getElementById("login"),
loginError = document.getElementById("login-error"),
loginSection = document.getElementById("loginSection"),
botonCompra = document.getElementById("botonCompra"),
detalleCarritoCompra = document.getElementById("detail-carro"),
totalCarritoCompra = document.getElementById("total-carro"),
exito = document.getElementById("exito"),
costoEnvio = 1500,
costoEnvioPorProducto = 350

/**
 * carga los productos y agrega al carrito de compra
 */
const cargarProductos = () => {
    // console.log(" cargando productos", seccionProductos)

    //obtengo productos desde localstorage
    let storageDeProductos = localStorage.getItem('productos')
    let storageDeCarritoCompra = localStorage.getItem('carrito')

    //realizo try catch para evitar errores en el parse
    try {
        storageDeProductos = JSON.parse(storageDeProductos)
        storageDeCarritoCompra = JSON.parse(storageDeCarritoCompra)
    } catch (error) {
        //Esto en realidad no es un error, resulta que para reiniciar el localstorage, se deja como un string vacio, por tal, no puede convertirlo a objeto
        // console.log('Ocurrio un horror al cargar los items')
    }
    
    //si el storage de productos contiene algo, remplazo el array de productos
    if(storageDeProductos && storageDeProductos.length > 0){
        products = [...storageDeProductos]
    }

    if(storageDeCarritoCompra && storageDeCarritoCompra.length > 0){
        carrito = [...storageDeCarritoCompra]
    }

    //cargar los productos dinamicamente
    seccionProductos.innerHTML = ''

    //recorro el array de productos para pintar
    products.forEach((producto) => {
        let section = document.createElement("section")
        section.classList.add("product-item")
    
        let imagen = document.createElement('img')
        imagen.src = producto.imagen
        imagen.classList.add('img-class')
        section.appendChild(imagen)
    
        let h4 = document.createElement('h4')
        h4.innerText = producto.nombre
        section.appendChild(h4)
    
        let p = document.createElement('p')
        p.innerText = `$ ${producto.precio}`
        section.appendChild(p)
    
        let p2 = document.createElement('p')
        p2.innerText = `${producto.stock} unidades disponibles`
        section.appendChild(p2)
    
        const anadirProducto = (evento) => {
            evento.preventDefault()

            //eliminamos mensaje de exito si esta con display block
            exito.classList.remove('mostrar')

            let idProducto = evento.target.getAttribute("data-idproducto")

            if(idProducto > 0){
                //convertimos a numerico si existe el idproducto ya que viene como un string
                idProducto = +idProducto
                
                //buscar el id de producto dentro de products, si esto es undefined, no existe
                let productoEncontrado = products.find(producto => producto.id === idProducto)
                // console.log('esto es desde el boton', idProducto, productoEncontrado)

                if(productoEncontrado == undefined || productoEncontrado.stock === 0)
                    return false

                //agregar al carrito de compra
                if(carrito.find(item => item.id === idProducto) !== undefined){
                    //si ya existe sumamos el producto al total
                    carrito = carrito.map(item => {
                        if(item.id === idProducto){
                            return  {
                                ...item,
                                total: item.precio + item.total,
                                stock: item.stock - 1,//aprovechamos de mapear el stock por si a caso
                                unidades: item.unidades + 1
                            }
                        } else {
                            return item
                        }
                    })
                } else {
                    //le agregamos total para luego sumarlo si existe mas de uno
                    productoEncontrado = {
                        ...productoEncontrado,
                        total: productoEncontrado.precio,
                        stock:  productoEncontrado.stock - 1,//aprovechamos de mapear el stock por si a caso
                        unidades: 1
                    }
                    
                    carrito.push(productoEncontrado)
                }
                

                //mapeamos objeto productos para cambiar su stock
                products = [...products.map(producto => {
                    if(producto.id === idProducto){
                        return {
                            ...producto,
                            stock: producto.stock - 1
                        }
                    } else {
                        return producto
                    }
                })]
                
                //liberamos todos el evento por que vamos a volver a pintar los productos
                if(cacheDeEventos){
                    cacheDeEventos.forEach(cache => cache.removeEventListener('click', this))
                    cacheDeEventos = []
                }

                localStorage.setItem('productos', JSON.stringify(products))
                localStorage.setItem('carrito', JSON.stringify(carrito))
                //volver a pintar
                cargarProductos()
                
            }

            // console.log('carrito de compra', carrito)

        }

        let button = document.createElement('button')
        button.classList.add('btn-add')
        button.innerText = 'Anadir a compra'
        button.dataset.idproducto = producto.id
        button.addEventListener('click', anadirProducto, false)
        cacheDeEventos.push(button)
        section.appendChild(button)
    
        seccionProductos.appendChild(section)

        //actualizamos carrito de compra
        actualizarCarritoDeCompra()
    })

}

/**
 * Restaura los productos y carrito de compra
 * @param {*} evento 
 */
const resturarProductos = (evento) => {
    evento.preventDefault()

    //reemplazando con una copia respaldada los productos
    products = [...respaldoProductos]
    carrito = []

    //liberamos todos el evento por que vamos a volver a pintar los productos
    if(cacheDeEventos){
        cacheDeEventos.forEach(evento => evento.removeEventListener('click', null))
        cacheDeEventos = []
    }

    //dejamos el localstorage vacio
    localStorage.setItem('productos', '')
    localStorage.setItem('carrito', '')

    //volvemos a pintar la lista
    cargarProductos()

}

restaurarProductosBoton.addEventListener('click', resturarProductos)

/**
 * actualiza y pinta carrito de compra
 */
const actualizarCarritoDeCompra = () => {

    totalCarritoCompra.innerHTML = ''
    detalleCarritoCompra.innerHTML = ''

    //<h3 class="tit-carro">Carro de Compras</h3>
    let h3 = document.createElement('h3')
    h3.innerText = 'Carro de Compras'
    h3.classList.add('tit-carro')

    detalleCarritoCompra.appendChild(h3)
    
    carrito.forEach(producto => {

        let section = document.createElement('section')
        section.classList.add('detail-carro')

        let imagen = document.createElement('img')
        imagen.src = producto.imagen
        imagen.classList.add('img-detail')

        let ul = document.createElement('ul')
        ul.classList.add('detail-lista')
        let liNombreProducto = document.createElement('li')
        liNombreProducto.innerText = producto.nombre
        let liPrecio = document.createElement('li')
        liPrecio.innerText = `$${producto.precio}`
        let liUnidades = document.createElement('li')
        liUnidades.innerText = producto.unidades > 1 ? `${producto.unidades} unidades` : `${producto.unidades} unidad`
        let liTotal = document.createElement('li')
        liTotal.innerText = `total $${producto.total}`

        section.appendChild(imagen)
        ul.appendChild(liNombreProducto)
        ul.appendChild(liPrecio)
        ul.appendChild(liUnidades)
        ul.appendChild(liTotal)
        section.appendChild(ul)
        detalleCarritoCompra.appendChild(section)

    })

    let ul = document.createElement('ul')
    ul.classList.add('detail-total')

    let totalProductos = carrito.map(x => x.total).reduce((a, b) => a + b, 0)
    let totalProductosHTML = document.createElement('li')
    totalProductosHTML.innerText = `Total de productos $${totalProductos}`

    let totalEnvio = (carrito.length * costoEnvioPorProducto) + costoEnvio
    let totalEnvioHTML = document.createElement('li')
    totalEnvioHTML.innerText = `Envio $${totalEnvio}`

    let totalHTML = document.createElement('li')
    totalHTML.innerText = `Total a comprar $${totalEnvio + totalProductos}`

    ul.appendChild(totalProductosHTML)
    ul.appendChild(totalEnvioHTML)
    ul.appendChild(totalHTML)

    totalCarritoCompra.appendChild(ul)

}

/**
 * logea al usuario con usuario y contraseña como constantes
 * @param {*} event 
 * @returns 
 */
const login = (event) => {
    event.preventDefault()

    const usuarioInput = document.getElementById("usuario"), passwordInput = document.getElementById("password")

    if(!usuarioInput || usuarioInput.value === '' || usuarioInput.value !== usuario){
        loginError.classList.add("mostrar")
        return false
    }

    if(!passwordInput || passwordInput.value === '' || passwordInput.value !== password){
        loginError.classList.add("mostrar")
        return false
    }

    loginError.classList.remove("mostrar")

    loginSection.innerHTML = ''

    let h1 = document.createElement("h1")
    h1.innerText = `Bienvenido ${usuario}.`
    loginSection.appendChild(h1)

    logeado = true
    botonCompraValidacion()

}

loginBoton.addEventListener('click', login)

/**
 * boton de compra parte desactivado, cuando se logea cambia a logeado
 */
const botonCompraValidacion = () => {
    botonCompra.disabled = !logeado
}

/**
 * muestra mensaje de exito y restaura el carrito y los productos
 * @param {*} event 
 */
const realizarCompra = (event) => {
    event.preventDefault()

    //mostramos mensaje de exito
    exito.classList.add('mostrar')

    //restauramos los productos para que vuelva a agregar al carrito
    resturarProductos(event)
}
botonCompra.addEventListener('click', realizarCompra)

botonCompraValidacion()
cargarProductos()
actualizarCarritoDeCompra()