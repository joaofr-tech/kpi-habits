import type { FactorKey, HabitFactorLevel, Weekday } from "../types";

export interface FactorOption {
  level: HabitFactorLevel;
  label: string;
  value: number;
  description: string;
}

export interface FactorDefinition {
  key: FactorKey;
  label: string;
  hint: string;
  options: FactorOption[];
}

const levels = (
  labels: Array<[HabitFactorLevel, string, number, string]>
): FactorOption[] =>
  labels.map(([level, label, value, description]) => ({
    level,
    label,
    value,
    description
  }));

export const FACTORS: FactorDefinition[] = [
  {
    key: "complexity",
    label: "Complexidade",
    hint: "Quanto esforço existe dentro do comportamento?",
    options: levels([
      ["VERY_LOW", "Muito simples", 0.7, "Ação curta, com uma única etapa."],
      ["LOW", "Simples", 0.85, "Poucas etapas e pouco esforço."],
      ["MEDIUM", "Média", 1, "Exige atenção moderada."],
      ["HIGH", "Complexa", 1.25, "Múltiplas etapas ou esforço relevante."],
      ["VERY_HIGH", "Muito complexa", 1.5, "Sequência extensa, deslocamento ou grande esforço."]
    ])
  },
  {
    key: "friction",
    label: "Atrito para começar",
    hint: "O que precisa acontecer antes de você começar?",
    options: levels([
      ["VERY_LOW", "Quase nenhum", 0.8, "Tudo disponível; você começa em segundos."],
      ["LOW", "Baixo", 0.9, "Existe uma preparação pequena."],
      ["MEDIUM", "Médio", 1, "Exige algumas decisões ou organização."],
      ["HIGH", "Alto", 1.2, "Exige preparo, deslocamento ou terceiros."],
      ["VERY_HIGH", "Muito alto", 1.4, "Existem muitas barreiras ou condições."]
    ])
  },
  {
    key: "contextStability",
    label: "Estabilidade do contexto",
    hint: "Quão previsível é o gatilho da ação?",
    options: levels([
      ["VERY_LOW", "Mesmo gatilho e lugar", 0.78, "Mesmo evento anterior e mesmo local."],
      ["LOW", "Mesmo gatilho", 0.88, "O local varia, mas a ação anterior é estável."],
      ["MEDIUM", "Horário aproximado", 1, "Existe apenas uma faixa de horário."],
      ["HIGH", "Contexto variável", 1.2, "Horário, local e situação mudam."],
      ["VERY_HIGH", "Sem gatilho definido", 1.4, "Depende de vontade ou oportunidade indefinida."]
    ])
  },
  {
    key: "competingHabit",
    label: "Hábito concorrente",
    hint: "Já existe outra resposta automática nesse contexto?",
    options: levels([
      ["VERY_LOW", "Nenhum", 0.9, "Não existe resposta dominante."],
      ["LOW", "Fraco", 1, "Existe uma alternativa, mas não é automática."],
      ["MEDIUM", "Moderado", 1.15, "Outra ação ocorre frequentemente."],
      ["HIGH", "Forte", 1.35, "A ação antiga ocorre quase sem pensar."],
      ["VERY_HIGH", "Muito forte", 1.55, "A ação antiga é automática e recompensadora."]
    ])
  },
  {
    key: "rewardAversion",
    label: "Recompensa ou aversão",
    hint: "Como a atividade é sentida imediatamente?",
    options: levels([
      ["VERY_LOW", "Muito agradável", 0.82, "Oferece prazer ou alívio imediato."],
      ["LOW", "Agradável", 0.92, "A experiência costuma ser positiva."],
      ["MEDIUM", "Neutra", 1, "Não é prazerosa nem desagradável."],
      ["HIGH", "Desagradável", 1.15, "Exige tolerar desconforto ou tédio."],
      ["VERY_HIGH", "Muito aversiva", 1.3, "Provoca forte resistência."]
    ])
  }
];

export const WEEKDAYS: Array<{ key: Weekday; short: string; label: string }> = [
  { key: "SUNDAY", short: "D", label: "Domingo" },
  { key: "MONDAY", short: "S", label: "Segunda-feira" },
  { key: "TUESDAY", short: "T", label: "Terça-feira" },
  { key: "WEDNESDAY", short: "Q", label: "Quarta-feira" },
  { key: "THURSDAY", short: "Q", label: "Quinta-feira" },
  { key: "FRIDAY", short: "S", label: "Sexta-feira" },
  { key: "SATURDAY", short: "S", label: "Sábado" }
];
