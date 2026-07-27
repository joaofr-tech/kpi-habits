import { describe, expect, it } from "vitest";
import type { Habit, HabitFactors } from "../types";
import {
  calculateTargetDays,
  consistency,
  opportunityDates,
  projectDays,
  setLog
} from "./habits";

const neutral: HabitFactors = {
  complexity: "MEDIUM",
  friction: "MEDIUM",
  contextStability: "MEDIUM",
  competingHabit: "LOW",
  rewardAversion: "MEDIUM"
};

const habit: Habit = {
  id: "1",
  name: "Ler",
  createdAt: "2026-07-20",
  targetDays: 66,
  factors: neutral,
  schedule: {
    frequencyPerWeek: 3,
    weekdays: ["MONDAY", "WEDNESDAY", "FRIDAY"]
  },
  logs: [],
  automaticityStatus: "TRACKING"
};

describe("regras de hábitos", () => {
  it("calcula 66 dias para fatores médios e frequência diária", () => {
    expect(calculateTargetDays(neutral, 7)).toBe(66);
  });

  it("usa multiplicadores e arredondamento da especificação", () => {
    expect(calculateTargetDays({ ...neutral, complexity: "VERY_LOW" }, 7)).toBe(46);
    expect(calculateTargetDays({ ...neutral, rewardAversion: "VERY_HIGH" }, 1)).toBe(227);
  });

  it("considera a criação como dia 1 e atravessa meses", () => {
    expect(projectDays("2026-07-31", "2026-07-31")).toBe(1);
    expect(projectDays("2026-07-31", "2026-08-02")).toBe(3);
  });

  it("gera somente oportunidades programadas até hoje", () => {
    expect(opportunityDates(habit, "2026-07-26")).toEqual([
      "2026-07-20",
      "2026-07-22",
      "2026-07-24"
    ]);
  });

  it("exibe ausência de consistência sem oportunidades", () => {
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
});
