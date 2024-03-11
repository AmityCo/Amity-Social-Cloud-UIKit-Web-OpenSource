import * as React from 'react';
import { Tester } from 'react-insta-stories/dist/interfaces';
import Header from '~/social/components/StoryViewer/Renderers/Wrappers/Header';
import Footer from '~/social/components/StoryViewer/Renderers/Wrappers/Footer';
import {
  StoryActionItem,
  StoryActionItemText,
  MobileSheet,
  MobileSheetHeader,
  MobileSheetContent,
  MobileActionSheetContent,
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

import { LIKE_REACTION_KEY } from '~/constants';
import StoryCommentComposeBar from '~/social/components/StoryCommentComposeBar';
import CommentList from '~/social/v4/components/CommentList';

export const renderer: CustomRenderer = ({ story, action, config }) => {
  const { formatMessage } = useIntl();
  const { onBack, onClickCommunity } = useNavigation();
  const [loaded, setLoaded] = React.useState(false);
  const [isOpenBottomSheet, setIsOpenBottomSheet] = React.useState(false);
  const [isOpenCommentSheet, setIsOpenCommentSheet] = React.useState(false);
  const [isReplying, setIsReplying] = React.useState(false);
  const [replyTo, setReplyTo] = React.useState<string | null>(null);
  const [selectedComment, setSelectedComment] = React.useState<{
    referenceType?: string;
    referenceId?: string;
    commentId?: string;
  } | null>(null);

  const [isPaused, setIsPaused] = React.useState(false);
  const { width, height, loader, storyStyles } = config;
  const { currentUserId, client } = useSDK();
  const user = useUser(currentUserId);

  const isLiked = !!(story && story.myReactions && story.myReactions.includes(LIKE_REACTION_KEY));
  const totalLikes = story.reactions[LIKE_REACTION_KEY] || 0;

  const { syncState, reach, commentsCount, createdAt, creator, community, actions, onChange } =
    story;

  const isJoined = community?.isJoined || false;

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

  const haveStoryPermission =
    (community &&
      client?.hasPermission(Permissions.ManageStoryPermission).community(community.communityId)) ||
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
    if (isPaused || isOpenBottomSheet || isOpenCommentSheet) {
      action('pause', true);
    } else {
      action('play', true);
    }
  }, [isPaused, isOpenBottomSheet, isOpenCommentSheet]);

  return (
    <RendererContainer>
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
        onAction={openBottomSheet}
        onAddStory={onChange}
        onClickCommunity={() => onClickCommunity(community?.communityId as string)}
        onClose={onBack}
      />
      <StoryImage style={computedStyles} src={story.url} onLoad={imageLoaded} />
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
            isJoined={isJoined}
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
        detent="content-height"
        mountPoint={document.getElementById(targetRootId) as HTMLElement}
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
