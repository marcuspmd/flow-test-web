# 📋 TASK_001: Refatorar Sidebar - Mini-Sidebar Persistente

## 🎯 Objetivo
Transformar o sidebar atual em um mini-sidebar persistente (sempre visível) inspirado no VS Code, removendo o header e permitindo alternar conteúdo dinamicamente através de ícones/tabs.

## 🏷️ Metadados
| Campo | Valor |
|-------|-------|
| **ID** | TASK_001 |
| **Branch** | feature/TASK_001-mini-sidebar-refactoring |
| **Status** | 🔴 To Do |
| **Prioridade** | P0 (Crítica) |
| **Estimativa** | 4 horas |
| **Sprint** | Sprint 2 |
| **Responsável** | @marcuspmd |
| **Revisor** | - |
| **Tags** | `ui`, `sidebar`, `refactoring`, `design` |
| **Criada em** | 2025-10-25 |
| **Atualizada em** | 2025-10-25 |

## 🔗 Relacionamentos
- **Bloqueia:** TASK_002
- **Bloqueada por:** -
- **Relacionada com:** TASK_003 (página de criação de tests)
- **Parent Task:** -
- **Subtasks:** -

## 📊 Critérios de Aceite
- [ ] Sidebar com largura fixa de ~60px mostrando apenas ícones
- [ ] Header do sidebar removido completamente
- [ ] Ícones para diferentes seções (Collections, Environments, History, Settings)
- [ ] Área de conteúdo do sidebar (280-600px) aparece ao lado dos ícones
- [ ] Conteúdo do sidebar muda conforme ícone ativo
- [ ] Design consistente com o tema atual (dark/light)
- [ ] Animações suaves ao alternar entre views
- [ ] Responsivo e com drag-resize para área de conteúdo

## 🚀 Plano de Execução

### PRÉ-REQUISITOS
- [ ] Revisar componentes atuais: `Sidebar.tsx`, `PostmanSidebar.tsx`, `MainWorkspace.tsx`
- [ ] Analisar estrutura atual do layout em `AppLayout.tsx`
- [ ] Definir paleta de ícones (usar react-icons ou lucide-react)

### IMPLEMENTAÇÃO

#### Passo 1: Criar componente MiniSidebar (Barra de Ícones)
**Arquivos:** `src/components/organisms/Sidebar/MiniSidebar.tsx`
**Tempo Estimado:** 1h

- [ ] **1.1** Criar estrutura base do MiniSidebar
  ```tsx
  interface MiniSidebarProps {
    activeView: 'collections' | 'environments' | 'history' | 'settings';
    onViewChange: (view: string) => void;
  }
  ```

- [ ] **1.2** Implementar lista de ícones verticais

  **Ações específicas:**
  - Criar array de sidebar views com ícones (react-icons)
  - Estilizar container com width: 60px, height: 100vh
  - Adicionar hover states e active state visual
  - Implementar tooltip ao hover (mostrar nome da view)

  > 💡 **DICA:** Usar `position: relative` para sidebar principal e `position: absolute` para tooltips

- [ ] **1.3** Integrar com tema (dark/light mode)

  **Checklist técnico:**
  - [ ] Usar cores do theme para background e ícones
  - [ ] Adicionar transições suaves (0.2s ease)
  - [ ] Active state com border-left highlight (brand color)
  - [ ] Hover com background subtle

---

#### Passo 2: Refatorar Sidebar Content Area
**Arquivos:** `src/components/organisms/Sidebar/SidebarContentArea.tsx`
**Tempo Estimado:** 1.5h

- [ ] **2.1** Criar componente SidebarContentArea

  **Ações específicas:**
  - Criar container responsivo (280px - 600px width)
  - Implementar drag handle para resize
  - Adicionar shadow/border para separação visual
  - Implementar collapse/expand animation

- [ ] **2.2** Criar sistema de views dinâmicas

  ```tsx
  interface SidebarView {
    id: string;
    component: React.ComponentType;
    title: string;
  }
  ```

  **Ações específicas:**
  - Criar registry de views (Collections, Environments, History)
  - Implementar conditional rendering baseado em activeView
  - Adicionar fade-in/fade-out transitions entre views
  - Manter estado de cada view ao alternar

  > ⚠️ **ATENÇÃO:** Não destruir componentes ao alternar views - usar `display: none` para performance

---

#### Passo 3: Remover Header do Sidebar
**Arquivos:** `src/components/organisms/Sidebar/Sidebar.tsx`
**Tempo Estimado:** 0.5h

- [ ] **3.1** Remover SidebarHeader do componente Sidebar

  **Checklist técnico:**
  - [ ] Remover import e uso de `<SidebarHeader>`
  - [ ] Ajustar layout para remover espaço do header
  - [ ] Mover actions (se houver) para outro local apropriado
  - [ ] Verificar se não quebra nenhuma funcionalidade existente

---

#### Passo 4: Integrar MiniSidebar + ContentArea no Layout
**Arquivos:** `src/pages/MainWorkspace.tsx`, `src/components/layout/AppLayout.tsx`
**Tempo Estimado:** 1h

- [ ] **4.1** Atualizar MainWorkspace para usar novo layout

  **Ações específicas:**
  - Criar estado `activeView` para controlar view ativa
  - Renderizar `<MiniSidebar>` + `<SidebarContentArea>` lado a lado
  - Aplicar flexbox layout: `display: flex`
  - Remover código antigo do sidebar com header

- [ ] **4.2** Ajustar estilos globais e responsividade

  **Checklist técnico:**
  - [ ] Sidebar total width = 60px (mini) + dynamic width (content)
  - [ ] Garantir que resize funciona corretamente
  - [ ] Testar em diferentes resoluções
  - [ ] Adicionar breakpoints para mobile (collapse content area)

---

### TESTES

#### Testes de UI/UX
- [ ] **T1:** Clicar em cada ícone do mini-sidebar alterna a view corretamente
- [ ] **T2:** Resize da content area funciona suavemente (min: 280px, max: 600px)
- [ ] **T3:** Tooltips aparecem ao hover nos ícones
- [ ] **T4:** Transições entre views são suaves e sem flickering
- [ ] **T5:** Estado de cada view é preservado ao alternar
- [ ] **T6:** Dark/Light theme aplicado corretamente

#### Testes de Integração
- [ ] **I1:** Sidebar não interfere com área principal (MainContent)
- [ ] **I2:** Navegação funciona corretamente com novo layout
- [ ] **I3:** Drag handle não conflita com outros elementos

### DOCUMENTAÇÃO
- [ ] Atualizar README.md com novo layout de sidebar
- [ ] Adicionar comentários doc em componentes novos (MiniSidebar, SidebarContentArea)
- [ ] Criar/atualizar diagrama de arquitetura do layout

### REVISÃO
- [ ] Self-review do código
- [ ] Executar `npm run type-check`
- [ ] Verificar console de erros no DevTools
- [ ] Testar em dark e light mode

## 📝 Notas de Implementação

### Decisões Tomadas
- **Decisão 1:** Usar react-icons para ícones (biblioteca já presente no projeto)
- **Decisão 2:** Width fixa de 60px para mini-sidebar inspirado no VS Code
- **Decisão 3:** Manter sidebar sempre visível (não colapsável por enquanto)

### Débitos Técnicos Identificados
- [ ] Implementar collapse total do sidebar para maximizar espaço (futuro)
- [ ] Adicionar drag-and-drop entre views (futuro)
- [ ] Implementar customização de ícones/ordem pelo usuário (futuro)

### Aprendizados
- Layout inspirado no VS Code proporciona UX familiar para desenvolvedores
- Sistema de views dinâmicas permite extensibilidade fácil

## 🔄 Atualizações de Status

### Log de Progresso
```markdown
- **[2025-10-25 10:30]** - Status: To Do → Aguardando início
  - Task criada e planejada
```

## 🎯 Definition of Done
- [ ] Código implementado e funcionando
- [ ] Mini-sidebar com ícones funcionais
- [ ] Content area dinâmica com views alternáveis
- [ ] Header do sidebar removido
- [ ] Resize funcional
- [ ] Testes de UI passando
- [ ] Type-check sem erros
- [ ] Documentação atualizada
- [ ] Dark/Light theme consistente
