import React from 'react';
import styles from './ClipFeedMenu.module.css';
import { ReactionButton } from '~/v4/social/elements';
import { CommentButton } from '~/v4/social/elements/CommentButton';
import usePost from '~/v4/core/hooks/objects/usePost';
import { MuteButton } from '~/v4/social/elements/MuteButton';
import { MenuButton } from '~/v4/social/elements/MenuButton';
import { usePostReaction } from '~/v4/social/hooks/usePostReaction';
import useCommunity from '~/v4/core/hooks/collections/useCommunity';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { CommentDrawer } from './CommentDrawer';

type ClipFeedMenuProps = {
  pageId?: string;
  componentId?: string;
  isShowInteractionMenu?: boolean;
  postId: string;
  onClickMenuButton?: () => void;
  isDragging: boolean;
  childPost?: Amity.Post<'video' | 'clip'>;
  handleMuteToggle: (isMuted: boolean) => void;
  isLocalMuted: boolean;
};

export const ClipFeedMenu = ({
  pageId = '*',
  componentId = '*',
  isShowInteractionMenu = true,
  isDragging,
  postId,
  onClickMenuButton,
  childPost,
  handleMuteToggle,
  isLocalMuted,
}: ClipFeedMenuProps) => {
  const { post, isLoading } = usePost(postId);
  const {
    mutateAddReactionAsync,
    mutateRemoveReactionAsync,
    reactionByMe,
    setReactionByMe,
    reactionsCount,
  } = usePostReaction({
    post: post as Amity.Post<'video' | 'clip'>,
  });

  const notification = useNotifications();
  const { setDrawerData } = useDrawer();

  // Get community data if the post is from a community
  const { community } = useCommunity({
    communityId: post?.targetType === 'community' ? post.targetId : null,
    shouldCall: post?.targetType === 'community',
  });

  const handleReactionClick = (reactionKey: string) => {
    if (post?.targetType === 'community' && !community?.isJoined) {
      return notification.info({
        content: 'Join community to interact with this clip.',
      });
    }
    if (reactionByMe === null) {
      mutateAddReactionAsync(reactionKey);
      setReactionByMe(reactionKey);
    } else if (reactionByMe !== reactionKey) {
      mutateRemoveReactionAsync(reactionByMe);
      mutateAddReactionAsync(reactionKey);
      setReactionByMe(reactionKey);
    } else {
      mutateRemoveReactionAsync(reactionByMe);
      setReactionByMe(null);
    }
  };

  const handleCommentClick = () => {
    if (post) {
      setDrawerData({
        content: <CommentDrawer pageId={pageId} post={post} community={community} />,
      });
    }
  };

  if (isLoading) return null;

  return (
    <div className={styles.clipFeedMenu__container}>
      {isShowInteractionMenu && !isDragging && (
        <ReactionButton
          onReactionClick={handleReactionClick}
          buttonClassName={styles.clipFeedMenu__reactionButton}
          defaultIconClassName={styles.clipFeedMenu__reactionButtonIcon}
          reactionsCountClassName={styles.clipFeedMenu__reactionsCount}
          reactButtonClassName={styles.clipFeedMenu__reactButton}
          reactionsCount={reactionsCount || 0}
          myReaction={reactionByMe || null}
          isClipReaction
        />
      )}
      {isShowInteractionMenu && !isDragging && (
        <CommentButton
          pageId={pageId}
          componentId={componentId}
          commentsCount={post?.commentsCount || 0}
          buttonClassName={styles.clipFeedMenu__commentButton}
          commentsCountClassName={styles.clipFeedMenu__commentsCount}
          defaultIconClassName={styles.clipFeedMenu__commentIcon}
          onPress={handleCommentClick}
        />
      )}
      {!isDragging && (
        <MuteButton
          buttonClassName={styles.clipFeedMenu__muteButton}
          defaultClassName={styles.clipFeedMenu__muteIcon}
          isMuted={(childPost as Amity.Post<'clip'>)?.data?.isMuted}
          isLocalMuted={isLocalMuted}
          handleMuteToggle={handleMuteToggle}
        />
      )}

      {isShowInteractionMenu && !isDragging && (
        <MenuButton
          onClick={onClickMenuButton}
          className={styles.clipFeedMenu__menuButton}
          iconClassName={styles.clipFeedMenu__menuIcon}
        />
      )}
    </div>
  );
};
