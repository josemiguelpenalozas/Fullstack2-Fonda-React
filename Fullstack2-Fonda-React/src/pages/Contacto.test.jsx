// Contacto.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import Contacto from "./Contacto";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

describe("Contacto Component", () => {
  let alertSpy;

  beforeEach(() => {
    // Mockear alert antes de cada test
    alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    // Restaurar alert para no afectar otros tests
    alertSpy.mockRestore();
  });

  it("renderiza todos los campos y el botón", () => {
    render(<Contacto />);
    
    expect(screen.getByLabelText(/Nombre completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo electronico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contenido/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Enviar/i })).toBeInTheDocument();
  });

  it("envía formulario con correo válido y limpia campos", () => {
    render(<Contacto />);

    fireEvent.change(screen.getByLabelText(/Nombre completo/i), {
      target: { value: "Pedro" }
    });

    fireEvent.change(screen.getByLabelText(/Correo electronico/i), {
      target: { value: "pedro@gmail.com" }
    });
    
    fireEvent.change(screen.getByLabelText(/Contenido/i), {
      target: { value: "Mensaje de prueba" }
    });

    fireEvent.click(screen.getByRole("button", { name: /Enviar/i }));

    expect(alertSpy).toHaveBeenCalledTimes(1);
    expect(alertSpy).toHaveBeenCalledWith(
      "Correo: pedro@gmail.com\nMensaje:Se ha enviado con exito"
    );

    // Campos deben quedar vacíos
    expect(screen.getByLabelText(/Nombre completo/i).value).toBe("");
    expect(screen.getByLabelText(/Correo electronico/i).value).toBe("");
    expect(screen.getByLabelText(/Contenido/i).value).toBe("");
  });
});
