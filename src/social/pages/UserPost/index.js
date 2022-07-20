import React from 'react';
import PropTypes from 'prop-types';

import withSDK from '~/core/hocs/withSDK';
import * as utils from '~/helpers/utils';

import UserInfo from '~/social/components/UserInfo';
import Post from '~/social/components/post/Post';

import { Wrapper } from './styles';

const UserPostPage = ({
  userId,
  postId,
  commentId,
  currentUserId,
  networkSettings,
  readonly,
  handleCopyPostPath,
  handleCopyCommentPath,
}) => {
  const isPrivateNetwork = utils.isPrivateNetwork(networkSettings);

  return (
    <Wrapper>
      <UserInfo
        key={userId}
        userId={userId}
        currentUserId={currentUserId}
        isPrivateNetwork={isPrivateNetwork}
      />
      <Post
        key={postId}
        postId={postId}
        hidePostTarget={false}
        readonly={readonly}
        handleCopyPostPath={handleCopyPostPath}
        handleCopyCommentPath={handleCopyCommentPath}
      />
    </Wrapper>
  );
};

UserPostPage.propTypes = {
  userId: PropTypes.string.isRequired,
  postId: PropTypes.string.isRequired,
  commentId: PropTypes.string,
  currentUserId: PropTypes.string.isRequired,
  networkSettings: PropTypes.object.isRequired,
  readonly: PropTypes.bool,
  handleCopyPostPath: PropTypes.func,
  handleCopyCommentPath: PropTypes.func,
};

export default withSDK(UserPostPage);
