import { render, screen } from "@testing-library/react";
import Noticia2 from "./Noticia2";

describe("Noticia2 Component", () => {
  test("renderiza título, imagen, párrafos y horarios de actividades", () => {
    render(<Noticia2 />);

    // Verificar título principal
    expect(
      screen.getByRole("heading", {
        name: /¡participa en los concursos más divertidos/i,
      })
    ).toBeInTheDocument();

    // Verificar imagen (aunque no tenga alt)
    const imagen = screen.getByRole("img", { name: /foto_not_2/i });
    expect(imagen).toBeInTheDocument();
    expect(imagen).toHaveAttribute("src", "../src/assets/not.png");

    // Verificar párrafos importantes
    expect(
      screen.getByText(/Este año, nuestra fonda no solo te trae música/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Ven, participa y vive la verdadera experiencia/i)
    ).toBeInTheDocument();

    // Verificar horarios (algunos ítems)
    expect(screen.getByRole("heading", { name: /horarios de las actividades/i })).toBeInTheDocument();
    expect(screen.getByText(/Apertura de la fonda: 10:00 AM/i)).toBeInTheDocument();
    expect(screen.getByText(/Premiación y cierre: 7:00 PM/i)).toBeInTheDocument();
  });
});
