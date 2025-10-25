/**
 * YAML Converter Utility
 * Converts between flow-test YAML format and RequestData
 */

import yaml from 'js-yaml';
import type { RequestData } from '../components/organisms/RequestPane/RequestPane';
import type { RequestDetails } from '../types/flow-test.types';

/**
 * Parse flow-test YAML to RequestData
 * Handles both full test suite format and single request format
 */
export function parseFlowTestYAML(yamlContent: string): RequestData {
  try {
    // Parse YAML using js-yaml
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parsed = parseYAMLBasic(yamlContent) as any;

    // Check if it's a full test suite or single request
    let request: RequestDetails;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let assertions: any = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let pre_hooks: any[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let post_hooks: any[] = [];

    if (parsed.steps && Array.isArray(parsed.steps) && parsed.steps.length > 0) {
      // Extract first step as request
      const firstStep = parsed.steps[0];
      request = firstStep.request;
      assertions = firstStep.assertions || {};
      pre_hooks = firstStep.pre_hooks || [];
      post_hooks = firstStep.post_hooks || [];
    } else if (parsed.request) {
      request = parsed.request;
      assertions = parsed.assertions || {};
      pre_hooks = parsed.pre_hooks || [];
      post_hooks = parsed.post_hooks || [];
    } else {
      throw new Error('No valid request found in YAML. Expected "request" field or "steps" array.');
    }

    // Convert to RequestData format
    const requestData: RequestData = {
      method: (request.method?.toUpperCase() || 'GET') as RequestData['method'],
      url: request.url || '',
      params: convertToKeyValue(request.params),
      headers: convertToKeyValue(request.headers),
      body: {
        type: detectBodyType(request.body),
        content:
          typeof request.body === 'string' ? request.body : request.body ? JSON.stringify(request.body, null, 2) : '',
        formData:
          request.body && typeof request.body === 'object' && !Array.isArray(request.body)
            ? Object.entries(request.body).map(([key, value], index) => ({
                id: `form-${index}-${Date.now()}`,
                key,
                value: String(value),
                enabled: true,
              }))
            : [],
      },
      auth: {
        type: 'none',
        config: {},
      },
      assertions,
      pre_hooks,
      post_hooks,
      certificate: request.certificate,
    };

    // Detect auth type from headers or request
    if (request.headers) {
      const authHeader = request.headers['Authorization'] || request.headers['authorization'];
      if (authHeader && typeof authHeader === 'string') {
        if (authHeader.startsWith('Bearer ')) {
          requestData.auth = {
            type: 'bearer',
            config: {
              token: authHeader.replace('Bearer ', ''),
            },
          };
        } else if (authHeader.startsWith('Basic ')) {
          // Decode Basic auth if needed
          try {
            const base64Credentials = authHeader.replace('Basic ', '');
            const credentials = atob(base64Credentials);
            const [username, password] = credentials.split(':');
            requestData.auth = {
              type: 'basic',
              config: { username, password },
            };
          } catch {
            // Keep as none if decoding fails
          }
        }
      }
    }

    return requestData;
  } catch (error) {
    throw new Error(`Failed to parse YAML: ${error}`);
  }
}

/**
 * Export RequestData to flow-test YAML format
 */
export function exportToFlowTestYAML(
  requestData: RequestData,
  options: {
    name?: string;
    description?: string;
    includeAssertions?: boolean;
    includeHooks?: boolean;
  } = {}
): string {
  const {
    name = 'Exported Request',
    description = 'Request exported from Flow Test Web UI',
    includeAssertions = true,
    includeHooks = true,
  } = options;

  const yaml: string[] = [];

  // Header
  yaml.push('name: ' + quoteYAML(name));
  yaml.push('description: ' + quoteYAML(description));
  yaml.push('version: "1.0"');
  yaml.push('');
  yaml.push('steps:');
  yaml.push('  - name: ' + quoteYAML(name));

  // Request
  yaml.push('    request:');
  yaml.push(`      method: ${requestData.method}`);
  yaml.push('      url: ' + quoteYAML(requestData.url));

  // Headers
  if (requestData.headers && requestData.headers.length > 0) {
    yaml.push('      headers:');
    requestData.headers.forEach((header) => {
      if (header.enabled && header.key) {
        yaml.push(`        ${header.key}: ${quoteYAML(header.value)}`);
      }
    });
  }

  // Params
  if (requestData.params && requestData.params.length > 0) {
    yaml.push('      params:');
    requestData.params.forEach((param) => {
      if (param.enabled && param.key) {
        yaml.push(`        ${param.key}: ${quoteYAML(param.value)}`);
      }
    });
  }

  // Body
  if (requestData.body.content && requestData.body.type !== 'none') {
    yaml.push('      body: |');
    const bodyLines = requestData.body.content.split('\n');
    bodyLines.forEach((line) => {
      yaml.push(`        ${line}`);
    });
  }

  // Certificate
  if (requestData.certificate && Object.keys(requestData.certificate).length > 0) {
    yaml.push('      certificate:');
    if (requestData.certificate.cert_path) {
      yaml.push(`        cert_path: ${quoteYAML(requestData.certificate.cert_path)}`);
    }
    if (requestData.certificate.key_path) {
      yaml.push(`        key_path: ${quoteYAML(requestData.certificate.key_path)}`);
    }
    if (requestData.certificate.pfx_path) {
      yaml.push(`        pfx_path: ${quoteYAML(requestData.certificate.pfx_path)}`);
    }
    if (requestData.certificate.ca_path) {
      yaml.push(`        ca_path: ${quoteYAML(requestData.certificate.ca_path)}`);
    }
    if (requestData.certificate.verify !== undefined) {
      yaml.push(`        verify: ${requestData.certificate.verify}`);
    }
  }

  // Pre-hooks
  if (includeHooks && requestData.pre_hooks && requestData.pre_hooks.length > 0) {
    yaml.push('    pre_hooks:');
    requestData.pre_hooks.forEach((hook) => {
      yaml.push('      - ' + JSON.stringify(hook));
    });
  }

  // Assertions
  if (includeAssertions && requestData.assertions) {
    yaml.push('    assertions:');

    if (requestData.assertions.status_code !== undefined) {
      yaml.push(`      status_code: ${requestData.assertions.status_code}`);
    }

    if (requestData.assertions.body && Object.keys(requestData.assertions.body).length > 0) {
      yaml.push('      body:');
      Object.entries(requestData.assertions.body).forEach(([path, checks]) => {
        yaml.push(`        ${path}:`);
        Object.entries(checks).forEach(([check, value]) => {
          yaml.push(`          ${check}: ${JSON.stringify(value)}`);
        });
      });
    }

    if (requestData.assertions.headers && Object.keys(requestData.assertions.headers).length > 0) {
      yaml.push('      headers:');
      Object.entries(requestData.assertions.headers).forEach(([header, checks]) => {
        yaml.push(`        ${header}:`);
        Object.entries(checks).forEach(([check, value]) => {
          yaml.push(`          ${check}: ${JSON.stringify(value)}`);
        });
      });
    }
  }

  // Post-hooks
  if (includeHooks && requestData.post_hooks && requestData.post_hooks.length > 0) {
    yaml.push('    post_hooks:');
    requestData.post_hooks.forEach((hook) => {
      yaml.push('      - ' + JSON.stringify(hook));
    });
  }

  return yaml.join('\n');
}

/**
 * Parse YAML using js-yaml library
 */
function parseYAMLBasic(_yamlContent: string): Record<string, unknown> {
  try {
    const parsed = yaml.load(_yamlContent);

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid YAML structure');
    }

    return parsed as Record<string, unknown>;
  } catch (error) {
    throw new Error(`YAML parsing error: ${error}`);
  }
} /**
 * Convert params/headers object to key-value array
 */
function convertToKeyValue(
  obj?: Record<string, string | number | boolean>
): Array<{ id: string; key: string; value: string; enabled: boolean }> {
  if (!obj) return [];

  return Object.entries(obj).map(([key, value], index) => ({
    id: `generated-${index}-${Date.now()}`,
    key,
    value: String(value),
    enabled: true,
  }));
}

/**
 * Detect body type from content
 */
function detectBodyType(body: unknown): 'json' | 'xml' | 'text' | 'yaml' | 'none' {
  if (!body) return 'none';

  if (typeof body === 'object') return 'json';

  const bodyStr = String(body).trim();
  if (bodyStr.startsWith('{') || bodyStr.startsWith('[')) return 'json';
  if (bodyStr.startsWith('<')) return 'xml';

  return 'text';
}

/**
 * Quote YAML string value if needed
 */
function quoteYAML(value: string): string {
  if (!value) return '""';

  // Quote if contains special characters
  if (value.includes(':') || value.includes('#') || value.includes('\n')) {
    return `"${value.replace(/"/g, '\\"')}"`;
  }

  return value;
}

/**
 * Validate YAML syntax
 */
export function validateYAML(yamlContent: string): { valid: boolean; error?: string } {
  if (!yamlContent.trim()) {
    return { valid: false, error: 'YAML content is empty' };
  }

  try {
    parseFlowTestYAML(yamlContent);
    return { valid: true };
  } catch (error) {
    return { valid: false, error: `Invalid YAML: ${error}` };
  }
}
