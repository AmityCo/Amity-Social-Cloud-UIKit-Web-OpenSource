import React from 'react';
import { FormattedMessage } from 'react-intl';

import useOneCommunity from '~/mock/useOneCommunity';

import UiKitCommunityHeader from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'SDK Connected/Social/Community',
};

export const SDKCommunityHeader = {
  render: () => {
    const [{ communityId, isActive, isSearchResult, onClick }] = useArgs();
    const [community, isLoading] = useOneCommunity(communityId);
    if (isLoading)
      return (
        <p>
          <FormattedMessage id="loading" />
        </p>
      );
    if (!community && isLoading === false) return <>No community found</>;
    return (
      <UiKitCommunityHeader
        communityId={community?.communityId}
        isActive={isActive}
        isSearchResult={isSearchResult}
        onClick={onClick}
      />
    );
  },

  name: 'Header',

  args: {
    communityId: '',
    isActive: false,
    isSearchResult: false,
  },

  argTypes: {
    communityId: { control: { type: 'text' } },
    isActive: { control: { type: 'boolean' } },
    isSearchResult: { control: { type: 'boolean' } },
    onClick: { action: 'onClick()' },
  },
};
