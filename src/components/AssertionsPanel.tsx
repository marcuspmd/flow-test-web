/**
 * AssertionsPanel Component
 * Exibe os resultados das assertions (validações) realizadas
 */

import type { AssertionResult } from '../types/testExecution.types';

interface AssertionsPanelProps {
  assertions: AssertionResult[];
}

export function AssertionsPanel({ assertions }: AssertionsPanelProps) {
  if (assertions.length === 0) {
    return <div className="text-sm text-gray-500 italic">No assertions configured for this step</div>;
  }

  const passedCount = assertions.filter((a) => a.passed).length;
  const failedCount = assertions.length - passedCount;

  return (
    <div className="assertions-panel">
      {/* Header com estatísticas */}
      <div className="flex items-center gap-4 mb-4">
        <h3 className="text-sm font-semibold text-gray-700">Assertions</h3>
        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-gray-600">{passedCount} passed</span>
          </span>
          {failedCount > 0 && (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-gray-600">{failedCount} failed</span>
            </span>
          )}
        </div>
      </div>

      {/* Lista de assertions */}
      <div className="space-y-2">
        {assertions.map((assertion, index) => (
          <div
            key={index}
            className={`border rounded-lg p-3 ${
              assertion.passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
            }`}
          >
            <div className="flex items-start gap-2">
              {/* Ícone de status */}
              <div className="flex-shrink-0 mt-0.5">
                {assertion.passed ? (
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>

              {/* Conteúdo da assertion */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900">{assertion.path}</div>
                <div className="mt-1 text-xs text-gray-600">
                  <span className="font-mono">{assertion.operator}</span>
                </div>

                {/* Valores esperado vs atual */}
                <div className="mt-2 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-gray-500 font-medium mb-1">Expected:</div>
                    <pre className="bg-white border border-gray-200 rounded px-2 py-1 overflow-x-auto">
                      {JSON.stringify(assertion.expected, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <div className="text-gray-500 font-medium mb-1">Actual:</div>
                    <pre
                      className={`border rounded px-2 py-1 overflow-x-auto ${
                        assertion.passed ? 'bg-white border-gray-200' : 'bg-red-50 border-red-200'
                      }`}
                    >
                      {JSON.stringify(assertion.actual, null, 2)}
                    </pre>
                  </div>
                </div>

                {/* Mensagem de erro */}
                {assertion.message && !assertion.passed && (
                  <div className="mt-2 text-xs text-red-700 font-medium">⚠ {assertion.message}</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
