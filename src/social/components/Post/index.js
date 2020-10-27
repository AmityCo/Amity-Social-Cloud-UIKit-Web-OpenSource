import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { PostRepository, UserRepository } from 'eko-sdk';
import Truncate from 'react-truncate-markup';
import cx from 'classnames';

import ConditionalRender from '~/core/components/ConditionalRender';
import Modal from '~/core/components/Modal';
import Time from '~/core/components/Time';

import PostEditor from '~/social/components/PostEditor';
import Linkify from '~/core/components/Linkify';
import PostImage from '~/core/components/Uploaders/Image';
import PostFile from '~/core/components/Uploaders/File';
import EngagementBar from '~/social/components/EngagementBar';
import { confirm } from '~/core/components/Confirm';
import Avatar from '~/core/components/Avatar';
import useLiveObject from '~/core/hooks/useLiveObject';
import withSDK from '~/core/hocs/withSDK';
import customizableComponent from '~/core/hocs/customization';

import {
  PostContainer,
  PostHeader,
  PostAuthor,
  PostContent,
  AuthorName,
  PostInfo,
  ReadMoreButton,
  Options,
} from './styles';

const TEXT_POST_MAX_LINES = 8;
const CONTENT_POST_MAX_LINES = 3;

const userRepo = new UserRepository();

const DEFAULT_DISPLAY_NAME = 'Anonymous';

// TODO: refactor this component
const Post = ({ postId, currentUserId, onPostAuthorClick = () => {}, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const openEditingPostModal = () => setIsEditing(true);
  const closeEditingPostModal = () => setIsEditing(false);
  const expand = () => setIsExpanded(true);

  const post = useLiveObject(() => PostRepository.postForId(postId), [postId]);
  const isPostReady = !!post.postId;
  const { postedUserId, createdAt, data = {} } = post;
  const { text = '', files = [], images = [], fileId } = data;

  const isMyPost = currentUserId === postedUserId;

  const postAuthor = useLiveObject(() => userRepo.userForId(postedUserId), [postedUserId]);

  const handleDeletePost = async () => {
    try {
      const isDeletedSuccess = await PostRepository.deletePost(postId);
      if (!isDeletedSuccess) {
        throw new Error('Unable to to delete post');
      }
    } catch (error) {
      // TODO - show an error saying that post could not be deleted.
    }
  };

  const confirmDeleting = () =>
    confirm({
      title: 'Delete post',
      content:
        'This post will be permanently deleted. You’ll no longer to see and find this post. Continue?',
      okText: 'Delete',
      onOk: handleDeletePost,
    });

  const haveContent = files.length > 0 || images.length > 0;
  const postMaxLines = haveContent ? CONTENT_POST_MAX_LINES : TEXT_POST_MAX_LINES;

  return (
    <PostContainer className={cx('post', className)}>
      <ConditionalRender condition={isEditing}>
        <Modal title="Edit post" onCancel={closeEditingPostModal}>
          <PostEditor post={post} onSave={closeEditingPostModal} />
        </Modal>
      </ConditionalRender>
      <PostHeader>
        <PostAuthor onClick={() => onPostAuthorClick({ userId: postAuthor.userId })}>
          <Avatar avatar={postAuthor.avatar} />
          <PostInfo>
            <AuthorName>{postAuthor.displayName || DEFAULT_DISPLAY_NAME}</AuthorName>
            <Time date={createdAt} />
          </PostInfo>
        </PostAuthor>
        <ConditionalRender condition={isPostReady}>
          {isMyPost && (
            <Options
              options={[
                { name: 'Edit post', action: openEditingPostModal },
                { name: 'Delete post', action: confirmDeleting },
              ]}
            />
          )}
        </ConditionalRender>
      </PostHeader>
      <Linkify>
        <ConditionalRender condition={isExpanded}>
          <PostContent>{text}</PostContent>
          <Truncate
            lines={postMaxLines}
            ellipsis={<ReadMoreButton onClick={expand}>...Read more</ReadMoreButton>}
          >
            <PostContent>{text}</PostContent>
          </Truncate>
        </ConditionalRender>
      </Linkify>
      <ConditionalRender condition={fileId && post.dataType === 'image'}>
        <PostImage fileId={fileId} fullSize />
      </ConditionalRender>
      <ConditionalRender condition={fileId && post.dataType === 'file'}>
        <PostFile fileId={fileId} fullSize />
      </ConditionalRender>
      <EngagementBar postId={postId} />
    </PostContainer>
  );
};

Post.propTypes = {
  postId: PropTypes.string.isRequired,
  currentUserId: PropTypes.string,
  onPostAuthorClick: PropTypes.func,
  className: PropTypes.string,
};

export default withSDK(customizableComponent('Post', Post));
