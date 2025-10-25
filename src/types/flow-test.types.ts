/**
 * Flow Test Engine Types
 *
 * TypeScript interfaces baseadas no flow-test-engine.schema.json v2.0.1
 * Estruturas de dados para configuração de testes, assertions, hooks e certificados
 */

// ============================================================================
// HTTP & Request Types
// ============================================================================

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export type ExecutionMode = 'sequential' | 'parallel';

export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';

export type PathType = 'relative' | 'absolute';

export type TLSVersion = 'TLSv1' | 'TLSv1.1' | 'TLSv1.2' | 'TLSv1.3';

// ============================================================================
// Certificate Configuration (mTLS)
// ============================================================================

export interface CertificateConfig {
  /** Path to client certificate file (.crt, .pem) */
  cert_path?: string;
  /** Path to private key file (.key, .pem) */
  key_path?: string;
  /** Path to PFX/P12 certificate file */
  pfx_path?: string;
  /** Certificate passphrase (use {{$env.VAR}} for security) */
  passphrase?: string;
  /** Path to CA certificate */
  ca_path?: string;
  /** Verify SSL certificate (disable only for testing) */
  verify?: boolean;
  /** Minimum TLS version */
  min_version?: TLSVersion;
  /** Maximum TLS version */
  max_version?: TLSVersion;
}

// ============================================================================
// Request Configuration
// ============================================================================

export interface RequestDetails {
  /** HTTP method */
  method: HttpMethod;
  /** Request URL (absolute or relative to base_url) */
  url: string;
  /** HTTP headers */
  headers?: Record<string, string>;
  /** Request body (for POST/PUT/PATCH) */
  body?: string | Record<string, unknown> | unknown[];
  /** Query string parameters */
  params?: Record<string, string | number>;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Request-specific client certificate (overrides suite) */
  certificate?: CertificateConfig;
}

// ============================================================================
// Assertion Types
// ============================================================================

export type AssertionValueType = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'null';

export interface AssertionChecks {
  /** Exact equality check */
  equals?: string | number | boolean | null;
  /** Not equal check */
  not_equals?: string | number | boolean | null;
  /** Contains substring or array element */
  contains?: string | number | boolean;
  /** Does not contain substring or element */
  not_contains?: string | number | boolean;
  /** Greater than comparison */
  greater_than?: number;
  /** Less than comparison */
  less_than?: number;
  /** Greater than or equal comparison */
  greater_than_or_equal?: number;
  /** Less than or equal comparison */
  less_than_or_equal?: number;
  /** Regular expression pattern match */
  regex?: string;
  /** Alias for regex */
  pattern?: string;
  /** Field existence check */
  exists?: boolean;
  /** Field non-existence check (alias for exists: false) */
  not_exists?: boolean;
  /** Type validation */
  type?: AssertionValueType;
  /** Length validation (strings/arrays) - recursive checks */
  length?: AssertionChecks;
  /** Minimum length (strings/arrays) */
  minLength?: number;
  /** Not empty check */
  notEmpty?: boolean;
  /** Value must be in list */
  in?: (string | number | boolean)[];
  /** Value must not be in list */
  not_in?: (string | number | boolean)[];
}

export interface CustomAssertion {
  /** Assertion name */
  name: string;
  /** JMESPath or JavaScript expression */
  condition: string;
  /** Error message if assertion fails */
  message?: string;
  /** Severity level (default: error) */
  severity?: 'error' | 'warning' | 'info';
}

export interface Assertions {
  /** Expected HTTP status code */
  status_code?: number | AssertionChecks;
  /** Body field validations (nested object with JMESPath keys) */
  body?: Record<string, AssertionChecks>;
  /** Header validations */
  headers?: Record<string, AssertionChecks>;
  /** Response time validation */
  response_time_ms?: AssertionChecks;
  /** Custom assertion expressions */
  custom?: CustomAssertion[];
}

// ============================================================================
// Hooks (Lifecycle Actions) - v2.0+
// ============================================================================

export interface HookCompute {
  /** Variable name to compute value */
  [variable: string]: string;
}

export interface HookCapture {
  /** Variable name: JMESPath expression */
  [variable: string]: string;
}

export interface HookValidation {
  /** JavaScript/JMESPath expression */
  expression: string;
  /** Error/warning message */
  message: string;
  /** Severity level (default: error) */
  severity?: 'error' | 'warning' | 'info';
}

export interface HookLog {
  /** Log level */
  level: 'info' | 'warn' | 'error' | 'debug';
  /** Log message (interpolable) */
  message: string;
  /** Additional context data */
  context?: Record<string, unknown>;
}

export interface HookMetric {
  /** Metric name */
  name: string;
  /** Metric value (numeric or interpolable expression) */
  value: number | string;
  /** Metric tags for categorization */
  tags?: Record<string, string>;
  /** Metric type */
  type?: 'counter' | 'gauge' | 'histogram' | 'timer';
}

export interface StepCallConfig {
  /** Path to target test suite file */
  test: string;
  /** Path resolution type */
  path_type?: PathType;
  /** Step ID or name to call */
  step: string;
  /** Variables to inject into called step */
  variables?: Record<string, unknown>;
  /** Isolate execution context */
  isolate_context?: boolean;
  /** Error handling strategy */
  on_error?: 'fail' | 'continue' | 'warn';
}

export interface HookAction {
  /** Compute variables using interpolation/JavaScript */
  compute?: HookCompute;
  /** Capture data from context using JMESPath */
  capture?: HookCapture;
  /** Export variables to global scope */
  exports?: string[];
  /** Validation expressions with severity levels */
  validate?: HookValidation[];
  /** Emit structured log message */
  log?: HookLog;
  /** Emit metric for telemetry */
  metric?: HookMetric;
  /** Execute arbitrary JavaScript */
  script?: string;
  /** Call another step or suite */
  call?: StepCallConfig;
  /** Delay in milliseconds */
  wait?: number;
}

// ============================================================================
// Input Configuration
// ============================================================================

export type InputType =
  | 'text'
  | 'password'
  | 'number'
  | 'email'
  | 'url'
  | 'select'
  | 'multiselect'
  | 'confirm'
  | 'multiline';

export interface InputOption {
  /** Option value */
  value: string | number | boolean;
  /** Option display label */
  label: string;
  /** Option description */
  description?: string;
}

export interface InputValidation {
  /** Minimum length */
  min_length?: number;
  /** Maximum length */
  max_length?: number;
  /** Regex pattern */
  pattern?: string;
  /** Minimum value (for number type) */
  min?: number;
  /** Maximum value (for number type) */
  max?: number;
}

export interface InputConfig {
  /** Message displayed to user */
  prompt: string;
  /** Variable name to store input */
  variable: string;
  /** Input type */
  type: InputType;
  /** Detailed description */
  description?: string;
  /** Default value */
  default?: string | number | boolean;
  /** Whether input is required */
  required?: boolean;
  /** Default value in CI/CD environments */
  ci_default?: string | number | boolean;
  /** Options for select/multiselect (array or expression) */
  options?: InputOption[] | string;
  /** Validation rules */
  validation?: InputValidation;
  /** Timeout before using default */
  timeout_seconds?: number;
}

// ============================================================================
// Iteration Configuration
// ============================================================================

export interface IterationConfig {
  /** Array expression to iterate over */
  over?: string;
  /** Range expression (format: "start..end") */
  range?: string;
  /** Variable name for current item/index */
  as: string;
}

// ============================================================================
// Conditional Scenarios
// ============================================================================

export interface ConditionalScenarioActions {
  /** Assertions to run */
  assert?: Assertions;
  /** Variables to capture */
  capture?: Record<string, string>;
  /** Hooks to execute */
  hooks?: HookAction[];
}

export interface ConditionalScenario {
  /** Scenario name */
  name?: string;
  /** JMESPath condition expression */
  condition: string;
  /** Actions if condition is true */
  then?: ConditionalScenarioActions;
  /** Actions if condition is false */
  else?: ConditionalScenarioActions;
}

// ============================================================================
// Test Step
// ============================================================================

export interface TestStepMetadata {
  /** Priority level */
  priority?: PriorityLevel;
  /** Tags for categorization */
  tags?: string[];
  /** Step-wide timeout in milliseconds */
  timeout?: number;
  /** Retry configuration */
  retry?: {
    max_attempts?: number;
    delay_ms?: number;
    backoff?: 'fixed' | 'exponential';
  };
}

export interface TestStep {
  /** Descriptive name for the step */
  name: string;
  /** Optional unique identifier for the step */
  step_id?: string;
  /** HTTP request configuration */
  request?: RequestDetails;
  /** Validation rules for response */
  assert?: Assertions;
  /** Extract data from response using JMESPath */
  capture?: Record<string, string>;
  /** Interactive user input configuration */
  input?: InputConfig | InputConfig[];
  /** Call step from another suite */
  call?: StepCallConfig;
  /** Execute step in a loop */
  iterate?: IterationConfig;
  /** Conditional scenarios based on response */
  scenarios?: ConditionalScenario[];
  /** Continue execution even if step fails */
  continue_on_failure?: boolean;
  /** Condition to skip step execution */
  skip?: string;
  /** Step metadata */
  metadata?: TestStepMetadata;

  // Lifecycle Hooks (v2.0+)
  hooks_pre_request?: HookAction[];
  hooks_post_request?: HookAction[];
  hooks_pre_assertion?: HookAction[];
  hooks_post_assertion?: HookAction[];
  hooks_pre_capture?: HookAction[];
  hooks_post_capture?: HookAction[];
  hooks_pre_input?: HookAction[];
  hooks_post_input?: HookAction[];
  hooks_pre_iteration?: HookAction[];
  hooks_post_iteration?: HookAction[];
  hooks_pre_call?: HookAction[];
  hooks_post_call?: HookAction[];
}

// ============================================================================
// Flow Dependency
// ============================================================================

export interface FlowDependency {
  /** Path to dependency suite file */
  path?: string;
  /** Direct reference by node ID */
  node_id?: string;
  /** Path resolution type */
  path_type?: PathType;
  /** Whether dependency is mandatory */
  required?: boolean;
  /** Cache results (true/false or TTL in seconds) */
  cache?: boolean | number;
  /** JMESPath condition for conditional execution */
  condition?: string;
  /** Variables to override in dependency */
  variables?: Record<string, unknown>;
  /** Retry configuration */
  retry?: {
    max_attempts?: number;
    delay_ms?: number;
    backoff?: 'fixed' | 'exponential';
  };
}

// ============================================================================
// Test Suite
// ============================================================================

export interface TestSuiteMetadata {
  /** Priority level */
  priority?: PriorityLevel;
  /** Tags for categorization */
  tags?: string[];
  /** Suite-wide timeout in milliseconds */
  timeout?: number;
}

export interface TestSuite {
  /** Unique identifier for the suite (kebab-case) */
  node_id: string;
  /** Human-readable name for the suite */
  suite_name: string;
  /** Optional description of the suite purpose */
  description?: string;
  /** Base URL for relative request URLs */
  base_url?: string;
  /** Execution mode for steps */
  execution_mode?: ExecutionMode;
  /** Suite-local variables */
  variables?: Record<string, unknown>;
  /** Variables to export globally for other suites */
  exports?: string[];
  /** Optional exports (no warnings if not captured) */
  exports_optional?: string[];
  /** Dependencies on other test suites */
  depends?: FlowDependency[];
  /** Array of test steps to execute */
  steps: TestStep[];
  /** Suite metadata */
  metadata?: TestSuiteMetadata;
  /** Client certificate configuration for mTLS */
  certificate?: CertificateConfig;
}

// ============================================================================
// Execution Results
// ============================================================================

export interface AssertionResult {
  /** Assertion name/path (e.g., "status_code", "body.user.id") */
  path: string;
  /** Assertion operator used */
  operator: keyof AssertionChecks | 'custom';
  /** Expected value */
  expected: unknown;
  /** Actual value received */
  actual: unknown;
  /** Assertion passed */
  passed: boolean;
  /** Error message (if failed) */
  message?: string;
  /** Severity level */
  severity?: 'error' | 'warning' | 'info';
}

export interface CapturedVariable {
  /** Variable name */
  name: string;
  /** Captured value */
  value: unknown;
  /** JMESPath expression used */
  expression: string;
  /** Source (response body, headers, etc.) */
  source: 'body' | 'headers' | 'status' | 'computed';
}

export interface ConsoleLog {
  /** Timestamp */
  timestamp: number;
  /** Log level */
  level: 'info' | 'warn' | 'error' | 'debug';
  /** Log message */
  message: string;
  /** Source of log (hook, system, etc.) */
  source?: string;
  /** Additional context */
  context?: Record<string, unknown>;
}

export interface ExecutionResult {
  /** Test step executed */
  step: TestStep;
  /** HTTP request made */
  request?: RequestDetails;
  /** HTTP response received */
  response?: {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: unknown;
    size: number;
    time: number;
  };
  /** Assertion results */
  assertionResults?: AssertionResult[];
  /** Captured variables */
  capturedVariables?: CapturedVariable[];
  /** Console logs */
  consoleLogs?: ConsoleLog[];
  /** cURL command equivalent */
  curlCommand?: string;
  /** Execution success */
  success: boolean;
  /** Error details (if failed) */
  error?: {
    message: string;
    stack?: string;
    code?: string;
  };
}
