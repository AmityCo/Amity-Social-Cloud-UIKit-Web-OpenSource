import React, { useState, useEffect } from 'react';
import { Tester } from 'react-insta-stories/dist/interfaces';

import styles from './Renderers.module.css';
import { useNavigation } from '~/social/providers/NavigationProvider';
import useImage from '~/core/hooks/useImage';
import { checkStoryPermission, formatTimeAgo } from '~/utils';

import useSDK from '~/core/hooks/useSDK';
import { FormattedMessage, useIntl } from 'react-intl';

import { LIKE_REACTION_KEY } from '~/constants';
import Truncate from 'react-truncate-markup';

import { HyperLinkButtonContainer } from './styles';
import { CustomRenderer } from './types';
import { BottomSheet } from '~/v4/core/components';
import { MobileSheet } from '~/v4/core/components/BottomSheet/styles';
import {
  MobileActionSheetContent,
  MobileSheetHeader,
  StoryActionItem,
  StoryActionItemText,
} from '../styles';
import { CommentTray } from '~/v4/social/components';
import { HyperLink } from '~/v4/social/elements/HyperLink';
import Footer from './Wrappers/Footer';
import Header from './Wrappers/Header';
import { PageTypes } from '~/social/constants';
import useUser from '~/core/hooks/useUser';

export const renderer: CustomRenderer = ({ story, action, config }) => {
  const { formatMessage } = useIntl();
  const { page, onChangePage, onClickCommunity } = useNavigation();
  const [loaded, setLoaded] = useState(false);
  const [isOpenBottomSheet, setIsOpenBottomSheet] = useState(false);
  const [isOpenCommentSheet, setIsOpenCommentSheet] = useState(false);

  const [isPaused, setIsPaused] = useState(false);
  const { width, height, loader, storyStyles } = config;
  const { client } = useSDK();

  const isLiked = !!(story && story.myReactions && story.myReactions.includes(LIKE_REACTION_KEY));
  const totalLikes = story.reactions[LIKE_REACTION_KEY] || 0;
  const {
    storyId,
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

  const user = useUser();

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
  const haveStoryPermission = checkStoryPermission(client, community?.communityId);

  const computedStyles = {
    ...rendererStyles.storyContent,
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

  useEffect(() => {
    if (isPaused || isOpenBottomSheet || isOpenCommentSheet) {
      action('pause', true);
    } else {
      action('play', true);
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
    <div className={styles.rendererContainer}>
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
        onAddStory={handleAddIconClick}
        onClickCommunity={() => onClickCommunity(community?.communityId as string)}
        onClose={() => {
          if (page.type === PageTypes.ViewStory && page.storyType === 'globalFeed') {
            onChangePage(PageTypes.NewsFeed);
            return;
          }
          onClickCommunity(community?.communityId as string);
        }}
        addStoryButton={addStoryButton}
      />
      <img
        className={styles.storyImage}
        data-qa-anchor="image_view"
        style={computedStyles}
        src={story.url}
        onLoad={imageLoaded}
        alt="Story Image"
      />
      {!loaded && (
        <div className={styles.loadingOverlay} style={{ width, height }}>
          {loader || <div>loading...</div>}
        </div>
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
      <BottomSheet
        rootId={targetRootId}
        isOpen={isOpenCommentSheet}
        onClose={closeCommentSheet}
        mountPoint={document.getElementById(targetRootId) as HTMLElement}
        detent="full-height"
      >
        <MobileSheet.Container>
          <MobileSheet.Header
            style={{
              borderTopLeftRadius: '1rem',
              borderTopRightRadius: '1rem',
              borderBottom: 'none',
            }}
          />
          <MobileSheetHeader>
            <FormattedMessage id="storyViewer.commentSheet.title" />
          </MobileSheetHeader>
          <MobileSheet.Content>
            <CommentTray
              referenceId={storyId}
              referenceType="story"
              community={community as Amity.Community}
              shouldAllowCreation={community?.allowCommentInStory}
              shouldAllowInteraction={isJoined}
            />
          </MobileSheet.Content>
        </MobileSheet.Container>
      </BottomSheet>
      {story.items?.[0]?.data?.url && (
        <HyperLinkButtonContainer>
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
              <span>{story.items?.[0]?.data?.customText || story.items?.[0].data.url}</span>
            </Truncate>
          </HyperLink>
        </HyperLinkButtonContainer>
      )}
      <Footer
        storyId={storyId}
        syncState={syncState}
        reach={reach}
        commentsCount={commentsCount}
        totalLikes={totalLikes}
        isLiked={isLiked}
        onClickComment={openCommentSheet}
        showImpression={isCreator || haveStoryPermission}
      />
    </div>
  );
};

const rendererStyles = {
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
