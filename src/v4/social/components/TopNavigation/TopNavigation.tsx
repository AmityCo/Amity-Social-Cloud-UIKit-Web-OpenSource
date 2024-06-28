import React from 'react';
import { PostCreationButton } from '~/v4/social/elements/PostCreationButton';
import { GlobalSearchButton } from '~/v4/social/elements/GlobalSearchButton';
import { HeaderLabel } from '~/v4/social/elements/HeaderLabel';
import styles from './TopNavigation.module.css';
import { useAmityComponent } from '~/v4/core/hooks/uikit';

export interface TopNavigationProps {
  pageId?: string;
  onGlobalSearchButtonClick: () => void;
  onClickPostCreationButton: (event: React.MouseEvent) => void;
  createPostButtonRef: React.RefObject<HTMLDivElement>;
}

export function TopNavigation({
  pageId = '*',
  onGlobalSearchButtonClick,
  onClickPostCreationButton,
  createPostButtonRef,
}: TopNavigationProps) {
  const componentId = 'top_navigation';
  const { isExcluded, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  if (isExcluded) return null;

  return (
    <div className={styles.topNavigation} style={themeStyles}>
      <div className={styles.topNavigationLeftPane}>
        <HeaderLabel pageId={pageId} componentId={componentId} />
      </div>
      <div className={styles.topNavigationRightPane}>
        <GlobalSearchButton
          pageId={pageId}
          componentId={componentId}
          onPress={onGlobalSearchButtonClick}
        />
        <PostCreationButton
          pageId={pageId}
          componentId={componentId}
          onClick={onClickPostCreationButton}
          createPostButtonRef={createPostButtonRef}
        />
      </div>
    </div>
  );
}
