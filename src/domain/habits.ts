import type {
  FactorKey,
  Habit,
  HabitFactorLevel,
  HabitFactors,
  HabitLogStatus,
  Weekday
} from "../types";
import {
  dateKeyToUtcTime,
  parseLocalDate,
  toLocalDateKey
} from "./date";

const DAY_MS = 86_400_000;
const AUTOMATICITY_EXTENSION_DAYS = 21;
const WEEKDAY_BY_INDEX: Weekday[] = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY"
];

const FACTOR_KEYS: FactorKey[] = [
  "complexity",
  "friction",
  "contextStability",
  "competingHabit",
  "rewardAversion"
];

const FACTOR_MULTIPLIERS: Record<
  FactorKey,
  Record<HabitFactorLevel, number>
> = {
  complexity: { LOW: 0.85, MEDIUM: 1, HIGH: 1.25 },
  friction: { LOW: 0.9, MEDIUM: 1, HIGH: 1.2 },
  contextStability: { LOW: 0.88, MEDIUM: 1, HIGH: 1.2 },
  competingHabit: { LOW: 0.9, MEDIUM: 1.15, HIGH: 1.35 },
  rewardAversion: { LOW: 0.92, MEDIUM: 1, HIGH: 1.15 }
};

export function projectDays(createdAt: string, today = toLocalDateKey()): number {
  return Math.max(
    1,
    Math.floor(
      (dateKeyToUtcTime(today) - dateKeyToUtcTime(createdAt)) / DAY_MS
    ) + 1
  );
}

export function calculateTargetDays(
  factors: HabitFactors,
  frequencyPerWeek: number
): number {
  if (
    !Number.isInteger(frequencyPerWeek) ||
    frequencyPerWeek < 1 ||
    frequencyPerWeek > 7
  ) {
    throw new RangeError("A frequência semanal deve ser um inteiro entre 1 e 7");
  }

  const multiplier = FACTOR_KEYS.reduce((total, key) => {
    const selected = FACTOR_MULTIPLIERS[key][factors[key]];
    if (selected === undefined) throw new Error(`Fator inválido: ${key}`);
    return total * selected;
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
  const end = dateKeyToUtcTime(today);
  const dates: string[] = [];
  for (
    let cursor = parseLocalDate(habit.createdAt);
    dateKeyToUtcTime(toLocalDateKey(cursor)) <= end;
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
  const completed = completedExecutions(habit, today);
  return Math.round((completed / opportunities.length) * 100);
}

export function completedExecutions(
  habit: Habit,
  today = toLocalDateKey()
): number {
  const completedDates = new Set(
    habit.logs
      .filter((log) => log.status === "COMPLETED")
      .map((log) => log.date)
  );

  return opportunityDates(habit, today).filter((date) => completedDates.has(date))
    .length;
}

export function consecutiveExecutions(
  habit: Habit,
  today = toLocalDateKey()
): number {
  const opportunities = opportunityDates(habit, today);

  if (
    opportunities.at(-1) === today &&
    currentLog(habit, today) === null
  ) {
    opportunities.pop();
  }

  let sequence = 0;
  for (let index = opportunities.length - 1; index >= 0; index -= 1) {
    if (currentLog(habit, opportunities[index]) !== "COMPLETED") break;
    sequence += 1;
  }

  return sequence;
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

export function consolidateHabit(habit: Habit): Habit {
  return { ...habit, automaticityStatus: "CONSOLIDATED" };
}

export function extendHabit(habit: Habit): Habit {
  return {
    ...habit,
    targetDays: habit.targetDays + AUTOMATICITY_EXTENSION_DAYS,
    automaticityStatus: "EXTENDED"
  };
}
