import { FACTORS } from "../data/factors";
import type {
  Habit,
  HabitFactors,
  HabitLogStatus,
  Weekday
} from "../types";

const DAY_MS = 86_400_000;
const WEEKDAY_BY_INDEX: Weekday[] = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY"
];

export function toLocalDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseLocalDate(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function utcDay(key: string): number {
  const [year, month, day] = key.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

export function projectDays(createdAt: string, today = toLocalDateKey()): number {
  return Math.max(1, Math.floor((utcDay(today) - utcDay(createdAt)) / DAY_MS) + 1);
}

export function calculateTargetDays(
  factors: HabitFactors,
  frequencyPerWeek: number
): number {
  const multiplier = FACTORS.reduce((total, factor) => {
    const selected = factor.options.find(
      (option) => option.level === factors[factor.key]
    );
    if (!selected) throw new Error(`Fator inválido: ${factor.key}`);
    return total * selected.value;
  }, 1);
  return Math.round(66 * multiplier * Math.sqrt(7 / frequencyPerWeek));
}

export function isScheduledDate(habit: Habit, dateKey: string): boolean {
  const weekday = WEEKDAY_BY_INDEX[parseLocalDate(dateKey).getDay()];
  return habit.schedule.weekdays.includes(weekday);
}

export function opportunityDates(
  habit: Habit,
  today = toLocalDateKey()
): string[] {
  const end = utcDay(today);
  const dates: string[] = [];
  for (
    let cursor = parseLocalDate(habit.createdAt);
    utcDay(toLocalDateKey(cursor)) <= end;
    cursor.setDate(cursor.getDate() + 1)
  ) {
    const key = toLocalDateKey(cursor);
    if (isScheduledDate(habit, key)) dates.push(key);
  }
  return dates;
}

export function consistency(
  habit: Habit,
  today = toLocalDateKey()
): number | null {
  const opportunities = opportunityDates(habit, today);
  if (opportunities.length === 0) return null;
  const validDates = new Set(opportunities);
  const completed = habit.logs.filter(
    (log) => log.status === "COMPLETED" && validDates.has(log.date)
  ).length;
  return Math.round((completed / opportunities.length) * 100);
}

export function setLog(
  habit: Habit,
  date: string,
  status: HabitLogStatus | null
): Habit {
  const logs = habit.logs.filter((log) => log.date !== date);
  if (status) logs.push({ date, status });
  return { ...habit, logs: logs.sort((a, b) => a.date.localeCompare(b.date)) };
}

export function currentLog(habit: Habit, date: string) {
  return habit.logs.find((log) => log.date === date)?.status ?? null;
}

export function refreshAutomaticity(
  habit: Habit,
  today = toLocalDateKey()
): Habit {
  if (
    habit.automaticityStatus !== "CONSOLIDATED" &&
    projectDays(habit.createdAt, today) >= habit.targetDays
  ) {
    return { ...habit, automaticityStatus: "READY_FOR_TEST" };
  }
  return habit;
}
