/**
 * CapturedVariables Component
 * Exibe variáveis capturadas e exportadas durante a execução
 */

import { useState } from 'react';
import type { CapturedVariable, ExportedVariable } from '../types/testExecution.types';

interface CapturedVariablesProps {
  captured: CapturedVariable[];
  exported: ExportedVariable[];
}

export function CapturedVariables({ captured, exported }: CapturedVariablesProps) {
  const [expandedCaptures, setExpandedCaptures] = useState<Set<string>>(new Set());
  const [expandedExports, setExpandedExports] = useState<Set<string>>(new Set());

  const toggleCapture = (name: string) => {
    setExpandedCaptures((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const toggleExport = (name: string) => {
    setExpandedExports((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const copyValue = async (value: unknown) => {
    try {
      const valueStr = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
      await navigator.clipboard.writeText(valueStr);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (captured.length === 0 && exported.length === 0) {
    return <div className="text-sm text-gray-500 italic">No variables captured or exported in this step</div>;
  }

  return (
    <div className="captured-variables space-y-6">
      {/* Variáveis Capturadas */}
      {captured.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Captured Variables ({captured.length})</h3>
          <div className="space-y-2">
            {captured.map((variable) => (
              <div key={variable.name} className="border border-blue-200 rounded-lg bg-blue-50 overflow-hidden">
                {/* Header */}
                <div
                  className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-blue-100"
                  onClick={() => toggleCapture(variable.name)}
                >
                  <div className="flex items-center gap-2">
                    <svg
                      className={`w-4 h-4 text-blue-600 transition-transform ${
                        expandedCaptures.has(variable.name) ? 'rotate-90' : ''
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-mono text-sm font-semibold text-gray-900">{`{{${variable.name}}}`}</span>
                    <span className="text-xs text-gray-500">({variable.scope})</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyValue(variable.value);
                    }}
                    className="px-2 py-1 text-xs text-blue-700 hover:text-blue-900"
                  >
                    Copy
                  </button>
                </div>

                {/* Content (expandido) */}
                {expandedCaptures.has(variable.name) && (
                  <div className="px-4 py-3 bg-white border-t border-blue-200">
                    <div className="mb-2 text-xs text-gray-600">
                      <strong>Expression:</strong> <span className="font-mono">{variable.expression}</span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">
                      <strong>Value:</strong>
                    </div>
                    <pre className="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-xs overflow-x-auto">
                      {JSON.stringify(variable.value, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Variáveis Exportadas */}
      {exported.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Exported Variables ({exported.length})</h3>
          <div className="space-y-2">
            {exported.map((variable) => (
              <div key={variable.name} className="border border-green-200 rounded-lg bg-green-50 overflow-hidden">
                {/* Header */}
                <div
                  className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-green-100"
                  onClick={() => toggleExport(variable.name)}
                >
                  <div className="flex items-center gap-2">
                    <svg
                      className={`w-4 h-4 text-green-600 transition-transform ${
                        expandedExports.has(variable.name) ? 'rotate-90' : ''
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-mono text-sm font-semibold text-gray-900">{variable.name}</span>
                    <span className="text-xs text-gray-500">(global)</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyValue(variable.value);
                    }}
                    className="px-2 py-1 text-xs text-green-700 hover:text-green-900"
                  >
                    Copy
                  </button>
                </div>

                {/* Content (expandido) */}
                {expandedExports.has(variable.name) && (
                  <div className="px-4 py-3 bg-white border-t border-green-200">
                    <div className="mb-2 text-xs text-gray-600">
                      <strong>Available as:</strong>{' '}
                      <span className="font-mono text-green-700">{variable.availableAs}</span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">
                      <strong>Value:</strong>
                    </div>
                    <pre className="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-xs overflow-x-auto">
                      {JSON.stringify(variable.value, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
