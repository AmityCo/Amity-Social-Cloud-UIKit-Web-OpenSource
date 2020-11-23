import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { useIntl } from 'react-intl';
import { isModerator } from '~/helpers/permissions';
import { confirm } from '~/core/components/Confirm';
import usePost from '~/social/hooks/usePost';
import withSDK from '~/core/hocs/withSDK';
import customizableComponent from '~/core/hocs/customization';
import Modal from '~/core/components/Modal';
import PostEditor from '~/social/components/post/Editor';
import EngagementBar from '~/social/components/EngagementBar';
import Header from '~/social/components/post/Header';
import Content from '~/social/components/post/Post/Content';
import ChildrenContent from '~/social/components/post/ChildrenContent';
import { PostContainer, PostHeadContainer, OptionMenu } from './styles';

// Number of lines to show in a text post before truncating.
const MAX_TEXT_LINES_DEFAULT = 8;
const MAX_TEXT_LINES_WITH_CHILDREN = 3;

const Post = ({
  postId,
  currentUserId,
  userRoles,
  noInteractionMessage,
  onClickUser,
  className,
  hidePostTarget,
}) => {
  const { formatMessage } = useIntl();
  const [isEditing, setIsEditing] = useState(false);
  const openEditingPostModal = () => setIsEditing(true);
  const closeEditingPostModal = () => setIsEditing(false);

  const { post, handleReportPost, handleDeletePost, childrenPosts = [] } = usePost(postId);
  const { data, dataType, postedUserId } = post;

  const isAdmin = isModerator(userRoles);
  const isMyPost = currentUserId === postedUserId;

  const confirmDeletePost = () =>
    confirm({
      title: formatMessage({ id: 'post.deletePost' }),
      content: formatMessage({ id: 'post.confirmDelete' }),
      okText: formatMessage({ id: 'delete' }),
      onOk: handleDeletePost,
    });

  const allOptions = {
    edit: { name: 'post.editPost', action: openEditingPostModal },
    delete: { name: 'post.deletePost', action: confirmDeletePost },
    report: { name: 'post.reportPost', action: handleReportPost },
  };

  const getActionOptions = () => {
    if (isAdmin) return Object.values(allOptions);
    if (isMyPost) return [allOptions.edit, allOptions.delete];
    return [allOptions.report];
  };

  const childrenContent = childrenPosts?.map(childPost => ({
    dataType: childPost.dataType,
    data: childPost.data,
  }));

  const hasChildrenPosts = childrenContent.length > 0;
  const postMaxLines = hasChildrenPosts ? MAX_TEXT_LINES_WITH_CHILDREN : MAX_TEXT_LINES_DEFAULT;

  return (
    <PostContainer className={cx('post', className)}>
      <PostHeadContainer>
        <Header postId={postId} onClickUser={onClickUser} hidePostTarget={hidePostTarget} />
        <OptionMenu options={getActionOptions()} />
      </PostHeadContainer>

      <Content dataType={dataType} data={data} postMaxLines={postMaxLines} />
      {hasChildrenPosts && <ChildrenContent>{childrenContent}</ChildrenContent>}

      <EngagementBar postId={postId} noInteractionMessage={noInteractionMessage} />

      {isEditing && (
        <Modal title={formatMessage({ id: 'post.editPost' })} onCancel={closeEditingPostModal}>
          <PostEditor postId={postId} onSave={closeEditingPostModal} />
        </Modal>
      )}
    </PostContainer>
  );
};

Post.propTypes = {
  postId: PropTypes.string.isRequired,
  currentUserId: PropTypes.string,
  onClickUser: PropTypes.func,
  className: PropTypes.string,
  userRoles: PropTypes.arrayOf(PropTypes.string),
  noInteractionMessage: PropTypes.string,
  hidePostTarget: PropTypes.bool,
};

Post.defaultProps = {
  currentUserId: '',
  userRoles: [],
  noInteractionMessage: null,
  onClickUser: () => {},
  className: '',
  hidePostTarget: false,
};

export default withSDK(customizableComponent('Post', Post));
