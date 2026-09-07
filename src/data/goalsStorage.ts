import type { Goal } from '../types';
import { isLocalDateKey } from '../domain/date';

const STORAGE_KEY = 'habitus-goals';
const LEGACY_STORAGE_KEY = 'kpi-goals';

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
  const completedAt = isLocalDateKey(goal.completedAt)
    ? goal.completedAt
    : undefined;

  if (
    typeof goal.id !== 'string' ||
    goal.id.trim().length === 0 ||
    !name ||
    !specification ||
    !motivation ||
    !isLocalDateKey(goal.deadline) ||
    !isLocalDateKey(goal.createdAt)
  ) {
    return null;
  }

  return {
    id: goal.id,
    name,
    specification,
    deadline: goal.deadline,
    motivation,
    createdAt: goal.createdAt,
    ...(completedAt ? { completedAt } : {})
  };
}

export function loadGoals(): Goal[] {
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

export function saveGoals(goals: Goal[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, goals }));
    return true;
  } catch {
    return false;
  }
}
