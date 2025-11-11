import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar"; 
import { vi } from "vitest";


vi.mock("../utils/localstorageHelper", () => ({
  loadFromLocalstorage: vi.fn(),
  removeFromLocalstorage: vi.fn(),
  saveToLocalstorage: vi.fn(),
}));


const navigateMock = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

import { loadFromLocalstorage, removeFromLocalstorage } from "../utils/localstorageHelper";

describe("Navbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renderiza correctamente los enlaces principales", () => {
    loadFromLocalstorage.mockReturnValue(null); 

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText("Inicio")).toBeInTheDocument();
    expect(screen.getByText("Productos")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Registro")).toBeInTheDocument();
  });

  test("muestra 'Cerrar sesión' si el usuario tiene token", () => {
    loadFromLocalstorage.mockReturnValue("fake_token");

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText("Cerrar sesión")).toBeInTheDocument();
  });

  test("ejecuta cerrarSesion correctamente al hacer clic", () => {
    loadFromLocalstorage.mockReturnValue("fake_token");

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const boton = screen.getByText("Cerrar sesión");
    fireEvent.click(boton);

    expect(removeFromLocalstorage).toHaveBeenCalledWith("token");
    expect(navigateMock).toHaveBeenCalledWith("/login");
  });

  test("contiene el logo con enlace a inicio", () => {
    loadFromLocalstorage.mockReturnValue(null);

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const logo = screen.getByRole("img");
    expect(logo).toHaveAttribute("src", "/src/assets/admin/logoPNG.png");
  });
});
