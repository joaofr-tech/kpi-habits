import { AppHeader } from "../components/AppHeader";
import { ArrowLeftIcon } from "../components/Icons";

export function Methodology() {
  return (
    <div className="page-shell methodology-page">
      <AppHeader />
      <main className="methodology">
        <a href="/" className="back-link"><ArrowLeftIcon /> Voltar ao painel</a>
        <header className="article-header">
          <span className="eyebrow">Metodologia</span>
          <h1>Repetir é<br />construir.</h1>
          <p>
            Um guia direto para transformar uma intenção em um comportamento
            que encontra seu lugar na rotina.
          </p>
        </header>

        <div className="article-layout">
          <nav className="article-nav" aria-label="Nesta página">
            <strong>Nesta página</strong>
            <a href="#fundamentos">01. Fundamentos</a>
            <a href="#projeto">02. O projeto</a>
            <a href="#estimador">03. O estimador</a>
            <a href="#automaticidade">04. Automaticidade</a>
            <a href="#smart">05. SMART</a>
            <a href="#referencias">06. Referências</a>
          </nav>
          <article className="article-content">
            <section id="fundamentos">
              <span className="section-number">01</span>
              <h2>Objetivos apontam.<br />Comportamentos avançam.</h2>
              <p>
                Um objetivo descreve um resultado desejado. Um hábito é uma ação
                observável, repetida em resposta a um contexto. “Ter mais saúde”
                aponta uma direção; “caminhar 15 minutos depois do almoço”
                descreve algo que pode realmente ser executado.
              </p>
              <div className="principle-grid">
                <div><strong>Gatilho</strong><p>Um evento claro que lembra a ação: terminar o café, fechar o notebook, escovar os dentes.</p></div>
                <div><strong>Contexto estável</strong><p>Repetir no mesmo cenário reduz decisões e fortalece a associação entre pista e resposta.</p></div>
                <div><strong>Menos atrito</strong><p>Prepare o ambiente antes. Deixe o livro aberto, a roupa pronta ou o aplicativo acessível.</p></div>
                <div><strong>Recompensa imediata</strong><p>Uma experiência positiva agora ajuda mais que uma recompensa distante e abstrata.</p></div>
              </div>
            </section>

            <section id="projeto">
              <span className="section-number">02</span>
              <h2>Proteja a continuidade,<br />não a perfeição.</h2>
              <p>
                A versão mínima é a menor execução que preserva a identidade do
                hábito em um dia difícil. Uma falha não zera o projeto: retorne
                na próxima oportunidade, examine o obstáculo e reduza o tamanho
                da ação quando necessário.
              </p>
              <blockquote>
                <strong>Dias do projeto</strong>
                <p>Contam o tempo corrido desde a criação. O primeiro dia é o dia 1 e nenhuma falha reinicia a contagem.</p>
              </blockquote>
              <blockquote>
                <strong>Consistência</strong>
                <p>É a proporção de execuções concluídas entre as oportunidades que já ocorreram. Dias de pausa e dias futuros não entram.</p>
              </blockquote>
            </section>

            <section id="estimador">
              <span className="section-number">03</span>
              <h2>O Dia-Alvo é uma janela,<br />não uma promessa.</h2>
              <p className="formula">D = 66 × C × A × E × H × R × √(7 ÷ F)</p>
              <p>
                A base de 66 dias vem do tempo mediano observado por Lally e
                colegas para atingir um patamar de automaticidade. A variação
                individual foi ampla; por isso o resultado serve para planejar
                atenção, não para prever uma data exata.
              </p>
              <dl className="factor-definitions">
                <div><dt>C</dt><dd><strong>Complexidade</strong><span>Esforço e quantidade de etapas da ação.</span></dd></div>
                <div><dt>A</dt><dd><strong>Atrito</strong><span>Preparação necessária antes de começar.</span></dd></div>
                <div><dt>E</dt><dd><strong>Estabilidade</strong><span>Regularidade do gatilho, lugar e horário.</span></dd></div>
                <div><dt>H</dt><dd><strong>Hábito concorrente</strong><span>Força de uma resposta antiga no mesmo contexto.</span></dd></div>
                <div><dt>R</dt><dd><strong>Recompensa ou aversão</strong><span>Como a ação é sentida imediatamente.</span></dd></div>
                <div><dt>F</dt><dd><strong>Frequência</strong><span>Quantas oportunidades reais existem por semana.</span></dd></div>
              </dl>
            </section>

            <section id="automaticidade">
              <span className="section-number">04</span>
              <h2>Teste o comportamento,<br />não o calendário.</h2>
              <p>
                Ao chegar ao Dia-Alvo, observe se o gatilho lembra a ação, se
                começar exige pouca negociação, se ela acontece com motivação
                normal, se uma falha não vira abandono e se pequenas mudanças
                não destroem a rotina.
              </p>
              <p>
                Quatro de cinco sinais, sustentados por duas semanas, indicam
                consolidação suficiente. Se ainda não for o caso, estenda por 21
                dias e revise contexto, atrito e tamanho da ação.
              </p>
            </section>

            <section id="smart">
              <span className="section-number">05</span>
              <h2>SMART, aplicado<br />ao comportamento.</h2>
              <ul className="smart-list">
                <li><strong>Specific</strong><span>Descreva uma ação concreta, não uma intenção ampla.</span></li>
                <li><strong>Measurable</strong><span>Defina uma execução binária: foi ou não foi realizada.</span></li>
                <li><strong>Achievable</strong><span>Escolha uma versão compatível com a rotina real.</span></li>
                <li><strong>Relevant</strong><span>Saiba qual objetivo pessoal esse comportamento apoia.</span></li>
                <li><strong>Time-bound</strong><span>Use o Dia-Alvo como período de atenção e avaliação.</span></li>
              </ul>
            </section>

            <section id="referencias">
              <span className="section-number">06</span>
              <h2>Para continuar.</h2>
              <ul className="references">
                <li>
                  <a href="https://doi.org/10.1002/ejsp.674" target="_blank" rel="noreferrer">
                    Lally et al. (2010), How are habits formed
                  </a>
                  <span>Estudo longitudinal sobre repetição e automaticidade.</span>
                </li>
                <li>
                  <a href="https://doi.org/10.1177/0146167212437423" target="_blank" rel="noreferrer">
                    Gardner et al. (2012), Self-Report Behavioural Automaticity Index
                  </a>
                  <span>Escala breve para avaliar automaticidade.</span>
                </li>
                <li>
                  <a href="https://community.mis.temple.edu/mis0855002fall2015/files/2015/10/S.M.A.R.T-Way-Management-Review.pdf" target="_blank" rel="noreferrer">
                    Doran (1981), There’s a S.M.A.R.T. way
                  </a>
                  <span>Texto que popularizou os critérios SMART.</span>
                </li>
                <li>
                  <a href="https://jamesclear.com/atomic-habits" target="_blank" rel="noreferrer">
                    Hábitos Atômicos, de James Clear
                  </a>
                  <span>Leitura de divulgação sobre ambiente, identidade e sistemas.</span>
                </li>
              </ul>
            </section>
          </article>
        </div>
        <a href="/" className="article-cta">
          <span>Leve a ideia para a rotina</span>
          <strong>Voltar aos meus hábitos →</strong>
        </a>
      </main>
      <footer className="app-footer">
        <p>Eu sou o melhor</p>
        <span>um dia de cada vez</span>
      </footer>
    </div>
  );
}
