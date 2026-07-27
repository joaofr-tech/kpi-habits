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
      ["LOW", "Simples", 0.85, "Poucas etapas e pouco esforço."],
      ["MEDIUM", "Média", 1, "Exige atenção moderada."],
      ["HIGH", "Complexa", 1.25, "Múltiplas etapas ou esforço relevante."]
    ])
  },
  {
    key: "friction",
    label: "Atrito para começar",
    hint: "O que precisa acontecer antes de você começar?",
    options: levels([
      ["LOW", "Baixo", 0.9, "Existe uma preparação pequena."],
      ["MEDIUM", "Médio", 1, "Exige algumas decisões ou organização."],
      ["HIGH", "Alto", 1.2, "Exige preparo, deslocamento ou terceiros."]
    ])
  },
  {
    key: "contextStability",
    label: "Estabilidade do contexto",
    hint: "Quão previsível é o gatilho da ação?",
    options: levels([
      ["LOW", "Estável", 0.88, "O gatilho se repete de maneira previsível."],
      ["MEDIUM", "Horário aproximado", 1, "Existe apenas uma faixa de horário."],
      ["HIGH", "Variável", 1.2, "Horário, local e situação mudam."]
    ])
  },
  {
    key: "competingHabit",
    label: "Hábito concorrente",
    hint: "Já existe outra resposta automática nesse contexto?",
    options: levels([
      ["LOW", "Nenhum", 0.9, "Não existe resposta dominante."],
      ["MEDIUM", "Moderado", 1.15, "Outra ação ocorre frequentemente."],
      ["HIGH", "Forte", 1.35, "A ação antiga ocorre quase sem pensar."]
    ])
  },
  {
    key: "rewardAversion",
    label: "Recompensa ou aversão",
    hint: "Como a atividade é sentida imediatamente?",
    options: levels([
      ["LOW", "Agradável", 0.92, "A experiência costuma ser positiva."],
      ["MEDIUM", "Neutra", 1, "Não é prazerosa nem desagradável."],
      ["HIGH", "Desagradável", 1.15, "Exige tolerar desconforto ou tédio."]
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
