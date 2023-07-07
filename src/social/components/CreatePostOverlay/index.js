import React from 'react';

import PropTypes from 'prop-types';
import { PostTargetType } from '@amityco/js-sdk';
import styled from 'styled-components';

import PostCreator from '~/social/components/post/Creator';

export const Overlay = styled.div`
  display: none;
  position: absolute;
  z-index: 1000;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;

  .postComposeBar {
    position: relative;
  }
`;

const CancelPost = styled.button`
  padding: 10px;
  text-transform: uppercase;
  font-weight: 600;
  color: #005850;
`;

const cancelPost = () => {
  document.getElementById('create-post-overlay').style.display = 'none';
  document.getElementById('ApplicationContainer').style.overflowY = 'auto';
};

const CreatePostOverlay = ({
  targetType = PostTargetType.MyFeed,
  targetId = '',
  onPostCreated,
}) => {
  const enablePostTargetPicker = targetType === PostTargetType.GlobalFeed;
  return (
    <Overlay id="create-post-overlay">
      <CancelPost id="post-cancel-button" onClick={cancelPost}>
        Cancel
      </CancelPost>
      <PostCreator
        data-qa-anchor="feed-post-creator-textarea"
        targetType={targetType}
        targetId={targetId}
        enablePostTargetPicker={enablePostTargetPicker}
        onCreateSuccess={onPostCreated && cancelPost()}
      />
    </Overlay>
  );
};

CreatePostOverlay.propTypes = {
  targetType: PropTypes.oneOf(Object.values(PostTargetType)),
  targetId: PropTypes.string,
  onPostCreated: PropTypes.func,
};

export default CreatePostOverlay;
