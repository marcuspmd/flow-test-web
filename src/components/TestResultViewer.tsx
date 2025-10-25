/**
 * TestResultViewer Component
 * Componente principal para exibir resultados detalhados de execução de testes
 */

import { useState } from 'react';
import type { StepExecutionResult } from '../types/testExecution.types';
import { ResponseViewer } from './ResponseViewer';
import { CurlCommand } from './CurlCommand';
import { AssertionsPanel } from './AssertionsPanel';
import { CapturedVariables } from './CapturedVariables';

interface TestResultViewerProps {
  result: StepExecutionResult;
}

type ActiveTab = 'response' | 'request' | 'assertions' | 'variables' | 'curl';

export function TestResultViewer({ result }: TestResultViewerProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('response');

  const getStatusColor = () => {
    switch (result.status) {
      case 'passed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'skipped':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = () => {
    switch (result.status) {
      case 'passed':
        return '✓';
      case 'failed':
        return '✗';
      case 'skipped':
        return '⊝';
      default:
        return '?';
    }
  };

  return (
    <div className="test-result-viewer border border-gray-200 rounded-lg overflow-hidden">
      {/* Header com informações do step */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">{result.stepName}</h2>
            {result.stepId && <div className="text-xs text-gray-500 font-mono mt-1">ID: {result.stepId}</div>}
          </div>

          {/* Status badge */}
          <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor()}`}>
            <span className="mr-1">{getStatusIcon()}</span>
            {result.status.toUpperCase()}
          </div>
        </div>

        {/* Timing info */}
        <div className="mt-3 flex gap-4 text-xs text-gray-600">
          <span>
            Duration: <strong>{result.duration}ms</strong>
          </span>
          {result.response && (
            <>
              <span className="text-gray-300">|</span>
              <span>
                Response Time: <strong>{result.response.responseTime}ms</strong>
              </span>
              <span className="text-gray-300">|</span>
              <span>
                Status:{' '}
                <strong
                  className={
                    result.response.status >= 200 && result.response.status < 300 ? 'text-green-600' : 'text-red-600'
                  }
                >
                  {result.response.status} {result.response.statusText}
                </strong>
              </span>
            </>
          )}
        </div>

        {/* Error message */}
        {result.error && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded px-3 py-2">
            <div className="text-xs font-semibold text-red-700 mb-1">Error:</div>
            <div className="text-sm text-red-600 font-mono">{result.error}</div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-1 px-4">
          <TabButton
            active={activeTab === 'response'}
            onClick={() => setActiveTab('response')}
            label="Response"
            count={result.response ? 1 : 0}
          />
          <TabButton
            active={activeTab === 'request'}
            onClick={() => setActiveTab('request')}
            label="Request"
            count={result.request ? 1 : 0}
          />
          <TabButton
            active={activeTab === 'assertions'}
            onClick={() => setActiveTab('assertions')}
            label="Assertions"
            count={result.assertions.length}
          />
          <TabButton
            active={activeTab === 'variables'}
            onClick={() => setActiveTab('variables')}
            label="Variables"
            count={result.captured.length + result.exported.length}
          />
          <TabButton
            active={activeTab === 'curl'}
            onClick={() => setActiveTab('curl')}
            label="cURL"
            count={result.request ? 1 : 0}
          />
        </nav>
      </div>

      {/* Tab content */}
      <div className="p-6">
        {activeTab === 'response' && result.response && (
          <ResponseViewer
            body={result.response.body}
            contentType={result.response.contentType}
            headers={result.response.headers}
          />
        )}

        {activeTab === 'response' && !result.response && (
          <div className="text-sm text-gray-500 italic">No response data available</div>
        )}

        {activeTab === 'request' && result.request && (
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold text-gray-700 mb-2">Request Details</div>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div>
                  <span className="font-semibold">{result.request.method}</span>{' '}
                  <span className="font-mono text-blue-600">{result.request.url}</span>
                </div>

                {result.request.headers && Object.keys(result.request.headers).length > 0 && (
                  <div>
                    <div className="text-xs font-semibold text-gray-700 mt-3 mb-1">Headers:</div>
                    <pre className="bg-white border border-gray-200 rounded px-3 py-2 text-xs overflow-x-auto">
                      {JSON.stringify(result.request.headers, null, 2)}
                    </pre>
                  </div>
                )}

                {result.request.params && Object.keys(result.request.params).length > 0 && (
                  <div>
                    <div className="text-xs font-semibold text-gray-700 mt-3 mb-1">Query Params:</div>
                    <pre className="bg-white border border-gray-200 rounded px-3 py-2 text-xs overflow-x-auto">
                      {JSON.stringify(result.request.params, null, 2)}
                    </pre>
                  </div>
                )}

                {result.request.body && (
                  <div>
                    <div className="text-xs font-semibold text-gray-700 mt-3 mb-1">Body:</div>
                    <pre className="bg-white border border-gray-200 rounded px-3 py-2 text-xs overflow-x-auto">
                      {typeof result.request.body === 'string'
                        ? result.request.body
                        : JSON.stringify(result.request.body, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'request' && !result.request && (
          <div className="text-sm text-gray-500 italic">No request data available</div>
        )}

        {activeTab === 'assertions' && <AssertionsPanel assertions={result.assertions} />}

        {activeTab === 'variables' && <CapturedVariables captured={result.captured} exported={result.exported} />}

        {activeTab === 'curl' && result.request && <CurlCommand request={result.request} />}

        {activeTab === 'curl' && !result.request && (
          <div className="text-sm text-gray-500 italic">No request data available to generate cURL</div>
        )}
      </div>
    </div>
  );
}

// Tab Button Component
interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  count?: number;
}

function TabButton({ active, onClick, label, count }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 font-medium text-sm transition-colors relative ${
        active ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      {label}
      {count !== undefined && count > 0 && (
        <span
          className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${
            active ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
