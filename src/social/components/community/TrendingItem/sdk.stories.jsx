import React from 'react';
import { FormattedMessage } from 'react-intl';

import useOneCommunity from '~/mock/useOneCommunity';
import TrendingItem from '.';

export default {
  title: 'SDK Connected/Social/Community',
};

export const SdkTrendingItem = (props) => {
  const [community, isLoading] = useOneCommunity();
  if (isLoading)
    return (
      <p>
        <FormattedMessage id="loading" />
      </p>
    );
  return <TrendingItem communityId={community.communityId} {...props} />;
};

SdkTrendingItem.storyName = 'Trending Item';

SdkTrendingItem.argTypes = {
  onClick: { action: 'onClick(communityId)' },
};
