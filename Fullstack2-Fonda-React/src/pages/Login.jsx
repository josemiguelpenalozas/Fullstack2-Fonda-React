import React, { useState } from "react";

function Login() {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones simples

if (
  !(
    correo.includes("@gmail.com") ||
    correo.includes("@duocuc.cl") ||
    correo.includes("@profesor.duoc.cl")
  )
) {
  alert("Por favor, ingresa un correo válido.");
  return;
}


    if (clave.length < 6) {
      alert("La clave debe tener al menos 6 caracteres.");
      return;
    }

    alert(`Correo: ${correo}\nClave: ${clave}`);
  };

  return (
    <div>
    <div className="container-fluid bg-info min-vh-100 d-flex align-items-center justify-content-center">
      <div className="col-md-6 bg-light p-4 rounded shadow">
        <h1 className="mb-4">Iniciar sesión</h1>

        <form onSubmit={handleSubmit}>
          {/* Campo de correo */}
          <div className="mb-3 text-start">
            <label htmlFor="correo" className="form-label fw-bold">
              Correo electrónico:
            </label>
            <input
              type="email"
              id="correo"
              className="form-control"
              placeholder="ejemplo@correo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>

          {/* Campo de clave */}
          <div className="mb-3 text-start">
            <label htmlFor="clave" className="form-label fw-bold">
              Clave:
            </label>
            <input
              type="password"
              id="clave"
              className="form-control"
              placeholder="Ingresa tu clave"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Ingresar
          </button>
        </form>
      </div>
    </div>

    </div>
  );
}

export default Login;
