import React from 'react';
import { FormattedMessage } from 'react-intl';

import useOneCommunity from '~/mock/useOneCommunity';

import UiKitCommunityInfo from '.';

export default {
  title: 'SDK Connected/Social/Community',
};

export const SDKCommunityInfo = () => {
  const [community, isLoading] = useOneCommunity();
  if (isLoading)
    return (
      <p>
        <FormattedMessage id="loading" />
      </p>
    );
  return <UiKitCommunityInfo communityId={community.communityId} />;
};

SDKCommunityInfo.storyName = 'Informations';
