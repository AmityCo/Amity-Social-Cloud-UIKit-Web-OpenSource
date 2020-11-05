import React, { useState } from 'react';
import PropTypes from 'prop-types';
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

const ApplicationContainer = styled.div`
  height: 100%;
  width: 100%;
`;

const Community = ({
  onChangePage,
  onClickCommunity,
  onCommunityCreated,
  onClickCategory,
  onClickUser,
  onEditUser,
  onMessageUser,
}) => {
  const [page, setPage] = useState({ type: PageTypes.Explore });

  const handleChangePage = type => {
    if (onChangePage) return onChangePage({ type });

    setPage({ type });
  };

  const handleClickCommunity = communityId => {
    const next = {
      type: PageTypes.CommunityFeed,
      communityId,
    };

    if (onChangePage) return onChangePage(next);
    if (onClickCommunity) return onClickCommunity(communityId);

    console.log('handleClickCommunity', { communityId });
    setPage(next);
  };

  const handleCommunityCreated = communityId => {
    const next = {
      type: PageTypes.CommunityFeed,
      communityId,
    };

    if (onChangePage) return onChangePage(next);
    if (onCommunityCreated) return onCommunityCreated(communityId);

    console.log('handleCommunityCreated', { communityId });
    setPage(next);
  };

  const handleClickCategory = categoryId => {
    const next = {
      type: PageTypes.Category,
      categoryId,
    };

    if (onChangePage) return onChangePage(next);
    if (onClickCategory) return onClickCategory(categoryId);

    console.log('handleClickCategory', { categoryId });
    setPage(next);
  };

  const handleClickUser = userId => {
    const next = {
      type: PageTypes.UserFeed,
      userId,
    };

    if (onChangePage) return onChangePage(next);
    if (onClickUser) return onClickUser(userId);

    console.log('handleClickUser', { userId });
    setPage(next);
  };

  const handleEditUser = userId => {
    const next = {
      type: 'userSettings',
      userId,
    };

    if (onChangePage) return onChangePage(next);
    if (onEditUser) return onEditUser(userId);

    console.log('handleEditUser', { userId });
  };

  const handleMessageUser = userId => {
    const next = {
      type: 'conversation',
      userId,
    };

    if (onChangePage) return onChangePage(next);
    if (onMessageUser) return onMessageUser(userId);

    console.log('handleMessageUser', { userId });
  };

  return (
    <ApplicationContainer>
      <MainLayout
        aside={
          <CommunitySideMenu
            newsFeedActive={page.type === PageTypes.NewsFeed}
            onClickNewsFeed={() => handleChangePage(PageTypes.NewsFeed)}
            exploreActive={page.type === PageTypes.Explore}
            onClickExplore={() => handleChangePage(PageTypes.Explore)}
            activeCommunity={page.communityId}
            onClickCommunity={handleClickCommunity}
          />
        }
      >
        <ConditionalRender condition={page.type === PageTypes.Explore}>
          <ExplorePage
            onClickCommunity={handleClickCommunity}
            onCommunityCreated={handleCommunityCreated}
            onClickUser={handleClickUser}
            onClickCategory={handleClickCategory}
          />
        </ConditionalRender>

        <ConditionalRender condition={page.type === PageTypes.NewsFeed}>
          <NewsFeedPage
            onClickCommunity={handleClickCommunity}
            onClickUser={handleClickUser}
            onClickCategory={handleClickCategory}
          />
        </ConditionalRender>

        <ConditionalRender condition={page.type === PageTypes.CommunityFeed}>
          <CommunityFeedPage
            communityId={page.communityId}
            onClickCommunity={handleClickCommunity}
            onClickUser={handleClickUser}
            onClickCategory={handleClickCategory}
          />
        </ConditionalRender>

        <ConditionalRender condition={page.type === PageTypes.UserFeed}>
          <UserFeedPage
            userId={page.userId}
            onClickCommunity={handleClickCommunity}
            onClickUser={handleClickUser}
            onClickCategory={handleClickCategory}
            onEditUser={handleEditUser}
            onMessageUser={handleMessageUser}
          />
        </ConditionalRender>

        <ConditionalRender condition={page.type === PageTypes.Category}>
          <CategoryCommunitiesPage
            categoryId={page.categoryId}
            onBack={() => handleChangePage(PageTypes.Explore)}
            onClickCommunity={handleClickCommunity}
          />
        </ConditionalRender>
      </MainLayout>
    </ApplicationContainer>
  );
};

Community.propTypes = {
  onChangePage: PropTypes.func,
  onClickCommunity: PropTypes.func,
  onCommunityCreated: PropTypes.func,
  onClickCategory: PropTypes.func,
  onClickUser: PropTypes.func,
  onEditUser: PropTypes.func,
  onMessageUser: PropTypes.func,
};

export default Community;
