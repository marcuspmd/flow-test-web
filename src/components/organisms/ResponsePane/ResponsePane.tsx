import React, { useState } from 'react';
import * as S from './ResponsePane.styles';

export type ResponseTab = 'Body' | 'Headers' | 'Cookies' | 'Timeline' | 'Tests';

export interface ResponseData {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  size: number;
  time: number;
  cookies?: Array<{ name: string; value: string; domain: string }>;
  timeline?: Array<{
    name: string;
    duration: number;
    details?: string;
  }>;
  tests?: Array<{
    name: string;
    passed: boolean;
    message?: string;
  }>;
}

interface ResponsePaneProps {
  response: ResponseData | null;
  isLoading?: boolean;
}

type BodyViewType = 'pretty' | 'raw' | 'preview';

export const ResponsePane: React.FC<ResponsePaneProps> = ({ response, isLoading = false }) => {
  const [activeTab, setActiveTab] = useState<ResponseTab>('Body');
  const [bodyViewType, setBodyViewType] = useState<BodyViewType>('pretty');
  const [searchTerm, setSearchTerm] = useState('');

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatTime = (ms: number): string => {
    if (ms < 1000) return `${Math.round(ms)} ms`;
    return `${(ms / 1000).toFixed(2)} s`;
  };

  const getStatusType = (status: number): 'success' | 'error' | 'info' => {
    if (status >= 200 && status < 300) return 'success';
    if (status >= 400) return 'error';
    return 'info';
  };

  const formatJSON = (json: string): string => {
    try {
      return JSON.stringify(JSON.parse(json), null, 2);
    } catch {
      return json;
    }
  };

  const getContentType = (headers: Record<string, string>): string => {
    const contentType = Object.entries(headers).find(([key]) => key.toLowerCase() === 'content-type');
    return contentType ? contentType[1] : '';
  };

  const isJSON = (contentType: string): boolean => {
    return contentType.includes('application/json') || contentType.includes('application/vnd.api+json');
  };

  const isXML = (contentType: string): boolean => {
    return contentType.includes('application/xml') || contentType.includes('text/xml');
  };

  const isHTML = (contentType: string): boolean => {
    return contentType.includes('text/html');
  };

  const renderBodyContent = () => {
    if (!response) return null;

    const contentType = getContentType(response.headers);

    if (bodyViewType === 'raw') {
      return <S.CodeBlock>{response.body}</S.CodeBlock>;
    }

    if (bodyViewType === 'preview' && isHTML(contentType)) {
      return (
        <div style={{ padding: '16px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '4px' }}>
          <iframe
            srcDoc={response.body}
            style={{ width: '100%', height: '400px', border: 'none' }}
            title="HTML Preview"
          />
        </div>
      );
    }

    // Pretty view
    if (isJSON(contentType)) {
      return <S.CodeBlock>{formatJSON(response.body)}</S.CodeBlock>;
    }

    if (isXML(contentType) || isHTML(contentType)) {
      return <S.CodeBlock>{response.body}</S.CodeBlock>;
    }

    return <S.CodeBlock>{response.body}</S.CodeBlock>;
  };

  const renderTabContent = () => {
    if (!response) {
      return (
        <S.EmptyState>
          <div className="icon">📭</div>
          <p>No response yet</p>
          <p className="subtitle">Send a request to see the response</p>
        </S.EmptyState>
      );
    }

    switch (activeTab) {
      case 'Body':
        return (
          <S.BodyContent>
            <S.BodyToolbar>
              <S.BodyTypeSelector>
                <button className={bodyViewType === 'pretty' ? 'active' : ''} onClick={() => setBodyViewType('pretty')}>
                  Pretty
                </button>
                <button className={bodyViewType === 'raw' ? 'active' : ''} onClick={() => setBodyViewType('raw')}>
                  Raw
                </button>
                {isHTML(getContentType(response.headers)) && (
                  <button
                    className={bodyViewType === 'preview' ? 'active' : ''}
                    onClick={() => setBodyViewType('preview')}
                  >
                    Preview
                  </button>
                )}
              </S.BodyTypeSelector>

              <S.BodyActions>
                <button onClick={() => navigator.clipboard.writeText(response.body)}>📋 Copy</button>
                <button
                  onClick={() => {
                    const blob = new Blob([response.body], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'response.txt';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  💾 Save
                </button>
              </S.BodyActions>
            </S.BodyToolbar>

            {renderBodyContent()}
          </S.BodyContent>
        );

      case 'Headers': {
        const headers = Object.entries(response.headers).filter(([key, value]) => {
          if (!searchTerm) return true;
          return (
            key.toLowerCase().includes(searchTerm.toLowerCase()) ||
            value.toLowerCase().includes(searchTerm.toLowerCase())
          );
        });

        return (
          <div>
            <S.SearchBox>
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search headers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </S.SearchBox>
            <S.HeadersTable>
              <thead>
                <tr>
                  <th>Header</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {headers.length > 0 ? (
                  headers.map(([key, value]) => (
                    <tr key={key}>
                      <td className="header-name">{key}</td>
                      <td className="header-value">{value}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} style={{ textAlign: 'center', padding: '20px' }}>
                      No headers found
                    </td>
                  </tr>
                )}
              </tbody>
            </S.HeadersTable>
          </div>
        );
      }

      case 'Cookies':
        return (
          <div>
            {response.cookies && response.cookies.length > 0 ? (
              <S.HeadersTable>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Value</th>
                    <th>Domain</th>
                  </tr>
                </thead>
                <tbody>
                  {response.cookies.map((cookie, idx) => (
                    <tr key={idx}>
                      <td className="header-name">{cookie.name}</td>
                      <td className="header-value">{cookie.value}</td>
                      <td>{cookie.domain}</td>
                    </tr>
                  ))}
                </tbody>
              </S.HeadersTable>
            ) : (
              <S.EmptyState>
                <div className="icon">🍪</div>
                <p>No cookies in this response</p>
              </S.EmptyState>
            )}
          </div>
        );

      case 'Timeline':
        return (
          <div>
            {response.timeline && response.timeline.length > 0 ? (
              response.timeline.map((item, idx) => (
                <S.TimelineItem key={idx}>
                  <div className="timeline-header">
                    <span className="timeline-title">{item.name}</span>
                    <span className="timeline-duration">{formatTime(item.duration)}</span>
                  </div>
                  {item.details && <div className="timeline-details">{item.details}</div>}
                </S.TimelineItem>
              ))
            ) : (
              <S.EmptyState>
                <div className="icon">⏱️</div>
                <p>No timeline data available</p>
              </S.EmptyState>
            )}
          </div>
        );

      case 'Tests':
        return (
          <div>
            {response.tests && response.tests.length > 0 ? (
              <div style={{ padding: '16px' }}>
                {response.tests.map((test, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px',
                      marginBottom: '8px',
                      borderRadius: '4px',
                      border: '1px solid rgba(0,0,0,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>{test.passed ? '✅' : '❌'}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '13px' }}>{test.name}</div>
                      {test.message && (
                        <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.7 }}>{test.message}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <S.EmptyState>
                <div className="icon">✓</div>
                <p>No test results available</p>
              </S.EmptyState>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const tabs: ResponseTab[] = ['Body', 'Headers', 'Cookies', 'Timeline', 'Tests'];

  if (isLoading) {
    return (
      <S.ResponsePaneWrapper>
        <S.EmptyState>
          <div className="icon">⏳</div>
          <p>Sending request...</p>
        </S.EmptyState>
      </S.ResponsePaneWrapper>
    );
  }

  return (
    <S.ResponsePaneWrapper>
      {response && (
        <S.ResponseHeader>
          <S.StatusSection>
            <S.StatusBadge $status={getStatusType(response.status)}>
              {response.status} {response.statusText}
            </S.StatusBadge>
          </S.StatusSection>

          <S.MetaInfo>
            <div className="meta-item">
              <span className="label">Time:</span>
              <span className="value">{formatTime(response.time)}</span>
            </div>
            <div className="meta-item">
              <span className="label">Size:</span>
              <span className="value">{formatBytes(response.size)}</span>
            </div>
          </S.MetaInfo>
        </S.ResponseHeader>
      )}

      <S.TabsContainer>
        {tabs.map((tab) => (
          <S.Tab key={tab} $active={activeTab === tab} onClick={() => setActiveTab(tab)}>
            {tab}
            {tab === 'Headers' && response && (
              <span style={{ marginLeft: '4px', opacity: 0.6 }}>({Object.keys(response.headers).length})</span>
            )}
            {tab === 'Cookies' && response?.cookies && (
              <span style={{ marginLeft: '4px', opacity: 0.6 }}>({response.cookies.length})</span>
            )}
          </S.Tab>
        ))}
      </S.TabsContainer>

      <S.TabContent>{renderTabContent()}</S.TabContent>
    </S.ResponsePaneWrapper>
  );
};
