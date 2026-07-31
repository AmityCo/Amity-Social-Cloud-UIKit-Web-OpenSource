import clsx from 'clsx';
import { forwardRef, type ReactNode } from 'react';
import {
  TextField as AriaTextField,
  Input as AriaInput,
  TextArea as AriaTextArea,
} from 'react-aria-components';
import styles from './Boxed.module.css';

export type BoxedSize = 'medium' | 'small';
export type BoxedVariant = 'pill' | 'square' | 'rounded';

export type BoxedProps = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  size?: BoxedSize;
  variant?: BoxedVariant;
  maxLength?: number;
  multiline?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmit?: (value: string) => void;
  className?: string;
  'aria-label'?: string;
};

export const Boxed = forwardRef<HTMLDivElement, BoxedProps>(function Boxed(
  {
    value,
    onChange,
    placeholder,
    leadingIcon,
    trailingIcon,
    size = 'medium',
    variant = 'pill',
    maxLength,
    multiline = false,
    isDisabled = false,
    isInvalid = false,
    onFocus,
    onBlur,
    onSubmit,
    className,
    ...props
  },
  ref,
) {
  return (
    <AriaTextField
      ref={ref}
      value={value}
      onChange={onChange}
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      onFocus={onFocus}
      onBlur={onBlur}
      aria-label={props['aria-label']}
      className={clsx(styles.boxed, className)}
      data-size={size}
      data-variant={variant}
      data-filled={value ? true : undefined}
      data-multiline={multiline || undefined}
    >
      {leadingIcon ? <span className={styles.boxed__icon}>{leadingIcon}</span> : null}
      {multiline ? (
        <AriaTextArea
          className={styles.boxed__input}
          placeholder={placeholder}
          maxLength={maxLength}
        />
      ) : (
        <AriaInput
          className={styles.boxed__input}
          placeholder={placeholder}
          maxLength={maxLength}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSubmit?.(value ?? '');
          }}
        />
      )}
      {trailingIcon ? <span className={styles.boxed__icon}>{trailingIcon}</span> : null}
    </AriaTextField>
  );
});
