/**
 * Type definitions for Test Suite Wizard
 */

export interface TestStepRequest {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: string;
}

export interface TestStep {
  name: string;
  step_id?: string;
  request?: TestStepRequest;
  assert?: Record<string, unknown>;
  capture?: Record<string, unknown>;
}

export interface TestSuiteWizardData {
  suite_name?: string;
  node_id?: string;
  description?: string;
  base_url?: string;
  execution_mode?: string;
  variables?: Record<string, string>;
  steps?: TestStep[];
}
