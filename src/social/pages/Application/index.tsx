import React, { useEffect } from 'react';
import styled from 'styled-components';

import { PageTypes } from '~/social/constants';

import MainLayout from '~/social/layouts/Main';

import CommunitySideMenu from '~/social/components/CommunitySideMenu';

import ExplorePage from '~/social/pages/Explore';
import NewsFeedPage from '~/social/pages/NewsFeed';
import CommunityFeedPage from '~/social/pages/CommunityFeed';
import UserFeedPage from '~/social/pages/UserFeed';
import CategoryCommunitiesPage from '~/social/pages/CategoryCommunities';
import CommunityEditPage from '~/social/pages/CommunityEdit';
import ProfileSettings from '~/social/components/ProfileSettings';
import { useNavigation } from '~/social/providers/NavigationProvider';
import { StoryViewer } from '~/V4/social/components/StoryViewer';
import useSDK from '~/core/hooks/useSDK';

const ApplicationContainer = styled.div`
  height: 100%;
  width: 100%;
`;

const StyledCommunitySideMenu = styled(CommunitySideMenu)`
  @media (min-width: 768px) {
    min-height: 100%;
    display: block;
  }
`;

const CommunitySideMenuOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
  cursor: pointer;
`;

const MobileCommunitySideMenu = styled(CommunitySideMenu)<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  min-height: 100%;
  height: 100%;
  z-index: 999;
  transform: translateX(${({ isOpen }) => (isOpen ? 0 : '-100%')});
  transition: transform 0.3s ease-in-out;
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
  const [socialSettings, setSocialSettings] = React.useState<Amity.SocialSettings | null>(null);

  const [open, setOpen] = React.useState(false);

  const toggleOpen = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (client == null) return;

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
      <MobileCommunitySideMenu isOpen={open} onClose={toggleOpen} />
      <CommunitySideMenuOverlay isOpen={open} onClick={toggleOpen} />
      <MainLayout aside={<StyledCommunitySideMenu activeCommunity={page.communityId} />}>
        {page.type === PageTypes.Explore && <ExplorePage />}

        {page.type === PageTypes.NewsFeed && <NewsFeedPage toggleOpen={toggleOpen} isOpen={open} />}

        {page.type === PageTypes.CommunityFeed && (
          <CommunityFeedPage
            communityId={page.communityId}
            isNewCommunity={page.isNewCommunity}
            toggleOpen={toggleOpen}
          />
        )}

        {page.type === PageTypes.ViewStory && (
          <Wrapper>
            <StoryViewer targetId={page.targetId as string} duration={5000} onClose={onBack} />
          </Wrapper>
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
    </ApplicationContainer>
  );
};

export default Community;
