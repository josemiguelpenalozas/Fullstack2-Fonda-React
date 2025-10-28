import { Link, useNavigate } from "react-router-dom";
import { loadFromLocalstorage, removeFromLocalstorage } from "../utils/localstorageHelper";

function Navbar() {
  const token = loadFromLocalstorage("token");
  const navigate = useNavigate();

  
  // Función para cerrar sesión
  const cerrarSesion = () => {
    removeFromLocalstorage("token");
    removeFromLocalstorage("usuarioLogueado")
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/"><img style={{ width: "100px", height: "auto" }} src="../src/assets/logo.png" alt="" /></Link>


        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/">Inicio</Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/productos">Productos</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/categorias">Categorias</Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/ofertas">Ofertas</Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/carrito">Carrito</Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/blog">Blog</Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/contacto">Contacto</Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/nosotros">Nosotros</Link>
          </li>

          {/* 🔹 Si NO hay token → Mostrar Login y Registro */}
          {!token && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/registro">Registro</Link>
              </li>
            </>
          )}

          {/* 🔹 Si HAY token → Mostrar botón Cerrar sesión */}
          {token && (
            <li className="nav-item">
              <button
                className="btn btn-link nav-link text-danger"
                onClick={cerrarSesion}
              >
                Cerrar sesión
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
