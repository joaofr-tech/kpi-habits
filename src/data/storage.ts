import type { Habit } from "../types";

const STORAGE_KEY = "kpi-habits";

function isHabit(value: unknown): value is Habit {
  if (!value || typeof value !== "object") return false;
  const habit = value as Partial<Habit>;
  return (
    typeof habit.id === "string" &&
    typeof habit.name === "string" &&
    typeof habit.createdAt === "string" &&
    typeof habit.targetDays === "number" &&
    !!habit.factors &&
    !!habit.schedule &&
    Array.isArray(habit.schedule.weekdays) &&
    Array.isArray(habit.logs) &&
    typeof habit.automaticityStatus === "string"
  );
}

export function loadHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed !== "object" ||
      (parsed as { version?: unknown }).version !== 1 ||
      !Array.isArray((parsed as { habits?: unknown }).habits)
    ) {
      return [];
    }
    return (parsed as { habits: unknown[] }).habits.filter(isHabit);
  } catch {
    return [];
  }
}

export function saveHabits(habits: Habit[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, habits }));
}
