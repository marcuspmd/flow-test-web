import React, { useRef, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor';
import * as S from './CodeEditor.styles';
import '../../../config/monaco.config';

export type EditorLanguage =
  | 'json'
  | 'javascript'
  | 'typescript'
  | 'xml'
  | 'html'
  | 'css'
  | 'yaml'
  | 'markdown'
  | 'plaintext';

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: EditorLanguage;
  height?: string;
  readOnly?: boolean;
  showToolbar?: boolean;
  showStatusBar?: boolean;
  minimap?: boolean;
  theme?: 'vs' | 'vs-dark' | 'hc-black';
  placeholder?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'json',
  height = '400px',
  readOnly = false,
  showToolbar = true,
  showStatusBar = true,
  minimap = true,
  theme = 'vs',
  placeholder,
}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentLanguage, setCurrentLanguage] = useState<EditorLanguage>(language);
  const [lineCount, setLineCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });

  useEffect(() => {
    if (!containerRef.current) return;

    // Criar editor
    const editor = monaco.editor.create(containerRef.current, {
      value: value || placeholder || '',
      language: currentLanguage,
      theme,
      readOnly,
      minimap: { enabled: minimap },
      automaticLayout: true,
      scrollBeyondLastLine: false,
      fontSize: 13,
      fontFamily: "'Monaco', 'Menlo', 'Consolas', monospace",
      lineNumbers: 'on',
      renderWhitespace: 'selection',
      tabSize: 2,
      wordWrap: 'on',
      scrollbar: {
        vertical: 'auto',
        horizontal: 'auto',
        verticalScrollbarSize: 10,
        horizontalScrollbarSize: 10,
      },
    });

    editorRef.current = editor;

    // Listener para mudanças
    const disposable = editor.onDidChangeModelContent(() => {
      const newValue = editor.getValue();
      onChange?.(newValue);

      // Atualizar estatísticas
      const model = editor.getModel();
      if (model) {
        setLineCount(model.getLineCount());
        setCharacterCount(model.getValueLength());
      }
    });

    // Listener para posição do cursor
    const cursorDisposable = editor.onDidChangeCursorPosition((e) => {
      setCursorPosition({
        line: e.position.lineNumber,
        column: e.position.column,
      });
    });

    // Estatísticas iniciais
    const model = editor.getModel();
    if (model) {
      setLineCount(model.getLineCount());
      setCharacterCount(model.getValueLength());
    }

    return () => {
      disposable.dispose();
      cursorDisposable.dispose();
      editor.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Atualizar valor quando prop mudar
  useEffect(() => {
    if (editorRef.current && editorRef.current.getValue() !== value) {
      editorRef.current.setValue(value || '');
    }
  }, [value]);

  // Atualizar linguagem
  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, currentLanguage);
      }
    }
  }, [currentLanguage]);

  // Atualizar tema
  useEffect(() => {
    monaco.editor.setTheme(theme);
  }, [theme]);

  const handleFormat = () => {
    if (!editorRef.current) return;

    if (currentLanguage === 'json') {
      try {
        const formatted = JSON.stringify(JSON.parse(editorRef.current.getValue()), null, 2);
        editorRef.current.setValue(formatted);
      } catch {
        // JSON inválido, ignorar
      }
    } else {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
    }
  };

  const handleCopy = () => {
    if (!editorRef.current) return;
    navigator.clipboard.writeText(editorRef.current.getValue());
  };

  const handleClear = () => {
    if (!editorRef.current) return;
    editorRef.current.setValue('');
  };

  const handleLanguageChange = (newLanguage: EditorLanguage) => {
    setCurrentLanguage(newLanguage);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: height }}>
      {showToolbar && (
        <S.EditorToolbar>
          <S.LanguageSelector
            value={currentLanguage}
            onChange={(e) => handleLanguageChange(e.target.value as EditorLanguage)}
          >
            <option value="json">JSON</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="xml">XML</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="yaml">YAML</option>
            <option value="markdown">Markdown</option>
            <option value="plaintext">Plain Text</option>
          </S.LanguageSelector>

          <S.EditorActions>
            <S.ActionButton onClick={handleFormat} disabled={readOnly}>
              ✨ Format
            </S.ActionButton>
            <S.ActionButton onClick={handleCopy}>📋 Copy</S.ActionButton>
            <S.ActionButton onClick={handleClear} disabled={readOnly}>
              🗑️ Clear
            </S.ActionButton>
          </S.EditorActions>
        </S.EditorToolbar>
      )}

      <div ref={containerRef} style={{ flex: 1, minHeight: 0 }} />

      {showStatusBar && (
        <S.StatusBar>
          <S.StatusItem>
            <span>
              Ln {cursorPosition.line}, Col {cursorPosition.column}
            </span>
          </S.StatusItem>
          <S.StatusItem>
            <span>{lineCount} lines</span>
            <span>•</span>
            <span>{characterCount} characters</span>
            <span>•</span>
            <span>{currentLanguage.toUpperCase()}</span>
          </S.StatusItem>
        </S.StatusBar>
      )}
    </div>
  );
};
