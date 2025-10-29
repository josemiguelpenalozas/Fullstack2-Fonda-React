import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, vi, beforeEach } from "vitest";
import Producto from "./Producto";
import { MemoryRouter } from "react-router-dom";


const navigateMock = vi.fn();


vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe("Testing Producto", () => {
  const mockProducto = {
    codigo: "001",
    nombre: "Zapatos",
    categoria: "Calzado",
    precio: "49990",
    moneda: "$",
    imagen: "zapatos.jpg",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("PR-Producto1: Muestra correctamente nombre, categoría y precio", () => {
    render(
      <MemoryRouter>
        <Producto {...mockProducto} />
      </MemoryRouter>
    );

    expect(screen.getByText("Zapatos")).toBeInTheDocument();
    expect(screen.getByText("Calzado")).toBeInTheDocument();
    expect(screen.getByText("49990$")).toBeInTheDocument();
  });

  it("PR-Producto2: Muestra la imagen con src y alt correctos", () => {
    render(
      <MemoryRouter>
        <Producto {...mockProducto} />
      </MemoryRouter>
    );

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "zapatos.jpg");
    expect(img).toHaveAttribute("alt", "Zapatos");
  });

  it("PR-Producto3: No renderiza la imagen si no se pasa", () => {
    render(
      <MemoryRouter>
        <Producto {...mockProducto} imagen="" />
      </MemoryRouter>
    );

    const img = screen.queryByRole("img");
    expect(img).not.toBeInTheDocument();
  });

  it("PR-Producto4: Llama a navigate con la ruta correcta al presionar 'Detalles'", () => {
    render(
      <MemoryRouter>
        <Producto {...mockProducto} />
      </MemoryRouter>
    );

    const btnDetalles = screen.getByRole("button", { name: /detalles/i });
    fireEvent.click(btnDetalles);

    expect(navigateMock).toHaveBeenCalledWith("/producto/001");
    expect(navigateMock).toHaveBeenCalledTimes(1);
  });
});
