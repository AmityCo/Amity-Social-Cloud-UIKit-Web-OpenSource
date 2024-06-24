import React, { useEffect, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Button, { PrimaryButton } from '~/core/components/Button';
import Modal from '~/core/components/Modal';
import { isNonNullable } from '~/helpers/utils';
import EngagementBar from '~/social/components/EngagementBar';
import ChildrenContent from '~/social/components/post/ChildrenContent';
import PostEditor from '~/social/components/post/Editor';
import PostHeader from '~/social/components/post/Header';
import Content from '~/social/components/post/Post/Content';
import {
  ContentSkeleton,
  OptionButtonContainer,
  OptionMenuContainer,
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
import { useConfirmContext } from '~/core/providers/ConfirmProvider';
import { useNotifications } from '~/core/providers/NotificationProvider';
import usePostFlaggedByMe from '~/social/hooks/usePostFlaggedByMe';
import { Option, OptionsButton, OptionsIcon } from '~/core/components/OptionMenu/styles';
import { useDropdown } from '~/core/components/Dropdown/index';
import useElementSize from '~/core/hooks/useElementSize';
import { Frame, FrameContainer } from '~/core/components/Dropdown/styles';
import { POSITION_BOTTOM, POSITION_RIGHT } from '~/helpers/getCssPosition';

// Number of lines to show in a text post before truncating.
const MAX_TEXT_LINES_DEFAULT = 8;
const MAX_TEXT_LINES_WITH_CHILDREN = 3;

const ERROR_POST_HAS_BEEN_REVIEWED = 'Post has been reviewed';

type OptionMenuProps = DefaultPostRendererProps & {
  onApprove: () => void;
  onDecline: () => void;
  onEditPostClick: () => void;
  onClose: () => void;
  buttonContainerHeight: number;
};

const OptionMenu = ({
  childrenPosts = [],
  handleDeletePost,
  handleReportPost,
  handleUnreportPost,
  handleClosePoll,
  isPollClosed,
  post,
  onEditPostClick,
  onClose,
  buttonContainerHeight,
}: OptionMenuProps) => {
  const { formatMessage } = useIntl();

  const { info, confirm } = useConfirmContext();
  const notification = useNotifications();

  const { isFlaggedByMe, toggleFlagPost } = usePostFlaggedByMe(post);

  const communityId = post?.targetId;
  const community = useCommunity(communityId);
  const { currentUserId } = useSDK();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { currentPosition, align, scrollableHeight } = useDropdown({
    dropdownRef,
    buttonContainerHeight,
    position: POSITION_BOTTOM,
    align: POSITION_RIGHT,
  });

  const { canEdit, canReview, canDelete, canReport, isPostUnderReview } =
    useCommunityPostPermission({
      community,
      post,
      childrenPosts,
      userId: currentUserId || undefined,
    });

  const pollPost = childrenPosts.find((childPost) => childPost.dataType === 'poll');

  const onReportClick = async () => {
    toggleFlagPost();
    await handleReportPost?.();
    notification.success({ content: <FormattedMessage id="report.reportSent" /> });
  };

  const onUnreportClick = async () => {
    toggleFlagPost();
    await handleUnreportPost?.();
    notification.success({ content: <FormattedMessage id="report.unreportSent" /> });
  };

  const confirmDeletePost = () => {
    confirm({
      title: formatMessage({ id: 'post.deletePost' }),
      content: formatMessage({
        id: isPostUnderReview ? 'post.confirmPendingDelete' : 'post.confirmDelete',
      }),
      okText: formatMessage({ id: 'delete' }),
      onOk: () => handleDeletePost?.(post?.postId),
    });
  };

  const options = [
    canEdit
      ? {
          name: formatMessage({ id: 'post.editPost' }),
          action: () => onEditPostClick(),
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

  return (
    <OptionMenuContainer ref={dropdownRef}>
      <FrameContainer>
        <Frame position={currentPosition} align={align} scrollableHeight={scrollableHeight}>
          {options.map(({ name, action }) => (
            <Option
              key={name}
              data-qa-anchor={`post-options-button-${name}`}
              onClick={() => {
                action?.();
                onClose();
              }}
            >
              {name}
            </Option>
          ))}
        </Frame>
      </FrameContainer>
    </OptionMenuContainer>
  );
};

type DefaultPostRendererProps = PostRendererProps;

const DefaultPostRenderer = (props: DefaultPostRendererProps) => {
  const {
    childrenPosts = [],
    className,
    handleApprovePost,
    handleDeclinePost,
    hidePostTarget,
    readonly,
    post,
    loading,
  } = props;
  const { formatMessage } = useIntl();
  const [isEditing, setIsEditing] = useState(false);
  const openEditingPostModal = () => setIsEditing(true);
  const closeEditingPostModal = () => setIsEditing(false);
  const { info, confirm } = useConfirmContext();
  const notification = useNotifications();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [buttonContainerRef, buttonContainerHeight] = useElementSize();

  const [approving, setApproving] = useState(false);
  const [declining, setDeclining] = useState(false);

  const toggle = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('click', toggle);
    } else {
      document.removeEventListener('click', toggle);
    }

    return () => {
      document.removeEventListener('click', toggle);
    };
  }, [isMenuOpen]);

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

  const { canReview, isPostUnderReview } = useCommunityPostPermission({
    community,
    post,
    childrenPosts,
    userId: currentUserId || undefined,
  });

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
        {!loading && (
          <OptionButtonContainer>
            <div ref={buttonContainerRef}>
              <OptionsButton
                onClick={(event) => {
                  event.stopPropagation();
                  toggle();
                }}
                className={className}
              >
                <OptionsIcon />
              </OptionsButton>
            </div>
            {isMenuOpen && (
              <OptionMenu
                {...props}
                onApprove={onApprove}
                onDecline={onDecline}
                onClose={toggle}
                onEditPostClick={() => openEditingPostModal()}
                buttonContainerHeight={buttonContainerHeight}
              />
            )}
          </OptionButtonContainer>
        )}
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
