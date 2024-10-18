import React, { useEffect, useRef, useState, useCallback } from 'react';
import Truncate from 'react-truncate-markup';
import {
  CustomRenderer,
  Tester,
} from '~/v4/social/internal-components/StoryViewer/Renderers/types';
import { SpeakerButton, HyperLink, BrandBadge } from '~/v4/social/elements';
import { BottomSheet, Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/natives/Button';
import { CommentTray } from '~/v4/social/components';
import Header from '~/v4/social/internal-components/StoryViewer/Renderers/Wrappers/Header';
import Footer from '~/v4/social/internal-components/StoryViewer/Renderers/Wrappers/Footer';
import useCommunityMembersCollection from '~/v4/social/hooks/collections/useCommunityMembersCollection';
import useSDK from '~/v4/core/hooks/useSDK';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { LIKE_REACTION_KEY } from '~/v4/social/constants/reactions';
import { checkStoryPermission, formatTimeAgo } from '~/v4/social/utils';
import { StoryProgressBar } from '~/v4/social/elements/StoryProgressBar/StoryProgressBar';
import clsx from 'clsx';
import rendererStyles from './Renderers.module.css';
import { Action } from 'react-insta-stories/dist/interfaces';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useStoryPermission } from '~/v4/social/hooks/useStoryPermission';

const DEFAULT_VIDEO_DURATION = 15000;

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
    isConfirmDialogOpen,
  },
  action,
  config,
  messageHandler,
  onClose,
  onClickCommunity,
  onDeleteStory,
}) => {
  const { isDesktop } = useResponsive();
  const { openPopup, closePopup } = usePopupContext();
  const [loaded, setLoaded] = useState(false);
  const { loader } = config;
  const { client } = useSDK();
  const { user } = useUser({ userId: client?.userId });
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

  const isOfficial = community?.isOfficial || false;
  const isCreator = creator?.userId === user?.userId;
  const { hasStoryPermission } = useStoryPermission(community?.communityId);

  const [videoDuration, setVideoDuration] = useState<number | null>(DEFAULT_VIDEO_DURATION);
  const [videoSrc, setVideoSrc] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (story?.videoData) {
      setVideoSrc(story.videoData.fileUrl || story.videoData.videoUrl?.original);
      // @ts-ignore
      setVideoDuration(story.videoData.attributes.metadata.video.duration * 1000);
    } else {
      const base64Video = story?.data?.fileData as string;
      const base64WithoutPrefix = base64Video?.split(',')[1];

      if (!base64WithoutPrefix) {
        // SDK sends empty fileData the first time when the story fails to upload
        // so we need to check if fileData is empty, then set videoSrc to empty string and the duration for a while to keep the preview show until the fileData is updated
        setVideoSrc('');
        setVideoDuration(DEFAULT_VIDEO_DURATION);
        return;
      }

      const byteArray = Uint8Array.from(atob(base64WithoutPrefix), (c) => c.charCodeAt(0));
      const blob = new Blob([byteArray], { type: 'video/mp4' });
      const blobUrl = URL.createObjectURL(blob);

      setVideoSrc(blobUrl);

      // Create a video element to get the duration
      const videoElement = document.createElement('video');
      videoElement.src = blobUrl;

      // Get the video duration once metadata is loaded
      videoElement.addEventListener('loadedmetadata', () => {
        setVideoDuration(videoElement.duration * 1000); // Duration in milliseconds
      });

      return () => {
        setVideoSrc('');
        if (blobUrl) URL.revokeObjectURL(blobUrl);
      };
    }
  }, [story?.videoData, story?.data?.fileData]);

  const [isLoading, setIsLoading] = useState(true);

  const videoLoaded = useCallback(() => {
    messageHandler('UPDATE_VIDEO_DURATION', {
      // TODO: need to fix video type from TS-SDK
      // @ts-ignore
      duration: videoDuration,
    });
    setLoaded(true);
    action('play', true);
    // TODO: need to fix video type from TS-SDK
    // @ts-ignore
  }, [messageHandler, videoDuration, action]);

  const handleProgressComplete = useCallback(() => {
    if (currentIndex + 1 < storiesCount) {
      increaseIndex();
    } else {
      onClose();
    }
  }, [currentIndex, storiesCount, increaseIndex, onClose]);

  useEffect(() => {
    if (vid.current) {
      if (isPaused || isBottomSheetOpen || isOpenCommentSheet || isConfirmDialogOpen) {
        vid.current.pause();
        action('pause', true);
      } else {
        videoLoaded();
        vid.current.play();
        action('play', true);
      }
    }
  }, [isPaused, isBottomSheetOpen, isOpenCommentSheet, isConfirmDialogOpen, vid, action]);

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

  const renderCommentTray = () => (
    <CommentTray
      pageId={pageId}
      referenceId={storyId}
      referenceType="story"
      community={community as Amity.Community}
      shouldAllowCreation={community?.allowCommentInStory}
    />
  );

  const renderMenuButton = useCallback(
    (closePopover?: () => void) => {
      return (
        <>
          {actions?.map((bottomSheetAction) => (
            <Button
              key={bottomSheetAction.name}
              className={rendererStyles.actionButton}
              onPress={() => {
                closePopover?.();
                closeBottomSheet();
                bottomSheetAction?.action();
              }}
            >
              {bottomSheetAction?.icon && bottomSheetAction.icon}
              <Typography.BodyBold>{bottomSheetAction.name}</Typography.BodyBold>
            </Button>
          ))}
        </>
      );
    },
    [actions],
  );

  const onClickCommentButton = useCallback(() => {
    if (isDesktop) {
      pause();
      openPopup({
        pageId: 'story_page',
        componentId: 'comment_tray_component',
        header: (
          <Typography.Headline className={rendererStyles.commentTrayHeader}>
            Comments
          </Typography.Headline>
        ),
        children: renderCommentTray(),
        isDismissable: false,
        onClose: () => {
          closePopup();
          play();
        },
      });
    } else {
      openCommentSheet();
    }
  }, [action]);

  const onClickMenuButton = useCallback((openPopover) => {
    if (isDesktop) {
      pause();
      openPopover();
    } else openBottomSheet();
  }, []);

  return (
    <div className={clsx(rendererStyles.rendererContainer)}>
      <StoryProgressBar
        pageId={pageId}
        duration={videoDuration ?? DEFAULT_VIDEO_DURATION}
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
        heading={<div data-testid="community_display_name">{community?.displayName}</div>}
        subheading={
          createdAt && creator?.displayName ? (
            <span className={rendererStyles.creatorWrapper}>
              <span data-testid="created_at">{formatTimeAgo(createdAt as string)}</span> • By{' '}
              <span
                data-testid="creator_display_name"
                className={rendererStyles.creatorDisplayName}
              >
                {creator?.displayName}
              </span>
              {creator?.isBrand && <BrandBadge pageId={pageId} />}
            </span>
          ) : (
            ''
          )
        }
        isHaveActions={actions?.length > 0}
        haveStoryPermission={hasStoryPermission}
        isOfficial={isOfficial}
        isPaused={isPaused}
        onPlay={play}
        onPause={pause}
        onMute={mute}
        onUnmute={unmute}
        onAction={onClickMenuButton}
        onClickCommunity={() => onClickCommunity?.()}
        onClose={onClose}
        addStoryButton={addStoryButton}
        actionButton={renderMenuButton}
      />
      <video
        data-testid="video_view"
        ref={vid}
        className={clsx(rendererStyles.storyVideo)}
        src={videoSrc}
        key={videoSrc}
        controls={false}
        onLoadedData={videoLoaded}
        playsInline
        onCanPlay={() => {
          setIsLoading(false);
        }}
        onWaiting={() => {
          action('pause', true);
        }}
        onPlaying={() => {
          action('play', true);
        }}
        muted={muted}
        autoPlay
      />
      {(!loaded || isLoading) && (
        <div className={clsx(rendererStyles.loadingOverlay)}>{loader || <div>loading...</div>}</div>
      )}
      <BottomSheet
        rootId="asc-uikit-stories-viewer"
        isOpen={isBottomSheetOpen}
        onClose={closeBottomSheet}
        mountPoint={document.getElementById('asc-uikit-stories-viewer') as HTMLElement}
        detent="content-height"
      >
        {renderMenuButton()}
      </BottomSheet>
      <BottomSheet
        rootId="asc-uikit-stories-viewer"
        isOpen={isOpenCommentSheet}
        onClose={closeCommentSheet}
        mountPoint={document.getElementById('asc-uikit-stories-viewer') as HTMLElement}
        detent="full-height"
      >
        {renderCommentTray()}
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
        onClickComment={onClickCommentButton}
        myReactions={myReactions}
        showImpression={isCreator || checkStoryPermission(client, community?.communityId)}
        community={community}
        onPlay={play}
        onPause={pause}
        onDeleteStory={onDeleteStory}
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
