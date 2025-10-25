/**
 * Test Execution Types
 * Estruturas de dados para execução e resultados de testes
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JsonValue = any;

export interface RequestDetails {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  url: string;
  headers?: Record<string, string>;
  body?: JsonValue;
  params?: Record<string, JsonValue>;
}

export interface ResponseDetails {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: JsonValue;
  responseTime: number;
  contentType?: string;
}

export interface AssertionResult {
  path: string;
  operator: string;
  expected: JsonValue;
  actual: JsonValue;
  passed: boolean;
  message?: string;
}

export interface CapturedVariable {
  name: string;
  value: JsonValue;
  expression: string; // JMESPath expression
  scope: 'local' | 'global';
}

export interface ExportedVariable {
  name: string;
  value: JsonValue;
  availableAs: string; // Como pode ser acessada (ex: "{{suite-id.var-name}}")
}

export interface StepExecutionResult {
  stepName: string;
  stepId?: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: 'passed' | 'failed' | 'skipped';
  request?: RequestDetails;
  response?: ResponseDetails;
  assertions: AssertionResult[];
  captured: CapturedVariable[];
  exported: ExportedVariable[];
  error?: string;
  curlCommand?: string;
}

export interface SuiteExecutionResult {
  suiteName: string;
  nodeId: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: 'passed' | 'failed' | 'skipped';
  steps: StepExecutionResult[];
  stats: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
  };
}
