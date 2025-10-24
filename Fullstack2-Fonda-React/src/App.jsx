import { Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './pages/Navbar'
import Home from './pages/Home'
import Productos from './pages/Productos'
import Blog from './pages/Blog'
import Login from './pages/Login'
import Registro from './pages/Registro'



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
          {/* <Route path='/ofertas' element={<Oferta/>}></Route> */}
          {/* <Route path='/carrito' element={<Carrito/>}></Route> */}
          {<Route path='/blog' element={<Blog/>}></Route>}
          {/* <Route path='/contacto' element={<Contacto/>}></Route> */}
          {/* <Route path='/nosotros' element={<Nosotros/>}></Route> */}
        </Routes>
      </div>
    </>
  )
}

export default App