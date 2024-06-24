import React, { useMemo } from 'react';
import useImage from '~/v4/core/hooks/useImage';
import usePostByIds from '~/v4/core/hooks/usePostByIds';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './VideoContent.module.css';

const PlayButtonSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="25"
    height="24"
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g id="Icon " clip-path="url(#clip0_1936_14348)">
      <path id="Vector" d="M8.95117 5V19L19.9512 12L8.95117 5Z" />
    </g>
    <defs>
      <clipPath id="clip0_1936_14348">
        <rect width="24" height="24" transform="translate(0.951172)" />
      </clipPath>
    </defs>
  </svg>
);

interface VideoContentProps {
  pageId?: string;
  componentId?: string;
  elementId?: string;
  post: Amity.Post<'video'>;
  onVideoClick: (index: number) => void;
}

const Video = ({ fileId }: { fileId: string }) => {
  const videoThumbnailUrl = useImage({
    fileId,
  });

  return <img className={styles.videoContent__video} src={videoThumbnailUrl} alt={fileId} />;
};

export const VideoContent = ({
  pageId = '*',
  componentId = '*',
  elementId = '*',
  post,
  onVideoClick,
}: VideoContentProps) => {
  const { themeStyles } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  const first4Videos = useMemo(() => post.children.slice(0, 4), [post.children]);

  const posts = usePostByIds(first4Videos);

  const videoPosts = posts.filter((post) => post.dataType === 'video');

  const videoLeftCount = Math.max(0, post.children.length - 4);

  if (videoPosts.length === 0) {
    return null;
  }

  return (
    <div className={styles.videoContent} style={themeStyles}>
      <div
        className={styles.videoContent}
        style={themeStyles}
        data-videos-amount={Math.min(post.children.length, 4)}
      >
        {videoPosts.map((post, index) => (
          <div
            className={styles.videoContent__videoContainer}
            data-videos-amount={Math.min(post.children.length, 4)}
            onClick={() => onVideoClick(index)}
          >
            <Video fileId={post.data.thumbnailFileId} />
            {videoLeftCount > 0 && index === posts.length - 1 && (
              <Typography.Heading className={styles.videoContent__videoCover}>
                + {videoLeftCount}
              </Typography.Heading>
            )}
            {videoLeftCount === 0 || index < posts.length - 1 ? (
              <div className={styles.videoContent__playButtonCover}>
                <div
                  className={styles.videoContent__playButton}
                  onClick={() => onVideoClick(index)}
                >
                  <PlayButtonSvg className={styles.videoContent__playButton__svg} />
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};
