import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HabitsProvider } from "../context/HabitsContext";
import { Dashboard } from "./Dashboard";

vi.stubGlobal("crypto", { randomUUID: () => "new-habit" });

describe("painel", () => {
  beforeEach(() => localStorage.clear());

  it("cria um hábito pelo fluxo completo", async () => {
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
    await user.type(
      screen.getByLabelText(/detalhe do hábito/i),
      "por 20 minutos depois do almoço"
    );
    await user.click(screen.getByRole("button", { name: "Domingo" }));
    await user.click(screen.getByRole("button", { name: "Segunda-feira" }));
    await user.click(screen.getByRole("button", { name: "Terça-feira" }));
    await user.click(screen.getByRole("button", { name: /configurar estimador/i }));
    await user.click(screen.getByRole("button", { name: /salvar hábito/i }));

    expect(screen.getByRole("heading", { name: "Caminhar" })).toBeInTheDocument();
    expect(
      screen.getByText("por 20 minutos depois do almoço")
    ).toBeInTheDocument();
    expect(localStorage.getItem("kpi-habits")).toContain("Caminhar");
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
  });
});
