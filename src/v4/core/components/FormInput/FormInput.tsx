import clsx from 'clsx';
import { Typography } from '~/v4/core/components';
import { FormLabel } from '~/v4/core/components/FormLabel';
import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { COMPONENT_ID, ELEMENT_ID, PAGE_ID } from '~/v4/constants/customization';
import {
  TextArea,
  Label,
  TextField,
  TextFieldProps,
  TextAreaProps,
  Input,
  InputProps,
} from 'react-aria-components';
import styles from './FormInput.module.css';

type FormInputProps = Omit<TextFieldProps, 'onChange'> &
  TextAreaProps &
  InputProps & {
    label?: string;
    error?: boolean;
    optional?: boolean;
    maxLength?: number;
    helperText?: string;
    multiLine?: boolean;
    variant?: 'boxed' | 'underlined';
    pageId?: ValueOf<typeof PAGE_ID>;
    elementId?: ValueOf<typeof ELEMENT_ID>;
    componentId?: ValueOf<typeof COMPONENT_ID>;
  };

export const FormInput = forwardRef(function (
  {
    id,
    name,
    label,
    value,
    error,
    onChange,
    maxLength,
    helperText,
    className,
    multiLine = false,
    optional = false,
    variant = 'underlined',
    pageId = PAGE_ID.WILD_CARD,
    elementId = ELEMENT_ID.WILD_CARD,
    componentId = COMPONENT_ID.WILD_CARD,
    ...props
  }: FormInputProps,
  ref: React.Ref<HTMLTextAreaElement>,
) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useImperativeHandle(ref, () => textareaRef.current!);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <TextField name={name} className={clsx(styles.formInput, className)}>
      <Label className={styles.formInput__label} htmlFor={id}>
        <FormLabel
          label={label}
          pageId={pageId}
          optional={optional}
          elementId={elementId}
          componentId={componentId}
        />
        {variant === 'underlined' && maxLength && (
          <Typography.Caption className={styles.formInput__counter} data-variant={variant}>
            {value?.length?.toLocaleString()}/{maxLength?.toLocaleString()}
          </Typography.Caption>
        )}
      </Label>
      {multiLine ? (
        <TextArea
          id={id}
          rows={1}
          value={value}
          ref={textareaRef}
          data-error={!!error}
          maxLength={maxLength}
          aria-invalid={!!error}
          data-variant={variant}
          onChange={handleTextareaChange}
          className={clsx(styles.formInput__textarea)}
          {...props}
        />
      ) : (
        <Input
          value={value}
          data-error={!!error}
          maxLength={maxLength}
          aria-invalid={!!error}
          data-variant={variant}
          onChange={(e) => onChange?.(e)}
          className={clsx(styles.formInput__textarea)}
          {...props}
        />
      )}
      {variant === 'boxed' && maxLength && (
        <Typography.Caption className={styles.formInput__counter} data-variant={variant}>
          {value?.length?.toLocaleString()}/{maxLength?.toLocaleString()}
        </Typography.Caption>
      )}
      {variant === 'underlined' && helperText && (
        <Typography.Caption className={styles.formInput__helperText} data-error={!!error}>
          {helperText}
        </Typography.Caption>
      )}
    </TextField>
  );
});
