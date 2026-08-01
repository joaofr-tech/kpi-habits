import { useEffect, useRef, useState } from "react";
import { createId } from "../domain/id";
import { toLocalDateKey } from "../domain/date";
import type { Goal } from "../types";
import { triggerHapticFeedback } from "../ui/haptics";
import { CloseIcon } from "./Icons";

interface GoalDialogProps {
  open: boolean;
  goal: Goal | null;
  onClose: () => void;
  onSave: (goal: Goal) => void;
}

export function GoalDialog({
  open,
  goal,
  onClose,
  onSave
}: GoalDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [specification, setSpecification] = useState("");
  const [deadline, setDeadline] = useState("");
  const [motivation, setMotivation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const today = toLocalDateKey();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open) {
      setName(goal?.name ?? "");
      setSpecification(goal?.specification ?? "");
      setDeadline(goal?.deadline ?? "");
      setMotivation(goal?.motivation ?? "");
      setSubmitted(false);
      if (bodyRef.current) bodyRef.current.scrollTop = 0;
    }
    if (open && !dialog?.open) dialog?.showModal();
    if (!open && dialog?.open) dialog.close();
  }, [goal, open]);

  function reset() {
    setName("");
    setSpecification("");
    setDeadline("");
    setMotivation("");
    setSubmitted(false);
  }

  function close() {
    dialogRef.current?.close();
    reset();
    onClose();
  }

  const nameValid = name.trim().length > 0 && name.trim().length <= 80;
  const specificationValid =
    specification.trim().length > 0 && specification.trim().length <= 240;
  const deadlineValid = deadline.length > 0 && deadline >= today;
  const motivationValid =
    motivation.trim().length > 0 && motivation.trim().length <= 300;

  function save() {
    setSubmitted(true);
    if (
      !nameValid ||
      !specificationValid ||
      !deadlineValid ||
      !motivationValid
    ) {
      return;
    }
    onSave({
      id: goal?.id ?? createId(),
      name: name.trim(),
      specification: specification.trim(),
      deadline,
      motivation: motivation.trim(),
      createdAt: goal?.createdAt ?? today
    });
    triggerHapticFeedback();
    close();
  }

  return (
    <dialog
      ref={dialogRef}
      className="dialog"
      aria-labelledby="goal-dialog-title"
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
          <span className="eyebrow">{goal ? "Editar meta" : "Nova meta"}</span>
          <h2 id="goal-dialog-title">
            {goal ? "Atualize os detalhes" : "Defina um resultado claro"}
          </h2>
        </div>
        <button className="icon-button" onClick={close} aria-label="Fechar">
          <CloseIcon />
        </button>
      </div>

      <div ref={bodyRef} className="dialog-body goal-form">
        <label className="field">
          <span>Nome</span>
          <input
            autoFocus
            value={name}
            maxLength={80}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ex.: Criar uma reserva financeira"
            aria-describedby={submitted && !nameValid ? "goal-name-error" : undefined}
          />
          {submitted && !nameValid && (
            <small className="field-error" id="goal-name-error">
              Informe um nome com até 80 caracteres.
            </small>
          )}
        </label>

        <label className="field">
          <span>Especificação</span>
          <textarea
            value={specification}
            maxLength={240}
            onChange={(event) => setSpecification(event.target.value)}
            placeholder="Ex.: Guardar R$ 10.000 em uma conta separada"
            aria-describedby={
              submitted && !specificationValid
                ? "goal-specification-error"
                : undefined
            }
          />
          <small>Descreva números, critérios ou o resultado esperado.</small>
          {submitted && !specificationValid && (
            <small className="field-error" id="goal-specification-error">
              Informe uma especificação com até 240 caracteres.
            </small>
          )}
        </label>

        <label className="field">
          <span>Data-limite</span>
          <input
            type="date"
            min={today}
            value={deadline}
            onChange={(event) => setDeadline(event.target.value)}
            aria-describedby={
              submitted && !deadlineValid ? "goal-deadline-error" : undefined
            }
          />
          {submitted && !deadlineValid && (
            <small className="field-error" id="goal-deadline-error">
              Escolha hoje ou uma data futura.
            </small>
          )}
        </label>

        <label className="field">
          <span>Motivação</span>
          <textarea
            value={motivation}
            maxLength={300}
            onChange={(event) => setMotivation(event.target.value)}
            placeholder="Ex.: Ter segurança para lidar com imprevistos"
            aria-describedby={
              submitted && !motivationValid ? "goal-motivation-error" : undefined
            }
          />
          <small>Por que essa meta importa e como ela beneficia sua vida?</small>
          {submitted && !motivationValid && (
            <small className="field-error" id="goal-motivation-error">
              Informe uma motivação com até 300 caracteres.
            </small>
          )}
        </label>

        <div className="dialog-actions">
          <button className="button-secondary" onClick={close}>Cancelar</button>
          <button className="button-primary" onClick={save}>
            {goal ? "Salvar alterações" : "Criar meta"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
