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
npm run check
```

O comando acima executa lint, testes unitários e build. O fluxo E2E deve ser
executado separadamente porque depende dos navegadores do Playwright:

```bash
npm run lint
npm run build
npm test
npm run test:e2e
```

## Deploy

A aplicação é publicada no Cloudflare Pages a partir da branch `main` do
GitHub. A configuração do projeto no Pages deve usar:

- Comando de build: `npm run check`;
- Diretório de saída: `dist`;
- Versão do Node.js: `22.16.0`;
- Diretório raiz: `/`.

O conteúdo salvo em `localStorage` pertence ao navegador e à origem atual. Por
isso, dados criados em `localhost`, em URLs de preview ou em outro domínio não
são transferidos para a URL de produção.

## Documentação

Os requisitos funcionais, regras do estimador, modelo de dados e direção visual
estão descritos em [SPEC.md](./SPEC.md).
