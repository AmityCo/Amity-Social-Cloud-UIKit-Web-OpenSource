import PropTypes from 'prop-types';
import React from 'react';
import customizableComponent from '~/core/hocs/customization';
import withSDK from '~/core/hocs/withSDK';
import usePost from '~/social/hooks/usePost';
import { usePostRenderer } from '~/social/providers/PostRendererProvider';
import PostErrorBoundary from './PostErrorBoundary';
import UnknownPostRenderer from './UnknownPostRenderer';

const Post = ({
  postId,
  currentUserId,
  userRoles,
  noInteractionMessage,
  className,
  hidePostTarget,
}) => {
  const renderers = usePostRenderer();

  const { post, ...others } = usePost(postId);

  if (!post?.postId) {
    return null;
  }

  const Renderer = renderers[post?.dataType] ?? UnknownPostRenderer;

  return (
    <PostErrorBoundary>
      <Renderer
        {...others}
        className={className}
        currentUserId={currentUserId}
        hidePostTarget={hidePostTarget}
        noInteractionMessage={noInteractionMessage}
        post={post}
        userRoles={userRoles}
      />
    </PostErrorBoundary>
  );
};

Post.propTypes = {
  postId: PropTypes.string.isRequired,
  currentUserId: PropTypes.string,
  className: PropTypes.string,
  userRoles: PropTypes.arrayOf(PropTypes.string),
  noInteractionMessage: PropTypes.string,
  hidePostTarget: PropTypes.bool,
};

Post.defaultProps = {
  currentUserId: '',
  userRoles: [],
  noInteractionMessage: null,
  className: '',
  hidePostTarget: false,
};

export default withSDK(customizableComponent('Post', Post));
