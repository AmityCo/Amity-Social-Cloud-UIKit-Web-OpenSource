import React from 'react';
import useFile from '~/core/hooks/useFile';
import { VideoFileStatus } from '~/social/constants';
import usePostByIds from '~/social/hooks/usePostByIds';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { ClearButton } from '~/v4/social/elements/ClearButton/ClearButton';
import styles from './VideoViewer.module.css';

interface VideoViewerProps {
  pageId?: string;
  componentId?: string;
  elementId?: string;
  post: Amity.Post;
  onClose(): void;
}

export function VideoViewer({
  pageId = '*',
  componentId = '*',
  elementId = '*',
  post,
  onClose,
}: VideoViewerProps) {
  const { themeStyles } = useAmityElement({ pageId, componentId, elementId });

  const posts = usePostByIds(post?.children || []);

  const videoPosts = posts.filter((post) => post.dataType === 'video');

  const videoFileId =
    videoPosts?.[0]?.data.videoFileId.high ||
    videoPosts?.[0]?.data.videoFileId.medium ||
    videoPosts?.[0]?.data.videoFileId.low ||
    videoPosts?.[0]?.data.videoFileId.original ||
    undefined;

  const file: Amity.File<'video'> | undefined = useFile<Amity.File<'video'>>(videoFileId);

  if (file == null) return null;

  /*
   * It's possible that certain video formats uploaded by the user are not
   * playable by the browser. So it's best to use the transcoded video file
   * which is an mp4 format to play video.
   *
   * Note: the below logic needs to be smarter based on users bandwidth and also
   * should be switchable by the user, which would require a ui update
   */
  const url = (() => {
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
  })();

  return (
    <div style={themeStyles}>
      <div className={styles.modal} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <video controls controlsList="nodownload" autoPlay className={styles.fullImage}>
            <source src={url} type="video/mp4" />
            <p>
              Your browser does not support this format of video. Please try again later once the
              server transcodes the video into an playable format(mp4).
            </p>
          </video>
          <span className={styles.closeButton} onClick={onClose}>
            <ClearButton
              pageId={pageId}
              componentId={componentId}
              defaultClassName={styles.videoViewer__clearButton}
              imgClassName={styles.videoViewer__clearButton__img}
            />
          </span>
        </div>
      </div>
    </div>
  );
}
