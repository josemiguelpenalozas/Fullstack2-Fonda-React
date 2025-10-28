import { Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './pages/Navbar'
import Footer from './components/footer'
import Home from './pages/Home'
import Productos from './pages/Productos'
import Blog from './pages/Blog'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Contacto from './pages/Contacto'
import Nosotros from './pages/Nosotros'
import Noticia1 from './pages/Noticia1'
import Noticia2 from './pages/Noticia2'
import { loadFromLocalstorage } from "./utils/localstorageHelper.js";
import DetalleProducto from './pages/DetalleProducto';
import Carrito from './pages/Carrito.jsx'
import SimulacionPago from './pages/SimulacionPago.jsx'
import Categorias from './pages/Categorias.jsx'
import PagoLogrado from './pages/Pago_logrado.jsx'
import PagoFallido from './pages/Pago_fallido.jsx'
import Oferta from './pages/Oferta.jsx'
import DetalleOferta from './pages/DetalleOferta.jsx'


const token = loadFromLocalstorage("token");

function App() {
  return (
    <>
      <Navbar/>
      <div className='container mt-4'>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/productos' element={<Productos/>}></Route>
          {<Route path='/login' element={<Login/>}></Route> }
          {<Route path='/registro' element={<Registro/>}></Route>}
          {<Route path='/categorias' element={<Categorias/>}></Route>}
          {<Route path='/pago_logrado' element={<PagoLogrado/>}></Route>}
          {<Route path='/Pago_fallido' element={<PagoFallido/>}></Route>}
          {<Route path='/ofertas' element={<Oferta/>}></Route>}
          <Route path='/oferta/:codigo' element={<DetalleOferta/>} />
          {<Route path='/carrito' element={<Carrito/>}></Route>}
          {<Route path="/SimulacionPago" element={< SimulacionPago/>} />}
          {<Route path='/blog' element={<Blog/>}></Route>}
          {<Route path="/noticia1" element={<Noticia1 />} />}
          {<Route path="/noticia2" element={<Noticia2 />} />}
          {<Route path='/contacto' element={<Contacto/>}></Route>}
          {<Route path='/nosotros' element={<Nosotros/>}></Route>}
          <Route path='/producto/:codigo' element={<DetalleProducto />} />
        </Routes>
      </div>
    <Footer></Footer>
    </>
  )
}

export default App
