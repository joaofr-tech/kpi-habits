import type { Goal } from '../types';

const STORAGE_KEY = 'kpi-goals';

function isValidDateKey(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function normalizeText(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  return normalized.length > 0 && normalized.length <= maxLength
    ? normalized
    : null;
}

function normalizeGoal(value: unknown): Goal | null {
  if (!value || typeof value !== 'object') return null;
  const goal = value as Partial<Goal>;
  const name = normalizeText(goal.name, 80);
  const specification = normalizeText(goal.specification, 240);
  const motivation = normalizeText(goal.motivation, 300);

  if (
    typeof goal.id !== 'string' ||
    goal.id.trim().length === 0 ||
    !name ||
    !specification ||
    !motivation ||
    !isValidDateKey(goal.deadline) ||
    !isValidDateKey(goal.createdAt)
  ) {
    return null;
  }

  return {
    id: goal.id,
    name,
    specification,
    deadline: goal.deadline,
    motivation,
    createdAt: goal.createdAt
  };
}

export function loadGoals(): Goal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      (parsed as { version?: number }).version !== 1 ||
      !Array.isArray((parsed as { goals?: unknown }).goals)
    ) {
      return [];
    }
    return (parsed as { goals: unknown[] }).goals
      .map(normalizeGoal)
      .filter((goal): goal is Goal => goal !== null);
  } catch {
    return [];
  }
}

export function saveGoals(goals: Goal[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, goals }));
}
