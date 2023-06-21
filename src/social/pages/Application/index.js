import React from 'react';
import styled from 'styled-components';

import { PageTypes } from '~/social/constants';

import MainLayout from '~/social/layouts/Main';

import CommunitySideMenu from '~/social/components/CommunitySideMenu';

import NewsFeedPage from '~/social/pages/NewsFeed';
import { useNavigation } from '~/social/providers/NavigationProvider';

const ExplorePage = React.lazy(() => import('../Explore'));
const CommunityFeedPage = React.lazy(() => import('../CommunityFeed'));
const UserFeedPage = React.lazy(() => import('~/social/pages/UserFeed'));
const CategoryCommunitiesPage = React.lazy(() => import('~/social/pages/CategoryCommunities'));
const CommunityEditPage = React.lazy(() => import('~/social/pages/CommunityEdit'));
const ProfileSettings = React.lazy(() => import('../../components/ProfileSettings'));

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
        <React.Suspense fallback={null}>
          {page.type === PageTypes.Explore && <ExplorePage />}

          {page.type === PageTypes.CommunityFeed && (
            <CommunityFeedPage
              communityId={page.communityId}
              isNewCommunity={page.isNewCommunity}
            />
          )}

          {page.type === PageTypes.CommunityEdit && (
            <CommunityEditPage communityId={page.communityId} tab={page.tab} />
          )}

          {page.type === PageTypes.Category && (
            <CategoryCommunitiesPage categoryId={page.categoryId} />
          )}

          {page.type === PageTypes.UserFeed && <UserFeedPage userId={page.userId} />}

          {page.type === PageTypes.UserEdit && <ProfileSettings userId={page.userId} />}
        </React.Suspense>

        {page.type === PageTypes.NewsFeed && <NewsFeedPage />}
      </MainLayout>
    </ApplicationContainer>
  );
};

export default Community;
