import * as React from 'react';
import { Tester } from 'react-insta-stories/dist/interfaces';
import {
  LoadingOverlay,
  StoryVideo,
  RendererContainer,
  MuteCircleIcon,
  UnmuteCircleIcon,
  IconButton,
} from '~/social/components/StoryViewer/Renderers/styles';
import {
  MobileActionSheetContent,
  MobileSheet,
  MobileSheetContent,
  MobileSheetHeader,
  StoryActionItem,
  StoryActionItemText,
} from '~/social/components/StoryViewer/styles';
import Footer from '~/social/components/StoryViewer/Renderers/Wrappers/Footer';
import Header from '~/social/components/StoryViewer/Renderers/Wrappers/Header';
import useImage from '~/core/hooks/useImage';
import { formatTimeAgo } from '~/utils';
import { useNavigation } from '~/social/providers/NavigationProvider';
import { useIntl } from 'react-intl';
import { Permissions } from '~/social/constants';
import { isAdmin, isModerator } from '~/helpers/permissions';
import useSDK from '~/core/hooks/useSDK';
import useUser from '~/core/hooks/useUser';
import { CustomRenderer } from '~/social/components/StoryViewer/Renderers/types';
import CommentList from '~/social/components/CommentList';

import { LIKE_REACTION_KEY } from '~/constants';
import StoryCommentComposeBar from '~/social/components/StoryCommentComposeBar';

export const renderer: CustomRenderer = ({ story, action, config, messageHandler }) => {
  const { formatMessage } = useIntl();
  const { onBack, onClickCommunity } = useNavigation();
  const [loaded, setLoaded] = React.useState(false);
  const [muted, setMuted] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const [isOpenBottomSheet, setIsOpenBottomSheet] = React.useState(false);
  const [isOpenCommentSheet, setIsOpenCommentSheet] = React.useState(false);
  const { width, height, loader, storyStyles } = config;
  const { client, currentUserId } = useSDK();
  const user = useUser(currentUserId);
  const [isReplying, setIsReplying] = React.useState(false);
  const [replyTo, setReplyTo] = React.useState<string | null>(null);
  const [selectedComment, setSelectedComment] = React.useState<{
    referenceType?: string;
    referenceId?: string;
    commentId?: string;
  } | null>(null);

  const isLiked = !!(story && story.myReactions && story.myReactions.includes(LIKE_REACTION_KEY));
  const totalLikes = story?.reactions[LIKE_REACTION_KEY] || 0;

  const { syncState, reach, commentsCount, createdAt, creator, community, actions, onChange } =
    story;

  const avatarUrl = useImage({
    fileId: community?.avatarFileId || '',
    imageSize: 'small',
  });

  const heading = community?.displayName;
  const isOfficial = community?.isOfficial || false;
  const subheading =
    createdAt && creator?.displayName
      ? `${formatTimeAgo(createdAt as string)} • By ${creator?.displayName}`
      : '';

  const isStoryCreator = creator?.userId === currentUserId;
  const haveStoryPermission =
    (community &&
      client?.hasPermission(Permissions.ManageStoryPermission).community(community.communityId)) ||
    isAdmin(user?.roles) ||
    isModerator(user?.roles);

  const computedStyles = {
    ...styles.storyContent,
    ...(storyStyles || {}),
  };

  const vid = React.useRef<HTMLVideoElement>(null);

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

  const targetRootId = 'stories-viewer';

  const onClickReply = (
    replyTo: string,
    referenceType?: Amity.Comment['referenceType'],
    referenceId?: Amity.Comment['referenceId'],
    commentId?: Amity.Comment['commentId'],
  ) => {
    setReplyTo(replyTo);
    setSelectedComment({ referenceType, referenceId, commentId });
    setIsReplying(true);
  };

  React.useEffect(() => {
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

  return (
    <RendererContainer>
      <IconButton>
        {!muted ? <MuteCircleIcon onClick={mute} /> : <UnmuteCircleIcon onClick={unmute} />}
      </IconButton>
      <Header
        avatar={avatarUrl}
        heading={heading}
        subheading={subheading}
        isHaveActions={actions?.length > 0}
        haveStoryPermission={isStoryCreator || haveStoryPermission}
        isOfficial={isOfficial}
        isPaused={isPaused}
        onPlay={play}
        onPause={pause}
        onMute={mute}
        onUnmute={unmute}
        onAction={openBottomSheet}
        onAddStory={onChange}
        onClickCommunity={() => onClickCommunity(community?.communityId as string)}
        onClose={onBack}
      />
      <StoryVideo
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

      <MobileSheet
        rootId={targetRootId}
        isOpen={isOpenCommentSheet}
        onClose={closeCommentSheet}
        mountPoint={document.getElementById(targetRootId) as HTMLElement}
      >
        <MobileSheet.Container>
          <MobileSheet.Header />
          <MobileSheetHeader>
            {formatMessage({ id: 'storyViewer.commentSheet.title' })}
          </MobileSheetHeader>
          <MobileSheetContent>
            <MobileSheet.Scroller>
              <CommentList
                referenceId={story.storyId}
                referenceType="story"
                onClickReply={onClickReply}
              />
            </MobileSheet.Scroller>
          </MobileSheetContent>
          <StoryCommentComposeBar
            referenceId={selectedComment?.referenceId}
            referenceType={selectedComment?.referenceType}
            commentId={selectedComment?.commentId}
            isReplying={isReplying}
            replyTo={replyTo}
            storyId={story.storyId}
            isJoined={community?.isJoined}
            allowCommentInStory={community?.allowCommentInStory}
            onCancelReply={() => setIsReplying(false)}
          />
        </MobileSheet.Container>
        <MobileSheet.Backdrop onTap={closeCommentSheet} />
      </MobileSheet>

      <MobileSheet
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
      </MobileSheet>
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
