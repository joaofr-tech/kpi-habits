export type HabitFactorLevel =
  | "VERY_LOW"
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "VERY_HIGH";

export interface HabitFactors {
  complexity: HabitFactorLevel;
  friction: HabitFactorLevel;
  contextStability: HabitFactorLevel;
  competingHabit: HabitFactorLevel;
  rewardAversion: HabitFactorLevel;
}

export type Weekday =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface HabitSchedule {
  frequencyPerWeek: number;
  weekdays: Weekday[];
}

export type HabitLogStatus = "COMPLETED" | "MISSED";

export interface HabitLog {
  date: string;
  status: HabitLogStatus;
}

export interface Habit {
  id: string;
  name: string;
  createdAt: string;
  targetDays: number;
  factors: HabitFactors;
  schedule: HabitSchedule;
  minimumVersion?: string;
  logs: HabitLog[];
  automaticityStatus:
    | "TRACKING"
    | "READY_FOR_TEST"
    | "CONSOLIDATED"
    | "EXTENDED";
}

export type FactorKey = keyof HabitFactors;
