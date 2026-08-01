import { useState } from "react";
import { AppHeader } from "../components/AppHeader";
import { DeleteConfirmationDialog } from "../components/DeleteConfirmationDialog";
import { GoalDialog } from "../components/GoalDialog";
import { GoalCard } from "../components/GoalCard";
import { FileIcon, PlusIcon } from "../components/Icons";
import { StorageWarning } from "../components/StorageWarning";
import { useGoals } from "../context/GoalsContext";
import { AppLink } from "../navigation";
import type { Goal } from "../types";

export function Goals() {
  const {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    completeGoal,
    reopenGoal,
    persistenceError
  } = useGoals();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [goalBeingEdited, setGoalBeingEdited] = useState<Goal | null>(null);
  const [goalBeingDeleted, setGoalBeingDeleted] = useState<Goal | null>(null);

  function createGoal() {
    setGoalBeingEdited(null);
    setDialogOpen(true);
  }

  function editGoal(goal: Goal) {
    setGoalBeingEdited(goal);
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setGoalBeingEdited(null);
  }

  function saveGoal(goal: Goal) {
    if (goalBeingEdited) updateGoal(goal);
    else addGoal(goal);
  }

  const displayedGoals = [
    ...goals.filter((goal) => !goal.completedAt),
    ...goals.filter((goal) => goal.completedAt)
  ];

  return (
    <div className="page-shell">
      <AppHeader
        activeSection="goals"
        addLabel="Nova meta"
        onAdd={createGoal}
      />
      <StorageWarning visible={persistenceError} />
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
              <button className="button-primary" onClick={createGoal}>
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
              {displayedGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onEdit={() => editGoal(goal)}
                  onDelete={() => setGoalBeingDeleted(goal)}
                  onComplete={() => completeGoal(goal.id)}
                  onReopen={() => reopenGoal(goal.id)}
                />
              ))}
            </section>
          </>
        )}
      </main>
      <footer className="app-footer">
        <p>Believe it first.</p>
        <span></span>
      </footer>
      <AppLink
        className="method-button"
        href="/metodologia"
        aria-label="Abrir metodologia"
      >
        <FileIcon />
      </AppLink>
      <GoalDialog
        open={dialogOpen}
        goal={goalBeingEdited}
        onClose={closeDialog}
        onSave={saveGoal}
      />
      <DeleteConfirmationDialog
        open={goalBeingDeleted !== null}
        title={
          goalBeingDeleted
            ? `Excluir a meta “${goalBeingDeleted.name}”?`
            : "Excluir meta?"
        }
        description="Esta meta será removida definitivamente."
        confirmLabel="Excluir meta"
        onCancel={() => setGoalBeingDeleted(null)}
        onConfirm={() => {
          if (goalBeingDeleted) deleteGoal(goalBeingDeleted.id);
        }}
      />
    </div>
  );
}
