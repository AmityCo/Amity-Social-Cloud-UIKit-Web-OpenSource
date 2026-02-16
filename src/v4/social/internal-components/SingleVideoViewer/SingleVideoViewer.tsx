import React, { memo, useEffect, useMemo, useRef } from 'react';
import useFile from '~/core/hooks/useFile';
import { VideoFileStatus } from '~/social/constants';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { ClearButton } from '~/v4/social/elements/ClearButton/ClearButton';
import styles from './SingleVideoViewer.module.css';
import { Popover } from '~/v4/core/components/AriaPopover';
import { MediaMenu } from '~/v4/social/internal-components/MediaMenu';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { MenuButton } from '~/v4/social/elements';
import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import { UserProfileTabs } from '~/v4/social/pages/UserProfilePage/UserProfilePage';
import { FeedSourceEnum } from '@amityco/ts-sdk';
import { MediaTabType } from '~/v4/social/constants/mediaTabs';

export const VideoPlayer = memo(
  ({
    fileId,
    thumbnailFileId,
    isMuted = false,
  }: {
    fileId?: string;
    thumbnailFileId: string;
    isMuted?: boolean;
  }) => {
    const file: Amity.File<'video'> | undefined = useFile<Amity.File<'video'>>(fileId);
    const posterUrl = useFile(thumbnailFileId);

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

    if (url == null) return <></>;

    return (
      <video
        controls
        controlsList="nodownload"
        autoPlay={false}
        className={styles.fullImage}
        ref={videoRef}
        poster={posterUrl?.fileUrl}
        muted={isMuted}
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

interface SingleVideoViewerProps {
  pageId?: string;
  componentId?: string;
  elementId?: string;
  fileId: string;
  thumbnailFileId: string;
  onClose(): void;
  isMuted?: boolean;
  isFromGallery?: boolean;
  post: Amity.Post;
  selectedImageIndex: number;
  feedSources?: FeedSourceEnum[];
}

export function SingleVideoViewer({
  pageId = '*',
  componentId = '*',
  elementId = '*',
  fileId,
  thumbnailFileId,
  isMuted = false,
  onClose,
  isFromGallery,
  post,
  selectedImageIndex,
  feedSources,
}: SingleVideoViewerProps) {
  const { themeStyles } = useAmityElement({ pageId, componentId, elementId });
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { goToPostDetailPage, page } = useNavigation();
  const { setLinkToPost } = useLayoutContext();

  const redirectToPostDetailPage = () => {
    const postId = post.children.length > 0 ? post.postId : post.parentPostId;
    if (page.type === PageTypes.CommunityProfilePage) {
      setLinkToPost({
        tab: 'community_media_feed',
        mediaTab: MediaTabType.VIDEOS,
        index: selectedImageIndex,
        target: 'community',
        parentPostId: post.parentPostId,
        postId: post.postId,
        feedSources,
      });
      goToPostDetailPage?.({
        postId,
        hideTarget: false,
      });
    }
    if (page.type === PageTypes.UserProfilePage) {
      setLinkToPost({
        tab: UserProfileTabs.MEDIA,
        index: selectedImageIndex,
        target: 'user',
        mediaTab: MediaTabType.VIDEOS,
        parentPostId: post.parentPostId,
        postId: post.postId,
        feedSources,
      });
      goToPostDetailPage?.({
        postId,
        hideTarget: false,
      });
    }
  };

  return (
    <div style={themeStyles}>
      <div className={styles.modal} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <VideoPlayer fileId={fileId} thumbnailFileId={thumbnailFileId} isMuted={isMuted} />
          <div className={styles.modal__actions}>
            <ClearButton
              pageId={pageId}
              componentId={componentId}
              defaultClassName={styles.videoViewer__clearButton}
              imgClassName={styles.videoViewer__clearButton__img}
              onPress={onClose}
            />
            {isFromGallery && (
              <Popover
                trigger={({ openPopover, isDesktop }) => (
                  <MenuButton
                    variant="filled"
                    pageId={pageId}
                    className={styles.videoViewer__menuButton}
                    iconClassName={styles.videoViewer__menuButton__icon}
                    onClick={() => {
                      isDesktop
                        ? openPopover()
                        : setDrawerData({
                            content: (
                              <MediaMenu
                                pageId={pageId}
                                onViewPostPress={
                                  isFromGallery
                                    ? () => {
                                        onClose();
                                        removeDrawerData();
                                        redirectToPostDetailPage();
                                      }
                                    : undefined
                                }
                              />
                            ),
                          });
                    }}
                  />
                )}
              >
                {({ closePopover }) => {
                  return (
                    <MediaMenu
                      pageId={pageId}
                      onViewPostPress={
                        isFromGallery
                          ? () => {
                              onClose();
                              closePopover();
                              redirectToPostDetailPage();
                            }
                          : undefined
                      }
                    />
                  );
                }}
              </Popover>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
