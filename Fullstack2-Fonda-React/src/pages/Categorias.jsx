import { useEffect, useState } from "react";
import Producto from "../components/Producto";
import { loadFromLocalstorage, saveToLocalstorage } from "../utils/localstorageHelper";
import { useNavigate } from "react-router-dom";


function Categorias(){
    const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");
  const navigate = useNavigate();

  useEffect(() => {
    const guardadosLocalstorage = loadFromLocalstorage("producto");
    if (guardadosLocalstorage) {
      setProductos(guardadosLocalstorage);
    } else {
      fetch(import.meta.env.BASE_URL + "../data/productos.json")
        .then((res) => res.json())
        .then((data) => {
          setProductos(data.productos);
          saveToLocalstorage("producto", data.productos) 
        })
        .catch((ex) => console.error("Error al obtener productos:", ex));
    }
  }, []);

  
  const categorias = ["Todas", ...new Set(productos.map((p) => p.categoria))];

  return (
    <div className="container mt-3">
      <div className="container-fluid bg-info  align-items-center">
      <h1 className="text-center">Categorias</h1>

      {/* Filtro por categoría */}
      <div className="mb-3">
        <label htmlFor="filtro" className="form-label ">
          Filtrar por categoría:
        </label>
        <select 
          id="filtro"
          className="form-select mb-4"
          value={categoriaSeleccionada}
          onChange={(e) => setCategoriaSeleccionada(e.target.value)}
        >
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
    </div>
      <div className="container-fluid bg-info min-vh-100 d-flex align-items-center justify-content-center mt-4">
        <div className="row">
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
export default Categorias;