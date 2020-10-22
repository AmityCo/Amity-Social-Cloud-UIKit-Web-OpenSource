import React, { useState } from 'react';
import styled from 'styled-components';
import {
  HashRouter as Router,
  Switch,
  Route,
  useLocation,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';
import { EkoPostTargetType } from 'eko-sdk';

import ProfileSettings from '~/social/components/ProfileSettings';
import FeedLayout from '~/social/components/FeedLayout';
import CommunitySideMenu from '~/social/components/CommunitySideMenu';

import Feed from '~/social/components/Feed';
import ExploreHome from '~/social/components/ExploreHome';
import CategoryPage from '~/social/components/ExploreHome/CategoryPage';
import CommunityCreationModal from '~/social/components/CommunityCreationModal';
import CommunitySettings from '~/social/components/CommunitySettings';
import { EmptyFeed } from '~/icons';

import { useCommunitiesMock } from '~/mock';
import CommunityPage from '~/social/components/CommunityPage';

const EmptyFeedIcon = styled(EmptyFeed).attrs({
  width: '48px',
  height: '48px',
})``;

export default {
  title: 'Community',
};

const Pages = () => {
  const location = useLocation();
  const history = useHistory();
  const { params = {} } =
    useRouteMatch('/community/:communityId') ||
    useRouteMatch('/category/:categoryId') ||
    useRouteMatch('/profile/:userId') ||
    {};
  const { communityId, categoryId, userId } = params;

  const goToUserFeed = id => history.push(`/profile/${id}`);
  const goToNewsFeed = () => history.push(`/news`);
  const goToExplore = () => history.push(`/explore`);
  const onCategoryClick = id => {
    history.push(`/category/${id}`);
  };

  const goToCommunity = id => {
    history.push(`/community/${id}`);
  };

  const blockRouteChange = callback => {
    return history.block(nextLocation => {
      return callback(() => history.push(nextLocation.pathname));
    });
  };

  const pathToSelectionType = {
    news: 'NEWS_FEED',
    explore: 'EXPLORE',
    category: 'COMMUNITY',
  };

  const selected = {
    type: pathToSelectionType[location.pathname.split('/')[1]],
    communityId,
  };

  const isNewsFeedActive = selected.type === pathToSelectionType.news;
  const isExploreActive = selected.type === pathToSelectionType.explore;
  const getIsCommunityActive = id => selected.communityId === id;

  const navigateTo = userOrCommunity => {
    if (userOrCommunity.userId) goToUserFeed(userOrCommunity.userId);
    if (userOrCommunity.communityId) goToCommunity(userOrCommunity.communityId);
  };

  const editProfile = id => history.push(`/profile/${id}/edit`);

  const onEditCommunityClick = id => {
    history.push(`/community/${id}/edit`);
  };

  const [communityCreation, setCommunityCreation] = useState(false);
  const openCommunityCreationModal = () => setCommunityCreation(true);
  const closeCommunityCreationModal = () => setCommunityCreation(false);

  const { addCommunity, editCommunity } = useCommunitiesMock();

  const createCommunity = data => {
    const newCommunity = addCommunity(data);
    goToCommunity(newCommunity.communityId);
  };

  return (
    <FeedLayout
      sideMenu={
        <CommunitySideMenu
          onClickNewsFeed={goToNewsFeed}
          onClickExplore={goToExplore}
          newsFeedActive={isNewsFeedActive}
          exploreActive={isExploreActive}
          onClickCreateCommunity={openCommunityCreationModal}
          onClickCommunity={goToCommunity}
          getIsCommunityActive={getIsCommunityActive}
          onSearchResultCommunityClick={goToCommunity}
          searchInputPlaceholder="Search"
          showCreateCommunityButton
        />
      }
    >
      <Switch>
        <Route path="/" exact>
          <Feed
            targetType={EkoPostTargetType.MyFeed}
            onPostAuthorClick={navigateTo}
            editProfile={editProfile}
            blockRouteChange={blockRouteChange}
            showPostCompose
          />
        </Route>
        <Route path="/news" exact>
          <Feed
            targetType={EkoPostTargetType.GlobalFeed}
            onPostAuthorClick={navigateTo}
            blockRouteChange={blockRouteChange}
            showPostCompose
            goToExplore={goToExplore}
            emptyFeedIcon={<EmptyFeedIcon />}
          />
        </Route>
        <Route path="/explore" exact>
          <ExploreHome
            onSearchResultCommunityClick={navigateTo}
            onRecomendedCommunityClick={navigateTo}
            onTrendingCommunityClick={navigateTo}
            onCreateCommunityClick={openCommunityCreationModal}
            onCategoryClick={onCategoryClick}
          />
        </Route>
        <Route path="/category/:categoryId">
          <CategoryPage
            categoryId={categoryId}
            onCommunityClick={navigateTo}
            onHeaderBackButtonClick={goToExplore}
            onPostAuthorClick={navigateTo}
            onEditCommunityClick={onEditCommunityClick}
          />
        </Route>
        <Route path="/community/:communityId/edit">
          <CommunitySettings
            communityId={communityId}
            onSubmit={editCommunity}
            onMemberClick={navigateTo}
          />
        </Route>
        <Route path="/community/:communityId">
          <CommunityPage communityId={communityId} blockRouteChange={blockRouteChange} />
        </Route>
        <Route path="/profile/:userId" exact>
          <Feed
            targetType={EkoPostTargetType.MyFeed}
            onPostAuthorClick={navigateTo}
            userId={userId}
            editProfile={editProfile}
            blockRouteChange={blockRouteChange}
          />
        </Route>
        <Route path="/profile/:userId/edit">
          <ProfileSettings userId={userId} />
        </Route>
      </Switch>
      <CommunityCreationModal
        isOpen={communityCreation}
        onSubmit={createCommunity}
        onClose={closeCommunityCreationModal}
      />
    </FeedLayout>
  );
};

export const App = () => {
  return (
    <Router>
      <Pages />
    </Router>
  );
};
