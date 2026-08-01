import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GoalsProvider } from "../context/GoalsContext";
import { triggerHapticFeedback } from "../ui/haptics";
import { Goals } from "./Goals";

vi.mock("../ui/haptics", () => ({ triggerHapticFeedback: vi.fn() }));

describe("metas", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => {
    vi.restoreAllMocks();
    vi.mocked(triggerHapticFeedback).mockClear();
  });

  it("avisa quando as metas não podem ser persistidas", async () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Quota excedida", "QuotaExceededError");
    });

    render(
      <GoalsProvider>
        <Goals />
      </GoalsProvider>
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /não foi possível salvar neste navegador/i
    );
    expect(
      screen.getByRole("heading", { name: /uma meta clara transforma/i })
    ).toBeInTheDocument();
  });

  it("valida os quatro campos e rejeita uma data passada", async () => {
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
    await user.type(screen.getByLabelText("Data-limite"), "2000-01-01");
    await user.click(screen.getByRole("button", { name: "Criar meta" }));

    expect(screen.getByText(/informe um nome com até 80/i)).toBeInTheDocument();
    expect(screen.getByText(/informe uma especificação/i)).toBeInTheDocument();
    expect(screen.getByText(/escolha hoje ou uma data futura/i)).toBeInTheDocument();
    expect(screen.getByText(/informe uma motivação/i)).toBeInTheDocument();
    expect(localStorage.getItem("kpi-goals")).not.toContain("2000-01-01");
    expect(triggerHapticFeedback).not.toHaveBeenCalled();

  });

  it("edita preservando a identidade e só exclui após confirmação", async () => {
    const originalGoal = {
      id: "goal-1",
      name: "Criar uma reserva",
      specification: "Guardar R$ 10.000 em uma conta separada",
      deadline: "2099-12-31",
      motivation: "Ter segurança para lidar com imprevistos",
      createdAt: "2026-07-29"
    };
    localStorage.setItem(
      "kpi-goals",
      JSON.stringify({ version: 1, goals: [originalGoal] })
    );
    const user = userEvent.setup();

    render(
      <GoalsProvider>
        <Goals />
      </GoalsProvider>
    );

    await user.click(
      screen.getByRole("button", { name: "Editar Criar uma reserva" })
    );
    expect(triggerHapticFeedback).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Nome")).toHaveValue(originalGoal.name);
    expect(screen.getByLabelText(/^Especificação/)).toHaveValue(
      originalGoal.specification
    );

    await user.clear(screen.getByLabelText("Nome"));
    await user.type(screen.getByLabelText("Nome"), "Criar reserva de emergência");
    await user.clear(screen.getByLabelText(/^Motivação/));
    await user.type(
      screen.getByLabelText(/^Motivação/),
      "Ter tranquilidade diante de imprevistos"
    );
    await user.click(screen.getByRole("button", { name: "Salvar alterações" }));

    expect(
      screen.getByRole("heading", { name: "Criar reserva de emergência" })
    ).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem("kpi-goals")!).goals[0]).toEqual({
      ...originalGoal,
      name: "Criar reserva de emergência",
      motivation: "Ter tranquilidade diante de imprevistos"
    });
    expect(triggerHapticFeedback).toHaveBeenCalledTimes(1);

    const confirm = vi.spyOn(window, "confirm").mockReturnValueOnce(false);
    await user.click(
      screen.getByRole("button", { name: "Excluir Criar reserva de emergência" })
    );
    expect(confirm).toHaveBeenCalledWith(
      "Excluir a meta “Criar reserva de emergência”?"
    );
    expect(
      screen.getByRole("heading", { name: "Criar reserva de emergência" })
    ).toBeInTheDocument();
    expect(triggerHapticFeedback).toHaveBeenCalledTimes(1);

    confirm.mockReturnValueOnce(true);
    await user.click(
      screen.getByRole("button", { name: "Excluir Criar reserva de emergência" })
    );
    expect(
      screen.getByRole("heading", { name: /uma meta clara transforma/i })
    ).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem("kpi-goals")!).goals).toEqual([]);
    expect(triggerHapticFeedback).toHaveBeenCalledTimes(2);
  });
});
