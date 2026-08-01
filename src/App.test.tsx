import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "./App";

describe("roteamento", () => {
  afterEach(() => window.history.pushState({}, "", "/"));

  it("exibe uma página explícita para rotas desconhecidas", () => {
    window.history.pushState({}, "", "/endereco-inexistente");

    render(<App />);

    expect(
      screen.getByRole("heading", { name: /página não encontrada/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /voltar ao painel/i })).toHaveAttribute(
      "href",
      "/"
    );
  });
});
