/**
 * Bidirectional converters between different test suite editing modes
 * YAML ↔ Wizard ↔ Form
 */

import * as yaml from 'js-yaml';
import { TestSuiteWizardData } from '../components/organisms/TestSuiteWizard/types';

export interface TestSuiteFormData {
  // Basic Info
  node_id?: string;
  suite_name?: string;
  description?: string;
  
  // Configuration
  base_url?: string;
  execution_mode?: 'sequential' | 'parallel';
  variables?: Record<string, any>;
  exports?: string[];
  exports_optional?: string[];
  
  // Dependencies
  depends?: Array<{
    suite: string;
    required?: boolean;
  }>;
  
  // Steps
  steps?: Array<{
    name: string;
    step_id?: string;
    request?: {
      method: string;
      url: string;
      headers?: Record<string, string>;
      body?: any;
      params?: Record<string, string>;
    };
    assert?: {
      status_code?: number | number[];
      body?: any;
      headers?: Record<string, string>;
      response_time_ms?: number;
    };
    capture?: Record<string, string>;
    scenarios?: Array<{
      condition: string;
      actions: Array<{
        type: string;
        target?: string;
        value?: any;
      }>;
    }>;
  }>;
  
  // Metadata
  metadata?: {
    priority?: 'critical' | 'high' | 'medium' | 'low';
    tags?: string[];
    timeout?: number;
  };
  
  // Certificate
  certificate?: {
    cert?: string;
    key?: string;
    passphrase?: string;
  };
}

/**
 * Convert YAML string to Wizard data structure
 */
export const yamlToWizard = (yamlContent: string): TestSuiteWizardData => {
  try {
    const parsed = yaml.load(yamlContent) as any;
    
    return {
      suite_name: parsed.suite_name,
      node_id: parsed.node_id,
      description: parsed.description,
      base_url: parsed.base_url,
      execution_mode: parsed.execution_mode || 'sequential',
      variables: parsed.variables || {},
      steps: parsed.steps || [],
    };
  } catch (error) {
    console.error('Failed to parse YAML:', error);
    throw new Error('Invalid YAML format');
  }
};

/**
 * Convert Wizard data to YAML string
 */
export const wizardToYAML = (wizardData: TestSuiteWizardData): string => {
  try {
    const testSuite: any = {};
    
    // Only include non-empty fields
    if (wizardData.node_id) testSuite.node_id = wizardData.node_id;
    if (wizardData.suite_name) testSuite.suite_name = wizardData.suite_name;
    if (wizardData.description) testSuite.description = wizardData.description;
    if (wizardData.base_url) testSuite.base_url = wizardData.base_url;
    if (wizardData.execution_mode) testSuite.execution_mode = wizardData.execution_mode;
    if (wizardData.variables && Object.keys(wizardData.variables).length > 0) {
      testSuite.variables = wizardData.variables;
    }
    if (wizardData.steps && wizardData.steps.length > 0) {
      testSuite.steps = wizardData.steps;
    }
    
    return yaml.dump(testSuite, { indent: 2, lineWidth: 120 });
  } catch (error) {
    console.error('Failed to generate YAML:', error);
    throw new Error('Failed to convert wizard data to YAML');
  }
};

/**
 * Convert YAML string to Form data structure
 */
export const yamlToForm = (yamlContent: string): TestSuiteFormData => {
  try {
    const parsed = yaml.load(yamlContent) as any;
    return parsed || {};
  } catch (error) {
    console.error('Failed to parse YAML:', error);
    throw new Error('Invalid YAML format');
  }
};

/**
 * Convert Form data to YAML string
 */
export const formToYAML = (formData: TestSuiteFormData): string => {
  try {
    // Filter out empty/undefined values for cleaner YAML
    const cleanData: any = {};
    
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        // Skip empty objects
        if (typeof value === 'object' && !Array.isArray(value)) {
          if (Object.keys(value).length > 0) {
            cleanData[key] = value;
          }
        }
        // Skip empty arrays
        else if (Array.isArray(value)) {
          if (value.length > 0) {
            cleanData[key] = value;
          }
        }
        // Include primitives
        else {
          cleanData[key] = value;
        }
      }
    });
    
    return yaml.dump(cleanData, { indent: 2, lineWidth: 120 });
  } catch (error) {
    console.error('Failed to generate YAML:', error);
    throw new Error('Failed to convert form data to YAML');
  }
};

/**
 * Convert Wizard data to Form data
 */
export const wizardToForm = (wizardData: TestSuiteWizardData): TestSuiteFormData => {
  return {
    node_id: wizardData.node_id,
    suite_name: wizardData.suite_name,
    description: wizardData.description,
    base_url: wizardData.base_url,
    execution_mode: wizardData.execution_mode as 'sequential' | 'parallel',
    variables: wizardData.variables,
    steps: wizardData.steps as any, // Type cast to avoid conflicts
  };
};

/**
 * Convert Form data to Wizard data
 */
export const formToWizard = (formData: TestSuiteFormData): TestSuiteWizardData => {
  return {
    node_id: formData.node_id,
    suite_name: formData.suite_name,
    description: formData.description,
    base_url: formData.base_url,
    execution_mode: formData.execution_mode,
    variables: formData.variables,
    steps: formData.steps as any, // Type cast to avoid conflicts
  };
};

/**
 * Validate if YAML can be safely converted to Wizard/Form
 * Returns warnings about potential data loss
 */
export interface ConversionWarning {
  field: string;
  message: string;
  severity: 'warning' | 'error';
}

export const validateConversion = (
  yamlContent: string,
  targetMode: 'wizard' | 'form'
): ConversionWarning[] => {
  const warnings: ConversionWarning[] = [];
  
  try {
    const parsed = yaml.load(yamlContent) as any;
    
    // Check for advanced features not supported in wizard mode
    if (targetMode === 'wizard') {
      if (parsed.depends && parsed.depends.length > 0) {
        warnings.push({
          field: 'depends',
          message: 'Dependencies are not fully supported in Wizard mode',
          severity: 'warning',
        });
      }
      
      if (parsed.certificate) {
        warnings.push({
          field: 'certificate',
          message: 'Certificate configuration is not supported in Wizard mode',
          severity: 'warning',
        });
      }
      
      if (parsed.exports_optional && parsed.exports_optional.length > 0) {
        warnings.push({
          field: 'exports_optional',
          message: 'Optional exports are not supported in Wizard mode',
          severity: 'warning',
        });
      }
    }
    
    // Check for required fields
    if (!parsed.node_id) {
      warnings.push({
        field: 'node_id',
        message: 'node_id is required',
        severity: 'error',
      });
    }
    
    if (!parsed.suite_name) {
      warnings.push({
        field: 'suite_name',
        message: 'suite_name is required',
        severity: 'error',
      });
    }
    
  } catch (error) {
    warnings.push({
      field: 'yaml',
      message: 'Invalid YAML syntax',
      severity: 'error',
    });
  }
  
  return warnings;
};
