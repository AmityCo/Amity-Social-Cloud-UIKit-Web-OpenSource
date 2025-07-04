import React, { useState } from 'react';
import { Button } from '~/v4/core/natives/Button';
import { useImage } from '~/v4/core/hooks/useImage';
import usePost from '~/v4/core/hooks/objects/usePost';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import VideoControl from '~/v4/icons/VideoControl';
import styles from './ClipContent.module.css';

const ClipThumbnail = ({
  fileId,
  placeholder,
  displayMode = 'fill',
}: {
  fileId: string;
  placeholder: React.ReactNode;
  displayMode?: 'fill' | 'fit';
}) => {
  const videoThumbnailUrl = useImage({ fileId });
  const [isBrokenImg, setIsBrokenImg] = useState(false);

  return (
    <>
      {videoThumbnailUrl && !isBrokenImg ? (
        <img
          loading="lazy"
          className={styles.clipContent__video}
          src={videoThumbnailUrl}
          alt={fileId}
          onError={() => setIsBrokenImg(true)}
          data-isfill={displayMode === 'fill' ? true : false}
        />
      ) : (
        <div className={styles.clipContent__brokenImg} />
      )}
    </>
  );
};

const Clip = ({
  post,
  onClipClick,
  pageId = '*',
  componentId = '*',
}: {
  post: Amity.Post<'clip'>;
  pageId?: string;
  componentId?: string;
  onClipClick: () => void;
}) => {
  return (
    <Button
      onPress={() => onClipClick()}
      className={styles.clipContent__videoContainer}
      data-testid={`${pageId}/${componentId}/post_video`}
    >
      <ClipThumbnail
        fileId={post.data?.thumbnailFileId || ''}
        placeholder={
          <div className={styles.clipContent__skeleton}>
            <VideoControl className={styles.clipContent__skeleton__icon} />
          </div>
        }
        displayMode={post.data?.displayMode || 'fill'}
      />

      <div className={styles.clipContent__playButtonCover}>
        <div className={styles.clipContent__playButton}>
          <VideoControl className={styles.clipContent__playButton__icon} />
        </div>
      </div>
    </Button>
  );
};

type ClipContentProps = {
  pageId?: string;
  elementId?: string;
  componentId?: string;
  post: Amity.Post<'clip'>;
  onClipClick: (postId: string) => void;
};

export const ClipContent = ({
  post,
  onClipClick,
  pageId = '*',
  elementId = '*',
  componentId = '*',
}: ClipContentProps) => {
  const { post: childPost, isLoading } = usePost(post.children[0]);
  const { themeStyles } = useAmityElement({ pageId, componentId, elementId });

  if (isLoading || childPost?.dataType !== 'clip') return null;

  return (
    <div className={styles.clipContent} style={themeStyles}>
      <div
        style={themeStyles}
        className={styles.clipContent}
        data-videos-amount={Math.min(post.children.length, 4)}
      >
        <Clip
          key={childPost.postId}
          pageId={pageId}
          post={childPost as Amity.Post<'clip'>}
          componentId={componentId}
          onClipClick={() => onClipClick(childPost.postId)}
        />
      </div>
    </div>
  );
};
