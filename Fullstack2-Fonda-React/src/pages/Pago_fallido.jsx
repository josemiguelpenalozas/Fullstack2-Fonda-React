import { loadFromLocalstorage, removeFromLocalstorage } from "../utils/localstorageHelper";
import { useNavigate } from "react-router-dom";

function PagoFallido() {
  const navigate = useNavigate();

  // Cargar el pago actual (un solo objeto)
  const pago = loadFromLocalstorage("pagos");

  if (!pago) return <p>No se encontró información del pago.</p>;

  const handleSalir = () => {
    removeFromLocalstorage("pagos"); // Limpiar pago
    navigate("/"); // Redirigir a Home
  };

  return (
    <div className="container-fluid bg-info min-vh-100 d-flex align-items-center justify-content-center">
      <div className="col-md-6 bg-light p-4 rounded shadow text-center">
        <h1 className="mb-4">Pago Fallido</h1>

        <div className="text-start mb-3">
          <p><strong>RUT:</strong> {pago.rut}</p>
          <p><strong>Nombre:</strong> {pago.nombre}</p>
          <p><strong>Número de Tarjeta:</strong> {pago.numero_tarjeta}</p>
          <p><strong>Fecha de Vencimiento:</strong> {pago.fecha}</p>
        </div>

        <div className="alert alert-danger mt-4" role="alert">
          El pago no se pudo realizar.
        </div>

        <button className="btn btn-primary mt-4" onClick={handleSalir}>
          Salir
        </button>
      </div>
    </div>
  );
}

export default PagoFallido;
