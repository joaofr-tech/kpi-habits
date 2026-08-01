import type { Goal } from "../types";
import { triggerHapticFeedback } from "../ui/haptics";
import { EditIcon, TrashIcon } from "./Icons";

interface GoalCardProps {
  goal: Goal;
  onEdit: () => void;
  onDelete: () => void;
}

const DATE_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric"
});

function formatDate(dateKey: string): string {
  return DATE_FORMATTER.format(new Date(`${dateKey}T00:00:00`));
}

export function GoalCard({ goal, onEdit, onDelete }: GoalCardProps) {
  function confirmDelete() {
    if (window.confirm(`Excluir a meta “${goal.name}”?`)) {
      onDelete();
      triggerHapticFeedback();
    }
  }

  return (
    <article className="goal-card">
      <div className="goal-card-head">
        <span className="eyebrow">Meta</span>
        <div className="goal-card-meta">
          <time dateTime={goal.deadline}>{formatDate(goal.deadline)}</time>
          <div className="goal-card-actions">
            <button
              className="icon-button"
              onClick={onEdit}
              aria-label={`Editar ${goal.name}`}
            >
              <EditIcon />
            </button>
            <button
              className="icon-button"
              onClick={confirmDelete}
              aria-label={`Excluir ${goal.name}`}
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      </div>
      <h2>{goal.name}</h2>
      <div className="goal-card-section">
        <span>Especificação</span>
        <p>{goal.specification}</p>
      </div>
      <div className="goal-card-section motivation">
        <span>Motivação</span>
        <p>{goal.motivation}</p>
      </div>
    </article>
  );
}
