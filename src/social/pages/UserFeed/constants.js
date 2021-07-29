import React from 'react';
import { FormattedMessage } from 'react-intl';

export const UserFeedTabs = {
  TIMELINE: 'TIMELINE',
  FOLLOWERS: 'FOLLOWERS',
};

export const tabs = [
  { value: UserFeedTabs.TIMELINE, label: <FormattedMessage id="tabs.timeline" /> },
  { value: UserFeedTabs.FOLLOWERS, label: <FormattedMessage id="tabs.followers" /> },
];
