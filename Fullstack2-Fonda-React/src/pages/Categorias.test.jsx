import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Categorias from "./Categorias";
import { vi } from "vitest";

// Mock de Producto (para no renderizar todo)
vi.mock("../components/Producto", () => ({
  default: ({ nombre }) => <div data-testid="producto">{nombre}</div>,
}));

// Mock localStorage helpers
const mockLoad = vi.fn();
const mockSave = vi.fn();

vi.mock("../utils/localstorageHelper", () => ({
  loadFromLocalstorage: (...args) => mockLoad(...args),
  saveToLocalstorage: (...args) => mockSave(...args),
}));

describe("Categorias.jsx", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("Muestra productos desde localStorage si existen", () => {
    mockLoad.mockReturnValue([
      { codigo: 1, categoria: "Ropa", nombre: "Polera", precio: 1000 },
      { codigo: 2, categoria: "Accesorios", nombre: "Gorro", precio: 2000 },
    ]);

    render(
      <MemoryRouter>
        <Categorias />
      </MemoryRouter>
    );

    expect(screen.getByText("Categorias")).toBeInTheDocument();
    expect(screen.getByText("Polera")).toBeInTheDocument();
    expect(screen.getByText("Gorro")).toBeInTheDocument();
  });

  test("Filtra productos al seleccionar una categoría", () => {
    mockLoad.mockReturnValue([
      { codigo: 1, categoria: "Ropa", nombre: "Polera", precio: 1000 },
      { codigo: 2, categoria: "Ropa", nombre: "Chaqueta", precio: 3000 },
      { codigo: 3, categoria: "Accesorios", nombre: "Gorro", precio: 2000 },
    ]);

    render(
      <MemoryRouter>
        <Categorias />
      </MemoryRouter>
    );

    // Confirmar que los 3 productos se muestran primero
    expect(screen.getByText("Polera")).toBeInTheDocument();
    expect(screen.getByText("Chaqueta")).toBeInTheDocument();
    expect(screen.getByText("Gorro")).toBeInTheDocument();

    // Cambiar categoría a "Ropa"
    const select = screen.getByLabelText("Filtrar por categoría:");
    fireEvent.change(select, { target: { value: "Ropa" } });

    // Ahora solo se deben mostrar productos de ropa
    expect(screen.getByText("Polera")).toBeInTheDocument();
    expect(screen.getByText("Chaqueta")).toBeInTheDocument();

    // Gorro ya NO debe estar
    expect(screen.queryByText("Gorro")).toBeNull();
  });
});
