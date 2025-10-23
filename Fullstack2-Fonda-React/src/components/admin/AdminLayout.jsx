// src/components/admin/AdminLayout.jsx
import Sidebar from './Sidebar';
import { useState } from 'react';

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <div className="admin-layout d-flex">
      {/* Barra lateral */}
      <Sidebar collapsed={collapsed} />
      {/* Contenedor principal: NAV arriba y espacio para las paginas */}
      <div className={`flex-grow-1 main-content d-flex flex-column ${collapsed ? 'collapsed' : ''}`} style={{ minHeight: '100vh' }}>
        {/* Navbar superior */}
        <nav className={`main-header navbar navbar-expand navbar-white navbar-light ${collapsed ? 'collapsed' : ''}`}>
          <div className="container-fluid d-flex align-items-center">
            {/* Bloque izquierdo: hamburguesa, logo y saludo */}
            <div className="d-flex align-items-center">
              {/* Botón hamburguesa */}
              <a
                className="nav-link"
                data-widget="pushmenu"
                href="#"
                role="button"
                onClick={e => { e.preventDefault(); toggleSidebar(); }}
                style={{ paddingRight: '0.6rem' }}
              >
                <i className="bi bi-list" style={{ fontSize: '2.1em' }}></i>
              </a>
              {/* Logo */}
              <img
                src="https://www.chilevision.cl/chilevision/site/artic/20230109/imag/foto_0000000220230109112259.jpg"
                alt="Logo Fonda Duoc"
                style={{ width: '80px', height: '50px', marginLeft: '0.5rem', marginRight: '0.8rem', objectFit: 'contain', borderRadius: '50px' }}
              />
              {/* Saludo animado */}
              <span style={{
                fontWeight: 900,
                fontSize: '1.25rem',
                fontFamily: "'Montserrat', sans-serif",
                color: '#d32f2f',
                letterSpacing: '1.5px'
              }}>
                👋 ¡Buenos días, pariente <span style={{ color: '#0D47A1' }}>Arellano</span>! 🎉
              </span>
            </div>
            {/* Bloque derecho: notificación y usuario */}
            <div className="d-flex align-items-center ms-auto">
              <a className="nav-link" href="#" style={{ padding: '0 0.8rem' }}>
                <i className="bi bi-bell-fill" style={{ fontSize: '2em', color: "#007bff" }}></i>
              </a>
              <a className="nav-link" href="#" style={{ padding: '0 0.8rem' }}>
                <i className="bi bi-person-circle" style={{ fontSize: '2.1em', color: "#374850" }}></i>
              </a>
            </div>
          </div>
        </nav>
        {/* Espacio para las paginas */}
        <div className="flex-grow-1 p-3" style={{ minHeight: 0 }}>
          <h2>Panel Admin (espacio vacío)</h2>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;