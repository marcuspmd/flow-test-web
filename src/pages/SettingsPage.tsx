import { useState } from 'react';
import styled from 'styled-components';
import { useUI, useEnvironments } from '../hooks';
import { Button, Badge } from '../components';

const SettingsWrapper = styled.div`
  padding: 24px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme['primary-text']};
  margin-bottom: 24px;
`;

const Section = styled.section`
  background: ${({ theme }) => theme['sidebar-background']};
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme['primary-text']};
  margin-bottom: 16px;
`;

const SectionDescription = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme['secondary-text']};
  margin-bottom: 16px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 16px;
`;

const FormLabel = styled.label`
  min-width: 120px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme['primary-text']};
`;

const ThemeButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ThemeButton = styled.button<{ $isActive?: boolean }>`
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme, $isActive }) => ($isActive ? theme['primary-text'] : theme['secondary-text'])};
  background: ${({ theme, $isActive }) => ($isActive ? theme.brand : theme['codemirror-background'])};
  border: 1px solid ${({ theme, $isActive }) => ($isActive ? theme.brand : theme['layout-border'])};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.brand};
    color: ${({ theme }) => theme['primary-text']};
  }
`;

const EnvironmentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const EnvironmentCard = styled.div<{ $isActive?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: ${({ theme }) => theme['codemirror-background']};
  border: 2px solid ${({ theme, $isActive }) => ($isActive ? theme.brand : theme['layout-border'])};
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.brand};
  }
`;

const EnvironmentInfo = styled.div`
  flex: 1;
`;

const EnvironmentName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme['primary-text']};
  margin-bottom: 4px;
`;

const EnvironmentVariables = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme['secondary-text']};
`;

const EnvironmentActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const VariableList = styled.div`
  margin-top: 16px;
`;

const VariableItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: ${({ theme }) => theme['codemirror-background']};
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 4px;
  margin-bottom: 8px;
`;

const VariableKey = styled.div`
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme['primary-text']};
`;

const VariableValue = styled.div<{ $isSecret?: boolean }>`
  flex: 2;
  font-size: 14px;
  color: ${({ theme }) => theme['secondary-text']};
  font-family: monospace;
  ${({ $isSecret }) => $isSecret && 'filter: blur(4px);'}
`;

/**
 * Settings Page - Configurações da aplicação
 */
export default function SettingsPage() {
  const { theme, setTheme } = useUI();
  const { environments, activeEnvironment, setActiveEnvironment } = useEnvironments();
  const [showVariables, setShowVariables] = useState<Record<string, boolean>>({});

  const toggleVariables = (envId: string) => {
    setShowVariables((prev) => ({
      ...prev,
      [envId]: !prev[envId],
    }));
  };

  return (
    <SettingsWrapper>
      <Title>Settings</Title>

      {/* Appearance Settings */}
      <Section>
        <SectionTitle>Appearance</SectionTitle>
        <SectionDescription>Customize the look and feel of the application</SectionDescription>

        <FormRow>
          <FormLabel>Theme</FormLabel>
          <ThemeButtons>
            <ThemeButton $isActive={theme === 'light'} onClick={() => setTheme('light')}>
              ☀️ Light
            </ThemeButton>
            <ThemeButton $isActive={theme === 'dark'} onClick={() => setTheme('dark')}>
              🌙 Dark
            </ThemeButton>
          </ThemeButtons>
        </FormRow>
      </Section>

      {/* Environments Settings */}
      <Section>
        <SectionTitle>Environments</SectionTitle>
        <SectionDescription>Manage your test environments and their variables</SectionDescription>

        <EnvironmentList>
          {environments.map((env) => (
            <div key={env.id}>
              <EnvironmentCard
                $isActive={env.id === activeEnvironment?.id}
                onClick={() => setActiveEnvironment(env.id)}
              >
                <EnvironmentInfo>
                  <EnvironmentName>
                    {env.displayName}{' '}
                    {env.id === activeEnvironment?.id && (
                      <Badge variant="success" size="sm">
                        Active
                      </Badge>
                    )}
                  </EnvironmentName>
                  <EnvironmentVariables>
                    {env.variables.filter((v) => v.enabled).length} active variables
                  </EnvironmentVariables>
                </EnvironmentInfo>

                <EnvironmentActions>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleVariables(env.id);
                    }}
                  >
                    {showVariables[env.id] ? '🔼 Hide' : '🔽 Show'} Variables
                  </Button>
                </EnvironmentActions>
              </EnvironmentCard>

              {showVariables[env.id] && (
                <VariableList>
                  {env.variables.map((variable) => (
                    <VariableItem key={variable.key}>
                      <VariableKey>{variable.key}</VariableKey>
                      <VariableValue $isSecret={variable.type === 'secret'}>{variable.value}</VariableValue>
                      <Badge variant={variable.enabled ? 'success' : 'default'} size="sm">
                        {variable.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </VariableItem>
                  ))}
                </VariableList>
              )}
            </div>
          ))}
        </EnvironmentList>
      </Section>

      {/* About Section */}
      <Section>
        <SectionTitle>About</SectionTitle>
        <SectionDescription>Flow Test Engine - API Testing Made Simple</SectionDescription>

        <FormRow>
          <FormLabel>Version</FormLabel>
          <div>1.0.0</div>
        </FormRow>

        <FormRow>
          <FormLabel>Build Date</FormLabel>
          <div>{new Date().toLocaleDateString()}</div>
        </FormRow>
      </Section>
    </SettingsWrapper>
  );
}
