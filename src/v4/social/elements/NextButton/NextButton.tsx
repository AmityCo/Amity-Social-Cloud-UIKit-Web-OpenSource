import { IconComponent } from '~/v4/core/IconComponent';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button, ButtonProps } from '~/v4/core/natives/Button';
import clsx from 'clsx';
import { Typography } from '~/v4/core/components';
import { ArrowRight } from '~/v4/icons/ArrowRight';
import styles from './NextButton.module.css';

interface NextButtonProps {
  pageId?: string;
  componentId?: string;
  defaultIconClassName?: string;
  imgIconClassName?: string;
  buttonClassName?: string;
  onPress: ButtonProps['onPress'];
}

export function NextButton({
  pageId = '*',
  componentId = '*',
  defaultIconClassName,
  imgIconClassName,
  buttonClassName,
  onPress,
}: NextButtonProps) {
  const elementId = 'next_button';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, resolveText } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <Button
      className={clsx(styles.nextButton, buttonClassName)}
      data-testid={accessibilityId}
      onPress={onPress}
    >
      <Typography.BodyBold className={styles.nextButton__text}>
        {resolveText('amity_social_button_next')}
      </Typography.BodyBold>
      <IconComponent
        defaultIcon={() => (
          <ArrowRight className={clsx(styles.nextButton__icon, defaultIconClassName)} />
        )}
        imgIcon={() => <img src={config.icon} alt={uiReference} className={imgIconClassName} />}
        defaultIconName={defaultConfig.icon}
        configIconName={config.icon}
      />
    </Button>
  );
}
