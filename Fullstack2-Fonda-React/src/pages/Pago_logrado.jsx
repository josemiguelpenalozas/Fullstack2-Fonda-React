import { loadFromLocalstorage, removeFromLocalstorage } from "../utils/localstorageHelper";
import { useNavigate } from "react-router-dom";

function Pago_logrado() {
  const navigate = useNavigate();

  
  const pago = loadFromLocalstorage("pagos");

  if (!pago) return <p>No se encontró información del pago.</p>;

  const handleSalir = () => {
    removeFromLocalstorage("pagos"); 
    removeFromLocalstorage("compra");
    navigate("/"); 
  };

  return (
    <div className="container-fluid bg-info min-vh-100 d-flex align-items-center justify-content-center">
      <div className="col-md-6 bg-light p-4 rounded shadow text-center">
        <h1 className="mb-4">Pago Logrado</h1>

        <div className="text-start mb-3">
          <p><strong>RUT:</strong> {pago.rut}</p>
          <p><strong>Nombre:</strong> {pago.nombre}</p>
          <p><strong>Número de Tarjeta:</strong> {pago.numero_tarjeta}</p>
          <p><strong>Fecha de Vencimiento:</strong> {pago.fecha}</p>
        </div>

        <div className="alert alert-success mt-4" role="alert">
          El pago se logro realizar.
        </div>
        <button className="btn btn-primary mt-4" onClick={handleSalir}>
          Salir
        </button>
      </div>
    </div>
  );
}

export default Pago_logrado;

