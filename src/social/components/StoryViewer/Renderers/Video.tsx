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
  StoryActionItem,
  StoryActionItemText,
  StoryActionSheet,
  StoryActionSheetContent,
} from '~/social/components/StoryViewer/styles';
import Footer from './Wrappers/Footer';
import Header from './Wrappers/Header';
import useImage from '~/core/hooks/useImage';
import { formatTimeAgo } from '~/utils';
import { useNavigation } from '~/social/providers/NavigationProvider';
import { useIntl } from 'react-intl';
import { Permissions } from '~/social/constants';
import { isAdmin, isModerator } from '~/helpers/permissions';
import useSDK from '~/core/hooks/useSDK';
import useUser from '~/core/hooks/useUser';
import { CustomRenderer } from '~/social/components/StoryViewer/Renderers/types';

export const renderer: CustomRenderer = ({ story, action, config, messageHandler }) => {
  const { formatMessage } = useIntl();
  const { onBack, onClickCommunity } = useNavigation();
  const [loaded, setLoaded] = React.useState(false);
  const [muted, setMuted] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const [isOpenBottomSheet, setIsOpenBottomSheet] = React.useState(false);
  const { width, height, loader, storyStyles } = config;
  const { client, currentUserId } = useSDK();
  const user = useUser(currentUserId);

  const {
    syncState,
    reach,
    commentsCount,
    reactionsCount,
    createdAt,
    creator,
    community,
    actions,
  } = story;

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

  const isStoryCreator = story?.creator?.userId === currentUserId;
  const haveStoryPermission =
    client?.hasPermission(Permissions.ManageStoryPermission).community(community.communityId) ||
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
  const targetRootId = 'stories-viewer';

  React.useEffect(() => {
    if (vid.current) {
      if (isPaused || isOpenBottomSheet) {
        vid.current.pause();
        action('pause', true);
      } else {
        vid.current.play().catch(() => {});
        action('play', true);
      }
    }
  }, [isPaused, isOpenBottomSheet]);

  return (
    <RendererContainer>
      <IconButton>
        {!muted ? <MuteCircleIcon onClick={mute} /> : <UnmuteCircleIcon onClick={unmute} />}
      </IconButton>
      <Header
        avatar={avatarUrl!}
        heading={heading}
        subheading={subheading}
        isHaveActions={actions?.length > 0}
        haveStoryPermission={isStoryCreator && haveStoryPermission}
        isOfficial={isOfficial}
        isPaused={isPaused}
        onPlay={play}
        onPause={pause}
        onMute={mute}
        onUnmute={unmute}
        onAction={openBottomSheet}
        onAddStory={story.onChange}
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
      <StoryActionSheet
        rootId={targetRootId}
        isOpen={isOpenBottomSheet}
        onClose={closeBottomSheet}
        detent="content-height"
        mountPoint={document.getElementById(targetRootId) as HTMLElement}
      >
        <StoryActionSheet.Container>
          <StoryActionSheet.Header />
          <StoryActionSheetContent>
            {actions?.map((bottomSheetAction) => (
              <StoryActionItem onClick={() => bottomSheetAction.action()}>
                {bottomSheetAction.icon}
                <StoryActionItemText>
                  {formatMessage({ id: bottomSheetAction.name })}
                </StoryActionItemText>
              </StoryActionItem>
            ))}
          </StoryActionSheetContent>
        </StoryActionSheet.Container>
        <StoryActionSheet.Backdrop onTap={closeBottomSheet} />
      </StoryActionSheet>
      <Footer
        syncState={syncState}
        reach={reach}
        commentsCount={commentsCount}
        reactionsCount={reactionsCount}
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
