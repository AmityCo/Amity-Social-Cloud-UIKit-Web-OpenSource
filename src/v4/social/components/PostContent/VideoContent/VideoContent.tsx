import React, { useMemo } from 'react';
import { useImage } from '~/v4/core/hooks/useImage';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './VideoContent.module.css';
import usePost from '~/v4/core/hooks/objects/usePost';
import { Button } from '~/v4/core/natives/Button';

const PlayButtonSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="25"
    height="24"
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g id="Icon " clipPath="url(#clip0_1936_14348)">
      <path id="Vector" d="M8.95117 5V19L19.9512 12L8.95117 5Z" />
    </g>
    <defs>
      <clipPath id="clip0_1936_14348">
        <rect width="24" height="24" transform="translate(0.951172)" />
      </clipPath>
    </defs>
  </svg>
);

const VideoThumbnail = ({ fileId }: { fileId: string }) => {
  const videoThumbnailUrl = useImage({
    fileId,
  });

  return <img className={styles.videoContent__video} src={videoThumbnailUrl} alt={fileId} />;
};

const Video = ({
  pageId = '*',
  componentId = '*',
  postId,
  postAmount,
  videoLeftCount,
  index,
  onVideoClick,
}: {
  pageId?: string;
  componentId?: string;
  postId: string;
  postAmount: number;
  videoLeftCount: number;
  index: number;
  onVideoClick: () => void;
}) => {
  const { post: videoPost, isLoading } = usePost(postId);

  if (isLoading) {
    return null;
  }

  return (
    <Button
      className={styles.videoContent__videoContainer}
      data-videos-amount={Math.min(postAmount, 4)}
      onPress={() => onVideoClick()}
      data-qa-anchor={`${pageId}/${componentId}/post_video`}
    >
      <VideoThumbnail fileId={videoPost.data.thumbnailFileId} />
      {videoLeftCount > 0 && index === postAmount - 1 && (
        <Typography.Heading className={styles.videoContent__videoCover}>
          + {videoLeftCount}
        </Typography.Heading>
      )}
      {videoLeftCount === 0 || index < postAmount - 1 ? (
        <div className={styles.videoContent__playButtonCover}>
          <div className={styles.videoContent__playButton} onClick={() => onVideoClick()}>
            <PlayButtonSvg className={styles.videoContent__playButton__svg} />
          </div>
        </div>
      ) : null}
    </Button>
  );
};

interface VideoContentProps {
  pageId?: string;
  componentId?: string;
  elementId?: string;
  post: Amity.Post<'video'>;
  onVideoClick: (index: number) => void;
}

export const VideoContent = ({
  pageId = '*',
  componentId = '*',
  elementId = '*',
  post,
  onVideoClick,
}: VideoContentProps) => {
  const { themeStyles, accessibilityId } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  const first4Videos = post.children.slice(0, 4);

  const { post: childPost } = usePost(post.children[0]);

  const videoLeftCount = Math.max(0, post.children.length - 4);

  if (childPost?.dataType !== 'video') {
    return null;
  }

  return (
    <div className={styles.videoContent} style={themeStyles}>
      <div
        className={styles.videoContent}
        style={themeStyles}
        data-videos-amount={Math.min(post.children.length, 4)}
      >
        {first4Videos.map((postId: string, index: number) => (
          <Video
            pageId={pageId}
            componentId={componentId}
            key={postId}
            index={index}
            postId={postId}
            videoLeftCount={videoLeftCount}
            postAmount={post.children.length}
            onVideoClick={() => onVideoClick(index)}
          />
        ))}
      </div>
    </div>
  );
};
