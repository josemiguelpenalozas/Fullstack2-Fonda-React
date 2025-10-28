import { useEffect, useState } from "react";
import Producto from "../components/Producto";
import { loadFromLocalstorage, saveToLocalstorage } from "../utils/localstorageHelper";
import { useNavigate } from "react-router-dom";

function Productos() {
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");
  const navigate = useNavigate();

  useEffect(() => {
    const guardadosLocalstorage = loadFromLocalstorage("productos");
    if (guardadosLocalstorage) {
      setProductos(guardadosLocalstorage);
    } else {
      fetch(import.meta.env.BASE_URL + "../data/productos.json")
        .then((res) => res.json())
        .then((data) => {
          setProductos(data.productos);
          saveToLocalstorage("productos", data.productos) 
        })
        .catch((ex) => console.error("Error al obtener productos:", ex));
    }
  }, []);



  return (
    <div className="container mt-3">
      <div className="container-fluid bg-info min-vh-100 d-flex align-items-center justify-content-center mt-4">
        <div className="row">
          <h1 className="text-center mt-5 mb-5">Productos</h1>
          {productos
            .filter(
              (p) =>
                categoriaSeleccionada === "Todas" ||
                p.categoria === categoriaSeleccionada
            )
            .map((producto) => (
              <div className="col" key={producto.codigo}>
                <Producto
                  codigo={producto.codigo}
                  categoria={producto.categoria}
                  nombre={producto.nombre}
                  precio={producto.precio}
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
