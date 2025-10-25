import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { WizardStepProps } from '../WizardContainer';

const StepContainer = styled.div`
  max-width: 600px;
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

const FormField = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: ${({ theme }) => theme['primary-text']};

  .required {
    color: ${({ theme }) => theme.brand};
  }
`;

const HelpText = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme['secondary-text']};
  margin-top: 6px;
  line-height: 1.4;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 14px;
  font-size: 14px;
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

  &::placeholder {
    color: ${({ theme }) => theme['secondary-text']};
    opacity: 0.6;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 10px 14px;
  font-size: 14px;
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 6px;
  background: ${({ theme }) => theme['sidebar-background']};
  color: ${({ theme }) => theme['primary-text']};
  font-family: inherit;
  resize: vertical;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.brand};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.brand}22;
  }

  &::placeholder {
    color: ${({ theme }) => theme['secondary-text']};
    opacity: 0.6;
  }
`;

const ErrorMessage = styled.div`
  font-size: 12px;
  color: #ef4444;
  margin-top: 6px;
`;

const BasicInfoStep: React.FC<WizardStepProps> = ({ data, onUpdate, onValidation }) => {
  const [suiteName, setSuiteName] = useState(data?.suite_name || '');
  const [nodeId, setNodeId] = useState(data?.node_id || '');
  const [description, setDescription] = useState(data?.description || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Use refs to prevent infinite loops from callback changes
  const onUpdateRef = useRef(onUpdate);
  const onValidationRef = useRef(onValidation);

  // Update refs when callbacks change
  useEffect(() => {
    onUpdateRef.current = onUpdate;
    onValidationRef.current = onValidation;
  }, [onUpdate, onValidation]);

  // Auto-generate node_id from suite_name
  const generateNodeId = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  useEffect(() => {
    // Validate form
    const newErrors: Record<string, string> = {};

    if (!suiteName.trim()) {
      newErrors.suite_name = 'Suite name is required';
    }

    if (!nodeId.trim()) {
      newErrors.node_id = 'Node ID is required';
    } else if (!/^[a-z0-9-]+$/.test(nodeId)) {
      newErrors.node_id = 'Node ID must contain only lowercase letters, numbers, and hyphens';
    }

    setErrors(newErrors);

    // Update parent using refs to avoid dependency issues
    onUpdateRef.current?.({
      suite_name: suiteName,
      node_id: nodeId,
      description: description || undefined,
    });

    // Update validation status
    onValidationRef.current?.({
      isValid: Object.keys(newErrors).length === 0,
      errors: Object.values(newErrors),
    });
  }, [suiteName, nodeId, description]); // Only depend on actual state values

  const handleSuiteNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setSuiteName(name);

    // Auto-generate node_id if it hasn't been manually edited
    if (!nodeId || nodeId === generateNodeId(suiteName)) {
      setNodeId(generateNodeId(name));
    }
  };

  return (
    <StepContainer>
      <StepHeader>
        <h2>Basic Information</h2>
        <p>Enter the basic details for your test suite</p>
      </StepHeader>

      <FormField>
        <Label>
          Suite Name <span className="required">*</span>
        </Label>
        <Input
          type="text"
          value={suiteName}
          onChange={handleSuiteNameChange}
          placeholder="e.g., User Authentication Tests"
        />
        {errors.suite_name && <ErrorMessage>{errors.suite_name}</ErrorMessage>}
        <HelpText>A descriptive name for your test suite</HelpText>
      </FormField>

      <FormField>
        <Label>
          Node ID <span className="required">*</span>
        </Label>
        <Input
          type="text"
          value={nodeId}
          onChange={(e) => setNodeId(e.target.value)}
          placeholder="e.g., user-auth-tests"
          pattern="^[a-z0-9-]+$"
        />
        {errors.node_id && <ErrorMessage>{errors.node_id}</ErrorMessage>}
        <HelpText>Unique identifier in kebab-case (lowercase letters, numbers, and hyphens only)</HelpText>
      </FormField>

      <FormField>
        <Label>Description</Label>
        <TextArea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., Tests for user authentication including login, logout, and password reset"
        />
        <HelpText>Optional description of what this test suite covers</HelpText>
      </FormField>
    </StepContainer>
  );
};

export default BasicInfoStep;
