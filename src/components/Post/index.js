import React, { useState } from 'react';
import Truncate from 'react-truncate-markup';

import { customizableComponent } from 'hocs/customization';

import Linkify from 'components/Linkify';
import Modal from 'components/Modal';
import Time from 'components/Time';
import { confirm } from 'components/Confirm';

import EngagementBar from 'components/EngagementBar';
import Avatar from 'components/Avatar';
import Files from 'components/Files';
import Images from 'components/Images';
import PostCompose from 'components/PostCompose';

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

const Post = ({
  onPostAuthorClick,
  className,
  post,
  post: { author, text, files = [], images = [], createdAt },
  onEdit,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const expand = () => setIsExpanded(true);

  const [isEditing, setIsEditing] = useState(false);
  const openEditingPostModal = () => setIsEditing(true);
  const closeEditingPostModal = () => setIsEditing(false);

  const onSave = updatedPost => {
    onEdit(updatedPost);
    closeEditingPostModal();
  };

  const postEditingModal = isEditing ? (
    <Modal title="Edit post" onCancel={closeEditingPostModal}>
      <PostCompose edit post={post} onSave={onSave} />
    </Modal>
  ) : null;

  const confirmDeleting = () =>
    confirm({
      title: 'Delete post',
      content:
        'This post will be permanently deleted. You’ll no longer to see and find this post. Continue?',
      okText: 'Delete',
      onOk: onDelete,
    });

  const haveContent = files.length > 0 || images.length > 0;
  const postMaxLines = haveContent ? CONTENT_POST_MAX_LINES : TEXT_POST_MAX_LINES;

  return (
    <PostContainer className={className}>
      {postEditingModal}
      <PostHeader>
        <PostAuthor onClick={() => onPostAuthorClick(author)}>
          <Avatar avatar={author.avatar} />
          <PostInfo>
            <AuthorName>{author.name}</AuthorName>
            <Time date={createdAt} />
          </PostInfo>
        </PostAuthor>
        <Options
          options={[
            { name: 'Edit post', action: openEditingPostModal },
            { name: 'Delete post', action: confirmDeleting },
          ]}
        />
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
      <EngagementBar post={post} onPostEdit={onEdit} />
    </PostContainer>
  );
};

export default customizableComponent('Post', Post);
