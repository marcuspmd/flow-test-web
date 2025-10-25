/**
 * Visual Form Builder - Main Container
 * Schema-driven form for creating test suites
 */

import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../store';
import { updateFormData, setFormData } from '../../../store/slices/testSuiteEditorSlice';
import { BasicInfoSection } from './sections/BasicInfoSection';
import { ConfigurationSection } from './sections/ConfigurationSection';
import { StepsSection } from './sections/StepsSection';
import { MetadataSection } from './sections/MetadataSection';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  background: ${({ theme }) => theme['primary-theme']};
  padding: 24px;
  gap: 24px;
`;

const Section = styled.div`
  background: ${({ theme }) => theme['sidebar-background']};
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 8px;
  overflow: hidden;
`;

const SectionHeader = styled.div`
  padding: 16px 20px;
  background: ${({ theme }) => theme['primary-theme']};
  border-bottom: 1px solid ${({ theme }) => theme['layout-border']};
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
  
  &:hover {
    background: ${({ theme }) => theme['sidebar-background']};
  }
`;

const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  .icon {
    font-size: 20px;
  }
  
  .title {
    font-size: 15px;
    font-weight: 600;
    color: ${({ theme }) => theme['primary-text']};
  }
  
  .subtitle {
    font-size: 12px;
    color: ${({ theme }) => theme['secondary-text']};
    font-weight: 400;
    margin-left: 8px;
  }
`;

const SectionContent = styled.div<{ $collapsed: boolean }>`
  padding: ${({ $collapsed }) => ($collapsed ? '0' : '20px')};
  max-height: ${({ $collapsed }) => ($collapsed ? '0' : 'none')};
  overflow: ${({ $collapsed }) => ($collapsed ? 'hidden' : 'visible')};
  transition: all 0.2s ease;
`;

const CollapseIcon = styled.span<{ $collapsed: boolean }>`
  font-size: 14px;
  transition: transform 0.2s ease;
  transform: ${({ $collapsed }) => ($collapsed ? 'rotate(-90deg)' : 'rotate(0)')};
`;

const HelpText = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme['secondary-text']};
  margin-bottom: 16px;
  line-height: 1.6;
`;

interface SectionConfig {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  component: React.ComponentType<any>;
  defaultCollapsed?: boolean;
}

const SECTIONS: SectionConfig[] = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    subtitle: 'Required',
    icon: '📝',
    component: BasicInfoSection,
    defaultCollapsed: false,
  },
  {
    id: 'configuration',
    title: 'Configuration',
    subtitle: 'Optional',
    icon: '⚙️',
    component: ConfigurationSection,
    defaultCollapsed: false,
  },
  {
    id: 'steps',
    title: 'Test Steps',
    subtitle: 'Required',
    icon: '🔄',
    component: StepsSection,
    defaultCollapsed: false,
  },
  {
    id: 'metadata',
    title: 'Metadata',
    subtitle: 'Optional',
    icon: '🏷️',
    component: MetadataSection,
    defaultCollapsed: true,
  },
];

export const VisualFormBuilder: React.FC = () => {
  const dispatch = useAppDispatch();
  const { formData } = useAppSelector((state) => state.testSuiteEditor);
  const [collapsedSections, setCollapsedSections] = React.useState<Set<string>>(
    new Set(SECTIONS.filter(s => s.defaultCollapsed).map(s => s.id))
  );

  const toggleSection = (sectionId: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const handleUpdate = (updates: any) => {
    dispatch(updateFormData(updates));
  };

  return (
    <FormContainer>
      <HelpText>
        Fill in the form below to create your test suite. The YAML will be generated automatically
        as you type. Required fields are marked in the section subtitle.
      </HelpText>

      {SECTIONS.map((section) => {
        const SectionComponent = section.component;
        const isCollapsed = collapsedSections.has(section.id);

        return (
          <Section key={section.id}>
            <SectionHeader onClick={() => toggleSection(section.id)}>
              <SectionTitle>
                <span className="icon">{section.icon}</span>
                <div>
                  <span className="title">{section.title}</span>
                  {section.subtitle && <span className="subtitle">• {section.subtitle}</span>}
                </div>
              </SectionTitle>
              <CollapseIcon $collapsed={isCollapsed}>▼</CollapseIcon>
            </SectionHeader>
            <SectionContent $collapsed={isCollapsed}>
              <SectionComponent data={formData} onUpdate={handleUpdate} />
            </SectionContent>
          </Section>
        );
      })}
    </FormContainer>
  );
};
