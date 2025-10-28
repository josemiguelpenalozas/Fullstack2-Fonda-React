import { useNavigate } from "react-router-dom";
function Blog() {
    const navigate = useNavigate();

    const verNoticia = (ruta) => {
    navigate(ruta);
  };



    return(
    <div className="container mt-3 ">
    <div>
        <h1 className="bg-info text-center">Noticias</h1>
    </div>
    <div className="bg-info mb-5">
        <h2 className="text-center">Revisa los nuevos precios de la la fonda ma prendida de chile</h2>
        <p className="text-center">"Ven a nuestra fonda y disfruta del auténtico sabor de las celebraciones chilenas. Música, comida típica y diversión para toda la familia te esperan en un ambiente lleno de tradición y alegría."</p>
        <img src="src/assets/huasos.png" alt="foto_not_1" className="mx-auto d-block m-3"/>
        <button className="btn btn-danger d-grid gap-2 col-6 m-auto" onClick={() => verNoticia("/noticia1")}>Ver noticia</button>
    </div>
        <div className="bg-info">
        <h2 className="text-center">¡Participa en los concursos más divertidos de la fonda más prendida de Chile!</h2>
        <p className="text-center">"Ven a nuestra fonda y disfruta del auténtico sabor de las celebraciones chilenas. Música, comida típica y diversión para toda la familia te esperan en un ambiente lleno de tradición y alegría."</p>
        <img style={{width:"450px"}} className=" d-block mx-auto m-3" src="../src/assets/not.png" alt="foto_not_2" />
        <button className="btn btn-danger d-grid gap-2 col-6 m-auto" onClick={() => verNoticia("/noticia2")}>Ver noticia</button>
    </div>

    </div>
    )
}

export default Blog

  

              