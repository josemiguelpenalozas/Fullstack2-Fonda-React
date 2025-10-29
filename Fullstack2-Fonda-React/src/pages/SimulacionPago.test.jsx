
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


import SimulacionPago from "./SimulacionPago";

describe("SimulacionPago Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(localStorageHelper, "saveToLocalstorage").mockImplementation(() => {});
    vi.clearAllMocks();
  });

  it("renderiza todos los campos de pago", () => {
    render(
      <MemoryRouter>
        <SimulacionPago />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/Con digito verificador/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Nombre completo/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/XXXX-XXXX-XXXX/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/123/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/MM\/YY/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Confirmar compra/i })).toBeInTheDocument();
  });

  it("permite realizar un pago exitoso y llama a saveToLocalstorage", () => {
    render(
      <MemoryRouter>
        <SimulacionPago />
      </MemoryRouter>
    );

    
    fireEvent.change(screen.getByPlaceholderText(/Con digito verificador/i), { target: { value: "12345678K" } });
    fireEvent.change(screen.getByPlaceholderText(/Nombre completo/i), { target: { value: "Juan Perez" } });
    fireEvent.change(screen.getByPlaceholderText(/XXXX-XXXX-XXXX/i), { target: { value: "1234-5678-9123" } });
    fireEvent.change(screen.getByPlaceholderText(/123/i), { target: { value: "123" } });
    fireEvent.change(screen.getByPlaceholderText(/MM\/YY/i), { target: { value: "12/25" } });

    
    fireEvent.click(screen.getByRole("button", { name: /Confirmar compra/i }));

    expect(localStorageHelper.saveToLocalstorage).toHaveBeenCalledTimes(1);
    expect(localStorageHelper.saveToLocalstorage).toHaveBeenCalledWith("pagos", {
      rut: "12345678K",
      nombre: "Juan Perez",
      numero_tarjeta: "1234-5678-9123",
      CVC: "123",
      fecha: "12/25"
    });

    
    expect(navigateMock).toHaveBeenCalledWith("/Pago_logrado");
  });

  it("redirige a Pago_fallido si la tarjeta es incorrecta", () => {
    render(
      <MemoryRouter>
        <SimulacionPago />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Con digito verificador/i), { target: { value: "12345678K" } });
    fireEvent.change(screen.getByPlaceholderText(/Nombre completo/i), { target: { value: "Juan Perez" } });
    fireEvent.change(screen.getByPlaceholderText(/XXXX-XXXX-XXXX/i), { target: { value: "9999-8888-7777" } });
    fireEvent.change(screen.getByPlaceholderText(/123/i), { target: { value: "123" } });
    fireEvent.change(screen.getByPlaceholderText(/MM\/YY/i), { target: { value: "12/25" } });

    fireEvent.click(screen.getByRole("button", { name: /Confirmar compra/i }));

    expect(localStorageHelper.saveToLocalstorage).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith("/Pago_fallido");
  });
});
