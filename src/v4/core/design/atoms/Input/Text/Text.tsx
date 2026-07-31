import clsx from 'clsx';
import { forwardRef, type ReactNode } from 'react';
import {
  TextField as AriaTextField,
  Input as AriaInput,
  TextArea as AriaTextArea,
} from 'react-aria-components';
import { Typography } from '~/v4/core/components/Typography/Typography';
import styles from './Text.module.css';

export type TextProps = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  title?: string;
  optionalLabel?: string;
  hintText?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  showCharacterCount?: boolean;
  maxLength?: number;
  multiLine?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  highlightMatch?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmit?: (value: string) => void;
  className?: string;
  'aria-label'?: string;
};

export const Text = forwardRef<HTMLDivElement, TextProps>(function Text(
  {
    value,
    onChange,
    placeholder,
    title,
    optionalLabel,
    hintText,
    leadingIcon,
    trailingIcon,
    showCharacterCount = false,
    maxLength,
    multiLine = false,
    isDisabled = false,
    isInvalid = false,
    highlightMatch = false,
    onFocus,
    onBlur,
    onSubmit,
    className,
    ...props
  },
  ref,
) {
  const counter = showCharacterCount ? (
    <Typography.Caption as="span" className={styles.field__count}>
      {value?.length ?? 0}
      {maxLength ? `/${maxLength}` : ''}
    </Typography.Caption>
  ) : null;

  return (
    <AriaTextField
      ref={ref}
      value={value}
      onChange={onChange}
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      onFocus={onFocus}
      onBlur={onBlur}
      aria-label={props['aria-label'] ?? title}
      className={clsx(styles.field, className)}
      data-filled={value ? true : undefined}
      data-highlight={highlightMatch || undefined}
      data-multiline={multiLine || undefined}
    >
      {title ? (
        <div className={styles.field__titleRow}>
          <Typography.TitleBold as="span" className={styles.field__title}>
            {title}
            {optionalLabel ? (
              <Typography.Caption as="span" className={styles.field__optional}>
                {optionalLabel}
              </Typography.Caption>
            ) : null}
          </Typography.TitleBold>
          {counter}
        </div>
      ) : null}
      <div className={styles.field__row}>
        {leadingIcon ? <span className={styles.field__icon}>{leadingIcon}</span> : null}
        {multiLine ? (
          <AriaTextArea
            className={styles.field__input}
            placeholder={placeholder}
            maxLength={maxLength}
            rows={1}
          />
        ) : (
          <AriaInput
            className={styles.field__input}
            placeholder={placeholder}
            maxLength={maxLength}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSubmit?.(value ?? '');
            }}
          />
        )}
        {trailingIcon ? <span className={styles.field__icon}>{trailingIcon}</span> : null}
        {!title ? counter : null}
      </div>
      {hintText ? (
        <Typography.Caption as="span" className={styles.field__hint}>
          {hintText}
        </Typography.Caption>
      ) : null}
    </AriaTextField>
  );
});
