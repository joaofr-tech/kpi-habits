import { useEffect, useRef } from "react";
import { triggerHapticFeedback } from "../ui/haptics";
import { CloseIcon } from "./Icons";

interface DeleteConfirmationDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmationDialog({
  open,
  title,
  description,
  confirmLabel,
  onCancel,
  onConfirm
}: DeleteConfirmationDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog?.open) dialog?.showModal();
    if (!open && dialog?.open) dialog.close();
  }, [open]);

  function confirm() {
    onConfirm();
    triggerHapticFeedback();
    onCancel();
  }

  return (
    <dialog
      ref={dialogRef}
      className="dialog confirmation-dialog"
      aria-labelledby="delete-confirmation-title"
      aria-describedby="delete-confirmation-description"
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      onClose={() => {
        if (open) onCancel();
      }}
    >
      <div className="dialog-topline">
        <div>
          <span className="eyebrow">Confirmar exclusão</span>
          <h2 id="delete-confirmation-title">{title}</h2>
        </div>
        <button className="icon-button" onClick={onCancel} aria-label="Fechar">
          <CloseIcon />
        </button>
      </div>
      <div className="dialog-body confirmation-body">
        <p id="delete-confirmation-description">{description}</p>
        <div className="dialog-actions">
          <button className="button-secondary" onClick={onCancel} autoFocus>
            Cancelar
          </button>
          <button className="button-danger" onClick={confirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
