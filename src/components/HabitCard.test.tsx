import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Habit, HabitLogStatus } from "../types";
import { setLog } from "../domain/habits";
import { toLocalDateKey } from "../domain/date";
import { HabitCard } from "./HabitCard";
import { playCompletionSound } from "../ui/completionFeedback";

vi.mock("../ui/completionFeedback", () => ({
  playCompletionSound: vi.fn()
}));

const baseHabit: Habit = {
  id: "habit-1",
  name: "Caminhar",
  details: "por 20 minutos",
  createdAt: toLocalDateKey(),
  targetDays: 66,
  factors: {
    complexity: "MEDIUM",
    friction: "MEDIUM",
    contextStability: "MEDIUM",
    competingHabit: "MEDIUM",
    rewardAversion: "MEDIUM"
  },
  schedule: {
    weekdays: [
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY"
    ]
  },
  logs: [],
  automaticityStatus: "TRACKING"
};

function StatefulCard() {
  const [habit, setHabit] = useState(baseHabit);
  const onLog = (status: HabitLogStatus | null) =>
    setHabit((current) => setLog(current, toLocalDateKey(), status));
  return (
    <HabitCard
      habit={habit}
      onLog={onLog}
      onDelete={() => undefined}
      onTest={() => undefined}
    />
  );
}

describe("card de hábito", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("mostra execuções e consistência abaixo da barra e ordena as ações", () => {
    render(<StatefulCard />);

    const progress = screen.getByRole("progressbar");
    const stats = screen.getByText("0 execuções feitas").parentElement;
    expect(progress.compareDocumentPosition(stats!)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
    expect(stats).toHaveTextContent("0 execuções feitas");
    expect(stats).toHaveTextContent("0% consistência");
    expect(screen.getByText("Execuções").nextElementSibling).toHaveTextContent("0");

    const sequence = screen.getByRole("group", {
      name: "Sequência atual: 0 oportunidades concluídas"
    });
    expect(sequence).not.toHaveClass("active");
    expect(
      screen.getByRole("heading", { name: "Caminhar" }).compareDocumentPosition(sequence)
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);

    const missed = screen.getByRole("button", { name: "Não concluído" });
    const completed = screen.getByRole("button", { name: "Concluído" });
    expect(missed.compareDocumentPosition(completed)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
    expect(completed).toHaveClass("completed-control");
  });

  it("atualiza imediatamente, anuncia e toca somente ao entrar em concluído", async () => {
    const user = userEvent.setup();
    render(<StatefulCard />);

    const completed = screen.getByRole("button", { name: "Concluído" });
    await user.click(completed);
    expect(screen.getByText("1 execução feita")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Caminhar: 1 execução feita. Sequência atual: 1 oportunidade."
      )
    ).toHaveAttribute(
      "aria-live",
      "polite"
    );
    expect(
      screen.getByRole("group", {
        name: "Sequência atual: 1 oportunidade concluída"
      })
    ).toHaveClass("active", "celebrate");
    expect(playCompletionSound).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "Concluído" }));
    expect(screen.getByText("0 execuções feitas")).toBeInTheDocument();
    expect(
      screen.getByRole("group", {
        name: "Sequência atual: 0 oportunidades concluídas"
      })
    ).not.toHaveClass("active");
    expect(playCompletionSound).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "Não concluído" }));
    expect(screen.getByText("Caminhar: sequência atual zerada.")).toHaveAttribute(
      "aria-live",
      "polite"
    );
    expect(playCompletionSound).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole("button", { name: "Concluído" }));
    expect(playCompletionSound).toHaveBeenCalledTimes(2);
  });
});
