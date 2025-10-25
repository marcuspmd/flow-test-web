# 📋 TASK_007: Sistema de Alternância entre Modos (Wizard/YAML/Form)

## 🎯 Objetivo
Implementar sistema de alternância fluida entre os 3 modos de criação (Wizard, YAML, Form) na página New Test Suite, mantendo estado sincronizado e evitando perda de dados.

## 🏷️ Metadados
| Campo | Valor |
|-------|-------|
| **ID** | TASK_007 |
| **Branch** | feature/TASK_007-mode-switching-system |
| **Status** | 🔴 To Do |
| **Prioridade** | P1 (Alta) |
| **Estimativa** | 3 horas |
| **Sprint** | Sprint 2 |
| **Tags** | `state-sync`, `mode-switching`, `data-persistence` |

## 🔗 Relacionamentos
- **Bloqueada por:** TASK_004, TASK_005, TASK_006
- **Relacionada com:** TASK_003, TASK_008

## 📊 Critérios de Aceite
- [ ] Alternar entre modos sem perder dados
- [ ] Conversão bidirecional: Wizard ↔ YAML ↔ Form
- [ ] Warning se houver dados incompatíveis ao alternar
- [ ] Auto-save local (localStorage) a cada mudança
- [ ] Restore do último estado ao reabrir página
- [ ] Animações suaves ao alternar modos
- [ ] Indicador visual de "unsaved changes"

## 🚀 Plano de Execução

### IMPLEMENTAÇÃO

#### Passo 1: Criar Sistema de Sincronização
**Tempo Estimado:** 1.5h

- [ ] **1.1** Implementar conversores bidirecionais

  ```tsx
  // src/utils/testSuiteConverters.ts

  export const wizardToYAML = (wizardData: WizardData): string => {
    const testSuite: TestSuite = {
      node_id: wizardData.basicInfo.node_id,
      suite_name: wizardData.basicInfo.suite_name,
      description: wizardData.basicInfo.description,
      base_url: wizardData.config.base_url,
      execution_mode: wizardData.config.execution_mode,
      variables: wizardData.config.variables,
      steps: wizardData.steps,
      // ... mapear todos os campos
    };
    return yaml.dump(testSuite);
  };

  export const yamlToWizard = (yamlContent: string): WizardData => {
    const testSuite: TestSuite = yaml.load(yamlContent);
    return {
      basicInfo: {
        node_id: testSuite.node_id,
        suite_name: testSuite.suite_name,
        description: testSuite.description,
      },
      config: {
        base_url: testSuite.base_url,
        execution_mode: testSuite.execution_mode,
        variables: testSuite.variables,
      },
      steps: testSuite.steps,
      // ... mapear todos os campos
    };
  };

  export const formToYAML = (formData: FormData): string => {
    // Similar ao wizardToYAML
  };

  export const yamlToForm = (yamlContent: string): FormData => {
    // Similar ao yamlToWizard
  };
  ```

- [ ] **1.2** Validar compatibilidade ao alternar

  **Ações:**
  - Verificar se YAML é válido antes de converter
  - Detectar campos não suportados pelo wizard/form
  - Mostrar warning dialog se houver perda de dados potencial

#### Passo 2: Implementar Auto-Save e Restore
**Tempo Estimado:** 1h

- [ ] **2.1** Auto-save no localStorage

  ```tsx
  // src/hooks/useAutoSave.ts
  export const useAutoSave = (key: string, data: any, delay = 1000) => {
    useEffect(() => {
      const timer = setTimeout(() => {
        localStorage.setItem(key, JSON.stringify({
          data,
          timestamp: Date.now(),
          mode: currentMode,
        }));
      }, delay);

      return () => clearTimeout(timer);
    }, [data, delay]);
  };
  ```

- [ ] **2.2** Restore ao carregar página

  **Ações:**
  - Verificar localStorage ao montar componente
  - Mostrar dialog "Continue editing?" se houver draft
  - Opção de descartar draft

#### Passo 3: Gerenciar Estado no Redux
**Tempo Estimado:** 0.5h

- [ ] **3.1** Atualizar Redux slice

  ```tsx
  // src/store/slices/testSuiteEditorSlice.ts
  interface EditorState {
    mode: 'wizard' | 'yaml' | 'form';
    wizardData: WizardData;
    yamlContent: string;
    formData: FormData;
    isDirty: boolean;
    lastSaved: number | null;
  }

  const slice = createSlice({
    name: 'testSuiteEditor',
    initialState,
    reducers: {
      switchMode: (state, action: PayloadAction<'wizard' | 'yaml' | 'form'>) => {
        const newMode = action.payload;

        // Converter dados do modo atual para o novo modo
        if (state.mode === 'wizard' && newMode === 'yaml') {
          state.yamlContent = wizardToYAML(state.wizardData);
        } else if (state.mode === 'yaml' && newMode === 'wizard') {
          state.wizardData = yamlToWizard(state.yamlContent);
        }
        // ... outras combinações

        state.mode = newMode;
        state.isDirty = true;
      },

      updateWizardData: (state, action) => {
        state.wizardData = action.payload;
        state.yamlContent = wizardToYAML(action.payload); // sync
        state.isDirty = true;
      },

      updateYAMLContent: (state, action) => {
        state.yamlContent = action.payload;
        try {
          state.wizardData = yamlToWizard(action.payload); // sync
        } catch (e) {
          // YAML inválido - não atualizar wizard
        }
        state.isDirty = true;
      },
    },
  });
  ```

## 📝 Notas de Implementação

### Decisões Tomadas
- **Decisão 1:** YAML como fonte de verdade central (todos os modos convertem para/de YAML)
- **Decisão 2:** Auto-save com debounce de 1s para evitar salvar excessivamente
- **Decisão 3:** Warning ao trocar modo se detectar perda de dados

### Casos de Edge
- [ ] YAML com recursos avançados não suportados pelo wizard (mostrar aviso)
- [ ] Wizard incompleto (campos obrigatórios vazios) ao tentar gerar YAML
- [ ] Múltiplas tabs abertas (sync entre tabs via localStorage events)

## 🎯 Definition of Done
- [ ] Conversores bidirecionais funcionando
- [ ] Auto-save implementado
- [ ] Restore de draft funcional
- [ ] Warnings de perda de dados
- [ ] Redux sincronizado
- [ ] Testes de conversão passando
- [ ] Type-check sem erros
