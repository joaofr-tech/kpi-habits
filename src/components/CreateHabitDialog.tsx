import { useEffect, useRef, useState } from "react";
import { FACTORS, WEEKDAYS } from "../data/factors";
import { calculateTargetDays, toLocalDateKey } from "../domain/habits";
import type { Habit, HabitFactors, HabitFactorLevel, Weekday } from "../types";
import { CloseIcon } from "./Icons";

interface CreateHabitDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (habit: Habit) => void;
}

const DEFAULT_FACTORS: HabitFactors = {
  complexity: "MEDIUM",
  friction: "MEDIUM",
  contextStability: "MEDIUM",
  competingHabit: "MEDIUM",
  rewardAversion: "MEDIUM"
};

export function CreateHabitDialog({
  open,
  onClose,
  onSave
}: CreateHabitDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [minimumVersion, setMinimumVersion] = useState("");
  const [frequency, setFrequency] = useState(3);
  const [weekdays, setWeekdays] = useState<Weekday[]>([]);
  const [factors, setFactors] = useState<HabitFactors>(DEFAULT_FACTORS);
  const [configured, setConfigured] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog?.open) dialog?.showModal();
    if (!open && dialog?.open) dialog.close();
  }, [open]);

  function reset() {
    setStep(1);
    setName("");
    setMinimumVersion("");
    setFrequency(3);
    setWeekdays([]);
    setFactors(DEFAULT_FACTORS);
    setConfigured(false);
    setSubmitted(false);
  }

  function close() {
    dialogRef.current?.close();
    reset();
    onClose();
  }

  function toggleWeekday(day: Weekday) {
    setWeekdays((current) => {
      if (current.includes(day)) return current.filter((item) => item !== day);
      if (current.length >= frequency) return current;
      return [...current, day];
    });
  }

  function changeFrequency(value: number) {
    setFrequency(value);
    setWeekdays((current) => current.slice(0, value));
    setConfigured(false);
  }

  const scheduleValid = weekdays.length === frequency;
  const nameValid = name.trim().length > 0 && name.trim().length <= 80;
  const targetDays = calculateTargetDays(factors, frequency);

  function save() {
    setSubmitted(true);
    if (!nameValid || !scheduleValid || !configured) return;
    onSave({
      id: crypto.randomUUID(),
      name: name.trim(),
      createdAt: toLocalDateKey(),
      targetDays,
      factors,
      schedule: { frequencyPerWeek: frequency, weekdays },
      minimumVersion: minimumVersion.trim() || undefined,
      logs: [],
      automaticityStatus: "TRACKING"
    });
    close();
  }

  return (
    <dialog
      ref={dialogRef}
      className="dialog"
      aria-labelledby="create-title"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClose={() => {
        if (open) {
          reset();
          onClose();
        }
      }}
    >
      <div className="dialog-topline">
        <div>
          <span className="eyebrow">Etapa {step} de 2</span>
          <h2 id="create-title">
            {step === 1 ? "Crie um hábito possível" : "Configure o estimador"}
          </h2>
        </div>
        <button className="icon-button" onClick={close} aria-label="Fechar">
          <CloseIcon />
        </button>
      </div>

      {step === 1 ? (
        <div className="dialog-body">
          <label className="field">
            <span>Qual hábito você quer construir?</span>
            <input
              autoFocus
              value={name}
              maxLength={80}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ex.: Caminhar depois do almoço"
              aria-describedby={submitted && !nameValid ? "name-error" : undefined}
            />
            {submitted && !nameValid && (
              <small className="field-error" id="name-error">
                Informe um nome com até 80 caracteres.
              </small>
            )}
          </label>

          <label className="field">
            <span>Versão mínima <em>opcional</em></span>
            <input
              value={minimumVersion}
              maxLength={160}
              onChange={(event) => setMinimumVersion(event.target.value)}
              placeholder="Ex.: Caminhar por pelo menos 5 minutos"
            />
            <small>A menor versão que ainda conta nos dias difíceis.</small>
          </label>

          <div className="field">
            <label htmlFor="frequency">Frequência semanal</label>
            <div className="frequency-row">
              <input
                id="frequency"
                type="range"
                min="1"
                max="7"
                value={frequency}
                onChange={(event) => changeFrequency(Number(event.target.value))}
              />
              <strong>{frequency}×</strong>
            </div>
          </div>

          <fieldset className="weekday-fieldset">
            <legend>Em quais dias?</legend>
            <div className="weekday-picker">
              {WEEKDAYS.map((day) => (
                <button
                  type="button"
                  key={day.key}
                  className={weekdays.includes(day.key) ? "selected" : ""}
                  aria-pressed={weekdays.includes(day.key)}
                  aria-label={day.label}
                  onClick={() => toggleWeekday(day.key)}
                >
                  {day.short}
                </button>
              ))}
            </div>
            <small>
              Escolha {frequency} {frequency === 1 ? "dia" : "dias"}.
            </small>
            {submitted && !scheduleValid && (
              <small className="field-error">
                Selecione exatamente {frequency} {frequency === 1 ? "dia" : "dias"}.
              </small>
            )}
          </fieldset>

          {configured && (
            <div className="estimate-preview">
              <span>Seu período de acompanhamento</span>
              <strong>Dia-Alvo: {targetDays} dias</strong>
              <small>Uma estimativa para acompanhamento, não uma previsão exata.</small>
            </div>
          )}

          <div className="dialog-actions">
            <button className="button-secondary" onClick={close}>Cancelar</button>
            <button
              className="button-primary"
              onClick={() => {
                setSubmitted(true);
                if (nameValid && scheduleValid) {
                  setSubmitted(false);
                  setStep(2);
                }
              }}
            >
              {configured ? "Revisar estimador" : "Configurar estimador"}
            </button>
            {configured && (
              <button className="button-primary" onClick={save}>Salvar hábito</button>
            )}
          </div>
        </div>
      ) : (
        <div className="dialog-body estimator">
          <p className="dialog-intro">
            Escolha a descrição mais próxima da sua realidade. Os valores são
            calculados automaticamente.
          </p>
          {FACTORS.map((factor) => (
            <label className="factor-field" key={factor.key}>
              <span>{factor.label}</span>
              <small>{factor.hint}</small>
              <select
                value={factors[factor.key]}
                onChange={(event) =>
                  setFactors((current) => ({
                    ...current,
                    [factor.key]: event.target.value as HabitFactorLevel
                  }))
                }
              >
                {factor.options.map((option) => (
                  <option key={option.level} value={option.level}>
                    {option.label} — {option.description}
                  </option>
                ))}
              </select>
            </label>
          ))}
          <div className="estimate-preview dark">
            <span>Resultado</span>
            <strong>Dia-Alvo: {targetDays} dias</strong>
            <small>Você poderá estender o período após o teste de automaticidade.</small>
          </div>
          <div className="dialog-actions">
            <button className="button-secondary" onClick={() => setStep(1)}>
              Voltar
            </button>
            <button
              className="button-primary"
              onClick={() => {
                setConfigured(true);
                setStep(1);
              }}
            >
              Usar esta estimativa
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
