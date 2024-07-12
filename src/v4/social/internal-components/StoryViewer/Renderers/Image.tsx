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
import useCommunityMembersCollection from '~/v4/social/hooks/collections/useCommunityMembersCollection';
import useSDK from '~/v4/core/hooks/useSDK';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { LIKE_REACTION_KEY } from '~/v4/social/constants/reactions';
import { checkStoryPermission, formatTimeAgo, isAdmin, isModerator } from '~/v4/social/utils';
import { Button } from '~/v4/core/natives/Button';

import styles from './Renderers.module.css';
import clsx from 'clsx';

import { StoryProgressBar } from '~/v4/social/elements/StoryProgressBar/StoryProgressBar';

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
}) => {
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

  const { members } = useCommunityMembersCollection({
    queryParams: {
      communityId: community?.communityId as string,
    },
    shouldCall: !!community?.communityId,
  });
  const member = members?.find((member) => member.userId === client?.userId);
  const isMember = member != null;

  const { user } = useUser(client?.userId);

  const isOfficial = community?.isOfficial || false;
  const isCreator = creator?.userId === user?.userId;
  const isGlobalAdmin = isAdmin(user?.roles);
  const isModeratorUser = isModerator(user?.roles);
  const haveStoryPermission =
    isGlobalAdmin || isModeratorUser || checkStoryPermission(client, community?.communityId);

  const heading = useMemo(
    () => <div data-qa-anchor="community_display_name">{community?.displayName}</div>,
    [community?.displayName],
  );
  const subheading = useMemo(
    () =>
      createdAt && creator?.displayName ? (
        <span>
          <span data-qa-anchor="created_at">{formatTimeAgo(createdAt as string)}</span> • By{' '}
          <span data-qa-anchor="creator_display_name">{creator?.displayName}</span>
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

  return (
    <div
      className={styles.rendererContainer}
      style={{
        background: backgroundGradient,
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
        haveStoryPermission={haveStoryPermission}
        isOfficial={isOfficial}
        isPaused={isPaused}
        onPlay={play}
        onPause={pause}
        onAction={openBottomSheet}
        onClickCommunity={() => onClickCommunity?.()}
        onClose={handleOnClose}
        addStoryButton={addStoryButton}
      />

      <div
        className={clsx(styles.storyImageContainer, {
          [styles.imageFit]: data.imageDisplayMode === 'fit',
          [styles.imageFill]: data.imageDisplayMode === 'fill',
        })}
      >
        <img
          ref={imageRef}
          className={clsx(styles.storyImage, {
            [styles.imageFit]: data.imageDisplayMode === 'fit',
            [styles.imageFill]: data.imageDisplayMode === 'fill',
          })}
          data-qa-anchor="image_view"
          src={url}
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
        {actions?.map((bottomSheetAction) => (
          <Button
            key={bottomSheetAction.name}
            className={styles.actionButton}
            onPress={() => bottomSheetAction?.action()}
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
          shouldAllowInteraction={isMember}
        />
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
        onClickComment={openCommentSheet}
        // Only story-creator and moderator of the community should be able to see impression count.
        showImpression={isCreator || checkStoryPermission(client, community?.communityId)}
        isMember={isMember}
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
