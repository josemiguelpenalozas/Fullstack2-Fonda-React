import { render, screen } from "@testing-library/react";
import Noticia1 from "./Noticia1";

describe("Noticia1 Component", () => {
  test("renderiza título, imagen, párrafos y listas de productos", () => {
    render(<Noticia1 />);

    
    expect(
      screen.getByRole("heading", { name: /revisa los nuevos precios/i })
    ).toBeInTheDocument();

    
    const imagen = screen.getByRole("img", { name: /foto_not_1/i });
    expect(imagen).toBeInTheDocument();
    expect(imagen).toHaveAttribute("src", "../src/assets/huasos.png");

    
    expect(
      screen.getByText(/¡Atención a todos los fanáticos/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/No pierdas la oportunidad de adquirir/i)
    ).toBeInTheDocument();

    
    expect(screen.getByRole("heading", { name: /merchandising de bandas/i })).toBeInTheDocument();
    expect(screen.getByText(/Polera Banda 'Santaferia' – \$14.990 CLP/i)).toBeInTheDocument();

    expect(screen.getByRole("heading", { name: /vestimenta huasa/i })).toBeInTheDocument();
    expect(screen.getByText(/Poncho Tradicional de Lana – \$39.990 CLP/i)).toBeInTheDocument();

    expect(screen.getByRole("heading", { name: /entradas/i })).toBeInTheDocument();
    expect(screen.getByText(/Entrada VIP – Mesa con Vista al Escenario – \$25.000 CLP/i)).toBeInTheDocument();
  });
});
