
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, vi, beforeEach, afterEach, expect } from "vitest";
import * as localStorageHelper from "../utils/localstorageHelper";
import { MemoryRouter } from "react-router-dom";


const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});


import Registro from "./Registro";

describe("Registro Component", () => {
  beforeEach(() => {
    
    vi.restoreAllMocks();

    
    vi.spyOn(localStorageHelper, "loadFromLocalstorage").mockReturnValue([]);
    vi.spyOn(localStorageHelper, "saveToLocalstorage").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza todos los campos de registro", () => {
    render(
      <MemoryRouter>
        <Registro />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/RUT/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirmar correo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Clave:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirmar clave/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Teléfono/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Registrar/i })).toBeInTheDocument();
  });

  it("permite registrar un usuario correctamente", () => {
    render(
      <MemoryRouter>
        <Registro />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/RUT/i), { target: { value: "12345678K" } });
    fireEvent.change(screen.getByLabelText(/Nombre completo/i), { target: { value: "Juan Perez" } });
    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: "test@gmail.com" } });
    fireEvent.change(screen.getByLabelText(/Confirmar correo/i), { target: { value: "test@gmail.com" } });
    fireEvent.change(screen.getByLabelText(/^Clave:/i), { target: { value: "Abcd1234!" } });
    fireEvent.change(screen.getByLabelText(/Confirmar clave/i), { target: { value: "Abcd1234!" } });
    fireEvent.change(screen.getByLabelText(/Teléfono/i), { target: { value: "98765432" } });

    fireEvent.click(screen.getByRole("button", { name: /Registrar/i }));

    expect(localStorageHelper.saveToLocalstorage).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith("/Login");
  });
});
