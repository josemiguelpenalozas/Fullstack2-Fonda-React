import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Productos from "./Productos";
import { vi } from "vitest";


import { loadFromLocalstorage, saveToLocalstorage } from "../utils/localstorageHelper";

vi.mock("../utils/localstorageHelper", () => ({
  loadFromLocalstorage: vi.fn(),
  saveToLocalstorage: vi.fn(),
}));


global.fetch = vi.fn();

describe("Productos Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("muestra productos desde localStorage cuando existen", async () => {
    const mockProductos = [
      { codigo: "P001", categoria: "Bebida", nombre: "Coca-Cola", precio: 1500, moneda: "CLP", imagen: "coca.jpg" },
      { codigo: "P002", categoria: "Comida", nombre: "Empanada", precio: 1200, moneda: "CLP", imagen: "empanada.jpg" },
    ];

    loadFromLocalstorage.mockReturnValue(mockProductos);

    render(
      <BrowserRouter>
        <Productos />
      </BrowserRouter>
    );

    expect(screen.getByText(/Productos/i)).toBeInTheDocument();

    expect(await screen.findByText("Coca-Cola")).toBeInTheDocument();
    expect(await screen.findByText("Empanada")).toBeInTheDocument();
  });

  test("hace fetch si no hay productos en localStorage y los guarda", async () => {
    loadFromLocalstorage.mockReturnValue(null);

    const mockFetchProductos = {
      productos: [
        { codigo: "P003", categoria: "Snack", nombre: "Papas Fritas", precio: 1000, moneda: "CLP", imagen: "papas.jpg" },
      ],
    };

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockFetchProductos),
    });

    render(
      <BrowserRouter>
        <Productos />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Papas Fritas")).toBeInTheDocument();
    });

    expect(saveToLocalstorage).toHaveBeenCalledWith("producto", mockFetchProductos.productos);
  });
});
