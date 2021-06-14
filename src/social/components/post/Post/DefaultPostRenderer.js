import { CommunityUserMembership, PostTargetType } from '@amityco/js-sdk';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { confirm } from '~/core/components/Confirm';
import Modal from '~/core/components/Modal';
import { notification } from '~/core/components/Notification';
import Skeleton from '~/core/components/Skeleton';
import { isModerator } from '~/helpers/permissions';
import EngagementBar from '~/social/components/EngagementBar';
import ChildrenContent from '~/social/components/post/ChildrenContent';
import PostEditor from '~/social/components/post/Editor';
import Header from '~/social/components/post/Header';
import Content from '~/social/components/post/Post/Content';
import useCommunityOneMember from '~/social/hooks/useCommunityOneMember';
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
  handleUnreportPost,
  hidePostTarget,
  isFlaggedByMe,
  readonly,
  post,
  userRoles,
  loading,
}) => {
  const { formatMessage } = useIntl();
  const [isEditing, setIsEditing] = useState(false);
  const openEditingPostModal = () => setIsEditing(true);
  const closeEditingPostModal = () => setIsEditing(false);

  const { data, dataType, postedUserId, postId, targetId, targetType } = post;
  const { currentMember } = useCommunityOneMember(targetId, currentUserId);

  const isAdmin = isModerator(userRoles);
  const isMyPost = currentUserId === postedUserId;
  const isMember = currentMember?.communityMembership === CommunityUserMembership.Member;
  const isCommunityPost = targetType === PostTargetType.CommunityFeed;

  const confirmDeletePost = () =>
    confirm({
      title: formatMessage({ id: 'post.deletePost' }),
      content: formatMessage({ id: 'post.confirmDelete' }),
      okText: formatMessage({ id: 'delete' }),
      onOk: handleDeletePost,
    });

  const onReportClick = async () => {
    try {
      await handleReportPost();
      notification.success({
        content: <FormattedMessage id="report.reportSent" />,
      });
    } catch (error) {
      notification.error({ content: error.message });
    }
  };

  const onUnreportClick = async () => {
    try {
      await handleUnreportPost();
      notification.success({
        content: <FormattedMessage id="report.unreportSent" />,
      });
    } catch (error) {
      notification.error({ content: error.message });
    }
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
        name: isFlaggedByMe ? 'report.undoReport' : 'report.doReport',
        action: isFlaggedByMe ? onUnreportClick : onReportClick,
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
        <Header hidePostTarget={hidePostTarget} postId={postId} loading={loading} />
        {!loading && <OptionMenu options={allOptions} />}
      </PostHeadContainer>

      {loading ? (
        <>
          <div>
            <Skeleton style={{ fontSize: 8, maxWidth: 374 }} />
          </div>
          <div>
            <Skeleton style={{ fontSize: 8, maxWidth: 448 }} />
          </div>
          <div style={{ paddingBottom: 50 }}>
            <Skeleton style={{ fontSize: 8, maxWidth: 279 }} />
          </div>
        </>
      ) : (
        <>
          <Content data={data} dataType={dataType} postMaxLines={postMaxLines} />

          {hasChildrenPosts && <ChildrenContent>{childrenContent}</ChildrenContent>}

          <EngagementBar readonly={readonly} postId={postId} />

          {isEditing && (
            <Modal onCancel={closeEditingPostModal} title={formatMessage({ id: 'post.editPost' })}>
              <PostEditor onSave={closeEditingPostModal} postId={postId} />
            </Modal>
          )}
        </>
      )}
    </PostContainer>
  );
};

DefaultPostRenderer.propTypes = {
  childrenPosts: PropTypes.array,
  className: PropTypes.string,
  currentUserId: PropTypes.string,
  handleDeletePost: PropTypes.func,
  handleReportPost: PropTypes.func,
  handleUnreportPost: PropTypes.func,
  hidePostTarget: PropTypes.bool,
  isFlaggedByMe: PropTypes.bool,
  readonly: PropTypes.bool,
  post: PropTypes.shape({
    data: PropTypes.shape({}),
    dataType: PropTypes.string,
    postedUserId: PropTypes.string,
    postId: PropTypes.string,
    targetId: PropTypes.string,
    targetType: PropTypes.string,
  }),
  userRoles: PropTypes.arrayOf(PropTypes.string),
  loading: PropTypes.bool,
};

DefaultPostRenderer.defaultProps = {
  childrenPosts: [],
  className: '',
  currentUserId: '',
  handleDeletePost: () => {},
  handleReportPost: () => {},
  handleUnreportPost: () => {},
  hidePostTarget: false,
  isFlaggedByMe: false,
  readonly: false,
  post: {},
  userRoles: [],
  loading: false,
};

export default React.memo(DefaultPostRenderer);
