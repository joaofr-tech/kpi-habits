import type { FactorKey, HabitFactorLevel, Weekday } from "../types";

export interface FactorOption {
  level: HabitFactorLevel;
  label: string;
  description: string;
}

export interface FactorDefinition {
  key: FactorKey;
  label: string;
  hint: string;
  options: FactorOption[];
}

const levels = (
  labels: Array<[HabitFactorLevel, string, string]>
): FactorOption[] =>
  labels.map(([level, label, description]) => ({
    level,
    label,
    description
  }));

export const FACTORS: FactorDefinition[] = [
  {
    key: "complexity",
    label: "Complexidade",
    hint: "Quanto esforço existe dentro do comportamento?",
    options: levels([
      ["LOW", "Simples", "Poucas etapas e pouco esforço."],
      ["MEDIUM", "Média", "Exige atenção moderada."],
      ["HIGH", "Complexa", "Múltiplas etapas ou esforço relevante."]
    ])
  },
  {
    key: "friction",
    label: "Atrito para começar",
    hint: "O que precisa acontecer antes de você começar?",
    options: levels([
      ["LOW", "Baixo", "Existe uma preparação pequena."],
      ["MEDIUM", "Médio", "Exige algumas decisões ou organização."],
      ["HIGH", "Alto", "Exige preparo, deslocamento ou terceiros."]
    ])
  },
  {
    key: "contextStability",
    label: "Estabilidade do contexto",
    hint: "Quão previsível é o gatilho da ação?",
    options: levels([
      ["LOW", "Estável", "O gatilho se repete de maneira previsível."],
      ["MEDIUM", "Horário aproximado", "Existe apenas uma faixa de horário."],
      ["HIGH", "Variável", "Horário, local e situação mudam."]
    ])
  },
  {
    key: "competingHabit",
    label: "Hábito concorrente",
    hint: "Já existe outra resposta automática nesse contexto?",
    options: levels([
      ["LOW", "Nenhum", "Não existe resposta dominante."],
      ["MEDIUM", "Moderado", "Outra ação ocorre frequentemente."],
      ["HIGH", "Forte", "A ação antiga ocorre quase sem pensar."]
    ])
  },
  {
    key: "rewardAversion",
    label: "Recompensa ou aversão",
    hint: "Como a atividade é sentida imediatamente?",
    options: levels([
      ["LOW", "Agradável", "A experiência costuma ser positiva."],
      ["MEDIUM", "Neutra", "Não é prazerosa nem desagradável."],
      ["HIGH", "Desagradável", "Exige tolerar desconforto ou tédio."]
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
