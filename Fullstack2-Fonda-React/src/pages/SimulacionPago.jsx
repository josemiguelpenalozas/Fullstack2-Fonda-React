import { useState } from "react";
import { saveToLocalstorage } from "../utils/localstorageHelper";
import { useNavigate } from "react-router-dom";

function SimulacionPago() {
  const [rut, setRut] = useState("");
  const [nombre, setNombre] = useState("");
  const [numero_tarjeta, setNumero] = useState("");
  const [CVC, setCVC] = useState("");
  const [fecha, setFecha] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (rut.length !== 9) {
      alert("El RUT debe tener 9 caracteres.");
      return;
    }

    const numeroSolo = numero_tarjeta.replace(/\D/g, ""); // solo dígitos
    if (numeroSolo.length !== 12) {
      alert("El número de tarjeta debe tener 12 dígitos.");
      return;
    }

    if (!/^\d{3}$/.test(CVC)) {
      alert("El CVC debe tener 3 dígitos.");
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(fecha)) {
      alert("La fecha debe tener el formato MM/YY.");
      return;
    }

    // Crear objeto de pago
    const pago = { rut, nombre, numero_tarjeta, CVC, fecha };

    // Guardar pago en localStorage (solo uno a la vez)
    saveToLocalstorage("pagos", pago);

    // Redirigir según número de tarjeta
    if (numero_tarjeta === "1234-5678-9123") {
      navigate("/Pago_logrado");
    } else {
      navigate("/Pago_fallido");
    }
  };

  // Formatear número de tarjeta automáticamente mientras se escribe
  const handleNumeroChange = (e) => {
    let val = e.target.value.replace(/\D/g, ""); // solo dígitos
    if (val.length > 12) val = val.slice(0, 12);
    // Formatear como XXXX-XXXX-XXXX
    let formatted = val.replace(/(\d{4})(?=\d)/g, "$1-");
    setNumero(formatted);
  };

  // Formatear fecha automáticamente mientras el usuario escribe
  const handleFechaChange = (e) => {
    let val = e.target.value.replace(/\D/g, ""); // solo dígitos
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length > 2) {
      val = val.slice(0, 2) + "/" + val.slice(2);
    }
    setFecha(val);
  };

  return (
    <div className="container-fluid bg-info min-vh-100 d-flex align-items-center justify-content-center">
      <div className="col-md-6 bg-light p-4 rounded shadow text-center">
        <form onSubmit={handleSubmit}>
          <h1 className="text-center mb-4">Pago</h1>

          <p><strong>Ingrese su RUT</strong></p>
          <input
            type="text"
            placeholder="Con digito verificador ,sin puntos o guion"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
            className="form-control mb-3"
          />

          <p><strong>Nombre del titular</strong></p>
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="form-control mb-3"
          />

          <p><strong>Número de tarjeta</strong></p>
          <input
            type="text"
            placeholder="XXXX-XXXX-XXXX"
            value={numero_tarjeta}
            onChange={handleNumeroChange}
            className="form-control mb-3"
          />

          <p><strong>CVC</strong></p>
          <input
            type="text"
            placeholder="123"
            value={CVC}
            onChange={(e) => setCVC(e.target.value)}
            className="form-control mb-3"
          />

          <p><strong>Fecha de vencimiento (MM/YY)</strong></p>
          <input
            type="text"
            placeholder="MM/YY"
            value={fecha}
            onChange={handleFechaChange}
            className="form-control mb-4"
          />

          <button type="submit" className="btn btn-success w-100">
            Confirmar compra
          </button>
        </form>
      </div>
    </div>
  );
}

export default SimulacionPago;
