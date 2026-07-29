import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GoalsProvider } from "../context/GoalsContext";
import { Goals } from "./Goals";

vi.stubGlobal("crypto", { randomUUID: () => "new-goal" });

describe("metas", () => {
  beforeEach(() => localStorage.clear());

  it("cria e persiste uma meta pelo modal", async () => {
    const user = userEvent.setup();
    render(
      <GoalsProvider>
        <Goals />
      </GoalsProvider>
    );

    expect(screen.getByRole("link", { name: "Metas" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    await user.click(screen.getByRole("button", { name: /criar primeira meta/i }));
    await user.type(screen.getByLabelText("Nome"), "Criar uma reserva");
    await user.type(
      screen.getByLabelText(/^Especificação/),
      "Guardar R$ 10.000 em uma conta separada"
    );
    await user.type(screen.getByLabelText("Data-limite"), "2099-12-31");
    await user.type(
      screen.getByLabelText(/^Motivação/),
      "Ter segurança para lidar com imprevistos"
    );
    await user.click(screen.getByRole("button", { name: "Criar meta" }));

    expect(
      screen.getByRole("heading", { name: "Criar uma reserva" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Guardar R$ 10.000 em uma conta separada")
    ).toBeInTheDocument();
    expect(localStorage.getItem("kpi-goals")).toContain("Criar uma reserva");
  });

  it("valida os quatro campos e rejeita uma data passada", async () => {
    const user = userEvent.setup();
    render(
      <GoalsProvider>
        <Goals />
      </GoalsProvider>
    );

    await user.click(screen.getByRole("button", { name: /criar primeira meta/i }));
    await user.type(screen.getByLabelText("Data-limite"), "2000-01-01");
    await user.click(screen.getByRole("button", { name: "Criar meta" }));

    expect(screen.getByText(/informe um nome com até 80/i)).toBeInTheDocument();
    expect(screen.getByText(/informe uma especificação/i)).toBeInTheDocument();
    expect(screen.getByText(/escolha hoje ou uma data futura/i)).toBeInTheDocument();
    expect(screen.getByText(/informe uma motivação/i)).toBeInTheDocument();
    expect(localStorage.getItem("kpi-goals")).not.toContain("2000-01-01");
  });
});
