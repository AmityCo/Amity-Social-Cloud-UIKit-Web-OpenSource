import React from 'react';
import { FormattedMessage } from 'react-intl';

export const UserFeedTabs = {
  TIMELINE: 'TIMELINE',
};

export const tabs = [
  { value: UserFeedTabs.TIMELINE, label: <FormattedMessage id="tabs.timeline" /> },
];
