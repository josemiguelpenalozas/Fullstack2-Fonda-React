import React from "react";

function Footer() {
  return (
    <footer className="bg-dark text-light mt-5 pt-4 pb-3">
      <div className="container text-center">
        {/* Sección bienvenida */}
        <div className="mb-3">
          <h5>¡Bienvenido a La Fonda Más Prendida!</h5>
          <p>
            Disfruta de la auténtica experiencia chilena: comida típica, música,
            juegos y diversión para toda la familia. Ven a celebrar con nosotros
            y vive momentos inolvidables.
          </p>
        </div>

        {/* Redes sociales / contacto */}
        <div className="mb-3">
          <h5>Redes y contacto</h5>
          <p>Próximamente podrás seguirnos en nuestras redes sociales</p>
        </div>

        {/* Derechos */}
        <div>
          <p>&copy; 2025 Todos los derechos reservados. La Fonda Más Prendida</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
