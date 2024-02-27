import * as React from 'react';
import { Tester } from 'react-insta-stories/dist/interfaces';
import Header from './Wrappers/Header';
import Footer from './Wrappers/Footer';
import {
  StoryActionItem,
  StoryActionItemText,
  StoryActionSheet,
  StoryActionSheetContent,
} from '~/social/components/StoryViewer/styles';
import {
  LoadingOverlay,
  RendererContainer,
  StoryImage,
} from '~/social/components/StoryViewer/Renderers/styles';
import { useNavigation } from '~/social/providers/NavigationProvider';
import useImage from '~/core/hooks/useImage';
import { formatTimeAgo } from '~/utils';
import { isAdmin, isModerator } from '~/helpers/permissions';
import useUser from '~/core/hooks/useUser';
import useSDK from '~/core/hooks/useSDK';
import { useIntl } from 'react-intl';
import { Permissions } from '~/social/constants';
import { CustomRenderer } from '~/social/components/StoryViewer/Renderers/types';

export const renderer: CustomRenderer = ({ story, action, config }) => {
  const { formatMessage } = useIntl();
  const { onBack, onClickCommunity } = useNavigation();
  const [loaded, setLoaded] = React.useState(false);
  const [isOpenBottomSheet, setIsOpenBottomSheet] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const { width, height, loader, storyStyles } = config;
  const { currentUserId, client } = useSDK();
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
  const targetRootId = 'stories-viewer';

  React.useEffect(() => {
    if (isPaused || isOpenBottomSheet) {
      action('pause', true);
    } else {
      action('play', true);
    }
  }, [isPaused, isOpenBottomSheet]);

  return (
    <RendererContainer>
      <Header
        avatar={avatarUrl!}
        heading={heading!}
        subheading={subheading}
        isHaveActions={actions?.length > 0}
        haveStoryPermission={isStoryCreator && haveStoryPermission}
        isOfficial={isOfficial}
        isPaused={isPaused}
        onPlay={play}
        onPause={pause}
        onAction={openBottomSheet}
        onAddStory={story?.onChange}
        onClickCommunity={() => onClickCommunity(community?.communityId as string)}
        onClose={onBack}
      />

      <StoryImage style={computedStyles} src={story.url} onLoad={imageLoaded} />

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
