import { beforeEach, describe, expect, it } from "vitest";
import type { Goal } from "../types";
import { loadGoals, saveGoals } from "./goalsStorage";

const goal: Goal = {
  id: "goal-1",
  name: "Criar uma reserva",
  specification: "Guardar R$ 10.000 em uma conta separada",
  deadline: "2099-12-31",
  motivation: "Ter segurança para lidar com imprevistos",
  createdAt: "2026-07-29"
};

describe("persistência de metas", () => {
  beforeEach(() => localStorage.clear());

  it("salva e carrega o envelope versionado", () => {
    saveGoals([goal]);

    expect(loadGoals()).toEqual([goal]);
    expect(JSON.parse(localStorage.getItem("kpi-goals")!).version).toBe(1);
  });

  it("descarta metas inválidas sem perder as válidas", () => {
    localStorage.setItem(
      "kpi-goals",
      JSON.stringify({ version: 1, goals: [{ ...goal, name: " " }, goal] })
    );

    expect(loadGoals()).toEqual([goal]);
  });

  it("ignora JSON corrompido e versões desconhecidas", () => {
    localStorage.setItem("kpi-goals", "{");
    expect(loadGoals()).toEqual([]);

    localStorage.setItem(
      "kpi-goals",
      JSON.stringify({ version: 2, goals: [goal] })
    );
    expect(loadGoals()).toEqual([]);
  });
});
