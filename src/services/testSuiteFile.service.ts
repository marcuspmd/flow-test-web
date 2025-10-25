/**
 * Test Suite File Service
 * Handles saving and exporting test suite YAML files
 */

import * as yaml from 'js-yaml';

export interface SaveResult {
  success?: boolean;
  canceled?: boolean;
  filePath?: string;
  error?: string;
}

/**
 * Save test suite to file system using Electron dialog
 */
export const saveTestSuiteToFile = async (
  yamlContent: string,
  suggestedName: string
): Promise<SaveResult> => {
  if (!window.flowTestAPI?.saveTestSuite) {
    throw new Error('Electron API not available. Running in browser mode.');
  }

  try {
    const result = await window.flowTestAPI.saveTestSuite(yamlContent, suggestedName);
    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save test suite',
    };
  }
};

/**
 * Export test suite as YAML download (browser fallback)
 */
export const downloadTestSuiteYAML = (yamlContent: string, filename: string): void => {
  const blob = new Blob([yamlContent], { type: 'text/yaml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.yaml`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Validate YAML content before saving
 */
export const validateTestSuiteYAML = (yamlContent: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!yamlContent || yamlContent.trim().length === 0) {
    errors.push('YAML content is empty');
    return { valid: false, errors };
  }

  try {
    // Try to parse as YAML
    const parsed = yaml.load(yamlContent) as any;

    // Check for required fields
    if (!parsed) {
      errors.push('Invalid YAML structure');
    } else {
      if (!parsed.node_id) {
        errors.push('Missing required field: node_id');
      }
      if (!parsed.suite_name) {
        errors.push('Missing required field: suite_name');
      }
      if (!parsed.steps || !Array.isArray(parsed.steps) || parsed.steps.length === 0) {
        errors.push('Missing required field: steps (must be a non-empty array)');
      }
    }
  } catch (error) {
    errors.push(`YAML parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return { valid: errors.length === 0, errors };
};
