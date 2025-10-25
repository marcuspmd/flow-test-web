/**
 * Flow Test Integrated Service
 * Combina execução Electron IPC com parsing de CLI output
 */

import { StepExecutionResult } from '../types/testExecution.types';
import { FlowTestOutputParser } from './flowTestParser.service';

export interface FlowTestExecutionOptions {
  suiteFilePath?: string;
  collectionPath?: string;
  verbose?: boolean;
  dryRun?: boolean;
  priority?: string;
  tags?: string[];
}

export interface FlowTestExecutionResult {
  executionId: string;
  success: boolean;
  exitCode: number;
  duration: number;
  logs: string[];
  steps: StepExecutionResult[];
}

/**
 * Executa flow-test via Electron IPC com parsing de steps
 */
export async function executeFlowTestWithParsing(
  options: FlowTestExecutionOptions,
  callbacks?: {
    onLog?: (level: 'info' | 'error', message: string) => void;
    onStepParsed?: (step: StepExecutionResult) => void;
    onProgress?: (current: number, total: number) => void;
  }
): Promise<FlowTestExecutionResult> {
  // Verifica se está rodando no Electron
  if (typeof window === 'undefined' || !window.flowTestAPI) {
    const errorMessage =
      'Flow Test API não disponível. Execute este aplicativo no Electron.\n\n' +
      'Comandos disponíveis:\n' +
      '  npm run dev        - Modo desenvolvimento\n' +
      '  npm run build      - Build para produção\n' +
      '  npm run package    - Empacotar aplicativo';

    callbacks?.onLog?.('error', errorMessage);
    throw new Error(errorMessage);
  }

  return new Promise((resolve, reject) => {
    const parser = new FlowTestOutputParser();
    const startTime = Date.now();
    let executionId = '';
    const logs: string[] = [];
    let finalExitCode = 0;
    let finalSuccess = false;
    let previousStepCount = 0;

    // Listener para início de execução
    const removeStartListener = window.flowTestAPI.onExecutionStarted((data) => {
      executionId = data.executionId;
      callbacks?.onLog?.('info', `🚀 Execução iniciada: ${executionId}`);
    });

    // Listener para logs (parsing em tempo real)
    const removeLogListener = window.flowTestAPI.onExecutionLog((data) => {
      const { level, message } = data;
      logs.push(message);

      // Parse message para extrair steps
      parser.addLog(message);

      // Callback de log (normalize level)
      const normalizedLevel: 'info' | 'error' = level === 'error' ? 'error' : 'info';
      callbacks?.onLog?.(normalizedLevel, message);

      // Verificar se há novos steps parseados
      const currentSteps = parser.getSteps();
      if (currentSteps.length > previousStepCount) {
        // Notificar novos steps parseados
        for (let i = previousStepCount; i < currentSteps.length; i++) {
          callbacks?.onStepParsed?.(currentSteps[i]);
          callbacks?.onProgress?.(i + 1, currentSteps.length);
        }
        previousStepCount = currentSteps.length;
      }
    });

    // Listener para conclusão
    const removeCompleteListener = window.flowTestAPI.onExecutionComplete((data) => {
      finalSuccess = data.success;
      finalExitCode = data.exitCode || 0;
      const duration = Date.now() - startTime;

      // Finalizar parsing (captura último step se pendente)
      const finalSteps = parser.getSteps();

      const result: FlowTestExecutionResult = {
        executionId: data.executionId,
        success: finalSuccess,
        exitCode: finalExitCode,
        duration,
        logs,
        steps: finalSteps,
      };

      const statusIcon = finalSuccess ? '✅' : '❌';
      const statusText = finalSuccess ? 'SUCESSO' : 'FALHA';
      callbacks?.onLog?.(
        finalSuccess ? 'info' : 'error',
        `${statusIcon} Execução concluída: ${statusText} (exit code: ${finalExitCode}, ${duration}ms)`
      );

      // Limpar listeners
      removeStartListener();
      removeLogListener();
      removeCompleteListener();
      removeErrorListener();

      resolve(result);
    });

    // Listener para erros
    const removeErrorListener = window.flowTestAPI.onExecutionError((data) => {
      const errorMsg = `❌ Erro na execução: ${data.message}`;
      logs.push(errorMsg);
      callbacks?.onLog?.('error', errorMsg);

      // Limpar listeners
      removeStartListener();
      removeLogListener();
      removeCompleteListener();
      removeErrorListener();

      reject(new Error(data.message));
    });

    // Iniciar execução
    window.flowTestAPI
      .executeFlowTest(options)
      .then((result) => {
        executionId = result.executionId;
      })
      .catch((error) => {
        const errorMsg = `❌ Falha ao iniciar execução: ${error.message}`;
        callbacks?.onLog?.('error', errorMsg);

        // Limpar listeners
        removeStartListener();
        removeLogListener();
        removeCompleteListener();
        removeErrorListener();

        reject(error);
      });
  });
}

/**
 * Para execução em andamento
 */
export async function stopExecution(executionId: string): Promise<{ success: boolean; message: string }> {
  if (typeof window === 'undefined' || !window.flowTestAPI) {
    throw new Error('Flow Test API não disponível');
  }

  return window.flowTestAPI.stopExecution(executionId);
}

/**
 * Obtém versão do flow-test-engine
 */
export async function getFlowTestVersion(): Promise<string> {
  if (typeof window === 'undefined' || !window.flowTestAPI) {
    throw new Error('Flow Test API não disponível');
  }

  return window.flowTestAPI.getVersion();
}

/**
 * Obtém versão do aplicativo Electron
 */
export async function getAppVersion(): Promise<string> {
  if (typeof window === 'undefined' || !window.flowTestAPI) {
    throw new Error('Flow Test API não disponível');
  }

  return window.flowTestAPI.getAppVersion();
}

/**
 * Select directory via Electron dialog
 */
export async function selectDirectory(): Promise<string | null> {
  if (typeof window === 'undefined' || !window.flowTestAPI) {
    throw new Error('Flow Test API não disponível');
  }

  return window.flowTestAPI.selectDirectory();
}

/**
 * Select file via Electron dialog
 */
export async function selectFile(filters?: { name: string; extensions: string[] }[]): Promise<string | null> {
  if (typeof window === 'undefined' || !window.flowTestAPI) {
    throw new Error('Flow Test API não disponível');
  }

  return window.flowTestAPI.selectFile(filters);
}
