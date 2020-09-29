import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { PostRepository, UserRepository } from 'eko-sdk';
import Truncate from 'react-truncate-markup';
import cx from 'classnames';
import { customizableComponent } from 'hocs/customization';
import useLiveObject from 'hooks/useLiveObject';
import Linkify from 'components/Linkify';
import Modal from 'components/Modal';
import Time from 'components/Time';
import { confirm } from 'components/Confirm';

import EngagementBar from 'components/EngagementBar';
import Avatar from 'components/Avatar';
import Files from 'components/Files';
import Images from 'components/Images';
import PostComposeEdit from 'components/PostComposeEdit';

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

const Post = ({ postId, onPostAuthorClick = () => {}, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const openEditingPostModal = () => setIsEditing(true);
  const closeEditingPostModal = () => setIsEditing(false);
  const expand = () => setIsExpanded(true);

  const post = useLiveObject(() => PostRepository.postForId(postId), {});
  const isPostReady = !!post.postId;
  const { postedUserId, createdAt, data = {} } = post;
  const { text = '', files = [], images = [] } = data;

  const postAuthor = useLiveObject(
    () => userRepo.userForId(postedUserId),
    {},
    () => !postedUserId,
    [postedUserId],
  );

  const handleDeletePost = async () => {
    try {
      const isDeletedSuccess = await postRepo.deletePost(postId);
      if (!isDeletedSuccess) {
        throw new Error('Unable to to delete post');
      }
    } catch (error) {
      // TODO - show an error saying that post could not be deleted.
    }
  };

  const postEditingModal = isEditing ? (
    <Modal title="Edit post" onCancel={closeEditingPostModal}>
      <PostComposeEdit post={post} onSave={closeEditingPostModal} />
    </Modal>
  ) : null;

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
      {postEditingModal}
      <PostHeader>
        <PostAuthor onClick={() => onPostAuthorClick(postAuthor.userId)}>
          <Avatar avatar={postAuthor.avatar} />
          <PostInfo>
            <AuthorName>{postAuthor.displayName}</AuthorName>
            <Time date={createdAt} />
          </PostInfo>
        </PostAuthor>
        {isPostReady && (
          <Options
            options={[
              { name: 'Edit post', action: openEditingPostModal },
              { name: 'Delete post', action: confirmDeleting },
            ]}
          />
        )}
      </PostHeader>
      <Linkify>
        {isExpanded ? (
          <PostContent>{text}</PostContent>
        ) : (
          <Truncate
            lines={postMaxLines}
            ellipsis={<ReadMoreButton onClick={expand}>...Read more</ReadMoreButton>}
          >
            <PostContent>{text}</PostContent>
          </Truncate>
        )}
      </Linkify>
      <Files files={files} />
      <Images images={images} />
      <EngagementBar postId={postId} />
    </PostContainer>
  );
};

Post.propTypes = {
  postId: PropTypes.string.isRequired,
  onPostAuthorClick: PropTypes.func,
  className: PropTypes.string,
};

export default customizableComponent('Post', Post);
