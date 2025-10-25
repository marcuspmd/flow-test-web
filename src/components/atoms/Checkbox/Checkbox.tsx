import React, { InputHTMLAttributes, forwardRef } from 'react';
import styled from 'styled-components';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  helperText?: string;
  error?: string;
}

const CheckboxWrapper = styled.div`
  display: inline-flex;
  align-items: flex-start;
  gap: 0.5rem;
`;

const CheckboxInput = styled.input`
  width: 1.125rem;
  height: 1.125rem;
  margin-top: 0.125rem;
  border: 1px solid ${(props) => props.theme['layout-border']};
  border-radius: 0.25rem;
  cursor: pointer;
  appearance: none;
  background-color: ${(props) => props.theme['primary-theme']};
  transition: all 0.2s;
  position: relative;

  &:checked {
    background-color: ${(props) => props.theme.brand};
    border-color: ${(props) => props.theme.brand};

    &::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 0.375rem;
      height: 0.625rem;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: translate(-50%, -60%) rotate(45deg);
    }
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(84, 109, 229, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Label = styled.label<{ disabled?: boolean }>`
  font-size: 0.875rem;
  color: ${(props) => props.theme['primary-text']};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  user-select: none;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const HelperText = styled.span<{ isError?: boolean }>`
  font-size: 0.75rem;
  color: ${(props) => (props.isError ? props.theme['text-danger'] : props.theme['secondary-text'])};
`;

/**
 * Checkbox component with label and helper text
 *
 * @example
 * <Checkbox label="Accept terms and conditions" />
 * <Checkbox label="Remember me" checked />
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, helperText, error, id, className, disabled, ...props }, ref) => {
    const inputId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <CheckboxWrapper className={className}>
        <CheckboxInput ref={ref} type="checkbox" id={inputId} disabled={disabled} {...props} />
        {label && (
          <Label htmlFor={inputId} disabled={disabled}>
            <span>{label}</span>
            {error && <HelperText isError>{error}</HelperText>}
            {!error && helperText && <HelperText>{helperText}</HelperText>}
          </Label>
        )}
      </CheckboxWrapper>
    );
  }
);

Checkbox.displayName = 'Checkbox';
