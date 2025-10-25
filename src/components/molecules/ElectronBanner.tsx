import { useEffect, useState } from 'react';
import styled from 'styled-components';

const BannerContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const Icon = styled.span`
  font-size: 20px;
`;

const Message = styled.div`
  flex: 1;
  max-width: 800px;
`;

const Code = styled.code`
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 4px;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 13px;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

/**
 * ElectronBanner
 * Mostra aviso quando a aplicação não está rodando no Electron
 */
export const ElectronBanner = () => {
  const [isElectron, setIsElectron] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Verifica se está rodando no Electron
    const checkElectron = () => {
      if (typeof window !== 'undefined') {
        setIsElectron(!!window.flowTestAPI);
      }
    };

    checkElectron();

    // Recheck após delay (caso API carregue depois)
    const timer = setTimeout(checkElectron, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isElectron || dismissed) {
    return null;
  }

  return (
    <BannerContainer>
      <Icon>⚡</Icon>
      <Message>
        <strong>Electron Mode Required</strong>
        <br />
        Some features (test execution, file system access) require Electron. Please run: <Code>npm run dev</Code>
      </Message>
      <CloseButton onClick={() => setDismissed(true)}>Dismiss</CloseButton>
    </BannerContainer>
  );
};
