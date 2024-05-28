import React, { useState, useEffect } from 'react';
import { Tester } from 'react-insta-stories/dist/interfaces';

import styles from './Renderers.module.css';
import { useNavigation } from '~/social/providers/NavigationProvider';
import useImage from '~/core/hooks/useImage';

import { checkStoryPermission, formatTimeAgo } from '~/utils';

import useSDK from '~/core/hooks/useSDK';
import { useIntl } from 'react-intl';

import { LIKE_REACTION_KEY } from '~/constants';
import Truncate from 'react-truncate-markup';

import { CustomRenderer } from './types';

import { CommentTray } from '~/v4/social/components';
import { HyperLink } from '~/v4/social/elements/HyperLink';
import Footer from './Wrappers/Footer';
import Header from './Wrappers/Header';
import { PageTypes } from '~/social/constants';
import { motion, PanInfo, useAnimationControls } from 'framer-motion';
import useUser from '~/core/hooks/useUser';
import { BottomSheet } from '~/v4/core/components/BottomSheet';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/components/Button';

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

  const user = useUser(client?.userId);

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

  const controls = useAnimationControls();

  const handleSwipeDown = () => {
    controls
      .start({
        y: '100%',
        transition: { duration: 0.3, ease: 'easeOut' },
      })
      .then(() => {
        if (page.type === PageTypes.ViewStory && page.storyType === 'globalFeed') {
          onChangePage(PageTypes.NewsFeed);
        } else {
          onClickCommunity(community?.communityId as string);
        }
      });
  };

  const handleDragStart = () => {
    action('pause', true);
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 100) {
      handleSwipeDown();
    } else {
      controls.start({ y: 0, transition: { duration: 0.3, ease: 'easeOut' } }).then(() => {
        action('play', true);
      });
    }
  };

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
    <motion.div
      className={styles.rendererContainer}
      animate={controls}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 0.95, borderRadius: '8px', cursor: 'grabbing' }}
    >
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
        detent="content-height"
      >
        {actions?.map((bottomSheetAction) => (
          <Button
            className={styles.actionButton}
            onClick={() => {
              bottomSheetAction.action();
              closeBottomSheet();
            }}
            variant="secondary"
          >
            {bottomSheetAction?.icon && bottomSheetAction.icon}
            <Typography.BodyBold>
              {formatMessage({ id: bottomSheetAction.name })}
            </Typography.BodyBold>
          </Button>
        ))}
      </BottomSheet>

      <BottomSheet
        rootId={targetRootId}
        isOpen={isOpenCommentSheet}
        onClose={closeCommentSheet}
        mountPoint={document.getElementById(targetRootId) as HTMLElement}
        detent="full-height"
        headerTitle={formatMessage({ id: 'storyViewer.commentSheet.title' })}
      >
        <CommentTray
          referenceId={storyId}
          referenceType="story"
          community={community as Amity.Community}
          shouldAllowCreation={community?.allowCommentInStory}
          shouldAllowInteraction={isJoined}
        />
      </BottomSheet>

      {story.items?.[0]?.data?.url && (
        <div className={styles.hyperLinkContainer}>
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
        </div>
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
    </motion.div>
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
