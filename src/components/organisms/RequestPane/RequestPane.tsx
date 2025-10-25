import React, { useState } from 'react';
import * as S from './RequestPane.styles';
import { KeyValueEditor, KeyValuePair } from './KeyValueEditor';
import { CodeEditor } from '../CodeEditor';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export type RequestTab = 'Params' | 'Headers' | 'Body' | 'Auth' | 'Scripts' | 'Tests';

export interface RequestData {
  method: HttpMethod;
  url: string;
  params: KeyValuePair[];
  headers: KeyValuePair[];
  body: {
    type: 'none' | 'json' | 'xml' | 'text' | 'form-data' | 'form-urlencoded';
    content: string;
    formData?: KeyValuePair[];
  };
  auth: {
    type: 'none' | 'basic' | 'bearer' | 'api-key';
    config: Record<string, string>;
  };
}

interface RequestPaneProps {
  request: RequestData;
  onChange: (request: RequestData) => void;
  onSend: () => void;
  onSave?: () => void;
  isLoading?: boolean;
}

export const RequestPane: React.FC<RequestPaneProps> = ({ request, onChange, onSend, onSave, isLoading = false }) => {
  const [activeTab, setActiveTab] = useState<RequestTab>('Params');

  const handleMethodChange = (method: HttpMethod) => {
    onChange({ ...request, method });
  };

  const handleUrlChange = (url: string) => {
    onChange({ ...request, url });
  };

  const handleParamsChange = (params: KeyValuePair[]) => {
    onChange({ ...request, params });
  };

  const handleHeadersChange = (headers: KeyValuePair[]) => {
    onChange({ ...request, headers });
  };

  const handleBodyContentChange = (content: string) => {
    onChange({
      ...request,
      body: { ...request.body, content },
    });
  };

  const handleBodyTypeChange = (type: RequestData['body']['type']) => {
    onChange({
      ...request,
      body: { ...request.body, type },
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Params':
        return (
          <KeyValueEditor
            items={request.params}
            onChange={handleParamsChange}
            placeholder={{ key: 'Parameter', value: 'Value' }}
          />
        );

      case 'Headers':
        return (
          <div>
            <S.BulkEditButton>Bulk Edit</S.BulkEditButton>
            <KeyValueEditor
              items={request.headers}
              onChange={handleHeadersChange}
              placeholder={{ key: 'Header', value: 'Value' }}
            />
            <S.InfoText>
              <span className="icon">ℹ️</span>
              <span>Headers are automatically added from environment variables</span>
            </S.InfoText>
          </div>
        );

      case 'Body':
        return (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <S.MethodSelect
                value={request.body.type}
                onChange={(e) => handleBodyTypeChange(e.target.value as RequestData['body']['type'])}
              >
                <option value="none">None</option>
                <option value="json">JSON</option>
                <option value="xml">XML</option>
                <option value="text">Text</option>
                <option value="form-data">Form Data</option>
                <option value="form-urlencoded">Form URL Encoded</option>
              </S.MethodSelect>
            </div>

            {request.body.type === 'form-data' || request.body.type === 'form-urlencoded' ? (
              <KeyValueEditor
                items={request.body.formData || []}
                onChange={(formData) => onChange({ ...request, body: { ...request.body, formData } })}
                placeholder={{ key: 'Key', value: 'Value' }}
              />
            ) : request.body.type !== 'none' ? (
              <CodeEditor
                value={request.body.content}
                onChange={handleBodyContentChange}
                language={request.body.type === 'json' ? 'json' : request.body.type === 'xml' ? 'xml' : 'plaintext'}
                height="300px"
                placeholder={`Enter ${request.body.type.toUpperCase()} content here...`}
              />
            ) : (
              <S.EmptyState>
                <div className="icon">📝</div>
                <p>This request does not have a body</p>
              </S.EmptyState>
            )}
          </div>
        );

      case 'Auth':
        return (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px' }}>Type</label>
              <S.MethodSelect
                value={request.auth.type}
                onChange={(e) =>
                  onChange({
                    ...request,
                    auth: { ...request.auth, type: e.target.value as RequestData['auth']['type'] },
                  })
                }
              >
                <option value="none">No Auth</option>
                <option value="basic">Basic Auth</option>
                <option value="bearer">Bearer Token</option>
                <option value="api-key">API Key</option>
              </S.MethodSelect>
            </div>

            {request.auth.type === 'bearer' && (
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px' }}>Token</label>
                <S.UrlInput
                  type="text"
                  placeholder="Enter bearer token"
                  value={request.auth.config.token || ''}
                  onChange={(e) =>
                    onChange({
                      ...request,
                      auth: {
                        ...request.auth,
                        config: { ...request.auth.config, token: e.target.value },
                      },
                    })
                  }
                />
              </div>
            )}

            {request.auth.type === 'basic' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px' }}>Username</label>
                  <S.UrlInput
                    type="text"
                    placeholder="Enter username"
                    value={request.auth.config.username || ''}
                    onChange={(e) =>
                      onChange({
                        ...request,
                        auth: {
                          ...request.auth,
                          config: { ...request.auth.config, username: e.target.value },
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px' }}>Password</label>
                  <S.UrlInput
                    type="password"
                    placeholder="Enter password"
                    value={request.auth.config.password || ''}
                    onChange={(e) =>
                      onChange({
                        ...request,
                        auth: {
                          ...request.auth,
                          config: { ...request.auth.config, password: e.target.value },
                        },
                      })
                    }
                  />
                </div>
              </div>
            )}

            {request.auth.type === 'none' && (
              <S.EmptyState>
                <div className="icon">🔓</div>
                <p>This request does not use any authorization</p>
              </S.EmptyState>
            )}
          </div>
        );

      case 'Scripts':
        return (
          <S.EmptyState>
            <div className="icon">📜</div>
            <p>Pre-request and test scripts coming soon</p>
          </S.EmptyState>
        );

      case 'Tests':
        return (
          <S.EmptyState>
            <div className="icon">✓</div>
            <p>Test assertions coming soon</p>
          </S.EmptyState>
        );

      default:
        return null;
    }
  };

  const tabs: RequestTab[] = ['Params', 'Headers', 'Body', 'Auth', 'Scripts', 'Tests'];

  return (
    <S.RequestPaneWrapper>
      <S.RequestToolbar>
        <S.MethodSelect value={request.method} onChange={(e) => handleMethodChange(e.target.value as HttpMethod)}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
          <option value="DELETE">DELETE</option>
          <option value="HEAD">HEAD</option>
          <option value="OPTIONS">OPTIONS</option>
        </S.MethodSelect>

        <S.UrlInput
          type="text"
          placeholder="Enter request URL"
          value={request.url}
          onChange={(e) => handleUrlChange(e.target.value)}
        />

        <S.SendButton onClick={onSend} disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </S.SendButton>

        {onSave && <S.SaveButton onClick={onSave}>Save</S.SaveButton>}
      </S.RequestToolbar>

      <S.TabsContainer>
        {tabs.map((tab) => (
          <S.Tab key={tab} $active={activeTab === tab} onClick={() => setActiveTab(tab)}>
            {tab}
            {tab === 'Params' && request.params.filter((p) => p.enabled).length > 0 && (
              <span style={{ marginLeft: '4px', opacity: 0.6 }}>
                ({request.params.filter((p) => p.enabled).length})
              </span>
            )}
            {tab === 'Headers' && request.headers.filter((h) => h.enabled).length > 0 && (
              <span style={{ marginLeft: '4px', opacity: 0.6 }}>
                ({request.headers.filter((h) => h.enabled).length})
              </span>
            )}
          </S.Tab>
        ))}
      </S.TabsContainer>

      <S.TabContent>{renderTabContent()}</S.TabContent>
    </S.RequestPaneWrapper>
  );
};
