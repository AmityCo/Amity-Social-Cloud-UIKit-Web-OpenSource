import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { PollStatus, PostDataType } from '@amityco/js-sdk';
import customizableComponent from '~/core/hocs/customization';
import withSDK from '~/core/hocs/withSDK';
import usePost from '~/social/hooks/usePost';
import usePoll from '~/social/hooks/usePoll';
import { usePostRenderer } from '~/social/providers/PostRendererProvider';
import DefaultPostRenderer from './DefaultPostRenderer';
import PostErrorBoundary from './PostErrorBoundary';
import UnknownPostRenderer from './UnknownPostRenderer';

const Post = ({
  postId,
  currentUserId,
  userRoles,
  className,
  hidePostTarget,
  readonly,
  handleCopyPostPath,
  handleCopyCommentPath,
}) => {
  const renderers = usePostRenderer();

  const { isPostReady, post, ...others } = usePost(postId);
  const pollPost = others.childrenPosts.find(
    (childPost) => childPost.dataType === PostDataType.PollPost,
  );

  const { handleClosePoll, poll } = usePoll(pollPost?.data?.pollId);
  const isPollClosed = poll.status === PollStatus.Closed;

  if (!isPostReady) {
    return <DefaultPostRenderer loading />;
  }

  const Renderer = renderers[post.dataType] ?? UnknownPostRenderer;

  return (
    <PostErrorBoundary>
      <Renderer
        {...others}
        handleClosePoll={handleClosePoll}
        isPollClosed={isPollClosed}
        poll={poll}
        className={className}
        currentUserId={currentUserId}
        hidePostTarget={hidePostTarget}
        post={post}
        userRoles={userRoles}
        readonly={readonly}
        handleCopyPostPath={handleCopyPostPath}
        handleCopyCommentPath={handleCopyCommentPath}
      />
    </PostErrorBoundary>
  );
};

Post.propTypes = {
  postId: PropTypes.string.isRequired,
  currentUserId: PropTypes.string,
  className: PropTypes.string,
  userRoles: PropTypes.arrayOf(PropTypes.string),
  hidePostTarget: PropTypes.bool,
  readonly: PropTypes.bool,
  handleCopyPostPath: PropTypes.func,
  handleCopyCommentPath: PropTypes.func,
};

Post.defaultProps = {
  currentUserId: '',
  userRoles: [],
  className: '',
  hidePostTarget: false,
};

export default memo(withSDK(customizableComponent('Post', Post)));
