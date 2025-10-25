import React, { useEffect, useRef } from 'react';
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

const SummarySection = styled.div`
  background: ${({ theme }) => theme['sidebar-background']};
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
`;

const SummaryRow = styled.div`
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme['layout-border']};

  &:last-child {
    border-bottom: none;
  }
`;

const SummaryLabel = styled.div`
  flex: 0 0 150px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme['secondary-text']};
`;

const SummaryValue = styled.div`
  flex: 1;
  font-size: 13px;
  color: ${({ theme }) => theme['primary-text']};
  word-break: break-word;
`;

const StepsList = styled.div`
  margin-top: 16px;
`;

const StepItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: ${({ theme }) => theme['primary-theme']};
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 6px;
  margin-bottom: 8px;
`;

const MethodBadge = styled.span<{ method: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  background: ${({ method }) => {
    switch (method) {
      case 'GET':
        return '#10b98144';
      case 'POST':
        return '#3b82f644';
      case 'PUT':
        return '#f59e0b44';
      case 'DELETE':
        return '#ef444444';
      default:
        return '#6b728044';
    }
  }};
  color: ${({ method }) => {
    switch (method) {
      case 'GET':
        return '#10b981';
      case 'POST':
        return '#3b82f6';
      case 'PUT':
        return '#f59e0b';
      case 'DELETE':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  }};
`;

const StepName = styled.div`
  flex: 1;
  font-size: 13px;
  color: ${({ theme }) => theme['primary-text']};
`;

const ValidationBadge = styled.div<{ $valid: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  background: ${({ $valid }) => ($valid ? '#10b98122' : '#ef444422')};
  color: ${({ $valid }) => ($valid ? '#10b981' : '#ef4444')};
  margin-bottom: 16px;
`;

const ReviewStep: React.FC<WizardStepProps> = ({ data, onValidation }) => {
  const hasRequiredFields = Boolean(data?.suite_name && data?.node_id);
  const hasSteps = Boolean(data?.steps && data.steps.length > 0);
  const isValid = hasRequiredFields && hasSteps;

  // Use ref to prevent infinite loops from callback changes
  const onValidationRef = useRef(onValidation);

  // Update ref when callback changes
  useEffect(() => {
    onValidationRef.current = onValidation;
  }, [onValidation]);

  useEffect(() => {
    onValidationRef.current?.({
      isValid,
      errors: !isValid ? ['Please complete all required fields and add at least one step'] : undefined,
    });
  }, [isValid]); // Only depend on actual state values

  return (
    <StepContainer>
      <StepHeader>
        <h2>Review & Generate</h2>
        <p>Review your test suite configuration before generating</p>
      </StepHeader>

      <ValidationBadge $valid={isValid}>
        {isValid ? '✓ Ready to generate' : '⚠ Please complete required fields'}
      </ValidationBadge>

      <SummarySection>
        <SummaryRow>
          <SummaryLabel>Suite Name</SummaryLabel>
          <SummaryValue>{data?.suite_name || '-'}</SummaryValue>
        </SummaryRow>

        <SummaryRow>
          <SummaryLabel>Node ID</SummaryLabel>
          <SummaryValue>{data?.node_id || '-'}</SummaryValue>
        </SummaryRow>

        {data?.description && (
          <SummaryRow>
            <SummaryLabel>Description</SummaryLabel>
            <SummaryValue>{data.description}</SummaryValue>
          </SummaryRow>
        )}

        {data?.base_url && (
          <SummaryRow>
            <SummaryLabel>Base URL</SummaryLabel>
            <SummaryValue>{data.base_url}</SummaryValue>
          </SummaryRow>
        )}

        <SummaryRow>
          <SummaryLabel>Execution Mode</SummaryLabel>
          <SummaryValue>{data?.execution_mode || 'sequential'}</SummaryValue>
        </SummaryRow>

        {data?.variables && Object.keys(data.variables).length > 0 && (
          <SummaryRow>
            <SummaryLabel>Variables</SummaryLabel>
            <SummaryValue>{Object.keys(data.variables).length} variable(s) defined</SummaryValue>
          </SummaryRow>
        )}

        <SummaryRow>
          <SummaryLabel>Test Steps</SummaryLabel>
          <SummaryValue>
            {data?.steps?.length || 0} step(s)
            {data?.steps && data.steps.length > 0 && (
              <StepsList>
                {data.steps.map((step: TestStep, index: number) => (
                  <StepItem key={index}>
                    <MethodBadge method={step.request?.method || 'GET'}>{step.request?.method || 'GET'}</MethodBadge>
                    <StepName>{step.name}</StepName>
                  </StepItem>
                ))}
              </StepsList>
            )}
          </SummaryValue>
        </SummaryRow>
      </SummarySection>
    </StepContainer>
  );
};

export default ReviewStep;
