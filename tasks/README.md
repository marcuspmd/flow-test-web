# 📋 Task Manager - Índice de Tasks

## 🎯 Sistema de Gerenciamento de Tarefas

Este diretório contém todas as tasks do projeto Flow Test Web, organizadas por projetos/categorias e documentadas seguindo as melhores práticas de gerenciamento ágil.

---

## 📁 Estrutura de Arquivos

```
tasks/
├── README.md                                    # Este arquivo (índice principal)
└── melhorias_ui_ux_001/                        # Projeto: Melhorias UI/UX #001
    ├── README.md                                # Índice do projeto
    ├── ROADMAP_test_suite_creation.md          # Roadmap do projeto
    ├── TASK_001_sidebar_refactoring.md         # Mini-Sidebar persistente
    ├── TASK_002_sidebar_navigation_system.md   # Sistema de views dinâmicas
    ├── TASK_003_new_test_suite_page.md         # Página New Test Suite
    ├── TASK_004_wizard_multi_step.md           # Wizard guiado multi-step
    ├── TASK_005_yaml_editor_autocomplete.md    # Monaco Editor YAML
    ├── TASK_006_visual_form_builder.md         # Formulário visual
    ├── TASK_007_mode_switching_system.md       # Sincronização entre modos
    └── TASK_008_save_export_integration.md     # Salvamento e exportação
```

---

## � Projetos Ativos

### 🎨 [melhorias_ui_ux_001](./melhorias_ui_ux_001/) - Sistema de Criação de Test Suites

**Status:** 🔴 To Do | **Prioridade:** P0 | **Estimativa Total:** 31h

Implementação completa do sistema de criação de Test Suites com:
- Mini-sidebar estilo VS Code
- Sistema de navegação com views dinâmicas
- Página dedicada com 3 modos de criação (Wizard, YAML, Form)
- Integração com Electron para salvamento

**Tasks:** 8 tasks (TASK_001 → TASK_008)

[� Ver detalhes completos](./melhorias_ui_ux_001/README.md)

---

## � Resumo Geral

| Projeto | Tasks | Status | Prioridade | Horas |
|---------|-------|--------|------------|-------|
| [melhorias_ui_ux_001](./melhorias_ui_ux_001/) | 8 | 🔴 To Do | P0 | 31h |
| **TOTAL** | **8** | - | - | **31h** |

---

## 📚 Recursos Úteis

### Documentação do Projeto
- [Copilot Instructions](../.github/copilot-instructions.md)
- [Flow Test Engine Schema](../public/flow-test-engine.schema.json)

### Guias de Desenvolvimento
- **Task Manager:** `vscode-userdata:/Users/marcusp/Library/Application Support/Code/User/prompts/task-manager.instructions.md`
- **Important Instructions:** `vscode-userdata:/Users/marcusp/Library/Application Support/Code/User/prompts/important.instructions.md`

---

## 🔄 Como Usar Este Sistema

### 1. Criar Novo Projeto de Tasks

```bash
# Criar pasta do projeto com padrão: nome_descritivo_###
mkdir tasks/melhorias_backend_002

# Criar README.md do projeto
touch tasks/melhorias_backend_002/README.md

# Criar ROADMAP (opcional para projetos grandes)
touch tasks/melhorias_backend_002/ROADMAP_nome_projeto.md
```

### 2. Criar Nova Task Dentro do Projeto

```bash
# Padrão: TASK_XXX_descricao_kebab_case.md
touch tasks/melhorias_backend_002/TASK_001_implementar_cache.md
```

### 3. Antes de Iniciar uma Task
### 3. Antes de Iniciar uma Task

```bash
# Ler a task completa
cat tasks/projeto_xxx/TASK_XXX_nome_da_task.md

# Criar branch (dentro do diretório do projeto)
git checkout -b feature/projeto-xxx/TASK_XXX-nome-da-task

# Atualizar status no arquivo da task
# Status: 🔴 To Do → 🟡 In Progress
```

### 4. Durante o Desenvolvimento
- Marcar checkboxes conforme avança
- Atualizar seção "Log de Progresso"
- Documentar decisões técnicas tomadas
- Adicionar débitos técnicos identificados

### 5. Ao Concluir
```bash
# Atualizar status
# Status: 🟡 In Progress → 🟢 Done

# Commit e PR
git add .
git commit -m "feat(projeto-xxx/TASK_XXX): descrição da implementação"
git push origin feature/projeto-xxx/TASK_XXX-nome-da-task

# Criar Pull Request referenciando a task e o projeto
```

---

## 🎨 Convenções de Status

- 🔴 **To Do** - Não iniciada
- 🟡 **In Progress** - Em desenvolvimento
- 🟢 **Done** - Concluída
- ⚫ **Blocked** - Bloqueada por dependência
- 🔵 **In Review** - Em code review
- ⚪ **On Hold** - Pausada temporariamente

---

## 📝 Template de Projeto

Ao criar um novo projeto de tasks, use esta estrutura:

```markdown
# 🎯 [Nome do Projeto] - Descrição Curta

## 📋 Descrição do Projeto
{Descrição detalhada do objetivo do projeto}

## 📊 Status das Tasks
{Tabela com lista de tasks}

## 🗺️ Roadmap Visual
{Diagrama de dependências}

## 📚 Recursos Úteis
{Links e referências específicas do projeto}
```

---

## 📝 Template de Task Individual

Dentro de cada projeto, use este template para tasks:

```markdown
# 📋 TASK_XXX: Título Descritivo

## 🎯 Objetivo
{Descrição clara do resultado esperado}

## 🏷️ Metadados
| Campo | Valor |
|-------|-------|
| **ID** | TASK_XXX |
| **Branch** | feature/projeto-xxx/TASK_XXX-kebab-case |
| **Status** | 🔴 To Do |
| **Prioridade** | P0/P1/P2/P3 |
| **Estimativa** | X horas |

## 📊 Critérios de Aceite
- [ ] Critério 1
- [ ] Critério 2

## 🚀 Plano de Execução
{Passos detalhados}

## 🎯 Definition of Done
- [ ] Código implementado
- [ ] Testes passando
- [ ] Type-check sem erros
```

---

## 🤝 Padrão de Nomenclatura

### Projetos
- **Formato:** `categoria_descricao_###`
- **Exemplos:**
  - `melhorias_ui_ux_001`
  - `feature_auth_002`
  - `refactor_backend_003`
  - `bugfix_critical_004`

### Tasks
- **Formato:** `TASK_XXX_descricao_kebab_case.md`
- **Exemplos:**
  - `TASK_001_sidebar_refactoring.md`
  - `TASK_002_implement_oauth.md`

### Branches
- **Formato:** `tipo/projeto-xxx/TASK_XXX-descricao`
- **Exemplos:**
  - `feature/melhorias-ui-ux-001/TASK_001-sidebar-refactoring`
  - `bugfix/bugfix-critical-004/TASK_001-fix-memory-leak`

---

## 🤝 Contribuindo

Para manter o padrão:

1. **Sempre** crie um diretório de projeto antes de criar tasks
2. Inclua README.md em cada projeto
3. Siga os templates fornecidos
4. Mantenha numeração sequencial dentro de cada projeto
5. Atualize o README.md principal ao adicionar novos projetos

---

**Data de Criação:** 2025-10-25
**Última Atualização:** 2025-10-25
**Mantido por:** @marcuspmd
**Versão:** 2.0.0

