import React, { useState } from 'react';
import styles from './VideoGallery.module.css';
import { useImage } from '~/v4/core/hooks/useImage';
import useFile from '~/v4/core/hooks/useFile';
import { SingleVideoViewer } from '~/v4/social/internal-components/SingleVideoViewer';
import { formatDuration } from '~/v4/social/utils/formatDuration';
import VideoControl from '~/v4/icons/VideoControl';
import { Button } from '~/v4/core/natives/Button';
import { Typography } from '~/v4/core/components';

const VideoItem = ({
  videoFileId,
  thumbnailFileId,
  postIndex,
  onClickVideoItem,
}: {
  videoFileId: string;
  thumbnailFileId: string;
  postIndex: number;
  onClickVideoItem: (postIndex: number) => void;
}) => {
  const [isBrokenImg, setIsBrokenImg] = useState(false);

  const image = useImage({ fileId: thumbnailFileId, imageSize: 'medium' });

  const file = useFile<Amity.File<'video'>>(videoFileId);

  if (!image || !file)
    return (
      <div className={styles.videoGallery__skeleton__itemContainer}>
        <VideoControl className={styles.videoGallery__skeleton__item} />
      </div>
    );

  return isBrokenImg ? (
    <Button
      className={styles.videoGallery__itemContainer}
      onPress={() => onClickVideoItem(postIndex)}
    >
      <div className={styles.videoGallery__brokenImg} />
    </Button>
  ) : (
    <Button
      className={styles.videoGallery__itemContainer}
      onPress={() => onClickVideoItem(postIndex)}
    >
      <img
        className={styles.videoGallery__item}
        src={image}
        alt={`${thumbnailFileId}`}
        onError={() => setIsBrokenImg(true)}
      />
      <Typography.Caption className={styles.videoGallery__duration}>
        {formatDuration((file?.attributes.metadata.video as any)?.duration)}
      </Typography.Caption>
    </Button>
  );
};

interface VideoGalleryProps {
  posts?: Amity.Post[] | null;
  pageId?: string;
  componentId?: string;
  elementId?: string;
}

export const VideoGallery: React.FC<VideoGalleryProps> = ({
  posts,
  pageId,
  componentId,
  elementId,
}) => {
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const onClickVideoItem = (postIndex: number) => {
    setSelectedIndex(postIndex);
    setIsImageViewerOpen(true);
  };

  return (
    <div className={styles.videoGallery}>
      {posts?.map((post, index) => (
        <VideoItem
          key={post?.data?.videoFileId?.original}
          videoFileId={post?.data?.videoFileId?.original}
          thumbnailFileId={post?.data?.thumbnailFileId}
          postIndex={index}
          onClickVideoItem={onClickVideoItem}
        />
      ))}
      {posts && isImageViewerOpen && selectedIndex !== null && (
        <SingleVideoViewer
          pageId={pageId}
          componentId={componentId}
          elementId={elementId}
          fileId={posts[selectedIndex]?.data?.videoFileId?.original}
          thumbnailFileId={posts[selectedIndex]?.data?.thumbnailFileId?.fileId}
          onClose={() => setIsImageViewerOpen(false)}
        />
      )}
    </div>
  );
};
