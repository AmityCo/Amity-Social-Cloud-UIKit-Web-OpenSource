import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Typography, TypographyProps } from '~/v4/core/components/Typography';
import { COMPONENT_ID, ELEMENT_ID, PAGE_ID } from '~/v4/constants/customization';
import { useString } from '~/v4/core/localization';
import styles from './FormLabel.module.css';

type FormLabelProps = Partial<TypographyProps> & {
  label?: string;
  optional?: boolean;
  required?: boolean;
  pageId?: ValueOf<typeof PAGE_ID>;
  elementId?: ValueOf<typeof ELEMENT_ID>;
  componentId?: ValueOf<typeof COMPONENT_ID>;
};

export function FormLabel({
  label,
  optional,
  required,
  pageId = PAGE_ID.WILD_CARD,
  elementId = ELEMENT_ID.WILD_CARD,
  componentId = COMPONENT_ID.WILD_CARD,
  ...props
}: FormLabelProps) {
  const { isExcluded, accessibilityId, config, themeStyles } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });
  const optionalLabel = useString('amity_chat_group_name_optional');
  const requiredLabel = useString('amity_chat_group_name_required');

  if (isExcluded) return null;

  return (
    <Typography.TitleBold
      style={themeStyles}
      className={styles.formLabel}
      data-testid={accessibilityId}
      {...props}
    >
      {config?.text ?? label}
      {optional && (
        <Typography.Caption className={styles.formLabel__optional}>
          {' '}
          {optionalLabel}
        </Typography.Caption>
      )}
      {required && (
        <Typography.Caption className={styles.formLabel__optional}>
          {' '}
          {requiredLabel}
        </Typography.Caption>
      )}
    </Typography.TitleBold>
  );
}
