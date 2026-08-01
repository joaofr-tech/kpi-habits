import { AppHeader } from "../components/AppHeader";

export function NotFound() {
  return (
    <div className="page-shell">
      <AppHeader />
      <main className="dashboard">
        <section className="empty-state">
          <div className="empty-mark not-found-mark" aria-hidden="true">
            404
          </div>
          <div>
            <span className="eyebrow">Caminho desconhecido</span>
            <h2>Página não encontrada.</h2>
            <p>
              Este endereço não existe. Volte ao painel para continuar
              acompanhando seus hábitos.
            </p>
            <a className="button-primary" href="/">
              Voltar ao painel
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
