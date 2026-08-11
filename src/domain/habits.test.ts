import { describe, expect, it } from "vitest";
import { FACTORS } from "../data/factors";
import type { Habit, HabitFactors } from "../types";
import {
  calculateTargetDays,
  completedExecutions,
  consecutiveExecutions,
  consolidateHabit,
  consistency,
  extendHabit,
  opportunityDates,
  projectDays,
  refreshAutomaticity,
  setLog
} from "./habits";

const middle: HabitFactors = {
  complexity: "MEDIUM",
  friction: "MEDIUM",
  contextStability: "MEDIUM",
  competingHabit: "MEDIUM",
  rewardAversion: "MEDIUM"
};

const habit: Habit = {
  id: "1",
  name: "Ler",
  details: "por 20 minutos antes de dormir",
  createdAt: "2026-07-20",
  targetDays: 66,
  factors: middle,
  schedule: {
    weekdays: ["MONDAY", "WEDNESDAY", "FRIDAY"]
  },
  logs: [],
  automaticityStatus: "TRACKING"
};

describe("regras de hábitos", () => {
  it("calcula o Dia-Alvo e rejeita frequências fora do contrato", () => {
    expect(calculateTargetDays(middle, 7)).toBe(76);
    expect(calculateTargetDays({ ...middle, complexity: "LOW" }, 7)).toBe(65);
    expect(calculateTargetDays({ ...middle, rewardAversion: "HIGH" }, 1)).toBe(231);
    expect(() => calculateTargetDays(middle, 0)).toThrow(RangeError);
    expect(() => calculateTargetDays(middle, 8)).toThrow(RangeError);
    expect(() => calculateTargetDays(middle, 2.5)).toThrow(RangeError);
  });

  it("oferece exatamente três níveis para cada fator", () => {
    expect(FACTORS).toHaveLength(5);
    for (const factor of FACTORS) {
      expect(factor.options.map((option) => option.level)).toEqual([
        "LOW",
        "MEDIUM",
        "HIGH"
      ]);
    }
  });

  it("considera a criação como dia 1 e atravessa meses", () => {
    expect(projectDays("2026-07-31", "2026-07-31")).toBe(1);
    expect(projectDays("2026-07-31", "2026-08-02")).toBe(3);
  });

  it("considera somente oportunidades programadas até hoje", () => {
    expect(opportunityDates(habit, "2026-07-26")).toEqual([
      "2026-07-20",
      "2026-07-22",
      "2026-07-24"
    ]);
    expect(
      consistency(
        { ...habit, createdAt: "2026-07-21" },
        "2026-07-21"
      )
    ).toBeNull();
  });

  it("calcula concluídos sobre oportunidades e substitui registros", () => {
    let changed = setLog(habit, "2026-07-20", "COMPLETED");
    changed = setLog(changed, "2026-07-22", "MISSED");
    expect(consistency(changed, "2026-07-24")).toBe(33);
    changed = setLog(changed, "2026-07-22", "COMPLETED");
    expect(changed.logs).toHaveLength(2);
    expect(consistency(changed, "2026-07-24")).toBe(67);
  });

  it("conta somente execuções programadas, únicas e não futuras", () => {
    const withLogs: Habit = {
      ...habit,
      logs: [
        { date: "2026-07-20", status: "COMPLETED" },
        { date: "2026-07-20", status: "COMPLETED" },
        { date: "2026-07-21", status: "COMPLETED" },
        { date: "2026-07-22", status: "MISSED" },
        { date: "2026-07-24", status: "COMPLETED" }
      ]
    };

    expect(completedExecutions(withLogs, "2026-07-22")).toBe(1);
    expect(completedExecutions(withLogs, "2026-07-24")).toBe(2);
  });

  it("calcula a sequência por oportunidades e preserva o dia atual pendente", () => {
    const completed = {
      ...habit,
      logs: [
        { date: "2026-07-20", status: "COMPLETED" as const },
        { date: "2026-07-22", status: "COMPLETED" as const },
        { date: "2026-07-24", status: "COMPLETED" as const }
      ]
    };

    expect(consecutiveExecutions(completed, "2026-07-24")).toBe(3);
    expect(consecutiveExecutions(completed, "2026-07-25")).toBe(3);
    expect(consecutiveExecutions(completed, "2026-07-27")).toBe(3);
    expect(
      consecutiveExecutions(setLog(completed, "2026-07-27", "COMPLETED"), "2026-07-27")
    ).toBe(4);
    expect(
      consecutiveExecutions(setLog(completed, "2026-07-27", "MISSED"), "2026-07-27")
    ).toBe(0);
  });

  it("interrompe a sequência em oportunidade passada ausente ou não concluída", () => {
    const missingMiddle = {
      ...habit,
      logs: [
        { date: "2026-07-20", status: "COMPLETED" as const },
        { date: "2026-07-24", status: "COMPLETED" as const },
        { date: "2026-07-27", status: "COMPLETED" as const }
      ]
    };
    const missedMiddle = setLog(missingMiddle, "2026-07-24", "MISSED");

    expect(consecutiveExecutions(missingMiddle, "2026-07-27")).toBe(2);
    expect(consecutiveExecutions(missedMiddle, "2026-07-27")).toBe(1);
    expect(consecutiveExecutions(habit, "2026-07-19")).toBe(0);
  });

  it("mantém as transições de automaticidade no domínio", () => {
    const ready = refreshAutomaticity(
      { ...habit, targetDays: 3 },
      "2026-07-22"
    );
    expect(ready.automaticityStatus).toBe("READY_FOR_TEST");

    const extended = extendHabit(ready);
    expect(extended.targetDays).toBe(24);
    expect(extended.automaticityStatus).toBe("EXTENDED");
    expect(
      refreshAutomaticity(extended, "2026-08-12").automaticityStatus
    ).toBe("READY_FOR_TEST");

    const consolidated = consolidateHabit(ready);
    expect(
      refreshAutomaticity(consolidated, "2026-08-12").automaticityStatus
    ).toBe("CONSOLIDATED");
  });
});
