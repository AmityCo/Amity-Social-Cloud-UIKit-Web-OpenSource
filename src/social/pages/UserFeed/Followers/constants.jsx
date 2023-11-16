import React from 'react';
import { FormattedMessage } from 'react-intl';

export const FollowersTabs = {
  FOLLOWINGS: 'Followings',
  FOLLOWERS: 'Followers',
};

export const PENDING_TAB = 'Pending';

export const tabs = [
  { value: FollowersTabs.FOLLOWINGS, label: <FormattedMessage id="tabs.followings" /> },
  { value: FollowersTabs.FOLLOWERS, label: <FormattedMessage id="tabs.followers" /> },
  { value: PENDING_TAB, label: <FormattedMessage id="tabs.pending" /> },
];
