import React from 'react';
import styled from 'styled-components';

import { PageTypes } from '~/social/constants';

import ConditionalRender from '~/core/components/ConditionalRender';
import MainLayout from '~/social/layouts/Main';

import CommunitySideMenu from '~/social/components/CommunitySideMenu';

import ExplorePage from '~/social/pages/Explore';
import NewsFeedPage from '~/social/pages/NewsFeed';
import CommunityFeedPage from '~/social/pages/CommunityFeed';
import UserFeedPage from '~/social/pages/UserFeed';
import CategoryCommunitiesPage from '~/social/pages/CategoryCommunities';
import CommunityEditPage from '~/social/pages/CommunityEdit';
import { useNavigation } from '~/social/providers/NavigationProvider';

const ApplicationContainer = styled.div`
  height: 100%;
  width: 100%;
`;

const StyledCommunitySideMenu = styled(CommunitySideMenu)`
  min-height: 100%;
`;

const Community = () => {
  const { page } = useNavigation();

  return (
    <ApplicationContainer>
      <MainLayout aside={<StyledCommunitySideMenu activeCommunity={page.communityId} />}>
        <ConditionalRender condition={page.type === PageTypes.Explore}>
          <ExplorePage />
        </ConditionalRender>

        <ConditionalRender condition={page.type === PageTypes.NewsFeed}>
          <NewsFeedPage />
        </ConditionalRender>

        {page.type === PageTypes.CommunityFeed && (
          <CommunityFeedPage communityId={page.communityId} />
        )}

        {page.type === PageTypes.CommunityEdit && (
          <CommunityEditPage communityId={page.communityId} />
        )}

        <ConditionalRender condition={page.type === PageTypes.UserFeed}>
          <UserFeedPage userId={page.userId} />
        </ConditionalRender>

        {page.type === PageTypes.Category && (
          <CategoryCommunitiesPage categoryId={page.categoryId} />
        )}
      </MainLayout>
    </ApplicationContainer>
  );
};

export default Community;
