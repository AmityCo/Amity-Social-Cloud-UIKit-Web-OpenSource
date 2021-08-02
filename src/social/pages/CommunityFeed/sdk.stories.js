import React from 'react';
import { FormattedMessage } from 'react-intl';

import useOneCommunity from '~/mock/useOneCommunity';

import CommunityProfilePage from '.';

export default {
  title: 'SDK Connected/Social/Pages',
};

export const SDKCommunityProfilePage = props => {
  const [community, isLoading] = useOneCommunity();
  if (isLoading)
    return (
      <p>
        <FormattedMessage id="loading" />
      </p>
    );
  return <CommunityProfilePage communityId={community.communityId} {...props} />;
};

SDKCommunityProfilePage.storyName = 'Community Profile Page';
