import React, { useEffect, useState } from 'react';
import styles from './Application.module.css';
import { PageTypes } from '~/social/constants';
import MainLayout from '~/social/layouts/Main';
import CommunitySideMenu from '~/social/components/CommunitySideMenu';
import ExplorePage from '~/social/pages/Explore';
import NewsFeedPage from '~/social/pages/NewsFeed';
import UserFeedPage from '~/social/pages/UserFeed';
import CategoryCommunitiesPage from '~/social/pages/CategoryCommunities';
import CommunityEditPage from '~/social/pages/CommunityEdit';
import ProfileSettings from '~/social/components/ProfileSettings';
import { useNavigation } from '~/social/providers/NavigationProvider';
import useSDK from '~/core/hooks/useSDK';
import { AmityViewStoryPage } from '~/v4/social/pages/StoryPage';
import { StoryProvider } from '~/v4/social/providers/StoryProvider';
import CommunityFeed from '~/social/pages/CommunityFeed';

const Community = () => {
  const { page } = useNavigation();
  const { client } = useSDK();
  const [socialSettings, setSocialSettings] = useState<Amity.SocialSettings | null>(null);
  const [open, setOpen] = useState(false);

  const toggleOpen = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (client === null) return;
    async function run() {
      const settings = await client?.getSocialSettings();
      if (settings) {
        setSocialSettings(settings);
      }
    }
    run();
  }, [client]);

  return (
    <StoryProvider>
      <div className={styles.applicationContainer}>
        <MainLayout
          aside={
            <div className={styles.styledCommunitySideMenu}>
              <CommunitySideMenu activeCommunity={page.communityId} />
            </div>
          }
        >
          {page.type === PageTypes.Explore && <ExplorePage />}
          {page.type === PageTypes.NewsFeed && (
            <NewsFeedPage toggleOpen={toggleOpen} isOpen={open} />
          )}
          {page.type === PageTypes.CommunityFeed && (
            <CommunityFeed
              communityId={page.communityId}
              isNewCommunity={page.isNewCommunity}
              isOpen={open}
              toggleOpen={toggleOpen}
            />
          )}
          {page.type === PageTypes.ViewStory && page.storyType && (
            <div className={styles.wrapper}>
              <AmityViewStoryPage type={page.storyType} />
            </div>
          )}
          {page.type === PageTypes.CommunityEdit && (
            <CommunityEditPage communityId={page.communityId} tab={page.tab} />
          )}
          {page.type === PageTypes.Category && (
            <CategoryCommunitiesPage categoryId={page.categoryId} />
          )}
          {page.type === PageTypes.UserFeed && (
            <UserFeedPage userId={page.userId} socialSettings={socialSettings} />
          )}
          {page.type === PageTypes.UserEdit && <ProfileSettings userId={page.userId} />}
        </MainLayout>
      </div>
    </StoryProvider>
  );
};

export default Community;
