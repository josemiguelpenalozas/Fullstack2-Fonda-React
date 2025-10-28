import React, { useEffect, useState } from "react";
import { loadFromLocalstorage, removeFromLocalstorage } from "../utils/localstorageHelper";
import { useNavigate } from "react-router-dom";

function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const navigate = useNavigate();
  const token = loadFromLocalstorage("token");

  useEffect(() => {
    const productosGuardados = loadFromLocalstorage("compra") || [];
    setCarrito(productosGuardados);
  }, []);

  const vaciarCarrito = () => {
    if (window.confirm("¿Seguro que deseas vaciar el carrito?")) {
      removeFromLocalstorage("compra");
      setCarrito([]);
    }
  };

  const total = carrito.reduce((acum, prod) => acum + (prod.precio * prod.cantidad), 0);

  return (
    <div className="row text-center container-fluid bg-info min-vh-100 d-flex align-items-center justify-content-center">
      <div className="col-md-9 bg-light rounded shadow p-4">
        <h1>Carrito de Compras</h1>
        <hr />

        {token ? (
          carrito.length === 0 ? (
            <p className="mt-4">Tu carrito está vacío 😢</p>
          ) : (
            <>
              <ul className="list-group mb-4">
                {carrito.map((producto, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong>{producto.nombre}</strong>
                      <br />
                      <small>
                        {producto.precio} {producto.moneda} x {producto.cantidad}
                      </small>
                    </div>
                    <span>
                      Subtotal: {(producto.precio * producto.cantidad).toLocaleString("es-CL")} CLP
                    </span>
                    {producto.imagen && (
                      <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        style={{ width: "60px", borderRadius: "8px" }}
                      />
                    )}
                  </li>
                ))}
              </ul>

              <h4 className="mb-3">
                Total: <strong>{total.toLocaleString("es-CL")} CLP</strong>
              </h4>

              <button className="btn btn-danger" onClick={vaciarCarrito}>
                Vaciar carrito
              </button>
              <button
                className="btn btn-success m-4"
                onClick={() => navigate("/SimulacionPago")}
              >
                Comprar
              </button>
            </>
          )
        ) : (
          <div>
            <h2>Debe iniciar sesión para poder ingresar al carrito</h2>
            <p className="text-center">
              Presione el botón para ir a iniciar sesión
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/login")}
            >
              Ir a iniciar sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Carrito;
