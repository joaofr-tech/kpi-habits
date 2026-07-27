import { BrandMark } from "./BrandMark";
import { PlusIcon } from "./Icons";

interface AppHeaderProps {
  onAdd?: () => void;
}

export function AppHeader({ onAdd }: AppHeaderProps) {
  return (
    <header className="app-header">
      <a href="/" className="brand" aria-label="KPI — início">
        <BrandMark className="brand-mark" />
      </a>
      {onAdd && (
        <button className="add-button" onClick={onAdd}>
          <PlusIcon />
          <span>Novo hábito</span>
        </button>
      )}
    </header>
  );
}
