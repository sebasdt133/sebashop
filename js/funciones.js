const app = Vue.createApp({
    data() {
        return {
            muebles: [],
            busquedaNombre: '',
            categoriaSeleccionada: '',
            carrito: [],
            categorias: [],
        };
    },
    computed: {
        productosFiltrados() {
            let productos = this.muebles;
            if (this.categoriaSeleccionada) {
                productos = productos.filter(mueble =>
                    mueble.category.toLowerCase() === this.categoriaSeleccionada.toLowerCase()
                );
            }
            if (this.busquedaNombre.trim() !== '') {
                const query = this.busquedaNombre.toLowerCase();
                productos = productos.filter(mueble =>
                    mueble.name.toLowerCase().includes(query)
                );
            }
            return productos;
        },
        totalArticulos() {
            return this.carrito.reduce((total, producto) => total + producto.cantidad, 0);
        }
    },
    methods: {
        cargarMuebles() {
            axios.get("https://fakestoreapi.com/products").then(response => {
                this.muebles = response.data.map(mueble => ({
                    id: mueble.id,
                    name: mueble.title,
                    price: mueble.price,
                    category: mueble.category,
                    image: mueble.image
                }));

                this.categorias = [...new Set(this.muebles.map(mueble => mueble.category))];
            });
        },
        verDetalles(id) {
            const productoSeleccionado = this.muebles.find(mueble => mueble.id === id);
        
            if (productoSeleccionado) {
                localStorage.setItem("productoSeleccionado", JSON.stringify(productoSeleccionado));
                window.location.href = `./html/detalles.html?id=${id}`;
            } else {
                console.error("Producto no encontrado.");
            }
        },
        agregarAlCarrito(producto) {
            const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
            const index = carrito.findIndex(item => item.id === producto.id);
    
            if (index !== -1) {
                carrito[index].cantidad += 1;
            } else {
                carrito.push({ ...producto, cantidad: 1 });
            }
    
            localStorage.setItem("carrito", JSON.stringify(carrito));
            this.actualizarCarrito();
            alert(`El producto "${producto.name}" ha sido añadido al carrito.`);
        },
        actualizarCarrito() {
            const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
            this.carrito = carrito.reduce((total, item) => total + item.cantidad, 0);
        },
    },
    created() {
        this.actualizarCarrito();
        this.cargarMuebles();
    }
});

app.mount("#contenedor");
