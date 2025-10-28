import { useParams } from "react-router-dom";
import { loadFromLocalstorage, saveToLocalstorage } from "../utils/localstorageHelper";

function DetalleProducto() {
  const { codigo } = useParams();
  const productos = loadFromLocalstorage("productos") || [];
  const producto = productos.find((p) => p.codigo === codigo);

  if (!producto) return <p>Producto no encontrado</p>;

  const agregarAlCarrito = () => {
    const carrito = loadFromLocalstorage("compra") || [];

    // Verifica si el producto ya existe
    const productoExistente = carrito.find(item => item.codigo === producto.codigo);

    if (productoExistente) {
      productoExistente.cantidad += 1; // Aumenta cantidad
    } else {
      carrito.push({ ...producto, cantidad: 1 }); // Nuevo producto con cantidad 1
    }

    saveToLocalstorage("compra", carrito);
    alert(`${producto.nombre} fue añadido al carrito`);
  };

  return (
    <div className="row text-center container-fluid bg-info min-vh-100 d-flex align-items-center justify-content-center">
      <div className="col-md-9 bg-light rounded shadow p-4">
        <h1>{producto.nombre}</h1>
        <p><strong>Categoría:</strong> {producto.categoria}</p>
        <p><strong>Precio:</strong> {producto.precio} {producto.moneda}</p>
        <p><strong>Detalle:</strong> {producto.detalles}</p>
        {producto.imagen && (
          <img src={producto.imagen} alt={producto.nombre} style={{ maxWidth: "400px" }} />
        )}
        <div className="mt-4">
          <button className="btn btn-success" onClick={agregarAlCarrito}>
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetalleProducto;
