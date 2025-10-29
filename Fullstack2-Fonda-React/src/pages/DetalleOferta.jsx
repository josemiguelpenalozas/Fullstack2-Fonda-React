import { useParams } from "react-router-dom";
import { loadFromLocalstorage, saveToLocalstorage } from "../utils/localstorageHelper";

function DetalleOferta() {
  const { codigo } = useParams();
  const ofertas = loadFromLocalstorage("ofertas") || [];
  const oferta = ofertas.find((o) => o.codigo === codigo);

  if (!oferta) return <p>Oferta no encontrada</p>;

  const agregarAlCarrito = () => {
    const carrito = loadFromLocalstorage("compra") || [];

    
    const ofertaExistente = carrito.find((item) => item.codigo === oferta.codigo);

    if (ofertaExistente) {
      ofertaExistente.cantidad += 1; 
    } else {
      carrito.push({ ...oferta, cantidad: 1 }); 
    }

    saveToLocalstorage("compra", carrito);
    alert(`${oferta.nombre} fue añadida al carrito`);
  };

  return (
    <div className="row text-center container-fluid bg-info min-vh-100 d-flex align-items-center justify-content-center">
      <div className="col-md-9 bg-light rounded shadow p-4">
        <h1>{oferta.nombre}</h1>
        <p><strong>Categoría:</strong> {oferta.categoria}</p>
        <p><strong>Precio:</strong> {oferta.precio} {oferta.moneda}</p>
        <p><strong>Detalle:</strong> {oferta.detalles}</p>
        {oferta.imagen && (
          <img src={oferta.imagen} alt={oferta.nombre} style={{ maxWidth: "400px" }} />
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

export default DetalleOferta;
