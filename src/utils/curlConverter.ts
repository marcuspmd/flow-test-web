/**
 * cURL Converter Utility
 * Converts between cURL commands and RequestData format
 */

import type { HttpMethod } from '../components/organisms/RequestPane/RequestPane';

export interface ParsedCurl {
  method: HttpMethod;
  url: string;
  headers: Record<string, string>;
  body?: string;
  auth?: {
    type: 'basic' | 'bearer';
    username?: string;
    password?: string;
    token?: string;
  };
}

/**
 * Parse cURL command to extract request details
 * Supports multi-line cURL with backslashes
 */
export function parseCurl(curlCommand: string): ParsedCurl {
  // Normalize line breaks (remove backslashes and join lines)
  const normalized = curlCommand
    .replace(/\\\n/g, ' ')
    .replace(/\\\r\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Extract URL (first argument after curl)
  const urlMatch = normalized.match(/curl\s+(?:-[A-Za-z]\s+)?['"]?([^'"\s]+)['"]?/);
  const url = urlMatch ? urlMatch[1] : '';

  // Extract method (-X or --request)
  const methodMatch = normalized.match(/(?:-X|--request)\s+([A-Z]+)/);
  let method: HttpMethod = 'GET';
  if (methodMatch) {
    method = methodMatch[1] as HttpMethod;
  } else if (normalized.includes('-d') || normalized.includes('--data')) {
    method = 'POST'; // Default to POST if data is present
  }

  // Extract headers (-H or --header)
  const headers: Record<string, string> = {};
  const headerRegex = /(?:-H|--header)\s+['"]([^'"]+)['"]/g;
  let headerMatch;
  while ((headerMatch = headerRegex.exec(normalized)) !== null) {
    const headerLine = headerMatch[1];
    const colonIndex = headerLine.indexOf(':');
    if (colonIndex > 0) {
      const key = headerLine.substring(0, colonIndex).trim();
      const value = headerLine.substring(colonIndex + 1).trim();
      headers[key] = value;
    }
  }

  // Extract body/data (-d, --data, --data-raw, --data-binary)
  const dataMatch = normalized.match(/(?:-d|--data|--data-raw|--data-binary)\s+['"](.+?)['"]/);
  let body: string | undefined;
  if (dataMatch) {
    body = dataMatch[1]
      .replace(/\\"/g, '"') // Unescape quotes
      .replace(/\\n/g, '\n'); // Restore newlines
  }

  // Extract auth (-u or --user for Basic Auth)
  let auth: ParsedCurl['auth'];
  const authMatch = normalized.match(/(?:-u|--user)\s+['"]?([^'"\s:]+):([^'"\s]+)['"]?/);
  if (authMatch) {
    auth = {
      type: 'basic',
      username: authMatch[1],
      password: authMatch[2],
    };
  }

  // Detect Bearer token in headers
  const authHeader = headers['Authorization'] || headers['authorization'];
  if (authHeader?.startsWith('Bearer ')) {
    auth = {
      type: 'bearer',
      token: authHeader.replace('Bearer ', ''),
    };
  }

  return {
    method,
    url,
    headers,
    body,
    auth,
  };
}

/**
 * Generate cURL command from request details
 */
export interface GenerateCurlOptions {
  method: HttpMethod;
  url: string;
  headers?: Record<string, string>;
  body?: {
    type: 'json' | 'xml' | 'text' | 'form-data' | 'form-urlencoded' | 'yaml';
    content: string;
  };
  auth?: {
    type: 'none' | 'basic' | 'bearer' | 'api-key' | 'client-cert';
    config: Record<string, string>;
  };
  certificate?: {
    cert_path?: string;
    key_path?: string;
    pfx_path?: string;
    ca_path?: string;
    verify?: boolean;
  };
}

export function generateCurl(options: GenerateCurlOptions): string {
  const { method, url, headers = {}, body, auth, certificate } = options;

  const parts: string[] = ['curl'];

  // Add method
  if (method !== 'GET') {
    parts.push(`-X ${method}`);
  }

  // Add URL (quoted)
  parts.push(`'${url}'`);

  // Add auth headers
  if (auth) {
    if (auth.type === 'basic' && auth.config.username && auth.config.password) {
      parts.push(`-u '${auth.config.username}:${auth.config.password}'`);
    } else if (auth.type === 'bearer' && auth.config.token) {
      parts.push(`-H 'Authorization: Bearer ${auth.config.token}'`);
    } else if (auth.type === 'api-key' && auth.config.key && auth.config.value) {
      if (auth.config.addTo === 'header') {
        parts.push(`-H '${auth.config.key}: ${auth.config.value}'`);
      }
      // Query params will be in URL already
    }
  }

  // Add headers
  Object.entries(headers).forEach(([key, value]) => {
    if (value) {
      parts.push(`-H '${key}: ${value}'`);
    }
  });

  // Add body
  if (body && body.content) {
    const escapedBody = body.content.replace(/'/g, "'\\''"); // Escape single quotes
    parts.push(`-d '${escapedBody}'`);
  }

  // Add client certificate options
  if (certificate) {
    if (certificate.cert_path) {
      parts.push(`--cert '${certificate.cert_path}'`);
    }
    if (certificate.key_path) {
      parts.push(`--key '${certificate.key_path}'`);
    }
    if (certificate.pfx_path) {
      parts.push(`--cert '${certificate.pfx_path}'`);
    }
    if (certificate.ca_path) {
      parts.push(`--cacert '${certificate.ca_path}'`);
    }
    if (certificate.verify === false) {
      parts.push('--insecure');
    }
  }

  // Format with line breaks for readability
  return parts.join(' \\\n  ');
}

/**
 * Validate cURL command syntax
 */
export function validateCurl(curlCommand: string): { valid: boolean; error?: string } {
  if (!curlCommand.trim()) {
    return { valid: false, error: 'cURL command is empty' };
  }

  if (!curlCommand.trim().startsWith('curl')) {
    return { valid: false, error: 'Command must start with "curl"' };
  }

  try {
    const parsed = parseCurl(curlCommand);
    if (!parsed.url) {
      return { valid: false, error: 'No URL found in cURL command' };
    }
    return { valid: true };
  } catch (error) {
    return { valid: false, error: `Failed to parse cURL: ${error}` };
  }
}
