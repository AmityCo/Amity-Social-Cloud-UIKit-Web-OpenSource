import clsx from 'clsx';
import React from 'react';
import { Checkbox, CheckboxProps } from '~/v4/core/components/AriaCheckbox/Checkbox';
import {
  Label,
  FieldError,
  CheckboxGroup as $CheckboxGroup,
  CheckboxGroupProps as $CheckboxGroupProps,
} from 'react-aria-components';
import styles from './CheckboxGroup.module.css';

type CheckboxGroupProps = $CheckboxGroupProps & {
  errorMessage?: string;
  label?: React.ReactNode;
  labelClassName?: string;
  alignment?: 'row' | 'row-reverse';
  checkboxProps?: Partial<CheckboxProps>;
  checkboxes: { value: string; label: string | React.ReactNode }[];
};

export function CheckboxGroup({
  label,
  className,
  checkboxes,
  errorMessage,
  checkboxProps,
  labelClassName,
  alignment = 'row-reverse',
  ...props
}: CheckboxGroupProps) {
  return (
    <$CheckboxGroup {...props} className={clsx(styles.checkboxGroup, className)}>
      {label && <Label className={labelClassName}>{label}</Label>}
      {checkboxes.map((checkbox) => (
        <Checkbox
          {...checkbox}
          {...checkboxProps}
          key={checkbox.value}
          data-alignment={alignment}
          className={clsx(styles.checkBox, checkboxProps?.className)}
        />
      ))}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </$CheckboxGroup>
  );
}
