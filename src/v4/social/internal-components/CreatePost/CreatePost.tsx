import React, { RefObject, useEffect, useRef, useState } from 'react';
import styles from './CreatePost.module.css';
import { PostRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import { LexicalEditor } from 'lexical';
import { useForm } from 'react-hook-form';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import {
  AmityPostComposerCreateOptions,
  CreatePostParams,
} from '~/v4/social/pages/PostComposerPage/PostComposerPage';
import { useGlobalFeedContext } from '~/v4/social/providers/GlobalFeedProvider';
import ExclamationCircle from '~/v4/icons/ExclamationCircle';
import { isMobile } from '~/v4/social/utils/isMobile';
import { generateThumbnailVideo } from '~/v4/social/utils/generateThumbnailVideo';
import { CommunityDisplayName } from '~/v4/social/elements/CommunityDisplayName';
import { CreateNewPostButton } from '~/v4/social/elements/CreateNewPostButton';
import { PostTextField } from '~/v4/social/elements/PostTextField';
import { ImageThumbnail } from '~/v4/social/internal-components/ImageThumbnail';
import { VideoThumbnail } from '~/v4/social/internal-components/VideoThumbnail';
import ReactDOM from 'react-dom';
import { Drawer } from 'vaul';
import { Spinner } from '~/v4/social/internal-components/Spinner';
import { MediaAttachment } from '~/v4/social/components/MediaAttachment';
import { DetailedMediaAttachment } from '~/v4/social/components/DetailedMediaAttachment';
import { CloseButton } from '~/v4/social/elements/CloseButton/CloseButton';
import { Notification } from '~/v4/core/components/Notification';
import { Mentioned, Mentionees } from '~/v4/helpers/utils';

const useResizeObserver = ({ ref }: { ref: RefObject<HTMLDivElement> }) => {
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (ref.current == null) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setHeight(entry.target.clientHeight);
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [ref.current]);

  return height;
};

export function CreatePost({ community, targetType, targetId }: AmityPostComposerCreateOptions) {
  const pageId = 'post_composer_page';
  const { themeStyles } = useAmityPage({
    pageId,
  });

  // const HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU = '290px'; //Including file button
  const HEIGHT_MEDIA_ATTACHMENT_MENU = '6.75rem';
  const HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_1 = '8.5rem'; //Show 1 menus
  const HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_2 = '11rem'; //Show 2 menus
  const HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_3 = '14.5rem'; //Not including file button

  const { AmityPostComposerPageBehavior } = usePageBehavior();
  const { confirm } = useConfirmContext();
  const [snap, setSnap] = useState<string>(HEIGHT_MEDIA_ATTACHMENT_MENU);
  const [isShowBottomMenu] = useState<boolean>(true);
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerContentRef = useRef<HTMLDivElement>(null);
  const { prependItem } = useGlobalFeedContext();

  const drawerHeight = useResizeObserver({ ref: drawerContentRef });

  const { handleSubmit } = useForm();

  const [textValue, setTextValue] = useState<CreatePostParams>({
    text: '',
    mentioned: [],
    mentionees: [
      {
        type: 'user',
        userIds: [''],
      },
    ],
    attachments: [
      {
        fileId: '',
        type: 'image',
      },
    ],
  });

  //Upload media
  const [postImages, setPostImages] = useState<Amity.File[]>([]);
  const [postVideos, setPostVideos] = useState<Amity.File[]>([]);

  // Images/files incoming from uploads.
  const [incomingImages, setIncomingImages] = useState<File[]>([]);
  const [incomingVideos, setIncomingVideos] = useState<File[]>([]);
  const [uploadLoading, setUploadLoading] = useState(false);

  const [uploadedImagesCount, setUploadedImagesCount] = useState<File[]>([]);

  // Visible menu attachment
  const [isVisibleCamera, setIsVisibleCamera] = useState(false);
  const [isVisibleImage, setIsVisibleImage] = useState(true);
  const [isVisibleVideo, setIsVisibleVideo] = useState(true);

  const [isErrorUpload, setIsErrorUpload] = useState(false);
  const [videoThumbnail, setVideoThumbnail] = useState<
    { file: File; videoUrl: string; thumbnail: string | undefined }[]
  >([]);

  const mentionRef = useRef<HTMLDivElement | null>(null);

  const useMutateCreatePost = () =>
    useMutation({
      mutationFn: async (params: Parameters<typeof PostRepository.createPost>[0]) => {
        return PostRepository.createPost(params);
      },
      onSuccess: (response) => {
        AmityPostComposerPageBehavior?.goToSocialHomePage?.();
        prependItem(response.data);
      },
      onError: (error) => {
        console.error('Failed to create post', error);
      },
    });

  const { mutateAsync: mutateCreatePostAsync, isPending, isError } = useMutateCreatePost();

  const onSubmit = () => {
    const attachmentsImage = postImages.map((file) => ({
      type: 'image',
      fileId: file.fileId,
    }));
    const attachmentsVideo = postVideos.map((file) => ({
      type: 'video',
      fileId: file.fileId,
    }));

    const attachments = [...attachmentsImage, ...attachmentsVideo];

    mutateCreatePostAsync({
      targetId: targetId,
      targetType: targetType,
      data: { text: textValue.text },
      dataType: 'text',
      metadata: { mentioned: textValue.mentioned },
      mentionees: textValue.mentionees,
      attachments: attachments,
    });
  };

  const onChange = (val: { mentioned: Mentioned[]; mentionees: Mentionees; text: string }) => {
    setTextValue((prev) => ({
      ...prev,
      mentioned: val.mentioned,
      text: val.text,
      mentionees: val.mentionees,
    }));
  };

  const handleSnapChange = (newSnap: string) => {
    if (snap === HEIGHT_MEDIA_ATTACHMENT_MENU && newSnap === '0px') {
      return;
    }
    setSnap(newSnap);
  };

  const onClickClose = () => {
    confirm({
      pageId: pageId,
      type: 'confirm',
      title: 'Discard this post?',
      content: 'The post will be permanently deleted. It cannot be undone.',
      onOk: () => {
        AmityPostComposerPageBehavior?.goToSocialHomePage?.();
      },
      okText: 'Discard',
      cancelText: 'Keep editing',
    });
  };

  useEffect(() => {
    if (postImages.length > 0) {
      setIsVisibleImage(true);
      setIsVisibleVideo(false);
    } else if (postVideos.length > 0 && videoThumbnail.length > 0) {
      setIsVisibleImage(false);
      setIsVisibleVideo(true);
    } else if (postImages.length == 0 || videoThumbnail.length == 0) {
      setIsVisibleImage(true);
      setIsVisibleVideo(true);
    }
  }, [postImages, postVideos, isVisibleImage, isVisibleVideo, videoThumbnail]);

  //check mobile device
  useEffect(() => {
    if (isMobile()) {
      setIsVisibleCamera(true);
    } else {
      setIsVisibleCamera(false);
    }
  }, []);

  useEffect(() => {
    if (
      (!isVisibleCamera && isVisibleImage && isVisibleVideo) ||
      (isVisibleCamera && isVisibleImage && !isVisibleVideo) ||
      (isVisibleCamera && !isVisibleImage && isVisibleVideo)
    ) {
      setSnap(HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_2);
    } else if (
      (!isVisibleCamera && isVisibleImage && !isVisibleVideo) ||
      (!isVisibleCamera && !isVisibleImage && isVisibleVideo)
    ) {
      setSnap(HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_1);
    } else {
      setSnap(HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_3);
    }
  }, [isVisibleCamera, isVisibleImage, isVisibleVideo]);

  const handleRemoveThumbnail = (index: number) => {
    setVideoThumbnail((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageFileChange = (file: File[]) => {
    if (file.length + uploadedImagesCount.length > 10) {
      confirm({
        pageId: pageId,
        type: 'info',
        title: 'Maximum upload limit reached',
        content:
          'You’ve reached the upload limit of 10 images. Any additional images will not be saved. ',
        okText: 'Close',
      });
      return;
    }

    if (file.length > 0) {
      setUploadedImagesCount((prevImages) => [...prevImages, ...file]);
      setIncomingImages(file);
    }
  };

  const handleVideoFileChange = async (file: File[]) => {
    const existingVideosCount = videoThumbnail ? videoThumbnail.length : 0;

    if (file.length + existingVideosCount > 10) {
      confirm({
        pageId: pageId,
        type: 'info',
        title: 'Maximum upload limit reached',
        content:
          'You’ve reached the upload limit of 10 videos. Any additional videos will not be saved. ',
        okText: 'Close',
      });
      return;
    }

    if (file.length > 0) {
      setIncomingVideos?.(file);
      const updatedVideos = file.map((file) => ({
        file,
        videoUrl: URL.createObjectURL(file),
        thumbnail: undefined,
      }));

      const thumbnailVideo = await Promise.all(
        updatedVideos.map(async (video) => {
          const thumbnail = await generateThumbnailVideo(video.file);
          return {
            ...video,
            thumbnail: thumbnail,
          };
        }),
      );
      setVideoThumbnail((prev) => [...prev, ...thumbnailVideo]);
    }
  };

  const isShowDetailMediaAttachmentMenu =
    snap == HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_1 ||
    snap == HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_2 ||
    snap == HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_3;

  return (
    <div className={styles.createPost} style={themeStyles}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        data-from-media={snap == HEIGHT_MEDIA_ATTACHMENT_MENU}
        className={styles.createPost__formMediaAttachment}
      >
        <div className={styles.createPost__topBar}>
          <CloseButton pageId={pageId} onPress={onClickClose} />
          <CommunityDisplayName pageId={pageId} community={community} />
          <CreateNewPostButton
            pageId={pageId}
            onSubmit={handleSubmit(onSubmit)}
            isValid={textValue.text.length > 0 || postImages.length > 0 || postVideos.length > 0}
          />
        </div>
        <PostTextField
          pageId={pageId}
          onChange={onChange}
          communityId={targetId}
          mentionContainer={mentionRef.current}
          dataValue={{
            data: { text: textValue.text },
          }}
        />
        <ImageThumbnail
          pageId={pageId}
          files={incomingImages}
          uploadedFiles={postImages}
          uploadLoading={uploadLoading}
          onLoadingChange={setUploadLoading}
          onChange={({ uploaded, uploading }) => {
            setPostImages(uploaded);
            setIncomingImages(uploading);
          }}
          onError={setIsErrorUpload}
          isErrorUpload={isErrorUpload}
        />
        <VideoThumbnail
          pageId={pageId}
          files={incomingVideos}
          uploadedFiles={postVideos}
          uploadLoading={uploadLoading}
          onLoadingChange={setUploadLoading}
          onChange={({ uploaded, uploading }) => {
            setPostVideos(uploaded);
            setIncomingVideos(uploading);
          }}
          onError={setIsErrorUpload}
          isErrorUpload={isErrorUpload}
          videoThumbnail={videoThumbnail}
          removeThumbnail={handleRemoveThumbnail}
        />
        <div
          ref={mentionRef}
          style={
            {
              '--asc-mention-bottom': `${drawerHeight ?? 0}px`,
            } as React.CSSProperties
          }
          className={styles.mentionTextInput_item}
        />
      </form>
      <div ref={drawerRef}></div>
      {drawerRef.current
        ? ReactDOM.createPortal(
            <Drawer.Root
              snapPoints={[
                HEIGHT_MEDIA_ATTACHMENT_MENU,
                HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_1,
                HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_2,
                HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_3,
              ]}
              activeSnapPoint={snap}
              setActiveSnapPoint={(newSnapPoint) => {
                typeof newSnapPoint === 'string' && handleSnapChange(newSnapPoint);
              }}
              open={isShowBottomMenu}
              modal={false}
            >
              <Drawer.Portal container={drawerRef.current}>
                <Drawer.Content className={styles.drawer__content}>
                  <div
                    data-item-position={snap === HEIGHT_MEDIA_ATTACHMENT_MENU}
                    className={styles.createPost__notiWrap}
                  >
                    {isPending && (
                      <Notification
                        content="Posting..."
                        icon={<Spinner />}
                        className={styles.createPost__status}
                      />
                    )}
                    {isError && (
                      <Notification
                        content="Failed to create post"
                        icon={<ExclamationCircle className={styles.createPost_infoIcon} />}
                        className={styles.createPost__status}
                        duration={3000}
                      />
                    )}
                  </div>
                  <div
                    ref={drawerContentRef}
                    className={styles.drawerContentContainer}
                    data-show-detail-media-attachment={isShowDetailMediaAttachmentMenu}
                  >
                    {isShowDetailMediaAttachmentMenu ? (
                      <DetailedMediaAttachment
                        pageId={pageId}
                        isVisibleCamera={isVisibleCamera}
                        isVisibleImage={isVisibleImage}
                        isVisibleVideo={isVisibleVideo}
                        onVideoFileChange={handleVideoFileChange}
                        onImageFileChange={handleImageFileChange}
                      />
                    ) : (
                      <MediaAttachment
                        pageId={pageId}
                        isVisibleCamera={isVisibleCamera}
                        isVisibleImage={isVisibleImage}
                        isVisibleVideo={isVisibleVideo}
                        onVideoFileChange={handleVideoFileChange}
                        onImageFileChange={handleImageFileChange}
                      />
                    )}
                  </div>
                </Drawer.Content>
              </Drawer.Portal>
            </Drawer.Root>,
            drawerRef.current,
          )
        : null}
    </div>
  );
}
