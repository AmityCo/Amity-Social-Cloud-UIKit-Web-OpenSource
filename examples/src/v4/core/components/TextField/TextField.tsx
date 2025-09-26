import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import {
  TextField as $TextField,
  TextFieldProps as $TextFieldProps,
  Label,
  FieldError,
  TextArea as $TextArea,
} from 'react-aria-components';
import type { ValidationResult } from 'react-aria-components';
import { Typography } from '~/v4/core/components/Typography';
import styles from './TextField.module.css';

export interface TextFieldProps extends $TextFieldProps {
  labelClassName?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  label?: string | React.ReactNode;
  description?: string | React.ReactNode;
  descriptionClassName?: string;
  errorClassName?: string;
  isError?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  isReadOnly?: boolean;
  isShowCounter?: boolean;
  maxLength?: number;
  minLength?: number;
  counter?: (value: string) => string;
  value?: string;
  className?: string;
  children?: React.ReactNode;
}

export const TextArea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Combine forwarded ref with internal ref
  const setRefs = (element: HTMLTextAreaElement | null) => {
    textareaRef.current = element;

    // Handle forwarded ref
    if (typeof ref === 'function') {
      ref(element);
    } else if (ref) {
      ref.current = element;
    }
  };

  // Function to adjust height based on content
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height first to get the correct scrollHeight
    textarea.style.height = '3rem';
    // Set the height to match the content
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  // Adjust height on content change
  useEffect(() => {
    adjustHeight();
    // Add event listener for dynamic adjustments (e.g. window resize)
    window.addEventListener('resize', adjustHeight);

    return () => {
      window.removeEventListener('resize', adjustHeight);
    };
  }, []);

  // Handle input changes
  const handleInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
    adjustHeight();

    // Call the original onInput handler if provided
    if (props.onInput) {
      props.onInput(event);
    }
  };

  return (
    <$TextArea
      aria-multiline
      className={clsx(styles.textField__input, className)}
      onInput={handleInput}
      ref={setRefs}
      {...props}
    />
  );
});

export function TextField({
  labelClassName,
  errorMessage,
  label,
  description,
  descriptionClassName,
  errorClassName,
  isError,
  isDisabled,
  isRequired,
  isReadOnly,
  isShowCounter,
  maxLength,
  minLength,
  counter,
  value = '',
  className,
  children,
  ...props
}: TextFieldProps) {
  return (
    <$TextField
      {...props}
      className={clsx(
        styles.textField,
        isError && styles.textField__error,
        isDisabled && styles.textField__disabled,
        isReadOnly && styles.textField__readonly,
        className,
      )}
      isDisabled={isDisabled}
      isRequired={isRequired}
      isReadOnly={isReadOnly}
    >
      <div className={styles.textField__labelWrapper}>
        <div className={styles.textField__label}>
          {label && (
            <Label className={labelClassName}>
              <Typography.TitleBold>{label}</Typography.TitleBold>
            </Label>
          )}
          {!isRequired && (
            <Typography.Caption className={clsx(styles.textField__optional, descriptionClassName)}>
              {description}
            </Typography.Caption>
          )}
        </div>

        {isShowCounter && maxLength && (
          <Typography.Caption className={styles.textField__counter}>
            {counter ? counter(value) : `${value.length}/${maxLength}`}
          </Typography.Caption>
        )}
      </div>

      {children}

      {errorMessage && <FieldError className={errorClassName}>{errorMessage}</FieldError>}
    </$TextField>
  );
}
