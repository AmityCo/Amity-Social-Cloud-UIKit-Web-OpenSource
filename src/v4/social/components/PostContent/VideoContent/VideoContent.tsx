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
  fileId: Amity.File<'image'>['fileId'];
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
  videoPost,
  postAmount,
  isLastVideo,
  onVideoClick,
  pageId = '*',
  videoLeftCount,
  componentId = '*',
}: {
  videoPost?: Amity.Post<'video'>;
  pageId?: string;
  postAmount: number;
  isLastVideo: boolean;
  componentId?: string;
  videoLeftCount: number;
  onVideoClick: () => void;
}) => {
  if (!videoPost) return null;

  return (
    <Button
      onPress={() => onVideoClick()}
      data-videos-amount={Math.min(postAmount, 4)}
      className={styles.videoContent__videoContainer}
      data-testid={`${pageId}/${componentId}/post_video`}
    >
      <VideoThumbnail
        fileId={(videoPost as Amity.Post<'video'>)?.data?.thumbnailFileId as string}
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
  posts: Amity.Post<'video'>[];
  onVideoClick: (index: number) => void;
};

export const VideoContent = ({
  posts,
  onVideoClick,
  pageId = '*',
  elementId = '*',
  componentId = '*',
}: VideoContentProps) => {
  const { themeStyles } = useAmityElement({ pageId, componentId, elementId });

  const first4Videos = posts.slice(0, 4);
  const videoLeftCount = Math.max(0, posts.length - 4);

  if (!posts || posts[0]?.dataType !== 'video') return null;

  return (
    <div className={styles.videoContent} style={themeStyles}>
      <div
        style={themeStyles}
        className={styles.videoContent}
        data-videos-amount={Math.min(posts.length ?? 0, 4)}
      >
        {first4Videos.map((post: Amity.Post, index: number) => (
          <Video
            key={post.postId}
            pageId={pageId}
            videoPost={post}
            componentId={componentId}
            videoLeftCount={videoLeftCount}
            postAmount={posts.length}
            onVideoClick={() => onVideoClick(index)}
            isLastVideo={index === first4Videos.length - 1}
          />
        ))}
      </div>
    </div>
  );
};
