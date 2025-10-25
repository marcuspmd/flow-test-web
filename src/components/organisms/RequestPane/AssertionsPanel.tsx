/**
 * AssertionsPanel Component
 *
 * Painel para configurar assertions (validações) de responses HTTP
 * Suporta validações de: status_code, body, headers, response_time_ms, custom
 *
 * Baseado no flow-test-engine.schema.json v2.0.1 - Assertions structure
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { KeyValueEditor, KeyValuePair } from './KeyValueEditor';
import { CodeEditor } from '../CodeEditor';
import type { Assertions, AssertionChecks, CustomAssertion } from '../../../types/flow-test.types';

// ============================================================================
// Styled Components
// ============================================================================

const PanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 8px 0;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: ${({ theme }) => theme['sidebar-background']};
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme['layout-border']};
`;

const SectionTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme['primary-text']};
  display: flex;
  align-items: center;
  gap: 8px;

  .icon {
    font-size: 16px;
  }
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  background: ${({ $active, theme }) => ($active ? theme.brand : 'transparent')};
  color: ${({ $active }) => ($active ? '#fff' : 'inherit')};
  border: 1px solid ${({ theme }) => theme['layout-border']};
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    opacity: 0.85;
  }
`;

const SectionContent = styled.div<{ $expanded: boolean }>`
  display: ${({ $expanded }) => ($expanded ? 'flex' : 'none')};
  flex-direction: column;
  gap: 12px;
  padding-left: 12px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme['secondary-text']};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Input = styled.input`
  background: ${({ theme }) =>
    (theme as { 'input-background'?: string })['input-background'] || theme['primary-theme']};
  color: ${({ theme }) => theme['primary-text']};
  border: 1px solid ${({ theme }) => theme['layout-border']};
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 13px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.brand};
  }

  &::placeholder {
    color: ${({ theme }) => theme['secondary-text']};
    opacity: 0.5;
  }
`;

const Select = styled.select`
  background: ${({ theme }) =>
    (theme as { 'input-background'?: string })['input-background'] || theme['primary-theme']};
  color: ${({ theme }) => theme['primary-text']};
  border: 1px solid ${({ theme }) => theme['layout-border']};
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.brand};
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  cursor: pointer;

  input[type='checkbox'] {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
`;
// Reserved for future use

const AddButton = styled.button`
  background: ${({ theme }) => theme.brand};
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    opacity: 0.85;
  }
`;

const RemoveButton = styled.button`
  background: ${({ theme }) => (theme as { 'error-color'?: string })['error-color'] || '#dc2626'};
  color: #fff;
  border: none;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    opacity: 0.85;
  }
`;

const CustomAssertionCard = styled.div`
  background: ${({ theme }) => theme['sidebar-background']};
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 4px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CustomAssertionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InfoText = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme['secondary-text']};
  padding: 8px 12px;
  background: ${({ theme }) => theme['sidebar-background']};
  border-left: 3px solid ${({ theme }) => theme.brand};
  border-radius: 4px;
  display: flex;
  align-items: start;
  gap: 8px;

  .icon {
    font-size: 14px;
    margin-top: 1px;
  }

  a {
    color: ${({ theme }) => theme.brand};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

// ============================================================================
// Component Props
// ============================================================================

interface AssertionsPanelProps {
  assertions: Assertions;
  onChange: (assertions: Assertions) => void;
}

// ============================================================================
// Component
// ============================================================================

export const AssertionsPanel: React.FC<AssertionsPanelProps> = ({ assertions, onChange }) => {
  const [statusExpanded, setStatusExpanded] = useState(true);
  const [bodyExpanded, setBodyExpanded] = useState(false);
  const [headersExpanded, setHeadersExpanded] = useState(false);
  const [responseTimeExpanded, setResponseTimeExpanded] = useState(false);
  const [customExpanded, setCustomExpanded] = useState(false);

  // ========================================
  // Status Code Handlers
  // ========================================

  const handleStatusCodeChange = (value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      onChange({ ...assertions, status_code: numValue });
    } else {
      onChange({ ...assertions, status_code: undefined });
    }
  };

  // ========================================
  // Body Assertions Handlers
  // ========================================

  const bodyAssertions = assertions.body || {};

  const bodyFields: KeyValuePair[] = Object.entries(bodyAssertions).map(([key, checks]) => ({
    id: key,
    key,
    value: JSON.stringify(checks),
    enabled: true,
  }));

  const handleBodyFieldsChange = (pairs: KeyValuePair[]) => {
    const body: Record<string, AssertionChecks> = {};
    pairs.forEach((pair) => {
      if (pair.key && pair.value) {
        try {
          body[pair.key] = JSON.parse(pair.value);
        } catch {
          // Ignore invalid JSON
        }
      }
    });
    onChange({ ...assertions, body });
  };

  // ========================================
  // Headers Assertions Handlers
  // ========================================

  const headersAssertions = assertions.headers || {};

  const headersFields: KeyValuePair[] = Object.entries(headersAssertions).map(([key, checks]) => ({
    id: key,
    key,
    value: JSON.stringify(checks),
    enabled: true,
  }));

  const handleHeadersFieldsChange = (pairs: KeyValuePair[]) => {
    const headers: Record<string, AssertionChecks> = {};
    pairs.forEach((pair) => {
      if (pair.key && pair.value) {
        try {
          headers[pair.key] = JSON.parse(pair.value);
        } catch {
          // Ignore invalid JSON
        }
      }
    });
    onChange({ ...assertions, headers });
  };

  // ========================================
  // Response Time Handlers
  // ========================================

  const responseTime = assertions.response_time_ms || {};

  const handleResponseTimeChange = (field: keyof AssertionChecks, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      onChange({
        ...assertions,
        response_time_ms: { ...responseTime, [field]: numValue },
      });
    }
  };

  // ========================================
  // Custom Assertions Handlers
  // ========================================

  const customAssertions = assertions.custom || [];

  const handleAddCustomAssertion = () => {
    const newAssertion: CustomAssertion = {
      name: 'New Assertion',
      condition: '',
      message: '',
      severity: 'error',
    };
    onChange({ ...assertions, custom: [...customAssertions, newAssertion] });
  };

  const handleCustomAssertionChange = (index: number, field: keyof CustomAssertion, value: string) => {
    const updated = [...customAssertions];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...assertions, custom: updated });
  };

  const handleRemoveCustomAssertion = (index: number) => {
    const updated = customAssertions.filter((_: CustomAssertion, i: number) => i !== index);
    onChange({ ...assertions, custom: updated });
  };

  // ========================================
  // Render
  // ========================================

  return (
    <PanelWrapper>
      <InfoText>
        <span className="icon">ℹ️</span>
        <span>
          Configure validações para responses HTTP. Suporta{' '}
          <a href="https://jmespath.org/" target="_blank" rel="noopener noreferrer">
            JMESPath
          </a>{' '}
          para body assertions e JavaScript para custom assertions.
        </span>
      </InfoText>

      {/* Status Code */}
      <Section>
        <SectionHeader>
          <SectionTitle>
            <span className="icon">🔢</span>
            Status Code
          </SectionTitle>
          <ToggleButton $active={statusExpanded} onClick={() => setStatusExpanded(!statusExpanded)}>
            {statusExpanded ? 'Collapse' : 'Expand'}
          </ToggleButton>
        </SectionHeader>
        <SectionContent $expanded={statusExpanded}>
          <FieldGroup>
            <Label>Expected Status Code</Label>
            <Input
              type="number"
              placeholder="e.g., 200, 201, 404"
              value={typeof assertions.status_code === 'number' ? assertions.status_code : ''}
              onChange={(e) => handleStatusCodeChange(e.target.value)}
            />
          </FieldGroup>
        </SectionContent>
      </Section>

      {/* Body Assertions */}
      <Section>
        <SectionHeader>
          <SectionTitle>
            <span className="icon">📄</span>
            Body Assertions
          </SectionTitle>
          <ToggleButton $active={bodyExpanded} onClick={() => setBodyExpanded(!bodyExpanded)}>
            {bodyExpanded ? 'Collapse' : 'Expand'}
          </ToggleButton>
        </SectionHeader>
        <SectionContent $expanded={bodyExpanded}>
          <InfoText>
            <span className="icon">💡</span>
            <span>
              Use JMESPath notation for field paths (e.g., <code>user.id</code>, <code>items[0].name</code>). Value
              should be JSON with assertion operators.
            </span>
          </InfoText>
          <KeyValueEditor
            items={bodyFields}
            onChange={handleBodyFieldsChange}
            placeholder={{ key: 'JMESPath (e.g., user.id)', value: '{"equals": 123}' }}
          />
        </SectionContent>
      </Section>

      {/* Headers Assertions */}
      <Section>
        <SectionHeader>
          <SectionTitle>
            <span className="icon">📋</span>
            Headers Assertions
          </SectionTitle>
          <ToggleButton $active={headersExpanded} onClick={() => setHeadersExpanded(!headersExpanded)}>
            {headersExpanded ? 'Collapse' : 'Expand'}
          </ToggleButton>
        </SectionHeader>
        <SectionContent $expanded={headersExpanded}>
          <KeyValueEditor
            items={headersFields}
            onChange={handleHeadersFieldsChange}
            placeholder={{ key: 'Header name', value: '{"contains": "application/json"}' }}
          />
        </SectionContent>
      </Section>

      {/* Response Time */}
      <Section>
        <SectionHeader>
          <SectionTitle>
            <span className="icon">⏱️</span>
            Response Time
          </SectionTitle>
          <ToggleButton $active={responseTimeExpanded} onClick={() => setResponseTimeExpanded(!responseTimeExpanded)}>
            {responseTimeExpanded ? 'Collapse' : 'Expand'}
          </ToggleButton>
        </SectionHeader>
        <SectionContent $expanded={responseTimeExpanded}>
          <FieldGroup>
            <Label>Less Than (ms)</Label>
            <Input
              type="number"
              placeholder="e.g., 1000"
              value={responseTime.less_than || ''}
              onChange={(e) => handleResponseTimeChange('less_than', e.target.value)}
            />
          </FieldGroup>
          <FieldGroup>
            <Label>Greater Than (ms)</Label>
            <Input
              type="number"
              placeholder="e.g., 10"
              value={responseTime.greater_than || ''}
              onChange={(e) => handleResponseTimeChange('greater_than', e.target.value)}
            />
          </FieldGroup>
        </SectionContent>
      </Section>

      {/* Custom Assertions */}
      <Section>
        <SectionHeader>
          <SectionTitle>
            <span className="icon">⚙️</span>
            Custom Assertions
          </SectionTitle>
          <ToggleButton $active={customExpanded} onClick={() => setCustomExpanded(!customExpanded)}>
            {customExpanded ? 'Collapse' : 'Expand'}
          </ToggleButton>
        </SectionHeader>
        <SectionContent $expanded={customExpanded}>
          <InfoText>
            <span className="icon">💡</span>
            <span>
              Write JavaScript expressions for advanced validations. Context available: body, headers, status_code,
              response_time_ms.
            </span>
          </InfoText>

          {customAssertions.map((assertion: CustomAssertion, index: number) => (
            <CustomAssertionCard key={index}>
              <CustomAssertionHeader>
                <FieldGroup style={{ flex: 1 }}>
                  <Label>Assertion Name</Label>
                  <Input
                    type="text"
                    placeholder="e.g., Valid User ID"
                    value={assertion.name}
                    onChange={(e) => handleCustomAssertionChange(index, 'name', e.target.value)}
                  />
                </FieldGroup>
                <RemoveButton onClick={() => handleRemoveCustomAssertion(index)}>Remove</RemoveButton>
              </CustomAssertionHeader>

              <FieldGroup>
                <Label>Condition (JavaScript)</Label>
                <CodeEditor
                  value={assertion.condition}
                  onChange={(value) => handleCustomAssertionChange(index, 'condition', value)}
                  language="javascript"
                  height="80px"
                  placeholder="e.g., body.user.id && typeof body.user.id === 'number'"
                />
              </FieldGroup>

              <FieldGroup>
                <Label>Error Message</Label>
                <Input
                  type="text"
                  placeholder="e.g., User ID must be a number"
                  value={assertion.message || ''}
                  onChange={(e) => handleCustomAssertionChange(index, 'message', e.target.value)}
                />
              </FieldGroup>

              <FieldGroup>
                <Label>Severity</Label>
                <Select
                  value={assertion.severity || 'error'}
                  onChange={(e) => handleCustomAssertionChange(index, 'severity', e.target.value)}
                >
                  <option value="error">Error</option>
                  <option value="warning">Warning</option>
                  <option value="info">Info</option>
                </Select>
              </FieldGroup>
            </CustomAssertionCard>
          ))}

          <AddButton onClick={handleAddCustomAssertion}>
            <span>➕</span>
            Add Custom Assertion
          </AddButton>
        </SectionContent>
      </Section>
    </PanelWrapper>
  );
};
