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

import Layout from '../Layout/';
import SideMenu, { SELECTION_TYPES } from '../SideMenu';

import UserFeed from './UserFeed';
import NewsFeed from './NewsFeed';
import CommunityFeed from './index';

export default {
  title: 'Community',
};

const Pages = () => {
  const location = useLocation();
  const history = useHistory();
  const { params = {} } = useRouteMatch('/community/:communityId') || {};
  const { communityId } = params;

  const goToCommunity = communityId => {
    history.push(`/community/${communityId}`);
  };

  const goToNewsFeed = () => history.push(`/news`);
  const goToExplore = () => history.push(`/explore`);

  const pathToSelectionType = {
    '/news': SELECTION_TYPES.NEWS_FEED,
    '/explore': SELECTION_TYPES.EXPLORE,
  };

  const selected = {
    type: pathToSelectionType[location.pathname],
    communityId,
  };

  return (
    <Layout
      sideMenu={
        <SideMenu
          selected={selected}
          onCreateCommunityClick={() => console.log('TODO')}
          onCommunityClick={goToCommunity}
          onNewsFeedClick={goToNewsFeed}
          onExploreClick={goToExplore}
        />
      }
    >
      <Switch>
        <Route path="/" exact>
          <UserFeed />
        </Route>
        <Route path="/news" exact>
          <NewsFeed />
        </Route>
        <Route path="/explore" exact>
          Explore page, in progress
        </Route>
        <Route path="/community/:communityId">
          <CommunityFeed key={communityId} communityId={communityId} />
        </Route>
      </Switch>
    </Layout>
  );
};

export const App = () => {
  return (
    <Router>
      <Pages />
    </Router>
  );
};
