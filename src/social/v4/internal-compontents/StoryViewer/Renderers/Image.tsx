import React, { useState, useEffect } from 'react';
import { Tester } from 'react-insta-stories/dist/interfaces';
import Header from '~/social/v4/internal-compontents/StoryViewer/Renderers/Wrappers/Header';
import Footer from '~/social/v4/internal-compontents/StoryViewer/Renderers/Wrappers/Footer';
import {
  StoryActionItem,
  StoryActionItemText,
  MobileSheet,
  MobileActionSheetContent,
} from '~/social/v4/internal-compontents/StoryViewer/styles';
import {
  LoadingOverlay,
  RendererContainer,
  StoryImage,
} from '~/social/v4/internal-compontents/StoryViewer/Renderers/styles';
import { useNavigation } from '~/social/providers/NavigationProvider';
import useImage from '~/core/hooks/useImage';
import { formatTimeAgo } from '~/utils';
import { isAdmin, isModerator } from '~/helpers/permissions';
import useUser from '~/core/hooks/useUser';
import useSDK from '~/core/hooks/useSDK';
import { useIntl } from 'react-intl';
import { Permissions } from '~/social/constants';
import { CustomRenderer } from '~/social/v4/internal-compontents/StoryViewer/Renderers/types';

import { LIKE_REACTION_KEY } from '~/constants';

import { CommentTray } from '~/social/v4/components/CommentTray';
import { BottomSheet } from '~/core/v4/components';

export const renderer: CustomRenderer = ({ story, action, config }) => {
  const { formatMessage } = useIntl();
  const { onBack, onClickCommunity } = useNavigation();
  const [loaded, setLoaded] = useState(false);
  const [isOpenBottomSheet, setIsOpenBottomSheet] = useState(false);
  const [isOpenCommentSheet, setIsOpenCommentSheet] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyTo, setReplyTo] = useState<string | undefined>(undefined);
  const [selectedComment, setSelectedComment] = useState<{
    referenceType?: string;
    referenceId?: string;
    commentId?: string;
  } | null>(null);

  const [isPaused, setIsPaused] = useState(false);
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
      <BottomSheet
        rootId={targetRootId}
        isOpen={isOpenBottomSheet}
        onClose={closeBottomSheet}
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
