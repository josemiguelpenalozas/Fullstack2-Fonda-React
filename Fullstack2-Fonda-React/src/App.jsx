import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/dashboard';
import Users from './pages/admin/users';

function App() {
  return (
    <Routes>
      {/* Redirigir / a /admin/dashboard */}
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      
      {/* Todas las rutas admin con prefijo /admin */}
      <Route path="/admin/*" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="usuarios" element={<Users />} />
        <Route path="productos" element={<div className="container-fluid p-4"><h1>Página de Productos - En desarrollo</h1></div>} />
        <Route path="ordenes" element={<div className="container-fluid p-4"><h1>Página de Órdenes - En desarrollo</h1></div>} />
        <Route path="categorias" element={<div className="container-fluid p-4"><h1>Página de Categorías - En desarrollo</h1></div>} />
        <Route path="registro-actividad" element={<div className="container-fluid p-4"><h1>Página de Actividad - En desarrollo</h1></div>} />
      </Route>
    </Routes>
  );
}

export default App;