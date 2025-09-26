import React from 'react';
import { FormattedMessage } from 'react-intl';

export const MemberTabs = {
  MEMBERS: 'MEMBERS',
  MODERATORS: 'MODERATORS',
};

export const tabs = [
  { value: MemberTabs.MEMBERS, label: <FormattedMessage id="tabs.members" /> },
  { value: MemberTabs.MODERATORS, label: <FormattedMessage id="tabs.moderators" /> },
];
