import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as S from './EnvironmentManager.styles';
import {
  EnvironmentVariable,
  createEnvironment,
  updateEnvironment,
  deleteEnvironment,
  duplicateEnvironment,
  addVariable,
  updateVariable,
  deleteVariable,
  addGlobalVariable,
  updateGlobalVariable,
  deleteGlobalVariable,
} from '../../../store/slices/apiEnvironmentsSlice';
import { RootState } from '../../../store';

interface EnvironmentManagerProps {
  onClose: () => void;
}

export const EnvironmentManager: React.FC<EnvironmentManagerProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const { environments, globalVariables } = useSelector((state: RootState) => state.apiEnvironments);

  const [selectedEnvironmentId, setSelectedEnvironmentId] = useState<string | null>(environments[0]?.id || null);
  const [viewingGlobal, setViewingGlobal] = useState(false);

  const selectedEnvironment = environments.find((e) => e.id === selectedEnvironmentId);

  const handleCreateEnvironment = () => {
    const name = prompt('Environment name:');
    if (name) {
      dispatch(createEnvironment({ name }));
    }
  };

  const handleRenameEnvironment = (id: string, currentName: string) => {
    const name = prompt('New name:', currentName);
    if (name && name !== currentName) {
      dispatch(updateEnvironment({ id, name }));
    }
  };

  const handleDeleteEnvironment = (id: string) => {
    if (confirm('Delete this environment?')) {
      dispatch(deleteEnvironment(id));
      if (selectedEnvironmentId === id) {
        setSelectedEnvironmentId(environments[0]?.id || null);
      }
    }
  };

  const handleDuplicateEnvironment = (id: string) => {
    dispatch(duplicateEnvironment(id));
  };

  const handleAddVariable = () => {
    if (viewingGlobal) {
      dispatch(addGlobalVariable({ key: '', value: '' }));
    } else if (selectedEnvironmentId) {
      dispatch(addVariable({ environmentId: selectedEnvironmentId, key: '', value: '' }));
    }
  };

  const handleUpdateVariable = (variableId: string, field: keyof EnvironmentVariable, value: string | boolean) => {
    if (viewingGlobal) {
      dispatch(updateGlobalVariable({ variableId, [field]: value }));
    } else if (selectedEnvironmentId) {
      dispatch(updateVariable({ environmentId: selectedEnvironmentId, variableId, [field]: value }));
    }
  };

  const handleDeleteVariable = (variableId: string) => {
    if (viewingGlobal) {
      dispatch(deleteGlobalVariable(variableId));
    } else if (selectedEnvironmentId) {
      dispatch(deleteVariable({ environmentId: selectedEnvironmentId, variableId }));
    }
  };

  const displayVariables = viewingGlobal ? globalVariables : selectedEnvironment?.variables || [];

  return (
    <S.EnvironmentManagerWrapper>
      <S.Header>
        <h2>Manage Environments</h2>
        <S.CloseButton onClick={onClose}>✕</S.CloseButton>
      </S.Header>

      <S.Content>
        <S.Sidebar>
          <S.SidebarHeader>
            <h3>Environments</h3>
            <S.AddButton onClick={handleCreateEnvironment}>+ New</S.AddButton>
          </S.SidebarHeader>

          <S.EnvironmentList>
            <S.GlobalVariablesItem $active={viewingGlobal} onClick={() => setViewingGlobal(true)}>
              <div className="name">
                <span>🌍</span>
                <span>Global Variables</span>
              </div>
            </S.GlobalVariablesItem>

            {environments.map((env) => (
              <S.EnvironmentItem
                key={env.id}
                $active={!viewingGlobal && selectedEnvironmentId === env.id}
                onClick={() => {
                  setViewingGlobal(false);
                  setSelectedEnvironmentId(env.id);
                }}
              >
                <div className="name">{env.name}</div>
                <div className="actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRenameEnvironment(env.id, env.name);
                    }}
                    title="Rename"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicateEnvironment(env.id);
                    }}
                    title="Duplicate"
                  >
                    📋
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEnvironment(env.id);
                    }}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </S.EnvironmentItem>
            ))}
          </S.EnvironmentList>
        </S.Sidebar>

        <S.EditorPanel>
          {viewingGlobal || selectedEnvironment ? (
            <>
              <S.EditorHeader>
                <input
                  type="text"
                  value={viewingGlobal ? 'Global Variables' : selectedEnvironment?.name || ''}
                  onChange={(e) => {
                    if (!viewingGlobal && selectedEnvironmentId) {
                      dispatch(updateEnvironment({ id: selectedEnvironmentId, name: e.target.value }));
                    }
                  }}
                  readOnly={viewingGlobal}
                  placeholder="Environment name"
                />
              </S.EditorHeader>

              <S.VariablesTable>
                <S.TableHeader>
                  <span></span>
                  <span>Variable</span>
                  <span>Value</span>
                  <span>Secret</span>
                  <span></span>
                </S.TableHeader>

                {displayVariables.map((variable) => (
                  <S.VariableRow key={variable.id}>
                    <input
                      type="checkbox"
                      checked={variable.enabled}
                      onChange={(e) => handleUpdateVariable(variable.id, 'enabled', e.target.checked)}
                    />
                    <input
                      type="text"
                      value={variable.key}
                      onChange={(e) => handleUpdateVariable(variable.id, 'key', e.target.value)}
                      placeholder="VARIABLE_NAME"
                      disabled={!variable.enabled}
                    />
                    <input
                      type={variable.secret ? 'password' : 'text'}
                      value={variable.value}
                      onChange={(e) => handleUpdateVariable(variable.id, 'value', e.target.value)}
                      placeholder="value"
                      disabled={!variable.enabled}
                    />
                    <button
                      className={`secret-toggle ${variable.secret ? 'active' : ''}`}
                      onClick={() => handleUpdateVariable(variable.id, 'secret', !variable.secret)}
                    >
                      {variable.secret ? '👁️' : '👁️‍🗨️'}
                    </button>
                    <button className="delete-button" onClick={() => handleDeleteVariable(variable.id)}>
                      ✕
                    </button>
                  </S.VariableRow>
                ))}

                <S.AddVariableButton onClick={handleAddVariable}>+ Add Variable</S.AddVariableButton>
              </S.VariablesTable>
            </>
          ) : (
            <S.EmptyState>
              <div className="icon">📁</div>
              <p>Select an environment or create a new one</p>
            </S.EmptyState>
          )}
        </S.EditorPanel>
      </S.Content>

      <S.Footer>
        <div className="info">
          {viewingGlobal
            ? `${globalVariables.length} global variables`
            : selectedEnvironment
              ? `${selectedEnvironment.variables.length} variables`
              : ''}
        </div>
        <div className="actions">
          <S.Button onClick={onClose}>Close</S.Button>
        </div>
      </S.Footer>
    </S.EnvironmentManagerWrapper>
  );
};
