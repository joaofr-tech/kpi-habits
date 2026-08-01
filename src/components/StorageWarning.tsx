interface StorageWarningProps {
  visible: boolean;
}

export function StorageWarning({ visible }: StorageWarningProps) {
  if (!visible) return null;

  return (
    <div className="storage-warning" role="alert">
      <strong>Não foi possível salvar neste navegador.</strong>
      <span>
        Você pode continuar usando a aplicação, mas as alterações desta sessão
        podem ser perdidas ao recarregar a página.
      </span>
    </div>
  );
}
