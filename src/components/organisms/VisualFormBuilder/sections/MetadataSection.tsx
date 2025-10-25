/**
 * Metadata Section
 * Contains: priority, tags, timeout
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

interface MetadataSectionProps {
  data: TestSuiteFormData;
  onUpdate: (updates: Partial<TestSuiteFormData>) => void;
}

export const MetadataSection: React.FC<MetadataSectionProps> = ({ data, onUpdate }) => {
  const metadata = data.metadata || {};

  const updateMetadata = (updates: any) => {
    onUpdate({
      metadata: {
        ...metadata,
        ...updates,
      },
    });
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const tagsArray = value
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    updateMetadata({ tags: tagsArray.length > 0 ? tagsArray : undefined });
  };

  return (
    <Grid>
      <FormGroup>
        <Label>Priority</Label>
        <Select
          value={metadata.priority || ''}
          onChange={(e) => updateMetadata({ priority: e.target.value || undefined })}
        >
          <option value="">None</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </Select>
        <HelpText>
          Priority level for test execution ordering
        </HelpText>
      </FormGroup>

      <FormGroup>
        <Label>Timeout (ms)</Label>
        <Input
          type="number"
          value={metadata.timeout || ''}
          onChange={(e) => updateMetadata({ timeout: e.target.value ? parseInt(e.target.value) : undefined })}
          placeholder="e.g., 30000"
          min="0"
        />
        <HelpText>
          Suite-wide timeout in milliseconds
        </HelpText>
      </FormGroup>

      <FormGroup style={{ gridColumn: '1 / -1' }}>
        <Label>Tags</Label>
        <Input
          type="text"
          value={metadata.tags?.join(', ') || ''}
          onChange={handleTagsChange}
          placeholder="e.g., smoke, regression, api"
        />
        <HelpText>
          Comma-separated tags for categorization and filtering
        </HelpText>
      </FormGroup>
    </Grid>
  );
};
