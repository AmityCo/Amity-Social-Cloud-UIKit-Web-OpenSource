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
  avatarFileUrl: { control: { type: 'text' } },
  postAuthorName: { control: { type: 'text' } },
  postTargetName: { control: { type: 'text' } },
  timeAgo: { control: { type: 'date' } },
  isModerator: { control: { type: 'boolean' } },
  hidePostTarget: { control: { type: 'boolean' } },
};
