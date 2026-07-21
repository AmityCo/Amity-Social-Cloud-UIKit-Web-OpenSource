import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import clsx from 'clsx';
import styles from './ExplorePinnedTitle.module.css';

interface TitleProps {
  pageId?: string;
  componentId?: string;
  titleClassName?: string;
  /**
   * When there is exactly one pinned community the section reads as a welcome
   * ("Welcome to our Community"); with multiple it reads as "Pinned communities".
   */
  isSingle?: boolean;
}

export function ExplorePinnedTitle({
  pageId = '*',
  componentId = '*',
  titleClassName,
  isSingle = false,
}: TitleProps) {
  const elementId = 'explore_pinned_title';
  const { accessibilityId, isExcluded, themeStyles, resolveText } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Typography.TitleBold
      className={clsx(styles.explorePinnedTitle, titleClassName)}
      style={themeStyles}
      data-testid={accessibilityId}
    >
      {resolveText(
        isSingle ? 'amity_social_label_pinned_welcome' : 'amity_social_label_pinned_communities',
      )}
    </Typography.TitleBold>
  );
}
