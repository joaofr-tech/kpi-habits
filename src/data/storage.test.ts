import { beforeEach, describe, expect, it } from "vitest";
import type { Habit } from "../types";
import { loadHabits, saveHabits } from "./storage";

const habit: Habit = {
  id: "habit-1",
  name: "Meditar",
  details: "por 10 minutos ao acordar",
  createdAt: "2026-07-26",
  targetDays: 66,
  factors: {
    complexity: "MEDIUM",
    friction: "MEDIUM",
    contextStability: "MEDIUM",
    competingHabit: "MEDIUM",
    rewardAversion: "MEDIUM"
  },
  schedule: { weekdays: ["SUNDAY"] },
  logs: [],
  automaticityStatus: "TRACKING"
};

describe("persistência", () => {
  beforeEach(() => localStorage.clear());

  it("salva e carrega o envelope versionado", () => {
    saveHabits([habit]);
    expect(loadHabits()).toEqual([habit]);
    expect(JSON.parse(localStorage.getItem("kpi-habits")!).version).toBe(2);
  });

  it("migra hábitos da versão 1 sem alterar o Dia-Alvo ou os registros", () => {
    const legacyHabit = {
      ...habit,
      details: undefined,
      factors: {
        ...habit.factors,
        complexity: "VERY_LOW",
        rewardAversion: "VERY_HIGH"
      },
      schedule: { frequencyPerWeek: 1, weekdays: ["SUNDAY"] }
    };
    localStorage.setItem(
      "kpi-habits",
      JSON.stringify({ version: 1, habits: [legacyHabit] })
    );

    expect(loadHabits()).toEqual([
      {
        ...habit,
        details: "",
        factors: {
          ...habit.factors,
          complexity: "LOW",
          rewardAversion: "HIGH"
        }
      }
    ]);
  });

  it("isola envelopes, hábitos e registros inválidos", () => {
    localStorage.setItem("kpi-habits", "{");
    expect(loadHabits()).toEqual([]);

    localStorage.setItem("kpi-habits", JSON.stringify({ version: 3, habits: [habit] }));
    expect(loadHabits()).toEqual([]);

    const habitWithInvalidLogs = {
      ...habit,
      logs: [
        { date: "data-inválida", status: "COMPLETED" },
        { date: "2026-07-26", status: "COMPLETED" },
        { date: "2026-07-26", status: "MISSED" }
      ]
    };
    localStorage.setItem(
      "kpi-habits",
      JSON.stringify({
        version: 2,
        habits: [
          { ...habit, schedule: { weekdays: ["FUNDAY"] } },
          habitWithInvalidLogs
        ]
      })
    );

    expect(loadHabits()).toEqual([
      {
        ...habit,
        logs: [{ date: "2026-07-26", status: "MISSED" }]
      }
    ]);
  });
});
