import React from 'react';
import { FormattedMessage } from 'react-intl';

import useOneUser from '~/mock/useOneUser';
import useOneCommunity from '~/mock/useOneCommunity';

import UiKitFeed from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'SDK Connected/Social/Feed',
};

export const SDKMyFeed = {
  render: () => {
    const [{ showPostCreator }] = useArgs();
    return <UiKitFeed showPostCreator={showPostCreator} />;
  },
  name: 'My feed',

  args: {
    showPostCreator: true,
  },

  argTypes: {
    showPostCreator: { control: { type: 'boolean' } },
  },
};

export const SDKAnotherUsersFeed = {
  render: () => {
    const [{ customUserId, showPostCreator }] = useArgs();
    const user = useOneUser();
    if (!user)
      return (
        <p>
          <FormattedMessage id="loading" />
        </p>
      );

    return (
      <UiKitFeed
        targetType={'userFeed'}
        targetId={customUserId || user.userId}
        showPostCreator={showPostCreator}
      />
    );
  },

  name: 'User feed',

  args: {
    showPostCreator: false,
    customUserId: '',
  },

  argTypes: {
    showPostCreator: { control: { type: 'boolean' } },
    customUserId: { control: { type: 'text' } },
  },
};

export const SDKCommunityFeed = {
  render: () => {
    const [{ showPostCreator }] = useArgs();
    const [community, isLoading] = useOneCommunity();
    if (isLoading)
      return (
        <p>
          <FormattedMessage id="loading" />
        </p>
      );

    if (!community && isLoading === false) return <>No community found</>;

    return (
      <UiKitFeed
        targetType={'communityFeed'}
        targetId={community.communityId}
        showPostCreator={showPostCreator}
      />
    );
  },

  name: 'Community feed',

  args: {
    showPostCreator: true,
  },

  argTypes: {
    showPostCreator: { control: { type: 'boolean' } },
  },
};

export const SDKGlobalFeed = {
  render: () => {
    return <UiKitFeed targetType={'globalFeed'} />;
  },

  name: 'Global feed',

  args: {},
  argTypes: {},
};
