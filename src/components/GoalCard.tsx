import type { Goal } from "../types";

interface GoalCardProps {
  goal: Goal;
}

const DATE_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric"
});

function formatDate(dateKey: string): string {
  return DATE_FORMATTER.format(new Date(`${dateKey}T00:00:00`));
}

export function GoalCard({ goal }: GoalCardProps) {
  return (
    <article className="goal-card">
      <div className="goal-card-head">
        <span className="eyebrow">Meta</span>
        <time dateTime={goal.deadline}>{formatDate(goal.deadline)}</time>
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
