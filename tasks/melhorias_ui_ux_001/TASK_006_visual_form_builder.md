# 📋 TASK_006: Formulário Visual para Test Suite

## 🎯 Objetivo
Criar formulário visual completo que gera YAML automaticamente, com campos dinâmicos baseados no schema e validação em tempo real.

## 🏷️ Metadados
| Campo | Valor |
|-------|-------|
| **ID** | TASK_006 |
| **Branch** | feature/TASK_006-visual-form-builder |
| **Status** | 🔴 To Do |
| **Prioridade** | P2 (Média) |
| **Estimativa** | 5 horas |
| **Sprint** | Sprint 2 |
| **Tags** | `form`, `visual-builder`, `schema-driven`, `ui` |

## 🔗 Relacionamentos
- **Bloqueada por:** TASK_003
- **Relacionada com:** TASK_004 (wizard), TASK_005 (yaml editor)

## 📊 Critérios de Aceite
- [ ] Formulário completo para todas as propriedades do TestSuite
- [ ] Campos dinâmicos baseados no schema JSON
- [ ] Validação em tempo real (inline errors)
- [ ] Geração automática de YAML conforme preenchimento
- [ ] Suporte para arrays dinâmicos (steps, exports, etc)
- [ ] Field helpers com exemplos do schema
- [ ] Preview collapsible de cada seção

## 🚀 Plano de Execução

### IMPLEMENTAÇÃO

#### Passo 1: Criar Schema-Driven Form Engine
**Tempo Estimado:** 2h

- [ ] **1.1** Criar gerador de campos baseado em schema

  ```tsx
  // src/components/organisms/VisualFormBuilder/SchemaFormGenerator.tsx
  interface SchemaProperty {
    name: string;
    type: string | string[];
    required: boolean;
    enum?: string[];
    description: string;
    examples?: any[];
  }

  const generateFieldFromSchema = (property: SchemaProperty) => {
    switch (property.type) {
      case 'string':
        if (property.enum) return <Select options={property.enum} />;
        return <Input type="text" />;

      case 'number':
        return <Input type="number" />;

      case 'boolean':
        return <Checkbox />;

      case 'object':
        return <ObjectEditor schema={property} />;

      case 'array':
        return <ArrayEditor schema={property} />;

      default:
        return <Input type="text" />;
    }
  };
  ```

- [ ] **1.2** Criar componentes dinâmicos

  **Componentes necessários:**
  - `<ObjectEditor>` - Para objects aninhados (variables, metadata, etc)
  - `<ArrayEditor>` - Para arrays (steps, exports, tags)
  - `<EnumSelect>` - Para enums (method, execution_mode, priority)
  - `<InterpolationInput>` - Input com sugestões de interpolação

#### Passo 2: Implementar Seções do Formulário
**Tempo Estimado:** 2h

- [ ] **2.1** Seção Basic Info

  **Campos:**
  - suite_name (required)
  - node_id (required, pattern validation)
  - description (optional, textarea)

- [ ] **2.2** Seção Configuration

  **Campos:**
  - base_url (optional, URL validation)
  - execution_mode (select: sequential/parallel)
  - variables (ObjectEditor)
  - exports (ArrayEditor de strings)
  - metadata (nested form: priority, tags, timeout)

- [ ] **2.3** Seção Steps (COMPLEXA)

  **Funcionalidades:**
  - Lista de steps com accordion
  - Add/Remove step buttons
  - Cada step expandido mostra sub-form completo:
    - name (required)
    - request (method, url, headers, body, params)
    - assert (status_code, body, headers, response_time_ms)
    - capture (ObjectEditor com JMESPath)
    - scenarios (ArrayEditor de ConditionalScenario)

  ```tsx
  <ArrayEditor
    items={formData.steps}
    onAdd={() => addStep()}
    onRemove={(index) => removeStep(index)}
    renderItem={(step, index) => (
      <Accordion title={step.name || `Step ${index + 1}`}>
        <StepFormFields
          step={step}
          onChange={(updated) => updateStep(index, updated)}
        />
      </Accordion>
    )}
  />
  ```

#### Passo 3: Validação e Preview
**Tempo Estimado:** 1h

- [ ] **3.1** Validação em tempo real

  **Ações:**
  - Usar biblioteca `yup` ou `zod` para schema validation
  - Mostrar erros inline abaixo de cada campo
  - Sumário de erros no topo do form

- [ ] **3.2** Preview YAML sincronizado

  **Ações:**
  - Gerar YAML em tempo real usando `js-yaml`
  - Atualizar preview a cada 500ms (debounce)
  - Highlight de erros de sintaxe

## 📝 Notas de Implementação

### Decisões Tomadas
- **Decisão 1:** Schema-driven para manter consistência com schema JSON
- **Decisão 2:** Accordion para steps (evitar formulário gigante)
- **Decisão 3:** Validação com yup/zod (melhor DX que validação manual)

### Bibliotecas Sugeridas
- `react-hook-form` - Gerenciamento de formulários
- `yup` ou `zod` - Schema validation
- `js-yaml` - Geração de YAML

## 🎯 Definition of Done
- [ ] Formulário completo implementado
- [ ] Campos dinâmicos baseados em schema
- [ ] Validação em tempo real
- [ ] Geração de YAML funcional
- [ ] Arrays e objects aninhados funcionando
- [ ] Type-check sem erros
