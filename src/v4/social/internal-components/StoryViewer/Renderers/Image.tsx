import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useIntl } from 'react-intl';
import Truncate from 'react-truncate-markup';
import {
  CustomRenderer,
  Tester,
} from '~/v4/social/internal-components/StoryViewer/Renderers/types';
import ColorThief from 'colorthief';
import { CommentTray } from '~/v4/social/components';
import { HyperLink } from '~/v4/social/elements/HyperLink';
import Footer from '~/v4/social/internal-components/StoryViewer/Renderers/Wrappers/Footer';
import Header from '~/v4/social/internal-components/StoryViewer/Renderers/Wrappers/Header';
import { BottomSheet } from '~/v4/core/components/BottomSheet';
import { Typography } from '~/v4/core/components';
import useSDK from '~/v4/core/hooks/useSDK';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { LIKE_REACTION_KEY } from '~/v4/social/constants/reactions';
import { checkStoryPermission, formatTimeAgo } from '~/v4/social/utils';
import { Button } from '~/v4/core/natives/Button';

import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';

import styles from './Renderers.module.css';
import clsx from 'clsx';

import { StoryProgressBar } from '~/v4/social/elements/StoryProgressBar/StoryProgressBar';
import { useStoryPermission } from '~/v4/social/hooks/useStoryPermission';

export const renderer: CustomRenderer = ({
  story: {
    actions,
    fileInputRef,
    addStoryButton,
    currentIndex,
    storiesCount,
    increaseIndex,
    pageId,
    dragEventTarget,
    story,
    url,
  },
  action,
  config,
  onClose,
  onClickCommunity,
  onDeleteStory,
}) => {
  const { isDesktop } = useResponsive();
  const { openPopup, closePopup } = usePopupContext();

  const { formatMessage } = useIntl();
  const [loaded, setLoaded] = useState(false);
  const [isOpenBottomSheet, setIsOpenBottomSheet] = useState(false);
  const [isOpenCommentSheet, setIsOpenCommentSheet] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { loader } = config;
  const { client } = useSDK();
  const [backgroundGradient, setBackgroundGradient] = useState('');
  const imageRef = useRef<HTMLImageElement>(null);

  const isLiked = !!(story && story.myReactions && story.myReactions.includes(LIKE_REACTION_KEY));
  const reactionsCount = story?.reactionsCount || 0;

  const [isVisible, setIsVisible] = useState(true);
  const [currentUrl, setCurrentUrl] = useState(url);

  useEffect(() => {
    if (url !== currentUrl) {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentUrl(url);
        setIsVisible(true);
      }, 200);
    }
  }, [url]);

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

  const { user } = useUser({ userId: client?.userId });
  const { hasStoryPermission } = useStoryPermission(community?.communityId);

  const isOfficial = community?.isOfficial || false;
  const isCreator = creator?.userId === user?.userId;

  const heading = useMemo(
    () => <div data-testid="community_display_name">{community?.displayName}</div>,
    [community?.displayName],
  );
  const subheading = useMemo(
    () =>
      createdAt && creator?.displayName ? (
        <span>
          <span data-testid="created_at">{formatTimeAgo(createdAt as string)}</span> • By{' '}
          <span data-testid="creator_display_name">{creator?.displayName}</span>
        </span>
      ) : (
        ''
      ),
    [createdAt, creator?.displayName],
  );
  const targetRootId = 'asc-uikit-stories-viewer';

  const extractColors = useCallback(() => {
    if (imageRef.current && imageRef.current.complete) {
      const colorThief = new ColorThief();
      const palette = colorThief.getPalette(imageRef.current, 2);
      if (palette) {
        const gradient = `linear-gradient(to top, rgb(${palette[0].join(
          ',',
        )}), rgb(${palette[1].join(',')})`;
        setBackgroundGradient(gradient);
      }
    }
  }, []);

  const imageLoaded = useCallback(() => {
    setLoaded(true);
    if (isPaused) {
      setIsPaused(false);
    }
    action('play', true);
    extractColors();
  }, [action, isPaused, extractColors]);

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

  const handleOnClose = () => {
    onClose();
  };

  const handleProgressComplete = () => {
    increaseIndex();
  };

  useEffect(() => {
    if (imageRef.current && imageRef.current.complete) {
      extractColors();
    }
  }, []);

  useEffect(() => {
    if (fileInputRef.current) {
      const handleClick = () => {
        action('pause', true);
        setIsPaused(true);
      };
      const handleCancel = () => {
        action('play', true);
        setIsPaused(false);
      };

      fileInputRef.current.addEventListener('click', handleClick);
      fileInputRef.current.addEventListener('cancel', handleCancel);

      return () => {
        if (fileInputRef.current) {
          fileInputRef.current.removeEventListener('cancel', handleCancel);
          fileInputRef.current.removeEventListener('click', handleClick);
        }
      };
    }
  }, [fileInputRef]);

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
              className={styles.actionButton}
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
          <Typography.Headline className={styles.commentTrayHeader}>Comments</Typography.Headline>
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
  }, []);

  const onClickMenuButton = useCallback((openPopover) => {
    if (isDesktop) {
      pause();
      openPopover();
    } else openBottomSheet();
  }, []);

  return (
    <div
      className={styles.rendererContainer}
      style={{
        background: !isVisible ? 'black' : backgroundGradient,
      }}
    >
      <StoryProgressBar
        pageId={pageId}
        duration={5000}
        currentIndex={currentIndex}
        storiesCount={storiesCount}
        isPaused={isPaused || isOpenBottomSheet || isOpenCommentSheet}
        onComplete={handleProgressComplete}
      />
      <Header
        community={community}
        heading={heading}
        subheading={subheading}
        isHaveActions={actions?.length > 0}
        haveStoryPermission={hasStoryPermission}
        isOfficial={isOfficial}
        isPaused={isPaused}
        onPlay={play}
        onPause={pause}
        onAction={onClickMenuButton}
        onClickCommunity={() => onClickCommunity?.()}
        onClose={handleOnClose}
        addStoryButton={addStoryButton}
        actionButton={renderMenuButton}
      />

      <div
        className={clsx(styles.storyImageContainer, {
          [styles.imageFit]: data.imageDisplayMode === 'fit',
          [styles.imageFill]: data.imageDisplayMode === 'fill',
        })}
      >
        <img
          ref={imageRef}
          className={clsx(
            styles.storyImage,
            {
              [styles.imageFit]: data.imageDisplayMode === 'fit',
              [styles.imageFill]: data.imageDisplayMode === 'fill',
            },
            styles.fadeTransition,
            {
              [styles.visible]: isVisible,
              [styles.hidden]: !isVisible,
            },
          )}
          data-testid="image_view"
          src={url ?? (story?.data.fileData as string)}
          onLoad={imageLoaded}
          alt="Story Image"
          crossOrigin="anonymous"
        />
      </div>

      {!loaded && <div className={styles.loadingOverlay}>{loader || <div>loading...</div>}</div>}

      <BottomSheet
        rootId={targetRootId}
        isOpen={isOpenBottomSheet}
        onClose={closeBottomSheet}
        mountPoint={document.getElementById(targetRootId) as HTMLElement}
        detent="content-height"
      >
        {renderMenuButton()}
      </BottomSheet>

      <BottomSheet
        rootId={targetRootId}
        isOpen={isOpenCommentSheet}
        onClose={closeCommentSheet}
        mountPoint={document.getElementById(targetRootId) as HTMLElement}
        detent="full-height"
        headerTitle={formatMessage({ id: 'storyViewer.commentSheet.title' })}
      >
        {renderCommentTray()}
      </BottomSheet>

      {items?.[0]?.data?.url && (
        <div className={styles.hyperLinkContainer}>
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
        reactionsCount={reactionsCount}
        isLiked={isLiked}
        myReactions={myReactions}
        onClickComment={onClickCommentButton}
        // Only story-creator and moderator of the community should be able to see impression count.
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
    condition: !!story.story?.storyId && (!story.type || story.type === 'image'),
    priority: 2,
  };
};

export default {
  renderer,
  tester,
};
