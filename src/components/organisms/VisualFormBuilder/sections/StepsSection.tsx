/**
 * Steps Section
 * Contains: array of test steps with full configuration
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

const StepsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const StepCard = styled.div`
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 8px;
  overflow: hidden;
  background: ${({ theme }) => theme['primary-theme']};
`;

const StepHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: ${({ theme }) => theme['sidebar-background']};
  border-bottom: 1px solid ${({ theme }) => theme['layout-border']};
  cursor: pointer;
  user-select: none;
  
  &:hover {
    background: ${({ theme }) => theme['primary-theme']};
  }
`;

const StepTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme['primary-text']};
  display: flex;
  align-items: center;
  gap: 8px;
  
  .badge {
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 4px;
    background: ${({ theme }) => theme.brand}22;
    color: ${({ theme }) => theme.brand};
  }
`;

const StepActions = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  padding: 6px 10px;
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 4px;
  background: transparent;
  color: ${({ theme }) => theme['primary-text']};
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme['sidebar-background']};
    border-color: ${({ theme }) => theme.brand};
  }
`;

const DeleteButton = styled(IconButton)`
  &:hover {
    background: #ef444422;
    border-color: #ef4444;
    color: #ef4444;
  }
`;

const StepContent = styled.div<{ $collapsed: boolean }>`
  padding: ${({ $collapsed }) => ($collapsed ? '0' : '16px')};
  max-height: ${({ $collapsed }) => ($collapsed ? '0' : 'none')};
  overflow: ${({ $collapsed }) => ($collapsed ? 'hidden' : 'visible')};
  transition: all 0.2s ease;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 10px;
  font-size: 13px;
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 6px;
  background: ${({ theme }) => theme['sidebar-background']};
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
  padding: 8px 10px;
  font-size: 13px;
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 6px;
  background: ${({ theme }) => theme['sidebar-background']};
  color: ${({ theme }) => theme['primary-text']};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.brand};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.brand}22;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
`;

const AddButton = styled.button`
  width: 100%;
  padding: 12px;
  border: 2px dashed ${({ theme }) => theme['layout-border']};
  border-radius: 8px;
  background: transparent;
  color: ${({ theme }) => theme.brand};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.brand}11;
    border-color: ${({ theme }) => theme.brand};
  }
`;

const HelpText = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme['secondary-text']};
  margin-top: 6px;
  line-height: 1.4;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${({ theme }) => theme['secondary-text']};
  
  .icon {
    font-size: 48px;
    margin-bottom: 12px;
    opacity: 0.3;
  }
  
  .text {
    font-size: 14px;
  }
`;

interface StepsSectionProps {
  data: TestSuiteFormData;
  onUpdate: (updates: Partial<TestSuiteFormData>) => void;
}

export const StepsSection: React.FC<StepsSectionProps> = ({ data, onUpdate }) => {
  const steps = data.steps || [];
  const [collapsedSteps, setCollapsedSteps] = React.useState<Set<number>>(new Set());

  const toggleStep = (index: number) => {
    setCollapsedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const addStep = () => {
    const newStep = {
      name: `Step ${steps.length + 1}`,
      request: {
        method: 'GET',
        url: '',
      },
    };
    onUpdate({ steps: [...steps, newStep] });
    // Auto-expand the new step
    setCollapsedSteps((prev) => {
      const next = new Set(prev);
      next.delete(steps.length);
      return next;
    });
  };

  const updateStep = (index: number, updates: any) => {
    const newSteps = [...steps];
    newSteps[index] = {
      ...newSteps[index],
      ...updates,
    };
    onUpdate({ steps: newSteps });
  };

  const updateStepRequest = (index: number, updates: any) => {
    const newSteps = [...steps];
    newSteps[index] = {
      ...newSteps[index],
      request: {
        ...newSteps[index].request,
        ...updates,
      },
    };
    onUpdate({ steps: newSteps });
  };

  const removeStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);
    onUpdate({ steps: newSteps });
  };

  if (steps.length === 0) {
    return (
      <>
        <EmptyState>
          <div className="icon">📋</div>
          <div className="text">No steps defined yet. Add your first test step to get started.</div>
        </EmptyState>
        <AddButton onClick={addStep}>+ Add First Step</AddButton>
      </>
    );
  }

  return (
    <>
      <StepsList>
        {steps.map((step, index) => {
          const isCollapsed = collapsedSteps.has(index);
          return (
            <StepCard key={index}>
              <StepHeader onClick={() => toggleStep(index)}>
                <StepTitle>
                  <span>{step.name || `Step ${index + 1}`}</span>
                  {step.request?.method && (
                    <span className="badge">{step.request.method}</span>
                  )}
                </StepTitle>
                <StepActions onClick={(e) => e.stopPropagation()}>
                  <IconButton onClick={() => toggleStep(index)}>
                    {isCollapsed ? '▶' : '▼'}
                  </IconButton>
                  <DeleteButton onClick={() => removeStep(index)}>🗑️</DeleteButton>
                </StepActions>
              </StepHeader>
              <StepContent $collapsed={isCollapsed}>
                <FormGroup>
                  <Label $required>Step Name</Label>
                  <Input
                    type="text"
                    value={step.name}
                    onChange={(e) => updateStep(index, { name: e.target.value })}
                    placeholder="e.g., Login to system"
                  />
                </FormGroup>

                <Grid>
                  <FormGroup>
                    <Label $required>HTTP Method</Label>
                    <Select
                      value={step.request?.method || 'GET'}
                      onChange={(e) => updateStepRequest(index, { method: e.target.value })}
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="PATCH">PATCH</option>
                      <option value="DELETE">DELETE</option>
                      <option value="HEAD">HEAD</option>
                      <option value="OPTIONS">OPTIONS</option>
                    </Select>
                  </FormGroup>

                  <FormGroup>
                    <Label $required>URL</Label>
                    <Input
                      type="text"
                      value={step.request?.url || ''}
                      onChange={(e) => updateStepRequest(index, { url: e.target.value })}
                      placeholder="/api/endpoint"
                    />
                  </FormGroup>
                </Grid>

                <HelpText>
                  Additional configuration like headers, body, assertions, and captures can be added in YAML editor mode for advanced features.
                </HelpText>
              </StepContent>
            </StepCard>
          );
        })}
      </StepsList>

      <AddButton onClick={addStep}>+ Add Step</AddButton>
    </>
  );
};
