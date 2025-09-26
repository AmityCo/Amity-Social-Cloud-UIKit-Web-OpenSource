import React from 'react';
import {
  AmityCommunitySetupPageMode,
  CommunitySetupPageProps,
  CommunitySetupPage,
  MemberCommunitySetup,
} from './CommunitySetupPage';

export default {
  title: 'v4-social/pages/CommunitySetupPage',
};

export const CommunitySetupPageStories = {
  render: () => {
    const props: CommunitySetupPageProps = {
      mode: AmityCommunitySetupPageMode.CREATE,
    };
    return <CommunitySetupPage {...props} />;
  },
};
