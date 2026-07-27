import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { CardLab } from "./CardLab";

describe("laboratório de cards", () => {
  beforeEach(() => localStorage.clear());

  it("compara três hierarquias com os mesmos dados sem persistir nada", () => {
    render(<CardLab />);

    expect(screen.getByText("Compacta estrutural")).toBeInTheDocument();
    expect(screen.getByText("Atual condensada")).toBeInTheDocument();
    expect(screen.getByText("Foco no Dia-Alvo")).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { name: "Caminhar" })).toHaveLength(3);
    expect(screen.getAllByText("caminhar por 5 minutos")).toHaveLength(3);
    expect(screen.getByText("49 dias")).toBeInTheDocument();
    expect(localStorage).toHaveLength(0);
  });
});
