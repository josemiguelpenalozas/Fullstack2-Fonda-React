import React, { useState, useEffect } from "react";
import {
  saveToLocalstorage,
  loadFromLocalstorage,
  removeFromLocalstorage,
} from "../utils/localstorageHelper.js";
import { useNavigate } from "react-router-dom";

function Login() {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [token, setToken] = useState(null);

  const navigate = useNavigate();

  const IrAHome = (ruta) => {
    navigate(ruta);
  };

  // Revisar si ya hay token guardado
  useEffect(() => {
    const savedToken = loadFromLocalstorage("token");
    if (savedToken) setToken(savedToken);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación de correo
    if (
      !(
        correo.includes("@gmail.com") ||
        correo.includes("@duocuc.cl") ||
        correo.includes("@profesor.duoc.cl") ||
        correo.includes("@fondaduoc.cl")
      )
    ) {
      alert("Por favor, ingresa un correo válido.");
      return;
    }

    // Validación de clave
    if (clave.length < 6) {
      alert("La clave debe tener al menos 6 caracteres.");
      return;
    }

    //  Buscar usuario en localStorage
    const usuarios = loadFromLocalstorage("usuarios") || [];
    const usuarioEncontrado = usuarios.find(
      (u) => u.correo === correo && u.clave === clave
    );

    if (!usuarioEncontrado) {
      alert("Correo o clave incorrectos ");
      return;
    }
    

    //  Generar token
    const tokenGenerado = Math.random().toString(36).substring(2) + Date.now();

    // Guardar token en localStorage y estado
    saveToLocalstorage("token", tokenGenerado);
    setToken(tokenGenerado);

    // Guardar también el usuario logueado
    saveToLocalstorage("usuarioLogueado", usuarioEncontrado);

    if (usuarioEncontrado.correo.includes("@fondaduoc.cl")) {
      IrAHome("/admin/dashboard");
    }

    // Limpiar campos
    setCorreo("");
    setClave("");

    alert(" Sesión iniciada correctamente");
  };

  const handleLogout = () => {
    removeFromLocalstorage("token");
    removeFromLocalstorage("usuarioLogueado");
    setToken(null);
    alert("Sesión cerrada");
  };

  return (
    <div className="container-fluid bg-info min-vh-100 d-flex align-items-center justify-content-center">
      <div className="col-md-5 bg-light p-4 rounded shadow">
        {token ? (
          <div className="text-center">
            <h3>Usuario ya logueado</h3>
            <button className="btn btn-danger" onClick={handleLogout}>
              Cerrar sesión
            </button>
            <button
              className="btn btn-success m-4"
              onClick={() => IrAHome("/")}
            >
              Ir a Inicio
            </button>
          </div>
        ) : (
          <>
            <h1 className="mb-4">Iniciar sesión</h1>
            <form onSubmit={handleSubmit}>
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
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
