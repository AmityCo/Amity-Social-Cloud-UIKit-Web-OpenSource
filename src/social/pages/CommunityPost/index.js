import React from 'react';
import PropTypes from 'prop-types';

import withSDK from '~/core/hocs/withSDK';
import CommunityInfo from '~/social/components/CommunityInfo';
import Post from '~/social/components/post/Post';

import { Wrapper } from './styles';

const CommunityPost = ({
  postId,
  commentId,
  communityId,
  readonly,
  handleCopyPostPath,
  handleCopyCommentPath,
}) => {
  return (
    <Wrapper>
      <CommunityInfo communityId={communityId} />

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

CommunityPost.propTypes = {
  commentId: PropTypes.string,
  postId: PropTypes.string.isRequired,
  communityId: PropTypes.string.isRequired,
  currentUserId: PropTypes.string.isRequired,
  readonly: PropTypes.bool,
  handleCopyPostPath: PropTypes.func,
  handleCopyCommentPath: PropTypes.func,
};

export default withSDK(CommunityPost);
