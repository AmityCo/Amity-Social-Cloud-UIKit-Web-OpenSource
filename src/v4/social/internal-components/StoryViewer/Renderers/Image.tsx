import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import Truncate from 'react-truncate-markup';
import {
  CustomRenderer,
  Tester,
} from '~/v4/social/internal-components/StoryViewer/Renderers/types';
import { CommentTray } from '~/v4/social/components';
import { HyperLink } from '~/v4/social/elements/HyperLink';
import Footer from '~/v4/social/internal-components/StoryViewer/Renderers/Wrappers/Footer';
import Header from '~/v4/social/internal-components/StoryViewer/Renderers/Wrappers/Header';
import { motion, PanInfo, useAnimationControls } from 'framer-motion';
import { BottomSheet } from '~/v4/core/components/BottomSheet';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/components/Button';
import useCommunityMembersCollection from '~/v4/social/hooks/collections/useCommunityMembersCollection';
import useSDK from '~/v4/core/hooks/useSDK';
import useUser from '~/v4/core/hooks/objects/useUser';
import useCommunityStoriesSubscription from '~/v4/social/hooks/useCommunityStoriesSubscription';
import { LIKE_REACTION_KEY } from '~/v4/social/constants/reactions';
import { checkStoryPermission, formatTimeAgo, isAdmin, isModerator } from '~/v4/social/utils';

import styles from './Renderers.module.css';
import clsx from 'clsx';

export const renderer: CustomRenderer = ({
  story,
  action,
  config,
  onClose,
  onSwipeDown,
  onClickCommunity,
}) => {
  const { formatMessage } = useIntl();
  const [loaded, setLoaded] = useState(false);
  const [isOpenBottomSheet, setIsOpenBottomSheet] = useState(false);
  const [isOpenCommentSheet, setIsOpenCommentSheet] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { loader } = config;
  const { client } = useSDK();

  const isLiked = !!(story && story.myReactions && story.myReactions.includes(LIKE_REACTION_KEY));
  const reactionsCount = story.reactionsCount || 0;

  const {
    storyId,
    syncState,
    reach,
    commentsCount,
    createdAt,
    creator,
    community,
    actions,
    addStoryButton,
    fileInputRef,
    storyStyles,
    myReactions,
  } = story;

  const { members } = useCommunityMembersCollection(community?.communityId as string);
  const member = members?.find((member) => member.userId === client?.userId);
  const isMember = member != null;

  const { user } = useUser(client?.userId);
  const controls = useAnimationControls();

  const isOfficial = community?.isOfficial || false;
  const isCreator = creator?.userId === user?.userId;
  const isGlobalAdmin = isAdmin(user?.roles);
  const isCommunityModerator = isModerator(user?.roles);
  const haveStoryPermission =
    isGlobalAdmin || isCommunityModerator || checkStoryPermission(client, community?.communityId);

  const heading = <div data-qa-anchor="community_display_name">{community?.displayName}</div>;
  const subheading =
    createdAt && creator?.displayName ? (
      <span>
        <span data-qa-anchor="created_at">{formatTimeAgo(createdAt as string)}</span> • By{' '}
        <span data-qa-anchor="creator_display_name">{creator?.displayName}</span>
      </span>
    ) : (
      ''
    );
  const targetRootId = 'asc-uikit-stories-viewer';

  const imageLoaded = () => {
    setLoaded(true);
    if (isPaused) {
      setIsPaused(false);
    }
    action('play');
  };

  const play = () => setIsPaused(false);
  const pause = () => setIsPaused(true);

  const openBottomSheet = () => setIsOpenBottomSheet(true);
  const closeBottomSheet = () => setIsOpenBottomSheet(false);
  const openCommentSheet = () => setIsOpenCommentSheet(true);
  const closeCommentSheet = () => setIsOpenCommentSheet(false);

  const handleSwipeDown = () => {
    controls
      .start({
        y: '100%',
        transition: { duration: 0.3, ease: 'easeOut' },
      })
      .then(() => {
        onSwipeDown?.();
      });
  };

  const handleDragStart = () => {
    action('pause', true);
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 100) {
      handleSwipeDown();
    } else {
      controls.start({ y: 0, transition: { duration: 0.3, ease: 'easeOut' } }).then(() => {
        action('play', true);
      });
    }
  };

  const handleOnClose = () => {
    onClose();
  };

  useEffect(() => {
    if (isPaused || isOpenBottomSheet || isOpenCommentSheet) {
      action('pause', true);
    } else {
      action('play', true);
    }
  }, [isPaused, isOpenBottomSheet, isOpenCommentSheet]);

  useEffect(() => {
    action('pause', true);
    if (fileInputRef.current) {
      fileInputRef.current.addEventListener('click', () => {
        action('pause', true);
      });
      fileInputRef.current.addEventListener('cancel', () => {
        action('play', true);
      });
    }

    return () => {
      if (fileInputRef.current) {
        fileInputRef.current.removeEventListener('cancel', () => {
          action('play', true);
        });
        fileInputRef.current.removeEventListener('click', () => {
          action('pause', true);
        });
      }
    };
  }, []);

  useCommunityStoriesSubscription({
    targetId: community?.communityId as string,
    targetType: 'community',
    shouldSubscribe: () => !!community?.communityId,
  });

  return (
    <motion.div
      className={styles.rendererContainer}
      animate={controls}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 0.95, borderRadius: '8px', cursor: 'grabbing' }}
    >
      <Header
        community={community}
        heading={heading}
        subheading={subheading}
        isHaveActions={actions?.length > 0}
        haveStoryPermission={haveStoryPermission}
        isOfficial={isOfficial}
        isPaused={isPaused}
        onPlay={play}
        onPause={pause}
        onAction={openBottomSheet}
        onClickCommunity={() => onClickCommunity?.()}
        onClose={handleOnClose}
        addStoryButton={addStoryButton}
      />

      <div
        className={clsx(styles.storyImageContainer)}
        style={
          {
            '--asc-story-image-background': storyStyles?.background,
          } as React.CSSProperties
        }
      >
        <img
          className={styles.storyImage}
          data-qa-anchor="image_view"
          src={story.url}
          onLoad={imageLoaded}
          alt="Story Image"
        />
      </div>

      {!loaded && <div className={styles.loadingOverlay}>{loader || <div>loading...</div>}</div>}

      <BottomSheet
        rootId={targetRootId}
        isOpen={isOpenBottomSheet}
        onClose={closeBottomSheet}
        mountPoint={document.getElementById(targetRootId) as HTMLElement}
        detent="content-height"
      >
        {actions?.map((bottomSheetAction) => (
          <Button
            className={styles.actionButton}
            onClick={() => {
              bottomSheetAction.action();
            }}
            variant="secondary"
          >
            {bottomSheetAction?.icon && bottomSheetAction.icon}
            <Typography.BodyBold>
              {formatMessage({ id: bottomSheetAction.name })}
            </Typography.BodyBold>
          </Button>
        ))}
      </BottomSheet>

      <BottomSheet
        rootId={targetRootId}
        isOpen={isOpenCommentSheet}
        onClose={closeCommentSheet}
        mountPoint={document.getElementById(targetRootId) as HTMLElement}
        detent="full-height"
        headerTitle={formatMessage({ id: 'storyViewer.commentSheet.title' })}
      >
        <CommentTray
          referenceId={storyId}
          referenceType="story"
          community={community as Amity.Community}
          shouldAllowCreation={community?.allowCommentInStory}
          shouldAllowInteraction={isMember}
        />
      </BottomSheet>

      {story.items?.[0]?.data?.url && (
        <div className={styles.hyperLinkContainer}>
          <HyperLink
            href={
              story.items[0].data.url.startsWith('http')
                ? story.items[0].data.url
                : `https://${story.items[0].data.url}`
            }
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => story.analytics.markLinkAsClicked()}
          >
            <Truncate lines={1}>
              <span>
                {story.items[0]?.data?.customText ||
                  story.items[0].data.url.replace(/^https?:\/\//, '')}
              </span>
            </Truncate>
          </HyperLink>
        </div>
      )}

      <Footer
        storyId={storyId}
        syncState={syncState}
        reach={reach}
        commentsCount={commentsCount}
        reactionsCount={reactionsCount}
        isLiked={isLiked}
        myReactions={myReactions}
        onClickComment={openCommentSheet}
        showImpression={isCreator || haveStoryPermission}
        isMember={isMember}
      />
    </motion.div>
  );
};

const rendererStyles = {
  story: {
    display: 'flex',
    position: 'relative',
    overflow: 'hidden',
  },
  storyContent: {
    width: 'auto',
    maxWidth: '100%',
    maxHeight: '100%',
    margin: 'auto',
  },
};

export const tester: Tester = (story) => {
  return {
    condition: !story.content && (!story.type || story.type === 'image'),
    priority: 2,
  };
};

export default {
  renderer,
  tester,
};
