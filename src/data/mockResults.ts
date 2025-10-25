/**
 * Mock Data for Testing Components
 * Dados de exemplo para desenvolvimento e testes
 */

import type { StepExecutionResult } from '../types/testExecution.types';

export const mockStepResult: StepExecutionResult = {
  stepName: 'Create new user account',
  stepId: 'create-user-step',
  startTime: '2025-10-24T10:30:00.000Z',
  endTime: '2025-10-24T10:30:01.245Z',
  duration: 1245,
  status: 'passed',
  request: {
    method: 'POST',
    url: 'https://api.example.com/v1/users',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      'X-Request-ID': 'req-123456789',
    },
    body: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'user',
      metadata: {
        source: 'api-test',
        timestamp: '2025-10-24T10:30:00.000Z',
      },
    },
  },
  response: {
    status: 201,
    statusText: 'Created',
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'x-rate-limit-remaining': '99',
      'x-response-time': '245ms',
    },
    body: {
      success: true,
      data: {
        id: 'usr_abc123xyz',
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'user',
        createdAt: '2025-10-24T10:30:01.000Z',
        status: 'active',
      },
      message: 'User created successfully',
    },
    responseTime: 245,
    contentType: 'application/json',
  },
  assertions: [
    {
      path: 'status_code',
      operator: 'equals',
      expected: 201,
      actual: 201,
      passed: true,
    },
    {
      path: 'body.success',
      operator: 'equals',
      expected: true,
      actual: true,
      passed: true,
    },
    {
      path: 'body.data.id',
      operator: 'exists',
      expected: true,
      actual: 'usr_abc123xyz',
      passed: true,
    },
    {
      path: 'body.data.email',
      operator: 'equals',
      expected: 'john.doe@example.com',
      actual: 'john.doe@example.com',
      passed: true,
    },
    {
      path: 'response_time_ms',
      operator: 'less_than',
      expected: 1000,
      actual: 245,
      passed: true,
    },
  ],
  captured: [
    {
      name: 'user_id',
      value: 'usr_abc123xyz',
      expression: 'body.data.id',
      scope: 'local',
    },
    {
      name: 'user_email',
      value: 'john.doe@example.com',
      expression: 'body.data.email',
      scope: 'local',
    },
    {
      name: 'created_timestamp',
      value: '2025-10-24T10:30:01.000Z',
      expression: 'body.data.createdAt',
      scope: 'local',
    },
  ],
  exported: [
    {
      name: 'auth_user_id',
      value: 'usr_abc123xyz',
      availableAs: '{{create-user.user_id}}',
    },
  ],
};

export const mockFailedStepResult: StepExecutionResult = {
  stepName: 'Validate user permissions',
  stepId: 'validate-permissions',
  startTime: '2025-10-24T10:31:00.000Z',
  endTime: '2025-10-24T10:31:00.500Z',
  duration: 500,
  status: 'failed',
  request: {
    method: 'GET',
    url: 'https://api.example.com/v1/users/usr_abc123xyz/permissions',
    headers: {
      Authorization: 'Bearer invalid_token',
    },
  },
  response: {
    status: 403,
    statusText: 'Forbidden',
    headers: {
      'content-type': 'application/json',
    },
    body: {
      error: 'forbidden',
      message: 'Insufficient permissions to access this resource',
      code: 'PERMISSION_DENIED',
    },
    responseTime: 150,
    contentType: 'application/json',
  },
  assertions: [
    {
      path: 'status_code',
      operator: 'equals',
      expected: 200,
      actual: 403,
      passed: false,
      message: 'Expected status 200, got 403',
    },
    {
      path: 'body.permissions',
      operator: 'exists',
      expected: true,
      actual: undefined,
      passed: false,
      message: 'Field body.permissions does not exist',
    },
  ],
  captured: [],
  exported: [],
  error: 'Assertion failed: status_code expected 200 but got 403',
};

export const mockHtmlResponse: StepExecutionResult = {
  stepName: 'Fetch homepage',
  stepId: 'fetch-homepage',
  startTime: '2025-10-24T10:32:00.000Z',
  endTime: '2025-10-24T10:32:00.800Z',
  duration: 800,
  status: 'passed',
  request: {
    method: 'GET',
    url: 'https://example.com',
  },
  response: {
    status: 200,
    statusText: 'OK',
    headers: {
      'content-type': 'text/html; charset=utf-8',
    },
    body: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Example Domain</title>
  <style>
    body { font-family: sans-serif; margin: 40px; }
    h1 { color: #333; }
  </style>
</head>
<body>
  <h1>Example Domain</h1>
  <p>This domain is for use in illustrative examples in documents.</p>
  <p><a href="https://www.iana.org/domains/example">More information...</a></p>
</body>
</html>`,
    responseTime: 350,
    contentType: 'text/html',
  },
  assertions: [
    {
      path: 'status_code',
      operator: 'equals',
      expected: 200,
      actual: 200,
      passed: true,
    },
  ],
  captured: [],
  exported: [],
};
