import React, { useState } from 'react';
import * as S from './ResponsePane.styles';
import type { AssertionResult } from '../../../types/flow-test.types';

export type ResponseTab = 'Body' | 'Headers' | 'Cookies' | 'Console' | 'cURL' | 'Assertions';

export interface ResponseData {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  size: number;
  time: number;
  cookies?: Array<{ name: string; value: string; domain: string }>;

  // Flow Test Engine execution data
  curlCommand?: string;
  consoleLogs?: Array<{
    timestamp: string;
    level: 'info' | 'warn' | 'error' | 'debug';
    message: string;
    source?: 'pre-hook' | 'post-hook' | 'assertion' | 'system';
  }>;
  assertionResults?: AssertionResult[];
  capturedVariables?: Record<string, unknown>;

  // Legacy fields (to be removed)
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
  const [isPrettified, setIsPrettified] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

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

  const formatJSON = (json: string, prettify: boolean = true): string => {
    try {
      const parsed = JSON.parse(json);
      return prettify ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed);
    } catch {
      return json;
    }
  };

  const formatXML = (xml: string, prettify: boolean = true): string => {
    if (!prettify) {
      return xml.replace(/>\s+</g, '><').trim();
    }

    try {
      const PADDING = '  ';
      const reg = /(>)(<)(\/*)/g;
      let formatted = xml.replace(reg, '$1\n$2$3');
      let pad = 0;

      formatted = formatted
        .split('\n')
        .map((line) => {
          let indent = 0;
          if (line.match(/.+<\/\w[^>]*>$/)) {
            indent = 0;
          } else if (line.match(/^<\/\w/)) {
            if (pad !== 0) {
              pad -= 1;
            }
          } else if (line.match(/^<\w[^>]*[^/]>.*$/)) {
            indent = 1;
          } else {
            indent = 0;
          }

          const padding = PADDING.repeat(pad);
          pad += indent;

          return padding + line;
        })
        .join('\n');

      return formatted;
    } catch {
      return xml;
    }
  };

  const handleCopyToClipboard = async () => {
    if (!response) return;
    try {
      await navigator.clipboard.writeText(response.body);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const togglePrettify = () => {
    setIsPrettified(!isPrettified);
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
    let displayContent = response.body;

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

    // Pretty view - apply formatting based on content type and prettify state
    if (isPrettified) {
      if (isJSON(contentType)) {
        displayContent = formatJSON(response.body, true);
      } else if (isXML(contentType)) {
        displayContent = formatXML(response.body, true);
      }
    } else {
      // Minified view
      if (isJSON(contentType)) {
        displayContent = formatJSON(response.body, false);
      } else if (isXML(contentType)) {
        displayContent = formatXML(response.body, false);
      }
    }

    return <S.CodeBlock>{displayContent}</S.CodeBlock>;
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
                {bodyViewType === 'pretty' &&
                  (isJSON(getContentType(response.headers)) || isXML(getContentType(response.headers))) && (
                    <button
                      onClick={togglePrettify}
                      title={isPrettified ? 'Minify' : 'Prettify'}
                      style={{
                        fontWeight: 600,
                        color: isPrettified ? '#27ae60' : '#e67e22',
                      }}
                    >
                      {isPrettified ? '⚡ Minify' : '✨ Prettify'}
                    </button>
                  )}
                <button onClick={handleCopyToClipboard} style={{ fontWeight: copySuccess ? 600 : 400 }}>
                  {copySuccess ? '✓ Copied!' : '📋 Copy'}
                </button>
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

      case 'Console':
        return (
          <div>
            {response.consoleLogs && response.consoleLogs.length > 0 ? (
              <div style={{ padding: '12px', fontFamily: 'Monaco, Menlo, monospace', fontSize: '12px' }}>
                {response.consoleLogs.map((log, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '8px 12px',
                      marginBottom: '4px',
                      borderLeft: `3px solid ${
                        log.level === 'error'
                          ? '#e74c3c'
                          : log.level === 'warn'
                            ? '#f39c12'
                            : log.level === 'debug'
                              ? '#95a5a6'
                              : '#3498db'
                      }`,
                      backgroundColor: 'rgba(0, 0, 0, 0.02)',
                      borderRadius: '2px',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'baseline' }}>
                      <span style={{ opacity: 0.6, fontSize: '11px' }}>{log.timestamp}</span>
                      <span
                        style={{
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          fontSize: '10px',
                          color:
                            log.level === 'error'
                              ? '#e74c3c'
                              : log.level === 'warn'
                                ? '#f39c12'
                                : log.level === 'debug'
                                  ? '#95a5a6'
                                  : '#3498db',
                        }}
                      >
                        {log.level}
                      </span>
                      {log.source && <span style={{ opacity: 0.5, fontSize: '11px' }}>[{log.source}]</span>}
                    </div>
                    <div style={{ marginTop: '4px' }}>{log.message}</div>
                  </div>
                ))}
              </div>
            ) : (
              <S.EmptyState>
                <div className="icon">📝</div>
                <p>No console logs available</p>
                <small style={{ opacity: 0.7, marginTop: '8px' }}>
                  Logs from hooks, validations, and custom scripts will appear here
                </small>
              </S.EmptyState>
            )}
          </div>
        );

      case 'cURL':
        return (
          <div style={{ padding: '16px' }}>
            {response.curlCommand ? (
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                  }}
                >
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>cURL Command</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(response.curlCommand || '');
                      // TODO: Show toast notification
                    }}
                    style={{
                      padding: '6px 12px',
                      background: '#007acc',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    📋 Copy to Clipboard
                  </button>
                </div>
                <pre
                  style={{
                    padding: '16px',
                    background: 'rgba(0, 0, 0, 0.05)',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontFamily: 'Monaco, Menlo, monospace',
                    overflow: 'auto',
                    lineHeight: '1.6',
                  }}
                >
                  {response.curlCommand}
                </pre>
              </div>
            ) : (
              <S.EmptyState>
                <div className="icon">⚡</div>
                <p>No cURL command available</p>
                <small style={{ opacity: 0.7, marginTop: '8px' }}>
                  Send a request to generate the equivalent cURL command
                </small>
              </S.EmptyState>
            )}
          </div>
        );

      case 'Assertions':
        return (
          <div>
            {response.assertionResults && response.assertionResults.length > 0 ? (
              <div style={{ padding: '16px' }}>
                {response.assertionResults.map((result, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px',
                      marginBottom: '12px',
                      borderRadius: '6px',
                      border: `1px solid ${result.passed ? '#27ae60' : '#e74c3c'}`,
                      backgroundColor: result.passed ? 'rgba(39, 174, 96, 0.05)' : 'rgba(231, 76, 60, 0.05)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <span style={{ fontSize: '20px', flexShrink: 0 }}>{result.passed ? '✓' : '✗'}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>{result.path}</div>
                        <div style={{ fontSize: '12px', opacity: 0.8 }}>{result.message}</div>
                        {!result.passed && result.expected !== undefined && result.actual !== undefined && (
                          <div style={{ marginTop: '8px', fontSize: '12px', fontFamily: 'Monaco, Menlo, monospace' }}>
                            <div style={{ opacity: 0.7 }}>
                              <strong>Expected:</strong> {JSON.stringify(result.expected)}
                            </div>
                            <div style={{ opacity: 0.7, marginTop: '4px' }}>
                              <strong>Actual:</strong> {JSON.stringify(result.actual)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <S.EmptyState>
                <div className="icon">✓</div>
                <p>No assertion results available</p>
                <small style={{ opacity: 0.7, marginTop: '8px' }}>
                  Add assertions in the Request panel and send a request to see results
                </small>
              </S.EmptyState>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const tabs: ResponseTab[] = ['Body', 'Headers', 'Cookies', 'Console', 'cURL', 'Assertions'];

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
