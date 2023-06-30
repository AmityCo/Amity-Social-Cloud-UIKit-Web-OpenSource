import React from 'react';
import { FormattedMessage } from 'react-intl';

export const UserFeedTabs = {
  NEWSFEED: 'NEWSFEED',
  EXPLORE: 'EXPLORE',
  COMMUNITIES: 'COMMUNITIES',
};

export const tabs = [
  { value: UserFeedTabs.NEWSFEED, label: <FormattedMessage id="tabs.NEWSFEED" /> },
  { value: UserFeedTabs.EXPLORE, label: <FormattedMessage id="tabs.EXPLORE" /> },
  { value: UserFeedTabs.COMMUNITIES, label: <FormattedMessage id="tabs.COMMUNITIES" /> },
];
