import React from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../../../store';

const ViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  color: ${({ theme }) => theme['secondary-text']};
  text-align: center;
  opacity: 0.7;
  font-size: 13px;

  .icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
  }
`;

export const EnvironmentsView: React.FC = () => {
  const { environments } = useAppSelector((state) => state.sidebar);

  return (
    <ViewContainer>
      <EmptyState>
        <div className="icon">🌍</div>
        <div>Environments</div>
        <div style={{ fontSize: '12px', marginTop: '8px' }}>{environments.length} environment(s)</div>
      </EmptyState>
    </ViewContainer>
  );
};
