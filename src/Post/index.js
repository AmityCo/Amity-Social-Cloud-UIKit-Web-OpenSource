import React, { useState, useEffect } from 'react';
import Truncate from 'react-truncate-markup';

import { customizableComponent } from '../hoks/customization';

import Linkify from '../commonComponents/Linkify';
import Modal from '../commonComponents/Modal';
import Options from '../commonComponents/Options';
import { confirm } from '../commonComponents/Confirm';

import EngagementBar from '../EngagementBar';
import Avatar from '../Avatar';
import Files from '../Files';
import Images from '../Images';
import PostCompose from '../PostCompose';

import {
  PostContainer,
  PostHeader,
  PostContent,
  AuthorName,
  PostDate,
  PostInfo,
  ReadMoreButton,
} from './styles';

const TEXT_POST_MAX_LINES = 8;
const CONTENT_POST_MAX_LINES = 3;

const usePostEditingModal = ({ post, onEdit }) => {
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

  return { openEditingPostModal, postEditingModal };
};

const Post = ({
  className,
  post,
  post: { author, text, files = [], images = [] },
  onEdit,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const expand = () => setIsExpanded(true);

  const { openEditingPostModal, postEditingModal } = usePostEditingModal({ post, onEdit });

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
        <>
          <Avatar />
          <PostInfo>
            <AuthorName>{author.name}</AuthorName>
            <PostDate>30 min</PostDate>
          </PostInfo>
        </>
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

export default customizableComponent('Post')(Post);
