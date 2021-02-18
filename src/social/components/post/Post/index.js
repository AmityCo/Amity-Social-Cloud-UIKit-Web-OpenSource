import PropTypes from 'prop-types';
import React from 'react';
import customizableComponent from '~/core/hocs/customization';
import withSDK from '~/core/hocs/withSDK';
import usePost from '~/social/hooks/usePost';
import { usePostRenderer } from '~/social/providers/PostRendererProvider';
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

  const usePostData = usePost(postId);

  if (!usePostData.post.postId) {
    return null;
  }

  const Renderer = renderers[usePostData.post.dataType] ?? UnknownPostRenderer;

  return (
    <Renderer
      {...usePostData}
      className={className}
      currentUserId={currentUserId}
      hidePostTarget={hidePostTarget}
      noInteractionMessage={noInteractionMessage}
      userRoles={userRoles}
    />
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
