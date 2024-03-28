import React, { useEffect, useRef, useState } from 'react';
import { Tester } from 'react-insta-stories/dist/interfaces';
import {
  LoadingOverlay,
  StoryVideo,
  RendererContainer,
} from '~/social/v4/internal-components/StoryViewer/Renderers/styles';
import {
  MobileActionSheetContent,
  MobileSheet,
  StoryActionItem,
  StoryActionItemText,
} from '~/social/v4/internal-components/StoryViewer/styles';
import Footer from '~/social/v4/internal-components/StoryViewer/Renderers/Wrappers/Footer';
import Header from '~/social/v4/internal-components/StoryViewer/Renderers/Wrappers/Header';
import useImage from '~/core/hooks/useImage';
import { formatTimeAgo } from '~/utils';
import { useNavigation } from '~/social/providers/NavigationProvider';
import { useIntl } from 'react-intl';
import { Permissions } from '~/social/constants';
import { isAdmin, isModerator } from '~/helpers/permissions';
import useSDK from '~/core/hooks/useSDK';
import useUser from '~/core/hooks/useUser';
import { CustomRenderer } from '~/social/v4/internal-components/StoryViewer/Renderers/types';

import { LIKE_REACTION_KEY } from '~/constants';
import Truncate from 'react-truncate-markup';

import { CommentTray } from '~/social/v4/components/CommentTray';
import { SpeakerButton } from '~/social/v4/elements';
import { BottomSheet } from '~/core/v4/components';
import { HyperlinkFormContainer } from '../../HyperLinkBottomSheet/styles';
import { LinkButton } from '~/social/v4/elements/HyperLinkURL';

export const renderer: CustomRenderer = ({ story, action, config, messageHandler }) => {
  const { formatMessage } = useIntl();
  const { onBack, onClickCommunity } = useNavigation();
  const [loaded, setLoaded] = useState(false);
  const [muted, setMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isOpenBottomSheet, setIsOpenBottomSheet] = useState(false);
  const [isOpenCommentSheet, setIsOpenCommentSheet] = useState(false);
  const { width, height, loader, storyStyles } = config;
  const { client, currentUserId } = useSDK();
  const user = useUser(currentUserId);
  const [isReplying, setIsReplying] = useState(false);
  const [replyTo, setReplyTo] = useState<string | undefined>(undefined);
  const [selectedComment, setSelectedComment] = useState<{
    referenceType?: string;
    referenceId?: string;
    commentId?: string;
  } | null>(null);

  const isLiked = !!(story && story.myReactions && story.myReactions.includes(LIKE_REACTION_KEY));
  const totalLikes = story?.reactions[LIKE_REACTION_KEY] || 0;

  const {
    syncState,
    reach,
    commentsCount,
    createdAt,
    creator,
    community,
    actions,
    handleAddIconClick,
    addStoryButton,
    fileInputRef,
  } = story;

  const isJoined = community?.isJoined || false;

  const avatarUrl = useImage({
    fileId: community?.avatarFileId || '',
    imageSize: 'small',
  });

  const isOfficial = community?.isOfficial || false;

  const heading = <div data-qa-anchor="community_display_name">{community?.displayName}</div>;
  const subheading =
    createdAt && creator?.displayName ? (
      <span>
        <span data-qa-anchor="created_at">{formatTimeAgo(createdAt as string)}</span>• By{' '}
        <span data-qa-anchor="creator_display_name">{creator?.displayName}</span>
      </span>
    ) : (
      ''
    );

  const haveStoryPermission =
    (community &&
      client?.hasPermission(Permissions.ManageStoryPermission).community(community.communityId)) ||
    isAdmin(user?.roles) ||
    isModerator(user?.roles);

  const computedStyles = {
    ...styles.storyContent,
    ...(storyStyles || {}),
  };

  const vid = useRef<HTMLVideoElement>(null);

  const onWaiting = () => {
    action('pause', true);
  };

  const onPlaying = () => {
    action('play', true);
  };

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

  const onClickReply = (
    replyTo?: string,
    referenceType?: Amity.Comment['referenceType'],
    referenceId?: Amity.Comment['referenceId'],
    commentId?: Amity.Comment['commentId'],
  ) => {
    setReplyTo(replyTo);
    setSelectedComment({ referenceType, referenceId, commentId });
    setIsReplying(true);
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
    <RendererContainer>
      <SpeakerButton
        pageId="story_page"
        componentId="*"
        isMuted={muted}
        onClick={muted ? unmute : mute}
      />
      <Header
        avatar={avatarUrl}
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
        onAddStory={handleAddIconClick}
        onClickCommunity={() => onClickCommunity(community?.communityId as string)}
        onClose={onBack}
        addStoryButton={addStoryButton}
      />
      <StoryVideo
        data-qa-anchor="video_view"
        ref={vid}
        style={computedStyles}
        src={story?.url || undefined}
        controls={false}
        onLoadedData={videoLoaded}
        playsInline
        onWaiting={onWaiting}
        onPlaying={onPlaying}
        muted={muted}
        autoPlay
        webkit-playsinline="true"
      />
      {!loaded && (
        <LoadingOverlay width={width} height={height}>
          {loader || <div>loading...</div>}
        </LoadingOverlay>
      )}

      <BottomSheet
        rootId={targetRootId}
        isOpen={isOpenBottomSheet}
        onClose={closeBottomSheet}
        mountPoint={document.getElementById(targetRootId) as HTMLElement}
        detent="content-height"
      >
        <MobileSheet.Container>
          <MobileSheet.Header />
          <MobileActionSheetContent>
            {actions?.map((bottomSheetAction) => (
              <StoryActionItem
                onClick={() => {
                  bottomSheetAction.action();
                  closeBottomSheet();
                }}
              >
                {bottomSheetAction.icon}
                <StoryActionItemText>
                  {formatMessage({ id: bottomSheetAction.name })}
                </StoryActionItemText>
              </StoryActionItem>
            ))}
          </MobileActionSheetContent>
        </MobileSheet.Container>
        <MobileSheet.Backdrop onTap={closeBottomSheet} />
      </BottomSheet>
      <CommentTray
        pageId="*"
        isOpen={isOpenCommentSheet}
        onClose={closeCommentSheet}
        referenceId={selectedComment?.referenceId}
        referenceType={selectedComment?.referenceType}
        commentId={selectedComment?.commentId}
        isReplying={isReplying}
        replyTo={replyTo}
        storyId={story.storyId}
        isJoined={isJoined}
        allowCommentInStory={community?.allowCommentInStory}
        onCancelReply={() => setIsReplying(false)}
        onClickReply={onClickReply}
      />
      {story.items?.[0].data.url && (
        <HyperlinkFormContainer>
          <LinkButton href={story.items?.[0].data.url}>
            <Truncate lines={1}>
              <span>{story.items?.[0].data.customText || story.items?.[0].data.url}</span>
            </Truncate>
          </LinkButton>
        </HyperlinkFormContainer>
      )}
      <Footer
        storyId={story.storyId}
        syncState={syncState}
        reach={reach}
        commentsCount={commentsCount}
        totalLikes={totalLikes}
        isLiked={isLiked}
        onClickComment={openCommentSheet}
      />
    </RendererContainer>
  );
};

const styles = {
  storyContent: {
    width: 'auto',
    maxWidth: '100%',
    maxHeight: '100%',
    margin: 'auto',
    position: 'relative' as const,
  },
  videoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
