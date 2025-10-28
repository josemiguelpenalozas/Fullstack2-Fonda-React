import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Carrito from "./Carrito";
import * as localStorageHelper from "../utils/localstorageHelper";
import { MemoryRouter } from "react-router-dom";

// Mock parcial de react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Testing Carrito", () => {
  const mockToken = "123abc";
  const mockProductos = [
    { nombre: "Zapatos", precio: 4990, cantidad: 2, moneda: "CLP", imagen: "zapatos.jpg" },
    { nombre: "Polera", precio: 14990, cantidad: 1, moneda: "CLP", imagen: "polera.jpg" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage
    vi.spyOn(localStorageHelper, "loadFromLocalstorage").mockImplementation((key) => {
      if (key === "token") return mockToken;
      if (key === "compra") return mockProductos;
      return null;
    });
    vi.spyOn(localStorageHelper, "removeFromLocalstorage").mockImplementation(() => {});
  });

  it("Muestra productos y total correctamente", () => {
    render(
      <MemoryRouter>
        <Carrito />
      </MemoryRouter>
    );

    expect(screen.getByText("Carrito de Compras")).toBeInTheDocument();
    expect(screen.getByText("Zapatos")).toBeInTheDocument();
    expect(screen.getByText("Polera")).toBeInTheDocument();
    expect(screen.getByText("Total: 24.970 CLP")).toBeInTheDocument();

    // Verifica que las imágenes se rendericen
    expect(screen.getByAltText("Zapatos")).toBeInTheDocument();
    expect(screen.getByAltText("Polera")).toBeInTheDocument();
  });

  it("Vaciar carrito limpia los productos y llama a removeFromLocalstorage", () => {
    window.confirm = vi.fn(() => true); // Simula confirm "OK"

    render(
      <MemoryRouter>
        <Carrito />
      </MemoryRouter>
    );

    const btnVaciar = screen.getByText("Vaciar carrito");
    fireEvent.click(btnVaciar);

    expect(localStorageHelper.removeFromLocalstorage).toHaveBeenCalledWith("compra");
    expect(screen.getByText("Tu carrito está vacío 😢")).toBeInTheDocument();
  });

  it("Botón comprar llama a navigate con /SimulacionPago", () => {
    render(
      <MemoryRouter>
        <Carrito />
      </MemoryRouter>
    );

    const btnComprar = screen.getByText("Comprar");
    fireEvent.click(btnComprar);

    expect(mockNavigate).toHaveBeenCalledWith("/SimulacionPago");
  });

  it("Si no hay token muestra mensaje de login y navega a /login", () => {
    vi.spyOn(localStorageHelper, "loadFromLocalstorage").mockImplementation((key) => null);

    render(
      <MemoryRouter>
        <Carrito />
      </MemoryRouter>
    );

    expect(screen.getByText("Debe iniciar sesión para poder ingresar al carrito")).toBeInTheDocument();

    const btnLogin = screen.getByText("Ir a iniciar sesión");
    fireEvent.click(btnLogin);

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
