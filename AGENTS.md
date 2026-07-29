# AGENTS.md

## Objetivo do projeto

Desenvolver uma aplicação web minimalista para criação e acompanhamento de hábitos e metas pessoais simples.

A aplicação deve permitir que o usuário:

1. Cadastre um hábito;
2. Preencha as variáveis do estimador de consolidação;
3. Receba um Dia-Alvo calculado;
4. Registre diariamente se executou ou não o hábito;
5. Acompanhe os dias transcorridos e sua consistência;
6. Cadastre e consulte metas pessoais;
7. Consulte a metodologia utilizada.

O produto é um rastreador pessoal simples. Não deve evoluir para uma plataforma social, aplicativo de tarefas ou sistema completo de produtividade.

---

## Fonte de verdade

Antes de implementar qualquer tarefa, leia:

- `SPEC.md`;
- A tarefa específica em desenvolvimento, caso exista.

Em caso de conflito:

1. `SPEC.md` define o comportamento do produto;
2. A tarefa específica detalha a entrega atual;
3. O código existente define apenas decisões técnicas já consolidadas.

Não altere arquivos de especificação sem avisar.

---

## Fluxo obrigatório de desenvolvimento

Antes de implementar:

1. Resuma o objetivo da tarefa;
2. Liste os arquivos que pretende criar ou alterar;
3. Identifique ambiguidades;
4. Proponha defaults explícitos para pontos indefinidos;
5. Aguarde aprovação quando a decisão alterar o comportamento do produto.

Depois da aprovação:

1. Implemente somente a tarefa atual;
2. Não adicione funcionalidades não solicitadas;
3. Execute os testes;
4. Execute lint;
5. Execute build;
6. Informe objetivamente o que foi alterado e validado.

---

## Restrições de escopo

Não implementar sem solicitação explícita:

- Login;
- Contas de usuário;
- Sincronização em nuvem;
- Compartilhamento social;
- Ranking;
- Inteligência artificial;
- Notificações push;
- Sistema de recompensas;
- Categorias de hábitos;
- Calendário avançado;
- Gráficos complexos;
- Integração com dispositivos;
- Edição colaborativa;
- Backend próprio;
- Banco de dados remoto.

---

## Princípios técnicos

### Simplicidade

- Preferir a menor solução que cumpra a especificação;
- Evitar abstrações antecipadas;
- Evitar bibliotecas quando a plataforma já resolver o problema;
- Não criar camadas sem uma necessidade concreta;
- Não generalizar componentes usados somente uma vez.

### Rastreabilidade

- Cada regra de negócio deve possuir um local claro;
- A fórmula não deve ficar espalhada em componentes;
- Valores dos multiplicadores devem estar centralizados;
- Estados persistidos devem possuir tipos definidos;
- Nomes devem refletir a linguagem do domínio.

### Separação de responsabilidades

Separar, no mínimo:

- Interface;
- Estado da aplicação;
- Persistência;
- Cálculo do Dia-Alvo;
- Navegação;
- Conteúdo metodológico.

A interface não deve implementar diretamente a fórmula.

---

## Terminologia do domínio

Use os seguintes nomes de forma consistente:

- **Hábito:** comportamento específico acompanhado;
- **Dia-Alvo:** número estimado de dias de acompanhamento;
- **Dias do projeto:** dias corridos desde o início;
- **Oportunidade:** dia em que o hábito estava planejado;
- **Execução:** oportunidade concluída;
- **Consistência:** execuções divididas pelas oportunidades;
- **Registro diário:** resultado de uma oportunidade;
- **Consolidado:** hábito aprovado no teste de automaticidade;
- **Estendido:** hábito cujo Dia-Alvo recebeu mais 21 dias.

Não usar “streak” como métrica principal.

---

## Fórmula

A regra de negócio deve utilizar:

D = arredondar(66 × C × A × E × H × R × √(7 ÷ F))

Onde:

- `D`: Dia-Alvo;
- `C`: complexidade;
- `A`: atrito para começar;
- `E`: estabilidade do contexto;
- `H`: hábito concorrente;
- `R`: recompensa ou aversão;
- `F`: frequência semanal.

Regras:

- O resultado deve ser um número inteiro;
- A frequência deve estar entre 1 e 7;
- A fórmula deve existir em uma função pura;
- Os multiplicadores devem ser constantes tipadas;
- O cálculo deve possuir testes unitários;
- A interface deve mostrar o resultado como estimativa;
- Nunca afirmar que o hábito estará cientificamente consolidado exatamente naquele dia.

---

## Persistência

Na primeira versão:

- Usar armazenamento local do navegador;
- Persistir hábitos, registros e metas;
- Restaurar os dados após recarregar a página;
- Não depender de servidor;
- Tratar dados ausentes ou inválidos sem quebrar a aplicação.

TODO: definir a estratégia final de versionamento dos dados persistidos.

Default sugerido:

```ts
interface AppData {
  version: 1;
  habits: Habit[];
}
```
