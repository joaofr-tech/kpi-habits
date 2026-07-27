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
    await user.click(screen.getByRole("button", { name: "Domingo" }));
    await user.click(screen.getByRole("button", { name: "Segunda-feira" }));
    await user.click(screen.getByRole("button", { name: "Terça-feira" }));
    await user.click(screen.getByRole("button", { name: /configurar estimador/i }));
    await user.click(screen.getByRole("button", { name: /usar esta estimativa/i }));
    await user.click(screen.getByRole("button", { name: /salvar hábito/i }));

    expect(screen.getByRole("heading", { name: "Caminhar" })).toBeInTheDocument();
    expect(localStorage.getItem("kpi-habits")).toContain("Caminhar");
  });
});
