import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useIntl } from 'react-intl';

import Truncate from 'react-truncate-markup';
import {
  CustomRenderer,
  Tester,
} from '~/v4/social/internal-components/StoryViewer/Renderers/types';
import { SpeakerButton } from '~/v4/social/elements';

import { BottomSheet, Button, Typography } from '~/v4/core/components';

import { CommentTray } from '~/v4/social/components';
import { HyperLink } from '~/v4/social/elements/HyperLink';
import Header from '~/v4/social/internal-components/StoryViewer/Renderers/Wrappers/Header';
import Footer from '~/v4/social/internal-components/StoryViewer/Renderers/Wrappers/Footer';

import { motion, PanInfo, useAnimationControls } from 'framer-motion';

import useCommunityMembersCollection from '~/v4/social/hooks/collections/useCommunityMembersCollection';
import useSDK from '~/v4/core/hooks/useSDK';
import useUser from '~/v4/core/hooks/objects/useUser';

import clsx from 'clsx';
import { LIKE_REACTION_KEY } from '~/v4/social/constants/reactions';
import { checkStoryPermission, formatTimeAgo, isAdmin, isModerator } from '~/v4/social/utils';

import rendererStyles from './Renderers.module.css';
import { StoryProgressBar } from '~/v4/social/elements/StoryProgressBar/StoryProgressBar';

export const renderer: CustomRenderer = ({
  story,
  action,
  config,
  messageHandler,
  onSwipeDown,
  onClose,
  onClickCommunity,
}) => {
  const { formatMessage } = useIntl();
  const [loaded, setLoaded] = useState(false);
  const [muted, setMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isOpenBottomSheet, setIsOpenBottomSheet] = useState(false);
  const [isOpenCommentSheet, setIsOpenCommentSheet] = useState(false);
  const { loader } = config;
  const { client } = useSDK();
  const { user } = useUser(client?.userId);

  const isLiked = !!(story && story.myReactions && story.myReactions.includes(LIKE_REACTION_KEY));
  const totalLikes = story?.reactions[LIKE_REACTION_KEY] || 0;

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
    myReactions,
    currentIndex,
    storiesCount,
    increaseIndex,
    pageId,
  } = story;

  const { members } = useCommunityMembersCollection(community?.communityId as string);
  const member = members?.find((member) => member.userId === client?.userId);
  const isMember = member != null;

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

  const isOfficial = community?.isOfficial || false;
  const isCreator = creator?.userId === user?.userId;
  const isGlobalAdmin = isAdmin(user?.roles);
  const isCommunityModerator = isModerator(user?.roles);
  const haveStoryPermission =
    isGlobalAdmin || isCommunityModerator || checkStoryPermission(client, community?.communityId);

  const vid = useRef<HTMLVideoElement>(null);
  const controls = useAnimationControls();

  const onWaiting = () => action('pause', true);
  const onPlaying = () => action('play', true);

  const videoLoaded = () => {
    messageHandler('UPDATE_VIDEO_DURATION', { duration: vid?.current?.duration });
    setLoaded(true);
    vid?.current
      ?.play()
      .then(() => {
        if (isPaused) {
          setIsPaused(false);
        }
        action('play');
      })
      .catch(() => {
        setMuted(true);
        vid?.current?.play().finally(() => {
          action('play');
        });
      });
  };

  const mute = () => setMuted(true);
  const unmute = () => setMuted(false);

  const play = () => setIsPaused(false);
  const pause = () => setIsPaused(true);

  const openBottomSheet = () => setIsOpenBottomSheet(true);
  const closeBottomSheet = () => setIsOpenBottomSheet(false);

  const openCommentSheet = () => setIsOpenCommentSheet(true);
  const closeCommentSheet = () => setIsOpenCommentSheet(false);

  const targetRootId = 'asc-uikit-stories-viewer';

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
    setIsPaused(true);
    action('pause', true);
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 100) {
      handleSwipeDown();
    } else {
      controls.start({ y: 0, transition: { duration: 0.3, ease: 'easeOut' } }).then(() => {
        setIsPaused(false);
        action('play', true);
      });
    }
  };

  const handleOnClose = () => {
    onClose();
  };

  const handleProgressComplete = useCallback(() => {
    increaseIndex();
  }, [increaseIndex]);

  useEffect(() => {
    if (vid.current) {
      if (isPaused || isOpenBottomSheet || isOpenCommentSheet) {
        vid.current.pause();
        action('pause', true);
      } else {
        vid.current.play().catch(() => {});
        action('play', true);
      }
    }
  }, [isPaused, isOpenBottomSheet, isOpenCommentSheet]);

  useEffect(() => {
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

  return (
    <motion.div
      className={clsx(rendererStyles.rendererContainer)}
      animate={controls}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 0.95, borderRadius: '8px', cursor: 'grabbing' }}
    >
      <StoryProgressBar
        pageId={pageId}
        duration={5000}
        currentIndex={currentIndex}
        storiesCount={storiesCount}
        isPaused={isPaused || isOpenBottomSheet || isOpenCommentSheet}
        onComplete={handleProgressComplete}
      />
      <SpeakerButton
        pageId="story_page"
        componentId="*"
        isMuted={muted}
        onPress={muted ? unmute : mute}
      />
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
        onMute={mute}
        onUnmute={unmute}
        onAction={openBottomSheet}
        onClickCommunity={() => onClickCommunity?.()}
        onClose={handleOnClose}
        addStoryButton={addStoryButton}
      />
      <video
        data-qa-anchor="video_view"
        ref={vid}
        className={clsx(rendererStyles.storyVideo)}
        src={story?.videoData?.fileUrl || story?.videoData?.videoUrl?.original}
        controls={false}
        onLoadedData={videoLoaded}
        playsInline
        onWaiting={onWaiting}
        onPlaying={onPlaying}
        muted={muted}
        autoPlay
      />
      {!loaded && (
        <div className={clsx(rendererStyles.loadingOverlay)}>{loader || <div>loading...</div>}</div>
      )}

      <BottomSheet
        rootId={targetRootId}
        isOpen={isOpenBottomSheet}
        onClose={closeBottomSheet}
        mountPoint={document.getElementById(targetRootId) as HTMLElement}
        detent="content-height"
      >
        {actions?.map((bottomSheetAction) => (
          <Button
            className={clsx(rendererStyles.actionButton)}
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
      >
        <CommentTray
          referenceId={storyId}
          referenceType={'story'}
          community={community as Amity.Community}
          shouldAllowCreation={community?.allowCommentInStory}
          shouldAllowInteraction={isMember}
        />
      </BottomSheet>
      {story.items?.[0]?.data?.url && (
        <div className={clsx(rendererStyles.hyperLinkContainer)}>
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
        reactionsCount={totalLikes}
        isLiked={isLiked}
        onClickComment={openCommentSheet}
        myReactions={myReactions}
        showImpression={isCreator || haveStoryPermission}
        isMember={isMember}
      />
    </motion.div>
  );
};

export const tester: Tester = (story) => {
  return {
    condition: story.type === 'video',
    priority: 2,
  };
};

export default {
  renderer,
  tester,
};
