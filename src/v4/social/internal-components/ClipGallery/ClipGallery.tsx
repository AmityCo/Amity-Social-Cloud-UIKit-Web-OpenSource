import React, { useState } from 'react';
import styles from './ClipGallery.module.css';
import { useImage } from '~/v4/core/hooks/useImage';
import useFile from '~/v4/core/hooks/useFile';
import { SingleVideoViewer } from '~/v4/social/internal-components/SingleVideoViewer';
import { formatDuration } from '~/v4/social/utils/formatDuration';
import { Typography } from '~/v4/core/components';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { Button } from '~/v4/core/components/AriaButton';

const ClipItem = ({
  videoFileId,
  thumbnailFileId,
  postIndex,
  onClickVideoItem,
  displayMode = 'fill',
}: {
  videoFileId: string;
  thumbnailFileId?: string;
  postIndex: number;
  onClickVideoItem: (postIndex: number) => void;
  displayMode?: 'fill' | 'fit';
}) => {
  const [isBrokenImg, setIsBrokenImg] = useState(false);

  const image = useImage({ fileId: thumbnailFileId, imageSize: 'medium' });

  const file = useFile<'clip'>(videoFileId);

  if (!image || !file)
    return (
      <Button variant="text" onPress={() => onClickVideoItem(postIndex)}>
        <div className={styles.clipGallery__skeleton__itemContainer} />
      </Button>
    );

  return isBrokenImg ? (
    <Button
      variant="text"
      className={styles.clipGallery__itemContainer}
      onPress={() => onClickVideoItem(postIndex)}
    >
      <div className={styles.clipGallery__brokenImg} />
    </Button>
  ) : (
    <Button
      variant="text"
      className={styles.clipGallery__itemContainer}
      onPress={() => onClickVideoItem(postIndex)}
    >
      <img
        className={styles.clipGallery__item}
        src={image}
        alt={`${thumbnailFileId}`}
        onError={() => setIsBrokenImg(true)}
        data-isfill={displayMode === 'fill' ? true : false}
      />
      <Typography.Caption className={styles.clipGallery__duration}>
        {formatDuration((file?.attributes.metadata.video as any)?.duration)}
      </Typography.Caption>
    </Button>
  );
};

interface ClipGalleryProps {
  posts?: Amity.Post<'clip'>[] | null;
  pageId?: string;
  componentId?: string;
  elementId?: string;
}

export const ClipGallery: React.FC<ClipGalleryProps> = ({
  posts,
  pageId,
  componentId,
  elementId,
}) => {
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { isDesktop } = useResponsive();
  const { AmityCommunityProfilePageBehavior, AmityUserProfilePageBehavior } = usePageBehavior();

  const onClickVideoItem = (postIndex: number) => {
    if (isDesktop) {
      setSelectedIndex(postIndex);
      setIsImageViewerOpen(true);
    } else {
      return (
        posts?.[postIndex]?.targetType === 'community'
          ? AmityCommunityProfilePageBehavior
          : AmityUserProfilePageBehavior
      )?.goToClipFeedPage?.({
        currentPostId: posts?.[postIndex]?.postId || undefined,
        postIndex,
        targetId: posts?.[postIndex]?.targetId || undefined,
        targetType: posts?.[postIndex]?.targetType || undefined,
      });
    }
  };

  return (
    <div className={styles.clipGallery}>
      {posts?.map((post, index) => (
        <ClipItem
          key={post?.data?.fileId}
          videoFileId={post?.data?.fileId as string}
          thumbnailFileId={post.data?.thumbnailFileId || undefined}
          postIndex={index}
          onClickVideoItem={onClickVideoItem}
          displayMode={post.data?.displayMode || 'fill'}
        />
      ))}
      {posts && isDesktop && isImageViewerOpen && selectedIndex !== null && (
        <SingleVideoViewer
          pageId={pageId}
          isFromGallery
          selectedImageIndex={selectedIndex}
          post={posts[selectedIndex]}
          componentId={componentId}
          elementId={elementId}
          fileId={posts[selectedIndex]?.data?.fileId as string}
          thumbnailFileId={posts[selectedIndex]?.data?.thumbnailFileId as string}
          onClose={() => setIsImageViewerOpen(false)}
          isMuted={posts[selectedIndex]?.data?.isMuted || false}
        />
      )}
    </div>
  );
};
