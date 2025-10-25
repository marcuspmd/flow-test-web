import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { WizardStepProps } from '../WizardContainer';
import { TestStep } from '../types';

const StepContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const StepHeader = styled.div`
  margin-bottom: 24px;

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

const StepsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
`;

const StepCard = styled.div`
  background: ${({ theme }) => theme['sidebar-background']};
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 8px;
  overflow: hidden;
`;

const StepCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme['primary-theme']};
  }
`;

const MethodBadge = styled.span<{ method: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  background: ${({ method }) => {
    switch (method) {
      case 'GET': return '#10b98144';
      case 'POST': return '#3b82f644';
      case 'PUT': return '#f59e0b44';
      case 'DELETE': return '#ef444444';
      default: return '#6b728044';
    }
  }};
  color: ${({ method }) => {
    switch (method) {
      case 'GET': return '#10b981';
      case 'POST': return '#3b82f6';
      case 'PUT': return '#f59e0b';
      case 'DELETE': return '#ef4444';
      default: return '#6b7280';
    }
  }};
`;

const StepName = styled.div`
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme['primary-text']};
`;

const StepActions = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  padding: 6px 10px;
  background: transparent;
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 4px;
  color: ${({ theme }) => theme['secondary-text']};
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme['primary-theme']};
    color: ${({ theme }) => theme['primary-text']};
  }
`;

const DeleteButton = styled(IconButton)`
  &:hover {
    background: #ef444422;
    border-color: #ef4444;
    color: #ef4444;
  }
`;

const StepEditor = styled.div`
  padding: 16px;
  border-top: 1px solid ${({ theme }) => theme['layout-border']};
  background: ${({ theme }) => theme['primary-theme']};
`;

const FormField = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 6px;
  color: ${({ theme }) => theme['primary-text']};
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  font-size: 13px;
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 6px;
  background: ${({ theme }) => theme['sidebar-background']};
  color: ${({ theme }) => theme['primary-text']};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.brand};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  font-size: 13px;
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 6px;
  background: ${({ theme }) => theme['sidebar-background']};
  color: ${({ theme }) => theme['primary-text']};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.brand};
  }
`;

const AddButton = styled.button`
  width: 100%;
  padding: 12px;
  background: ${({ theme }) => theme['sidebar-background']};
  border: 2px dashed ${({ theme }) => theme['layout-border']};
  border-radius: 8px;
  color: ${({ theme }) => theme['secondary-text']};
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.brand};
    color: ${({ theme }) => theme.brand};
  }
`;

const EmptyState = styled.div`
  padding: 60px 20px;
  text-align: center;
  color: ${({ theme }) => theme['secondary-text']};

  .icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.4;
  }

  p {
    font-size: 14px;
    margin: 0;
  }
`;

const StepsBuilderStep: React.FC<WizardStepProps> = ({ data, onUpdate, onValidation }) => {
  const [steps, setSteps] = useState<TestStep[]>(data?.steps || []);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    onUpdate?.({
      steps: steps.length > 0 ? steps : undefined,
    });

    onValidation?.({
      isValid: steps.length > 0,
      errors: steps.length === 0 ? ['At least one test step is required'] : undefined,
    });
  }, [steps, onUpdate, onValidation]);

  const handleAddStep = () => {
    const newStep: TestStep = {
      name: `Step ${steps.length + 1}`,
      request: {
        method: 'GET',
        url: '/api/endpoint',
      },
    };
    setSteps([...steps, newStep]);
    setExpandedIndex(steps.length);
  };

  const handleDeleteStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
    if (expandedIndex === index) {
      setExpandedIndex(null);
    }
  };

  const handleUpdateStep = (index: number, updates: Partial<TestStep>) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], ...updates };
    setSteps(newSteps);
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <StepContainer>
      <StepHeader>
        <h2>Steps Builder</h2>
        <p>Create and configure test steps for your suite</p>
      </StepHeader>

      {steps.length === 0 ? (
        <EmptyState>
          <div className="icon">📋</div>
          <p>No test steps yet. Click the button below to add your first step.</p>
        </EmptyState>
      ) : (
        <StepsList>
          {steps.map((step, index) => (
            <StepCard key={index}>
              <StepCardHeader onClick={() => toggleExpand(index)}>
                <MethodBadge method={step.request?.method || 'GET'}>
                  {step.request?.method || 'GET'}
                </MethodBadge>
                <StepName>{step.name}</StepName>
                <StepActions onClick={(e) => e.stopPropagation()}>
                  <IconButton onClick={() => toggleExpand(index)}>
                    {expandedIndex === index ? '▲' : '▼'}
                  </IconButton>
                  <DeleteButton onClick={() => handleDeleteStep(index)}>
                    ✕
                  </DeleteButton>
                </StepActions>
              </StepCardHeader>

              {expandedIndex === index && (
                <StepEditor>
                  <FormField>
                    <Label>Step Name</Label>
                    <Input
                      value={step.name}
                      onChange={(e) => handleUpdateStep(index, { name: e.target.value })}
                      placeholder="e.g., Login user"
                    />
                  </FormField>

                  <FormField>
                    <Label>HTTP Method</Label>
                    <Select
                      value={step.request?.method || 'GET'}
                      onChange={(e) =>
                        handleUpdateStep(index, {
                          request: { ...(step.request || { url: '' }), method: e.target.value },
                        })
                      }
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                      <option value="PATCH">PATCH</option>
                      <option value="HEAD">HEAD</option>
                      <option value="OPTIONS">OPTIONS</option>
                    </Select>
                  </FormField>

                  <FormField>
                    <Label>URL</Label>
                    <Input
                      value={step.request?.url || ''}
                      onChange={(e) =>
                        handleUpdateStep(index, {
                          request: { ...(step.request || { method: 'GET' }), url: e.target.value },
                        })
                      }
                      placeholder="/api/login"
                    />
                  </FormField>
                </StepEditor>
              )}
            </StepCard>
          ))}
        </StepsList>
      )}

      <AddButton onClick={handleAddStep}>
        + Add Test Step
      </AddButton>
    </StepContainer>
  );
};

export default StepsBuilderStep;
