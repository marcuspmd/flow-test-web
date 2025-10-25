import { useRef, useEffect, useState } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { editor, languages, IPosition, IDisposable } from 'monaco-editor';
import styled from 'styled-components';
import * as yaml from 'js-yaml';

interface SchemaProperty {
  name: string;
  type: string;
  description?: string;
  required?: boolean;
  interpolable?: boolean;
  examples?: unknown[];
}

interface SchemaStructure {
  name: string;
  description?: string;
  properties?: Record<string, SchemaProperty>;
}

interface FlowTestSchema {
  version: string;
  generatedAt: string;
  structures: Record<string, SchemaStructure>;
}

const EditorWrapper = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 8px;
  overflow: hidden;
  background: ${({ theme }) => theme['codemirror-background']};
`;

const ErrorBanner = styled.div`
  padding: 12px 16px;
  background: ${({ theme }) => theme['background-danger']};
  color: white;
  font-size: 13px;
  border-bottom: 1px solid ${({ theme }) => theme['layout-border']};
  font-family: 'Monaco', 'Courier New', monospace;
`;

interface YAMLEditorProps {
  value: string;
  onChange?: (value: string) => void;
  height?: string | number;
  readOnly?: boolean;
  onValidation?: (isValid: boolean, errors?: string[]) => void;
  schema?: Record<string, unknown>;
}

/**
 * YAML Editor Component
 * Monaco-based editor with YAML syntax highlighting, validation, and autocomplete
 */
export const YAMLEditor = ({ value, onChange, height = '600px', readOnly = false, onValidation }: YAMLEditorProps) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const validationErrorRef = useRef<string | null>(null);
  const [schemaLoaded, setSchemaLoaded] = useState(false);
  const schemaDataRef = useRef<FlowTestSchema | null>(null);

  /**
   * Detecta o contexto atual baseado na posição do cursor
   * Retorna o tipo de estrutura em que estamos (TestSuite, TestStep, RequestDetails, etc)
   */
  const detectContext = (model: editor.ITextModel, position: IPosition): string => {
    const lines = model.getLinesContent();
    const currentLine = position.lineNumber - 1;

    // Analisa linhas anteriores para detectar contexto
    let indent = 0;
    const context: string[] = [];

    for (let i = currentLine; i >= 0; i--) {
      const line = lines[i];
      if (!line.trim()) continue;

      const lineIndent = line.search(/\S/);
      if (lineIndent === -1) continue;

      // Se encontramos uma linha com menos indentação, mudamos de contexto
      if (lineIndent < indent || indent === 0) {
        indent = lineIndent;

        // Detecta o tipo de propriedade
        if (line.trim().startsWith('steps:')) {
          context.unshift('TestStep');
        } else if (line.trim().startsWith('- name:') || line.trim().startsWith('name:')) {
          if (context.includes('TestStep')) {
            // Já estamos em um step
          } else {
            context.unshift('TestStep');
          }
        } else if (line.trim().startsWith('request:')) {
          context.unshift('RequestDetails');
        } else if (line.trim().startsWith('assert:')) {
          context.unshift('Assertions');
        } else if (line.trim().startsWith('metadata:')) {
          context.unshift('TestStepMetadata');
        } else if (line.trim().startsWith('iterate:')) {
          context.unshift('IterationConfig');
        } else if (line.trim().startsWith('input:')) {
          context.unshift('InputConfig');
        } else if (line.trim().startsWith('hooks_')) {
          context.unshift('HookAction');
        }
      }
    }

    // Se não detectamos nada específico, assume top-level
    return context[0] || 'TestSuite';
  };

  /**
   * Retorna sugestões baseadas no contexto e schema
   */
  const getSuggestionsForContext = (
    context: string,
    word: editor.IWordAtPosition,
    position: IPosition,
    lineContent: string
  ): languages.CompletionItem[] => {
    const suggestions: languages.CompletionItem[] = [];
    const range = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: word.startColumn,
      endColumn: word.endColumn,
    };

    if (!schemaDataRef.current) return suggestions;

    const schema = schemaDataRef.current.structures;

    // Helper para adicionar propriedades de uma estrutura
    const addPropertiesFromStructure = (structureName: string) => {
      const structure = schema[structureName];
      if (!structure?.properties) return;

      Object.entries(structure.properties).forEach(([key, prop]: [string, SchemaProperty]) => {
        suggestions.push({
          label: key,
          kind: monacoRef.current!.languages.CompletionItemKind.Property,
          documentation: {
            value: `**${key}** ${prop.required ? '*(required)*' : '*(optional)*'}\n\n${prop.description || ''}\n\n${
              prop.examples ? `**Examples:** \`${JSON.stringify(prop.examples[0])}\`` : ''
            }`,
          },
          insertText: `${key}: `,
          range,
          sortText: prop.required ? `0_${key}` : `1_${key}`, // Required first
        });
      });
    };

    // Sugestões baseadas no contexto
    switch (context) {
      case 'TestSuite':
        addPropertiesFromStructure('TestSuite');
        break;

      case 'TestStep':
        addPropertiesFromStructure('TestStep');
        break;

      case 'RequestDetails':
        addPropertiesFromStructure('RequestDetails');

        // Adicionar valores para 'method'
        if (lineContent.includes('method:')) {
          const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
          methods.forEach((method) => {
            suggestions.push({
              label: method,
              kind: monacoRef.current!.languages.CompletionItemKind.Value,
              documentation: `HTTP ${method} method`,
              insertText: method,
              range,
            });
          });
        }
        break;

      case 'Assertions':
        addPropertiesFromStructure('Assertions');
        break;

      case 'TestStepMetadata':
        addPropertiesFromStructure('TestStepMetadata');

        // Valores para priority
        if (lineContent.includes('priority:')) {
          const priorities = ['critical', 'high', 'medium', 'low'];
          priorities.forEach((priority) => {
            suggestions.push({
              label: priority,
              kind: monacoRef.current!.languages.CompletionItemKind.Value,
              insertText: `"${priority}"`,
              range,
            });
          });
        }
        break;

      case 'IterationConfig':
        addPropertiesFromStructure('IterationConfig');
        break;

      case 'InputConfig':
        addPropertiesFromStructure('InputConfig');

        // Valores para type
        if (lineContent.includes('type:')) {
          const types = ['text', 'password', 'number', 'email', 'url', 'select', 'multiselect', 'confirm', 'multiline'];
          types.forEach((type) => {
            suggestions.push({
              label: type,
              kind: monacoRef.current!.languages.CompletionItemKind.Value,
              insertText: `"${type}"`,
              range,
            });
          });
        }
        break;

      default:
        addPropertiesFromStructure('TestSuite');
    }

    return suggestions;
  };

  /**
   * Carrega o schema e configura providers
   */
  useEffect(() => {
    const loadSchema = async () => {
      try {
        const response = await fetch('/flow-test-engine.schema.json');
        const schemaData = await response.json();
        schemaDataRef.current = schemaData;

        if (monacoRef.current && editorRef.current) {
          const disposables: IDisposable[] = [];

          // 1. Completion Provider (autocomplete)
          disposables.push(
            monacoRef.current.languages.registerCompletionItemProvider('yaml', {
              triggerCharacters: [' ', ':'],
              provideCompletionItems: (model, position) => {
                const word = model.getWordUntilPosition(position);
                const lineContent = model.getLineContent(position.lineNumber);
                const context = detectContext(model, position);

                const suggestions = getSuggestionsForContext(context, word, position, lineContent);

                return { suggestions };
              },
            })
          );

          // 2. Hover Provider (documentation on hover)
          disposables.push(
            monacoRef.current.languages.registerHoverProvider('yaml', {
              provideHover: (model, position) => {
                const word = model.getWordAtPosition(position);
                if (!word) return null;

                const context = detectContext(model, position);
                const structure = schemaData.structures[context];

                if (!structure?.properties) return null;

                const property = structure.properties[word.word];
                if (!property) return null;

                return {
                  contents: [
                    {
                      value: `**${word.word}** ${property.required ? '*(required)*' : '*(optional)*'}`,
                    },
                    { value: property.description || '' },
                    {
                      value: property.examples
                        ? `**Examples:**\n\`\`\`yaml\n${word.word}: ${JSON.stringify(property.examples[0], null, 2)}\n\`\`\``
                        : '',
                    },
                  ],
                };
              },
            })
          );

          // 3. Snippets para estruturas comuns
          disposables.push(
            monacoRef.current.languages.registerCompletionItemProvider('yaml', {
              provideCompletionItems: (model, position) => {
                const word = model.getWordUntilPosition(position);
                const range = {
                  startLineNumber: position.lineNumber,
                  endLineNumber: position.lineNumber,
                  startColumn: word.startColumn,
                  endColumn: word.endColumn,
                };

                return {
                  suggestions: [
                    {
                      label: 'new-step',
                      kind: monacoRef.current!.languages.CompletionItemKind.Snippet,
                      documentation: 'Insert a new test step',
                      insertText: [
                        '- name: "${1:Step name}"',
                        '  request:',
                        '    method: ${2|GET,POST,PUT,DELETE,PATCH|}',
                        '    url: "${3:/endpoint}"',
                        '  assert:',
                        '    status_code: ${4:200}',
                      ].join('\n'),
                      insertTextRules: monacoRef.current!.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                      range,
                    },
                    {
                      label: 'new-request',
                      kind: monacoRef.current!.languages.CompletionItemKind.Snippet,
                      documentation: 'Insert a request block',
                      insertText: [
                        'request:',
                        '  method: ${1|GET,POST,PUT,DELETE,PATCH|}',
                        '  url: "${2:/endpoint}"',
                        '  headers:',
                        '    Content-Type: "application/json"',
                      ].join('\n'),
                      insertTextRules: monacoRef.current!.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                      range,
                    },
                    {
                      label: 'new-assertion',
                      kind: monacoRef.current!.languages.CompletionItemKind.Snippet,
                      documentation: 'Insert an assertion block',
                      insertText: [
                        'assert:',
                        '  status_code: ${1:200}',
                        '  body:',
                        '    ${2:field}:',
                        '      exists: true',
                      ].join('\n'),
                      insertTextRules: monacoRef.current!.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                      range,
                    },
                  ],
                };
              },
            })
          );

          setSchemaLoaded(true);
          console.log('✅ Flow Test Engine schema loaded - autocomplete, hover, and snippets enabled');

          // Cleanup on unmount
          return () => {
            disposables.forEach((d) => d.dispose());
          };
        }
      } catch (error) {
        console.warn('⚠️ Failed to load Flow Test schema:', error);
      }
    };

    if (monacoRef.current && editorRef.current && !schemaLoaded) {
      loadSchema();
    }
  }, [schemaLoaded]);

  // Configure Monaco Editor quando montar
  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Validar conteúdo inicial
    validateYAML(value);
  };

  // Validar YAML syntax
  const validateYAML = (content: string) => {
    try {
      yaml.load(content);
      validationErrorRef.current = null;
      onValidation?.(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid YAML syntax';
      validationErrorRef.current = errorMessage;
      onValidation?.(false, [errorMessage]);
    }
  };

  // Handle change
  const handleChange = (newValue: string | undefined) => {
    if (newValue === undefined) return;

    validateYAML(newValue);
    onChange?.(newValue);
  };

  // Update editor theme based on current theme
  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      monacoRef.current.editor.setTheme(isDark ? 'vs-dark' : 'vs-light');
    }
  }, []);

  return (
    <EditorWrapper>
      {validationErrorRef.current && <ErrorBanner>⚠️ YAML Error: {validationErrorRef.current}</ErrorBanner>}

      <Editor
        height={height}
        defaultLanguage="yaml"
        value={value}
        onChange={handleChange}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 13,
          lineNumbers: 'on',
          renderLineHighlight: 'all',
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          folding: true,
          foldingStrategy: 'indentation',
          showFoldingControls: 'always',
          wordWrap: 'on',
          wrappingIndent: 'indent',
          formatOnPaste: true,
          formatOnType: true,
          suggest: {
            showWords: true,
            showKeywords: true,
          },
          quickSuggestions: {
            other: true,
            comments: false,
            strings: true,
          },
        }}
        theme="vs-dark"
      />
    </EditorWrapper>
  );
};
