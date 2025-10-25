import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../store';
import { updateTestSuiteData } from '../../../store/slices/testSuiteEditorSlice';

// Step components (to be created)
import BasicInfoStep from './steps/BasicInfoStep';
import ConfigurationStep from './steps/ConfigurationStep';
import StepsBuilderStep from './steps/StepsBuilderStep';
import AssertionsCaptureStep from './steps/AssertionsCaptureStep';
import ReviewStep from './steps/ReviewStep';

export interface WizardStepConfig {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<WizardStepProps>;
  isOptional?: boolean;
  validate?: (data: any) => ValidationResult;
}

export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
}

export interface WizardStepProps {
  data: any;
  onUpdate: (updates: any) => void;
  onValidation?: (result: ValidationResult) => void;
}

const WizardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${({ theme }) => theme['primary-theme']};
`;

const ProgressBar = styled.div`
  padding: 16px 24px;
  background: ${({ theme }) => theme['sidebar-background']};
  border-bottom: 1px solid ${({ theme }) => theme['layout-border']};
`;

const ProgressSteps = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 800px;
  margin: 0 auto;
`;

const ProgressStep = styled.div<{ $active: boolean; $completed: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 16px;
    left: 50%;
    width: 100%;
    height: 2px;
    background: ${({ $completed, theme }) =>
      $completed ? theme.brand : theme['layout-border']};
    z-index: 0;
  }
`;

const StepNumber = styled.div<{ $active: boolean; $completed: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  background: ${({ $active, $completed, theme }) =>
    $active ? theme.brand : $completed ? theme.brand : theme['sidebar-background']};
  color: ${({ $active, $completed }) =>
    $active || $completed ? 'white' : 'inherit'};
  border: 2px solid ${({ $active, $completed, theme }) =>
    $active ? theme.brand : $completed ? theme.brand : theme['layout-border']};
  position: relative;
  z-index: 1;
  transition: all 0.2s ease;
`;

const StepLabel = styled.div<{ $active: boolean }>`
  font-size: 12px;
  color: ${({ $active, theme }) =>
    $active ? theme['primary-text'] : theme['secondary-text']};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  text-align: center;
`;

const StepContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
`;

const StepFooter = styled.div`
  padding: 16px 24px;
  background: ${({ theme }) => theme['sidebar-background']};
  border-top: 1px solid ${({ theme }) => theme['layout-border']};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ $variant, theme }) =>
    $variant === 'primary' ? theme.brand : theme['primary-theme']};
  color: ${({ $variant, theme }) =>
    $variant === 'primary' ? 'white' : theme['primary-text']};
  border: 1px solid ${({ $variant, theme }) =>
    $variant === 'primary' ? theme.brand : theme['layout-border']};

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StepInfo = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme['secondary-text']};
`;

const WIZARD_STEPS: WizardStepConfig[] = [
  {
    id: 'basic-info',
    title: 'Basic Info',
    description: 'Suite name and description',
    component: BasicInfoStep,
  },
  {
    id: 'configuration',
    title: 'Configuration',
    description: 'Settings and variables',
    component: ConfigurationStep,
    isOptional: true,
  },
  {
    id: 'steps-builder',
    title: 'Steps Builder',
    description: 'Create test steps',
    component: StepsBuilderStep,
  },
  {
    id: 'assertions',
    title: 'Assertions',
    description: 'Add validations',
    component: AssertionsCaptureStep,
    isOptional: true,
  },
  {
    id: 'review',
    title: 'Review',
    description: 'Review and generate',
    component: ReviewStep,
  },
];

export const WizardContainer: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [validationResult, setValidationResult] = useState<ValidationResult>({ isValid: true });
  const dispatch = useAppDispatch();
  const { currentData } = useAppSelector((state) => state.testSuiteEditor);

  const currentStep = WIZARD_STEPS[currentStepIndex];
  const StepComponent = currentStep.component;

  const handleNext = () => {
    if (currentStepIndex < WIZARD_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setValidationResult({ isValid: true });
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setValidationResult({ isValid: true });
    }
  };

  const handleSkip = () => {
    if (currentStep.isOptional) {
      handleNext();
    }
  };

  const handleUpdate = (updates: any) => {
    dispatch(updateTestSuiteData(updates));
  };

  const handleValidation = (result: ValidationResult) => {
    setValidationResult(result);
  };

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === WIZARD_STEPS.length - 1;
  const canProceed = validationResult.isValid;

  return (
    <WizardWrapper>
      <ProgressBar>
        <ProgressSteps>
          {WIZARD_STEPS.map((step, index) => (
            <ProgressStep
              key={step.id}
              $active={index === currentStepIndex}
              $completed={index < currentStepIndex}
            >
              <StepNumber
                $active={index === currentStepIndex}
                $completed={index < currentStepIndex}
              >
                {index < currentStepIndex ? '✓' : index + 1}
              </StepNumber>
              <StepLabel $active={index === currentStepIndex}>
                {step.title}
              </StepLabel>
            </ProgressStep>
          ))}
        </ProgressSteps>
      </ProgressBar>

      <StepContent>
        <StepComponent
          data={currentData}
          onUpdate={handleUpdate}
          onValidation={handleValidation}
        />
      </StepContent>

      <StepFooter>
        <StepInfo>
          Step {currentStepIndex + 1} of {WIZARD_STEPS.length}
          {currentStep.isOptional && ' (Optional)'}
        </StepInfo>

        <ButtonGroup>
          {!isFirstStep && (
            <Button onClick={handlePrevious}>
              Previous
            </Button>
          )}
          
          {currentStep.isOptional && !isLastStep && (
            <Button onClick={handleSkip}>
              Skip
            </Button>
          )}

          {!isLastStep && (
            <Button
              $variant="primary"
              onClick={handleNext}
              disabled={!canProceed}
            >
              Next
            </Button>
          )}

          {isLastStep && (
            <Button
              $variant="primary"
              onClick={() => {
                // This will be handled by ReviewStep
              }}
              disabled={!canProceed}
            >
              Generate Test Suite
            </Button>
          )}
        </ButtonGroup>
      </StepFooter>
    </WizardWrapper>
  );
};
