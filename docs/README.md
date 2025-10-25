# 📚 Flow Test Web Documentation

## 🎯 Visão Geral

**Flow Test Web** é uma aplicação Electron desktop para executar e visualizar testes de API usando o **flow-test-engine** com interface gráfica moderna.

---

## 🗂️ Índice de Documentação

### 🚀 Getting Started
- **[ELECTRON_README.md](./ELECTRON_README.md)** - Arquitetura Electron e comandos básicos
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Guia completo de testes passo a passo

### 🔐 Segurança
- **[ELECTRON_SECURITY.md](./ELECTRON_SECURITY.md)** - Configuração de CSP e boas práticas
- **[ELECTRON_ERROR_FIXES.md](./ELECTRON_ERROR_FIXES.md)** - Troubleshooting de erros comuns

### 🏗️ Implementação
- **[INTEGRATION_COMPLETE.md](./INTEGRATION_COMPLETE.md)** - Guia de integração TestResultViewer + Parsing
- **[MIGRATION_SPRINT_SUMMARY.md](./MIGRATION_SPRINT_SUMMARY.md)** - Resumo completo da migração Electron

---

## 🏃 Quick Start

### Instalação
```bash
cd /Users/marcusp/Documents/flow-test/web
npm install
```

### Desenvolvimento
```bash
npm run dev
# Abre Electron app + React dev server (port 3000)
```

### Build & Package
```bash
npm run build        # Build para produção
npm run package      # Empacotar para macOS/Windows/Linux
```

---

## 🧭 Navegação Rápida por Tópico

### "Como executar testes?"
→ **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Seção "Quick Start"

### "Como funciona a arquitetura Electron?"
→ **[ELECTRON_README.md](./ELECTRON_README.md)** - Seção "Architecture"

### "Como funciona o parsing de logs?"
→ **[INTEGRATION_COMPLETE.md](./INTEGRATION_COMPLETE.md)** - Seção "FlowTestOutputParser"

### "Erros no console, o que fazer?"
→ **[ELECTRON_ERROR_FIXES.md](./ELECTRON_ERROR_FIXES.md)** - Troubleshooting completo

### "Como configurar CSP para dev/prod?"
→ **[ELECTRON_SECURITY.md](./ELECTRON_SECURITY.md)** - Seção "CSP Configuration"

### "Resumo de tudo que foi implementado?"
→ **[MIGRATION_SPRINT_SUMMARY.md](./MIGRATION_SPRINT_SUMMARY.md)** - Overview completo

---

## 📁 Estrutura do Projeto

```
/web/
├── electron/                    # Electron main & preload
│   ├── main.ts                  # Main process (IPC, window)
│   ├── preload.ts               # Secure bridge (contextBridge)
│   └── tsconfig.json
│
├── src/
│   ├── components/              # React components
│   │   ├── organisms/
│   │   │   └── TestRunnerWithParsing.tsx  # UI principal
│   │   ├── TestResultViewer.tsx           # Visualização de steps
│   │   └── ...
│   │
│   ├── hooks/
│   │   └── useFlowTestExecution.ts        # Hook de execução
│   │
│   ├── services/
│   │   ├── flowTestParser.service.ts      # Parser de CLI output
│   │   └── flowTestIntegrated.service.ts  # Service IPC + parsing
│   │
│   ├── pages/
│   │   └── TestRunnerWithParsingPage.tsx  # Page /runner
│   │
│   └── types/
│       └── testExecution.types.ts         # TypeScript types
│
├── docs/                        # Esta documentação
│   ├── README.md                # Você está aqui
│   ├── ELECTRON_README.md
│   ├── ELECTRON_SECURITY.md
│   ├── ELECTRON_ERROR_FIXES.md
│   ├── INTEGRATION_COMPLETE.md
│   ├── MIGRATION_SPRINT_SUMMARY.md
│   └── TESTING_GUIDE.md
│
└── package.json
```

---

## 🎯 Principais Funcionalidades

### ✅ Implementadas
- [x] Execução de testes via Electron IPC
- [x] Parsing de CLI output em tempo real
- [x] Visualização de results com TestResultViewer
- [x] Logs em tempo real
- [x] Progress bar visual
- [x] File/folder browser
- [x] Stop execution
- [x] Clear logs/results
- [x] Status badges
- [x] Content Security Policy (dev/prod)
- [x] Monaco Editor support
- [x] TypeScript strict mode

### 🔄 Pendentes
- [ ] Export de resultados (JSON/HTML)
- [ ] Histórico de execuções
- [ ] Filtros e pesquisa em logs
- [ ] Configurações de CLI flags (priority, tags)
- [ ] Templates de execução
- [ ] Métricas e dashboards

---

## 🔑 Conceitos Chave

### IPC (Inter-Process Communication)
Comunicação entre **Main Process** (Node.js) e **Renderer Process** (React).

**Main → Renderer**: `event.sender.send('event-name', data)`
**Renderer → Main**: `window.flowTestAPI.methodName()`

Ver: **[ELECTRON_README.md](./ELECTRON_README.md)**

---

### Parsing em Tempo Real
Logs do CLI são parseados **linha por linha** durante execução.

**Fluxo**:
1. CLI emite log → Main Process captura
2. Main envia via IPC → Renderer recebe
3. Parser processa → Detecta padrão (step, request, etc.)
4. Callback → React state atualiza → UI re-renderiza

Ver: **[INTEGRATION_COMPLETE.md](./INTEGRATION_COMPLETE.md)**

---

### Content Security Policy (CSP)
Proteção contra XSS e code injection.

**Dev**: Permissivo (permite HMR, unsafe-eval)
**Prod**: Restritivo (sem eval, scripts externos)

Ver: **[ELECTRON_SECURITY.md](./ELECTRON_SECURITY.md)**

---

## 🧪 Testes

### Executar Testes Manuais
Seguir **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - 10 casos de teste completos

### Checklist Rápido
```bash
npm run dev                  # Deve abrir Electron
# Navegar para /runner
# Browse file → Selecionar YAML
# Run test → Verificar logs e steps aparecem
```

---

## 🐛 Troubleshooting

### Erro: "Flow Test API não disponível"
**Causa**: Rodando no navegador web ao invés de Electron

**Solução**: Sempre usar janela do Electron aberta por `npm run dev`

---

### Erro: Monaco Editor não carrega
**Causa**: Workers bloqueados por CSP

**Solução**: Verificar `monaco.config.ts` está importado em `index.tsx`

Ver: **[ELECTRON_ERROR_FIXES.md](./ELECTRON_ERROR_FIXES.md)**

---

### Erro: Steps não são parseados
**Causa**: Formato de log diferente do esperado

**Debug**:
1. Verificar logs brutos no painel
2. Adicionar `console.log` em `flowTestParser.service.ts`
3. Ajustar regex patterns se necessário

Ver: **[INTEGRATION_COMPLETE.md](./INTEGRATION_COMPLETE.md)** - Seção "Troubleshooting"

---

## 📖 Leitura Recomendada por Perfil

### 👨‍💻 Desenvolvedor Backend (Flow Test Engine)
1. **[INTEGRATION_COMPLETE.md](./INTEGRATION_COMPLETE.md)** - Como CLI output é parseado
2. **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Como testar integração

### 👩‍💻 Desenvolvedor Frontend (React/Electron)
1. **[ELECTRON_README.md](./ELECTRON_README.md)** - Arquitetura geral
2. **[MIGRATION_SPRINT_SUMMARY.md](./MIGRATION_SPRINT_SUMMARY.md)** - Overview de componentes
3. **[INTEGRATION_COMPLETE.md](./INTEGRATION_COMPLETE.md)** - Fluxo de dados completo

### 🔒 Security Engineer
1. **[ELECTRON_SECURITY.md](./ELECTRON_SECURITY.md)** - CSP e boas práticas
2. **[ELECTRON_README.md](./ELECTRON_README.md)** - Seção "Security"

### 🧪 QA Engineer
1. **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Casos de teste completos
2. **[ELECTRON_ERROR_FIXES.md](./ELECTRON_ERROR_FIXES.md)** - Erros conhecidos

### 📝 Technical Writer
1. **[MIGRATION_SPRINT_SUMMARY.md](./MIGRATION_SPRINT_SUMMARY.md)** - Resumo de implementação
2. Esta documentação central (README.md)

---

## 🔗 Links Úteis

### Repositórios
- **Flow Test Engine**: [Repositório principal]
- **Flow Test Web**: `/web` (este diretório)

### Documentação Externa
- [Electron Docs](https://www.electronjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 📝 Changelog

### v1.0.0 - 2025-10-24 (Sprint Atual)
- ✅ Implementação completa de Electron architecture
- ✅ Parser de CLI output em tempo real
- ✅ Integração TestResultViewer
- ✅ UI completa com TestRunnerWithParsing
- ✅ Documentação abrangente (6 documentos)

### Próxima Release (v1.1.0)
- 🔄 Export de resultados
- 🔄 Histórico de execuções
- 🔄 Filtros e pesquisa

---

## 🤝 Contribuindo

### Processo
1. Ler documentação relevante
2. Criar branch feature
3. Implementar + testes
4. Atualizar documentação se necessário
5. Pull request com descrição clara

### Standards
- **TypeScript**: Strict mode, sem `any`
- **React**: Functional components, hooks
- **Electron**: Security best practices (CSP, contextIsolation)
- **Commits**: Conventional commits format

---

## 📞 Suporte

### Problemas Conhecidos
Ver **[ELECTRON_ERROR_FIXES.md](./ELECTRON_ERROR_FIXES.md)**

### Reportar Bugs
1. Verificar se já está documentado
2. Criar issue com:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots/logs
   - Environment (OS, Node version)

---

**Mantenedor**: Flow Test Team
**Última Atualização**: 24 de outubro de 2025
**Versão da Documentação**: 1.0.0
