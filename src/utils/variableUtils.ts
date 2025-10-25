import { EnvironmentVariable } from '../store/slices/apiEnvironmentsSlice';
import { RequestData } from '../components/organisms/RequestPane';

/**
 * Substitui variáveis no formato {{variableName}} por seus valores
 */
export const replaceVariables = (
  text: string,
  variables: EnvironmentVariable[],
  globalVariables: EnvironmentVariable[] = []
): string => {
  if (!text) return text;

  // Combina variáveis do ambiente ativo com variáveis globais
  // Variáveis do ambiente têm prioridade sobre globais
  const allVariables = [...variables, ...globalVariables];

  // Encontra todas as variáveis no formato {{var}}
  const variablePattern = /\{\{([^}]+)\}\}/g;

  return text.replace(variablePattern, (match, variableName) => {
    const trimmedName = variableName.trim();

    // Procura a variável habilitada
    const variable = allVariables.find((v) => v.key === trimmedName && v.enabled);

    if (variable) {
      return variable.value;
    }

    // Se não encontrar, mantém o texto original
    return match;
  });
};

/**
 * Substitui variáveis em um objeto RequestData
 */
export const replaceVariablesInRequest = (
  request: RequestData,
  environmentVariables: EnvironmentVariable[],
  globalVariables: EnvironmentVariable[] = []
): RequestData => {
  const processedRequest: RequestData = JSON.parse(JSON.stringify(request));

  // URL
  processedRequest.url = replaceVariables(processedRequest.url, environmentVariables, globalVariables);

  // Params
  processedRequest.params = processedRequest.params.map((param) => ({
    ...param,
    key: replaceVariables(param.key, environmentVariables, globalVariables),
    value: replaceVariables(param.value, environmentVariables, globalVariables),
  }));

  // Headers
  processedRequest.headers = processedRequest.headers.map((header) => ({
    ...header,
    key: replaceVariables(header.key, environmentVariables, globalVariables),
    value: replaceVariables(header.value, environmentVariables, globalVariables),
  }));

  // Body content
  if (processedRequest.body.content) {
    processedRequest.body.content = replaceVariables(
      processedRequest.body.content,
      environmentVariables,
      globalVariables
    );
  }

  // Form data
  if (processedRequest.body.formData) {
    processedRequest.body.formData = processedRequest.body.formData.map((item) => ({
      ...item,
      key: replaceVariables(item.key, environmentVariables, globalVariables),
      value: replaceVariables(item.value, environmentVariables, globalVariables),
    }));
  }

  // Auth config
  if (processedRequest.auth.config) {
    const newConfig: Record<string, string> = {};
    Object.entries(processedRequest.auth.config).forEach(([key, value]) => {
      newConfig[key] = replaceVariables(value, environmentVariables, globalVariables);
    });
    processedRequest.auth.config = newConfig;
  }

  return processedRequest;
};

/**
 * Extrai todas as variáveis usadas em um texto
 */
export const extractVariables = (text: string): string[] => {
  if (!text) return [];

  const variablePattern = /\{\{([^}]+)\}\}/g;
  const matches = text.matchAll(variablePattern);
  const variables: string[] = [];

  for (const match of matches) {
    const variableName = match[1].trim();
    if (!variables.includes(variableName)) {
      variables.push(variableName);
    }
  }

  return variables;
};

/**
 * Extrai todas as variáveis usadas em uma requisição
 */
export const extractVariablesFromRequest = (request: RequestData): string[] => {
  const variables: Set<string> = new Set();

  // URL
  extractVariables(request.url).forEach((v) => variables.add(v));

  // Params
  request.params.forEach((param) => {
    extractVariables(param.key).forEach((v) => variables.add(v));
    extractVariables(param.value).forEach((v) => variables.add(v));
  });

  // Headers
  request.headers.forEach((header) => {
    extractVariables(header.key).forEach((v) => variables.add(v));
    extractVariables(header.value).forEach((v) => variables.add(v));
  });

  // Body
  if (request.body.content) {
    extractVariables(request.body.content).forEach((v) => variables.add(v));
  }

  // Form data
  if (request.body.formData) {
    request.body.formData.forEach((item) => {
      extractVariables(item.key).forEach((v) => variables.add(v));
      extractVariables(item.value).forEach((v) => variables.add(v));
    });
  }

  // Auth
  Object.values(request.auth.config).forEach((value) => {
    extractVariables(value).forEach((v) => variables.add(v));
  });

  return Array.from(variables);
};

/**
 * Valida se todas as variáveis usadas estão definidas
 */
export const validateVariables = (
  usedVariables: string[],
  availableVariables: EnvironmentVariable[],
  globalVariables: EnvironmentVariable[] = []
): { valid: boolean; missing: string[] } => {
  const allVariables = [...availableVariables, ...globalVariables];
  const enabledVariableNames = allVariables.filter((v) => v.enabled).map((v) => v.key);

  const missing = usedVariables.filter((varName) => !enabledVariableNames.includes(varName));

  return {
    valid: missing.length === 0,
    missing,
  };
};

/**
 * Gera sugestões de variáveis enquanto digita (autocomplete)
 */
export const getVariableSuggestions = (
  text: string,
  cursorPosition: number,
  availableVariables: EnvironmentVariable[],
  globalVariables: EnvironmentVariable[] = []
): { suggestions: string[]; range: { start: number; end: number } } | null => {
  // Procura por {{ antes do cursor
  const textBeforeCursor = text.substring(0, cursorPosition);
  const lastOpenBraces = textBeforeCursor.lastIndexOf('{{');

  if (lastOpenBraces === -1) return null;

  // Verifica se já foi fechado
  const textBetween = text.substring(lastOpenBraces, cursorPosition);
  if (textBetween.includes('}}')) return null;

  // Extrai o texto parcial da variável
  const partial = textBetween.substring(2).toLowerCase();

  // Combina variáveis
  const allVariables = [...availableVariables, ...globalVariables];

  // Filtra sugestões
  const suggestions = allVariables
    .filter((v) => v.enabled && v.key.toLowerCase().includes(partial))
    .map((v) => v.key)
    .slice(0, 10); // Limita a 10 sugestões

  return {
    suggestions,
    range: {
      start: lastOpenBraces,
      end: cursorPosition,
    },
  };
};
