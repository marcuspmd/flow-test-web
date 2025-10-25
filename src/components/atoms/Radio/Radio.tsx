import React, { InputHTMLAttributes, forwardRef } from 'react';
import styled from 'styled-components';

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  helperText?: string;
}

const RadioWrapper = styled.div`
  display: inline-flex;
  align-items: flex-start;
  gap: 0.5rem;
`;

const RadioInput = styled.input`
  width: 1.125rem;
  height: 1.125rem;
  margin-top: 0.125rem;
  border: 1px solid ${(props) => props.theme['layout-border']};
  border-radius: 50%;
  cursor: pointer;
  appearance: none;
  background-color: ${(props) => props.theme['primary-theme']};
  transition: all 0.2s;
  position: relative;

  &:checked {
    border-color: ${(props) => props.theme.brand};

    &::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      background-color: ${(props) => props.theme.brand};
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

const HelperText = styled.span`
  font-size: 0.75rem;
  color: ${(props) => props.theme['secondary-text']};
`;

/**
 * Radio button component with label
 *
 * @example
 * <Radio name="plan" value="basic" label="Basic Plan" />
 * <Radio name="plan" value="pro" label="Pro Plan" checked />
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, helperText, id, className, disabled, ...props }, ref) => {
    const inputId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <RadioWrapper className={className}>
        <RadioInput ref={ref} type="radio" id={inputId} disabled={disabled} {...props} />
        {label && (
          <Label htmlFor={inputId} disabled={disabled}>
            <span>{label}</span>
            {helperText && <HelperText>{helperText}</HelperText>}
          </Label>
        )}
      </RadioWrapper>
    );
  }
);

Radio.displayName = 'Radio';
