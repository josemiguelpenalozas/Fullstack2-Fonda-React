function SimulacionPago(){
    const handleSubmit = (e) => {
    e.preventDefault();


    }
    return (
        <div className="container-fluid bg-info min-vh-100 d-flex align-items-center justify-content-center">
            <div className="col-md-6 bg-light p-4 rounded shadow">
                <h1 className="text-center">Pago</h1>
                <p><strong>Ingrese su rut</strong></p>
                <input type="text"
                placeholder="ingrese su rut" 
                className="form-control"
                />
                <p><strong>Ingrese nombre del titular</strong></p>
                <input type="text"
                placeholder="Nombre Completo" 
                className="form-control"
                />
                <p><strong>Numero de tarjeta</strong></p>
                <input type="text"
                placeholder="XXXX-XXXX-XXXX" 
                className="form-control"
                />
                <p><strong>CVC</strong></p>
                <input type="text"
                placeholder="123" 
                className="form-control"
                />
                <p><strong>Fecha de vencimiento</strong></p>
                <input type="text"
                placeholder="MM/YY" 
                className="form-control"
                />
                <button type="submit">Finalizar boton</button>

            </div>
            </div>
    )
}
export default SimulacionPago;