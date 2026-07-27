import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useReducer
} from "react";
import { loadHabits, saveHabits } from "../data/storage";
import { refreshAutomaticity, setLog, toLocalDateKey } from "../domain/habits";
import type { Habit, HabitLogStatus } from "../types";

type Action =
  | { type: "add"; habit: Habit }
  | { type: "delete"; id: string }
  | { type: "log"; id: string; status: HabitLogStatus | null }
  | { type: "consolidate"; id: string }
  | { type: "extend"; id: string };

function reducer(habits: Habit[], action: Action): Habit[] {
  switch (action.type) {
    case "add":
      return [action.habit, ...habits];
    case "delete":
      return habits.filter((habit) => habit.id !== action.id);
    case "log":
      return habits.map((habit) =>
        habit.id === action.id
          ? setLog(habit, toLocalDateKey(), action.status)
          : habit
      );
    case "consolidate":
      return habits.map((habit) =>
        habit.id === action.id
          ? { ...habit, automaticityStatus: "CONSOLIDATED" }
          : habit
      );
    case "extend":
      return habits.map((habit) =>
        habit.id === action.id
          ? {
              ...habit,
              targetDays: habit.targetDays + 21,
              automaticityStatus: "EXTENDED"
            }
          : habit
      );
  }
}

interface HabitsContextValue {
  habits: Habit[];
  addHabit: (habit: Habit) => void;
  deleteHabit: (id: string) => void;
  setTodayLog: (id: string, status: HabitLogStatus | null) => void;
  consolidate: (id: string) => void;
  extend: (id: string) => void;
}

const HabitsContext = createContext<HabitsContextValue | null>(null);

export function HabitsProvider({ children }: PropsWithChildren) {
  const [habits, dispatch] = useReducer(
    reducer,
    undefined,
    () => loadHabits().map((habit) => refreshAutomaticity(habit))
  );

  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  const value = useMemo<HabitsContextValue>(
    () => ({
      habits,
      addHabit: (habit) => dispatch({ type: "add", habit }),
      deleteHabit: (id) => dispatch({ type: "delete", id }),
      setTodayLog: (id, status) => dispatch({ type: "log", id, status }),
      consolidate: (id) => dispatch({ type: "consolidate", id }),
      extend: (id) => dispatch({ type: "extend", id })
    }),
    [habits]
  );

  return (
    <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>
  );
}

export function useHabits(): HabitsContextValue {
  const context = useContext(HabitsContext);
  if (!context) throw new Error("useHabits deve estar dentro de HabitsProvider");
  return context;
}
