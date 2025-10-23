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
          <ul className="navbar-nav">
            <li className="nav-item">
              <a
                className="nav-link"
                data-widget="pushmenu"
                href="#"
                role="button"
                onClick={e => { e.preventDefault(); toggleSidebar(); }}
              >
                <i className="bi bi-list"></i>
              </a>
            </li>
          </ul>
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