import {
  consistency,
  currentLog,
  isScheduledDate,
  projectDays
} from "../domain/habits";
import { toLocalDateKey } from "../domain/date";
import type { Habit, HabitLogStatus } from "../types";
import { triggerHapticFeedback } from "../ui/haptics";
import { TrashIcon } from "./Icons";

interface HabitCardProps {
  habit: Habit;
  onLog: (status: HabitLogStatus | null) => void;
  onDelete: () => void;
  onTest: () => void;
}

export function HabitCard({
  habit,
  onLog,
  onDelete,
  onTest
}: HabitCardProps) {
  const today = toLocalDateKey();
  const days = projectDays(habit.createdAt, today);
  const rate = consistency(habit, today);
  const log = currentLog(habit, today);
  const scheduled = isScheduledDate(habit, today);
  const progress = Math.min(100, Math.round((days / habit.targetDays) * 100));

  function confirmDelete() {
    if (window.confirm(`Excluir “${habit.name}” e todo o seu histórico?`)) {
      onDelete();
      triggerHapticFeedback();
    }
  }

  function logToday(status: HabitLogStatus | null) {
    onLog(status);
    triggerHapticFeedback();
  }

  return (
    <article className="habit-card">
      <div className="card-head">
        <div>
          <h2>{habit.name}</h2>
          {habit.details && <p className="habit-details">{habit.details}</p>}
        </div>
        <button
          className="icon-button subtle"
          onClick={confirmDelete}
          aria-label={`Excluir ${habit.name}`}
        >
          <TrashIcon />
        </button>
      </div>

      {habit.minimumVersion && (
        <p className="minimum-version">
          <span>Mínimo:</span>
          {habit.minimumVersion}
        </p>
      )}

      <div className="progress-label">
        <span>{days} de {habit.targetDays} dias</span>
        <strong>{progress}%</strong>
      </div>
      <div className="mobile-card-summary">
        <strong>Dia {days} de {habit.targetDays}</strong>
        <span>{rate === null ? "—" : `${rate}% consistência`}</span>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-label="Progresso até o Dia-Alvo"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className="metric-row">
        <div>
          <span>Consistência</span>
          <strong>{rate === null ? "—" : `${rate}%`}</strong>
        </div>
        <div>
          <span>Dia-Alvo</span>
          <strong>{habit.targetDays}</strong>
        </div>
        <div>
          <span>Hoje</span>
          <strong>
            {!scheduled
              ? "Pausa"
              : log === "COMPLETED"
                ? "Feito"
                : log === "MISSED"
                  ? "Não feito"
                  : "Pendente"}
          </strong>
        </div>
      </div>

      {habit.automaticityStatus === "READY_FOR_TEST" && (
        <button className="test-banner" onClick={onTest}>
          <span>Você chegou ao Dia-Alvo</span>
          <strong>Fazer teste de automaticidade →</strong>
        </button>
      )}

      {habit.automaticityStatus === "CONSOLIDATED" && (
        <div className="consolidated-banner">
          <span aria-hidden="true">✓</span>
          <div>
            <strong>Automaticidade confirmada</strong>
            <small>Continue protegendo o contexto que você construiu.</small>
          </div>
        </div>
      )}

      <div className="today-section">
        <span className="today-label">Registro de hoje</span>
        {scheduled ? (
          <div className="log-controls">
            <button
              className={log === "COMPLETED" ? "active success" : ""}
              aria-pressed={log === "COMPLETED"}
              onClick={() =>
                logToday(log === "COMPLETED" ? null : "COMPLETED")
              }
            >
              <span aria-hidden="true">✓</span> Concluído
            </button>
            <button
              className={log === "MISSED" ? "active missed" : ""}
              aria-pressed={log === "MISSED"}
              onClick={() => logToday(log === "MISSED" ? null : "MISSED")}
            >
              <span aria-hidden="true">×</span> Não concluído
            </button>
          </div>
        ) : (
          <p className="rest-day">Hoje não é um dia programado. Descanse sem culpa.</p>
        )}
      </div>
    </article>
  );
}
