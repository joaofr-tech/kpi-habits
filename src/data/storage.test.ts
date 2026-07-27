import { beforeEach, describe, expect, it } from "vitest";
import type { Habit } from "../types";
import { loadHabits, saveHabits } from "./storage";

const habit: Habit = {
  id: "habit-1",
  name: "Meditar",
  createdAt: "2026-07-26",
  targetDays: 66,
  factors: {
    complexity: "MEDIUM",
    friction: "MEDIUM",
    contextStability: "MEDIUM",
    competingHabit: "MEDIUM",
    rewardAversion: "MEDIUM"
  },
  schedule: { frequencyPerWeek: 1, weekdays: ["SUNDAY"] },
  logs: [],
  automaticityStatus: "TRACKING"
};

describe("persistência", () => {
  beforeEach(() => localStorage.clear());

  it("salva e carrega o envelope versionado", () => {
    saveHabits([habit]);
    expect(loadHabits()).toEqual([habit]);
  });

  it("ignora JSON corrompido e versões desconhecidas", () => {
    localStorage.setItem("kpi-habits", "{");
    expect(loadHabits()).toEqual([]);
    localStorage.setItem("kpi-habits", JSON.stringify({ version: 2, habits: [habit] }));
    expect(loadHabits()).toEqual([]);
  });
});
