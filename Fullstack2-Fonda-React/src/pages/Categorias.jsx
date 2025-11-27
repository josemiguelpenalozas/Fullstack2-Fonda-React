import { useEffect, useState } from "react";
import Producto from "../components/Producto";
import DataService from "../utils/DataService";

function Categorias() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

  // Cargar CATEGORÍAS desde DataService
  useEffect(() => {
    DataService.getCategorias()
      .then((data) => setCategorias(data))
      .catch((err) => console.error("Error cargando categorías:", err));
  }, []);

  // Cargar PRODUCTOS desde DataService
  useEffect(() => {
    DataService.getProductos()
      .then((data) => setProductos(data))
      .catch((err) => console.error(" Error cargando productos:", err));
  }, []);

  return (
    <div className="container mt-3">

      <h1 className="text-center">Categorías</h1>

      {/* Select Categorías */}
      <div className="mb-3">
        <label className="form-label">Filtrar por categoría:</label>

        <select
          className="form-select"
          value={categoriaSeleccionada}
          onChange={(e) => setCategoriaSeleccionada(e.target.value)}
        >
          <option value="">Todas</option>

          {categorias.map((cat) => (
            <option
              key={cat.id || cat.catId}
              value={cat.id || cat.catId}
            >
              {cat.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Productos filtrados */}
      <div className="row">
        {productos
          .filter(
            (p) =>
              categoriaSeleccionada === "" ||
              p.categoria?.id === Number(categoriaSeleccionada) ||
              p.categoria?.catId === Number(categoriaSeleccionada)
          )
          .map((producto) => (
            <div className="col" key={producto.id}>
              <Producto
                codigo={producto.id}
                nombre={producto.nombre}
                precio={producto.precio}
                imagen={producto.imagen}
                categoria={producto.categoria?.nombre}
              />
            </div>
          ))}
      </div>
    </div>
  );
}

export default Categorias;
