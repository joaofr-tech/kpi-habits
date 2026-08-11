import { useState } from "react";
import {
  completedExecutions,
  consecutiveExecutions,
  consistency,
  currentLog,
  isScheduledDate,
  projectDays,
  setLog
} from "../domain/habits";
import { toLocalDateKey } from "../domain/date";
import type { Habit, HabitLogStatus } from "../types";
import { playCompletionSound } from "../ui/completionFeedback";
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
  const completed = completedExecutions(habit, today);
  const sequence = consecutiveExecutions(habit, today);
  const log = currentLog(habit, today);
  const scheduled = isScheduledDate(habit, today);
  const progress = Math.min(100, Math.round((days / habit.targetDays) * 100));
  const [celebrating, setCelebrating] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  function logToday(status: HabitLogStatus | null) {
    if (status === "COMPLETED" && log !== "COMPLETED") {
      const nextSequence = consecutiveExecutions(
        setLog(habit, today, "COMPLETED"),
        today
      );
      playCompletionSound();
      setCelebrating(true);
      setAnnouncement(
        `${habit.name}: ${completed + 1} ${completed === 0 ? "execução feita" : "execuções feitas"}. Sequência atual: ${nextSequence} ${nextSequence === 1 ? "oportunidade" : "oportunidades"}.`
      );
    } else if (log === "COMPLETED") {
      const nextSequence = consecutiveExecutions(setLog(habit, today, status), today);
      setAnnouncement(
        `${habit.name}: ${Math.max(0, completed - 1)} execuções feitas. Sequência atual: ${nextSequence} ${nextSequence === 1 ? "oportunidade" : "oportunidades"}.`
      );
    } else if (status === "MISSED") {
      setAnnouncement(`${habit.name}: sequência atual zerada.`);
    }
    onLog(status);
  }

  return (
    <article className="habit-card">
      <div className="card-head">
        <div className="card-head-copy">
          <h2>{habit.name}</h2>
          {habit.details && <p className="habit-details">{habit.details}</p>}
        </div>
        <div className="card-head-tools">
          <button
            className="icon-button subtle"
            onClick={onDelete}
            aria-label={`Excluir ${habit.name}`}
          >
            <TrashIcon />
          </button>
          <div
            className={`streak-tile${sequence > 0 ? " active" : ""}${celebrating ? " celebrate" : ""}`}
            role="group"
            aria-label={`Sequência atual: ${sequence} ${sequence === 1 ? "oportunidade concluída" : "oportunidades concluídas"}`}
          >
            <div className="streak-value">
              <span className="streak-flame" aria-hidden="true">🔥</span>
              <strong>{sequence}</strong>
            </div>
            <span className="streak-label">seguidas</span>
          </div>
        </div>
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

      <div className="progress-stats">
        <strong className={celebrating ? "completed-count celebrate" : "completed-count"}>
          {completed} {completed === 1 ? "execução feita" : "execuções feitas"}
        </strong>
        <span>{rate === null ? "— consistência" : `${rate}% consistência`}</span>
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
          <span>Execuções</span>
          <strong>{completed}</strong>
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
              className={log === "MISSED" ? "active missed" : ""}
              aria-pressed={log === "MISSED"}
              onClick={() => logToday(log === "MISSED" ? null : "MISSED")}
            >
              <span aria-hidden="true">×</span> Não concluído
            </button>
            <button
              className={`completed-control${log === "COMPLETED" ? " active success" : ""}${celebrating ? " celebrate" : ""}`}
              aria-pressed={log === "COMPLETED"}
              onAnimationEnd={(event) => {
                if (event.animationName === "completion-button-pop") {
                  setCelebrating(false);
                }
              }}
              onClick={() =>
                logToday(log === "COMPLETED" ? null : "COMPLETED")
              }
            >
              <span className="completion-check" aria-hidden="true">✓</span>
              Concluído
            </button>
          </div>
        ) : (
          <p className="rest-day">Hoje não é um dia programado. Descanse sem culpa.</p>
        )}
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
    </article>
  );
}
