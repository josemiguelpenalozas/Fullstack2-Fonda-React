import { render, screen, fireEvent, within } from "@testing-library/react";
import DetalleOferta from "./DetalleOferta";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import * as localStorageHelper from "../utils/localstorageHelper";

describe("DetalleOferta", () => {
  const ofertaMock = {
    codigo: "OF001",
    nombre: "Oferta Especial",
    categoria: "Promocion",
    precio: 5000,
    moneda: "CLP",
    detalles: "Esta es una oferta especial",
    imagen: "img/oferta.jpg",
  };

  beforeEach(() => {
    
    vi.clearAllMocks();
    localStorage.clear();

    
    vi.spyOn(localStorageHelper, "loadFromLocalstorage").mockImplementation((key) => {
      if (key === "ofertas") return [ofertaMock];
      if (key === "compra") return [];
      return null;
    });

    
    vi.spyOn(localStorageHelper, "saveToLocalstorage").mockImplementation(() => {});

    
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  it("muestra la información de la oferta", () => {
    render(
      <MemoryRouter initialEntries={["/detalle/OF001"]}>
        <Routes>
          <Route path="/detalle/:codigo" element={<DetalleOferta />} />
        </Routes>
      </MemoryRouter>
    );

    
    expect(screen.getByRole("heading", { name: /Oferta Especial/i })).toBeInTheDocument();

    
    
 
const precioParagraph = screen.getByText("Precio:", { selector: "strong" }).parentElement;


expect(within(precioParagraph).getByText((content, node) => {
  return content.includes("5000") && node.textContent.includes("CLP");
})).toBeInTheDocument();

    
    const detallesParagraph = screen.getByText("Detalle:", { selector: "strong" }).parentElement;
    expect(within(detallesParagraph).getByText("Esta es una oferta especial")).toBeInTheDocument();

    
    expect(screen.getByAltText("Oferta Especial")).toBeInTheDocument();
  });

  it("añade la oferta al carrito y muestra alerta", () => {
    render(
      <MemoryRouter initialEntries={["/detalle/OF001"]}>
        <Routes>
          <Route path="/detalle/:codigo" element={<DetalleOferta />} />
        </Routes>
      </MemoryRouter>
    );

    const boton = screen.getByRole("button", { name: /Añadir al carrito/i });
    fireEvent.click(boton);

    
    expect(window.alert).toHaveBeenCalledWith("Oferta Especial fue añadida al carrito");

    
    expect(localStorageHelper.saveToLocalstorage).toHaveBeenCalledWith("compra", [
      { ...ofertaMock, cantidad: 1 },
    ]);
  });

  it("muestra mensaje si la oferta no existe", () => {
    
    localStorageHelper.loadFromLocalstorage.mockImplementation(() => []);

    render(
      <MemoryRouter initialEntries={["/detalle/OF999"]}>
        <Routes>
          <Route path="/detalle/:codigo" element={<DetalleOferta />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Oferta no encontrada/i)).toBeInTheDocument();
  });
});
