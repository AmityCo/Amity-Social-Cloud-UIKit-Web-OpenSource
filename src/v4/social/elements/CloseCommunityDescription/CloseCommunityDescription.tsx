import styles from './CloseCommunityDescription.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Typography } from '~/v4/core/components';

type CloseCommunityDescriptionProps = {
  pageId?: string;
  componentId?: string;
};

export const CloseCommunityDescription = ({
  pageId = '*',
  componentId = '*',
}: CloseCommunityDescriptionProps) => {
  const elementId = 'close_community_description';
  const { themeStyles, isExcluded, config, accessibilityId, resolveText } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;
  return (
    <div
      style={themeStyles}
      data-testid={accessibilityId}
      className={styles.closeCommunityDescription__container}
    >
      <Typography.Caption className={styles.closeCommunityDescription__text}>
        {resolveText('amity_social_label_close_community_description')}
      </Typography.Caption>
    </div>
  );
};
