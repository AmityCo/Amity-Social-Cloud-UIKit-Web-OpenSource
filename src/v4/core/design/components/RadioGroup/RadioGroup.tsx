import clsx from 'clsx';
import React from 'react';
import { Radio, RadioProps } from '~/v4/core/components/AriaRadio/Radio';
import { Button } from '~/v4/core/design/components/Button';
import { FieldError, RadioGroup as $RadioGroup, Label } from 'react-aria-components';
import type { RadioGroupProps as $RadioGroupProps, ValidationResult } from 'react-aria-components';
import styles from './RadioGroup.module.css';

type RadioGroupProps = $RadioGroupProps & {
  radioContainerClassname?: string;
  labelClassName?: string;
  radioProps?: Partial<RadioProps>;
  label?: string | React.ReactNode;
  errorMessage?: string | ((validation: ValidationResult) => string);
  isImageOption?: boolean;
  radios: {
    value: string;
    label: string | React.ReactNode;
    props?: Partial<RadioProps>;
    icon?: React.ReactNode;
    isShowRadio?: boolean;
    onIconClick?: (value: string) => void;
    isDisabled?: boolean;
  }[];
  testId?: string;
};

export function RadioGroup({
  label,
  radios,
  className,
  radioProps,
  errorMessage,
  labelClassName,
  radioContainerClassname,
  isImageOption,
  testId,
  ...props
}: RadioGroupProps) {
  return (
    <$RadioGroup
      {...props}
      className={clsx(styles.radioGroup, className)}
      data-image-option={isImageOption}
    >
      {label && <Label className={labelClassName}>{label}</Label>}
      <div className={radioContainerClassname} data-image-option={isImageOption}>
        {radios.map(
          ({ value, label, props: radioItemProps, icon, onIconClick, isDisabled }, index) => (
            <div key={value} className={styles.radioItemWrapper}>
              {!icon && (
                <Radio
                  {...radioProps}
                  {...radioItemProps}
                  value={value}
                  label={label}
                  isDisabled={isDisabled || radioProps?.isDisabled}
                  data-image-option={isImageOption}
                  data-testid={`${testId}-${index}`}
                />
              )}
              {icon && (
                <div className={styles.iconRadioWrapper}>
                  <Radio
                    {...radioProps}
                    {...radioItemProps}
                    isDisabled={isDisabled || radioProps?.isDisabled}
                    value={value}
                    data-image-option={isImageOption}
                    data-testid={`${testId}-${index}`}
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
          ),
        )}
        {errorMessage && <FieldError>{errorMessage}</FieldError>}
      </div>
    </$RadioGroup>
  );
}
