import React, { useState } from "react";

function Contacto(){
    const[nombre,setNombre]=useState("");
    const [correo, setCorreo] = useState("");
    const [contenido, setContenido] = useState("");

    const handleSubmit = (e) => {
    e.preventDefault();
    
    if (
  !(
    correo.includes("@gmail.com") ||
    correo.includes("@duocuc.cl") ||
    correo.includes("@profesor.duoc.cl")||
    correo.includes("@fondaduoc.cl")
  )
    ) {
    alert("Por favor, ingresa un correo válido.");
    return;
}
    alert(`Correo: ${correo}\nMensaje:Se ha enviado con exito`);
    setNombre("");
    setCorreo("");
    setContenido("");
}
    return(
        <div className="container-fluid bg-info min-vh-100 d-flex align-items-center justify-content-center">
            <div className="col-md-6 bg-light p-4 rounded shadow">
            <h1 className="mb-4 text-center">Contacto</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3 text-start">
                    <label htmlFor="nombre" className="form-label fw-bold">Nombre completo</label>
                    <input type="text"
                           id="nombre"
                           className="form-control"
                           placeholder="Nombre completo"
                           value={nombre}
                           onChange={(e) => setNombre(e.target.value)}
                           required
                    />
                </div>


                <div className="mb-3 text-start">
                    <label htmlFor="correo" className="form-label fw-bold">Correo electronico</label>
                    <input type="email"
                           id="correo"
                           className="form-control"
                           placeholder="ejemplo@correo.com"
                           value={correo}
                           onChange={(e) => setCorreo(e.target.value)}
                           required
                    />
                </div>
            
                <div className="mb-3 text-start">
                    <label htmlFor="contenido" className="form-label fw-bold">Contenido</label>

                    <textarea
                    id="contenido"
                    className="form-control"
                    placeholder="Escribe tu mensaje aquí..."
                    value={contenido}
                    onChange={(e) => setContenido(e.target.value)}
                    required
                    style={{
                        width: "100%",       // ocupa todo el ancho disponible
                        height: "150px",     // controla la altura
                        resize: "none !important",
                        paddingTop: "10px",  // texto empieza arriba
                        resize: "vertical",  // permite cambiar tamaño vertical
                        whiteSpace: "pre-wrap" // asegura que los saltos se muestren bien
                    }}
                    />

                </div>
                <button type="submit" className="btn btn-primary w-100">Enviar</button>
            </form>
        </div>
        </div>
    )
}

export default Contacto;