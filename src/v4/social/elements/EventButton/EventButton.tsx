import clsx from 'clsx';
import { Button } from '~/v4/core/natives/Button';
import { Typography } from '~/v4/core/components';
import EventOutlined from '~/v4/icons/EventOutlined';
import { IconComponent } from '~/v4/core/IconComponent';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './EventButton.module.css';

type EventButtonProps = {
  pageId: string;
  onPress?: () => void;
  componentId?: string;
  imgIconClassName?: string;
  defaultIconClassName?: string;
};

export function EventButton({
  onPress,
  pageId = '*',
  componentId = '*',
  imgIconClassName,
  defaultIconClassName,
}: EventButtonProps) {
  const elementId = 'event_button';
  const { themeStyles, isExcluded, config, accessibilityId, uiReference, defaultConfig } =
    useAmityElement({ pageId, componentId, elementId });

  if (isExcluded) return null;

  return (
    <Button
      onPress={onPress}
      style={themeStyles}
      className={styles.eventButton}
      data-testid={accessibilityId}
    >
      <IconComponent
        configIconName={config.icon}
        defaultIconName={defaultConfig.icon}
        imgIcon={() => <img src={config.icon} alt={uiReference} className={imgIconClassName} />}
        defaultIcon={() => (
          <EventOutlined className={clsx(styles.eventButton__icon, defaultIconClassName)} />
        )}
      />
      {config.text && (
        <Typography.BodyBold className={styles.eventButton__label}>
          {config.text}
        </Typography.BodyBold>
      )}
    </Button>
  );
}
