import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { useIntl, FormattedMessage } from 'react-intl';
import { EkoPostTargetType, EkoCommunityUserMembership } from 'eko-sdk';

import { isModerator } from '~/helpers/permissions';
import { confirm } from '~/core/components/Confirm';
import { notification } from '~/core/components/Notification';
import usePost from '~/social/hooks/usePost';
import useCommunityMembers from '~/social/hooks/useCommunityMembers';

import withSDK from '~/core/hocs/withSDK';
import customizableComponent from '~/core/hocs/customization';
import ConditionalRender from '~/core/components/ConditionalRender';
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
  const { data, dataType, postedUserId, targetId, targetType } = post;
  const { members } = useCommunityMembers(targetId);

  const isAdmin = isModerator(userRoles);
  const isMyPost = currentUserId === postedUserId;
  const isMember =
    members.find(member => member.userId === currentUserId)?.communityMembership ===
    EkoCommunityUserMembership.Member;
  const isCommunityPost = targetType === EkoPostTargetType.CommunityFeed;

  const confirmDeletePost = () =>
    confirm({
      title: formatMessage({ id: 'post.deletePost' }),
      content: formatMessage({ id: 'post.confirmDelete' }),
      okText: formatMessage({ id: 'delete' }),
      onOk: handleDeletePost,
    });

  const onReportClick = () => {
    handleReportPost();
    notification.success({
      content: <FormattedMessage id="report.reportSent" />,
    });
  };

  const allOptions = [
    (isAdmin || (isMyPost && (!isCommunityPost || isMember))) && {
      name: 'post.editPost',
      action: openEditingPostModal,
    },
    (isAdmin || (isMyPost && (!isCommunityPost || isMember))) && {
      name: 'post.deletePost',
      action: confirmDeletePost,
    },
    !isMyPost &&
      (isAdmin || !isCommunityPost || isMember) && {
        name: 'post.reportPost',
        action: onReportClick,
      },
  ].filter(Boolean);

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
        <OptionMenu options={allOptions} />
      </PostHeadContainer>

      <Content dataType={dataType} data={data} postMaxLines={postMaxLines} />

      <ConditionalRender condition={hasChildrenPosts}>
        <ChildrenContent>{childrenContent}</ChildrenContent>
      </ConditionalRender>

      <EngagementBar postId={postId} noInteractionMessage={noInteractionMessage} />

      <ConditionalRender condition={isEditing}>
        <Modal title={formatMessage({ id: 'post.editPost' })} onCancel={closeEditingPostModal}>
          <PostEditor postId={postId} onSave={closeEditingPostModal} />
        </Modal>
      </ConditionalRender>
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
