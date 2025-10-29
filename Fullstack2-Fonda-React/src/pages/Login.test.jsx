import { render, screen, fireEvent } from "@testing-library/react";
import Login from "./Login";
import * as localStorageHelper from "../utils/localstorageHelper";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

describe("Login", () => {
  let alertSpy;
  let saveSpy;
  let loadSpy;
  let removeSpy;

  beforeEach(() => {
    alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    saveSpy = vi.spyOn(localStorageHelper, "saveToLocalstorage");
    loadSpy = vi.spyOn(localStorageHelper, "loadFromLocalstorage");
    removeSpy = vi.spyOn(localStorageHelper, "removeFromLocalstorage");

    loadSpy.mockReset();
    saveSpy.mockReset();
    removeSpy.mockReset();
    alertSpy.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("muestra alerta si correo es inválido", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), {
      target: { value: "correo@invalido.com" },
    });

    fireEvent.change(screen.getByLabelText(/Clave/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Ingresar/i }));

    expect(alertSpy).toHaveBeenCalledWith(
      "Por favor, ingresa un correo válido."
    );
  });

  it("muestra alerta si clave es menor a 6 caracteres", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), {
      target: { value: "usuario@gmail.com" },
    });

    fireEvent.change(screen.getByLabelText(/Clave/i), {
      target: { value: "123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Ingresar/i }));

    expect(alertSpy).toHaveBeenCalledWith(
      "La clave debe tener al menos 6 caracteres."
    );
  });

it("muestra alerta si correo es inválido", () => {
  
  loadSpy.mockImplementation((key) => (key === "token" ? null : []));

  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText(/Correo electrónico/i), {
    target: { value: "correo@invalido.com" },
  });

  fireEvent.change(screen.getByLabelText(/Clave/i), {
    target: { value: "123456" },
  });

  fireEvent.click(screen.getByRole("button", { name: /Ingresar/i }));

  expect(alertSpy).toHaveBeenCalledWith(
    "Por favor, ingresa un correo válido."
  );
});



  it("inicia sesión correctamente con usuario válido", () => {
    const usuario = { correo: "usuario@gmail.com", clave: "123456" };
    loadSpy.mockImplementation((key) =>
      key === "usuarios" ? [usuario] : null
    );

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), {
      target: { value: "usuario@gmail.com" },
    });

    fireEvent.change(screen.getByLabelText(/Clave/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Ingresar/i }));

    expect(alertSpy).toHaveBeenCalledWith(" Sesión iniciada correctamente");
    expect(saveSpy).toHaveBeenCalledWith(expect.stringMatching(/token/), expect.any(String));
    expect(saveSpy).toHaveBeenCalledWith("usuarioLogueado", usuario);
  });

  it("cierra sesión correctamente", () => {
    loadSpy.mockReturnValue("token_simulado"); 

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Cerrar sesión/i }));

    expect(removeSpy).toHaveBeenCalledWith("token");
    expect(removeSpy).toHaveBeenCalledWith("usuarioLogueado");
    expect(alertSpy).toHaveBeenCalledWith("Sesión cerrada");
  });
});
