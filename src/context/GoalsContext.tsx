import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useReducer
} from 'react';
import { loadGoals, saveGoals } from '../data/goalsStorage';
import type { Goal } from '../types';

type Action = { type: 'add'; goal: Goal };

function reducer(goals: Goal[], action: Action): Goal[] {
  switch (action.type) {
    case 'add':
      return [action.goal, ...goals];
  }
}

interface GoalsContextValue {
  goals: Goal[];
  addGoal: (goal: Goal) => void;
}

const GoalsContext = createContext<GoalsContextValue | null>(null);

export function GoalsProvider({ children }: PropsWithChildren) {
  const [goals, dispatch] = useReducer(reducer, undefined, loadGoals);

  useEffect(() => {
    saveGoals(goals);
  }, [goals]);

  const value = useMemo<GoalsContextValue>(
    () => ({
      goals,
      addGoal: (goal) => dispatch({ type: 'add', goal })
    }),
    [goals]
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
