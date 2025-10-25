import * as yaml from 'js-yaml';
import type { TestSuite } from '../store/slices/collectionsSlice';

/**
 * Parse YAML string to TestSuite object
 * @param yamlString - YAML content as string
 * @returns Parsed TestSuite object
 * @throws Error if YAML is invalid or doesn't match TestSuite structure
 */
export function parseYAMLToSuite(yamlString: string): TestSuite {
  try {
    const parsed = yaml.load(yamlString);

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid YAML: Expected an object');
    }

    const suite = parsed as Record<string, unknown>;

    // Validate required fields
    if (!suite.suite_name || typeof suite.suite_name !== 'string') {
      throw new Error('Invalid YAML: Missing or invalid "suite_name" field');
    }

    if (!suite.node_id || typeof suite.node_id !== 'string') {
      throw new Error('Invalid YAML: Missing or invalid "node_id" field');
    }

    if (!suite.steps || !Array.isArray(suite.steps)) {
      throw new Error('Invalid YAML: Missing or invalid "steps" field');
    }

    // Build TestSuite object with proper typing
    const testSuite: TestSuite = {
      id: suite.node_id,
      suite_name: suite.suite_name,
      node_id: suite.node_id,
      description: typeof suite.description === 'string' ? suite.description : undefined,
      base_url: typeof suite.base_url === 'string' ? suite.base_url : undefined,
      variables: Array.isArray(suite.variables)
        ? suite.variables.map((v: unknown) => {
            if (typeof v === 'object' && v !== null) {
              const varObj = v as Record<string, unknown>;
              return {
                key: String(varObj.key || ''),
                value: String(varObj.value || ''),
                enabled: Boolean(varObj.enabled !== false),
              };
            }
            return { key: '', value: '', enabled: true };
          })
        : undefined,
      steps: (suite.steps as Array<unknown>).map((step: unknown, index: number) => {
        if (typeof step === 'object' && step !== null) {
          const stepObj = step as Record<string, unknown>;
          const request = stepObj.request as Record<string, unknown> | undefined;

          return {
            id: String(stepObj.id || `step-${index}`),
            name: String(stepObj.name || `Step ${index + 1}`),
            method: (request?.method as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH') || 'GET',
            url: String(request?.url || '/'),
            headers: request?.headers as Record<string, string> | undefined,
            body: request?.body as Record<string, unknown> | string | null | undefined,
            assert: stepObj.assert as Record<string, unknown> | undefined,
          };
        }
        return {
          id: `step-${index}`,
          name: `Step ${index + 1}`,
          method: 'GET' as const,
          url: '/',
        };
      }),
      metadata:
        suite.metadata && typeof suite.metadata === 'object'
          ? (suite.metadata as { priority?: 'critical' | 'high' | 'medium' | 'low'; tags?: string[] })
          : undefined,
    };

    return testSuite;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse YAML: ${error.message}`);
    }
    throw new Error('Failed to parse YAML: Unknown error');
  }
}

/**
 * Convert TestSuite object to YAML string
 * @param suite - TestSuite object
 * @returns YAML string representation
 */
export function suiteToYAML(suite: TestSuite): string {
  try {
    // Build clean object for YAML serialization
    const yamlObject: Record<string, unknown> = {
      suite_name: suite.suite_name,
      node_id: suite.node_id,
    };

    // Add optional fields only if they exist
    if (suite.description) {
      yamlObject.description = suite.description;
    }

    if (suite.base_url) {
      yamlObject.base_url = suite.base_url;
    }

    // Convert variables array back to object format
    if (suite.variables && suite.variables.length > 0) {
      const varsObj: Record<string, string> = {};
      suite.variables.forEach((v) => {
        if (v.enabled) {
          varsObj[v.key] = v.value;
        }
      });
      if (Object.keys(varsObj).length > 0) {
        yamlObject.variables = varsObj;
      }
    }

    // Convert steps back to Flow Test YAML format
    yamlObject.steps = suite.steps.map((step) => {
      const stepObj: Record<string, unknown> = {
        name: step.name,
        request: {
          method: step.method,
          url: step.url,
        },
      };

      const request = stepObj.request as Record<string, unknown>;

      if (step.headers && Object.keys(step.headers).length > 0) {
        request.headers = step.headers;
      }

      if (step.body !== undefined && step.body !== null) {
        request.body = step.body;
      }

      if (step.assert) {
        stepObj.assert = step.assert;
      }

      return stepObj;
    });

    // Add metadata if present
    if (suite.metadata) {
      yamlObject.metadata = suite.metadata;
    }

    // Convert to YAML with proper formatting
    return yaml.dump(yamlObject, {
      indent: 2,
      lineWidth: 120,
      noRefs: true,
      sortKeys: false,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to convert suite to YAML: ${error.message}`);
    }
    throw new Error('Failed to convert suite to YAML: Unknown error');
  }
}

/**
 * Validate YAML string without full parsing
 * @param yamlString - YAML content to validate
 * @returns Object with validation result and errors
 */
export function validateYAML(yamlString: string): {
  isValid: boolean;
  errors?: string[];
} {
  try {
    yaml.load(yamlString);
    return { isValid: true };
  } catch (error) {
    if (error instanceof Error) {
      return {
        isValid: false,
        errors: [error.message],
      };
    }
    return {
      isValid: false,
      errors: ['Unknown YAML parsing error'],
    };
  }
}

/**
 * Extract suite metadata from YAML without full parsing
 * Useful for quick preview/validation
 * @param yamlString - YAML content
 * @returns Object with suite name and node_id or null if invalid
 */
export function extractSuiteMetadata(yamlString: string): {
  suite_name?: string;
  node_id?: string;
  description?: string;
} | null {
  try {
    const parsed = yaml.load(yamlString);

    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    const suite = parsed as Record<string, unknown>;

    return {
      suite_name: typeof suite.suite_name === 'string' ? suite.suite_name : undefined,
      node_id: typeof suite.node_id === 'string' ? suite.node_id : undefined,
      description: typeof suite.description === 'string' ? suite.description : undefined,
    };
  } catch {
    return null;
  }
}
