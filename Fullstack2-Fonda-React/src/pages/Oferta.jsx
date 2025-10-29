import { useEffect, useState } from "react";
import Oferta from "../components/Oferta"; 
import { loadFromLocalstorage, saveToLocalstorage } from "../utils/localstorageHelper";
import { useNavigate } from "react-router-dom";

function Ofertas() { 
  const [ofertas, setOfertas] = useState([]); 
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");
  const navigate = useNavigate();

  useEffect(() => {
    const guardadosLocalstorage = loadFromLocalstorage("ofertas"); 
    if (guardadosLocalstorage) {
      setOfertas(guardadosLocalstorage);
    } else {
      fetch(import.meta.env.BASE_URL + "../data/ofertas.json")
        .then((res) => res.json())
        .then((data) => {
          setOfertas(data.ofertas);
          saveToLocalstorage("ofertas", data.ofertas);
        })
        .catch((ex) => console.error("Error al obtener ofertas:", ex));
    }
  }, []);

  return (
    <div className="container mt-3">
      <div className="container-fluid bg-info min-vh-100 d-flex align-items-center justify-content-center mt-4">
        <div className="row">
          <h1 className="text-center mt-5 mb-5">Ofertas</h1>
          {ofertas
            .filter(
              (p) =>
                categoriaSeleccionada === "Todas" ||
                p.categoria === categoriaSeleccionada
            )
            .map((oferta) => (
              <div className="col" key={oferta.codigo}>
                <Oferta
                  codigo={oferta.codigo}
                  categoria={oferta.categoria}
                  nombre={oferta.nombre}
                  precio={oferta.precio}
                  moneda={oferta.moneda}
                  imagen={oferta.imagen}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Ofertas;
