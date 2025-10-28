import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

describe("Testing Footer", () => {
  beforeEach(() => {
    render(<Footer />);
  });

  it("FR-Footer1: Muestra el título de bienvenida", () => {
    expect(
      screen.getByText("¡Bienvenido a La Fonda Más Prendida!")
    ).toBeInTheDocument();
  });

  it("FR-Footer2: Muestra el texto de descripción de la experiencia chilena", () => {
    expect(
      screen.getByText(
        /Disfruta de la auténtica experiencia chilena: comida típica, música, juegos y diversión para toda la familia/i
      )
    ).toBeInTheDocument();
  });

  it("FR-Footer3: Muestra el título de Redes y contacto", () => {
    expect(screen.getByText("Redes y contacto")).toBeInTheDocument();
  });

  it("FR-Footer4: Muestra el aviso de redes sociales", () => {
    expect(
      screen.getByText(
        /Próximamente podrás seguirnos en nuestras redes sociales/i
      )
    ).toBeInTheDocument();
  });

  it("FR-Footer5: Muestra los derechos reservados", () => {
    expect(
      screen.getByText(
        /© 2025 Todos los derechos reservados. La Fonda Más Prendida/i
      )
    ).toBeInTheDocument();
  });
});
