import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button, ButtonProps } from '~/v4/core/components/AriaButton';
import styles from './ChipButton.module.css';

type ChipButtonProps = Omit<ButtonProps, 'variant'> & {
  pageId?: string;
  componentId?: string;
  elementId?: string;
  isActive?: boolean;
  label?: string;
  textId?: string;
  variant?: 'title' | 'body';
  isTransparent?: boolean;
};

function ChipButton({
  label,
  textId,
  pageId = '*',
  elementId = '*',
  isActive = false,
  variant = 'title',
  componentId = '*',
  isTransparent = true,
  ...props
}: ChipButtonProps) {
  const { accessibilityId, config, isExcluded, themeStyles, resolveText } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  const localizedText = resolveText(textId ?? '');

  const Component =
    variant === 'title'
      ? isActive
        ? Typography.TitleBold
        : Typography.Title
      : isActive
        ? Typography.BodyBold
        : Typography.Body;

  if (isExcluded) return null;

  return (
    <Button
      variant="default"
      style={themeStyles}
      data-active={isActive}
      className={styles.chipButton}
      data-testid={accessibilityId}
      data-transparent={isTransparent}
      {...props}
    >
      <Component data-active={isActive} className={styles.chipButton__text}>
        {label ?? (localizedText || config.text)}
      </Component>
    </Button>
  );
}

export default ChipButton;
