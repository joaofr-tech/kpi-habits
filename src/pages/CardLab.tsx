import { AppHeader } from "../components/AppHeader";
import { TrashIcon } from "../components/Icons";

const fixture = {
  name: "Caminhar",
  details: "por 20 minutos depois do almoço",
  minimumVersion: "caminhar por 5 minutos",
  currentDay: 18,
  targetDays: 67,
  consistency: 86
};

function CardHeader() {
  return (
    <div className="lab-card-head">
      <div>
        <h2>{fixture.name}</h2>
        <p>{fixture.details}</p>
      </div>
      <button type="button" className="lab-icon-button" aria-label="Excluir Caminhar">
        <TrashIcon />
      </button>
    </div>
  );
}

function MinimumVersion() {
  return (
    <p className="lab-minimum">
      <strong>Mínimo:</strong> {fixture.minimumVersion}
    </p>
  );
}

function ProgressBar() {
  const progress = Math.round(
    (fixture.currentDay / fixture.targetDays) * 100
  );
  return (
    <div
      className="lab-progress"
      role="progressbar"
      aria-label="Progresso até o Dia-Alvo"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
    >
      <span style={{ width: `${progress}%` }} />
    </div>
  );
}

function Actions() {
  return (
    <div className="lab-actions" aria-label="Registro de hoje">
      <button type="button"><span aria-hidden="true">✓</span> Concluído</button>
      <button type="button"><span aria-hidden="true">×</span> Não concluído</button>
    </div>
  );
}

function StructuralCard() {
  return (
    <article className="lab-card lab-card-structural" data-variant="structural">
      <CardHeader />
      <MinimumVersion />
      <div className="lab-summary">
        <strong>Dia {fixture.currentDay} de {fixture.targetDays}</strong>
        <span>{fixture.consistency}% consistência</span>
      </div>
      <ProgressBar />
      <Actions />
    </article>
  );
}

function CondensedCard() {
  return (
    <article className="lab-card lab-card-condensed" data-variant="condensed">
      <CardHeader />
      <MinimumVersion />
      <div className="lab-progress-copy">
        <span>{fixture.currentDay} de {fixture.targetDays} dias</span>
        <strong>{Math.round((fixture.currentDay / fixture.targetDays) * 100)}%</strong>
      </div>
      <ProgressBar />
      <div className="lab-metrics">
        <div><span>Consistência</span><strong>{fixture.consistency}%</strong></div>
        <div><span>Dia-Alvo</span><strong>{fixture.targetDays}</strong></div>
        <div><span>Hoje</span><strong>Pendente</strong></div>
      </div>
      <span className="lab-action-label">Registro de hoje</span>
      <Actions />
    </article>
  );
}

function TargetCard() {
  const remaining = fixture.targetDays - fixture.currentDay;
  return (
    <article className="lab-card lab-card-target" data-variant="target">
      <CardHeader />
      <MinimumVersion />
      <div className="lab-target">
        <span>Dia-Alvo em</span>
        <strong>{remaining} dias</strong>
      </div>
      <ProgressBar />
      <Actions />
    </article>
  );
}

const variants = [
  {
    id: "01",
    title: "Compacta estrutural",
    description: "Sem repetições, com progresso e consistência na mesma linha.",
    card: <StructuralCard />
  },
  {
    id: "02",
    title: "Atual condensada",
    description: "A hierarquia atual com espaços e controles reduzidos.",
    card: <CondensedCard />
  },
  {
    id: "03",
    title: "Foco no Dia-Alvo",
    description: "Contagem regressiva em destaque, sem consistência ou status.",
    card: <TargetCard />
  }
];

export function CardLab() {
  return (
    <div className="card-lab-page">
      <AppHeader />
      <main className="card-lab">
        <header className="card-lab-intro">
          <span>Laboratório de interface</span>
          <h1>Densidade dos cards</h1>
          <p>Mesmos dados, três hierarquias. Compare ritmo, leitura e espaço.</p>
        </header>
        <section className="card-lab-grid" aria-label="Comparação de cards">
          {variants.map((variant) => (
            <div className="lab-variant" key={variant.id}>
              <div className="lab-variant-copy">
                <span>{variant.id}</span>
                <h2>{variant.title}</h2>
                <p>{variant.description}</p>
              </div>
              {variant.card}
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
