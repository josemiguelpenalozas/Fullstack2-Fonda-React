import { render, screen } from "@testing-library/react";
import Nosotros from "./Nosotros";

describe("Nosotros Component", () => {
  test("renderiza título, subtítulo, imagen y párrafo", () => {
    render(<Nosotros />);

    // Verificar que el título principal existe
    const titulo = screen.getByRole("heading", { level: 1, name: /nosotros/i });
    expect(titulo).toBeInTheDocument();

    // Verificar subtítulo
    const subtitulo = screen.getByRole("heading", { level: 2, name: /quienes somos/i });
    expect(subtitulo).toBeInTheDocument();

    // Verificar que la imagen se renderiza
    const imagen = screen.getByRole("img", { name: /foto_noticia1/i });
    expect(imagen).toBeInTheDocument();
    expect(imagen).toHaveAttribute("src", "../src/assets/huasos.png");

    // Verificar que el párrafo contiene parte del texto esperado
    const parrafo = screen.getByText(/En nuestra fonda, cada plato, cada detalle/i);
    expect(parrafo).toBeInTheDocument();
  });
});
