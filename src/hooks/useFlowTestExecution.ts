/**
 * useFlowTestExecution Hook
 * Hook React para gerenciar execução de testes com parsing em tempo real
 */

import { useState, useCallback, useRef } from 'react';
import {
  executeFlowTestWithParsing,
  stopExecution,
  FlowTestExecutionOptions,
  FlowTestExecutionResult,
} from '../services/flowTestIntegrated.service';
import { StepExecutionResult } from '../types/testExecution.types';

interface UseFlowTestExecutionReturn {
  // Estado
  isExecuting: boolean;
  executionId: string | null;
  logs: string[];
  steps: StepExecutionResult[];
  currentStep: number;
  totalSteps: number;
  result: FlowTestExecutionResult | null;
  error: string | null;

  // Ações
  execute: (options: FlowTestExecutionOptions) => Promise<void>;
  stop: () => Promise<void>;
  clearLogs: () => void;
  clearResults: () => void;
}

/**
 * Hook para executar flow-test com parsing de steps em tempo real
 */
export function useFlowTestExecution(): UseFlowTestExecutionReturn {
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionId, setExecutionId] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [steps, setSteps] = useState<StepExecutionResult[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [result, setResult] = useState<FlowTestExecutionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Ref para evitar stale closures
  const logsRef = useRef<string[]>([]);
  const stepsRef = useRef<StepExecutionResult[]>([]);

  /**
   * Executa flow-test
   */
  const execute = useCallback(async (options: FlowTestExecutionOptions) => {
    setIsExecuting(true);
    setExecutionId(null);
    setLogs([]);
    setSteps([]);
    setCurrentStep(0);
    setTotalSteps(0);
    setResult(null);
    setError(null);
    logsRef.current = [];
    stepsRef.current = [];

    try {
      const executionResult = await executeFlowTestWithParsing(options, {
        // Callback de log
        onLog: (level, message) => {
          const logEntry = `[${level.toUpperCase()}] ${message}`;
          logsRef.current = [...logsRef.current, logEntry];
          setLogs(logsRef.current);
        },

        // Callback de step parseado
        onStepParsed: (step) => {
          stepsRef.current = [...stepsRef.current, step];
          setSteps(stepsRef.current);
        },

        // Callback de progresso
        onProgress: (current, total) => {
          setCurrentStep(current);
          setTotalSteps(total);
        },
      });

      // Atualizar executionId logo no início (via onLog callback)
      setExecutionId(executionResult.executionId);

      // Resultado final
      setResult(executionResult);
      setSteps(executionResult.steps);
      setLogs(executionResult.logs);

      if (!executionResult.success) {
        setError(`Execução falhou com exit code ${executionResult.exitCode}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      setLogs((prev) => [...prev, `[ERROR] ${errorMessage}`]);
    } finally {
      setIsExecuting(false);
    }
  }, []);

  /**
   * Para execução
   */
  const stop = useCallback(async () => {
    if (!executionId) {
      console.warn('Nenhuma execução ativa para parar');
      return;
    }

    try {
      await stopExecution(executionId);
      setLogs((prev) => [...prev, '[INFO] Execução interrompida pelo usuário']);
      setIsExecuting(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao parar execução';
      setError(errorMessage);
      setLogs((prev) => [...prev, `[ERROR] ${errorMessage}`]);
    }
  }, [executionId]);

  /**
   * Limpa logs
   */
  const clearLogs = useCallback(() => {
    setLogs([]);
    logsRef.current = [];
  }, []);

  /**
   * Limpa resultados
   */
  const clearResults = useCallback(() => {
    setSteps([]);
    setResult(null);
    setError(null);
    setCurrentStep(0);
    setTotalSteps(0);
    stepsRef.current = [];
  }, []);

  return {
    // Estado
    isExecuting,
    executionId,
    logs,
    steps,
    currentStep,
    totalSteps,
    result,
    error,

    // Ações
    execute,
    stop,
    clearLogs,
    clearResults,
  };
}
