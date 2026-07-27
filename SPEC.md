
## `SPEC.md`

```md
# 001 — KPI de Hábitos

## 1. Visão geral

### Objetivo

Criar uma aplicação web minimalista para calcular e acompanhar um KPI pessoal de formação de hábitos.

Cada hábito terá:

- Um nome;
- Uma frequência semanal;
- Um Dia-Alvo calculado;
- Uma data de início;
- Uma contagem de dias do projeto;
- Um histórico de oportunidades;
- Uma métrica de consistência.

A aplicação não deve tratar o Dia-Alvo como uma previsão exata. Ele representa o período durante o qual o usuário deverá proteger e acompanhar conscientemente o comportamento.

---

## 2. Escopo da primeira versão

A primeira versão deve permitir:

1. Visualizar hábitos cadastrados;
2. Criar um hábito;
3. Preencher as variáveis do estimador;
4. Calcular o Dia-Alvo;
5. Registrar a execução diária;
6. Visualizar dias do projeto;
7. Visualizar consistência;
8. Excluir um hábito;
9. Persistir os dados localmente;
10. Abrir uma página explicando a metodologia.

---

## 3. Fora do escopo

Não fazem parte desta versão:

- Autenticação;
- Sincronização entre dispositivos;
- Backend;
- Compartilhamento;
- Ranking;
- Notificações;
- Gamificação além do acompanhamento visual;
- Categorias;
- Metas anuais;
- Aplicação nativa;
- Inteligência artificial;
- Recomendações personalizadas automáticas.

---

# 4. Requisitos funcionais

## RF01 — Visualizar hábitos

Ao abrir a aplicação, o usuário deve visualizar todos os hábitos cadastrados.

Cada card deve mostrar, no mínimo:

- Nome do hábito;
- Dias do projeto;
- Dia-Alvo;
- Consistência;
- Estado do registro atual;
- Ação para registrar execução.

Quando não houver hábitos, deve ser exibido um estado vazio com orientação para criar o primeiro hábito.

---

## RF02 — Abrir criação de hábito

O cabeçalho deve possuir um botão de adicionar.

Ao clicar, deve ser aberto um modal de criação.

O primeiro modal deve conter:

- Nome do hábito;
- Detalhe obrigatório do hábito;
- Versão mínima opcional;
- Dias da semana em que o hábito será executado;
- Botão para configurar o estimador;
- Resultado calculado do Dia-Alvo;
- Botão para salvar;
- Botão para cancelar.

O hábito não pode ser salvo sem nome, detalhe, pelo menos um dia selecionado e o cálculo do Dia-Alvo.

O nome deve ser curto, como `Caminhar`. O detalhe deve tornar a ação observável, como `por 20 minutos depois do almoço`.

---

## RF03 — Configurar o estimador

Ao clicar em “Configurar estimador”, deve ser aberto um segundo modal ou uma segunda etapa do fluxo.

O usuário deverá preencher:

- Complexidade;
- Atrito para começar;
- Estabilidade do contexto;
- Hábito concorrente;
- Recompensa ou aversão.

Cada variável deve ser apresentada como uma seleção categórica.

Cada variável deve possuir exatamente três níveis: baixo ou favorável, médio ou neutro e alto ou desfavorável.

Não deve ser solicitado que o usuário digite manualmente os multiplicadores numéricos.

Cada opção deve mostrar:

- Nome do nível;
- Explicação curta;
- Exemplo quando necessário.

---

## RF04 — Calcular o Dia-Alvo

A aplicação deve calcular:

D = arredondar(66 × C × A × E × H × R × √(7 ÷ F))

O resultado deve ser apresentado como:

> Dia-Alvo: X dias

Também deve ser exibido um aviso curto:

> Esta é uma estimativa para acompanhamento, não uma previsão exata da consolidação do hábito.

---

## RF05 — Salvar hábito

Ao salvar um hábito:

- A data atual deve ser registrada como data de início;
- O Dia-Alvo deve ser persistido;
- Os valores selecionados no estimador devem ser persistidos;
- O hábito deve aparecer imediatamente no painel;
- Os dados devem continuar disponíveis após recarregar a página.

---

## RF06 — Contar dias do projeto

“Dias do projeto” deve representar a quantidade de dias corridos desde a criação do hábito.

A contagem:

- Não deve ser reiniciada após uma falha;
- Não deve depender de uma sequência perfeita;
- Deve ser calculada a partir da data de início;
- Deve considerar o primeiro dia como dia 1.

TODO: confirmar se o primeiro dia deve aparecer como `1` ou `0`.

Default sugerido: começar em `1`.

---

## RF07 — Registrar execução

O usuário deve conseguir registrar o resultado de uma oportunidade como:

- Concluído;
- Não concluído.

A aplicação não deve criar oportunidades nos dias que não pertencem à frequência planejada.

- O usuário deve selecionar diretamente os dias da semana durante a criação;
- Pelo menos um dia deve ser selecionado;
- A frequência semanal deve ser derivada da quantidade de dias selecionados;
- Não deve existir um segundo controle para informar a frequência.

---

## RF08 — Alterar registro atual

O registro do dia atual deve poder ser alterado entre:

- Não registrado;
- Concluído;
- Não concluído.

A alteração deve atualizar imediatamente a consistência.

---

## RF09 — Calcular consistência

A consistência deve ser calculada por:

consistência = execuções concluídas ÷ oportunidades ocorridas × 100

Exemplo:

- 24 execuções;
- 28 oportunidades;
- Consistência de 86%.

Dias futuros não devem entrar no cálculo.

Dias fora da frequência do hábito não devem entrar no cálculo.

Quando ainda não houver oportunidades:

- Exibir `—`;
- Não exibir `0%`, pois ainda não há dados suficientes.

---

## RF10 — Excluir hábito

O usuário deve conseguir excluir um hábito.

Antes da exclusão, deve haver confirmação clara.

Ao confirmar:

- O hábito deve ser removido;
- Seus registros devem ser removidos;
- A alteração deve ser persistida.

---

## RF11 — Abrir página metodológica

O canto inferior direito deve possuir um botão quadrado com bordas arredondadas e aparência de documento.

Ao clicar, o usuário deve ser direcionado para uma página metodológica.

A página deve explicar:

- O que é um hábito;
- A diferença entre objetivo e comportamento;
- Gatilho;
- Contexto estável;
- Redução de atrito;
- Versão mínima;
- Recompensa imediata;
- Retorno após uma falha;
- Dias do projeto;
- Consistência;
- Fórmula do Dia-Alvo;
- Significado de cada variável;
- Base de 66 dias;
- Limitações do estimador;
- Teste de automaticidade;
- Aplicação da metodologia SMART;
- Recomendação do livro “Hábitos Atômicos”;
- Estudos de referência.

O texto deve ser direto, legível e dividido em seções.

---

## RF12 — Retornar ao painel

A página metodológica deve possuir uma ação clara para retornar ao painel de hábitos.

---

# 5. Variáveis do estimador

## 5.1 Complexidade — C

Representa o esforço dentro do comportamento.

| Nível | Valor | Descrição |
|---|---:|---|
| Simples | 0,85 | Poucas etapas e pouco esforço |
| Média | 1,00 | Exige atenção moderada |
| Complexa | 1,25 | Múltiplas etapas ou esforço relevante |

---

## 5.2 Atrito para começar — A

Representa o esforço necessário antes do início da ação.

| Nível | Valor | Descrição |
|---|---:|---|
| Baixo | 0,90 | Existe uma preparação pequena |
| Médio | 1,00 | Exige algumas decisões ou organização |
| Alto | 1,20 | Exige preparação, deslocamento ou terceiros |

---

## 5.3 Estabilidade do contexto — E

Representa o quanto o gatilho e o contexto se repetem.

| Nível | Valor | Descrição |
|---|---:|---|
| Estável | 0,88 | O gatilho se repete de maneira previsível |
| Horário aproximado | 1,00 | Existe apenas uma faixa de horário |
| Variável | 1,20 | Horário, local e situação mudam |

---

## 5.4 Hábito concorrente — H

Representa a força de uma ação que já ocorre naquele contexto.

| Nível | Valor | Descrição |
|---|---:|---|
| Nenhum | 0,90 | Não existe resposta dominante |
| Moderado | 1,15 | Outra ação ocorre frequentemente |
| Forte | 1,35 | A ação antiga ocorre quase sem pensar |

---

## 5.5 Recompensa ou aversão — R

Representa a experiência imediata real da atividade.

| Nível | Valor | Descrição |
|---|---:|---|
| Agradável | 0,92 | A experiência costuma ser positiva |
| Neutra | 1,00 | Não é prazerosa nem desagradável |
| Desagradável | 1,15 | Exige tolerar desconforto ou tédio |

---

## 5.6 Frequência semanal — F

A frequência deve ser derivada da quantidade de dias da semana selecionados e, portanto, será um número inteiro entre 1 e 7.

Ela deve representar quantas vezes o hábito realmente será executado por semana, não uma frequência idealizada.

O formulário não deve solicitar a frequência separadamente.

---

# 6. Teste de automaticidade

Quando os dias do projeto alcançarem o Dia-Alvo, a aplicação deve indicar que o usuário pode realizar o teste de automaticidade.

O teste deve conter:

1. O gatilho faz lembrar da ação sem alarme;
2. Começar exige pouca negociação mental;
3. A ação é executada com motivação normal;
4. Uma falha isolada não provoca abandono;
5. A ação sobrevive a pequenas mudanças no dia.

O hábito pode ser considerado suficientemente consolidado quando:

- Pelo menos quatro das cinco afirmações forem verdadeiras;
- Essa condição permanecer verdadeira por duas semanas.

TODO: o acompanhamento das duas semanas será manual ou controlado pela aplicação.

Default para a primeira versão:

- A aplicação apenas apresenta o teste;
- O usuário confirma manualmente o resultado.

Se o teste não for aprovado:

- Oferecer a opção “Estender por 21 dias”;
- Somar 21 ao Dia-Alvo atual;
- Não reiniciar os dias do projeto;
- Recomendar revisão de atrito, contexto e tamanho da ação.

---

# 7. Aplicação da metodologia SMART

A metodologia SMART deve ser aplicada de maneira limitada ao planejamento do hábito.

## Specific

O cadastro deve separar o nome curto do hábito de seu detalhe observável.

Exemplo inadequado:

> Estudar programação.

Exemplo adequado:

> Nome: Resolver exercícios
> Detalhe: por 25 minutos depois do almoço.

## Measurable

O comportamento deve possuir uma definição binária de execução:

- Foi realizado;
- Não foi realizado.

## Achievable

A ação pode possuir uma versão mínima opcional, que representa o menor esforço aceito como suficiente para marcar uma oportunidade como concluída.

O detalhe descreve a execução desejada. A versão mínima não substitui esse padrão: ela evita o pensamento “tudo ou nada”, reduz a barreira de retorno em dias difíceis e preserva a repetição.

## Relevant

O usuário deve reconhecer qual objetivo o hábito apoia.

TODO: decidir se haverá um campo de objetivo.

Default sugerido: não incluir no cadastro inicial para preservar simplicidade.

## Time-bound

O Dia-Alvo oferece um período definido para acompanhamento e posterior avaliação.

---

# 8. Design

## 8.1 Direção visual

A interface deve ser:

- Minimalista;
- Majoritariamente preta e branca;
- Baseada em formas geométricas simples;
- Com uso reduzido de cores;
- Com boa hierarquia tipográfica;
- Responsiva.

---

## 8.2 Cabeçalho

### Lado esquerdo

Exibir a sigla:

> KPI

A sigla deve ser apresentada como um wordmark `KPI`:

- Em letras maiúsculas, brancas e de peso forte;
- Dentro de um bloco preto compacto, com cantos discretamente arredondados;
- Com desenho geométrico, terminais retos e diagonais afiadas;
- Sem conexões, ornamentos ou detalhes que prejudiquem a leitura imediata;
- Vetorial e responsiva, permanecendo legível em telas pequenas;
- A redução para favicon deve reutilizar o bloco preto e o mesmo gesto anguloso.

### Lado direito

Exibir um botão de adicionar.

O botão deve:

- Possuir rótulo acessível;
- Abrir o modal de criação;
- Ter área de clique confortável;
- Exibir estado de foco.

---

## 8.3 Conteúdo principal

O conteúdo principal deve apresentar os cards dos hábitos.

Os cards ou o estado vazio devem começar imediatamente após o cabeçalho. Não deve existir um bloco promocional, slogan ou mensagem introdutória entre o cabeçalho e os hábitos.

Em telas desktop comuns, o cabeçalho, o estado vazio ou até dois cards e o rodapé devem caber na altura disponível sem exigir rolagem. Em telas pequenas ou quando houver mais conteúdo, a rolagem deve permanecer disponível para evitar cortes.

Os cards devem permitir identificar rapidamente:

- Qual é o hábito;
- Quantos dias transcorreram;
- Qual é o Dia-Alvo;
- Qual é a consistência;
- Se o registro atual foi feito.

A informação mais importante deve possuir maior destaque visual.

Default sugerido de hierarquia:

1. Nome;
2. `X / Y dias`;
3. Consistência;
4. Controle de execução.

---

## 8.4 Card de hábito

### Densidade responsiva

Em desktop amplo, os cards devem utilizar a variação **Atual condensada**:

- Grade de três colunas, com duas colunas em larguras intermediárias;
- Padding interno de 20 px;
- Linha compacta com percentual de progresso;
- Linha de métricas com Consistência, Dia-Alvo e Hoje;
- Controles de registro com altura mínima de 44 px.

Em dispositivos móveis, os cards devem utilizar a variação **Compacta estrutural 01**:

- Uma única coluna;
- Remover a linha de três métricas;
- Exibir `Dia X de Y` e `Z% consistência` na mesma linha;
- O estado atual deve ser comunicado pelos controles selecionados;
- Manter a barra de progresso e os controles com altura mínima de 44 px.

Quando existir, a versão mínima deve aparecer em uma linha curta no formato `Mínimo: descrição`.

Cada card deve conter:

- Nome do hábito;
- Dias do projeto;
- Dia-Alvo;
- Consistência;
- Botão “Concluído”;
- Botão ou opção “Não concluído”;
- Menu ou ação de exclusão.

Exemplo:

> Estudar JavaScript  
> 18 de 67 dias  
> 86% de consistência

O card deve ser compreensível sem abrir uma tela secundária.

---

## 8.5 Rodapé

O rodapé deve exibir centralizada horizontalmente a frase:

> Eu sou o melhor

A frase deve possuir algum destaque em relação aos demais textos.

O destaque pode utilizar:

- Peso tipográfico;
- Tamanho;
- Espaçamento;
- Moldura;
- Contraste.

Não utilizar animação chamativa.

---

## 8.6 Botão metodológico

No canto inferior direito deve existir um botão:

- Quadrado;
- Com bordas arredondadas;
- Com aparência de documento;
- Com rótulo acessível;
- Responsável por abrir a página metodológica.

Em dispositivos móveis, o botão não deve encobrir conteúdo ou ações dos cards.

---

## 8.7 Modais

Os modais devem:

- Possuir título;
- Possuir botão de fechar;
- Permitir fechamento com Escape;
- Manter foco dentro do modal;
- Restaurar o foco ao elemento anterior;
- Ser utilizáveis em telas pequenas;
- Exibir mensagens de validação próximas aos campos.

---

# 9. Modelo de dados

```ts
type HabitFactorLevel = "LOW" | "MEDIUM" | "HIGH";

interface HabitFactors {
  complexity: HabitFactorLevel;
  friction: HabitFactorLevel;
  contextStability: HabitFactorLevel;
  competingHabit: HabitFactorLevel;
  rewardAversion: HabitFactorLevel;
}

interface HabitSchedule {
  weekdays: Weekday[];
}

type Weekday =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

type HabitLogStatus = "COMPLETED" | "MISSED";

interface HabitLog {
  date: string;
  status: HabitLogStatus;
}

interface Habit {
  id: string;
  name: string;
  details: string;
  createdAt: string;
  targetDays: number;
  factors: HabitFactors;
  schedule: HabitSchedule;
  minimumVersion?: string;
  logs: HabitLog[];
  automaticityStatus:
    | "TRACKING"
    | "READY_FOR_TEST"
    | "CONSOLIDATED"
    | "EXTENDED";
}
