import { EkoCommunityUserMembership, EkoPostTargetType } from 'eko-sdk';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import ConditionalRender from '~/core/components/ConditionalRender';
import { confirm } from '~/core/components/Confirm';
import Modal from '~/core/components/Modal';
import { notification } from '~/core/components/Notification';
import { isModerator } from '~/helpers/permissions';
import EngagementBar from '~/social/components/EngagementBar';
import ChildrenContent from '~/social/components/post/ChildrenContent';
import PostEditor from '~/social/components/post/Editor';
import Header from '~/social/components/post/Header';
import Content from '~/social/components/post/Post/Content';
import useCommunityMembers from '~/social/hooks/useCommunityMembers';
import { OptionMenu, PostContainer, PostHeadContainer } from './styles';

// Number of lines to show in a text post before truncating.
const MAX_TEXT_LINES_DEFAULT = 8;
const MAX_TEXT_LINES_WITH_CHILDREN = 3;

const DefaultPostRenderer = ({
  childrenPosts = [],
  className,
  currentUserId,
  handleDeletePost,
  handleReportPost,
  hidePostTarget,
  noInteractionMessage,
  post,
  userRoles,
}) => {
  const { formatMessage } = useIntl();
  const [isEditing, setIsEditing] = useState(false);
  const openEditingPostModal = () => setIsEditing(true);
  const closeEditingPostModal = () => setIsEditing(false);

  const { data, dataType, postedUserId, postId, targetId, targetType } = post;
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
    <PostContainer className={className}>
      <PostHeadContainer>
        <Header hidePostTarget={hidePostTarget} postId={postId} />
        <OptionMenu options={allOptions} />
      </PostHeadContainer>

      <Content data={data} dataType={dataType} postMaxLines={postMaxLines} />

      <ConditionalRender condition={hasChildrenPosts}>
        <ChildrenContent>{childrenContent}</ChildrenContent>
      </ConditionalRender>

      <EngagementBar noInteractionMessage={noInteractionMessage} postId={postId} />

      <ConditionalRender condition={isEditing}>
        <Modal onCancel={closeEditingPostModal} title={formatMessage({ id: 'post.editPost' })}>
          <PostEditor onSave={closeEditingPostModal} postId={postId} />
        </Modal>
      </ConditionalRender>
    </PostContainer>
  );
};

DefaultPostRenderer.propTypes = {
  childrenPosts: PropTypes.array,
  className: PropTypes.string,
  currentUserId: PropTypes.string,
  handleDeletePost: PropTypes.func.isRequired,
  handleReportPost: PropTypes.func.isRequired,
  hidePostTarget: PropTypes.bool,
  noInteractionMessage: PropTypes.string,
  post: PropTypes.shape({
    data: PropTypes.shape({}),
    dataType: PropTypes.string,
    postedUserId: PropTypes.string,
    postId: PropTypes.string,
    targetId: PropTypes.string,
    targetType: PropTypes.string,
  }).isRequired,
  userRoles: PropTypes.arrayOf(PropTypes.string),
};

DefaultPostRenderer.defaultProps = {
  childrenPosts: [],
  className: '',
  currentUserId: '',
  hidePostTarget: false,
  noInteractionMessage: null,
  userRoles: [],
};

export default React.memo(DefaultPostRenderer);
