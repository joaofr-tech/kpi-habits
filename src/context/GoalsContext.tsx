import {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
  useReducer
} from 'react';
import { loadGoals, saveGoals } from '../data/goalsStorage';
import { toLocalDateKey } from '../domain/date';
import type { Goal } from '../types';
import { usePersistenceError } from './usePersistenceError';

type Action =
  | { type: 'add'; goal: Goal }
  | { type: 'update'; goal: Goal }
  | { type: 'delete'; goalId: string }
  | { type: 'complete'; goalId: string; completedAt: string }
  | { type: 'reopen'; goalId: string };

function reducer(goals: Goal[], action: Action): Goal[] {
  switch (action.type) {
    case 'add':
      return [action.goal, ...goals];
    case 'update':
      return goals.map((goal) =>
        goal.id === action.goal.id ? action.goal : goal
      );
    case 'delete':
      return goals.filter((goal) => goal.id !== action.goalId);
    case 'complete':
      return goals.map((goal) =>
        goal.id === action.goalId
          ? { ...goal, completedAt: action.completedAt }
          : goal
      );
    case 'reopen':
      return goals.map((goal) =>
        goal.id === action.goalId
          ? { ...goal, completedAt: undefined }
          : goal
      );
  }
}

interface GoalsContextValue {
  goals: Goal[];
  persistenceError: boolean;
  addGoal: (goal: Goal) => void;
  updateGoal: (goal: Goal) => void;
  deleteGoal: (goalId: string) => void;
  completeGoal: (goalId: string) => void;
  reopenGoal: (goalId: string) => void;
}

const GoalsContext = createContext<GoalsContextValue | null>(null);

export function GoalsProvider({ children }: PropsWithChildren) {
  const [goals, dispatch] = useReducer(reducer, undefined, loadGoals);

  const persistenceError = usePersistenceError(saveGoals, goals);

  const value = useMemo<GoalsContextValue>(
    () => ({
      goals,
      persistenceError,
      addGoal: (goal) => dispatch({ type: 'add', goal }),
      updateGoal: (goal) => dispatch({ type: 'update', goal }),
      deleteGoal: (goalId) => dispatch({ type: 'delete', goalId }),
      completeGoal: (goalId) =>
        dispatch({
          type: 'complete',
          goalId,
          completedAt: toLocalDateKey()
        }),
      reopenGoal: (goalId) => dispatch({ type: 'reopen', goalId })
    }),
    [goals, persistenceError]
  );

  return (
    <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>
  );
}

export function useGoals(): GoalsContextValue {
  const context = useContext(GoalsContext);
  if (!context) throw new Error('useGoals deve estar dentro de GoalsProvider');
  return context;
}
