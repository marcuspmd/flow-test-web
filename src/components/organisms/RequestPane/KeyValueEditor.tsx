import React from 'react';
import * as S from './RequestPane.styles';

export interface KeyValuePair {
  id: string;
  enabled: boolean;
  key: string;
  value: string;
  description?: string;
}

interface KeyValueEditorProps {
  items: KeyValuePair[];
  onChange: (items: KeyValuePair[]) => void;
  placeholder?: {
    key: string;
    value: string;
  };
}

export const KeyValueEditor: React.FC<KeyValueEditorProps> = ({
  items,
  onChange,
  placeholder = { key: 'Key', value: 'Value' },
}) => {
  const handleAdd = () => {
    const newItem: KeyValuePair = {
      id: `${Date.now()}`,
      enabled: true,
      key: '',
      value: '',
      description: '',
    };
    onChange([...items, newItem]);
  };

  const handleRemove = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const handleUpdate = (id: string, field: keyof KeyValuePair, value: string | boolean) => {
    onChange(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  return (
    <S.KeyValueTable>
      {items.map((item) => (
        <React.Fragment key={item.id}>
          <S.KeyValueRow>
            <input
              type="checkbox"
              checked={item.enabled}
              onChange={(e) => handleUpdate(item.id, 'enabled', e.target.checked)}
            />
            <input
              type="text"
              placeholder={placeholder.key}
              value={item.key}
              onChange={(e) => handleUpdate(item.id, 'key', e.target.value)}
              disabled={!item.enabled}
            />
            <input
              type="text"
              placeholder={placeholder.value}
              value={item.value}
              onChange={(e) => handleUpdate(item.id, 'value', e.target.value)}
              disabled={!item.enabled}
            />
            <S.ActionButton onClick={() => handleRemove(item.id)} title="Remove">
              ✕
            </S.ActionButton>
          </S.KeyValueRow>
          {item.description !== undefined && (
            <S.KeyValueRow>
              <div />
              <input
                type="text"
                className="description-input"
                placeholder="Description (optional)"
                value={item.description}
                onChange={(e) => handleUpdate(item.id, 'description', e.target.value)}
                disabled={!item.enabled}
              />
            </S.KeyValueRow>
          )}
        </React.Fragment>
      ))}
      <S.AddRowButton onClick={handleAdd}>+ Add {placeholder.key}</S.AddRowButton>
    </S.KeyValueTable>
  );
};
