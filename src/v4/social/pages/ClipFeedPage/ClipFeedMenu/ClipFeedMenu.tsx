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
import LikeTransparent from '~/v4/icons/LikeTransparent';
import useCommunityProfileGlobalBehavior from '~/v4/core/hooks/useCommunityProfileGlobalBehavior';
import useUserProfileGlobalBehavior from '~/v4/core/hooks/useUserProfileGlobalBehavior';

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
  const { handleCommunityProfileBehavior } = useCommunityProfileGlobalBehavior();
  const { handleUserProfileBehavior } = useUserProfileGlobalBehavior();

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

  const onReactionClick = async (reactionKey: string) => {
    if (reactionByMe === null) {
      await mutateAddReactionAsync(reactionKey);
    } else if (reactionByMe !== reactionKey) {
      await mutateRemoveReactionAsync(reactionByMe);
      await mutateAddReactionAsync(reactionKey);
    } else {
      await mutateRemoveReactionAsync(reactionByMe);
    }
  };

  const handleReactionClick = (reactionKey: string) => {
    if (community)
      return handleCommunityProfileBehavior({
        defaultBehavior: () => onReactionClick(reactionKey),
        allowNonMember: false,
        isJoined: community?.isJoined,
      });

    return handleUserProfileBehavior({
      defaultBehavior: () => onReactionClick(reactionKey),
      allowNonFollower: true,
    });
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
          fallbackReactButtonClassName={styles.clipFeedMenu__reactButton__fallbackIcon}
          reactionsCount={reactionsCount || 0}
          myReaction={reactionByMe || null}
          isClipReaction
          defaultIcon={() => (
            <LikeTransparent className={styles.clipFeedMenu__reactionButtonIcon} />
          )}
          community={community}
        />
      )}
      {isShowInteractionMenu && !isDragging && (
        <CommentButton
          pageId={pageId}
          componentId={componentId}
          commentsCount={post?.commentsCount}
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
