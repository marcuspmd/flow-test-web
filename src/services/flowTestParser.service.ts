/**
 * Flow Test CLI Output Parser
 * Parseia a saída do flow-test-engine CLI para estruturas tipadas
 */

import { StepExecutionResult, AssertionResult, CapturedVariable, ExportedVariable } from '../types/testExecution.types';

interface PartialStepResult {
  stepName?: string;
  stepId?: string;
  stepIndex?: number;
  startTime?: string;
  endTime?: string;
  duration?: number;
  status?: 'passed' | 'failed' | 'skipped';
  request?: Partial<StepExecutionResult['request']>;
  response?: Partial<StepExecutionResult['response']>;
  assertions?: AssertionResult[];
  captured?: CapturedVariable[];
  exported?: ExportedVariable[];
  error?: string;
}

/**
 * Parseia logs do CLI para extrair resultados estruturados de steps
 */
export class FlowTestOutputParser {
  private logs: string[] = [];
  private currentStep: PartialStepResult | null = null;
  private steps: StepExecutionResult[] = [];

  /**
   * Adiciona log e processa
   */
  addLog(message: string): void {
    this.logs.push(message);
    this.processLog(message);
  }

  /**
   * Processa uma linha de log
   */
  private processLog(message: string): void {
    // Detectar início de step
    if (this.isStepStart(message)) {
      this.finalizeCurrentStep();
      this.startNewStep(message);
      return;
    }

    // Detectar request details
    if (this.isRequestLine(message)) {
      this.parseRequest(message);
      return;
    }

    // Detectar response
    if (this.isResponseLine(message)) {
      this.parseResponse(message);
      return;
    }

    // Detectar assertions
    if (this.isAssertionLine(message)) {
      this.parseAssertion(message);
      return;
    }

    // Detectar captured variables
    if (this.isCapturedVariableLine(message)) {
      this.parseCapturedVariable(message);
      return;
    }

    // Detectar exported variables
    if (this.isExportedVariableLine(message)) {
      this.parseExportedVariable(message);
      return;
    }

    // Detectar step completion
    if (this.isStepComplete(message)) {
      this.finalizeCurrentStep();
    }
  }

  /**
   * Verifica se é início de step
   */
  private isStepStart(message: string): boolean {
    return /^\[STEP \d+\/\d+\]/.test(message) || /^▶\s+Step/.test(message) || /^Running step:/.test(message);
  }

  /**
   * Inicia novo step
   */
  private startNewStep(message: string): void {
    const stepMatch = message.match(/^\[STEP (\d+)\/(\d+)\]\s+(.+)/) || message.match(/^▶\s+Step \d+:\s+(.+)/);

    if (stepMatch) {
      this.currentStep = {
        stepName: stepMatch[3] || stepMatch[1] || 'Unknown Step',
        stepIndex: parseInt(stepMatch[1] || '0', 10) - 1,
        status: 'passed', // Default, será atualizado
        startTime: new Date().toISOString(),
        duration: 0,
        request: undefined,
        response: undefined,
        assertions: [],
        captured: [],
        exported: [],
      };
    }
  }

  /**
   * Verifica se é linha de request
   */
  private isRequestLine(message: string): boolean {
    return /^(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)\s+/.test(message) || /Request:/.test(message);
  }

  /**
   * Parseia request
   */
  private parseRequest(message: string): void {
    if (!this.currentStep) return;

    const methodMatch = message.match(/^(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)\s+(.+)/);
    if (methodMatch) {
      const method = methodMatch[1] as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
      this.currentStep.request = {
        method,
        url: methodMatch[2].trim(),
        headers: {},
      };
    }

    // Parse headers (formato: "Header-Name: value")
    const headerMatch = message.match(/^\s+([A-Za-z-]+):\s+(.+)/);
    if (headerMatch && this.currentStep.request) {
      this.currentStep.request.headers = this.currentStep.request.headers || {};
      this.currentStep.request.headers[headerMatch[1]] = headerMatch[2];
    }

    // Parse body (JSON)
    if (message.includes('Body:') || message.trim().startsWith('{')) {
      try {
        const jsonMatch = message.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          this.currentStep.request!.body = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        // Ignore JSON parse errors
      }
    }
  }

  /**
   * Verifica se é linha de response
   */
  private isResponseLine(message: string): boolean {
    return /Status:\s+\d+/.test(message) || /Response time:/.test(message) || /^Response:/.test(message);
  }

  /**
   * Parseia response
   */
  private parseResponse(message: string): void {
    if (!this.currentStep) return;

    // Parse status code
    const statusMatch = message.match(/Status:\s+(\d+)/);
    if (statusMatch) {
      this.currentStep.response = {
        ...this.currentStep.response,
        status: parseInt(statusMatch[1], 10),
      };
    }

    // Parse response time
    const timeMatch = message.match(/Response time:\s+([\d.]+)\s*ms/);
    if (timeMatch) {
      this.currentStep.duration = parseFloat(timeMatch[1]);
    }

    // Parse response body
    if (message.includes('Response body:') || message.trim().startsWith('{')) {
      try {
        const jsonMatch = message.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          this.currentStep.response!.body = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        // Se não for JSON, armazena como string
        this.currentStep.response!.body = message.trim();
      }
    }
  }

  /**
   * Verifica se é linha de assertion
   */
  private isAssertionLine(message: string): boolean {
    return /✓|✗|PASS|FAIL|Assert/.test(message);
  }

  /**
   * Parseia assertion
   */
  private parseAssertion(message: string): void {
    if (!this.currentStep) return;

    const passed = /✓|PASS/.test(message);
    const assertionMatch =
      message.match(/(?:✓|✗)\s+(.+?):\s+expected\s+(.+?),\s+got\s+(.+)/) || message.match(/(?:✓|✗)\s+(.+?):\s+(.+)/);

    if (assertionMatch) {
      const assertion: AssertionResult = {
        path: assertionMatch[1]?.trim() || 'unknown',
        operator: 'equals', // Default operator
        expected: assertionMatch[2]?.trim(),
        actual: assertionMatch[3]?.trim() || assertionMatch[2]?.trim(),
        passed,
      };

      this.currentStep.assertions = this.currentStep.assertions || [];
      this.currentStep.assertions.push(assertion);
    }
  }

  /**
   * Verifica se é linha de captured variable
   */
  private isCapturedVariableLine(message: string): boolean {
    return /Captured variable|Variable captured/.test(message) || /→/.test(message);
  }

  /**
   * Parseia captured variable
   */
  private parseCapturedVariable(message: string): void {
    if (!this.currentStep) return;

    const captureMatch = message.match(/(\w+)\s*[=:→]\s*(.+)/) || message.match(/Captured:\s+(\w+)\s*=\s*(.+)/);

    if (captureMatch) {
      const variable: CapturedVariable = {
        name: captureMatch[1].trim(),
        value: this.parseValue(captureMatch[2].trim()),
        expression: captureMatch[2].trim(), // A expressão original
        scope: 'local', // Default scope
      };

      this.currentStep.captured = this.currentStep.captured || [];
      this.currentStep.captured.push(variable);
    }
  }

  /**
   * Verifica se é linha de exported variable
   */
  private isExportedVariableLine(message: string): boolean {
    return /Exported|Export variable/.test(message);
  }

  /**
   * Parseia exported variable
   */
  private parseExportedVariable(message: string): void {
    if (!this.currentStep) return;

    const exportMatch = message.match(/Export(?:ed)?\s+(\w+)\s*[=:]\s*(.+)/);

    if (exportMatch) {
      const variable: ExportedVariable = {
        name: exportMatch[1].trim(),
        value: this.parseValue(exportMatch[2].trim()),
        availableAs: `{{${exportMatch[1].trim()}}}`, // Como pode ser acessada
      };

      this.currentStep.exported = this.currentStep.exported || [];
      this.currentStep.exported.push(variable);
    }
  }

  /**
   * Parseia valor (tenta JSON, senão retorna string)
   */
  private parseValue(value: string): any {
    try {
      return JSON.parse(value);
    } catch {
      // Remove aspas se for string entre aspas
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        return value.slice(1, -1);
      }
      return value;
    }
  }

  /**
   * Verifica se step foi completado
   */
  private isStepComplete(message: string): boolean {
    return /Step completed|✓ Success|✗ Failed/.test(message) || /^\[STEP \d+\/\d+\]/.test(message);
  }

  /**
   * Finaliza step atual
   */
  private finalizeCurrentStep(): void {
    if (this.currentStep && this.currentStep.stepName) {
      // Determinar status final
      const hasFailedAssertions = this.currentStep.assertions?.some((a) => !a.passed);
      this.currentStep.status = hasFailedAssertions ? 'failed' : 'passed';
      this.currentStep.endTime = new Date().toISOString();

      // Converter para StepExecutionResult completo
      const completeStep: StepExecutionResult = {
        stepName: this.currentStep.stepName,
        stepId: this.currentStep.stepId,
        startTime: this.currentStep.startTime || new Date().toISOString(),
        endTime: this.currentStep.endTime,
        duration: this.currentStep.duration || 0,
        status: this.currentStep.status,
        assertions: this.currentStep.assertions || [],
        captured: this.currentStep.captured || [],
        exported: this.currentStep.exported || [],
        error: this.currentStep.error,
      };

      // Adicionar request e response se existirem completos
      if (this.currentStep.request?.method && this.currentStep.request?.url) {
        completeStep.request = this.currentStep.request as StepExecutionResult['request'];
      }

      if (this.currentStep.response?.status !== undefined) {
        completeStep.response = {
          status: this.currentStep.response.status,
          statusText: this.currentStep.response.statusText || '',
          headers: this.currentStep.response.headers || {},
          body: this.currentStep.response.body,
          responseTime: this.currentStep.response.responseTime || this.currentStep.duration || 0,
        };
      }

      this.steps.push(completeStep);
      this.currentStep = null;
    }
  }

  /**
   * Obtém todos os steps parseados
   */
  getSteps(): StepExecutionResult[] {
    // Finaliza step atual se existir
    this.finalizeCurrentStep();
    return this.steps;
  }

  /**
   * Reset do parser
   */
  reset(): void {
    this.logs = [];
    this.currentStep = null;
    this.steps = [];
  }

  /**
   * Obtém logs brutos
   */
  getLogs(): string[] {
    return this.logs;
  }
}

// Export singleton instance
export const flowTestParser = new FlowTestOutputParser();
