import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Habit } from "../types";
import { triggerHapticFeedback } from "../ui/haptics";
import { AutomaticityDialog } from "./AutomaticityDialog";

vi.mock("../ui/haptics", () => ({ triggerHapticFeedback: vi.fn() }));

const habit: Habit = {
  id: "habit-ready",
  name: "Caminhar",
  details: "por 20 minutos depois do almoço",
  createdAt: "2026-01-01",
  targetDays: 66,
  factors: {
    complexity: "MEDIUM",
    friction: "MEDIUM",
    contextStability: "MEDIUM",
    competingHabit: "MEDIUM",
    rewardAversion: "MEDIUM"
  },
  schedule: { weekdays: ["MONDAY"] },
  logs: [],
  automaticityStatus: "READY_FOR_TEST"
};

describe("teste de automaticidade", () => {
  afterEach(() => vi.mocked(triggerHapticFeedback).mockClear());

  it("exige quatro sinais e a confirmação manual de duas semanas", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onConsolidate = vi.fn();

    render(
      <AutomaticityDialog
        habit={habit}
        onClose={onClose}
        onConsolidate={onConsolidate}
        onExtend={vi.fn()}
      />
    );

    const consolidateButton = screen.getByRole("button", {
      name: /marcar como consolidado/i
    });
    const criteria = screen.getAllByRole("checkbox").slice(0, 4);

    expect(consolidateButton).toBeDisabled();
    expect(triggerHapticFeedback).not.toHaveBeenCalled();
    for (const criterion of criteria) await user.click(criterion);

    expect(screen.getByText("Critério atingido")).toBeInTheDocument();
    expect(consolidateButton).toBeDisabled();

    await user.click(
      screen.getByRole("checkbox", { name: /permaneceu verdadeiro por duas semanas/i })
    );
    expect(consolidateButton).toBeEnabled();

    await user.click(consolidateButton);
    expect(onConsolidate).toHaveBeenCalledWith("habit-ready");
    expect(onClose).toHaveBeenCalledOnce();
    expect(triggerHapticFeedback).toHaveBeenCalledOnce();
  });

  it("emite feedback ao estender o acompanhamento", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onExtend = vi.fn();

    render(
      <AutomaticityDialog
        habit={habit}
        onClose={onClose}
        onConsolidate={vi.fn()}
        onExtend={onExtend}
      />
    );

    await user.click(
      screen.getByRole("button", { name: /estender por 21 dias/i })
    );

    expect(onExtend).toHaveBeenCalledWith("habit-ready");
    expect(onClose).toHaveBeenCalledOnce();
    expect(triggerHapticFeedback).toHaveBeenCalledOnce();
  });
});
