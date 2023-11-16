import React from 'react';
import { FormattedMessage } from 'react-intl';

import { PostTargetType } from '@amityco/js-sdk';

import useOneUser from '~/mock/useOneUser';
import useOneCommunity from '~/mock/useOneCommunity';

import UiKitFeed from '.';

export default {
  title: 'SDK Connected/Social/Feed',
};

// You can show and hide the compose bar using the controls tab.
export const SDKMyFeed = ({ showPostCreator }) => <UiKitFeed showPostCreator={showPostCreator} />;

SDKMyFeed.storyName = 'My feed';

SDKMyFeed.args = {
  showPostCreator: true,
};

SDKMyFeed.argTypes = {
  showPostCreator: { control: { type: 'boolean' } },
};

// By default this uses a random user, who may have no posts on their feed.
// Try a different user with the controls tab.
export const SDKAnotherUsersFeed = ({ customUserId, showPostCreator }) => {
  const user = useOneUser();
  if (!user)
    return (
      <p>
        <FormattedMessage id="loading" />
      </p>
    );
  return (
    <UiKitFeed
      targetType={PostTargetType.UserFeed}
      targetId={customUserId || user.userId}
      showPostCreator={showPostCreator}
    />
  );
};

SDKAnotherUsersFeed.storyName = 'User feed';

SDKAnotherUsersFeed.args = {
  showPostCreator: false,
  customUserId: '',
};

SDKAnotherUsersFeed.argTypes = {
  showPostCreator: { control: { type: 'boolean' } },
  customUserId: { control: { type: 'text' } },
};

export const SDKCommunityFeed = ({ showPostCreator }) => {
  const [community, isLoading] = useOneCommunity();
  if (isLoading)
    return (
      <p>
        <FormattedMessage id="loading" />
      </p>
    );
  return (
    <UiKitFeed
      targetType={PostTargetType.CommunityFeed}
      targetId={community.communityId}
      showPostCreator={showPostCreator}
    />
  );
};

SDKCommunityFeed.storyName = 'Community feed';

SDKCommunityFeed.args = {
  showPostCreator: true,
};

SDKCommunityFeed.argTypes = {
  showPostCreator: { control: { type: 'boolean' } },
};
