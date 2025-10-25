# 📋 TASK_003: Criar Página 'New Test Suite'

## 🎯 Objetivo
Criar página dedicada `/new-test` com área ampla e organizada para criação de test suites, permitindo escolher entre 3 modos: Wizard Guiado, Editor YAML direto, e Formulário Visual.

## 🏷️ Metadados
| Campo | Valor |
|-------|-------|
| **ID** | TASK_003 |
| **Branch** | feature/TASK_003-new-test-suite-page |
| **Status** | ✅ Done |
| **Prioridade** | P0 (Crítica) |
| **Estimativa** | 3 horas |
| **Sprint** | Sprint 2 |
| **Responsável** | @marcuspmd |
| **Revisor** | - |
| **Tags** | `page`, `routing`, `ui`, `test-creation` |
| **Criada em** | 2025-10-25 |
| **Atualizada em** | 2025-10-25 |
| **Concluída em** | 2025-10-25 |

## 🔗 Relacionamentos
- **Bloqueia:** TASK_004, TASK_005, TASK_006, TASK_007
- **Bloqueada por:** TASK_002 (sidebar system precisa estar funcional)
- **Relacionada com:** TASK_008 (salvamento de test suites)
- **Parent Task:** -
- **Subtasks:** TASK_004, TASK_005, TASK_006, TASK_007

## 📊 Critérios de Aceite
- [x] Rota `/new-test` configurada no React Router
- [x] Layout responsivo com header dedicado
- [x] Toggle/Tabs para alternar entre 3 modos de criação
- [x] Área de preview do YAML gerado (sempre visível)
- [x] Actions: Save, Export YAML, Add to Collection, Cancel
- [x] Breadcrumb: Home > New Test Suite
- [x] Integração com sidebar (link "New Test" na CollectionsView)
- [x] Estado preservado ao alternar entre modos

## 🚀 Plano de Execução

### PRÉ-REQUISITOS
- [ ] TASK_002 concluída (sistema de views do sidebar)
- [ ] Revisar `src/router/routes.tsx` para adicionar nova rota
- [ ] Analisar schema JSON para entender estrutura de TestSuite

### IMPLEMENTAÇÃO

#### Passo 1: Configurar Rota e Estrutura Base
**Arquivos:** `src/router/routes.tsx`, `src/pages/NewTestSuitePage.tsx`
**Tempo Estimado:** 0.5h

- [ ] **1.1** Adicionar rota ao React Router

  ```tsx
  // src/router/routes.tsx
  {
    path: '/new-test',
    element: <NewTestSuitePage />,
  }
  ```

- [ ] **1.2** Criar componente base da página

  **Ações específicas:**
  - Criar `src/pages/NewTestSuitePage.tsx`
  - Implementar layout principal (Header + Content + Actions)
  - Adicionar breadcrumb
  - Configurar AppLayout wrapper

  > 💡 **DICA:** Usar layout two-panel: esquerda = editor/wizard, direita = preview YAML

---

#### Passo 2: Criar Header da Página
**Arquivos:** `src/pages/NewTestSuitePage.tsx`
**Tempo Estimado:** 0.5h

- [ ] **2.1** Implementar header dedicado

  **Ações específicas:**
  - Título: "New Test Suite"
  - Breadcrumb: Home > New Test Suite
  - Mode selector (Wizard / YAML / Form) com tabs/pills
  - Action buttons: Save, Export, Cancel (canto direito)

  ```tsx
  <PageHeader>
    <Breadcrumb items={[
      { label: 'Home', path: '/' },
      { label: 'New Test Suite' }
    ]} />

    <ModeSelectorTabs>
      <Tab active={mode === 'wizard'}>🧙 Wizard</Tab>
      <Tab active={mode === 'yaml'}>📝 YAML Editor</Tab>
      <Tab active={mode === 'form'}>📋 Visual Form</Tab>
    </ModeSelectorTabs>

    <Actions>
      <Button variant="secondary">Cancel</Button>
      <Button variant="secondary">Export YAML</Button>
      <Button variant="primary">Save Test Suite</Button>
    </Actions>
  </PageHeader>
  ```

---

#### Passo 3: Criar Layout Two-Panel
**Arquivos:** `src/pages/NewTestSuitePage.tsx`
**Tempo Estimado:** 1h

- [ ] **3.1** Implementar layout split-screen

  **Ações específicas:**
  - Panel esquerdo: área de criação (60% width)
  - Panel direito: preview YAML em tempo real (40% width)
  - Drag handle para resize entre panels
  - Opção de collapse do preview panel

  ```tsx
  <ContentArea>
    <EditorPanel width={editorWidth}>
      {mode === 'wizard' && <WizardMode />}
      {mode === 'yaml' && <YAMLEditorMode />}
      {mode === 'form' && <FormMode />}
    </EditorPanel>

    <DragHandle onDrag={handleResize} />

    <PreviewPanel width={previewWidth}>
      <YAMLPreview content={generatedYAML} />
    </PreviewPanel>
  </ContentArea>
  ```

  > ⚠️ **ATENÇÃO:** Preview deve atualizar em tempo real conforme usuário preenche dados

- [ ] **3.2** Criar componente YAMLPreview

  **Ações específicas:**
  - Syntax highlighting usando Monaco Editor (read-only)
  - Copy to clipboard button
  - Download YAML button
  - Validação visual (✓ válido / ✗ erro)

---

#### Passo 4: Implementar Gerenciamento de Estado
**Arquivos:** `src/pages/NewTestSuitePage.tsx`, `src/store/slices/testSuiteEditorSlice.ts`
**Tempo Estimado:** 1h

- [ ] **4.1** Criar Redux slice para editor de test suite

  ```tsx
  interface TestSuiteEditorState {
    mode: 'wizard' | 'yaml' | 'form';
    currentData: Partial<TestSuite>;
    generatedYAML: string;
    isDirty: boolean;
    validationErrors: ValidationError[];
  }
  ```

  **Ações específicas:**
  - Action: `setMode(mode)`
  - Action: `updateTestSuiteData(data)`
  - Action: `generateYAML()`
  - Action: `validateTestSuite()`
  - Selector: `selectGeneratedYAML`
  - Selector: `selectValidationErrors`

- [ ] **4.2** Implementar sincronização entre modos

  **Ações específicas:**
  - Ao alternar de Wizard → YAML: converter dados para YAML
  - Ao alternar de YAML → Form: parsear YAML para dados estruturados
  - Validar dados ao alternar para evitar perda de informação
  - Mostrar warning se houver dados não compatíveis

  > 📝 **Contexto:** Usar biblioteca `js-yaml` para conversão YAML ↔ JSON

---

### TESTES

#### Testes Unitários
- [ ] **T1:** Redux actions atualizam estado corretamente
- [ ] **T2:** Conversão YAML ↔ JSON funciona bidirecionalmente
- [ ] **T3:** Validação detecta erros conforme schema

#### Testes de Integração
- [ ] **I1:** Alternar entre modos preserva dados
- [ ] **I2:** Preview YAML atualiza em tempo real
- [ ] **I3:** Navegação para/da página funciona corretamente

#### Testes de UI
- [ ] **U1:** Layout responsivo em diferentes resoluções
- [ ] **U2:** Drag handle resize funciona suavemente
- [ ] **U3:** Actions (Save, Export, Cancel) respondem corretamente

### DOCUMENTAÇÃO
- [ ] Adicionar README da página explicando os 3 modos
- [ ] Documentar estrutura de estado do editor
- [ ] Criar guia de uso para usuários

### REVISÃO
- [ ] Self-review do código
- [ ] Executar `npm run type-check`
- [ ] Testar navegação completa
- [ ] Verificar integração com sidebar

## 📝 Notas de Implementação

### Decisões Tomadas
- **Decisão 1:** Layout two-panel (editor + preview) para feedback visual imediato
- **Decisão 2:** Redux para gerenciar estado complexo do editor
- **Decisão 3:** Wizard como modo padrão (mais guiado para novos usuários)

### Débitos Técnicos Identificados
- [ ] Implementar autosave (localStorage) para evitar perda de dados
- [ ] Adicionar templates pré-configurados (Quick Start)
- [ ] Implementar duplicação de test suites existentes

### Aprendizados
- Preview em tempo real melhora significativamente a experiência do usuário
- Sincronização entre modos é crítica para evitar frustração

## 🔄 Atualizações de Status

### Log de Progresso
```markdown
- **[2025-10-25 11:00]** - Status: To Do → Aguardando TASK_002
  - Task criada, dependente de sistema de sidebar
```

## 🎯 Definition of Done
- [ ] Página `/new-test` acessível e funcional
- [ ] Header com breadcrumb e mode selector
- [ ] Layout two-panel implementado
- [ ] Preview YAML em tempo real
- [ ] Redux slice configurado
- [ ] Sincronização entre modos funcionando
- [ ] Testes passando
- [ ] Type-check sem erros
- [ ] Documentação completa
- [ ] Responsivo e com boa UX
