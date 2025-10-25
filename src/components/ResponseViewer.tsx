/**
 * ResponseViewer Component
 * Exibe o corpo da resposta HTTP em diferentes formatos (JSON, HTML, raw)
 */

import { useState } from 'react';

interface ResponseViewerProps {
  body: unknown;
  contentType?: string;
  headers?: Record<string, string>;
}

type ViewMode = 'formatted' | 'raw' | 'preview';

export function ResponseViewer({ body, contentType, headers }: ResponseViewerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('formatted');

  // Detectar tipo de conteúdo
  const detectedType = contentType || headers?.['content-type'] || '';
  const isJson = detectedType.includes('application/json') || detectedType.includes('application/ld+json');
  const isHtml = detectedType.includes('text/html');
  const isXml = detectedType.includes('application/xml') || detectedType.includes('text/xml');

  // Formatar body
  const getFormattedBody = (): string => {
    if (typeof body === 'string') {
      if (isJson) {
        try {
          return JSON.stringify(JSON.parse(body), null, 2);
        } catch {
          return body;
        }
      }
      return body;
    }
    return JSON.stringify(body, null, 2);
  };

  const getRawBody = (): string => {
    if (typeof body === 'string') return body;
    return JSON.stringify(body);
  };

  const formattedBody = getFormattedBody();
  const rawBody = getRawBody();

  return (
    <div className="response-viewer">
      {/* Tabs de visualização */}
      <div className="flex gap-2 mb-4 border-b border-gray-200">
        <button
          onClick={() => setViewMode('formatted')}
          className={`px-4 py-2 font-medium transition-colors ${
            viewMode === 'formatted' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {isJson ? 'JSON' : isHtml ? 'HTML' : isXml ? 'XML' : 'Formatted'}
        </button>

        <button
          onClick={() => setViewMode('raw')}
          className={`px-4 py-2 font-medium transition-colors ${
            viewMode === 'raw' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Raw
        </button>

        {isHtml && (
          <button
            onClick={() => setViewMode('preview')}
            className={`px-4 py-2 font-medium transition-colors ${
              viewMode === 'preview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Preview
          </button>
        )}
      </div>

      {/* Conteúdo */}
      <div className="response-content">
        {viewMode === 'formatted' && (
          <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
            <code className={isJson ? 'language-json' : isHtml ? 'language-html' : 'language-text'}>
              {formattedBody}
            </code>
          </pre>
        )}

        {viewMode === 'raw' && (
          <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
            <code>{rawBody}</code>
          </pre>
        )}

        {viewMode === 'preview' && isHtml && (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="mb-2 text-xs text-gray-500 font-medium">HTML Preview:</div>
            <iframe
              srcDoc={typeof body === 'string' ? body : ''}
              className="w-full h-96 border-0"
              title="HTML Preview"
              sandbox="allow-same-origin"
            />
          </div>
        )}
      </div>

      {/* Info do tipo de conteúdo */}
      <div className="mt-2 text-xs text-gray-500">
        Content-Type: <span className="font-mono">{detectedType || 'unknown'}</span>
      </div>
    </div>
  );
}
