const app = Vue.createApp({
            data() {
                return {
                    producto: {},
                    cantidad:1,
                };
            },
            methods: {
                cargarProducto() {
                    const params = new URLSearchParams(window.location.search);
                    const id = params.get("id");
                    axios.get(`https://fakestoreapi.com/products/${id}`).then(response => {
                        this.producto = {
                            id: response.data.id,
                            name: response.data.title,
                            category: response.data.category,
                            description: response.data.description,
                            price: response.data.price,
                            image: response.data.image
                        };
                    });
                },
                modificarCantidad(incremento){
                    if (this.cantidad+incremento>=1&&this.cantidad+incremento<=6){
                        this.cantidad+=incremento;
                    }
                },
                agregarCarrito() {
                    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
                    const index = carrito.findIndex(item => item.id === this.producto.id);
            
                    if (index !== -1) {
                        carrito[index].cantidad += this.cantidad;
                    } else {
                        carrito.push({ ...this.producto, cantidad: this.cantidad });
                    }
            
                    localStorage.setItem("carrito", JSON.stringify(carrito));
                    alert("Producto agregado al carrito");
                }
            },
            created() {
                this.cargarProducto();
            }
        });
        app.mount("#detalle");