# KPI Hábitos

Aplicação web minimalista para calcular e acompanhar um KPI pessoal de
formação de hábitos.

Cada hábito possui uma frequência semanal, um período estimado de
acompanhamento, registros por oportunidade e uma métrica de consistência. Todo
o conteúdo permanece no navegador por meio do `localStorage`.

## Tecnologias

- React 19 e TypeScript
- Vite
- Vitest e Testing Library
- Playwright

## Executar localmente

```bash
npm install
npm run dev
```

## Validar o projeto

```bash
npm run lint
npm run build
npm test
npm run test:e2e
```

## Documentação

Os requisitos funcionais, regras do estimador, modelo de dados e direção visual
estão descritos em [SPEC.md](./SPEC.md).
