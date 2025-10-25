/**
 * HooksEditor Component
 *
 * Editor para configurar lifecycle hooks do flow-test-engine v2.0+
 * Suporta: compute, capture, exports, validate, log, metric, script, call, wait
 *
 * Baseado no flow-test-engine.schema.json v2.0.1 - HookAction structure
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { KeyValueEditor, KeyValuePair } from './KeyValueEditor';
import { CodeEditor } from '../CodeEditor';
import type { HookAction, HookCompute, HookCapture, HookValidation, HookLog } from '../../../types/flow-test.types';
// HookMetric reserved for future use

// ============================================================================
// Styled Components
// ============================================================================

const EditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 8px 0;
`;

const HookCard = styled.div`
  background: ${({ theme }) => theme['sidebar-background']};
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 6px;
  overflow: hidden;
`;

const HookHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: ${({ theme }) => theme['primary-theme']};
  border-bottom: 1px solid ${({ theme }) => theme['layout-border']};
`;

const HookTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme['primary-text']};
  display: flex;
  align-items: center;
  gap: 8px;

  .badge {
    font-size: 10px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 3px;
    background: ${({ theme }) => theme.brand};
    color: #fff;
  }
`;

const HookActions = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  background: transparent;
  color: ${({ theme }) => theme['secondary-text']};
  border: 1px solid ${({ theme }) => theme['layout-border']};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: ${({ theme }) => theme['layout-border']};
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

const HookBody = styled.div<{ $collapsed: boolean }>`
  display: ${({ $collapsed }) => ($collapsed ? 'none' : 'block')};
  padding: 16px;
`;

const Section = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme['primary-text']};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;

  .icon {
    font-size: 14px;
  }
`;

const ToggleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const Label = styled.label`
  font-size: 13px;
  color: ${({ theme }) => theme['primary-text']};
  cursor: pointer;
  user-select: none;
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
  width: 100%;

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
  width: 100%;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.brand};
  }
`;

const InfoBox = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme['secondary-text']};
  padding: 8px 12px;
  background: ${({ theme }) => theme['sidebar-background']};
  border-left: 3px solid ${({ theme }) => theme.brand};
  border-radius: 4px;
  margin-bottom: 12px;
  display: flex;
  align-items: start;
  gap: 8px;

  .icon {
    font-size: 14px;
    margin-top: 1px;
  }

  code {
    background: ${({ theme }) => theme['primary-theme']};
    padding: 2px 6px;
    border-radius: 3px;
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 11px;
  }
`;

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
  width: 100%;
  justify-content: center;
  margin-top: 12px;

  &:hover {
    opacity: 0.85;
  }
`;

const ValidationCard = styled.div`
  background: ${({ theme }) => theme['primary-theme']};
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 12px;
`;

const ValidationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const FieldGroup = styled.div`
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FieldLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme['secondary-text']};
  margin-bottom: 6px;
`;

const ChipList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
`;

const Chip = styled.div`
  background: ${({ theme }) => theme.brand};
  color: #fff;
  padding: 4px 10px 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;

  button {
    background: transparent;
    border: none;
    color: #fff;
    cursor: pointer;
    padding: 0;
    width: 14px;
    height: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background 0.15s;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
`;

// ============================================================================
// Component Props
// ============================================================================

interface HooksEditorProps {
  hooks: HookAction[];
  onChange: (hooks: HookAction[]) => void;
  hookType: 'pre' | 'post';
}

// ============================================================================
// Component
// ============================================================================

export const HooksEditor: React.FC<HooksEditorProps> = ({ hooks, onChange, hookType }) => {
  const [collapsedHooks, setCollapsedHooks] = useState<Set<number>>(new Set());

  // ========================================
  // Hook Management
  // ========================================

  const handleAddHook = () => {
    const newHook: HookAction = {};
    onChange([...hooks, newHook]);
  };

  const handleRemoveHook = (index: number) => {
    const updated = hooks.filter((_: HookAction, i: number) => i !== index);
    onChange(updated);
  };

  const handleToggleCollapse = (index: number) => {
    const updated = new Set(collapsedHooks);
    if (updated.has(index)) {
      updated.delete(index);
    } else {
      updated.add(index);
    }
    setCollapsedHooks(updated);
  };

  const updateHook = (index: number, field: keyof HookAction, value: unknown) => {
    const updated = [...hooks];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  // ========================================
  // Compute Handlers
  // ========================================

  const handleComputeChange = (index: number, pairs: KeyValuePair[]) => {
    const compute: HookCompute = {};
    pairs.forEach((pair) => {
      if (pair.key && pair.value) {
        compute[pair.key] = pair.value;
      }
    });
    updateHook(index, 'compute', Object.keys(compute).length > 0 ? compute : undefined);
  };

  // ========================================
  // Capture Handlers
  // ========================================

  const handleCaptureChange = (index: number, pairs: KeyValuePair[]) => {
    const capture: HookCapture = {};
    pairs.forEach((pair) => {
      if (pair.key && pair.value) {
        capture[pair.key] = pair.value;
      }
    });
    updateHook(index, 'capture', Object.keys(capture).length > 0 ? capture : undefined);
  };

  // ========================================
  // Exports Handlers
  // ========================================

  const handleExportsChange = (index: number, value: string) => {
    const exports = value
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v.length > 0);
    updateHook(index, 'exports', exports.length > 0 ? exports : undefined);
  };

  const handleRemoveExport = (hookIndex: number, exportName: string) => {
    const hook = hooks[hookIndex];
    if (!hook.exports) return;
    const updated = hook.exports.filter((e) => e !== exportName);
    updateHook(hookIndex, 'exports', updated.length > 0 ? updated : undefined);
  };

  // ========================================
  // Validation Handlers
  // ========================================

  const handleAddValidation = (index: number) => {
    const hook = hooks[index];
    const newValidation: HookValidation = {
      expression: '',
      message: '',
      severity: 'error',
    };
    updateHook(index, 'validate', [...(hook.validate || []), newValidation]);
  };

  const handleValidationChange = (
    hookIndex: number,
    validationIndex: number,
    field: keyof HookValidation,
    value: string
  ) => {
    const hook = hooks[hookIndex];
    if (!hook.validate) return;
    const updated = [...hook.validate];
    updated[validationIndex] = { ...updated[validationIndex], [field]: value };
    updateHook(hookIndex, 'validate', updated);
  };

  const handleRemoveValidation = (hookIndex: number, validationIndex: number) => {
    const hook = hooks[hookIndex];
    if (!hook.validate) return;
    const updated = hook.validate.filter((_: HookValidation, i: number) => i !== validationIndex);
    updateHook(hookIndex, 'validate', updated.length > 0 ? updated : undefined);
  };

  // ========================================
  // Log Handlers
  // ========================================

  const handleLogChange = (index: number, field: keyof HookLog, value: string) => {
    const hook = hooks[index];
    const log = hook.log || { level: 'info', message: '' };
    updateHook(index, 'log', { ...log, [field]: value });
  };

  // ========================================
  // Metric Handlers
  // ========================================

  // Reserved for future metric configuration UI
  // const handleMetricChange = (index: number, field: keyof HookMetric, value: string | Record<string, string>) => {
  //   const hook = hooks[index];
  //   const metric = hook.metric || { name: '', value: 0 };
  //   updateHook(index, 'metric', { ...metric, [field]: value });
  // };

  // ========================================
  // Render Hook
  // ========================================

  const renderHook = (hook: HookAction, index: number) => {
    const isCollapsed = collapsedHooks.has(index);

    // Count active features
    const activeFeatures = [
      hook.compute && 'compute',
      hook.capture && 'capture',
      hook.exports && 'exports',
      hook.validate && 'validate',
      hook.log && 'log',
      hook.metric && 'metric',
      hook.script && 'script',
      hook.wait && 'wait',
    ].filter(Boolean);

    return (
      <HookCard key={index}>
        <HookHeader>
          <HookTitle>
            <span>🪝</span>
            Hook #{index + 1}
            {activeFeatures.length > 0 && <span className="badge">{activeFeatures.length}</span>}
          </HookTitle>
          <HookActions>
            <IconButton onClick={() => handleToggleCollapse(index)}>{isCollapsed ? '▼' : '▲'}</IconButton>
            <RemoveButton onClick={() => handleRemoveHook(index)}>Remove</RemoveButton>
          </HookActions>
        </HookHeader>

        <HookBody $collapsed={isCollapsed}>
          {/* Compute */}
          <Section>
            <ToggleSection>
              <Checkbox
                id={`compute-${index}`}
                checked={!!hook.compute}
                onChange={(e) => {
                  if (!e.target.checked) {
                    updateHook(index, 'compute', undefined);
                  } else {
                    updateHook(index, 'compute', {});
                  }
                }}
              />
              <Label htmlFor={`compute-${index}`}>
                <SectionLabel>
                  <span className="icon">🧮</span>
                  Compute Variables
                </SectionLabel>
              </Label>
            </ToggleSection>

            {hook.compute && (
              <>
                <InfoBox>
                  <span className="icon">💡</span>
                  <span>
                    Compute variables using interpolation or JavaScript. Example: <code>{`{{$js:Date.now()}}`}</code>
                  </span>
                </InfoBox>
                <KeyValueEditor
                  items={Object.entries(hook.compute || {}).map(([key, value]) => ({
                    id: key,
                    key,
                    value: value as string,
                    enabled: true,
                  }))}
                  onChange={(pairs) => handleComputeChange(index, pairs)}
                  placeholder={{ key: 'Variable name', value: '{{$js:Date.now()}}' }}
                />
              </>
            )}
          </Section>

          {/* Capture */}
          <Section>
            <ToggleSection>
              <Checkbox
                id={`capture-${index}`}
                checked={!!hook.capture}
                onChange={(e) => {
                  if (!e.target.checked) {
                    updateHook(index, 'capture', undefined);
                  } else {
                    updateHook(index, 'capture', {});
                  }
                }}
              />
              <Label htmlFor={`capture-${index}`}>
                <SectionLabel>
                  <span className="icon">📸</span>
                  Capture Data
                </SectionLabel>
              </Label>
            </ToggleSection>

            {hook.capture && (
              <>
                <InfoBox>
                  <span className="icon">💡</span>
                  <span>
                    Capture data using JMESPath. Context: <code>response</code>, <code>variables</code>,{' '}
                    <code>input</code>
                  </span>
                </InfoBox>
                <KeyValueEditor
                  items={Object.entries(hook.capture || {}).map(([key, value]) => ({
                    id: key,
                    key,
                    value,
                    enabled: true,
                  }))}
                  onChange={(pairs) => handleCaptureChange(index, pairs)}
                  placeholder={{ key: 'Variable name', value: 'response.body.token' }}
                />
              </>
            )}
          </Section>

          {/* Exports */}
          <Section>
            <ToggleSection>
              <Checkbox
                id={`exports-${index}`}
                checked={!!hook.exports}
                onChange={(e) => {
                  if (!e.target.checked) {
                    updateHook(index, 'exports', undefined);
                  } else {
                    updateHook(index, 'exports', []);
                  }
                }}
              />
              <Label htmlFor={`exports-${index}`}>
                <SectionLabel>
                  <span className="icon">📤</span>
                  Export Variables
                </SectionLabel>
              </Label>
            </ToggleSection>

            {hook.exports && (
              <>
                <InfoBox>
                  <span className="icon">💡</span>
                  <span>Export variables to global scope for other test suites</span>
                </InfoBox>
                <Input
                  type="text"
                  placeholder="Enter variable names (comma-separated)"
                  defaultValue={hook.exports?.join(', ') || ''}
                  onBlur={(e) => handleExportsChange(index, e.target.value)}
                />
                {hook.exports && hook.exports.length > 0 && (
                  <ChipList>
                    {hook.exports.map((exportName: string) => (
                      <Chip key={exportName}>
                        {exportName}
                        <button onClick={() => handleRemoveExport(index, exportName)}>×</button>
                      </Chip>
                    ))}
                  </ChipList>
                )}
              </>
            )}
          </Section>

          {/* Validate */}
          <Section>
            <ToggleSection>
              <Checkbox
                id={`validate-${index}`}
                checked={!!hook.validate}
                onChange={(e) => {
                  if (!e.target.checked) {
                    updateHook(index, 'validate', undefined);
                  } else {
                    updateHook(index, 'validate', []);
                  }
                }}
              />
              <Label htmlFor={`validate-${index}`}>
                <SectionLabel>
                  <span className="icon">✔️</span>
                  Validations
                </SectionLabel>
              </Label>
            </ToggleSection>

            {hook.validate && (
              <>
                {hook.validate.map((validation: HookValidation, vIndex: number) => (
                  <ValidationCard key={vIndex}>
                    <ValidationHeader>
                      <span style={{ fontSize: '12px', fontWeight: 600 }}>Validation #{vIndex + 1}</span>
                      <RemoveButton onClick={() => handleRemoveValidation(index, vIndex)}>Remove</RemoveButton>
                    </ValidationHeader>

                    <FieldGroup>
                      <FieldLabel>Expression (JavaScript)</FieldLabel>
                      <CodeEditor
                        value={validation.expression}
                        onChange={(value) => handleValidationChange(index, vIndex, 'expression', value)}
                        language="javascript"
                        height="60px"
                        placeholder="e.g., user_id && auth_token"
                      />
                    </FieldGroup>

                    <FieldGroup>
                      <FieldLabel>Message</FieldLabel>
                      <Input
                        type="text"
                        placeholder="Error message"
                        value={validation.message}
                        onChange={(e) => handleValidationChange(index, vIndex, 'message', e.target.value)}
                      />
                    </FieldGroup>

                    <FieldGroup>
                      <FieldLabel>Severity</FieldLabel>
                      <Select
                        value={validation.severity || 'error'}
                        onChange={(e) => handleValidationChange(index, vIndex, 'severity', e.target.value)}
                      >
                        <option value="error">Error</option>
                        <option value="warning">Warning</option>
                        <option value="info">Info</option>
                      </Select>
                    </FieldGroup>
                  </ValidationCard>
                ))}
                <AddButton onClick={() => handleAddValidation(index)}>
                  <span>➕</span>
                  Add Validation
                </AddButton>
              </>
            )}
          </Section>

          {/* Log */}
          <Section>
            <ToggleSection>
              <Checkbox
                id={`log-${index}`}
                checked={!!hook.log}
                onChange={(e) => {
                  if (!e.target.checked) {
                    updateHook(index, 'log', undefined);
                  } else {
                    updateHook(index, 'log', { level: 'info', message: '' });
                  }
                }}
              />
              <Label htmlFor={`log-${index}`}>
                <SectionLabel>
                  <span className="icon">📝</span>
                  Log Message
                </SectionLabel>
              </Label>
            </ToggleSection>

            {hook.log && (
              <>
                <FieldGroup>
                  <FieldLabel>Level</FieldLabel>
                  <Select value={hook.log.level} onChange={(e) => handleLogChange(index, 'level', e.target.value)}>
                    <option value="info">Info</option>
                    <option value="warn">Warning</option>
                    <option value="error">Error</option>
                    <option value="debug">Debug</option>
                  </Select>
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel>Message</FieldLabel>
                  <Input
                    type="text"
                    placeholder="Log message (supports interpolation)"
                    value={hook.log.message}
                    onChange={(e) => handleLogChange(index, 'message', e.target.value)}
                  />
                </FieldGroup>
              </>
            )}
          </Section>

          {/* Script */}
          <Section>
            <ToggleSection>
              <Checkbox
                id={`script-${index}`}
                checked={!!hook.script}
                onChange={(e) => {
                  if (!e.target.checked) {
                    updateHook(index, 'script', undefined);
                  } else {
                    updateHook(index, 'script', '');
                  }
                }}
              />
              <Label htmlFor={`script-${index}`}>
                <SectionLabel>
                  <span className="icon">⚡</span>
                  Custom Script
                </SectionLabel>
              </Label>
            </ToggleSection>

            {hook.script !== undefined && (
              <>
                <InfoBox>
                  <span className="icon">⚠️</span>
                  <span>Execute arbitrary JavaScript code. Use with caution.</span>
                </InfoBox>
                <CodeEditor
                  value={hook.script}
                  onChange={(value) => updateHook(index, 'script', value)}
                  language="javascript"
                  height="120px"
                  placeholder="// Custom JavaScript code here"
                />
              </>
            )}
          </Section>

          {/* Wait */}
          <Section>
            <ToggleSection>
              <Checkbox
                id={`wait-${index}`}
                checked={hook.wait !== undefined}
                onChange={(e) => {
                  if (!e.target.checked) {
                    updateHook(index, 'wait', undefined);
                  } else {
                    updateHook(index, 'wait', 1000);
                  }
                }}
              />
              <Label htmlFor={`wait-${index}`}>
                <SectionLabel>
                  <span className="icon">⏱️</span>
                  Wait Delay
                </SectionLabel>
              </Label>
            </ToggleSection>

            {hook.wait !== undefined && (
              <FieldGroup>
                <FieldLabel>Delay (milliseconds)</FieldLabel>
                <Input
                  type="number"
                  placeholder="1000"
                  value={hook.wait}
                  onChange={(e) => updateHook(index, 'wait', parseInt(e.target.value, 10) || 0)}
                />
              </FieldGroup>
            )}
          </Section>
        </HookBody>
      </HookCard>
    );
  };

  // ========================================
  // Main Render
  // ========================================

  return (
    <EditorWrapper>
      <InfoBox>
        <span className="icon">ℹ️</span>
        <span>
          {hookType === 'pre' ? 'Pre-hooks' : 'Post-hooks'} execute {hookType === 'pre' ? 'before' : 'after'} the HTTP
          request. Use them to compute variables, capture data, validate conditions, and more.
        </span>
      </InfoBox>

      {hooks.length === 0 ? (
        <InfoBox>
          <span className="icon">📦</span>
          <span>No hooks configured yet. Click Add Hook to get started.</span>
        </InfoBox>
      ) : (
        hooks.map((hook, index) => renderHook(hook, index))
      )}

      <AddButton onClick={handleAddHook}>
        <span>➕</span>
        Add {hookType === 'pre' ? 'Pre' : 'Post'}-Hook
      </AddButton>
    </EditorWrapper>
  );
};
