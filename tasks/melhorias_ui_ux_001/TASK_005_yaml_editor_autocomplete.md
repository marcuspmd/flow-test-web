# 📋 TASK_005: Editor YAML com Autocomplete e Validação

## 🎯 Objetivo
Implementar editor YAML profissional usando Monaco Editor com schema validation, autocomplete inteligente, e syntax highlighting baseado no flow-test-engine.schema.json.

## 🏷️ Metadados
| Campo | Valor |
|-------|-------|
| **ID** | TASK_005 |
| **Branch** | feature/TASK_005-yaml-editor-autocomplete |
| **Status** | 🔴 To Do |
| **Prioridade** | P1 (Alta) |
| **Estimativa** | 4 horas |
| **Sprint** | Sprint 2 |
| **Tags** | `yaml`, `monaco-editor`, `autocomplete`, `validation` |

## 🔗 Relacionamentos
- **Bloqueada por:** TASK_003
- **Relacionada com:** TASK_004 (wizard), TASK_006 (form)

## 📊 Critérios de Aceite
- [ ] Monaco Editor integrado com syntax highlighting YAML
- [ ] Autocomplete baseado no schema JSON
- [ ] Validação em tempo real (erros e warnings visuais)
- [ ] Snippets para estruturas comuns (steps, assertions, etc)
- [ ] Format document (Ctrl+Shift+F)
- [ ] Go to definition para variáveis
- [ ] Hover tooltips com documentação do schema
- [ ] Minimap e folding de código

## 🚀 Plano de Execução

### IMPLEMENTAÇÃO

#### Passo 1: Configurar Monaco Editor para YAML
**Tempo Estimado:** 1h

- [ ] **1.1** Instalar dependências
  ```bash
  npm install @monaco-editor/react monaco-yaml
  ```

- [ ] **1.2** Criar componente YAMLEditor

  ```tsx
  // src/components/organisms/YAMLEditor/YAMLEditor.tsx
  import Editor from '@monaco-editor/react';
  import { configureMonacoYaml } from 'monaco-yaml';

  export const YAMLEditor = ({ value, onChange, schema }) => {
    const handleEditorWillMount = (monaco) => {
      configureMonacoYaml(monaco, {
        schemas: [{
          uri: 'http://flow-test/schema.json',
          fileMatch: ['*.yaml', '*.yml'],
          schema: schema, // flow-test-engine.schema.json
        }],
      });
    };

    return (
      <Editor
        height="100%"
        language="yaml"
        value={value}
        onChange={onChange}
        beforeMount={handleEditorWillMount}
        options={{
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          fontSize: 14,
          formatOnPaste: true,
          formatOnType: true,
        }}
      />
    );
  };
  ```

#### Passo 2: Implementar Schema Validation
**Tempo Estimado:** 1.5h

- [ ] **2.1** Converter schema JSON para JSON Schema format

  **Ações:**
  - Criar script de conversão: `public/flow-test-engine.schema.json` → JSON Schema Draft-07
  - Mapear `structures` do schema para `definitions`
  - Configurar `$ref` corretamente

- [ ] **2.2** Integrar validação em tempo real

  **Ações:**
  - Configurar monaco-yaml com schema customizado
  - Mostrar erros inline (underline vermelho)
  - Panel de problemas (lista de erros/warnings)

#### Passo 3: Criar Snippets Inteligentes
**Tempo Estimado:** 1h

- [ ] **3.1** Registrar snippets no Monaco

  ```typescript
  monaco.languages.registerCompletionItemProvider('yaml', {
    provideCompletionItems: (model, position) => {
      return {
        suggestions: [
          {
            label: 'test-step-request',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: [
              '- name: "${1:Step name}"',
              '  request:',
              '    method: ${2|GET,POST,PUT,DELETE|}',
              '    url: "${3:/api/endpoint}"',
              '  assert:',
              '    status_code: ${4:200}',
            ].join('\n'),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Create a new HTTP request test step',
          },
          // Mais snippets...
        ],
      };
    },
  });
  ```

  **Snippets a criar:**
  - `test-suite` - Suite completa básica
  - `test-step-request` - Step com request HTTP
  - `test-step-input` - Step com input interativo
  - `assertion-body` - Assertion de body
  - `capture-variable` - Capture com JMESPath

#### Passo 4: Adicionar Features Avançadas
**Tempo Estimado:** 0.5h

- [ ] **4.1** Hover tooltips com documentação

  **Ações:**
  - Usar schema descriptions para mostrar ajuda ao hover
  - Exemplos de uso ao passar mouse sobre propriedades

- [ ] **4.2** Go to definition para variáveis

  **Ações:**
  - Detectar `{{variable}}` no documento
  - Permitir Ctrl+Click para ir à definição da variável

## 📝 Notas de Implementação

### Decisões Tomadas
- **Decisão 1:** Monaco Editor (mesmo do VS Code) para experiência familiar
- **Decisão 2:** monaco-yaml para integração nativa com YAML
- **Decisão 3:** Snippets cobrindo 80% dos casos de uso comuns

### Recursos Úteis
- Schema: `public/flow-test-engine.schema.json`
- Monaco YAML docs: https://github.com/remcohaszing/monaco-yaml

## 🎯 Definition of Done
- [ ] Monaco Editor integrado
- [ ] Validação em tempo real funcional
- [ ] Autocomplete com schema
- [ ] Snippets implementados
- [ ] Hover tooltips
- [ ] Format document
- [ ] Type-check sem erros
