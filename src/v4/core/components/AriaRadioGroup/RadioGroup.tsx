import clsx from 'clsx';
import React from 'react';
import { Radio, RadioProps } from '~/v4/core/components/AriaRadio/Radio';
import { Button } from '~/v4/core/components/AriaButton';
import { FieldError, RadioGroup as $RadioGroup, Label } from 'react-aria-components';
import type { RadioGroupProps as $RadioGroupProps, ValidationResult } from 'react-aria-components';
import styles from './RadioGroup.module.css';

type RadioGroupProps = $RadioGroupProps & {
  labelClassName?: string;
  radioProps?: Partial<RadioProps>;
  label?: string | React.ReactNode;
  errorMessage?: string | ((validation: ValidationResult) => string);
  radios: {
    value: string;
    label: string | React.ReactNode;
    props?: Partial<RadioProps>;
    icon?: React.ReactNode;
    isShowRadio?: boolean;
    onIconClick?: (value: string) => void;
    isDisabled?: boolean;
  }[];
};

export function RadioGroup({
  label,
  radios,
  className,
  radioProps,
  errorMessage,
  labelClassName,
  ...props
}: RadioGroupProps) {
  return (
    <$RadioGroup {...props} className={clsx(styles.radioGroup, className)}>
      {label && <Label className={labelClassName}>{label}</Label>}
      {radios.map(({ value, label, props: radioItemProps, icon, onIconClick, isDisabled }) => (
        <div key={value} className={styles.radioItemWrapper}>
          {!icon && (
            <Radio
              {...radioProps}
              {...radioItemProps}
              value={value}
              label={label}
              isDisabled={isDisabled}
            />
          )}
          {icon && (
            <div className={styles.iconRadioWrapper}>
              <Radio
                {...radioProps}
                {...radioItemProps}
                isDisabled={isDisabled}
                value={value}
                label={
                  <>
                    <Button
                      onPress={() => onIconClick?.(value)}
                      className={styles.iconWrapper}
                      variant="text"
                      isDisabled={isDisabled}
                    >
                      {icon}
                    </Button>
                    <span>{label}</span>
                  </>
                }
                className={styles.iconRadio}
              />
            </div>
          )}
        </div>
      ))}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </$RadioGroup>
  );
}
