import { BrandMark } from "./BrandMark";
import { PlusIcon } from "./Icons";

interface AppHeaderProps {
  onAdd?: () => void;
  addLabel?: string;
  activeSection?: "habits" | "goals";
}

export function AppHeader({ onAdd, addLabel, activeSection }: AppHeaderProps) {
  return (
    <header className="app-header">
      <a href="/" className="brand" aria-label="KPI — início">
        <BrandMark className="brand-mark" />
      </a>
      {activeSection && (
        <nav className="primary-nav" aria-label="Seções principais">
          <a
            href="/"
            className={activeSection === "habits" ? "active" : ""}
            aria-current={activeSection === "habits" ? "page" : undefined}
          >
            Hábitos
          </a>
          <a
            href="/metas"
            className={activeSection === "goals" ? "active" : ""}
            aria-current={activeSection === "goals" ? "page" : undefined}
          >
            Metas
          </a>
        </nav>
      )}
      {onAdd && (
        <button className="add-button" onClick={onAdd} aria-label={addLabel}>
          <PlusIcon />
          <span>{addLabel}</span>
        </button>
      )}
    </header>
  );
}
