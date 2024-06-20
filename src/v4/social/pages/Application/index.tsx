import React from 'react';

import { SocialHomePage } from '~/v4/social/pages/SocialHomePage';
import { PostDetailPage } from '~/v4/social/pages/PostDetailPage';
import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';
import { StoryProvider } from '~/v4/social/providers/StoryProvider';
import { SocialGlobalSearchPage } from '~/v4/social/pages/SocialGlobalSearchPage';
import { ViewStoryPage } from '~/v4/social/pages/StoryPage';
import { SelectPostTargetPage } from '../SelectPostTargetPage';

import styles from './Application.module.css';

const Application = () => {
  const { page } = useNavigation();

  return (
    <StoryProvider>
      <div className={styles.applicationContainer}>
        {page.type === PageTypes.SocialHomePage && <SocialHomePage />}
        {page.type === PageTypes.SocialGlobalSearchPage && <SocialGlobalSearchPage />}
        {page.type === PageTypes.PostDetailPage && <PostDetailPage id={page.context.postId} />}
        {page.type === PageTypes.ViewStoryPage && (
          <ViewStoryPage type="globalFeed" targetId={page.context.targetId} />
        )}
        {/* {page.type === PageTypes.SelectPostTargetPage && <SelectPostTargetPage />} */}
      </div>
    </StoryProvider>
  );
};

export default Application;
