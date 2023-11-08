import React from 'react';
import { FormattedMessage } from 'react-intl';

export const PageTabs = {
  EDIT_PROFILE: 'EDIT_PROFILE',
  MEMBERS: 'MEMBERS',
  // PERMISSIONS: 'PERMISSIONS',
};

export const tabs = [
  { value: PageTabs.EDIT_PROFILE, label: <FormattedMessage id="tabs.editProfile" /> },
  { value: PageTabs.MEMBERS, label: <FormattedMessage id="tabs.members" /> },
  // { value: PageTabs.PERMISSIONS, label: <FormattedMessage id="tabs.permissions" /> },
];
