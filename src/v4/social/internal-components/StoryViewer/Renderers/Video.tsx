import React, { useEffect, useRef, useState, useCallback } from 'react';
import Truncate from 'react-truncate-markup';
import {
  CustomRenderer,
  Tester,
} from '~/v4/social/internal-components/StoryViewer/Renderers/types';
import { SpeakerButton, HyperLink } from '~/v4/social/elements';
import { BottomSheet, Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/natives/Button';
import { CommentTray } from '~/v4/social/components';
import Header from '~/v4/social/internal-components/StoryViewer/Renderers/Wrappers/Header';
import Footer from '~/v4/social/internal-components/StoryViewer/Renderers/Wrappers/Footer';
import useCommunityMembersCollection from '~/v4/social/hooks/collections/useCommunityMembersCollection';
import useSDK from '~/v4/core/hooks/useSDK';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { LIKE_REACTION_KEY } from '~/v4/social/constants/reactions';
import { checkStoryPermission, formatTimeAgo, isAdmin, isModerator } from '~/v4/social/utils';
import { StoryProgressBar } from '~/v4/social/elements/StoryProgressBar/StoryProgressBar';
import clsx from 'clsx';
import rendererStyles from './Renderers.module.css';
import { Action } from 'react-insta-stories/dist/interfaces';

const useAudioControl = () => {
  const [muted, setMuted] = useState(false);
  const mute = useCallback(() => setMuted(true), []);
  const unmute = useCallback(() => setMuted(false), []);
  return { muted, mute, unmute };
};

const usePauseControl = (action: Action) => {
  const [isPaused, setIsPaused] = useState(false);
  const play = useCallback(() => {
    action('play', true);
    setIsPaused(false);
  }, [action]);

  const pause = useCallback(() => {
    action('pause', true);
    setIsPaused(true);
  }, [action]);

  return { isPaused, play, pause };
};

const useBottomSheetControl = (action: Action) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isOpenCommentSheet, setIsOpenCommentSheet] = useState(false);

  const openBottomSheet = useCallback(() => {
    action('pause', true);
    setIsBottomSheetOpen(true);
  }, [action]);

  const closeBottomSheet = useCallback(() => {
    action('play', true);
    setIsBottomSheetOpen(false);
  }, [action]);

  const openCommentSheet = useCallback(() => {
    action('pause', true);
    setIsOpenCommentSheet(true);
  }, [action]);

  const closeCommentSheet = useCallback(() => {
    action('play', true);
    setIsOpenCommentSheet(false);
  }, [action]);

  return {
    isBottomSheetOpen,
    isOpenCommentSheet,
    openBottomSheet,
    closeBottomSheet,
    openCommentSheet,
    closeCommentSheet,
  };
};

export const renderer: CustomRenderer = ({
  story: {
    actions,
    addStoryButton,
    fileInputRef,
    currentIndex,
    storiesCount,
    increaseIndex,
    pageId,
    dragEventTarget,
    story,
  },
  action,
  config,
  messageHandler,
  onClose,
  onClickCommunity,
}) => {
  const [loaded, setLoaded] = useState(false);
  const { loader } = config;
  const { client } = useSDK();
  const { user } = useUser(client?.userId);
  const vid = useRef<HTMLVideoElement>(null);

  const { muted, mute, unmute } = useAudioControl();
  const { isPaused, play, pause } = usePauseControl(action);
  const {
    isBottomSheetOpen,
    isOpenCommentSheet,
    openBottomSheet,
    closeBottomSheet,
    openCommentSheet,
    closeCommentSheet,
  } = useBottomSheetControl(action);

  const {
    storyId,
    syncState,
    reach,
    commentsCount,
    createdAt,
    creator,
    community,
    myReactions,
    data,
    items,
  } = story as Amity.Story;

  const isLiked = story?.myReactions?.includes(LIKE_REACTION_KEY);
  const totalLikes = story?.reactions[LIKE_REACTION_KEY] || 0;

  const { members } = useCommunityMembersCollection({
    queryParams: { communityId: community?.communityId as string },
    shouldCall: !!community?.communityId,
  });
  const isMember = members?.some((member) => member.userId === client?.userId);

  const isOfficial = community?.isOfficial || false;
  const isCreator = creator?.userId === user?.userId;
  const isGlobalAdmin = isAdmin(user?.roles);
  const isModeratorUser = isModerator(user?.roles);
  const haveStoryPermission =
    isGlobalAdmin || isModeratorUser || checkStoryPermission(client, community?.communityId);

  const videoLoaded = useCallback(() => {
    messageHandler('UPDATE_VIDEO_DURATION', {
      // TODO: need to fix video type from TS-SDK
      // @ts-ignore
      duration: story?.videoData?.attributes.metadata.video.duration,
    });
    setLoaded(true);
    action('play', true);
    // TODO: need to fix video type from TS-SDK
    // @ts-ignore
  }, [messageHandler, story?.videoData?.attributes.metadata.video.duration, action]);

  const handleProgressComplete = useCallback(() => {
    if (currentIndex + 1 < storiesCount) {
      increaseIndex();
    } else {
      onClose();
    }
  }, [currentIndex, storiesCount, increaseIndex, onClose]);

  useEffect(() => {
    if (vid.current) {
      if (isPaused || isBottomSheetOpen || isOpenCommentSheet) {
        vid.current.pause();
        action('pause', true);
      } else {
        vid.current.play();
        action('play', true);
      }
    }
  }, [isPaused, isBottomSheetOpen, isOpenCommentSheet, action]);

  useEffect(() => {
    if (fileInputRef.current) {
      const handleClick = () => {
        action('pause', true);
        pause();
      };
      const handleCancel = () => {
        action('play', true);
        play();
      };

      fileInputRef.current.addEventListener('click', handleClick);
      fileInputRef.current.addEventListener('cancel', handleCancel);

      return () => {
        fileInputRef.current?.removeEventListener('click', handleClick);
        fileInputRef.current?.removeEventListener('cancel', handleCancel);
      };
    }
  }, [action, pause, play]);

  useEffect(() => {
    if (dragEventTarget?.current) {
      const handleDragStart = () => {
        action('pause', true);
        pause();
      };
      const handleDragEnd = () => {
        action('play', true);
        play();
      };

      dragEventTarget.current.addEventListener('dragstart', handleDragStart);
      dragEventTarget.current.addEventListener('dragend', handleDragEnd);

      return () => {
        dragEventTarget.current?.removeEventListener('dragstart', handleDragStart);
        dragEventTarget.current?.removeEventListener('dragend', handleDragEnd);
      };
    }
  }, [action, pause, play, dragEventTarget]);

  // TODO: need to fix video type from TS-SDK
  // @ts-ignore
  const videoDuration = Math.round(story?.videoData?.attributes.metadata.video.duration * 1000);

  return (
    <div className={clsx(rendererStyles.rendererContainer)}>
      <StoryProgressBar
        pageId={pageId}
        duration={videoDuration}
        currentIndex={currentIndex}
        storiesCount={storiesCount}
        isPaused={isPaused || isBottomSheetOpen || isOpenCommentSheet}
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
        heading={<div data-qa-anchor="community_display_name">{community?.displayName}</div>}
        subheading={
          createdAt && creator?.displayName ? (
            <span>
              <span data-qa-anchor="created_at">{formatTimeAgo(createdAt as string)}</span> • By{' '}
              <span data-qa-anchor="creator_display_name">{creator?.displayName}</span>
            </span>
          ) : (
            ''
          )
        }
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
        onClose={onClose}
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
        onWaiting={() => action('pause', true)}
        onPlaying={() => action('play', true)}
        muted={muted}
        autoPlay
      />
      {!loaded && (
        <div className={clsx(rendererStyles.loadingOverlay)}>{loader || <div>loading...</div>}</div>
      )}
      <BottomSheet
        rootId="asc-uikit-stories-viewer"
        isOpen={isBottomSheetOpen}
        onClose={closeBottomSheet}
        mountPoint={document.getElementById('asc-uikit-stories-viewer') as HTMLElement}
        detent="content-height"
      >
        {actions?.map((bottomSheetAction) => (
          <Button
            key={bottomSheetAction.name}
            className={clsx(rendererStyles.actionButton)}
            onPress={bottomSheetAction?.action}
          >
            {bottomSheetAction?.icon}
            <Typography.BodyBold>{bottomSheetAction.name}</Typography.BodyBold>
          </Button>
        ))}
      </BottomSheet>
      <BottomSheet
        rootId="asc-uikit-stories-viewer"
        isOpen={isOpenCommentSheet}
        onClose={closeCommentSheet}
        mountPoint={document.getElementById('asc-uikit-stories-viewer') as HTMLElement}
        detent="full-height"
      >
        <CommentTray
          referenceId={storyId}
          referenceType="story"
          community={community as Amity.Community}
          shouldAllowCreation={community?.allowCommentInStory}
          shouldAllowInteraction={isMember}
        />
      </BottomSheet>
      {items?.[0]?.data?.url && (
        <div className={clsx(rendererStyles.hyperLinkContainer)}>
          <HyperLink
            href={
              items[0].data.url.startsWith('http')
                ? items[0].data.url
                : `https://${items[0].data.url}`
            }
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => story?.analytics.markLinkAsClicked()}
          >
            <Truncate lines={1}>
              <span>
                {items[0]?.data?.customText || items[0].data.url.replace(/^https?:\/\//, '')}
              </span>
            </Truncate>
          </HyperLink>
        </div>
      )}
      <Footer
        pageId={pageId}
        storyId={storyId}
        syncState={syncState}
        reach={reach}
        commentsCount={commentsCount}
        reactionsCount={totalLikes}
        isLiked={isLiked}
        onClickComment={openCommentSheet}
        myReactions={myReactions}
        showImpression={isCreator || checkStoryPermission(client, community?.communityId)}
        isMember={isMember}
      />
    </div>
  );
};

export const tester: Tester = (story) => {
  return {
    condition: !!story.story?.storyId && story.type === 'video',
    priority: 2,
  };
};

export default { renderer, tester };
