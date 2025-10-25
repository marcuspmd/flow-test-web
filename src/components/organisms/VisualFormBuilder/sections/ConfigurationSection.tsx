/**
 * Configuration Section
 * Contains: base_url, execution_mode, variables, exports
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

const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme['primary-text']};
  margin-bottom: 8px;
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

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 6px;
  background: ${({ theme }) => theme['primary-theme']};
  color: ${({ theme }) => theme['primary-text']};
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.brand};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.brand}22;
  }
`;

const HelpText = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme['secondary-text']};
  margin-top: 6px;
  line-height: 1.4;
`;

const VariablesEditor = styled.div`
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 6px;
  padding: 12px;
  background: ${({ theme }) => theme['primary-theme']};
`;

const VariableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 8px;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SmallInput = styled(Input)`
  padding: 8px 10px;
  font-size: 13px;
`;

const IconButton = styled.button`
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 6px;
  background: ${({ theme }) => theme['sidebar-background']};
  color: ${({ theme }) => theme['primary-text']};
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme['primary-theme']};
    border-color: ${({ theme }) => theme.brand};
  }
`;

const AddButton = styled(IconButton)`
  width: 100%;
  margin-top: 8px;
  font-weight: 600;
  
  &:hover {
    background: ${({ theme }) => theme.brand};
    color: white;
    border-color: ${({ theme }) => theme.brand};
  }
`;

const ArrayInput = styled(Input)`
  &::placeholder {
    font-size: 12px;
  }
`;

interface ConfigurationSectionProps {
  data: TestSuiteFormData;
  onUpdate: (updates: Partial<TestSuiteFormData>) => void;
}

export const ConfigurationSection: React.FC<ConfigurationSectionProps> = ({ data, onUpdate }) => {
  const variables = data.variables || {};
  const exports = data.exports || [];

  const addVariable = () => {
    const newKey = `var${Object.keys(variables).length + 1}`;
    onUpdate({
      variables: {
        ...variables,
        [newKey]: '',
      },
    });
  };

  const updateVariable = (oldKey: string, newKey: string, value: any) => {
    const newVars = { ...variables };
    if (oldKey !== newKey) {
      delete newVars[oldKey];
    }
    newVars[newKey] = value;
    onUpdate({ variables: newVars });
  };

  const removeVariable = (key: string) => {
    const newVars = { ...variables };
    delete newVars[key];
    onUpdate({ variables: newVars });
  };

  const handleExportsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const exportsArray = value
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    onUpdate({ exports: exportsArray.length > 0 ? exportsArray : undefined });
  };

  return (
    <>
      <FormGroup>
        <Label>Base URL</Label>
        <Input
          type="url"
          value={data.base_url || ''}
          onChange={(e) => onUpdate({ base_url: e.target.value })}
          placeholder="https://api.example.com"
        />
        <HelpText>
          Base URL for all relative request URLs in this suite. Supports interpolation like {`{{api_base_url}}`}
        </HelpText>
      </FormGroup>

      <FormGroup>
        <Label>Execution Mode</Label>
        <Select
          value={data.execution_mode || 'sequential'}
          onChange={(e) => onUpdate({ execution_mode: e.target.value as 'sequential' | 'parallel' })}
        >
          <option value="sequential">Sequential</option>
          <option value="parallel">Parallel</option>
        </Select>
        <HelpText>
          Sequential: steps run one after another. Parallel: steps run simultaneously
        </HelpText>
      </FormGroup>

      <FormGroup>
        <Label>Variables</Label>
        <VariablesEditor>
          {Object.entries(variables).map(([key, value]) => (
            <VariableRow key={key}>
              <SmallInput
                type="text"
                value={key}
                onChange={(e) => updateVariable(key, e.target.value, value)}
                placeholder="Variable name"
              />
              <SmallInput
                type="text"
                value={String(value)}
                onChange={(e) => updateVariable(key, key, e.target.value)}
                placeholder="Value"
              />
              <IconButton onClick={() => removeVariable(key)}>🗑️</IconButton>
            </VariableRow>
          ))}
          <AddButton onClick={addVariable}>+ Add Variable</AddButton>
        </VariablesEditor>
        <HelpText>
          Suite-local variables that can be used in steps via {`{{variable_name}}`}
        </HelpText>
      </FormGroup>

      <FormGroup>
        <Label>Exports</Label>
        <ArrayInput
          type="text"
          value={exports.join(', ')}
          onChange={handleExportsChange}
          placeholder="e.g., auth_token, user_id"
        />
        <HelpText>
          Comma-separated list of variables to export globally for other suites
        </HelpText>
      </FormGroup>
    </>
  );
};
