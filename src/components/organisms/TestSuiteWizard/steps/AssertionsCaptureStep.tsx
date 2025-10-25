import React, { useEffect } from 'react';
import styled from 'styled-components';
import { WizardStepProps } from '../WizardContainer';

const StepContainer = styled.div`
  max-width: 700px;
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

const InfoBox = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme['sidebar-background']};
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 8px;
  margin-bottom: 24px;

  h3 {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 12px 0;
    color: ${({ theme }) => theme['primary-text']};
  }

  p {
    font-size: 14px;
    color: ${({ theme }) => theme['secondary-text']};
    line-height: 1.6;
    margin: 0;
  }
`;

const PlaceholderContent = styled.div`
  padding: 60px 20px;
  text-align: center;
  color: ${({ theme }) => theme['secondary-text']};

  .icon {
    font-size: 64px;
    margin-bottom: 20px;
    opacity: 0.3;
  }

  h3 {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 12px 0;
    color: ${({ theme }) => theme['primary-text']};
  }

  p {
    font-size: 14px;
    margin: 0;
    line-height: 1.6;
  }
`;

const AssertionsCaptureStep: React.FC<WizardStepProps> = ({ onValidation }) => {
  useEffect(() => {
    // This step is optional, so always mark as valid
    onValidation?.({ isValid: true });
  }, [onValidation]);

  return (
    <StepContainer>
      <StepHeader>
        <h2>Assertions & Capture</h2>
        <p>Add assertions and variable capture to your test steps (optional)</p>
      </StepHeader>

      <InfoBox>
        <h3>📝 About This Step</h3>
        <p>
          Assertions validate your API responses, and capture allows you to extract values
          for use in subsequent steps. This step is optional - you can add these directly
          in the YAML editor after generating your test suite.
        </p>
      </InfoBox>

      <PlaceholderContent>
        <div className="icon">✓</div>
        <h3>Advanced Features</h3>
        <p>
          Detailed assertion and capture editors will be available in a future update.
          <br />
          For now, you can add these manually in the YAML editor or skip this step.
        </p>
      </PlaceholderContent>
    </StepContainer>
  );
};

export default AssertionsCaptureStep;
