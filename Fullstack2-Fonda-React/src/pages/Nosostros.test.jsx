import { render, screen } from "@testing-library/react";
import Nosotros from "./Nosotros";

describe("Nosotros Component", () => {
  test("renderiza título, subtítulo, imagen y párrafo", () => {
    render(<Nosotros />);

    
    const titulo = screen.getByRole("heading", { level: 1, name: /nosotros/i });
    expect(titulo).toBeInTheDocument();

    
    const subtitulo = screen.getByRole("heading", { level: 2, name: /quienes somos/i });
    expect(subtitulo).toBeInTheDocument();

    
    const imagen = screen.getByRole("img", { name: /foto_noticia1/i });
    expect(imagen).toBeInTheDocument();
    expect(imagen).toHaveAttribute("src", "../src/assets/huasos.png");

    
    const parrafo = screen.getByText(/En nuestra fonda, cada plato, cada detalle/i);
    expect(parrafo).toBeInTheDocument();
  });
});
