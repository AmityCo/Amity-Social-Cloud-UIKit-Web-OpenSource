import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import styles from './UnderlineInput.module.css';
import { TextArea, Label, TextField } from 'react-aria-components';
import { Typography } from '~/v4/core/components';
import { Title } from '~/v4/social/internal-components/Title';
import clsx from 'clsx';

// TODO: move this component to core component

export type UnderlineInputProps = {
  pageId?: string;
  componentId?: string;
  elementId?: string;
  label?: string;
  name?: string;
  optional?: boolean;
  maxLength?: number;
  value?: string;
  disabled?: boolean;
  showCounter?: boolean;
  isError?: boolean;
  helperText?: string;
  required?: boolean;
  placeholder?: string;
  placeholderClassName?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export const UnderlineInput = forwardRef(function (
  {
    pageId = '*',
    componentId = '*',
    elementId = '*',
    name,
    label,
    optional = false,
    maxLength,
    value,
    disabled = false,
    showCounter = false,
    isError = false,
    helperText,
    required = false,
    placeholder = '',
    placeholderClassName = '',
    onChange,
    ...props
  }: UnderlineInputProps,
  ref: React.Ref<HTMLTextAreaElement>,
) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => textareaRef.current!);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <TextField name={name} className={styles.underlineInput}>
      <Label className={styles.underlineInput__label}>
        <div>
          <Title
            pageId={pageId}
            componentId={componentId}
            elementId={elementId}
            titleClassName={styles.underlineInput__labelText}
            labelText={label}
            required={required}
          />
          {optional && (
            <Typography.Caption className={styles.underlineInput__optional}>
              {' (Optional)'}
            </Typography.Caption>
          )}
        </div>
        {showCounter && (
          <Typography.Caption className={styles.underlineInput__counter}>
            {value?.length}/{maxLength}
          </Typography.Caption>
        )}
      </Label>
      <TextArea
        ref={ref}
        rows={1}
        maxLength={maxLength}
        value={value}
        onChange={handleTextareaChange}
        className={clsx(styles.underlineInput__value, placeholderClassName)}
        data-error={isError}
        disabled={disabled}
        placeholder={placeholder}
        {...props}
      />
      {helperText && (
        <Typography.Caption className={styles.underlineInput__helperText} data-error={isError}>
          {helperText}
        </Typography.Caption>
      )}
    </TextField>
  );
});
