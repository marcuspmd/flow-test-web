import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { WizardStepProps } from '../WizardContainer';

const StepContainer = styled.div`
  max-width: 700px;
  margin: 0 auto;
`;

const StepHeader = styled.div`
  margin-bottom: 32px;

  h2 {
    font-size: 24px;
    font-weight: 600;
    margin: 0 0 8px 0;
    color: ${({ theme }) => theme['primary-text']};
  }

  p {
    font-size: 14px;
    color: ${({ theme }) => theme['secondary-text']};
    margin: 0;
  }
`;

const FormSection = styled.div`
  margin-bottom: 32px;
  padding: 20px;
  background: ${({ theme }) => theme['sidebar-background']};
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 8px;

  h3 {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 16px 0;
    color: ${({ theme }) => theme['primary-text']};
  }
`;

const FormField = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: ${({ theme }) => theme['primary-text']};
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 14px;
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
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 14px;
  font-size: 14px;
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 6px;
  background: ${({ theme }) => theme['primary-theme']};
  color: ${({ theme }) => theme['primary-text']};
  cursor: pointer;
  transition: all 0.2s ease;

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
`;

const KeyValueEditor = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const KeyValueRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const KeyValueInput = styled(Input)`
  flex: 1;
`;

const RemoveButton = styled.button`
  padding: 8px 12px;
  background: transparent;
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 6px;
  color: ${({ theme }) => theme['secondary-text']};
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background: #ef444422;
    border-color: #ef4444;
    color: #ef4444;
  }
`;

const AddButton = styled.button`
  padding: 8px 16px;
  background: ${({ theme }) => theme['primary-theme']};
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 6px;
  color: ${({ theme }) => theme['primary-text']};
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.brand};
    color: ${({ theme }) => theme.brand};
  }
`;

const ConfigurationStep: React.FC<WizardStepProps> = ({ data, onUpdate, onValidation }) => {
  const [baseUrl, setBaseUrl] = useState(data?.base_url || '');
  const [executionMode, setExecutionMode] = useState(data?.execution_mode || 'sequential');
  const [variables, setVariables] = useState<Record<string, string>>(data?.variables || {});

  useEffect(() => {
    onUpdate?.({
      base_url: baseUrl || undefined,
      execution_mode: executionMode,
      variables: Object.keys(variables).length > 0 ? variables : undefined,
    });

    onValidation?.({ isValid: true });
  }, [baseUrl, executionMode, variables, onUpdate, onValidation]);

  const handleAddVariable = () => {
    const newKey = `var_${Object.keys(variables).length + 1}`;
    setVariables({ ...variables, [newKey]: '' });
  };

  const handleRemoveVariable = (key: string) => {
    const newVars = { ...variables };
    delete newVars[key];
    setVariables(newVars);
  };

  const handleVariableKeyChange = (oldKey: string, newKey: string) => {
    const newVars = { ...variables };
    const value = newVars[oldKey];
    delete newVars[oldKey];
    newVars[newKey] = value;
    setVariables(newVars);
  };

  const handleVariableValueChange = (key: string, value: string) => {
    setVariables({ ...variables, [key]: value });
  };

  return (
    <StepContainer>
      <StepHeader>
        <h2>Configuration</h2>
        <p>Configure execution settings and variables for your test suite</p>
      </StepHeader>

      <FormSection>
        <h3>Execution Settings</h3>

        <FormField>
          <Label>Base URL</Label>
          <Input
            type="url"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://api.example.com"
          />
          <HelpText>
            Optional base URL to prepend to all request URLs in this suite
          </HelpText>
        </FormField>

        <FormField>
          <Label>Execution Mode</Label>
          <Select
            value={executionMode}
            onChange={(e) => setExecutionMode(e.target.value)}
          >
            <option value="sequential">Sequential</option>
            <option value="parallel">Parallel</option>
          </Select>
          <HelpText>
            Sequential runs steps one by one, parallel runs them concurrently
          </HelpText>
        </FormField>
      </FormSection>

      <FormSection>
        <h3>Variables</h3>
        <HelpText style={{ marginBottom: 16 }}>
          Define variables that can be used throughout your test suite using {'{{variable_name}}'} syntax
        </HelpText>

        <KeyValueEditor>
          {Object.entries(variables).map(([key, value]) => (
            <KeyValueRow key={key}>
              <KeyValueInput
                placeholder="Variable name"
                value={key}
                onChange={(e) => handleVariableKeyChange(key, e.target.value)}
              />
              <KeyValueInput
                placeholder="Value"
                value={value}
                onChange={(e) => handleVariableValueChange(key, e.target.value)}
              />
              <RemoveButton onClick={() => handleRemoveVariable(key)}>
                ✕
              </RemoveButton>
            </KeyValueRow>
          ))}
        </KeyValueEditor>

        <div style={{ marginTop: 12 }}>
          <AddButton onClick={handleAddVariable}>
            + Add Variable
          </AddButton>
        </div>
      </FormSection>
    </StepContainer>
  );
};

export default ConfigurationStep;
