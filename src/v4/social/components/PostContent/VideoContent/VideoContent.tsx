import React, { useState } from 'react';
import { Button } from '~/v4/core/natives/Button';
import { Typography } from '~/v4/core/components';
import { useImage } from '~/v4/core/hooks/useImage';
import usePost from '~/v4/core/hooks/objects/usePost';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './VideoContent.module.css';
import VideoControl from '~/v4/icons/VideoControl';

const VideoThumbnail = ({
  fileId,
  placeholder,
}: {
  fileId: string;
  placeholder: React.ReactNode;
}) => {
  const videoThumbnailUrl = useImage({ fileId });
  const [isBrokenImg, setIsBrokenImg] = useState(false);

  return (
    <>
      {videoThumbnailUrl && !isBrokenImg ? (
        <img
          loading="lazy"
          className={styles.videoContent__video}
          src={videoThumbnailUrl}
          alt={fileId}
          onError={() => setIsBrokenImg(true)}
        />
      ) : (
        <div className={styles.videoContent__brokenImg} />
      )}
    </>
  );
};

const Video = ({
  postId,
  postAmount,
  isLastVideo,
  onVideoClick,
  pageId = '*',
  videoLeftCount,
  componentId = '*',
}: {
  postId: string;
  pageId?: string;
  postAmount: number;
  isLastVideo: boolean;
  componentId?: string;
  videoLeftCount: number;
  onVideoClick: () => void;
}) => {
  const { post: videoPost, isLoading } = usePost(postId);

  if (isLoading) return null;

  return (
    <Button
      onPress={() => onVideoClick()}
      data-videos-amount={Math.min(postAmount, 4)}
      className={styles.videoContent__videoContainer}
      data-testid={`${pageId}/${componentId}/post_video`}
    >
      <VideoThumbnail
        fileId={videoPost.data.thumbnailFileId}
        placeholder={
          <div className={styles.videoContent__skeleton}>
            <VideoControl className={styles.videoContent__skeleton__icon} />
          </div>
        }
      />
      {videoLeftCount > 0 && isLastVideo && (
        <Typography.Headline className={styles.videoContent__videoCover}>
          + {videoLeftCount + 1}
        </Typography.Headline>
      )}
      {videoLeftCount === 0 || !isLastVideo ? (
        <div className={styles.videoContent__playButtonCover}>
          <div className={styles.videoContent__playButton}>
            <VideoControl className={styles.videoContent__playButton__icon} />
          </div>
        </div>
      ) : null}
    </Button>
  );
};

type VideoContentProps = {
  pageId?: string;
  elementId?: string;
  componentId?: string;
  post: Amity.Post<'video'>;
  onVideoClick: (index: number) => void;
};

export const VideoContent = ({
  post,
  onVideoClick,
  pageId = '*',
  elementId = '*',
  componentId = '*',
}: VideoContentProps) => {
  const { post: childPost, isLoading } = usePost(post.children[0]);
  const { themeStyles } = useAmityElement({ pageId, componentId, elementId });

  const first4Videos = post.children.slice(0, 4);
  const videoLeftCount = Math.max(0, post.children.length - 4);

  if (isLoading || childPost?.dataType !== 'video') return null;

  return (
    <div className={styles.videoContent} style={themeStyles}>
      <div
        style={themeStyles}
        className={styles.videoContent}
        data-videos-amount={Math.min(post.children.length, 4)}
      >
        {first4Videos.map((postId: string, index: number) => (
          <Video
            key={postId}
            pageId={pageId}
            postId={postId}
            componentId={componentId}
            videoLeftCount={videoLeftCount}
            postAmount={post.children.length}
            onVideoClick={() => onVideoClick(index)}
            isLastVideo={index === first4Videos.length - 1}
          />
        ))}
      </div>
    </div>
  );
};
