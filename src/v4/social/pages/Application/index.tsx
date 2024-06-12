import React from 'react';
import styles from './Application.module.css';
import { SocialHomePage } from '~/v4/social/pages/SocialHomePage';
import { PostDetailPage } from '~/v4/social/pages/PostDetailPage';
import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';
import { StoryProvider } from '~/v4/social/providers/StoryProvider';

const Application = () => {
  const { page } = useNavigation();

  return (
    <StoryProvider>
      <div className={styles.applicationContainer}>
        {page.type === PageTypes.SocialHomePage && <SocialHomePage />}
        {page.type === PageTypes.PostDetailPage && <PostDetailPage id={page.context.postId} />}
      </div>
    </StoryProvider>
  );
};

export default Application;
