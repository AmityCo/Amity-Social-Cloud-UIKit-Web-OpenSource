import React, { useEffect } from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';

import UiKitProvider from '../UiKitProvider';

import FeedLayout from '../FeedLayout/';
import FeedSideMenu, { SELECTION_TYPES } from '../FeedSideMenu';

import UserFeed from './UserFeed';
import NewsFeed from './NewsFeed';
import ExploreHome from '../ExploreHome';
import CategoryPage from '../ExploreHome/CategoryPage';
import CommunityFeed from './index';

export default {
  title: 'Community',
};

const Pages = () => {
  const location = useLocation();
  const history = useHistory();
  const { params = {} } =
    useRouteMatch('/community/:communityId') || useRouteMatch('/category/:categoryId') || {};
  const { communityId, categoryId } = params;

  const goToUserFeed = () => history.push(`/`);
  const goToNewsFeed = () => history.push(`/news`);
  const goToExplore = () => history.push(`/explore`);
  const onCategoryClick = categoryId => {
    history.push(`/category/${categoryId}`);
  };

  const goToCommunity = communityId => {
    history.push(`/community/${communityId}`);
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

  const onCreateCommunityClick = () => console.log('TODO');

  return (
    <FeedLayout
      sideMenu={
        <FeedSideMenu
          selected={selected}
          onCreateCommunityClick={onCreateCommunityClick}
          onCommunityClick={goToCommunity}
          onNewsFeedClick={goToNewsFeed}
          onExploreClick={goToExplore}
        />
      }
    >
      <Switch>
        <Route path="/" exact>
          <UserFeed onPostAuthorClick={navigateTo} />
        </Route>
        <Route path="/news" exact>
          <NewsFeed onPostAuthorClick={navigateTo} />
        </Route>
        <Route path="/explore" exact>
          <ExploreHome
            onSearchResultCommunityClick={navigateTo}
            onRecomendedCommunityClick={navigateTo}
            onTrendingCommunityClick={navigateTo}
            onCreateCommunityClick={onCreateCommunityClick}
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
        <Route path="/community/:communityId">
          <CommunityFeed
            key={communityId}
            communityId={communityId}
            onPostAuthorClick={navigateTo}
            onMemberClick={navigateTo}
          />
        </Route>
      </Switch>
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
