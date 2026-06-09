import { IconComponent } from '~/v4/core/IconComponent';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Typography } from '~/v4/core/components';
import styles from './CreateStoryButton.module.css';
import clsx from 'clsx';
import { Button } from '~/v4/core/natives/Button';
import { CreateStory } from '~/v4/icons/CreateStory';

interface CreateStoryButtonProps {
  pageId?: string;
  componentId?: string;
  defaultClassName?: string;
  onClick?: () => void;
}

export function CreateStoryButton({
  pageId = '*',
  componentId = '*',
  onClick,
  defaultClassName,
}: CreateStoryButtonProps) {
  const elementId = 'create_story_button';
  const {
    accessibilityId,
    config,
    defaultConfig,
    isExcluded,
    uiReference,
    themeStyles,
    resolveText,
  } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;
  return (
    <Button
      className={styles.createStoryButton}
      data-testid={accessibilityId}
      style={themeStyles}
      onPress={() => onClick?.()}
    >
      <IconComponent
        defaultIcon={() => (
          <CreateStory className={clsx(styles.createStoryButton__icon, defaultClassName)} />
        )}
        imgIcon={() => <img src={config.image} alt={uiReference} />}
        configIconName={config.image}
        defaultIconName={defaultConfig.image}
      />
      <Typography.BodyBold className={styles.createStoryButton__text}>
        {resolveText('amity_social_button_social_home_create_story_button')}
      </Typography.BodyBold>
    </Button>
  );
}

export default CreateStoryButton;
