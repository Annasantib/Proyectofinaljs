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
]
const respaldoProductos = [...products]
let carrito = [];
let seccionProductos = document.getElementById("products")
let restaurarProductosBoton = document.getElementById("restaurarProductos")
let cacheDeEventos = []

const cargarProductos = () => {
    console.log(" cargando productos", seccionProductos)

    //obtengo productos desde localstorage
    let storageDeProductos = localStorage.getItem('productos')

    //realizo try catch para evitar errores en el parse
    try {
        storageDeProductos = JSON.parse(storageDeProductos)
    } catch (error) {
        console.log('Ocurrio un horror al cargar los items')
    }
    
    //si el storage de productos contiene algo, remplazo el array de productos
    if(storageDeProductos && storageDeProductos.length > 0){
        products = [...storageDeProductos]
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
    
        const anadirCompra = (evento) => {
            evento.preventDefault()

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
                carrito.push(productoEncontrado)

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
                //volver a pintar
                cargarProductos()
                
            }

            console.log('carrito de compra', carrito)

        }

        let button = document.createElement('button')
        button.classList.add('btn-add')
        button.innerText = 'Anadir a compra'
        button.dataset.idproducto = producto.id
        button.addEventListener('click', anadirCompra, false)
        cacheDeEventos.push(button)
        section.appendChild(button)
    
        seccionProductos.appendChild(section)
    })

}

const resturarProductos = (evento) => {
    evento.preventDefault()

    //reemplazando con una copia respaldada los productos
    products = [...respaldoProductos]

    //liberamos todos el evento por que vamos a volver a pintar los productos
    if(cacheDeEventos){
        cacheDeEventos.forEach(evento => evento.removeEventListener('click', null))
        cacheDeEventos = []
    }

    //dejamos el localstorage vacio
    localStorage.setItem('productos', '')

    //volvemos a pintar la lista
    cargarProductos()

}

restaurarProductosBoton.addEventListener('click', resturarProductos)

function carritoDeCompra() {

}

cargarProductos()