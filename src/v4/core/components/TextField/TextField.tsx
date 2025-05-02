import React from 'react';
import clsx from 'clsx';
import {
  TextField as $TextField,
  TextFieldProps as $TextFieldProps,
  Label,
  FieldError,
  Input as $Input,
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
  return (
    <$TextArea
      aria-multiline
      className={clsx(styles.textField__input, className)}
      style={{ fontSize: '16px' }} // Adding minimum font-size of 16px to prevent auto zoom on mobile
      {...props}
      ref={ref}
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
