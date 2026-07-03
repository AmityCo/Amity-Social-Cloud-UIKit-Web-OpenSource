import styles from './PollAddOptionButton.module.css';
import { Plus } from '~/v4/icons/Plus';
import { Button } from '~/v4/core/components/AriaButton';
import { IconComponent } from '~/v4/core/IconComponent';
import clsx from 'clsx';
import { useAmityElement } from '~/v4/core/hooks/uikit';

type PollAddOptionButtonProps = {
  pageId?: string;
  componentId?: string;
  onPress: () => void;
};

export const PollAddOptionButton = ({
  pageId = '*',
  componentId = '*',
  onPress,
}: PollAddOptionButtonProps) => {
  const elementId = 'poll_add_option_button';

  const { config, themeStyles, accessibilityId, uiReference, defaultConfig, resolveText } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });
  return (
    <Button
      style={themeStyles}
      data-testid={accessibilityId}
      size="medium"
      variant="outlined"
      color="secondary"
      onPress={onPress}
      className={styles.pollAddOptionButton__addOptionButton}
      icon={({ className }) => (
        <IconComponent
          configIconName={config.icon}
          defaultIconName={defaultConfig.icon}
          imgIcon={() => <img src={config.icon} alt={uiReference} />}
          defaultIcon={() => (
            <Plus className={clsx(className, styles.pollAddOptionButton__plusIcon)} />
          )}
        />
      )}
    >
      {resolveText('amity_social_button_add_option')}
    </Button>
  );
};
