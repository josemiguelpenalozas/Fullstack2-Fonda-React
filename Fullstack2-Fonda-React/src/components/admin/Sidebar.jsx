import { NavLink } from 'react-router-dom'
import '../../assets/admin/estilosAdmin.css';

const Sidebar = ({ collapsed }) => {
  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <a href="#" className="brand-link">
        <img src="https://media.magflags.net/media/catalog/product/cache/78ead0662930e105a85d1fa3f0325792/C/L/CL.png_100.png" className="brand-image" alt="Logo" />
        <span className="brand-text font-weight-light">Fonda Duoc</span>
      </a>

      <div className="user-panel mt-3 pb-3 mb-3 d-flex">
        <div className="image">
          <img src="https://pbs.twimg.com/profile_images/378800000162907418/3227125f0f2eade72449e2204da234d4_200x200.jpeg" className="img-circle elevation-2" alt="User" />
        </div>
        <div className="info">
          <a href="#" className="d-block">Huaso Arellano</a>
        </div>
      </div>

      <div className="form-inline">
        <div className="input-group" data-widget="sidebar-search">
          <input className="form-control form-control-sidebar" type="search" placeholder="Buscar" aria-label="Buscar" />
          <div className="input-group-append">
            <button className="btn btn-sidebar">
              <i className="bi bi-search"></i>
            </button>
          </div>
        </div>
      </div>

      <nav className="mt-2">
        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu">
          <li className="nav-item">
            <NavLink to="/admin/dashboard" className="nav-link">
              <i className="bi bi-house-door-fill nav-icon"></i>
              <p>Dashboard</p>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/admin/productos" className="nav-link">
              <i className="bi bi-box-seam nav-icon"></i>
              <p>Productos</p>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/admin/usuarios" className="nav-link">
              <i className="bi bi-people-fill nav-icon"></i>
              <p>Usuarios</p>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/admin/ordenes" className="nav-link">
              <i className="bi bi-receipt-cutoff nav-icon"></i>
              <p>Órdenes/Boletas</p>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/admin/categorias" className="nav-link">
              <i className="bi bi-tag-fill nav-icon"></i>
              <p>Categorías</p>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/admin/notificaciones" className="nav-link">
              <i className="bi bi-bell-fill nav-icon"></i>
              <p>Notificaciones</p>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/admin/registro-actividad" className="nav-link">
              <i className="bi bi-clock-history nav-icon"></i>
              <p>Actividad</p>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/admin/chat-soporte" className="nav-link">
              <i className="bi bi-chat-dots-fill nav-icon"></i>
              <p>Chat Soporte</p>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/admin/perfil" className="nav-link">
              <i className="bi bi-person-circle nav-icon"></i>
              <p>Mi Perfil</p>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;