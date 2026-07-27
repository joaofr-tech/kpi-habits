import type { Habit } from "../types";

const STORAGE_KEY = "kpi-habits";

type LegacyFactorLevel =
  | "VERY_LOW"
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "VERY_HIGH";

function normalizeLevel(value: unknown): "LOW" | "MEDIUM" | "HIGH" {
  if (value === "VERY_LOW" || value === "LOW") return "LOW";
  if (value === "VERY_HIGH" || value === "HIGH") return "HIGH";
  return "MEDIUM";
}

function normalizeHabit(value: unknown): Habit | null {
  if (!value || typeof value !== "object") return null;
  const habit = value as Partial<Habit> & {
    factors?: Record<string, LegacyFactorLevel>;
  };
  if (
    typeof habit.id !== "string" ||
    typeof habit.name !== "string" ||
    typeof habit.createdAt !== "string" ||
    typeof habit.targetDays !== "number" ||
    !habit.factors ||
    !habit.schedule ||
    !Array.isArray(habit.schedule.weekdays) ||
    !Array.isArray(habit.logs) ||
    typeof habit.automaticityStatus !== "string"
  ) {
    return null;
  }
  return {
    ...habit,
    details: typeof habit.details === "string" ? habit.details : "",
    factors: {
      complexity: normalizeLevel(habit.factors.complexity),
      friction: normalizeLevel(habit.factors.friction),
      contextStability: normalizeLevel(habit.factors.contextStability),
      competingHabit: normalizeLevel(habit.factors.competingHabit),
      rewardAversion: normalizeLevel(habit.factors.rewardAversion)
    },
    schedule: { weekdays: habit.schedule.weekdays },
    logs: habit.logs
  } as Habit;
}

export function loadHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed !== "object" ||
      ![1, 2].includes((parsed as { version?: number }).version ?? 0) ||
      !Array.isArray((parsed as { habits?: unknown }).habits)
    ) {
      return [];
    }
    return (parsed as { habits: unknown[] }).habits
      .map(normalizeHabit)
      .filter((habit): habit is Habit => habit !== null);
  } catch {
    return [];
  }
}

export function saveHabits(habits: Habit[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 2, habits }));
}
