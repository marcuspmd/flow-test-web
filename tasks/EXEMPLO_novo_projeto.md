# 📚 Guia: Como Criar um Novo Projeto de Tasks

Este é um guia de referência rápida para criar novos projetos de tasks seguindo o padrão estabelecido.

---

## 🎯 Passo a Passo

### 1. Criar Diretório do Projeto

```bash
# Padrão: categoria_descricao_###
# Exemplos:
mkdir tasks/feature_notifications_002
mkdir tasks/refactor_api_003
mkdir tasks/bugfix_memory_004
```

**Convenções de Nomenclatura:**
- `melhorias_` - Melhorias gerais (UI/UX, performance, etc)
- `feature_` - Novas funcionalidades
- `refactor_` - Refatorações de código
- `bugfix_` - Correção de bugs
- `docs_` - Documentação
- `test_` - Testes
- Número sequencial com 3 dígitos: `001`, `002`, `003`

### 2. Criar README.md do Projeto

```bash
touch tasks/feature_notifications_002/README.md
```

**Template do README.md:**

```markdown
# 🔔 feature_notifications_002 - Sistema de Notificações

## 📋 Descrição do Projeto

Implementação completa do sistema de notificações em tempo real usando WebSockets.

**Objetivos:**
- Notificações push em tempo real
- Sistema de badges/contadores
- Histórico de notificações
- Preferências de notificação por usuário

---

## 📊 Status das Tasks

| ID | Título | Status | Prioridade | Estimativa | Bloqueada Por |
|----|--------|--------|------------|------------|---------------|
| [TASK_001](./TASK_001_websocket_server.md) | WebSocket Server | 🔴 To Do | P0 | 4h | - |
| [TASK_002](./TASK_002_notification_ui.md) | Notification UI | 🔴 To Do | P1 | 3h | TASK_001 |
| [TASK_003](./TASK_003_preferences.md) | User Preferences | 🔴 To Do | P2 | 2h | TASK_002 |

**Total:** 3 tasks | **9 horas estimadas**

---

## 🗺️ Roadmap

```
TASK_001 (WebSocket) ──> TASK_002 (UI) ──> TASK_003 (Preferences)
```

---

**Projeto:** feature_notifications_002
**Data de Criação:** 2025-10-25
**Status Geral:** 🔴 To Do
```

### 3. Criar Tasks Individuais

```bash
# Criar arquivos de task
touch tasks/feature_notifications_002/TASK_001_websocket_server.md
touch tasks/feature_notifications_002/TASK_002_notification_ui.md
touch tasks/feature_notifications_002/TASK_003_preferences.md
```

**Template de Task Individual:**

```markdown
# 📋 TASK_001: Implementar WebSocket Server

## 🎯 Objetivo
Configurar servidor WebSocket para comunicação em tempo real de notificações.

## 🏷️ Metadados
| Campo | Valor |
|-------|-------|
| **ID** | TASK_001 |
| **Projeto** | feature_notifications_002 |
| **Branch** | feature/notifications-002/TASK_001-websocket-server |
| **Status** | 🔴 To Do |
| **Prioridade** | P0 (Crítica) |
| **Estimativa** | 4 horas |
| **Tags** | `websocket`, `backend`, `real-time` |

## 🔗 Relacionamentos
- **Bloqueia:** TASK_002
- **Bloqueada por:** -

## 📊 Critérios de Aceite
- [ ] WebSocket server configurado no Electron
- [ ] Autenticação de conexões WebSocket
- [ ] Broadcast de notificações para usuários
- [ ] Testes de conexão e desconexão

## 🚀 Plano de Execução

### PRÉ-REQUISITOS
- [ ] Instalar biblioteca WebSocket (ws ou socket.io)
- [ ] Definir protocolo de mensagens

### IMPLEMENTAÇÃO

#### Passo 1: Configurar WebSocket Server
**Arquivos:** `electron/websocket-server.ts`
**Tempo Estimado:** 2h

- [ ] **1.1** Criar servidor WebSocket
- [ ] **1.2** Implementar autenticação
- [ ] **1.3** Configurar handlers de eventos

#### Passo 2: Integrar com Sistema de Notificações
**Arquivos:** `electron/notifications/`
**Tempo Estimado:** 2h

- [ ] **2.1** Criar serviço de broadcast
- [ ] **2.2** Implementar fila de mensagens
- [ ] **2.3** Adicionar logging

### TESTES
- [ ] **T1:** Conexão e desconexão de clientes
- [ ] **T2:** Broadcast para múltiplos clientes
- [ ] **T3:** Autenticação de conexões

## 🎯 Definition of Done
- [ ] Código implementado e funcionando
- [ ] Testes passando
- [ ] Type-check sem erros
- [ ] Documentação atualizada
```

### 4. Atualizar README.md Principal

Adicione o novo projeto no `tasks/README.md`:

```markdown
### 🔔 [feature_notifications_002](./feature_notifications_002/) - Sistema de Notificações

**Status:** 🔴 To Do | **Prioridade:** P1 | **Estimativa Total:** 9h

Sistema completo de notificações em tempo real com WebSockets.

**Tasks:** 3 tasks (TASK_001 → TASK_003)

[📖 Ver detalhes completos](./feature_notifications_002/README.md)
```

---

## 🎨 Convenções Importantes

### Nomenclatura de Branches

```bash
# Padrão: tipo/projeto-xxx/TASK_XXX-descricao
git checkout -b feature/notifications-002/TASK_001-websocket-server

# Exemplos:
feature/notifications-002/TASK_001-websocket-server
bugfix/memory-004/TASK_001-fix-leak
refactor/api-003/TASK_001-simplify-auth
```

### Mensagens de Commit

```bash
# Padrão: tipo(projeto-xxx/TASK_XXX): descrição

git commit -m "feat(notifications-002/TASK_001): implement WebSocket server"

# Tipos:
# - feat: nova funcionalidade
# - fix: correção de bug
# - refactor: refatoração de código
# - docs: documentação
# - test: testes
# - chore: manutenção
```

---

## ✅ Checklist de Criação de Projeto

- [ ] Criar diretório com padrão `categoria_descricao_###`
- [ ] Criar `README.md` do projeto com descrição e lista de tasks
- [ ] Criar `ROADMAP_*.md` (opcional para projetos grandes)
- [ ] Criar arquivos individuais de tasks (`TASK_XXX_*.md`)
- [ ] Atualizar `tasks/README.md` principal
- [ ] Criar branch inicial: `feature/projeto-xxx/setup`
- [ ] Commit inicial com estrutura do projeto

---

## 📚 Exemplos de Projetos

### Pequeno (3-5 tasks)
```
feature_dark_mode_005/
├── README.md
├── TASK_001_theme_system.md
├── TASK_002_ui_components.md
└── TASK_003_user_preference.md
```

### Médio (6-10 tasks)
```
refactor_state_management_006/
├── README.md
├── ROADMAP_redux_migration.md
├── TASK_001_setup_redux.md
├── TASK_002_migrate_auth.md
├── TASK_003_migrate_ui.md
├── ...
└── TASK_008_cleanup.md
```

### Grande (10+ tasks)
```
feature_test_runner_007/
├── README.md
├── ROADMAP_test_runner.md
├── architecture.md
├── TASK_001_core_engine.md
├── TASK_002_yaml_parser.md
├── ...
└── TASK_015_documentation.md
```

---

**Este é um documento de referência - delete ou arquive após consulta.**
