import { PostDataType, PostTargetType } from '@amityco/js-sdk';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Button, { PrimaryButton } from '~/core/components/Button';
import { confirm, info } from '~/core/components/Confirm';
import Modal from '~/core/components/Modal';
import { notification } from '~/core/components/Notification';
import { useAsyncCallback } from '~/core/hooks/useAsyncCallback';
import { canDeletePost, canEditPost, canReportPost, canClosePool } from '~/helpers/permissions';
import { isPostUnderReview } from '~/helpers/utils';
import EngagementBar from '~/social/components/EngagementBar';
import ChildrenContent from '~/social/components/post/ChildrenContent';
import PostEditor from '~/social/components/post/Editor';
import Header from '~/social/components/post/Header';
import Content from '~/social/components/post/Post/Content';
import useCommunity from '~/social/hooks/useCommunity';
import useCommunityOneMember from '~/social/hooks/useCommunityOneMember';
import {
  ContentSkeleton,
  OptionMenu,
  PostContainer,
  PostHeadContainer,
  ReviewButtonsContainer,
} from './styles';

// Number of lines to show in a text post before truncating.
const MAX_TEXT_LINES_DEFAULT = 8;
const MAX_TEXT_LINES_WITH_CHILDREN = 3;

const ERROR_POST_HAS_BEEN_REVIEWED = 'Post has been reviewed';

function showHasBeenReviewedMessageIfNeeded(error) {
  if (error.message.includes(ERROR_POST_HAS_BEEN_REVIEWED)) {
    info({
      title: <FormattedMessage id="post.error.cannotReview.title" />,
      content: <FormattedMessage id="post.error.cannotReview.description" />,
    });
  } else {
    throw error;
  }
}

const DefaultPostRenderer = ({
  childrenPosts = [],
  className,
  currentUserId,
  handleDeletePost,
  handleReportPost,
  handleUnreportPost,
  handleApprovePost,
  handleDeclinePost,
  handleClosePoll,
  isPollClosed,
  hidePostTarget,
  isFlaggedByMe,
  readonly,
  post,
  userRoles,
  loading,
  handleCopyPostPath,
  handleCopyCommentPath,
}) => {
  const { formatMessage } = useIntl();
  const [isEditing, setIsEditing] = useState(false);
  const openEditingPostModal = () => setIsEditing(true);
  const closeEditingPostModal = () => setIsEditing(false);

  const { data, dataType, postId, targetId, targetType, metadata } = post;
  const { community } = useCommunity(targetId, () => targetType !== PostTargetType.CommunityFeed);
  const { currentMember, canReviewCommunityPosts } = useCommunityOneMember(
    targetId,
    currentUserId,
    community.userId,
  );

  const [onReportClick] = useAsyncCallback(async () => {
    await handleReportPost();
    notification.success({ content: <FormattedMessage id="report.reportSent" /> });
  }, [handleReportPost]);

  const [onUnreportClick] = useAsyncCallback(async () => {
    await handleUnreportPost();
    notification.success({ content: <FormattedMessage id="report.unreportSent" /> });
  }, [handleUnreportPost]);

  const [onApprove, approving] = useAsyncCallback(async () => {
    try {
      await handleApprovePost();
      notification.success({ content: <FormattedMessage id="post.success.approved" /> });
    } catch (error) {
      showHasBeenReviewedMessageIfNeeded(error);
    }
  }, [handleApprovePost]);

  const [onDecline, declining] = useAsyncCallback(async () => {
    try {
      await handleDeclinePost();
      notification.success({ content: <FormattedMessage id="post.success.declined" /> });
    } catch (error) {
      showHasBeenReviewedMessageIfNeeded(error);
    }
  }, [handleDeclinePost]);

  const isUnderReview = isPostUnderReview(post, community);

  const confirmDeletePost = () =>
    confirm({
      title: formatMessage({ id: 'post.deletePost' }),
      content: formatMessage({
        id: isUnderReview ? 'post.confirmPendingDelete' : 'post.confirmDelete',
      }),
      okText: formatMessage({ id: 'delete' }),
      onOk: handleDeletePost,
    });

  const pollPost = childrenPosts.find((childPost) => childPost.dataType === PostDataType.PollPost);

  const onCopyPathClick = () => {
    handleCopyPostPath(post);
  };

  const allOptions = [
    canEditPost({
      userId: currentUserId,
      user: { roles: userRoles },
      communityUser: currentMember,
      post,
      community,
      childrenPosts,
    }) && {
      name: 'post.editPost',
      action: openEditingPostModal,
    },
    canDeletePost({
      userId: currentUserId,
      user: { roles: userRoles },
      communityUser: currentMember,
      post,
      community,
    }) && {
      name: 'post.deletePost',
      action: confirmDeletePost,
    },
    canReportPost({
      userId: currentUserId,
      user: { roles: userRoles },
      communityUser: currentMember,
      post,
      community,
    }) && {
      name: isFlaggedByMe ? 'report.undoReport' : 'report.doReport',
      action: isFlaggedByMe ? onUnreportClick : onReportClick,
    },
    canClosePool({
      userId: currentUserId,
      user: { roles: userRoles },
      communityUser: currentMember,
      post,
      community,
      childrenPosts,
    }) &&
      !!pollPost &&
      !isPollClosed && {
        name: 'poll.close',
        action: handleClosePoll,
      },
    !!handleCopyPostPath && {
      name: 'post.copyPath',
      action: onCopyPathClick,
    },
  ].filter(Boolean);

  const childrenContent = childrenPosts?.map((childPost) => ({
    dataType: childPost.dataType,
    data: childPost.data,
  }));

  const hasChildrenPosts = childrenContent.length > 0;
  const postMaxLines = hasChildrenPosts ? MAX_TEXT_LINES_WITH_CHILDREN : MAX_TEXT_LINES_DEFAULT;

  // live stream post = empty text post + child livestream post
  const livestreamContent = childrenContent.find(
    (child) => child.dataType === PostDataType.LivestreamPost,
  );

  return (
    <PostContainer className={className} data-post-id={post.postId}>
      <PostHeadContainer>
        <Header hidePostTarget={hidePostTarget} postId={postId} loading={loading} />
        {!loading && <OptionMenu options={allOptions} data-qa-anchor="social-post-3dots" />}
      </PostHeadContainer>

      {loading ? (
        <ContentSkeleton />
      ) : (
        <>
          <Content
            data={livestreamContent?.data ?? data}
            dataType={livestreamContent?.dataType ?? dataType}
            postMaxLines={postMaxLines}
            mentionees={metadata?.mentioned}
          />

          {hasChildrenPosts && <ChildrenContent>{childrenContent}</ChildrenContent>}

          {!isUnderReview && (
            <EngagementBar
              readonly={readonly}
              postId={postId}
              handleCopyCommentPath={handleCopyCommentPath}
            />
          )}

          {isUnderReview && canReviewCommunityPosts && (
            <ReviewButtonsContainer>
              <PrimaryButton disabled={approving || declining} onClick={onApprove}>
                <FormattedMessage id="general.action.accept" />
              </PrimaryButton>
              <Button disabled={approving || declining} onClick={onDecline}>
                <FormattedMessage id="general.action.decline" />
              </Button>
            </ReviewButtonsContainer>
          )}

          {isEditing && (
            <Modal title={formatMessage({ id: 'post.editPost' })} onCancel={closeEditingPostModal}>
              <PostEditor postId={postId} onSave={closeEditingPostModal} />
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
  handleApprovePost: PropTypes.func,
  handleDeclinePost: PropTypes.func,
  handleClosePoll: PropTypes.func,
  isPollClosed: PropTypes.bool,
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
    mentionees: PropTypes.array,
    metadata: PropTypes.object,
  }),
  userRoles: PropTypes.arrayOf(PropTypes.string),
  loading: PropTypes.bool,
  handleCopyPostPath: PropTypes.func,
  handleCopyCommentPath: PropTypes.func,
};

DefaultPostRenderer.defaultProps = {
  childrenPosts: [],
  className: '',
  currentUserId: '',
  handleDeletePost: () => {},
  handleReportPost: () => {},
  handleUnreportPost: () => {},
  handleApprovePost: () => {},
  handleDeclinePost: () => {},
  handleClosePoll: () => {},
  isPollClosed: false,
  hidePostTarget: false,
  isFlaggedByMe: false,
  readonly: false,
  post: {},
  userRoles: [],
  loading: false,
};

export default React.memo(DefaultPostRenderer);
