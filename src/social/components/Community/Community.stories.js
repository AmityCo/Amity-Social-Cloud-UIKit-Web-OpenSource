import React, { useState } from 'react';
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
import FeedSideMenu, { SELECTION_TYPES } from '~/social/components/FeedSideMenu';

import Feed from '~/social/components/Feed';
import ExploreHome from '~/social/components/ExploreHome';
import CategoryPage from '~/social/components/ExploreHome/CategoryPage';
import CommunityCreationModal from '~/social/components/CommunityCreationModal';
import CommunitySettings from '~/social/components/CommunitySettings';
import { EmptyFeedIcon } from './styles';

import { useCommunitiesMock } from '~/mock';
import CommunityFeed from '.';

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
    news: SELECTION_TYPES.NEWS_FEED,
    explore: SELECTION_TYPES.EXPLORE,
    category: SELECTION_TYPES.EXPLORE,
  };

  const selected = {
    type: pathToSelectionType[location.pathname.split('/')[1]],
    communityId,
  };

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
        <FeedSideMenu
          selected={selected}
          onCreateCommunityClick={openCommunityCreationModal}
          onCommunityClick={goToCommunity}
          onNewsFeedClick={goToNewsFeed}
          onExploreClick={goToExplore}
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
          <CommunityFeed
            onEditCommunityClick={onEditCommunityClick}
            key={communityId}
            communityId={communityId}
            onPostAuthorClick={navigateTo}
            onMemberClick={navigateTo}
            blockRouteChange={blockRouteChange}
          />
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
