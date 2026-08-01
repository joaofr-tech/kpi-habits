import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import App from "./App";

describe("roteamento", () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.pushState({}, "", "/");
  });
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

  it("navega entre seções e responde ao histórico sem recarregar", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("link", { name: "Metas" }));
    expect(window.location.pathname).toBe("/metas");
    expect(screen.getByRole("link", { name: "Metas" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(
      screen.getByRole("heading", { name: /uma meta clara transforma/i })
    ).toBeInTheDocument();

    act(() => {
      window.history.pushState({}, "", "/");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    expect(screen.getByRole("link", { name: "Hábitos" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(
      screen.getByRole("heading", { name: /seu primeiro hábito começa/i })
    ).toBeInTheDocument();
  });
});
