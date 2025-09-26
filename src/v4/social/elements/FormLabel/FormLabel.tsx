import clsx from 'clsx';
import React from 'react';
import styles from './FormLabel.module.css';
import { Typography } from '~/v4/core/components';
import { Label, LabelProps } from 'react-aria-components';
import { useAmityElement } from '~/v4/core/hooks/uikit';

type FormLabelProps = LabelProps & {
  label?: string;
  pageId?: string;
  length?: number;
  maxLength?: number;
  optional?: boolean;
  elementId?: string;
  componentId?: string;
};

export const FormLabel = ({
  label,
  length,
  optional,
  maxLength,
  className,
  pageId = '*',
  componentId = '*',
  elementId = '*',
  ...props
}: FormLabelProps) => {
  const { accessibilityId, themeStyles, config } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  return (
    <Label
      style={themeStyles}
      data-testid={accessibilityId}
      className={clsx(styles.formLabel, className)}
      {...props}
    >
      <Typography.TitleBold>
        {config.text || label}{' '}
        {optional && (
          <Typography.Caption className={styles.formLabel__optional}>(Optional)</Typography.Caption>
        )}
      </Typography.TitleBold>
      {maxLength && (
        <Typography.Caption className={styles.formLabel__length}>
          {length}/{maxLength}
        </Typography.Caption>
      )}
    </Label>
  );
};
