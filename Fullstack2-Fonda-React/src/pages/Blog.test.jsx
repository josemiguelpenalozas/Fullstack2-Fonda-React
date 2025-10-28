import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Blog from "./Blog";

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

describe("Testing Blog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    render(<Blog />);
  });

  it("Blog1: Muestra correctamente el título principal", () => {
    expect(screen.getByText("Noticias")).toBeInTheDocument();
  });

  it("Blog2: Muestra la primera noticia con título y párrafo", () => {
    expect(
      screen.getByText(
        /Revisa los nuevos precios de la la fonda ma prendida de chile/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(
        /Ven a nuestra fonda y disfruta del auténtico sabor de las celebraciones chilenas/i
      )[0]
    ).toBeInTheDocument();
  });

  it("Blog3: Muestra la segunda noticia con título y párrafo", () => {
    expect(
      screen.getByText(
        /¡Participa en los concursos más divertidos de la fonda más prendida de Chile!/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(
        /Ven a nuestra fonda y disfruta del auténtico sabor de las celebraciones chilenas/i
      )[1]
    ).toBeInTheDocument();
  });

  it("Blog4: Muestra las imágenes con src correctos", () => {
    const imgs = screen.getAllByRole("img");
    expect(imgs[0]).toHaveAttribute("src", "src/assets/huasos.png");
    expect(imgs[1]).toHaveAttribute("src", "../src/assets/not.png");
  });

  it("Blog5: Botón 'Ver noticia' de la primera noticia llama a navigate con /noticia1", () => {
    const btn1 = screen.getAllByRole("button", { name: /ver noticia/i })[0];
    fireEvent.click(btn1);
    expect(mockNavigate).toHaveBeenCalledWith("/noticia1");
  });

  it("Blog6: Botón 'Ver noticia' de la segunda noticia llama a navigate con /noticia2", () => {
    const btn2 = screen.getAllByRole("button", { name: /ver noticia/i })[1];
    fireEvent.click(btn2);
    expect(mockNavigate).toHaveBeenCalledWith("/noticia2");
  });
});
