import { useState } from "react";
import { AppHeader } from "../components/AppHeader";
import { AutomaticityDialog } from "../components/AutomaticityDialog";
import { CreateHabitDialog } from "../components/CreateHabitDialog";
import { HabitCard } from "../components/HabitCard";
import { FileIcon, PlusIcon } from "../components/Icons";
import { StorageWarning } from "../components/StorageWarning";
import { useHabits } from "../context/HabitsContext";
import type { Habit } from "../types";

export function Dashboard() {
  const {
    habits,
    persistenceError,
    addHabit,
    deleteHabit,
    setTodayLog,
    consolidate,
    extend
  } = useHabits();
  const [creating, setCreating] = useState(false);
  const [testing, setTesting] = useState<Habit | null>(null);

  return (
    <div className="page-shell">
      <AppHeader
        activeSection="habits"
        addLabel="Novo hábito"
        onAdd={() => setCreating(true)}
      />
      <StorageWarning visible={persistenceError} />
      <main className="dashboard">
        {habits.length === 0 ? (
          <section className="empty-state">
            <div className="empty-mark" aria-hidden="true">01</div>
            <div>
              <span className="eyebrow">Comece pequeno</span>
              <h2>Seu primeiro hábito começa com uma ação possível.</h2>
              <p>
                Defina a frequência, estime um período de acompanhamento e
                registre cada oportunidade — inclusive as que não saírem como
                planejado.
              </p>
              <button className="button-primary" onClick={() => setCreating(true)}>
                <PlusIcon /> Criar primeiro hábito
              </button>
            </div>
          </section>
        ) : (
          <>
            <div className="section-heading">
              <h2>Em acompanhamento</h2>
              <span>{habits.length} {habits.length === 1 ? "hábito" : "hábitos"}</span>
            </div>
            <section className="habit-grid" aria-label="Hábitos cadastrados">
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onLog={(status) => setTodayLog(habit.id, status)}
                  onDelete={() => deleteHabit(habit.id)}
                  onTest={() => setTesting(habit)}
                />
              ))}
            </section>
          </>
        )}
      </main>
      <footer className="app-footer">
        <p>Eu não quero, mas tenho que fazer.</p>
        <span>Então, que importa o que eu quero?</span>
      </footer>
      <a
        className="method-button"
        href="/metodologia"
        aria-label="Abrir metodologia"
      >
        <FileIcon />
      </a>
      <CreateHabitDialog
        open={creating}
        onClose={() => setCreating(false)}
        onSave={addHabit}
      />
      <AutomaticityDialog
        habit={testing}
        onClose={() => setTesting(null)}
        onConsolidate={consolidate}
        onExtend={extend}
      />
    </div>
  );
}
