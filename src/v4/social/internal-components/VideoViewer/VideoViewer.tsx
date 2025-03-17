import useFile from '~/core/hooks/useFile';
import { useKeyPressEvent } from 'react-use';
import { Button } from '~/v4/core/natives/Button';
import { Typography } from '~/v4/core/components';
import ChevronRight from '~/v4/icons/ChevronRight';
import useSwiper from '~/v4/social/hooks/useSwiper';
import { VideoFileStatus } from '~/social/constants';
import usePostByIds from '~/social/hooks/usePostByIds';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { ClearButton } from '~/v4/social/elements/ClearButton/ClearButton';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import styles from './VideoViewer.module.css';

type VideoViewerProps = {
  onClose(): void;
  pageId?: string;
  post: Amity.Post;
  elementId?: string;
  componentId?: string;
  initialVideoIndex: number;
};

export function VideoViewer({
  post,
  onClose,
  pageId = '*',
  elementId = '*',
  componentId = '*',
  initialVideoIndex,
}: VideoViewerProps) {
  useKeyPressEvent('Escape', onClose);

  const posts = usePostByIds(post?.children || []);
  const { themeStyles, accessibilityId } = useAmityElement({ pageId, componentId, elementId });
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(initialVideoIndex);

  const next = () => {
    if (hasNext) setSelectedVideoIndex((prev) => prev + 1);
  };

  const prev = () => {
    if (hasPrev) setSelectedVideoIndex((prev) => prev - 1);
  };

  const videoPosts = posts.filter((post) => post.dataType === 'video');
  const videoPost = videoPosts[selectedVideoIndex];
  const hasNext = selectedVideoIndex < videoPosts.length - 1;
  const hasPrev = selectedVideoIndex > 0;

  return (
    <div style={themeStyles} data-testid={accessibilityId} className={styles.videoViewer__modal}>
      <span className={styles.videoViewer__close}>
        <ClearButton
          pageId={pageId}
          onPress={onClose}
          componentId={componentId}
          defaultClassName={styles.videoViewer__closeButton}
          imgClassName={styles.videoViewer__closeButton__img}
        />
      </span>
      {videoPosts.length > 1 && (
        <Typography.TitleBold className={styles.videoViewer__count}>
          {selectedVideoIndex + 1} / {videoPosts.length}
        </Typography.TitleBold>
      )}
      {hasPrev && (
        <Button className={styles.videoViewer__prev} onPress={prev}>
          <ChevronRight className={styles.videoViewer__prevButton} />
        </Button>
      )}
      <VideoPlayer videoPost={videoPost} next={next} prev={prev} />
      {hasNext && (
        <Button className={styles.videoViewer__next} onPress={next}>
          <ChevronRight className={styles.videoViewer__nextButton} />
        </Button>
      )}
    </div>
  );
}

const VideoPlayer = memo(
  ({
    videoPost,
    prev,
    next,
  }: {
    videoPost?: Amity.Post<'video'>;
    prev: () => void;
    next: () => void;
  }) => {
    const videoFileId = useMemo(() => {
      return (
        videoPost?.data.videoFileId.high ||
        videoPost?.data.videoFileId.medium ||
        videoPost?.data.videoFileId.low ||
        videoPost?.data.videoFileId.original ||
        undefined
      );
    }, [videoPost]);

    const { handleTouchEnd, handleTouchMove, handleTouchStart } = useSwiper({
      next,
      prev,
      threshold: 100,
    });

    const file: Amity.File<'video'> | undefined = useFile<Amity.File<'video'>>(videoFileId);
    const posterUrl = useFile(videoPost?.data.thumbnailFileId);

    const videoRef = useRef<HTMLVideoElement>(null);

    /*
     * It's possible that certain video formats uploaded by the user are not
     * playable by the browser. So it's best to use the transcoded video file
     * which is an mp4 format to play video.
     *
     * Note: the below logic needs to be smarter based on users bandwidth and also
     * should be switchable by the user, which would require a ui update
     */
    const url = useMemo(() => {
      if (file == null) return null;
      if (file.status === VideoFileStatus.Transcoded) {
        const { videoUrl } = file;

        return (
          videoUrl?.['1080p'] ||
          videoUrl?.['720p'] ||
          videoUrl?.['480p'] ||
          videoUrl?.['360p'] ||
          videoUrl?.original ||
          file.fileUrl
        );
      }
      return file.fileUrl;
    }, [file]);

    /*
  The video initially doesn't change because in essence you're only modifying the <source> element
  and React understands that <video> should remain unchanged,
  so it does not update it on the DOM and doesn't trigger a new load event for that source.
  A new load event should be triggered for <video>.

  ref: https://stackoverflow.com/a/47382850
  */
    useEffect(() => {
      videoRef.current?.load();
    }, [url]);

    if (url == null) return null;

    return (
      <video
        controls
        autoPlay
        ref={videoRef}
        controlsList="nodownload"
        onTouchEnd={handleTouchEnd}
        poster={posterUrl?.fileUrl}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
        className={styles.videoViewer__fullImage}
      >
        <source src={url} type="video/mp4" />
        <p>
          Your browser does not support this format of video. Please try again later once the server
          transcodes the video into an playable format(mp4).
        </p>
      </video>
    );
  },
);
