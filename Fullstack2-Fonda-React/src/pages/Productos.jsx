import { useEffect, useState } from "react"
import Producto from "../components/Producto"
import { loadFromLocalstorage } from "../utils/localstorageHelper"

function Productos() {
    const [productos, setProductos] = useState([])


    useEffect(() => {
        const guardadosLocalstorage = loadFromLocalstorage("productos")
        if (guardadosLocalstorage) {
            setProductos(guardadosLocalstorage)
            setCargando(false)
        } else {
            fetch(import.meta.env.BASE_URL + "../data/productos.json")
                .then((res) => res.json())
                .then((data) => {
                    setProductos(data.productos)
                    setTimeout(() => setCargando(false), 2000)
                })
                .catch((ex) => console.error("Error al obtener productos:", ex))
        }
    }, [])


    return (
        <div className='container mt-3'>
            <h1>Productos </h1>
            <div className="container-fluid bg-info min-vh-100 d-flex align-items-center justify-content-center mt-4">
            <div className='row'>
                {productos.map((producto) => (
                    <div className='col-md-4' key={producto.codigo}>
                        <Producto
                            codigo={producto.codigo}
                            categoria={producto.categoria}
                            nombre={producto.nombre}
                            precio={producto.precio}
                            moneda={producto.moneda}
                            imagen={producto.imagen}
                        />
                    </div>
                ))}
            </div>
            </div>
        </div>
    )
}

export default Productos
