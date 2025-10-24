import React, { useState } from "react";

function Registro(){
    const [nombre,setNombre]=useState("")
    const [correo, setCorreo] = useState("");
    const [clave, setClave] = useState("");
    const[telefono,setTelefono]=useState("");
    const [correoConfirm, setCorreoConfirm] = useState("");
    const [claveConfirm, setClaveConfirm] = useState("");

    const handleSubmit = (e) => {
    e.preventDefault();

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
    if(telefono.length<8){
        alert("El telefono debe tener minimo 8 numero")
    }
    // Validar que el correo y confirmación coincidan
    if (correo !== correoConfirm) {
    alert("Los correos no coinciden.");
    return;
    }

    // Validar que la clave y confirmación coincidan
    if (clave !== claveConfirm) {
    alert("Las claves no coinciden.");
    return;
    }

    alert(`Correo: ${correo}\nClave: ${clave}`);

  };
    
    return(
        <div className="container-fluid bg-info min-vh-100 d-flex align-items-center justify-content-center">
            <div className="col-md-6 bg-light p-4 rounded shadow">
                <h1 className="mb-4">Registro</h1>
                        <form onSubmit={handleSubmit}>
        {/* Campo de correo */}
        <div className="mb-3 text-start">
        <label htmlFor="nombre" className="form-label fw-bold">
              Nombre completo:
            </label>
            <input
              type="text"
              id="nombre"
              className="form-control"
              placeholder="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>        
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
            <div className="mb-3 text-start">
            <label htmlFor="correoConfirm" className="form-label fw-bold">
              Confirmar Correo electrónico:
            </label>
            <input
              type="email"
              id="correoConfirm"
              className="form-control"
              placeholder="ejemplo@correo.com"
              value={correoConfirm}
              onChange={(e) => setCorreoConfirm(e.target.value)}
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
            <div className="mb-3 text-start">
            <label htmlFor="claveConfirm" className="form-label fw-bold">
              Confirmar Clave:
            </label>
            <input
              type="password"
              id="claveConfirm"
              className="form-control"
              placeholder="Ingresa tu clave"
              value={claveConfirm}
              onChange={(e) => setClaveConfirm(e.target.value)}
              required
            />
          </div>
          <div>
            <div className="mb-3 text-start">
           <label htmlFor="Telefono" className="form-label fw-bold">Telefono</label> 
           <input type="text"
           id="telefono"
           className="form-control"
           placeholder="ejemplo:+56912345678 o 912345678"
           value={telefono} 
           onChange={(e) => setTelefono(e.target.value)}
            required
           />    
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Ingresar
          </button>
        </form>
            </div>
        </div>
    )
}

export default Registro;