// Common Types for the application
import { ReactNode } from 'react';

export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

export interface HTTPMethod {
  type: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  color: string;
}

export interface TestSuite {
  id: string;
  name: string;
  description?: string;
  tests: TestCase[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TestCase {
  id: string;
  name: string;
  method: HTTPMethod['type'];
  url: string;
  headers?: Record<string, string>;
  body?: unknown;
  status?: 'pending' | 'running' | 'success' | 'failed';
  response?: TestResponse;
}

export interface TestResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: unknown;
  duration: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}
