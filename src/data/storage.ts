import { isLocalDateKey } from "../domain/date";
import type {
  Habit,
  HabitFactors,
  HabitFactorLevel,
  HabitLog,
  HabitLogStatus,
  Weekday
} from "../types";

const STORAGE_KEY = "habitus-habits";
const LEGACY_STORAGE_KEY = "kpi-habits";

const WEEKDAYS = new Set<Weekday>([
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY"
]);
const LOG_STATUSES = new Set<HabitLogStatus>(["COMPLETED", "MISSED"]);
const AUTOMATICITY_STATUSES = new Set<Habit["automaticityStatus"]>([
  "TRACKING",
  "READY_FOR_TEST",
  "CONSOLIDATED",
  "EXTENDED"
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeLevel(value: unknown): HabitFactorLevel | null {
  if (value === "VERY_LOW" || value === "LOW") return "LOW";
  if (value === "VERY_HIGH" || value === "HIGH") return "HIGH";
  if (value === "MEDIUM") return "MEDIUM";
  return null;
}

function normalizeFactors(value: unknown): HabitFactors | null {
  if (!isRecord(value)) return null;

  const complexity = normalizeLevel(value.complexity);
  const friction = normalizeLevel(value.friction);
  const contextStability = normalizeLevel(value.contextStability);
  const competingHabit = normalizeLevel(value.competingHabit);
  const rewardAversion = normalizeLevel(value.rewardAversion);
  if (
    !complexity ||
    !friction ||
    !contextStability ||
    !competingHabit ||
    !rewardAversion
  ) {
    return null;
  }

  return {
    complexity,
    friction,
    contextStability,
    competingHabit,
    rewardAversion
  };
}

function normalizeWeekdays(value: unknown): Weekday[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  if (!value.every((day): day is Weekday => WEEKDAYS.has(day as Weekday))) {
    return null;
  }
  return [...new Set(value)];
}

function normalizeLogs(value: unknown, createdAt: string): HabitLog[] | null {
  if (!Array.isArray(value)) return null;

  const logsByDate = new Map<string, HabitLog>();
  for (const item of value) {
    if (
      !isRecord(item) ||
      !isLocalDateKey(item.date) ||
      item.date < createdAt ||
      !LOG_STATUSES.has(item.status as HabitLogStatus)
    ) {
      continue;
    }
    logsByDate.set(item.date, {
      date: item.date,
      status: item.status as HabitLogStatus
    });
  }

  return [...logsByDate.values()].sort((a, b) =>
    a.date.localeCompare(b.date)
  );
}

function normalizeHabit(value: unknown): Habit | null {
  if (!isRecord(value)) return null;
  const factors = normalizeFactors(value.factors);
  const schedule = isRecord(value.schedule)
    ? normalizeWeekdays(value.schedule.weekdays)
    : null;
  const logs = isLocalDateKey(value.createdAt)
    ? normalizeLogs(value.logs, value.createdAt)
    : null;
  const name = typeof value.name === "string" ? value.name.trim() : "";
  const details =
    value.details === undefined
      ? ""
      : typeof value.details === "string"
        ? value.details.trim()
        : null;

  if (
    typeof value.id !== "string" ||
    value.id.trim().length === 0 ||
    name.length === 0 ||
    name.length > 80 ||
    details === null ||
    details.length > 160 ||
    !isLocalDateKey(value.createdAt) ||
    typeof value.targetDays !== "number" ||
    !Number.isInteger(value.targetDays) ||
    value.targetDays < 1 ||
    !factors ||
    !schedule ||
    !logs ||
    !AUTOMATICITY_STATUSES.has(
      value.automaticityStatus as Habit["automaticityStatus"]
    )
  ) {
    return null;
  }

  const minimumVersion =
    typeof value.minimumVersion === "string"
      ? value.minimumVersion.trim()
      : "";

  return {
    id: value.id,
    name,
    details,
    createdAt: value.createdAt,
    targetDays: value.targetDays,
    factors,
    schedule: { weekdays: schedule },
    ...(minimumVersion.length > 0 && minimumVersion.length <= 160
      ? { minimumVersion }
      : {}),
    logs,
    automaticityStatus:
      value.automaticityStatus as Habit["automaticityStatus"]
  };
}

export function loadHabits(): Habit[] {
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyRaw) {
        raw = legacyRaw;
        localStorage.setItem(STORAGE_KEY, legacyRaw);
      }
    }
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

export function saveHabits(habits: Habit[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 2, habits }));
    return true;
  } catch {
    return false;
  }
}
