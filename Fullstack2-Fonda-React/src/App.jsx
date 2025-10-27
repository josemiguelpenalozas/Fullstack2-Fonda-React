import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/dashboard';
import Users from './pages/admin/users';
import Productos from './pages/admin/productos';
import Actividad from './pages/admin/Actividad';
import Ordenes from './pages/admin/Ordenes';
import Categorias from './pages/admin/Categorias';

function App() {
  return (
    <Routes>
      {/* Redirigir / a /admin/dashboard */}
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      
      {/* Todas las rutas admin con prefijo /admin */}
      <Route path="/admin/*" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="usuarios" element={<Users />} />
        <Route path="productos" element={<Productos />} />
        <Route path="categorias" element={<Categorias />} />
        <Route path="ordenes" element={<Ordenes/>} />
        <Route path="registro-actividad" element={<Actividad/>} />
      </Route>
    </Routes>
  );
}

export default App;