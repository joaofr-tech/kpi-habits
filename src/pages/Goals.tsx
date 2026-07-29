import { useState } from "react";
import { AppHeader } from "../components/AppHeader";
import { CreateGoalDialog } from "../components/CreateGoalDialog";
import { GoalCard } from "../components/GoalCard";
import { FileIcon, PlusIcon } from "../components/Icons";
import { useGoals } from "../context/GoalsContext";

export function Goals() {
  const { goals, addGoal } = useGoals();
  const [creating, setCreating] = useState(false);

  return (
    <div className="page-shell">
      <AppHeader
        activeSection="goals"
        addLabel="Nova meta"
        onAdd={() => setCreating(true)}
      />
      <main className="dashboard">
        {goals.length === 0 ? (
          <section className="empty-state">
            <div className="empty-mark" aria-hidden="true">02</div>
            <div>
              <span className="eyebrow">Defina a direção</span>
              <h2>Uma meta clara transforma intenção em destino.</h2>
              <p>
                Registre o resultado que você busca, determine uma data-limite
                e lembre por que ele importa.
              </p>
              <button className="button-primary" onClick={() => setCreating(true)}>
                <PlusIcon /> Criar primeira meta
              </button>
            </div>
          </section>
        ) : (
          <>
            <div className="section-heading">
              <h2>Metas definidas</h2>
              <span>{goals.length} {goals.length === 1 ? "meta" : "metas"}</span>
            </div>
            <section className="goal-grid" aria-label="Metas cadastradas">
              {goals.map((goal) => <GoalCard key={goal.id} goal={goal} />)}
            </section>
          </>
        )}
      </main>
      <footer className="app-footer">
        <p>Eu sou o melhor</p>
        <span>um dia de cada vez</span>
      </footer>
      <a
        className="method-button"
        href="/metodologia"
        aria-label="Abrir metodologia"
      >
        <FileIcon />
      </a>
      <CreateGoalDialog
        open={creating}
        onClose={() => setCreating(false)}
        onSave={addGoal}
      />
    </div>
  );
}
