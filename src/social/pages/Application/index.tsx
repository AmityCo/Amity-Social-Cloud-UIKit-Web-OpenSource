import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

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
import CommunityFeed from '../CommunityFeed';

const ApplicationContainer = styled.div`
  height: 100%;
  width: 100%;
`;

const StyledCommunitySideMenu = styled(CommunitySideMenu)`
  display: none;

  @media (min-width: 768px) {
    min-height: 100%;
    display: block;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const Community = () => {
  const { page, onBack } = useNavigation();

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
      <ApplicationContainer>
        <MainLayout aside={<StyledCommunitySideMenu activeCommunity={page.communityId} />}>
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

        {page.type === PageTypes.CommunityEdit && (
          <CommunityEditPage communityId={page.communityId} tab={page.tab} />
        )}

        {page.type === PageTypes.UserFeed && (
          <UserFeedPage userId={page.userId} socialSettings={socialSettings} />
        )}

        {page.type === PageTypes.UserEdit && <ProfileSettings userId={page.userId} />}
      </MainLayout>
    </ApplicationContainer>
  );
};

export default Community;
