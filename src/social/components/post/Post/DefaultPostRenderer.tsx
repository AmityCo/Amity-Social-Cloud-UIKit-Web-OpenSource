import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Button, { PrimaryButton } from '~/core/components/Button';
import { confirm, info } from '~/core/components/Confirm';
import Modal from '~/core/components/Modal';
import { notification } from '~/core/components/Notification';
import { isNonNullable } from '~/helpers/utils';
import EngagementBar from '~/social/components/EngagementBar';
import ChildrenContent from '~/social/components/post/ChildrenContent';
import PostEditor from '~/social/components/post/Editor';
import PostHeader from '~/social/components/post/Header';
import Content from '~/social/components/post/Post/Content';
import {
  ContentSkeleton,
  OptionMenu,
  PostContainer,
  PostHeadContainer,
  ReviewButtonsContainer,
} from './styles';
import type { PostRendererProps } from '~/social/providers/PostRendererProvider';
import useCommunityPostPermission from '~/social/hooks/useCommunityPostPermission';
import useCommunity from '~/social/hooks/useCommunity';
import useSDK from '~/core/hooks/useSDK';
import usePostSubscription from '~/social/hooks/usePostSubscription';
import { SubscriptionLevels } from '@amityco/ts-sdk';

// Number of lines to show in a text post before truncating.
const MAX_TEXT_LINES_DEFAULT = 8;
const MAX_TEXT_LINES_WITH_CHILDREN = 3;

const ERROR_POST_HAS_BEEN_REVIEWED = 'Post has been reviewed';

type DefaultPostRendererProps = PostRendererProps;

const DefaultPostRenderer = ({
  childrenPosts = [],
  className,
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
  loading,
}: DefaultPostRendererProps) => {
  const { formatMessage } = useIntl();
  const [isEditing, setIsEditing] = useState(false);
  const openEditingPostModal = () => setIsEditing(true);
  const closeEditingPostModal = () => setIsEditing(false);

  function showHasBeenReviewedMessageIfNeeded(error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes(ERROR_POST_HAS_BEEN_REVIEWED)) {
        info({
          title: <FormattedMessage id="post.error.cannotReview.title" />,
          content: <FormattedMessage id="post.error.cannotReview.description" />,
        });
      } else {
        throw error;
      }
    }
  }

  const communityId = post?.targetId;
  const community = useCommunity(communityId);
  const { currentUserId } = useSDK();

  usePostSubscription({
    postId: post?.postId,
    level: SubscriptionLevels.POST,
  });

  const [approving, setApproving] = useState(false);
  const [declining, setDeclining] = useState(false);
  const { canEdit, canReview, canDelete, canReport, isPostUnderReview } =
    useCommunityPostPermission({
      community,
      post,
      childrenPosts,
      userId: currentUserId || undefined,
    });

  const onReportClick = async () => {
    await handleReportPost?.();
    notification.success({ content: <FormattedMessage id="report.reportSent" /> });
  };

  const onUnreportClick = async () => {
    await handleUnreportPost?.();
    notification.success({ content: <FormattedMessage id="report.unreportSent" /> });
  };

  const onApprove = async () => {
    try {
      setApproving(true);
      await handleApprovePost?.();
      notification.success({ content: <FormattedMessage id="post.success.approved" /> });
    } catch (error) {
      showHasBeenReviewedMessageIfNeeded(error);
    } finally {
      setApproving(false);
    }
  };

  const onDecline = async () => {
    try {
      setDeclining(true);
      await handleDeclinePost?.();
      notification.success({ content: <FormattedMessage id="post.success.declined" /> });
    } catch (error) {
      showHasBeenReviewedMessageIfNeeded(error);
    } finally {
      setDeclining(false);
    }
  };

  const confirmDeletePost = () =>
    confirm({
      title: formatMessage({ id: 'post.deletePost' }),
      content: formatMessage({
        id: isPostUnderReview ? 'post.confirmPendingDelete' : 'post.confirmDelete',
      }),
      okText: formatMessage({ id: 'delete' }),
      onOk: handleDeletePost,
    });

  const pollPost = childrenPosts.find((childPost) => childPost.dataType === 'poll');

  const allOptions = [
    canEdit
      ? {
          name: formatMessage({ id: 'post.editPost' }),
          action: openEditingPostModal,
        }
      : null,
    canDelete
      ? {
          name: formatMessage({ id: 'post.deletePost' }),
          action: confirmDeletePost,
        }
      : null,
    canReport
      ? {
          name: isFlaggedByMe
            ? formatMessage({ id: 'report.undoReport' })
            : formatMessage({ id: 'report.doReport' }),
          action: isFlaggedByMe ? onUnreportClick : onReportClick,
        }
      : null,
    !!pollPost && !isPollClosed
      ? {
          name: formatMessage({ id: 'poll.close' }),
          action: handleClosePoll,
        }
      : null,
  ].filter(isNonNullable);

  const hasChildrenPosts = childrenPosts.length > 0;
  const postMaxLines = hasChildrenPosts ? MAX_TEXT_LINES_WITH_CHILDREN : MAX_TEXT_LINES_DEFAULT;

  // live stream post = empty text post + child liveStream post
  const liveStreamContent: Amity.Post<'liveStream'> = childrenPosts.find(
    (childPost) => childPost.dataType === 'liveStream',
  );

  return (
    <PostContainer data-qa-anchor="post" className={className}>
      <PostHeadContainer>
        <PostHeader postId={post?.postId} hidePostTarget={hidePostTarget} loading={loading} />
        {!loading && <OptionMenu options={allOptions} data-qa-anchor="post-options-button" />}
      </PostHeadContainer>

      {loading ? (
        <ContentSkeleton />
      ) : (
        <>
          <Content
            data={liveStreamContent?.data ?? post?.data}
            dataType={liveStreamContent?.dataType ?? post?.dataType}
            postMaxLines={postMaxLines}
            mentionees={post?.metadata?.mentioned}
          />

          {hasChildrenPosts && <ChildrenContent contents={childrenPosts} />}

          {!isPostUnderReview && <EngagementBar readonly={readonly} postId={post?.postId} />}

          {isPostUnderReview && canReview && (
            <ReviewButtonsContainer data-qa-anchor="post-review">
              <PrimaryButton
                data-qa-anchor="post-review-accept-button"
                disabled={approving || declining}
                onClick={onApprove}
              >
                <FormattedMessage id="general.action.accept" />
              </PrimaryButton>
              <Button
                data-qa-anchor="post-review-decline-button"
                disabled={approving || declining}
                onClick={onDecline}
              >
                <FormattedMessage id="general.action.decline" />
              </Button>
            </ReviewButtonsContainer>
          )}

          {isEditing && (
            <Modal
              data-qa-anchor="post-editor-modal"
              title={formatMessage({ id: 'post.editPost' })}
              onCancel={closeEditingPostModal}
            >
              <PostEditor postId={post?.postId} onSave={closeEditingPostModal} />
            </Modal>
          )}
        </>
      )}
    </PostContainer>
  );
};

export default React.memo(DefaultPostRenderer);
