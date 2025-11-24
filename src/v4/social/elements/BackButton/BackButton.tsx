import clsx from 'clsx';
import { ArrowLeft } from '~/v4/icons/ArrowLeft';
import { IconComponent } from '~/v4/core/IconComponent';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button, ButtonProps } from '~/v4/core/natives/Button/Button';
import styles from './BackButton.module.css';

type BackButtonProps = ButtonProps & {
  pageId?: string;
  componentId?: string;
  imgClassName?: string;
  defaultClassName?: string;
  variant?: 'default' | 'filled';
};

export const BackButton = ({
  onPress,
  className,
  pageId = '*',
  imgClassName,
  defaultClassName,
  componentId = '*',
  variant = 'default',
  ...props
}: BackButtonProps) => {
  const elementId = 'back_button';

  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      elementId,
      componentId,
    });

  if (isExcluded) return null;

  return (
    <Button
      {...props}
      onPress={onPress}
      style={themeStyles}
      data-variant={variant}
      data-testid={accessibilityId}
      aria-label="Back to the previous page"
      className={clsx(styles.backButton, className)}
    >
      <IconComponent
        configIconName={config.image}
        defaultIconName={defaultConfig.image}
        imgIcon={() => <img src={config.image} alt={uiReference} className={imgClassName} />}
        defaultIcon={() => (
          <ArrowLeft
            data-variant={variant}
            className={clsx(styles.backButton__icon, defaultClassName)}
          />
        )}
      />
    </Button>
  );
};
