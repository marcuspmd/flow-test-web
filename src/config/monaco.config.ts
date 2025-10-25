/**
 * Monaco Editor Configuration for Electron
 * Configures worker loading to work in Electron environment
 */

import * as monaco from 'monaco-editor';

// Disable workers in Electron environment
// Workers não funcionam bem com Electron devido ao CSP e file:// protocol
if (window.flowTestAPI) {
  // Estamos no Electron
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (self as any).MonacoEnvironment = {
    getWorker: function (_workerId: string, _label: string) {
      // Retorna um fake worker para evitar erros
      return new Worker(
        URL.createObjectURL(
          new Blob(
            [
              `
              self.onmessage = () => {};
            `,
            ],
            { type: 'text/javascript' }
          )
        )
      );
    },
  };
} else {
  // Estamos no browser (dev mode sem Electron)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (self as any).MonacoEnvironment = {
    getWorkerUrl: function (_moduleId: string, label: string) {
      if (label === 'json') {
        return '/monaco-editor/esm/vs/language/json/json.worker.js';
      }
      if (label === 'css' || label === 'scss' || label === 'less') {
        return '/monaco-editor/esm/vs/language/css/css.worker.js';
      }
      if (label === 'html' || label === 'handlebars' || label === 'razor') {
        return '/monaco-editor/esm/vs/language/html/html.worker.js';
      }
      if (label === 'typescript' || label === 'javascript') {
        return '/monaco-editor/esm/vs/language/typescript/ts.worker.js';
      }
      return '/monaco-editor/esm/vs/editor/editor.worker.js';
    },
  };
}

export default monaco;
