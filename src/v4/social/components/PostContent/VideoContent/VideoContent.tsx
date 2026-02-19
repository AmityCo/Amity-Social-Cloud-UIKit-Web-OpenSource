import React, { useState } from 'react';
import { Button } from '~/v4/core/natives/Button';
import { Typography } from '~/v4/core/components';
import { useImage } from '~/v4/core/hooks/useImage';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './VideoContent.module.css';
import VideoControl from '~/v4/icons/VideoControl';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import { ProductTagBadge } from '~/v4/social/features/product-tagged/internal-components/ProductTagBadge/ProductTagBadge';
import { useShowProductTagList } from '~/v4/social/features/product-tagged/hooks';

const VideoThumbnail = ({
  videoPostData,
  placeholder,
}: {
  videoPostData?: Amity.ContentDataVideo;
  placeholder: React.ReactNode;
}) => {
  const { videoThumbnail } = useLayoutContext();
  const [isBrokenImg, setIsBrokenImg] = useState(false);

  // Find thumbnailFileId: fallback to videoThumbnail context if not present
  const thumbnailFileId = videoPostData?.thumbnailFileId;
  // Always call useImage hook unconditionally
  const imageThumbnailUrl = useImage({ fileId: thumbnailFileId });

  let videoThumbnailUrl: string | undefined;
  if (!thumbnailFileId && videoPostData?.videoFileId?.original) {
    const thumbnail = videoThumbnail?.videos.find(
      ({ fileId }) => fileId === videoPostData.videoFileId.original,
    );
    const thumbnailUrl = thumbnail?.thumbnailUrl;
    if (thumbnailUrl) {
      videoThumbnailUrl = thumbnailUrl;
    } else {
      videoThumbnailUrl = imageThumbnailUrl;
    }
  } else {
    videoThumbnailUrl = imageThumbnailUrl;
  }

  return (
    <>
      {videoThumbnailUrl && !isBrokenImg ? (
        <img
          loading="lazy"
          className={styles.videoContent__video}
          src={videoThumbnailUrl}
          alt={videoThumbnailUrl}
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
  const { showProductTagList } = useShowProductTagList({ pageId, mode: 'video' });

  if (!videoPost) return null;

  const handleShowProductTags = () => {
    if (videoPost.productTags) {
      showProductTagList(videoPost.productTags);
    }
  };

  return (
    <Button
      onPress={() => onVideoClick()}
      data-videos-amount={Math.min(postAmount, 4)}
      className={styles.videoContent__videoContainer}
      data-testid={`${pageId}/${componentId}/post_video`}
    >
      <VideoThumbnail
        videoPostData={(videoPost as Amity.Post<'video'>)?.data}
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
      {videoPost.productTags && videoPost.productTags.length > 0 && (
        <div className={styles.videoContent__productTagButton}>
          <ProductTagBadge
            selectedProductTags={videoPost.productTags}
            onClick={handleShowProductTags}
          />
        </div>
      )}
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

  const first4Videos = posts?.slice(0, 4);
  const videoLeftCount = Math.max(0, posts?.length - 4);

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
            videoPost={posts[index]}
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
