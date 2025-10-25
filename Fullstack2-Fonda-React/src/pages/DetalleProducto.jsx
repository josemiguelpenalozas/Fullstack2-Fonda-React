import { useParams } from "react-router-dom";
import { loadFromLocalstorage } from "../utils/localstorageHelper";

function DetalleProducto() {
  const { codigo } = useParams(); 
  const productos = loadFromLocalstorage("productos") || [];
  const producto = productos.find(p => p.codigo === codigo);

  if (!producto) return <p>Producto no encontrado</p>;

  return (
    <div className="row text-center container-fluid bg-info min-vh-100 d-flex align-items-center justify-content-center">
      <div  className="col-md-9 bg-light rounded shadow">
      <h1>{producto.nombre}</h1>
      <p><strong>Categoría:</strong> {producto.categoria}</p>
      <p><strong>Precio:</strong> {producto.precio} {producto.moneda}</p>
      <p><strong>Detalle:</strong> {producto.detalles}</p>
      {producto.imagen && <img src={producto.imagen} alt={producto.nombre} style={{ maxWidth: "400px" }} />}
    </div>
    </div>
  );
}

export default DetalleProducto;
