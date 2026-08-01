import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HabitsProvider } from "../context/HabitsContext";
import { Dashboard } from "./Dashboard";

describe("painel", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it("avisa quando os hábitos não podem ser persistidos", async () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Quota excedida", "QuotaExceededError");
    });

    render(
      <HabitsProvider>
        <Dashboard />
      </HabitsProvider>
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /não foi possível salvar neste navegador/i
    );
    expect(
      screen.getByRole("heading", { name: /seu primeiro hábito começa/i })
    ).toBeInTheDocument();
  });

  it("exige detalhe e pelo menos um dia sem pedir frequência separada", async () => {
    const user = userEvent.setup();
    render(
      <HabitsProvider>
        <Dashboard />
      </HabitsProvider>
    );

    await user.click(screen.getByRole("button", { name: /criar primeiro hábito/i }));
    await user.type(
      screen.getByLabelText(/qual hábito você quer construir/i),
      "Caminhar"
    );

    expect(
      screen.queryByRole("slider", { name: /frequência semanal/i })
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/menor esforço que você aceita como suficiente/i)
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /configurar estimador/i }));

    expect(
      screen.getByText(/informe um detalhe observável/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/selecione pelo menos um dia/i)).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Selecionar todos" })
    );
    for (const day of [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado"
    ]) {
      expect(screen.getByRole("button", { name: day })).toHaveAttribute(
        "aria-pressed",
        "true"
      );
    }
    expect(screen.getByText("7 vezes por semana.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Limpar seleção" }));
    expect(screen.getByText("Escolha pelo menos um dia.")).toBeInTheDocument();
  });
});
