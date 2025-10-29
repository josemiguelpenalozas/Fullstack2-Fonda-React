import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Oferta from "./Oferta";


const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"), 
  useNavigate: () => mockNavigate,
}));

describe("Testing Oferta", () => {
  const mockOferta = {
    codigo: "001",
    nombre: "Zapatos",
    categoria: "Calzado",
    precio: "4990",
    moneda: "$",
    imagen: "zapatos.jpg",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("PR-Oferta1: Muestra correctamente nombre, categoría y precio", () => {
    render(<Oferta {...mockOferta} />);
    expect(screen.getByText("Zapatos")).toBeInTheDocument();
    expect(screen.getByText("Calzado")).toBeInTheDocument();

    
    expect(
      screen.getByText(
        (content) => content.includes("4990") && content.includes("$")
      )
    ).toBeInTheDocument();
  });

  it("PR-Oferta2: Muestra la imagen con src y alt correctos", () => {
    render(<Oferta {...mockOferta} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "zapatos.jpg");
    expect(img).toHaveAttribute("alt", "Zapatos");
  });

  it("PR-Oferta3: No renderiza la imagen si no se pasa", () => {
    render(<Oferta {...mockOferta} imagen={""} />);
    const img = screen.queryByRole("img");
    expect(img).not.toBeInTheDocument();
  });

  it("PR-Oferta4: Llama a navigate con la ruta correcta al presionar 'Detalles'", () => {
    render(<Oferta {...mockOferta} />);
    const btnDetalles = screen.getByRole("button", { name: /detalles/i });
    fireEvent.click(btnDetalles);
    expect(mockNavigate).toHaveBeenCalledWith("/oferta/001");
  });
});
