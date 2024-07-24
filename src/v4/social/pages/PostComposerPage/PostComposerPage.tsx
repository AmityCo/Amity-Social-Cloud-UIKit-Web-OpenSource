import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './PostComposerPage.module.css';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { CloseButton } from '~/v4/social/elements/CloseButton/CloseButton';
import { CommunityDisplayName } from '~/v4/social/elements/CommunityDisplayName';
import { CreateNewPostButton } from '~/v4/social/elements/CreateNewPostButton';
import { PostTextField } from '~/v4/social/elements/PostTextField';
import { PostRepository } from '@amityco/ts-sdk';
import { LexicalEditor } from 'lexical';
import { useMutation } from '@tanstack/react-query';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { Notification } from '~/v4/core/components/Notification';
import { Spinner } from '~/v4/social/internal-components/Spinner';
import ExclamationCircle from '~/v4/icons/ExclamationCircle';
import { useForm } from 'react-hook-form';
import { Mentioned } from '~/v4/helpers/utils';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { Drawer } from 'vaul';
import ReactDOM from 'react-dom';
import { DetailedMediaAttachment } from '~/v4/social/components/DetailedMediaAttachment';
import { ImageThumbnail } from '~/v4/social/internal-components/ImageThumbnail';
import { MediaAttachment } from '~/v4/social/components/MediaAttachment';
import { VideoThumbnail } from '~/v4/social/internal-components/VideoThumbnail';
import { isMobile } from '~/v4/social/utils/isMobile';
import { useGlobalFeedContext } from '~/v4/social/providers/GlobalFeedProvider';
import { generateThumbnailVideo } from '~/v4/social/utils/generateThumbnailVideo';

export enum Mode {
  CREATE = 'create',
  EDIT = 'edit',
}
interface AmityPostComposerEditOptions {
  mode: Mode.EDIT;
  post?: Amity.Post;
}

interface AmityPostComposerCreateOptions {
  mode: Mode.CREATE;
  targetId: string | null;
  targetType: 'community' | 'user';
  community?: Amity.Community;
}

export interface MetaData {
  index: number;
  length: number;
  type: string;
  userId?: string;
}

type PostComposerPageProps = AmityPostComposerCreateOptions | AmityPostComposerEditOptions;

const isCreatePage = (props: PostComposerPageProps): props is AmityPostComposerCreateOptions => {
  return props.mode === Mode.CREATE;
};

export function PostComposerPage(props: PostComposerPageProps) {
  if (isCreatePage(props)) {
    const { targetId, targetType, community } = props;
    return (
      <CreateInternal
        mode={Mode.CREATE}
        targetId={targetId}
        targetType={targetType}
        community={community}
      />
    );
  } else {
    return null;
  }
}

export type CreatePostParams = {
  text: string;
  mentioned: Mentioned[];
  mentionees: {
    type: string;
    userIds: string[];
  }[];
  attachments?: {
    fileId: string;
    type: string;
  }[];
};

const CreateInternal = ({ community, targetType, targetId }: AmityPostComposerCreateOptions) => {
  const pageId = 'post_composer_page';
  const { themeStyles } = useAmityPage({
    pageId,
  });

  // const HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU = '290px'; //Including file button
  const HEIGHT_MEDIA_ATTACHMENT_MENU = '6.75rem';
  const HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_1 = '8.5rem'; //Show 1 menus
  const HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_2 = '11rem'; //Show 2 menus
  const HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_3 = '14.5rem'; //Not including file button

  const editorRef = useRef<LexicalEditor | null>(null);
  const { AmityPostComposerPageBehavior } = usePageBehavior();
  const { confirm } = useConfirmContext();
  const [snap, setSnap] = useState<number | string | null>(HEIGHT_MEDIA_ATTACHMENT_MENU);
  const [isShowBottomMenu] = useState<boolean>(true);
  const drawerRef = useRef<HTMLDivElement>(null);
  const { prependItem } = useGlobalFeedContext();

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

  const { handleSubmit } = useForm();

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

  const onChange = (val: CreatePostParams) => {
    setTextValue(val);
  };

  const handleSnapChange = (newSnap: string | number | null) => {
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

  return (
    <div className={styles.postComposerPage} style={themeStyles}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        data-from-media={snap == HEIGHT_MEDIA_ATTACHMENT_MENU}
        className={styles.postComposerPage__formMediaAttachment}
      >
        <div className={styles.postComposerPage__topBar}>
          <CloseButton pageId={pageId} onPress={onClickClose} />
          <CommunityDisplayName pageId={pageId} community={community} />
          <CreateNewPostButton
            pageId={pageId}
            onSubmit={handleSubmit(onSubmit)}
            isValid={textValue.text.length > 0 || postImages.length > 0 || postVideos.length > 0}
          />
        </div>
        <PostTextField
          ref={editorRef}
          onChange={onChange}
          communityId={targetId}
          onChangeSnap={
            snap == HEIGHT_MEDIA_ATTACHMENT_MENU
              ? 0
              : snap == HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_3
                ? 2
                : 1
          }
          mentionContainer={mentionRef.current}
        />
        <ImageThumbnail
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
        <div ref={mentionRef} />
        <VideoThumbnail
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
        <div ref={mentionRef} />
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
              setActiveSnapPoint={handleSnapChange}
              open={isShowBottomMenu}
              modal={false}
            >
              <Drawer.Portal container={drawerRef.current}>
                <Drawer.Content className={styles.drawer__content}>
                  <div className={styles.postComposerPage__notiWrap}>
                    {isPending && (
                      <Notification
                        content="Posting..."
                        icon={<Spinner />}
                        className={styles.postComposerPage__status}
                      />
                    )}
                    {isError && (
                      <Notification
                        content="Failed to create post"
                        icon={<ExclamationCircle className={styles.selectPostTargetPag_infoIcon} />}
                        className={styles.postComposerPage__status}
                        duration={3000}
                      />
                    )}
                  </div>
                  {snap == HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_1 ||
                  snap == HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_2 ||
                  snap == HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_3 ? (
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
                </Drawer.Content>
              </Drawer.Portal>
            </Drawer.Root>,
            drawerRef.current,
          )
        : null}
    </div>
  );
};
