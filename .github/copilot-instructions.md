## Contexto rápido

Este repositório é uma aplicação React + Electron (UI web + processo main) que integra com o `flow-test-engine` CLI.
Principais partes:
- `src/` – código React/renderer (entry: `src/index.tsx`, páginas em `src/pages/`).
- `electron/` – código do processo main e preload (`electron/main.ts`, `electron/preload.ts`).
- `src/services/` – serviços que usam a API exposta pelo preload (ex.: `flowTestElectron.service.ts`, `flowTestIntegrated.service.ts`, `flowTestParser.service.ts`).
- `dist/` e `dist-electron/` – artefatos de build; `package.json` usa `electron-builder` para empacotar.

## Objetivo para agentes de codificação
Fornecer instruções rápidas e acionáveis para trabalhar aqui: como rodar, onde alterar IPC, padrões de parsing, e convenções específicas do projeto.

## Comandos importantes
- Desenvolvimento (renderer + electron): `npm run dev` (executa `dev:renderer` + `dev:electron`).
- Apenas renderer (rsbuild): `npm run dev:renderer` -> usa `rsbuild dev`.
- Apenas electron (compila ts): `npm run dev:electron` -> `tsc -p electron/tsconfig.json && electron .`.
- Build produção: `npm run build` (executa `build:renderer` e `build:electron`).
- Empacotar: `npm run package` (usa `electron-builder`).
- Testes: `npm run test` (Jest). Type-check: `npm run type-check`.

URLs / output
- Em dev o renderer é servido em `http://localhost:3000` (veja `electron/main.ts` para `RENDERER_URL`).
- Arquivos incluídos no build estão listados em `package.json` → `build.files` (`dist/**/*`, `dist-electron/**/*`).

## Padrões e pontos sensíveis (faça mudanças aqui com cuidado)
- IPC/Bridge: a API segura exposta ao renderer está em `electron/preload.ts` e é consumida por `src/services/*`. Alterações na API devem sincronizar `preload.ts`, `main.ts` e os serviços em `src/services`.
  - Canais principais: `execute-flow-test`, `stop-execution`, `get-version`, `get-app-version`, `select-directory`, `select-file`, `read-file`, `write-file`.
  - Eventos emitidos: `execution-started`, `execution-log`, `execution-complete`, `execution-error`.
- Parser de saída do CLI: `src/services/flowTestParser.service.ts` depende de padrões textuais (ex.: linhas que começam com `[STEP` ou símbolos como `✓`/`✗`). Modificações no formato do CLI exigem atualizar esse parser.
- Execução CLI: `electron/main.ts` usa `spawn('npx', ['flow-test-engine', ...])` — espera que `flow-test-engine` seja acessível via `npx` no ambiente de execução.

## Convenções do código
- Organização: `atoms/`, `molecules/`, `organisms/` dentro de `src/components` (inspirado em Atomic Design).
- Estilo: Tailwind + Styled Components; global styles em `src/styles/globals.css`.
- Tipos: TypeScript; rode `npm run type-check` após mudanças de tipos.

## Sistema de Sidebar (TASK_001 - Mini-Sidebar VS Code-style)
O sidebar foi refatorado para um sistema mini-sidebar persistente inspirado no VS Code:
- **MiniSidebar** (`src/components/organisms/Sidebar/MiniSidebar.tsx`): Barra vertical de 60px com ícones para navegação
- **SidebarContentArea** (`src/components/organisms/Sidebar/SidebarContentArea.tsx`): Área de conteúdo dinâmica (280-600px) ao lado dos ícones
- **Views dinâmicas**: CollectionsView, EnvironmentsView, HistoryView, SettingsView
- **Estado gerenciado**: Redux slice `sidebarSlice` controla `activeView`, `sidebarWidth`, etc.
- **Integração**: `MainWorkspace.tsx` renderiza `<MiniSidebar>` + `<SidebarContentArea>` lado a lado

**Padrões importantes:**
- Views são lazy-loaded e preservam estado ao alternar
- Ícones usam react-icons (VscFiles, VscSettings, etc.)
- Tooltips aparecem no hover para ícones não-ativos
- Tema dark/light aplicado consistentemente
- Drag handle para resize da content area

## Onde procurar exemplos
- Expor/consumir API IPC: `electron/preload.ts` (exposição) ↔ `src/services/flowTestElectron.service.ts` (consumo).
- Implementação do processo principal e CSP: `electron/main.ts`.
- Parsing de logs/steps: `src/services/flowTestParser.service.ts`.
- Pages e UI que iniciam execuções: `src/pages/TestRunnerPage.tsx` e `src/pages/TestRunnerWithParsingPage.tsx` (procure por chamadas a `executeFlowTest`, `stopExecution`).
- **Sistema de Sidebar**: `src/components/organisms/Sidebar/` (MiniSidebar, SidebarContentArea, views individuais).
- **Estado do Sidebar**: `src/store/slices/sidebarSlice.ts` e tipos em `src/types/sidebar.types.ts`.
- **Integração no Layout**: `src/pages/MainWorkspace.tsx` (como MiniSidebar + SidebarContentArea são renderizados).

## Dicas práticas para Pull Requests
- Alterações em IPC: documente o novo contrato em `electron/preload.ts` e atualize todos os consumidores em `src/services`.
- Alterações no parser: adicione testes unitários para `FlowTestOutputParser` (Jest) cobrindo novos padrões textuais.
- Dev & Debug: para inspecionar logs do processo main, rode `npm run dev` e abra DevTools (o main abre devtools em modo dev). Para testar integrações CLI, garanta que `npx flow-test-engine --version` funcione localmente.

## Rápido checklist antes de PR
- Builda `npm run build` sem erros.
- Type-check `npm run type-check` PASS.
- Testes unitários (`npm run test`) (se arquivos de teste afetados).
- Se tocar IPC, atualizar `electron/preload.ts` e `src/services/*` juntos e comentar as razões no PR.

Se algo importante não estiver coberto aqui (ex.: scripts de CI, dependências nativas ou variáveis de ambiente), diga o que você precisa que eu aprofunde e eu atualizo este arquivo.
