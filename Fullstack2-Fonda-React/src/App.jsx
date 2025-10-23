import { Routes, Route } from 'react-router-dom';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/dashboard';

function App() {
  return (
    <Routes>
      {/* El dashboard envuelto en el layout al ingresar a / */}
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
      </Route>
      {/* Si tienes más rutas, agrégalas aquí */}
    </Routes>
  );
}
export default App;