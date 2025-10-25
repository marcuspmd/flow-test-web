# 📋 TASK_004: Implementar Wizard Multi-Step para Test Suite

## 🎯 Objetivo
Criar wizard guiado em múltiplos steps para criação de Test Suite: 1) Basic Info, 2) Configuration, 3) Steps Builder, 4) Assertions & Capture, 5) Review & Generate.

## 🏷️ Metadados
| Campo | Valor |
|-------|-------|
| **ID** | TASK_004 |
| **Branch** | feature/TASK_004-wizard-multi-step |
| **Status** | 🔴 To Do |
| **Prioridade** | P1 (Alta) |
| **Estimativa** | 6 horas |
| **Sprint** | Sprint 2 |
| **Responsável** | @marcuspmd |
| **Revisor** | - |
| **Tags** | `wizard`, `ui`, `test-creation`, `form` |
| **Criada em** | 2025-10-25 |
| **Atualizada em** | 2025-10-25 |

## 🔗 Relacionamentos
- **Bloqueia:** TASK_007
- **Bloqueada por:** TASK_003
- **Relacionada com:** TASK_005 (YAML editor), TASK_006 (visual form)
- **Parent Task:** TASK_003
- **Subtasks:** -

## 📊 Critérios de Aceite
- [ ] Wizard com 5 steps navegáveis (Next/Previous)
- [ ] Validação em cada step antes de avançar
- [ ] Progress indicator visual (step 1/5)
- [ ] Cada step tem ajuda contextual baseada no schema
- [ ] Suporte para múltiplos test steps
- [ ] Preview em tempo real do YAML gerado
- [ ] Possibilidade de pular steps opcionais
- [ ] Auto-save do progresso

## 🚀 Plano de Execução

### PRÉ-REQUISITOS
- [ ] TASK_003 concluída (página New Test Suite)
- [ ] Estudar schema JSON profundamente (TestSuite structure)
- [ ] Definir quais campos são obrigatórios vs opcionais em cada step

### IMPLEMENTAÇÃO

#### Passo 1: Criar Estrutura Base do Wizard
**Arquivos:** `src/components/organisms/TestSuiteWizard/`
**Tempo Estimado:** 1h

- [ ] **1.1** Criar componente WizardContainer

  ```tsx
  // src/components/organisms/TestSuiteWizard/WizardContainer.tsx
  interface WizardStep {
    id: string;
    title: string;
    description: string;
    component: React.ComponentType<WizardStepProps>;
    isOptional?: boolean;
    validate: (data: Partial<TestSuite>) => ValidationResult;
  }
  ```

  **Ações específicas:**
  - Criar array de steps configuration
  - Implementar navegação (Next, Previous, Skip)
  - Progress bar visual (1/5, 2/5, etc)
  - Gerenciar estado atual do wizard

- [ ] **1.2** Criar componente WizardStepWrapper

  **Ações específicas:**
  - Header com título e descrição do step
  - Área de conteúdo do step
  - Footer com botões de navegação
  - Help sidebar (opcional, com dicas do schema)

---

#### Passo 2: Step 1 - Basic Information
**Arquivos:** `src/components/organisms/TestSuiteWizard/steps/BasicInfoStep.tsx`
**Tempo Estimado:** 1h

- [ ] **2.1** Implementar formulário de informações básicas

  **Campos (baseados no schema TestSuite):**
  - `suite_name` (obrigatório) - Input text
  - `node_id` (obrigatório) - Input text com validação kebab-case
  - `description` (opcional) - Textarea
  - Auto-sugestão de `node_id` baseado em `suite_name`

  ```tsx
  <FormField label="Suite Name" required>
    <Input
      value={data.suite_name}
      onChange={handleChange('suite_name')}
      placeholder="User Authentication Tests"
    />
  </FormField>

  <FormField
    label="Node ID"
    required
    helpText="Unique identifier in kebab-case (e.g., user-auth-test)"
  >
    <Input
      value={data.node_id}
      onChange={handleChange('node_id')}
      pattern="^[a-z0-9-]+$"
    />
  </FormField>
  ```

  **Validações:**
  - `suite_name` não vazio
  - `node_id` match pattern `^[a-z0-9-]+$`
  - `node_id` único (verificar contra suites existentes)

---

#### Passo 3: Step 2 - Configuration
**Arquivos:** `src/components/organisms/TestSuiteWizard/steps/ConfigurationStep.tsx`
**Tempo Estimado:** 1.5h

- [ ] **3.1** Implementar configurações da test suite

  **Campos:**
  - `base_url` (opcional) - Input text com validação de URL
  - `execution_mode` (opcional, default: sequential) - Select dropdown
  - `variables` (opcional) - Key-Value editor dinâmico
  - `exports` (opcional) - Array de strings (tags input)
  - `metadata` (opcional) - Priority, Tags, Timeout

  ```tsx
  <FormSection title="Execution Settings">
    <FormField label="Base URL" optional>
      <Input
        type="url"
        value={data.base_url}
        placeholder="https://api.example.com"
      />
    </FormField>

    <FormField label="Execution Mode">
      <Select value={data.execution_mode}>
        <option value="sequential">Sequential</option>
        <option value="parallel">Parallel</option>
      </Select>
    </FormField>
  </FormSection>

  <FormSection title="Variables">
    <KeyValueEditor
      items={data.variables}
      onChange={handleVariablesChange}
      placeholder={{ key: 'api_key', value: 'abc123' }}
    />
  </FormSection>
  ```

- [ ] **3.2** Criar componente KeyValueEditor reutilizável

  **Ações específicas:**
  - Add/Remove rows
  - Validação de chaves únicas
  - Suporte para interpolation syntax hints
  - Import from JSON

---

#### Passo 4: Step 3 - Steps Builder (CRÍTICO)
**Arquivos:** `src/components/organisms/TestSuiteWizard/steps/StepsBuilderStep.tsx`
**Tempo Estimado:** 2h

- [ ] **4.1** Implementar builder de test steps

  **Funcionalidades:**
  - Lista de steps criados (drag-and-drop para reordenar)
  - Botão "Add Step" abre modal/inline form
  - Cada step mostra resumo (method, URL, assertions count)
  - Expand/Collapse para editar step
  - Delete step

  ```tsx
  <StepsList>
    {steps.map((step, index) => (
      <StepCard key={step.step_id} draggable>
        <StepHeader>
          <MethodBadge>{step.request?.method}</MethodBadge>
          <StepName>{step.name}</StepName>
          <StepActions>
            <IconButton onClick={() => editStep(index)}>✏️</IconButton>
            <IconButton onClick={() => deleteStep(index)}>🗑️</IconButton>
          </StepActions>
        </StepHeader>

        {expandedSteps[index] && (
          <StepEditor step={step} onChange={(s) => updateStep(index, s)} />
        )}
      </StepCard>
    ))}

    <AddStepButton onClick={openStepModal}>
      + Add Step
    </AddStepButton>
  </StepsList>
  ```

- [ ] **4.2** Criar Step Editor Modal/Form

  **Campos do TestStep (schema):**
  - `name` (obrigatório)
  - `step_id` (opcional)
  - `request` (RequestDetails - método, URL, headers, body, params)
  - Tabs: Request | Assertions | Capture | Advanced

  **Request Tab:**
  - Method selector (GET, POST, PUT, etc)
  - URL input (com sugestões de interpolação)
  - Headers (KeyValueEditor)
  - Body (Monaco Editor com JSON/XML/etc)
  - Params (KeyValueEditor)

  > 💡 **DICA:** Usar tabs para organizar campos e evitar sobrecarga visual

---

#### Passo 5: Step 4 - Assertions & Capture
**Arquivos:** `src/components/organisms/TestSuiteWizard/steps/AssertionsCaptureStep.tsx`
**Tempo Estimado:** 1h

- [ ] **5.1** Editor de Assertions para cada step

  **Funcionalidades:**
  - Selecionar step para adicionar assertions
  - Assertion builder visual:
    - `status_code`: selector de código ou operador (equals, in, etc)
    - `body`: JMESPath expression + assertion operator
    - `headers`: key + assertion
    - `response_time_ms`: operador numérico

  ```tsx
  <AssertionBuilder step={selectedStep}>
    <AssertionGroup type="status_code">
      <Select value={assertion.operator}>
        <option value="equals">Equals</option>
        <option value="in">In list</option>
      </Select>
      <Input value={assertion.value} type="number" />
    </AssertionGroup>

    <AssertionGroup type="body">
      <Input
        placeholder="JMESPath expression (e.g., body.token)"
        value={assertion.path}
      />
      <Select value={assertion.check}>
        <option value="exists">Exists</option>
        <option value="equals">Equals</option>
        <option value="contains">Contains</option>
      </Select>
      <Input value={assertion.expected} />
    </AssertionGroup>
  </AssertionBuilder>
  ```

- [ ] **5.2** Editor de Capture

  **Funcionalidades:**
  - JMESPath expression input
  - Variable name input
  - Preview de dados capturados (se houver response mock)

---

#### Passo 6: Step 5 - Review & Generate
**Arquivos:** `src/components/organisms/TestSuiteWizard/steps/ReviewStep.tsx`
**Tempo Estimado:** 0.5h

- [ ] **6.1** Tela de revisão final

  **Exibir:**
  - Sumário da test suite (nome, descrição, # steps)
  - Lista de steps criados (collapsed view)
  - Validação final (✓ ou lista de erros)
  - Preview do YAML completo (lado direito)

  **Actions:**
  - Edit (voltar ao step específico)
  - Generate YAML (finalizar wizard)
  - Save as Template

---

### TESTES

#### Testes Unitários
- [ ] **T1:** Validação de cada step funciona corretamente
- [ ] **T2:** Navegação Next/Previous preserva dados
- [ ] **T3:** Skip step opcional funciona

#### Testes de Integração
- [ ] **I1:** Wizard completo gera YAML válido conforme schema
- [ ] **I2:** Editar step específico e salvar atualiza wizard state

#### Testes de UI
- [ ] **U1:** Progress indicator atualiza corretamente
- [ ] **U2:** Validação visual de erros em campos

### DOCUMENTAÇÃO
- [ ] Guia de uso do wizard para usuários
- [ ] Documentar componentes reutilizáveis (KeyValueEditor, StepEditor)

### REVISÃO
- [ ] Self-review
- [ ] Type-check
- [ ] Testes passando

## 📝 Notas de Implementação

### Decisões Tomadas
- **Decisão 1:** 5 steps para balancear complexidade e usabilidade
- **Decisão 2:** Steps Builder é o mais complexo - dedicar mais tempo
- **Decisão 3:** Usar modal para Step Editor (melhor foco)

### Débitos Técnicos
- [ ] Adicionar templates de steps comuns (Login, CRUD, etc)
- [ ] Implementar AI assistant para gerar steps baseado em descrição

## 🔄 Atualizações de Status

```markdown
- **[2025-10-25 11:15]** - Status: To Do → Aguardando TASK_003
```

## 🎯 Definition of Done
- [ ] Wizard com 5 steps funcionais
- [ ] Validação em cada step
- [ ] Step Builder com add/edit/delete
- [ ] Assertions e Capture editors
- [ ] Review step com preview YAML
- [ ] Testes passando
- [ ] Documentação completa
