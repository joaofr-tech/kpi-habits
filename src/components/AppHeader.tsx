import { BrandMark } from "./BrandMark";
import { PlusIcon } from "./Icons";
import { AppLink } from "../navigation";

interface AppHeaderProps {
  onAdd?: () => void;
  addLabel?: string;
  activeSection?: "habits" | "goals";
}

export function AppHeader({ onAdd, addLabel, activeSection }: AppHeaderProps) {
  return (
    <header className="app-header">
      <AppLink href="/" className="brand" aria-label="Habitus — início">
        <BrandMark className="brand-mark" />
      </AppLink>
      {activeSection && (
        <nav className="primary-nav" aria-label="Seções principais">
          <AppLink
            href="/"
            className={activeSection === "habits" ? "active" : ""}
            aria-current={activeSection === "habits" ? "page" : undefined}
          >
            Hábitos
          </AppLink>
          <AppLink
            href="/metas"
            className={activeSection === "goals" ? "active" : ""}
            aria-current={activeSection === "goals" ? "page" : undefined}
          >
            Metas
          </AppLink>
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
