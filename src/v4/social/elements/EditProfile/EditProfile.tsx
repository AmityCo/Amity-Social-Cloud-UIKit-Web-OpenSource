import clsx from 'clsx';
import { Pencil } from '~/v4/icons/Pencil';
import ChevronRight from '~/v4/icons/ChevronRight';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { Button } from '~/v4/core/natives/Button/Button';
import { Typography } from '~/v4/core/components';
import styles from './EditProfile.module.css';

type EditProfileProps = {
  pageId?: string;
  componentId?: string;
  onClick?: () => void;
  imgIconClassName?: string;
  defaultIconClassName?: string;
};

export const EditProfile = ({
  pageId = '*',
  componentId = '*',
  imgIconClassName,
  defaultIconClassName,
  onClick,
}: EditProfileProps) => {
  const elementId = 'edit_profile';
  const {
    themeStyles,
    isExcluded,
    config,
    accessibilityId,
    uiReference,
    defaultConfig,
    resolveText,
  } = useAmityElement({ pageId, componentId, elementId });

  if (isExcluded) return null;
  return (
    <Button
      onPress={onClick}
      type="button"
      style={themeStyles}
      data-testid={accessibilityId}
      className={styles.editProfile__button}
    >
      <div className={styles.editProfile__leftWrap}>
        <IconComponent
          defaultIcon={() => (
            <Pencil className={clsx(styles.editProfile__icon, defaultIconClassName)} />
          )}
          imgIcon={() => <img src={config.icon} alt={uiReference} className={imgIconClassName} />}
          defaultIconName={defaultConfig.icon}
          configIconName={config.icon}
        />
        {resolveText('amity_social_community_setting_page_edit_profile_text') && (
          <Typography.Body>
            {resolveText('amity_social_community_setting_page_edit_profile_text')}
          </Typography.Body>
        )}
      </div>
      <ChevronRight className={styles.editProfile__angleRight} />
    </Button>
  );
};
