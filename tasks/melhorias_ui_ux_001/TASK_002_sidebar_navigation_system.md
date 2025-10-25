# 📋 TASK_002: Sistema de Navegação do Sidebar com Views Dinâmicas

## 🎯 Objetivo
Implementar sistema robusto que permite o sidebar mostrar diferentes conteúdos (Collections, Environments, History, Settings) baseado no ícone/tab ativo no mini-sidebar, com gerenciamento de estado e transições suaves.

## 🏷️ Metadados
| Campo | Valor |
|-------|-------|
| **ID** | TASK_002 |
| **Branch** | feature/TASK_002-sidebar-navigation-system |
| **Status** | 🔴 To Do |
| **Prioridade** | P0 (Crítica) |
| **Estimativa** | 3 horas |
| **Sprint** | Sprint 2 |
| **Responsável** | @marcuspmd |
| **Revisor** | - |
| **Tags** | `sidebar`, `navigation`, `state-management`, `ui` |
| **Criada em** | 2025-10-25 |
| **Atualizada em** | 2025-10-25 |

## 🔗 Relacionamentos
- **Bloqueia:** TASK_003
- **Bloqueada por:** TASK_001
- **Relacionada com:** TASK_001 (mini-sidebar), TASK_004 (wizard precisa desta navegação)
- **Parent Task:** -
- **Subtasks:** -

## 📊 Critérios de Aceite
- [ ] Views disponíveis: Collections, Environments, History, Settings
- [ ] Estado de cada view preservado ao alternar
- [ ] Transições suaves entre views (fade-in/fade-out)
- [ ] Cada view tem seu próprio componente dedicado
- [ ] Sistema extensível para adicionar novas views facilmente
- [ ] Integração com Redux/Context para gerenciar estado global
- [ ] Performance otimizada (lazy loading de componentes pesados)

## 🚀 Plano de Execução

### PRÉ-REQUISITOS
- [ ] TASK_001 concluída (mini-sidebar implementado)
- [ ] Analisar componentes existentes: PostmanSidebar, CollectionList
- [ ] Definir estrutura de dados para views registry

### IMPLEMENTAÇÃO

#### Passo 1: Criar Sistema de Views Registry
**Arquivos:** `src/components/organisms/Sidebar/views/index.ts`
**Tempo Estimado:** 0.5h

- [ ] **1.1** Criar tipos TypeScript para Views

  ```tsx
  // src/types/sidebar.types.ts
  export type SidebarViewId =
    | 'collections'
    | 'environments'
    | 'history'
    | 'settings';

  export interface SidebarView {
    id: SidebarViewId;
    title: string;
    icon: IconType;
    component: React.LazyExoticComponent<React.ComponentType>;
    defaultProps?: Record<string, any>;
  }
  ```

- [ ] **1.2** Criar registry de views

  **Ações específicas:**
  - Criar arquivo `viewsRegistry.ts`
  - Registrar cada view com lazy loading
  - Exportar função `getViewById(id: SidebarViewId)`
  - Adicionar validação de view existence

  > 💡 **DICA:** Usar `React.lazy()` para code splitting automático

---

#### Passo 2: Criar Componentes de Views Individuais
**Arquivos:** `src/components/organisms/Sidebar/views/`
**Tempo Estimado:** 1.5h

- [ ] **2.1** Criar CollectionsView

  **Arquivos:** `src/components/organisms/Sidebar/views/CollectionsView.tsx`

  **Ações específicas:**
  - Mover lógica do PostmanSidebar para cá
  - Implementar search/filter de collections
  - Adicionar actions (New Collection, Import, etc)
  - Renderizar CollectionList existente

- [ ] **2.2** Criar EnvironmentsView

  **Arquivos:** `src/components/organisms/Sidebar/views/EnvironmentsView.tsx`

  **Ações específicas:**
  - Listar environments disponíveis
  - Highlight do environment ativo
  - Actions: New Environment, Edit, Delete
  - Integrar com hook `useEnvironments()`

- [ ] **2.3** Criar HistoryView

  **Arquivos:** `src/components/organisms/Sidebar/views/HistoryView.tsx`

  **Ações específicas:**
  - Listar histórico de requisições executadas
  - Agrupar por data (Today, Yesterday, Last Week)
  - Permitir re-executar request do histórico
  - Clear history action

  > 📝 **Contexto:** History será implementado com localStorage inicialmente

- [ ] **2.4** Criar SettingsView

  **Arquivos:** `src/components/organisms/Sidebar/views/SettingsView.tsx`

  **Ações específicas:**
  - Quick settings (Theme toggle, Font size, etc)
  - Link para página de Settings completa
  - Preferências de execução de testes
  - About (versão, links úteis)

---

#### Passo 3: Implementar Gerenciamento de Estado
**Arquivos:** `src/store/slices/sidebarSlice.ts`
**Tempo Estimado:** 0.5h

- [ ] **3.1** Criar/Atualizar Redux slice para sidebar

  ```tsx
  interface SidebarState {
    activeView: SidebarViewId;
    viewStates: Record<SidebarViewId, any>; // estado específico de cada view
    isContentAreaVisible: boolean;
    contentAreaWidth: number;
  }
  ```

  **Ações específicas:**
  - Action: `setActiveView(viewId: SidebarViewId)`
  - Action: `updateViewState(viewId, state)`
  - Action: `setContentAreaWidth(width: number)`
  - Selector: `selectActiveView`
  - Selector: `selectViewState(viewId)`

---

#### Passo 4: Criar Componente SidebarViewRenderer
**Arquivos:** `src/components/organisms/Sidebar/SidebarViewRenderer.tsx`
**Tempo Estimado:** 0.5h

- [ ] **4.1** Implementar renderizador dinâmico de views

  **Ações específicas:**
  - Receber `activeView` como prop
  - Buscar componente no registry
  - Renderizar com Suspense boundary
  - Implementar fallback de loading
  - Adicionar ErrorBoundary para views que falhem

  ```tsx
  <Suspense fallback={<SidebarViewSkeleton />}>
    <ErrorBoundary fallback={<SidebarViewError />}>
      <ActiveViewComponent {...viewProps} />
    </ErrorBoundary>
  </Suspense>
  ```

  > ⚠️ **ATENÇÃO:** Não destruir componentes montados ao trocar view - usar CSS `display: none`

---

### TESTES

#### Testes Unitários
- [ ] **T1:** viewsRegistry retorna view correta por ID
- [ ] **T2:** viewsRegistry retorna undefined para ID inválido
- [ ] **T3:** Redux actions atualizam estado corretamente

#### Testes de Integração
- [ ] **I1:** Alternar entre todas as views funciona corretamente
- [ ] **I2:** Estado de cada view é preservado (ex: scroll position, filtros)
- [ ] **I3:** Lazy loading funciona e não causa delay perceptível

#### Testes de UI
- [ ] **U1:** Transições entre views são suaves
- [ ] **U2:** Loading state aparece corretamente
- [ ] **U3:** ErrorBoundary captura erros de views

### DOCUMENTAÇÃO
- [ ] Documentar como adicionar nova view ao sistema
- [ ] Criar guia de boas práticas para componentes de view
- [ ] Adicionar JSDoc em viewsRegistry e tipos

### REVISÃO
- [ ] Self-review do código
- [ ] Executar `npm run type-check`
- [ ] Executar testes
- [ ] Verificar performance (React DevTools Profiler)

## 📝 Notas de Implementação

### Decisões Tomadas
- **Decisão 1:** Usar React.lazy() para code splitting das views
- **Decisão 2:** Redux para gerenciar activeView globalmente (necessário para sincronização)
- **Decisão 3:** Manter componentes montados com `display: none` para preservar estado

### Débitos Técnicos Identificados
- [ ] Implementar cache inteligente de dados de cada view
- [ ] Adicionar animações de transição mais elaboradas
- [ ] Implementar drag-and-drop entre views (ex: mover item de History para Collection)

### Aprendizados
- Sistema de registry permite adicionar novas views sem modificar código core
- Preservação de estado melhora UX significativamente

## 🔄 Atualizações de Status

### Log de Progresso
```markdown
- **[2025-10-25 10:45]** - Status: To Do → Aguardando TASK_001
  - Task criada, bloqueada por TASK_001
```

## 🎯 Definition of Done
- [ ] 4 views implementadas (Collections, Environments, History, Settings)
- [ ] Registry de views funcionando
- [ ] Estado preservado ao alternar views
- [ ] Lazy loading funcional
- [ ] Redux slice integrado
- [ ] Testes passando
- [ ] Type-check sem erros
- [ ] Documentação completa
- [ ] Performance validada
