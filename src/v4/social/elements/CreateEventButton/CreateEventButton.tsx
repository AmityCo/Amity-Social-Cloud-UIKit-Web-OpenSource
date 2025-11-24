import clsx from 'clsx';
import Event from '~/v4/icons/Events';
import { Typography } from '~/v4/core/components';
import { IconComponent } from '~/v4/core/IconComponent';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { ELEMENT_ID } from '~/v4/constants/customization';
import { Button, ButtonProps } from '~/v4/core/components/AriaButton';
import styles from './CreateEventButton.module.css';

type CreateEventButtonProps = ButtonProps & {
  pageId?: string;
  componentId?: string;
};

export function CreateEventButton({
  pageId = '*',
  componentId = '*',
  ...props
}: CreateEventButtonProps) {
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      componentId,
      elementId: ELEMENT_ID.CREATE_EVENT_BUTTON,
    });

  if (isExcluded) return null;

  return (
    <Button
      variant="default"
      style={themeStyles}
      data-testid={accessibilityId}
      className={styles.createEventButton}
      {...props}
    >
      <IconComponent
        configIconName={config.image}
        defaultIconName={defaultConfig.image}
        imgIcon={() => <img src={config.image} alt={uiReference} />}
        defaultIcon={() => <Event className={clsx(styles.createEventButton__icon)} />}
      />
      <Typography.BodyBold className={styles.createEventButton__text}>
        {config.text}
      </Typography.BodyBold>
    </Button>
  );
}

export default CreateEventButton;
