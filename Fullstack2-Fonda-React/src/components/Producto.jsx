import { useNavigate } from "react-router-dom";

function Producto(props){
    const navigate = useNavigate();
    return(
        <div className="card mb-3" style={ {width:"18rem"} }>
            {props.imagen && (
                <img src={props.imagen} alt={props.nombre} className="card-img-top"/>
            )}
            <div className="card-body">
                <h3 className="card-title">{props.nombre}</h3>
                <p className="card-text">{props.categoria}</p>
                <h1 className="card-text">{props.precio}{props.moneda}</h1>
                <div className="d-flex justify-content-around">
                    <button className="btn btn-warning" onClick={() => navigate(`/producto/${props.codigo}`)}>Detalles</button>

                </div>
            </div>
        </div>
    )
}

export default Producto;
