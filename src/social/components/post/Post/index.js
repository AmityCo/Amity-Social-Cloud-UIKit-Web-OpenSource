import PropTypes from 'prop-types';
import React from 'react';
import customizableComponent from '~/core/hocs/customization';
import withSDK from '~/core/hocs/withSDK';
import usePost from '~/social/hooks/usePost';
import { usePostRenderer } from '~/social/providers/PostRendererProvider';
import PostErrorBoundary from './PostErrorBoundary';
import UnknownPostRenderer from './UnknownPostRenderer';

const Post = ({ postId, currentUserId, userRoles, className, hidePostTarget, readonly }) => {
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
        post={post}
        userRoles={userRoles}
        readonly={readonly}
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
};

Post.defaultProps = {
  currentUserId: '',
  userRoles: [],
  className: '',
  hidePostTarget: false,
};

export default withSDK(customizableComponent('Post', Post));
