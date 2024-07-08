import React, { useEffect, useRef, useState } from 'react';

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
  onClose,
  onClickCommunity,
}) => {
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
    dragEventTarget,
  } = story;

  const { members } = useCommunityMembersCollection({
    queryParams: {
      communityId: community?.communityId as string,
    },
    shouldCall: !!community?.communityId,
  });
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

  const play = () => {
    action('play', true);
    setIsPaused(false);
  };
  const pause = () => {
    action('pause', true);
    setIsPaused(true);
  };

  const openBottomSheet = () => {
    action('pause', true);
    setIsOpenBottomSheet(true);
  };
  const closeBottomSheet = () => {
    action('play', true);
    setIsOpenBottomSheet(false);
  };
  const openCommentSheet = () => {
    action('pause', true);
    setIsOpenCommentSheet(true);
  };
  const closeCommentSheet = () => {
    action('play', true);
    setIsOpenCommentSheet(false);
  };

  const targetRootId = 'asc-uikit-stories-viewer';

  const handleOnClose = () => {
    onClose();
  };

  const handleProgressComplete = () => {
    if (currentIndex + 1 < storiesCount) {
      increaseIndex();
    } else {
      onClose();
    }
  };

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
        setIsPaused(true);
      });
      fileInputRef.current.addEventListener('cancel', () => {
        action('play', true);
        setIsPaused(false);
      });
    }
  }, []);

  useEffect(() => {
    if (dragEventTarget) {
      const handleDragStart = () => {
        action('pause', true);
        setIsPaused(true);
      };
      const handleDragEnd = () => {
        action('play', true);
        setIsPaused(false);
      };

      dragEventTarget.current?.addEventListener('dragstart', handleDragStart);
      dragEventTarget.current?.addEventListener('dragend', handleDragEnd);

      return () => {
        dragEventTarget.current?.removeEventListener('dragstart', handleDragStart);
        dragEventTarget.current?.removeEventListener('dragend', handleDragEnd);
      };
    }
  }, [dragEventTarget]);

  return (
    <div className={clsx(rendererStyles.rendererContainer)}>
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
              closeBottomSheet();
            }}
            variant="secondary"
          >
            {bottomSheetAction?.icon && bottomSheetAction.icon}
            <Typography.BodyBold>{bottomSheetAction.name}</Typography.BodyBold>
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
        pageId={pageId}
        storyId={storyId}
        syncState={syncState}
        reach={reach}
        commentsCount={commentsCount}
        reactionsCount={totalLikes}
        isLiked={isLiked}
        onClickComment={openCommentSheet}
        myReactions={myReactions}
        // only show impression if user is creator, community moderator or has story permission
        showImpression={
          isCreator || isCommunityModerator || checkStoryPermission(client, community?.communityId)
        }
        isMember={isMember}
      />
    </div>
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
