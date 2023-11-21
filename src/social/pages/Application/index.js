import React from 'react';
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

const ApplicationContainer = styled.div`
  height: 100%;
  width: 100%;
  color: #333;
  font-family: sans-serif;
`;

const StyledCommunitySideMenu = styled(CommunitySideMenu)`
  min-height: 100%;
`;

const Community = (props) => {
  const { defaultCommunityId } = props;
  const { page } = useNavigation();

  const communityId = page.communityId ? page.communityId : null;

  return (
    <ApplicationContainer>
      <MainLayout aside={<StyledCommunitySideMenu activeCommunity={communityId} />}>
        {page.type === PageTypes.Explore && <ExplorePage />}

        {page.type === PageTypes.NewsFeed && (
          <NewsFeedPage defaultCommunityId={defaultCommunityId} />
        )}

        {page.type === PageTypes.CommunityFeed && (
          <CommunityFeedPage communityId={communityId} isNewCommunity={page.isNewCommunity} />
        )}

        {page.type === PageTypes.CommunityEdit && (
          <CommunityEditPage communityId={communityId} tab={page.tab} />
        )}

        {page.type === PageTypes.Category && (
          <CategoryCommunitiesPage categoryId={page.categoryId} />
        )}

        {page.type === PageTypes.UserFeed && <UserFeedPage userId={page.userId} />}

        {page.type === PageTypes.UserEdit && <ProfileSettings userId={page.userId} />}
      </MainLayout>
    </ApplicationContainer>
  );
};

export default Community;
