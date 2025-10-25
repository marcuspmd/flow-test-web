/**
 * Basic Information Section
 * Contains: node_id, suite_name, description
 */

import React from 'react';
import styled from 'styled-components';
import { TestSuiteFormData } from '../../../../utils/testSuiteConverters';

const FormGroup = styled.div`
  margin-bottom: 20px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label<{ $required?: boolean }>`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme['primary-text']};
  margin-bottom: 8px;
  
  ${({ $required }) => $required && `
    &::after {
      content: '*';
      color: #ef4444;
      margin-left: 4px;
    }
  `}
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 6px;
  background: ${({ theme }) => theme['primary-theme']};
  color: ${({ theme }) => theme['primary-text']};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.brand};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.brand}22;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme['secondary-text']};
    opacity: 0.5;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 6px;
  background: ${({ theme }) => theme['primary-theme']};
  color: ${({ theme }) => theme['primary-text']};
  transition: all 0.2s ease;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.brand};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.brand}22;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme['secondary-text']};
    opacity: 0.5;
  }
`;

const HelpText = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme['secondary-text']};
  margin-top: 6px;
  line-height: 1.4;
`;

const ErrorText = styled.div`
  font-size: 12px;
  color: #ef4444;
  margin-top: 6px;
`;

interface BasicInfoSectionProps {
  data: TestSuiteFormData;
  onUpdate: (updates: Partial<TestSuiteFormData>) => void;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ data, onUpdate }) => {
  const [nodeIdError, setNodeIdError] = React.useState<string | null>(null);

  const validateNodeId = (value: string) => {
    const pattern = /^[a-z0-9-]+$/;
    if (value && !pattern.test(value)) {
      setNodeIdError('Node ID must contain only lowercase letters, numbers, and hyphens');
      return false;
    }
    setNodeIdError(null);
    return true;
  };

  const handleNodeIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    validateNodeId(value);
    onUpdate({ node_id: value });
  };

  return (
    <>
      <FormGroup>
        <Label $required>Node ID</Label>
        <Input
          type="text"
          value={data.node_id || ''}
          onChange={handleNodeIdChange}
          placeholder="e.g., user-auth-test"
          pattern="^[a-z0-9-]+$"
        />
        {nodeIdError ? (
          <ErrorText>{nodeIdError}</ErrorText>
        ) : (
          <HelpText>
            Unique identifier for this suite (kebab-case: lowercase letters, numbers, and hyphens only)
          </HelpText>
        )}
      </FormGroup>

      <FormGroup>
        <Label $required>Suite Name</Label>
        <Input
          type="text"
          value={data.suite_name || ''}
          onChange={(e) => onUpdate({ suite_name: e.target.value })}
          placeholder="e.g., User Authentication Tests"
        />
        <HelpText>
          Human-readable name for your test suite
        </HelpText>
      </FormGroup>

      <FormGroup>
        <Label>Description</Label>
        <TextArea
          value={data.description || ''}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="e.g., Complete authentication flow testing including login, logout, and session management"
        />
        <HelpText>
          Optional description explaining the purpose of this test suite
        </HelpText>
      </FormGroup>
    </>
  );
};
