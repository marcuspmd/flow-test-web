/**
 * CurlCommand Component
 * Gera e exibe o comando curl equivalente à requisição HTTP
 */

import { useState } from 'react';
import type { RequestDetails } from '../types/testExecution.types';

interface CurlCommandProps {
  request: RequestDetails;
}

export function CurlCommand({ request }: CurlCommandProps) {
  const [copied, setCopied] = useState(false);

  // Gerar comando curl
  const generateCurl = (): string => {
    const parts: string[] = ['curl'];

    // Método HTTP
    if (request.method !== 'GET') {
      parts.push(`-X ${request.method}`);
    }

    // Headers
    if (request.headers) {
      Object.entries(request.headers).forEach(([key, value]) => {
        parts.push(`-H "${key}: ${value}"`);
      });
    }

    // Body
    if (request.body) {
      const bodyStr = typeof request.body === 'string' ? request.body : JSON.stringify(request.body);
      parts.push(`-d '${bodyStr.replace(/'/g, "\\'")}'`);
    }

    // URL (último)
    parts.push(`"${request.url}"`);

    return parts.join(' \\\n  ');
  };

  const curlCommand = generateCurl();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(curlCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="curl-command">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-700">cURL Command</h3>
        <button
          onClick={copyToClipboard}
          className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
        >
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
      </div>

      <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs">
        <code>{curlCommand}</code>
      </pre>
    </div>
  );
}
