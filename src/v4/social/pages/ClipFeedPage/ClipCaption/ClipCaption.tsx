import React, { useRef, useEffect, useState } from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import usePost from '~/v4/core/hooks/objects/usePost';
import { Typography } from '~/v4/core/components';
import styles from './ClipCaption.module.css';
import { UserAvatar } from '~/v4/social/elements';
import { Button } from '~/v4/core/components/AriaButton';
import { Timestamp } from '~/v4/social/elements/Timestamp';
import { usePostedUserInformation } from '~/v4/core/hooks/usePostedUserInformation';
import useCommunity from '~/v4/core/hooks/collections/useCommunity';
import { ModeratorBadge } from '~/v4/social/elements/ModeratorBadge';
import { isTextPost } from '~/v4/social/utils/postTypeChecker';
import { TextWithMention } from '~/v4/social/internal-components/TextWithMention/TextWithMention';

type ClipCaptionProps = {
  pageId?: string;
  componentId?: string;
  postId: string;
  creator: Amity.User | undefined;
  isDragging: boolean;
  onClickUser?: () => void;
  onClickSeeMoreButton: (isOpen: boolean) => void;
  isLoading: boolean;
  seeMoreIsOpen?: boolean;
};

export const ClipCaption = ({
  pageId = '*',
  componentId = '*',
  postId,
  creator,
  isLoading = false,
  isDragging = false,
  seeMoreIsOpen = false,
  onClickUser,
  onClickSeeMoreButton,
}: ClipCaptionProps) => {
  const elementId = 'clip_caption';
  const containerRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  const { post } = usePost(postId);

  const communityId = post?.targetType === 'community' ? post.targetId : null;

  const { community } = useCommunity({
    communityId,
    shouldCall: !!communityId,
  });

  const { isCommunityModerator } = usePostedUserInformation({
    post: post as Amity.Post,
    community: communityId ? community : null,
  });

  const { accessibilityId, themeStyles } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  // Update gradient height to match container height
  useEffect(() => {
    const updateGradientHeight = () => {
      if (containerRef.current && gradientRef.current) {
        const height = containerRef.current.offsetHeight;
        setContainerHeight(height);
        gradientRef.current.style.height = `${height + 80}px`; // Add extra 80px to extend beyond bottom
      }
    };

    // Update height initially and when content changes
    updateGradientHeight();

    // Use ResizeObserver to watch for container size changes
    const resizeObserver = new ResizeObserver(updateGradientHeight);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []); // Re-run when content that affects height changes

  if (isDragging) return null;

  return (
    <>
      {/* Gradient Background */}
      <div ref={gradientRef} className={styles.clipCaption__gradientBackground} />

      <div
        ref={containerRef}
        style={themeStyles}
        className={styles.clipCaption__container}
        data-testid={accessibilityId}
      >
        <div className={styles.clipCaption__userInfo}>
          <UserAvatar
            imageContainerClassName={styles.clipCaption__avatar}
            pageId={pageId}
            componentId={componentId}
            userId={creator?.userId}
            onPressAvatar={onClickUser}
          />
          {isLoading && !creator ? (
            <div className={styles.clipCaption__skeleton}>
              <div className={styles.clipCaption__skeleton__title} />
              <div className={styles.clipCaption__skeleton__moderator} />
            </div>
          ) : (
            <div className={styles.clipCaption__userContentContainer}>
              <div className={styles.clipCaption__usernameContainer}>
                <Button variant="text" onPress={onClickUser}>
                  <Typography.BodyBold
                    className={styles.clipCaption__userName}
                    data-testid={`${pageId}/${componentId}/username`}
                  >
                    {creator?.displayName ?? ''}
                  </Typography.BodyBold>
                </Button>
                <span className={styles.clipCaption__textWhite}>• </span>
                <Timestamp
                  className={styles.clipCaption__textWhite}
                  timestamp={post?.createdAt as string}
                />
                {post?.createdAt !== post?.editedAt && (
                  <Typography.Caption
                    data-testid={`${pageId}/${componentId}/post_edited_text`}
                    className={styles.clipCaption__textWhite}
                  >
                    (edited)
                  </Typography.Caption>
                )}
              </div>

              {isCommunityModerator && (
                <ModeratorBadge
                  pageId={pageId}
                  componentId={componentId}
                  className={styles.clipCaption__moderatorBadge}
                />
              )}
            </div>
          )}
        </div>
        {isLoading && !creator ? (
          <div className={styles.clipCaption__skeleton}>
            <div className={styles.clipCaption__skeleton__title} />
            <div className={styles.clipCaption__skeleton__desc} />
          </div>
        ) : (
          <Typography.Body className={styles.clipCaption__text}>
            <TextWithMention
              pageId={pageId}
              componentId={componentId}
              data={{ text: isTextPost(post) ? post?.data?.text || '' : '' }}
              mentionees={post?.mentionees || []}
              metadata={{ mentioned: post?.metadata?.mentioned }}
              maxLines={3}
              onClickSeeMoreButton={onClickSeeMoreButton}
              seeMoreClassName={styles.clipCaption__seeMore}
              textClassName={styles.clipCaption__textWhite}
              linkClassName={styles.clipCaption__textWhiteBold}
              mentionClassName={styles.clipCaption__textWhiteBold}
              seeLessSupport={true}
              seeMoreIsOpen={seeMoreIsOpen}
            />
          </Typography.Body>
        )}
      </div>
    </>
  );
};
