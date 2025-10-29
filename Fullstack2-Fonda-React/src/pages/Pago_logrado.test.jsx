import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import PagoLogrado from "./Pago_logrado";
import { vi } from "vitest";


import { loadFromLocalstorage, removeFromLocalstorage } from "../utils/localstorageHelper";

vi.mock("../utils/localstorageHelper", () => ({
  loadFromLocalstorage: vi.fn(() => ({
    rut: "11.111.111-1",
    nombre: "Pedro González",
    numero_tarjeta: "9999 8888 7777 6666",
    fecha: "08/28",
  })),
  removeFromLocalstorage: vi.fn(),
}));


const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe("PagoLogrado Component", () => {
  beforeEach(() => {
    navigateMock.mockClear();
    removeFromLocalstorage.mockClear();
  });

  test("muestra los datos del pago correctamente", () => {
    render(
      <BrowserRouter>
        <PagoLogrado />
      </BrowserRouter>
    );

    expect(screen.getByText(/11\.111\.111-1/i)).toBeInTheDocument();
    expect(screen.getByText(/Pedro González/i)).toBeInTheDocument();
    expect(screen.getByText(/9999 8888 7777 6666/i)).toBeInTheDocument();
    expect(screen.getByText(/08\/28/i)).toBeInTheDocument();
    expect(screen.getByText(/El pago se logro realizar/i)).toBeInTheDocument();
  });

  test("el botón 'Salir' elimina datos y redirige al home", () => {
    render(
      <BrowserRouter>
        <PagoLogrado />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Salir/i }));

    expect(removeFromLocalstorage).toHaveBeenCalledWith("pagos");
    expect(removeFromLocalstorage).toHaveBeenCalledWith("compra");
    expect(navigateMock).toHaveBeenCalledWith("/");
  });
});
