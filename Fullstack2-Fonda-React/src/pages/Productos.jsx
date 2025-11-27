import { useEffect, useState } from "react";
import Producto from "../components/Producto";
import DataService from "../utils/DataService";

function Productos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    DataService.getProductos()
      .then((data) => {
        setProductos(data);
        setCargando(false);
      })
      .catch((err) => {
        setCargando(false);
      });
  }, []);

  if (cargando) {
    return (
      <div className="container text-center mt-5">
        <h2>Cargando productos...</h2>
      </div>
    );
  }

  return (
    <div className="container mt-3">
      <div className="container-fluid bg-info min-vh-100 d-flex align-items-center justify-content-center mt-4">
        <div className="row">
          <h1 className="text-center mt-5 mb-5">Productos</h1>

          {productos.map((producto) => (
            <div className="col" key={producto.prodId}>
              <Producto
                codigo={producto.prodId}   
                nombre={producto.nombreProducto}
                categoria={producto.categoria?.nombre}
                precio={producto.precioProd}
                moneda={producto.moneda}
                imagen={producto.imagen}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Productos;
