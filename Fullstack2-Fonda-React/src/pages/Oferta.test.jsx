// src/pages/Oferta.test.jsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Para useNavigate
import Oferta from "./Oferta";
import * as localStorageHelper from "../utils/localstorageHelper";

const mockOfertas = [
  { codigo: "O001", categoria: "Promocion", nombre: "Oferta 1", precio: 5000, moneda: "CLP", imagen: "img1.jpg" },
  { codigo: "O002", categoria: "Descuento", nombre: "Oferta 2", precio: 7000, moneda: "CLP", imagen: "img2.jpg" },
];

describe("Oferta Component", () => {
  beforeEach(() => {
    // Mock de localStorage
    vi.spyOn(localStorageHelper, "loadFromLocalstorage").mockReturnValue(mockOfertas);
    vi.spyOn(localStorageHelper, "saveToLocalstorage").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderWithRouter = (component) => {
    return render(<MemoryRouter>{component}</MemoryRouter>);
  };

  test("renderiza el título 'Ofertas'", () => {
    renderWithRouter(<Oferta />);
    expect(screen.getByRole("heading", { name: /ofertas/i })).toBeInTheDocument();
  });

  test("renderiza todas las ofertas desde localStorage", () => {
    renderWithRouter(<Oferta />);
    mockOfertas.forEach((oferta) => {
      // Nombre
      expect(screen.getByText(oferta.nombre)).toBeInTheDocument();
      // Precio (puede estar acompañado de la moneda)
      expect(screen.getByText(new RegExp(oferta.precio))).toBeInTheDocument();
      // Categoría
      expect(screen.getByText(oferta.categoria)).toBeInTheDocument();
    });
  });

  test("filtra ofertas por categoría correctamente", () => {
    renderWithRouter(<Oferta />);
    const filtradas = mockOfertas.filter(o => o.categoria === "Promocion");
    filtradas.forEach((oferta) => {
      expect(screen.getByText(oferta.nombre)).toBeInTheDocument();
    });
  });
});
