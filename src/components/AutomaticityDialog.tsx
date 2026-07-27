import { useEffect, useRef, useState } from "react";
import type { Habit } from "../types";
import { CloseIcon } from "./Icons";

const STATEMENTS = [
  "O gatilho faz lembrar da ação sem alarme.",
  "Começar exige pouca negociação mental.",
  "Executo a ação com motivação normal.",
  "Uma falha isolada não provoca abandono.",
  "A ação sobrevive a pequenas mudanças no dia."
];

interface AutomaticityDialogProps {
  habit: Habit | null;
  onClose: () => void;
  onConsolidate: (id: string) => void;
  onExtend: (id: string) => void;
}

export function AutomaticityDialog({
  habit,
  onClose,
  onConsolidate,
  onExtend
}: AutomaticityDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const [checked, setChecked] = useState<boolean[]>(STATEMENTS.map(() => false));
  const [twoWeeks, setTwoWeeks] = useState(false);

  useEffect(() => {
    if (habit && !ref.current?.open) ref.current?.showModal();
    if (!habit && ref.current?.open) ref.current.close();
  }, [habit]);

  function close() {
    ref.current?.close();
    setChecked(STATEMENTS.map(() => false));
    setTwoWeeks(false);
    onClose();
  }

  const score = checked.filter(Boolean).length;
  const approved = score >= 4 && twoWeeks;

  return (
    <dialog
      ref={ref}
      className="dialog test-dialog"
      aria-labelledby="test-title"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClose={() => habit && onClose()}
    >
      {habit && (
        <>
          <div className="dialog-topline">
            <div>
              <span className="eyebrow">Teste de automaticidade</span>
              <h2 id="test-title">{habit.name}</h2>
            </div>
            <button className="icon-button" onClick={close} aria-label="Fechar">
              <CloseIcon />
            </button>
          </div>
          <div className="dialog-body">
            <p className="dialog-intro">
              Marque o que já acontece de forma consistente — não o que aconteceu
              apenas em um bom dia.
            </p>
            <div className="check-list">
              {STATEMENTS.map((statement, index) => (
                <label key={statement}>
                  <input
                    type="checkbox"
                    checked={checked[index]}
                    onChange={(event) =>
                      setChecked((current) =>
                        current.map((value, itemIndex) =>
                          itemIndex === index ? event.target.checked : value
                        )
                      )
                    }
                  />
                  <span>{statement}</span>
                </label>
              ))}
            </div>
            <div className="score-line">
              <strong>{score} de 5</strong>
              <span>{score >= 4 ? "Critério atingido" : "Marque pelo menos quatro"}</span>
            </div>
            <label className="two-weeks">
              <input
                type="checkbox"
                checked={twoWeeks}
                onChange={(event) => setTwoWeeks(event.target.checked)}
              />
              <span>Confirmo que isso permaneceu verdadeiro por duas semanas.</span>
            </label>
            <div className="test-note">
              <strong>Ainda não?</strong>
              <span>
                Estenda o acompanhamento e revise o atrito, o contexto e o tamanho
                da ação.
              </span>
            </div>
            <div className="dialog-actions">
              <button
                className="button-secondary"
                onClick={() => {
                  onExtend(habit.id);
                  close();
                }}
              >
                Estender por 21 dias
              </button>
              <button
                className="button-primary"
                disabled={!approved}
                onClick={() => {
                  onConsolidate(habit.id);
                  close();
                }}
              >
                Marcar como consolidado
              </button>
            </div>
          </div>
        </>
      )}
    </dialog>
  );
}
