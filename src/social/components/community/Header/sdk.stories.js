import React from 'react';
import { FormattedMessage } from 'react-intl';

import useOneCommunity from '~/mock/useOneCommunity';

import UiKitCommunityHeader from '.';

export default {
  title: 'SDK Connected/Social/Community',
};

export const SDKCommunityHeader = ({ communityId, isActive, isSearchResult, onClick }) => {
  const [community, isLoading] = useOneCommunity(communityId);
  if (isLoading)
    return (
      <p>
        <FormattedMessage id="loading" />
      </p>
    );
  return (
    <UiKitCommunityHeader
      communityId={community.communityId}
      isActive={isActive}
      onClick={onClick}
      isSearchResult={isSearchResult}
    />
  );
};

SDKCommunityHeader.storyName = 'Header';

SDKCommunityHeader.args = {
  communityId: '',
  isActive: false,
  isSearchResult: false,
};

SDKCommunityHeader.argTypes = {
  communityId: { control: { type: 'text' } },
  isActive: { control: { type: 'boolean' } },
  isSearchResult: { control: { type: 'boolean' } },
  onClick: { action: 'onClick()' },
};
