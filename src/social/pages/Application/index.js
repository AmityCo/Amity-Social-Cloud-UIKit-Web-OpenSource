import React from 'react';
import styled from 'styled-components';

import { PageTypes } from '~/social/constants';

import MainLayout from '~/social/layouts/Main';

import CommunitySideMenu from '~/social/components/CommunitySideMenu';

import CustomHeader from '~/core/components/CustomHeader';
import ProfileSettings from '~/social/components/ProfileSettings';
import SideSectionMyCommunity from '~/social/components/SideSectionMyCommunity';
import CategoryCommunitiesPage from '~/social/pages/CategoryCommunities';
import CommunityEditPage from '~/social/pages/CommunityEdit';
import CommunityFeedPage from '~/social/pages/CommunityFeed';
import ExplorePage from '~/social/pages/Explore';
import NewsFeedPage from '~/social/pages/NewsFeed';
import UserFeedPage from '~/social/pages/UserFeed';
import { useNavigation } from '~/social/providers/NavigationProvider';
import MobilePostButton from '~/core/components/MobilePostButton';

// import Custom from '~/chat/components/Message/MessageContent/Custom';

const ApplicationContainer = styled.div`
  height: 100%;
  width: 100%;
`;

const StyledCommunitySideMenu = styled(CommunitySideMenu)`
  min-height: 100%;
  display: none;
  @media screen and (min-width: 768px) {
    display: block;
  }
`;

const Community = () => {
  const { page, onClickUser } = useNavigation();

  // const userId = '3454838145071';
  const handleClickUser = (userId) => onClickUser(userId);
  return (
    <ApplicationContainer>
      <CustomHeader userId={page.userId} onClickUser={handleClickUser} />
      <MobilePostButton />
      <MainLayout aside={<StyledCommunitySideMenu activeCommunity={page.communityId} />}>
        {page.type === PageTypes.Explore && <ExplorePage />}

        {page.type === PageTypes.NewsFeed && <NewsFeedPage />}

        {page.type === PageTypes.CommunityFeed && (
          <CommunityFeedPage communityId={page.communityId} isNewCommunity={page.isNewCommunity} />
        )}

        {page.type === PageTypes.CommunityEdit && (
          <CommunityEditPage communityId={page.communityId} tab={page.tab} />
        )}

        {page.type === PageTypes.Category && (
          <CategoryCommunitiesPage categoryId={page.categoryId} />
        )}

        {page.type === PageTypes.UserFeed && <UserFeedPage userId={page.userId} />}

        {page.type === PageTypes.UserEdit && <ProfileSettings userId={page.userId} />}

        {page.type === PageTypes.MyGroups && (
          <SideSectionMyCommunity activeCommunity={page.communityId} showCreateButton />
        )}
      </MainLayout>
    </ApplicationContainer>
  );
};

export default Community;
