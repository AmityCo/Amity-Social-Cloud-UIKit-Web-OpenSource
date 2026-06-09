import clsx from 'clsx';
import styles from './FormLabel.module.css';
import { Typography } from '~/v4/core/components';
import { Label, LabelProps } from 'react-aria-components';
import { useAmityElement } from '~/v4/core/hooks/uikit';

type FormLabelProps = LabelProps & {
  label?: string;
  textKey?: string;
  pageId?: string;
  length?: number;
  maxLength?: number;
  optional?: boolean;
  elementId?: string;
  componentId?: string;
};

export const FormLabel = ({
  label,
  textKey,
  length,
  optional,
  maxLength,
  className,
  pageId = '*',
  componentId = '*',
  elementId = '*',
  ...props
}: FormLabelProps) => {
  const { accessibilityId, themeStyles, resolveText } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  const labelText = textKey ? resolveText(textKey) : label;

  return (
    <Label
      style={themeStyles}
      data-testid={accessibilityId}
      className={clsx(styles.formLabel, className)}
      {...props}
    >
      <Typography.TitleBold>
        {labelText}{' '}
        {optional && (
          <Typography.Caption className={styles.formLabel__optional}>
            {resolveText('amity_social_button_report_other_reason_optional')}
          </Typography.Caption>
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
