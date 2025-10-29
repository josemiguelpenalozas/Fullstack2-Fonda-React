import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import PagoFallido from "./Pago_fallido";
import { vi } from "vitest";


vi.mock("../utils/localstorageHelper", () => ({
  loadFromLocalstorage: vi.fn(() => ({
    rut: "12.345.678-9",
    nombre: "Juan Pérez",
    numero_tarjeta: "1234 5678 9012 3456",
    fecha: "12/26",
  })),
  removeFromLocalstorage: vi.fn()
}));


vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const navigateMock = vi.fn();

describe("PagoFallido Component", () => {
  beforeEach(() => {
    navigateMock.mockClear();
  });

  test("muestra los datos del pago", () => {
    render(
      <BrowserRouter>
        <PagoFallido />
      </BrowserRouter>
    );

    expect(screen.getByText(/12\.345\.678-9/i)).toBeInTheDocument();
    expect(screen.getByText(/Juan Pérez/i)).toBeInTheDocument();
    expect(screen.getByText(/1234 5678 9012 3456/i)).toBeInTheDocument();
    expect(screen.getByText(/12\/26/i)).toBeInTheDocument();
  });

  test("redirige al hacer clic en 'Salir'", () => {
    render(
      <BrowserRouter>
        <PagoFallido />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Salir/i }));
    expect(navigateMock).toHaveBeenCalledWith("/");
  });
});
