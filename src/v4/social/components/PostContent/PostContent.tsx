import React, { useEffect, useMemo, useState } from 'react';
import { Timestamp } from '~/v4/social/elements/Timestamp';
import { ReactionButton } from '~/v4/social/elements/ReactionButton';

import { ModeratorBadge } from '~/v4/social/elements/ModeratorBadge';
import { MenuButton } from '~/v4/social/elements/MenuButton';
import { ShareButton } from '~/v4/social/elements/ShareButton';
import useCommunity from '~/v4/core/hooks/collections/useCommunity';
import useUser from '~/v4/core/hooks/objects/useUser';
import { BottomSheet, Typography } from '~/v4/core/components';
import AngleRight from '~/v4/icons/AngleRight';
import { UserAvatar } from '~/v4/social/internal-components/UserAvatar';
import { CommentButton } from '~/v4/social/elements/CommentButton';
import { useCustomization } from '~/v4/core/providers/CustomizationProvider';
import { useGenerateStylesShadeColors } from '~/v4/core/providers/ThemeProvider';
import { useMutation } from '@tanstack/react-query';
import { ReactionRepository } from '@amityco/ts-sdk';

import styles from './PostContent.module.css';

import Crying from './Crying';
import Happy from './Happy';
import Fire from './Fire';
import Love from './Love';
import Like from './Like';
import { TextContent } from './TextContent';
import { ImageContent } from './ImageContent';
import { VideoContent } from './VideoContent';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { ImageViewer } from '~/v4/social/internal-components/ImageViewer/ImageViewer';
import { VideoViewer } from '~/v4/social/internal-components/VideoViewer/VideoViewer';
import usePost from '~/v4/core/hooks/objects/usePost';
import { ReactionList } from '~/v4/social/components/ReactionList/';
import { usePostPermissions } from '~/v4/core/hooks/usePostPermissions';
import { PostMenu } from '~/v4/social/internal-components/PostMenu/PostMenu';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';

interface PostTitleProps {
  post: Amity.Post;
  pageId?: string;
}

const PostTitle = ({ pageId, post }: PostTitleProps) => {
  const componentId = 'post_content';
  const { getConfig } = useCustomization();
  const uiReference = `${pageId}/${componentId}/*`;
  const config = getConfig(uiReference);
  const themeStyles = useGenerateStylesShadeColors(config);

  const { community: targetCommunity } = useCommunity({
    communityId: post.targetId,
    shouldCall: () => post.targetType === 'community',
  });

  const { user: postedUser } = useUser(post.postedUserId);

  if (targetCommunity) {
    return (
      <div style={themeStyles} className={styles.postTitle}>
        <Typography.BodyBold className={styles.postTitle__text}>
          {postedUser?.displayName}
        </Typography.BodyBold>
        {targetCommunity && (
          <>
            <AngleRight className={styles.postTitle__icon} />
            <Typography.BodyBold className={styles.postTitle__text}>
              {targetCommunity.displayName}
            </Typography.BodyBold>{' '}
          </>
        )}
      </div>
    );
  }

  return (
    <Typography.BodyBold className={styles.postTitle__text}>
      {postedUser?.displayName}
    </Typography.BodyBold>
  );
};

const useMutateAddReaction = ({
  postId,
  reactionByMe,
}: {
  postId: string;
  reactionByMe: string | null;
}) =>
  useMutation({
    mutationFn: async (reactionKey: string) => {
      if (reactionByMe) {
        try {
          await ReactionRepository.removeReaction('post', postId, reactionByMe);
        } catch {
          console.log("Can't remove reaction.");
        }
      }
      return ReactionRepository.addReaction('post', postId, reactionKey);
    },
  });

const useMutateRemoveReaction = ({
  postId,
  reactionsByMe,
}: {
  postId: string;
  reactionsByMe: string[];
}) =>
  useMutation({
    mutationFn: async () => {
      return Promise.all(
        reactionsByMe.map((reaction) => {
          try {
            return ReactionRepository.removeReaction('post', postId, reaction);
          } catch (e) {
            console.log("Can't remove reaction.");
          }
        }),
      );
    },
  });

const ChildrenPostContent = ({
  post,
  onImageClick,
  onVideoClick,
}: {
  post: Amity.Post[];
  onImageClick: (imageIndex: number) => void;
  onVideoClick: (videoIndex: number) => void;
}) => {
  return (
    <>
      <ImageContent post={post} onImageClick={onImageClick} />
      <VideoContent post={post} onVideoClick={onVideoClick} />
    </>
  );
};

interface PostContentProps {
  pageId?: string;
  post: Amity.Post;
  type: 'feed' | 'detail';
  onClick?: () => void;
}

export const PostContent = ({
  pageId = '*',
  post: initialPost,
  type,
  onClick,
}: PostContentProps) => {
  const componentId = 'post_content';
  const { themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const { post: postData } = usePost(initialPost.postId);
  const { setDrawerData, removeDrawerData } = useDrawer();

  const post = postData || initialPost;

  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [isVideoViewerOpen, setIsVideoViewerOpen] = useState(false);
  const [clickedImageIndex, setClickedImageIndex] = useState<number | null>(null);
  const [clickedVideoIndex, setClickedVideoIndex] = useState<number | null>(null);

  useEffect(() => {
    if (post) {
      post.analytics?.markAsViewed();
    }
  }, [post]);

  const { community: targetCommunity } = useCommunity({
    communityId: post?.targetId,
    shouldCall: () => post?.targetType === 'community',
  });

  const { isCommunityModerator } = usePostPermissions({
    post,
    community: targetCommunity,
  });

  const reactionByMe = useMemo(() => {
    if (post == null || post.myReactions?.length === 0) return null;
    return post.myReactions[0];
  }, [post.myReactions]);

  const { mutateAsync: mutateAddReactionAsync } = useMutateAddReaction({
    postId: post.postId,
    reactionByMe,
  });

  const { mutateAsync: mutateRemoveReactionAsync } = useMutateRemoveReaction({
    postId: post.postId,
    reactionsByMe: post.myReactions,
  });

  const handleReactionClick = (reactionKey: string) => {
    if (post.myReactions?.length > 0) {
      mutateRemoveReactionAsync();
    } else {
      mutateAddReactionAsync(reactionKey);
    }
  };

  const openImageViewer = (imageIndex: number) => {
    setIsImageViewerOpen(true);
    setClickedImageIndex(imageIndex);
  };

  const closeImageViewer = () => {
    setIsImageViewerOpen(false);
    setClickedImageIndex(null);
  };

  const openVideoViewer = (imageIndex: number) => {
    setIsVideoViewerOpen(true);
    setClickedVideoIndex(imageIndex);
  };

  const closeVideoViewer = () => {
    setIsVideoViewerOpen(false);
    setClickedVideoIndex(null);
  };

  const hasLike = post?.reactions.like > 0;
  const hasLove = post?.reactions.love > 0;
  const hasFire = post?.reactions.fire > 0;
  const hasHappy = post?.reactions.happy > 0;
  const hasCrying = post?.reactions.crying > 0;

  const hasReaction = hasLike || hasLove || hasFire || hasHappy || hasCrying;

  return (
    <>
      <div className={styles.postContent} style={themeStyles}>
        <div className={styles.postContent__bar}>
          <div className={styles.postContent__bar__userAvatar}>
            <UserAvatar userId={post.postedUserId} />
          </div>
          <div>
            <div>
              <PostTitle post={post} />
            </div>
            <div className={styles.postContent__bar__information__subtitle}>
              {!isCommunityModerator ? (
                <div className={styles.postContent__bar__information__subtitle__moderator}>
                  <ModeratorBadge pageId={pageId} componentId={componentId} />
                  <span className={styles.postContent__bar__information__subtitle__separator}>
                    •
                  </span>
                </div>
              ) : null}
              <span
                className={styles.postContent__bar__information__subtitle__timestamp}
                onClick={() => onClick?.()}
              >
                <Timestamp timestamp={post.createdAt} />
              </span>
            </div>
          </div>
          <div className={styles.postContent__bar__actionButton}>
            {type === 'feed' ? (
              <MenuButton
                pageId={pageId}
                componentId={componentId}
                onClick={() =>
                  setDrawerData({
                    content: (
                      <PostMenu
                        post={post}
                        onCloseMenu={() => removeDrawerData()}
                        pageId={pageId}
                        componentId={componentId}
                      />
                    ),
                  })
                }
              />
            ) : null}
          </div>
        </div>
        <div className={styles.postContent__content_and_reactions}>
          <div className={styles.postContent__content}>
            <TextContent text={post.data.text} mentionees={post?.metadata?.mentioned} />
            {post.children.length > 0 ? (
              <ChildrenPostContent
                post={post}
                onImageClick={openImageViewer}
                onVideoClick={openVideoViewer}
              />
            ) : null}
          </div>
          {type === 'detail' ? (
            <div className={styles.postContent__reactions_and_comments}>
              <div
                className={styles.postContent__reactionsBar}
                onClick={() =>
                  setDrawerData({
                    content: (
                      <ReactionList
                        pageId={pageId}
                        referenceId={post.postId}
                        referenceType={'post'}
                      />
                    ),
                  })
                }
              >
                {hasReaction ? (
                  <div className={styles.postContent__reactionsBar__reactions}>
                    {hasCrying && (
                      <Crying className={styles.postContent__reactionsBar__reactions__icon} />
                    )}
                    {hasHappy && (
                      <Happy className={styles.postContent__reactionsBar__reactions__icon} />
                    )}
                    {hasFire && (
                      <Fire className={styles.postContent__reactionsBar__reactions__icon} />
                    )}
                    {hasLove && (
                      <Love className={styles.postContent__reactionsBar__reactions__icon} />
                    )}
                    {hasLike && (
                      <Like className={styles.postContent__reactionsBar__reactions__icon} />
                    )}
                  </div>
                ) : null}
                <Typography.Caption className={styles.postContent__reactionsBar__reactions__count}>
                  {`${post?.reactionsCount || 0} ${post?.reactionsCount === 1 ? 'like' : 'likes'}`}
                </Typography.Caption>
              </div>

              <Typography.Caption className={styles.postContent__commentsCount}>
                {`${post?.commentsCount || 0} ${
                  post?.commentsCount === 1 ? 'comment' : 'comments'
                }`}
              </Typography.Caption>
            </div>
          ) : null}
          <div className={styles.postContent__divider} />
          <div className={styles.postContent__reactionBar}>
            <div className={styles.postContent__reactionBar__leftPane}>
              <ReactionButton
                pageId={pageId}
                componentId={componentId}
                reactionsCount={type === 'feed' ? post.reactionsCount : undefined}
                myReactions={post.myReactions}
                defaultIconClassName={styles.postContent__reactionBar__leftPane__icon}
                imgIconClassName={styles.postContent__reactionBar__leftPane__iconImg}
                onReactionClick={handleReactionClick}
              />
              <CommentButton
                pageId={pageId}
                componentId={componentId}
                commentsCount={type === 'feed' ? post.commentsCount : undefined}
                defaultIconClassName={styles.postContent__reactionBar__leftPane__icon}
                imgIconClassName={styles.postContent__reactionBar__leftPane__iconImg}
              />
            </div>
            <div className={styles.postContent__reactionBar__rightPane}>
              <ShareButton pageId={pageId} componentId={componentId} />
            </div>
          </div>
        </div>
      </div>
      {isImageViewerOpen && typeof clickedImageIndex === 'number' ? (
        <ImageViewer post={post} onClose={closeImageViewer} initialImageIndex={clickedImageIndex} />
      ) : null}
      {isVideoViewerOpen && typeof clickedVideoIndex === 'number' ? (
        <VideoViewer post={post} onClose={closeVideoViewer} initialVideoIndex={clickedVideoIndex} />
      ) : null}
    </>
  );
};
