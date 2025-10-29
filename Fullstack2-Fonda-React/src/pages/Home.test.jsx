import { render, screen } from "@testing-library/react";
import Home from "./Home";

describe("Home", () => {
  it("muestra el título principal", () => {
    render(<Home />);
    const titulo = screen.getByRole("heading", {
      name: /Bienvenido a la mas mejor fonda de Chile/i,
    });
    expect(titulo).toBeInTheDocument();
  });

  it("muestra los párrafos de bienvenida", () => {
    render(<Home />);
    expect(
      screen.getByText(/Fonda SQL -- No importa si es after o before, tomamos hasta olvidar la llae/i)
    ).toBeInTheDocument();
  });

  it("muestra la imagen decorativa con el src correcto", () => {
    render(<Home />);
    const imagen = screen.getByRole("img", { name: /Decoración fonda/i });
    expect(imagen).toBeInTheDocument();
    expect(imagen).toHaveAttribute("src", "../src/assets/not.png");
  });
});
