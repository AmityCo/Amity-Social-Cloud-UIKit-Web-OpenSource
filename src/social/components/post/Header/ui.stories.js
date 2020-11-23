import React from 'react';

import PostHeader from './UIPostHeader';

export default {
  title: 'Ui Only/Social/Post',
};

export const UIPostHeader = props => <PostHeader {...props} />;

UIPostHeader.storyName = 'Header';

UIPostHeader.args = {
  avatarFileUrl: '',
  postAuthorName: 'Web-Test',
  postTargetName: '',
  timeAgo: new Date(),
  isModerator: false,
  hidePostTarget: false,
};

UIPostHeader.argTypes = {
  onClickUser: { action: 'onClickUser(userId)' },
};
