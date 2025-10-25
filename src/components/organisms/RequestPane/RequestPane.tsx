import React, { useState } from 'react';
import * as S from './RequestPane.styles';
import { KeyValueEditor, KeyValuePair } from './KeyValueEditor';
import { CodeEditor } from '../CodeEditor';
import { AssertionsPanel } from './AssertionsPanel';
import { HooksEditor } from './HooksEditor';
import { ImportExportModal } from './ImportExportModal';
import type { Assertions, HookAction, CertificateConfig, TLSVersion } from '../../../types/flow-test.types';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export type RequestTab = 'Params' | 'Headers' | 'Body' | 'Auth' | 'Assertions' | 'Pre-Hooks' | 'Post-Hooks';

export interface RequestData {
  method: HttpMethod;
  url: string;
  params: KeyValuePair[];
  headers: KeyValuePair[];
  body: {
    type: 'none' | 'json' | 'xml' | 'text' | 'form-data' | 'form-urlencoded' | 'yaml';
    content: string;
    formData?: KeyValuePair[];
  };
  auth: {
    type: 'none' | 'basic' | 'bearer' | 'api-key' | 'client-cert';
    config: Record<string, string>;
  };
  // New fields for flow-test-engine integration
  assertions?: Assertions;
  pre_hooks?: HookAction[];
  post_hooks?: HookAction[];
  certificate?: CertificateConfig;
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
  const [showImportExport, setShowImportExport] = useState<'import' | 'export' | null>(null);

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
            <div style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
              <S.MethodSelect
                value={request.body.type}
                onChange={(e) => handleBodyTypeChange(e.target.value as RequestData['body']['type'])}
                style={{ flex: 1 }}
              >
                <option value="none">None</option>
                <option value="json">JSON</option>
                <option value="yaml">YAML</option>
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
                language={
                  request.body.type === 'json'
                    ? 'json'
                    : request.body.type === 'yaml'
                      ? 'yaml'
                      : request.body.type === 'xml'
                        ? 'xml'
                        : 'plaintext'
                }
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
                <option value="client-cert">Client Certificate (mTLS)</option>
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

            {request.auth.type === 'client-cert' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Certificate Files Section */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Certificate Files</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Client Certificate Path */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', color: '#666' }}>
                        Client Certificate (.crt, .pem)
                      </label>
                      <S.Input
                        type="text"
                        placeholder="/path/to/client.crt or {{$env.CERT_PATH}}"
                        value={request.certificate?.cert_path || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          onChange({
                            ...request,
                            certificate: { ...request.certificate, cert_path: e.target.value },
                          })
                        }
                      />
                    </div>

                    {/* Private Key Path */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', color: '#666' }}>
                        Private Key (.key, .pem)
                      </label>
                      <S.Input
                        type="text"
                        placeholder="/path/to/private.key or {{$env.KEY_PATH}}"
                        value={request.certificate?.key_path || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          onChange({
                            ...request,
                            certificate: { ...request.certificate, key_path: e.target.value },
                          })
                        }
                      />
                    </div>

                    {/* PFX/P12 Path (alternative) */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', color: '#666' }}>
                        PFX/P12 Bundle (alternative to cert + key)
                      </label>
                      <S.Input
                        type="text"
                        placeholder="/path/to/certificate.pfx or {{$env.PFX_PATH}}"
                        value={request.certificate?.pfx_path || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          onChange({
                            ...request,
                            certificate: { ...request.certificate, pfx_path: e.target.value },
                          })
                        }
                      />
                    </div>

                    {/* Passphrase */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', color: '#666' }}>
                        Passphrase (optional)
                      </label>
                      <S.Input
                        type="password"
                        placeholder="Enter passphrase or {{$env.CERT_PASSPHRASE}}"
                        value={request.certificate?.passphrase || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          onChange({
                            ...request,
                            certificate: { ...request.certificate, passphrase: e.target.value },
                          })
                        }
                      />
                    </div>

                    {/* CA Certificate Path */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', color: '#666' }}>
                        CA Certificate (optional)
                      </label>
                      <S.Input
                        type="text"
                        placeholder="/path/to/ca.crt or {{$env.CA_PATH}}"
                        value={request.certificate?.ca_path || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          onChange({
                            ...request,
                            certificate: { ...request.certificate, ca_path: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* SSL Verification */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={request.certificate?.verify !== false} // default true
                      onChange={(e) =>
                        onChange({
                          ...request,
                          certificate: { ...request.certificate, verify: e.target.checked },
                        })
                      }
                    />
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>Verify SSL Certificate</span>
                  </label>
                  <p style={{ margin: '4px 0 0 28px', fontSize: '12px', color: '#666' }}>
                    Disable for self-signed certificates (not recommended for production)
                  </p>
                </div>

                {/* TLS Version Configuration */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                    TLS Version (optional)
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {/* Min Version */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', color: '#666' }}>
                        Minimum Version
                      </label>
                      <S.MethodSelect
                        value={request.certificate?.min_version || ''}
                        onChange={(e) =>
                          onChange({
                            ...request,
                            certificate: {
                              ...request.certificate,
                              min_version: (e.target.value || undefined) as TLSVersion | undefined,
                            },
                          })
                        }
                      >
                        <option value="">Default</option>
                        <option value="TLSv1">TLS 1.0</option>
                        <option value="TLSv1.1">TLS 1.1</option>
                        <option value="TLSv1.2">TLS 1.2</option>
                        <option value="TLSv1.3">TLS 1.3</option>
                      </S.MethodSelect>
                    </div>

                    {/* Max Version */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', color: '#666' }}>
                        Maximum Version
                      </label>
                      <S.MethodSelect
                        value={request.certificate?.max_version || ''}
                        onChange={(e) =>
                          onChange({
                            ...request,
                            certificate: {
                              ...request.certificate,
                              max_version: (e.target.value || undefined) as TLSVersion | undefined,
                            },
                          })
                        }
                      >
                        <option value="">Default</option>
                        <option value="TLSv1">TLS 1.0</option>
                        <option value="TLSv1.1">TLS 1.1</option>
                        <option value="TLSv1.2">TLS 1.2</option>
                        <option value="TLSv1.3">TLS 1.3</option>
                      </S.MethodSelect>
                    </div>
                  </div>
                </div>

                {/* Info Box */}
                <div
                  style={{
                    padding: '12px',
                    backgroundColor: '#f0f7ff',
                    borderLeft: '3px solid #0066cc',
                    borderRadius: '4px',
                    fontSize: '13px',
                    color: '#333',
                  }}
                >
                  <strong>💡 mTLS Configuration</strong>
                  <ul style={{ margin: '8px 0 0', paddingLeft: '20px' }}>
                    <li>
                      Use <strong>cert_path + key_path</strong> for separate certificate and key files
                    </li>
                    <li>
                      Or use <strong>pfx_path</strong> for a combined PFX/P12 bundle
                    </li>
                    <li>
                      Environment variables are supported: <code>{'{{$env.VAR_NAME}}'}</code>
                    </li>
                    <li>CA certificate is only needed for custom certificate authorities</li>
                  </ul>
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

      case 'Assertions':
        return (
          <AssertionsPanel
            assertions={request.assertions || {}}
            onChange={(assertions) => onChange({ ...request, assertions })}
          />
        );

      case 'Pre-Hooks':
        return (
          <HooksEditor
            hooks={request.pre_hooks || []}
            onChange={(pre_hooks) => onChange({ ...request, pre_hooks })}
            hookType="pre"
          />
        );

      case 'Post-Hooks':
        return (
          <HooksEditor
            hooks={request.post_hooks || []}
            onChange={(post_hooks) => onChange({ ...request, post_hooks })}
            hookType="post"
          />
        );

      default:
        return null;
    }
  };

  const tabs: RequestTab[] = ['Params', 'Headers', 'Body', 'Auth', 'Assertions', 'Pre-Hooks', 'Post-Hooks'];

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

        <S.SaveButton onClick={() => setShowImportExport('import')} title="Import from cURL or YAML">
          📥 Import
        </S.SaveButton>

        <S.SaveButton onClick={() => setShowImportExport('export')} title="Export to cURL or YAML">
          📤 Export
        </S.SaveButton>
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

      {showImportExport && (
        <ImportExportModal
          mode={showImportExport}
          currentRequest={request}
          onClose={() => setShowImportExport(null)}
          onImport={(importedRequest) => {
            onChange(importedRequest);
            setShowImportExport(null);
          }}
        />
      )}
    </S.RequestPaneWrapper>
  );
};
