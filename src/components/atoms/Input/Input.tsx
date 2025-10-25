import React, { InputHTMLAttributes, forwardRef } from 'react';
import styled, { css } from 'styled-components';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'error' | 'success';
  fullWidth?: boolean;
  error?: string;
  helperText?: string;
  label?: string;
}

interface StyledInputProps {
  variant: 'default' | 'error' | 'success';
  fullWidth?: boolean;
  hasError?: boolean;
}

const InputWrapper = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: ${(props) => (props.fullWidth ? '100%' : 'auto')};
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(props) => props.theme['primary-text']};
  margin-bottom: 0.25rem;
`;

const StyledInput = styled.input<StyledInputProps>`
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  border: 1px solid ${(props) => props.theme['layout-border']};
  background-color: ${(props) => props.theme['primary-theme']};
  color: ${(props) => props.theme['primary-text']};
  transition: all 0.2s;
  width: ${(props) => (props.fullWidth ? '100%' : 'auto')};

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.brand};
    box-shadow: 0 0 0 3px rgba(84, 109, 229, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: ${(props) => props.theme['sidebar-background']};
  }

  ${(props) =>
    props.variant === 'error' &&
    css`
      border-color: ${props.theme['text-danger']};

      &:focus {
        border-color: ${props.theme['text-danger']};
        box-shadow: 0 0 0 3px rgba(185, 28, 28, 0.1);
      }
    `}

  ${(props) =>
    props.variant === 'success' &&
    css`
      border-color: ${props.theme['method-get']};

      &:focus {
        border-color: ${props.theme['method-get']};
        box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
      }
    `}

  &::placeholder {
    color: ${(props) => props.theme['secondary-text']};
  }
`;

const HelperText = styled.span<{ isError?: boolean }>`
  font-size: 0.75rem;
  color: ${(props) => (props.isError ? props.theme['text-danger'] : props.theme['secondary-text'])};
  margin-top: 0.25rem;
`;

/**
 * Input component with label, error states, and helper text
 *
 * @example
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="Enter your email"
 *   error="Invalid email address"
 * />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = 'default', fullWidth = false, error, helperText, label, id, className, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;
    const finalVariant = error ? 'error' : variant;

    return (
      <InputWrapper fullWidth={fullWidth} className={className}>
        {label && <Label htmlFor={inputId}>{label}</Label>}
        <StyledInput
          ref={ref}
          id={inputId}
          variant={finalVariant}
          fullWidth={fullWidth}
          hasError={!!error}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          {...props}
        />
        {error && (
          <HelperText id={errorId} isError role="alert">
            {error}
          </HelperText>
        )}
        {!error && helperText && <HelperText id={helperId}>{helperText}</HelperText>}
      </InputWrapper>
    );
  }
);

Input.displayName = 'Input';
