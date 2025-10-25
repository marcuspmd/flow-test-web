import styled from 'styled-components';

export const ResponsePaneWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${({ theme }) => theme['primary-theme']};
`;

export const ResponseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background: ${({ theme }) => theme['sidebar-background']};
  flex-shrink: 0;
  gap: 16px;
`;

export const StatusSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const StatusBadge = styled.div<{ $status: 'success' | 'error' | 'info' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;

  ${({ $status }) => {
    switch ($status) {
      case 'success':
        return `
          background: rgba(73, 204, 144, 0.1);
          color: #49cc90;
        `;
      case 'error':
        return `
          background: rgba(249, 62, 62, 0.1);
          color: #f93e3e;
        `;
      case 'info':
      default:
        return `
          background: rgba(0, 122, 204, 0.1);
          color: #007acc;
        `;
    }
  }}
`;

export const MetaInfo = styled.div`
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: ${({ theme }) => theme['secondary-text']};

  .meta-item {
    display: flex;
    align-items: center;
    gap: 4px;

    .label {
      font-weight: 500;
    }

    .value {
      font-weight: 400;
    }
  }
`;

export const TabsContainer = styled.div`
  display: flex;
  gap: 4px;
  padding: 0 16px;
  background: ${({ theme }) => theme['sidebar-background']};
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
`;

export const Tab = styled.button<{ $active: boolean }>`
  padding: 10px 16px;
  background: ${({ $active }) => ($active ? 'rgba(0, 122, 204, 0.1)' : 'transparent')};
  border: none;
  border-bottom: ${({ $active }) => ($active ? '2px solid #007acc' : '2px solid transparent')};
  color: ${({ theme, $active }) => ($active ? theme['primary-text'] : theme['secondary-text'])};
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: rgba(0, 122, 204, 0.05);
    color: ${({ theme }) => theme['primary-text']};
  }
`;

export const TabContent = styled.div`
  flex: 1;
  overflow: auto;
  background: ${({ theme }) => theme['primary-theme']};

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
  }
`;

export const BodyContent = styled.div`
  padding: 16px;
`;

export const BodyToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

export const BodyTypeSelector = styled.div`
  display: flex;
  gap: 8px;

  button {
    padding: 6px 12px;
    background: transparent;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    color: ${({ theme }) => theme['secondary-text']};
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;

    &.active {
      background: rgba(0, 122, 204, 0.1);
      border-color: #007acc;
      color: #007acc;
      font-weight: 600;
    }

    &:hover:not(.active) {
      background: rgba(0, 0, 0, 0.05);
    }
  }
`;

export const BodyActions = styled.div`
  display: flex;
  gap: 8px;

  button {
    padding: 6px 12px;
    background: transparent;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    color: ${({ theme }) => theme['primary-text']};
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: rgba(0, 122, 204, 0.1);
      border-color: #007acc;
    }
  }
`;

export const CodeBlock = styled.pre`
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 16px;
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  font-size: 12px;
  overflow-x: auto;
  margin: 0;
  line-height: 1.5;
  color: ${({ theme }) => theme['primary-text']};

  code {
    font-family: inherit;
  }
`;

export const HeadersTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  thead {
    background: ${({ theme }) => theme['sidebar-background']};
    border-bottom: 2px solid rgba(0, 0, 0, 0.1);

    th {
      text-align: left;
      padding: 10px 16px;
      font-weight: 600;
      color: ${({ theme }) => theme['primary-text']};
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);

      &:hover {
        background: rgba(0, 0, 0, 0.02);
      }

      td {
        padding: 10px 16px;
        color: ${({ theme }) => theme['primary-text']};

        &.header-name {
          font-weight: 500;
          font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
          font-size: 12px;
        }

        &.header-value {
          font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
          font-size: 12px;
          word-break: break-all;
        }
      }
    }
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 200px;
  color: ${({ theme }) => theme['secondary-text']};
  text-align: center;
  padding: 40px;

  .icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.3;
  }

  p {
    font-size: 14px;
    margin: 0;
  }

  .subtitle {
    font-size: 12px;
    margin-top: 8px;
    opacity: 0.7;
  }
`;

export const TimelineItem = styled.div`
  padding: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

  &:last-child {
    border-bottom: none;
  }

  .timeline-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    .timeline-title {
      font-size: 13px;
      font-weight: 600;
      color: ${({ theme }) => theme['primary-text']};
    }

    .timeline-duration {
      font-size: 12px;
      color: ${({ theme }) => theme['secondary-text']};
    }
  }

  .timeline-details {
    font-size: 12px;
    color: ${({ theme }) => theme['secondary-text']};
    line-height: 1.6;
  }
`;

export const SearchBox = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: relative;

  input {
    width: 100%;
    padding: 8px 12px;
    padding-left: 32px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    background: ${({ theme }) => theme['primary-theme']};
    color: ${({ theme }) => theme['primary-text']};
    font-size: 13px;

    &:focus {
      outline: none;
      border-color: #007acc;
    }

    &::placeholder {
      color: ${({ theme }) => theme['secondary-text']};
    }
  }

  .search-icon {
    position: absolute;
    left: 24px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme['secondary-text']};
    font-size: 14px;
  }
`;
