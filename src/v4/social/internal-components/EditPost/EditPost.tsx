import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FileType, PostContentType, PostRepository, CommunityPostSettings } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNetworkState } from 'react-use';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import {
  AmityPostComposerEditOptions,
  CreatePostParams,
} from '~/v4/social/pages/PostComposerPage/PostComposerPage';
import { PostTextField } from '~/v4/social/elements/PostTextField';
import { Spinner } from '~/v4/social/internal-components/Spinner';
import { CloseButton } from '~/v4/social/elements/CloseButton/CloseButton';
import { Notification } from '~/v4/core/components/Notification';
import { EditPostButton } from '~/v4/social/elements/EditPostButton';
import { EditPostTitle } from '~/v4/social/elements/EditPostTitle';
import usePostByIds from '~/v4/core/hooks/usePostByIds';
import { useGlobalFeedContext } from '~/v4/social/providers/GlobalFeedProvider';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { Mentioned, Mentionees } from '~/v4/helpers/utils';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { MAXIMUM_POST_CHARACTERS } from '~/v4/social/constants';
import { ERROR_RESPONSE } from '~/v4/social/constants/errorResponse';
import { ImageThumbnail } from '~/v4/social/internal-components/ImageThumbnail';
import { VideoThumbnail } from '~/v4/social/internal-components/VideoThumbnail';
import { FileItem, useFilePostUpload } from '~/v4/social/hooks/useFilePostUpload';
import { DetailedMediaAttachment, MediaAttachment } from '~/v4/social/components';
import ReactDOM from 'react-dom';
import { useMediaAttachmentVisible } from '~/v4/social/hooks/useMediaAttachmentVisible';
import { Drawer } from 'vaul';
import { isAmityFile } from '~/v4/utils/checkFileType';
import ExclamationCircle from '~/v4/icons/ExclamationCircle';
import { useResizeObserver } from '~/v4/social/hooks/useResizeObserver';
import { Typography } from '~/v4/core/components';
import useCommunity from '~/v4/core/hooks/collections/useCommunity';
import useCommunityModeratorsCollection from '~/v4/social/hooks/collections/useCommunityModeratorsCollection';
import { useSDK } from '~/v4/core/hooks/useSDK';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { isAdmin } from '~/v4/social/utils';
import styles from './EditPost.module.css';
import { isTextPost } from '~/v4/social/utils/postTypeChecker';
import { Play } from '~/v4/icons/Play';
import { useImage } from '~/v4/core/hooks/useImage';
import usePost from '~/v4/core/hooks/objects/usePost';

export function EditPost({ post }: AmityPostComposerEditOptions) {
  const pageId = 'post_composer_page';

  const mentionRef = useRef<HTMLDivElement | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerContentRef = useRef<HTMLDivElement>(null);

  const { isDesktop } = useResponsive();
  const { themeStyles } = useAmityPage({
    pageId,
  });
  const { closePopup } = usePopupContext();

  const drawerHeight = useResizeObserver({ ref: drawerContentRef });
  const { onBack } = useNavigation();
  const { confirm } = useConfirmContext();
  const { updateGlobalFeaturedPosts } = useGlobalFeedContext();
  const { files, progress, isLoading, removeFile, handleFileChange, handleAltTextChange } =
    useFilePostUpload(pageId);
  const posts = usePostByIds(post?.children || []);

  // Add community and user permissions related hooks
  const { currentUserId } = useSDK();
  const { user } = useUser({ userId: currentUserId });
  const shouldCallCommunity = post?.targetType === 'community' && !!post?.targetId;
  const { community } = useCommunity({
    communityId: post?.targetId,
    shouldCall: shouldCallCommunity,
  });
  const { moderators } = useCommunityModeratorsCollection({
    communityId: post?.targetId,
    shouldCall: shouldCallCommunity,
  });

  const [localPost, setLocalPost] = useState<Amity.Post[]>(posts);
  const [isBrokenImage, setIsBrokenImage] = useState(false);

  const {
    HEIGHT_MEDIA_ATTACHMENT_MENU,
    HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_1,
    HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_2,
    HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_3,
    snap,
    isShowDetailMediaAttachmentMenu,
    isVisibleCamera,
    isVisibleImage,
    isVisibleVideo,
    handleSnapChange,
    showToastPosition,
  } = useMediaAttachmentVisible({ files, posts: localPost });

  const [textValue, setTextValue] = useState<CreatePostParams>({
    text: (post as Amity.Post<'text'>)?.data?.text ?? '',
    mentioned: post.metadata?.mentioned || [],
    hashtagsMetadata: [],
    mentionees: post.mentionees as Amity.UserMention[],
    attachments: [
      {
        fileId: '',
        type: 'image',
      },
    ],
  });

  const online = useNetworkState();
  const [postErrorText, setPostErrorText] = useState<string | undefined>();

  const [postImages, setPostImages] = useState<Amity.Post<'image'>[]>([]);
  const [postVideos, setPostVideos] = useState<Amity.Post<'video'>[]>([]);
  const [postClip, setPostClip] = useState<Amity.Post<'clip'>[]>([]);

  const [isUpdating, setIsUpdating] = useState(false);
  const [isError, setIsError] = useState(false);

  const useMutateUpdatePost = () =>
    useMutation({
      mutationFn: async (params: Parameters<typeof PostRepository.editPost>[1]) => {
        return await PostRepository.editPost(post.postId, params);
      },
      onMutate: () => {
        setIsUpdating(true);
        setIsError(false);
        setPostErrorText(undefined);
      },
      onSuccess: (response) => {
        setIsUpdating(false);
        isDesktop ? closePopup() : onBack();
        updateGlobalFeaturedPosts(response.data);
      },
      onError: (error) => {
        setIsUpdating(false);
        setIsError(true);

        if (error.message.includes(ERROR_RESPONSE.CONTAIN_BLOCKED_WORD)) {
          setPostErrorText("Your post wasn't posted because it contains a blocked word.");
          return;
        } else if (error.message.includes(ERROR_RESPONSE.NOT_INCLUDE_WHITELIST_LINK)) {
          setPostErrorText(
            "Your post wasn't posted because it contains a link that's not allowed.",
          );
          return;
        } else {
          setPostErrorText('Failed to post.');
          return;
        }
      },
    });

  const { mutateAsync: mutateUpdatePostAsync, isPending } = useMutateUpdatePost();

  const { handleSubmit } = useForm();

  useEffect(() => {
    setLocalPost(posts);
    const imagePosts = posts.filter((post) => post.dataType === 'image') as Amity.Post<'image'>[];
    setPostImages(imagePosts);
    const videoPosts = posts.filter((post) => post.dataType === 'video') as Amity.Post<'video'>[];
    setPostVideos(videoPosts);
    const clipPosts = posts.filter((post) => post.dataType === 'clip') as Amity.Post<'clip'>[];
    setPostClip(clipPosts);
  }, [posts]);

  const handleRemoveThumbnailImage = useCallback((fieldId: string) => {
    setPostImages((prevImages) =>
      prevImages.filter((item: Amity.Post<'image'>) => item?.data?.fileId !== fieldId),
    );
    setLocalPost((prevPost) =>
      prevPost.filter((item) => (item as Amity.Post<'image'>)?.data?.fileId !== fieldId),
    );
  }, []);

  const handleRemoveThumbnailVideo = useCallback((fieldId: string) => {
    setPostVideos((prevVideos) =>
      prevVideos.filter(
        (item: Amity.Post<'video'>) => item?.data?.videoFileId.original !== fieldId,
      ),
    );
    setLocalPost((prevPost) =>
      prevPost.filter(
        (item: Amity.Post) => (item as Amity.Post<'video'>)?.data?.videoFileId.original !== fieldId,
      ),
    );
  }, []);

  const performPostUpdate = () => {
    const attachments: { fileId: string; type: string }[] = [];

    if (!isClipPost) {
      // Handle existing post images
      const attachmentsImage = postImages.map((item: Amity.Post<'image'>) => {
        return {
          fileId: item?.data?.fileId as string,
          type: PostContentType.IMAGE,
        };
      });

      // Handle existing post videos
      const attachmentsVideo = postVideos.map((item: Amity.Post<'video'>) => {
        return { fileId: item?.data?.videoFileId.original as string, type: PostContentType.VIDEO };
      });

      // Handle newly uploaded files
      const newAttachments = files.map((file: FileItem) => ({
        fileId: isAmityFile(file.file) ? file.file.fileId : file.id,
        type: isAmityFile(file.file)
          ? file.file.type
          : file.file.type.startsWith('image/')
            ? PostContentType.IMAGE
            : PostContentType.VIDEO,
      }));

      // Combine all attachments
      attachments.push(...attachmentsImage, ...attachmentsVideo, ...newAttachments);
    }

    if (textValue) {
      isClipPost
        ? mutateUpdatePostAsync({
            data: { text: textValue.text },
            metadata: {
              mentioned: textValue.mentioned ?? [],
              hashtags: textValue.hashtagsMetadata,
            },
            mentionees: textValue.mentionees as Amity.UserMention[],
            hashtags: textValue.hashtagsMetadata?.map((hashtag) => hashtag.text) || [],
          })
        : mutateUpdatePostAsync({
            data: { text: textValue.text },
            metadata: {
              mentioned: textValue.mentioned ?? [],
              hashtags: textValue.hashtagsMetadata,
            },
            mentionees: textValue.mentionees as Amity.UserMention[],
            hashtags: textValue.hashtagsMetadata?.map((hashtag) => hashtag.text) || [],
            attachments: attachments,
          });
    }
  };

  const onSave = () => {
    if (textValue.text?.length && textValue.text.length > MAXIMUM_POST_CHARACTERS) {
      setPostErrorText('You have reached maximum 50,000 characters in a post.');
      return;
    }

    // Check if post needs approval and show confirmation popup before API call
    const isModerator =
      (moderators || []).find((moderator) => moderator.userId === currentUserId) != null;

    if (
      shouldCallCommunity &&
      ((community as Amity.Community & { needApprovalOnPostCreation?: boolean })
        ?.needApprovalOnPostCreation ||
        community?.postSetting === CommunityPostSettings.ADMIN_REVIEW_POST_REQUIRED) &&
      !isModerator &&
      !isAdmin(user?.roles)
    ) {
      confirm({
        pageId,
        title: 'Post will be sent for review',
        content:
          'Posting in this community requires approval. Your edited post will be published once approved by the community moderator.',
        okText: 'OK',
        cancelText: 'Cancel',
        onOk: () => {
          performPostUpdate();
        },
      });
    } else {
      performPostUpdate();
    }
  };

  const onChange = (val: {
    mentioned: Mentioned[];
    mentionees: Mentionees;
    hashtags: Amity.Hashtag[];
    text: string;
  }) => {
    setTextValue((prev) => ({
      ...prev,
      mentioned: val.mentioned,
      text: val.text,
      mentionees: val.mentionees,
      hashtagsMetadata: val.hashtags,
    }));
  };

  const onClickClose = () => {
    if (hasNoChanges) return onBack();
    confirm({
      pageId: pageId,
      type: 'confirm',
      title: 'Discard this post?',
      content: 'The post will be permanently discarded. It cannot be undone.',
      onOk: () => {
        onBack();
      },
      okText: 'Discard',
      cancelText: 'Keep editing',
    });
  };

  const totalMedia =
    ((files && files?.length) || 0) +
    ((postImages && postImages?.length) || 0) +
    ((postVideos && postVideos?.length) || 0);

  const notifications = (
    <div
      className={styles.editPost__notificationWrapper}
      data-item-position={snap === HEIGHT_MEDIA_ATTACHMENT_MENU}
    >
      {(isUpdating || !online) && (
        <Notification
          icon={<Spinner />}
          content={online ? 'Posting...' : 'Waiting for network...'}
          alignment="fixed"
        />
      )}
      {(isError || postErrorText) && (
        <Notification
          duration={3000}
          content={postErrorText ? postErrorText : 'Failed to edit post. Please try again.'}
          alignment="fixed"
          icon={<ExclamationCircle className={styles.editPost__notificationIcon} />}
          onClose={() => {
            setPostErrorText(undefined);
            setIsError(false);
          }}
        />
      )}
    </div>
  );

  const isClipPost = postClip.length > 0;

  const hasMediaChange = files.length > 0 || posts.length !== localPost.length;

  const hasNoChanges = isTextPost(post) && post.data?.text === textValue.text && !hasMediaChange;
  const hasNoContent = !(
    textValue.text.trim().length > 0 ||
    files.length > 0 ||
    postImages.length > 0 ||
    postVideos.length > 0 ||
    localPost.length > 0
  );

  const isButtonDisabled =
    !online ||
    hasNoChanges ||
    hasNoContent ||
    isLoading ||
    isPending ||
    isError ||
    files.some((file) => !isAmityFile(file.file)); // to make sure that files are uploaded with fileId

  // Move the useImage hook outside conditional rendering
  const thumbnailFileId = postClip.length > 0 ? postClip[0].data?.thumbnailFileId : null;
  const clipThumbnail = useImage({
    fileId: thumbnailFileId,
    imageSize: 'medium',
  });

  const { post: newPost } = usePost(post.postId);

  return (
    <div className={styles.editPost} style={themeStyles}>
      {isDesktop && notifications}
      <form
        className={styles.editPost__form}
        onSubmit={handleSubmit(onSave)}
        data-from-media={snap == HEIGHT_MEDIA_ATTACHMENT_MENU}
      >
        <div className={styles.editPost__topBar}>
          <CloseButton pageId={pageId} onPress={onClickClose} />
          <EditPostTitle pageId={pageId} />
          <EditPostButton variant="text" pageId={pageId} isDisabled={isButtonDisabled} />
        </div>
        {isClipPost && (
          <div className={styles.editPost__clipPostThumbnaiContainer}>
            {clipThumbnail && !isBrokenImage ? (
              <img
                src={clipThumbnail ?? undefined}
                alt="thumbnail clip"
                className={styles.editPost__clipPostThumbnail}
                onError={() => setIsBrokenImage(true)}
              />
            ) : (
              <div className={styles.editPost__clipPostThumbnailBroken} />
            )}

            <div className={styles.editPost__clipPostPlayIconWrap}>
              <Play className={styles.editPost__clipPostPlayIcon} />
            </div>
          </div>
        )}
        <div className={styles.editPost__formContent}>
          <PostTextField
            pageId={pageId}
            onChange={onChange}
            componentId={isClipPost ? 'clipPost' : undefined}
            className={styles.editPost__input}
            placeholderClassName={styles.editPost__placeholder}
            mentionContainer={isDesktop ? null : mentionRef.current}
            mentionContainerClassName={styles.editPost__mentionContainer}
            communityId={post.targetType === 'community' ? post.targetId : undefined}
            dataValue={{
              mentionees: post.mentionees,
              data: { text: (post as Amity.Post<'text'>)?.data?.text || '' },
              metadata: {
                mentioned: post.metadata?.mentioned || [],
                hashtags: post.metadata?.hashtags || [],
              },
            }}
          />

          <ImageThumbnail
            files={files}
            pageId={pageId}
            progress={progress}
            removeFile={removeFile}
            postImages={postImages as Amity.Post<'image'>[]}
            onAltTextChange={handleAltTextChange}
            onRemovePostImage={handleRemoveThumbnailImage}
          />
          <VideoThumbnail
            files={files}
            pageId={pageId}
            progress={progress}
            removeFile={removeFile}
            postVideos={postVideos as Amity.Post<'video'>[]}
            onRemovePostVideo={handleRemoveThumbnailVideo}
          />
        </div>
        {/* TODO: Handle file type */}
        {!isClipPost && (
          <div className={styles.editPost__attachment}>
            <MediaAttachment
              pageId={pageId}
              totalMedia={totalMedia}
              isVisibleCamera={isVisibleCamera}
              isVisibleImage={isVisibleImage}
              isVisibleVideo={isVisibleVideo}
              onVideoFileChange={(files) =>
                handleFileChange(files, FileType.VIDEO, localPost.length)
              }
              onImageFileChange={(files) =>
                handleFileChange(files, FileType.IMAGE, localPost.length)
              }
            />
          </div>
        )}

        <div className={styles.editPost__ctaWrapper}>
          <EditPostButton
            variant="fill"
            pageId={pageId}
            className={styles.editPost__cta}
            onPress={() => handleSubmit(onSave)}
            isDisabled={isButtonDisabled}
          />
        </div>
        <div
          ref={mentionRef}
          className={styles.editPost__mention}
          data-testid={`${pageId}/mention_text_input_options`}
          style={{ '--asc-mention-bottom': `${drawerHeight ?? 0}px` } as React.CSSProperties}
        />
      </form>
      {!isDesktop && !isClipPost && (
        <div className={styles.editPost__attachmentDrawer}>
          <div ref={drawerRef}></div>
          {drawerRef.current
            ? ReactDOM.createPortal(
                <Drawer.Root
                  modal={false}
                  open
                  activeSnapPoint={snap}
                  snapPoints={[
                    HEIGHT_MEDIA_ATTACHMENT_MENU,
                    HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_1,
                    HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_2,
                    HEIGHT_DETAIL_MEDIA_ATTACHMENT__MENU_3,
                  ]}
                  setActiveSnapPoint={(newSnapPoint) => {
                    typeof newSnapPoint === 'string' && handleSnapChange(newSnapPoint);
                  }}
                >
                  <Drawer.Portal container={drawerRef.current}>
                    <Drawer.Content className={styles.editPost__attachmentDrawer__content}>
                      <div
                        ref={drawerContentRef}
                        className={styles.editPost__attachmentDrawer__contentContainer}
                        data-show-detail-media-attachment={isShowDetailMediaAttachmentMenu}
                      >
                        {isShowDetailMediaAttachmentMenu ? (
                          <DetailedMediaAttachment
                            pageId={pageId}
                            isVisibleCamera={isVisibleCamera}
                            isVisibleImage={isVisibleImage}
                            isVisibleVideo={isVisibleVideo}
                            totalMedia={totalMedia}
                            onImageFileChange={(files) =>
                              handleFileChange(files, FileType.IMAGE, localPost.length)
                            }
                            onVideoFileChange={(files) =>
                              handleFileChange(files, FileType.VIDEO, localPost.length)
                            }
                          />
                        ) : (
                          <MediaAttachment
                            pageId={pageId}
                            isVisibleCamera={isVisibleCamera}
                            isVisibleImage={isVisibleImage}
                            isVisibleVideo={isVisibleVideo}
                            totalMedia={totalMedia}
                            onImageFileChange={(files) =>
                              handleFileChange(files, FileType.IMAGE, localPost.length)
                            }
                            onVideoFileChange={(files) =>
                              handleFileChange(files, FileType.VIDEO, localPost.length)
                            }
                          />
                        )}
                      </div>
                    </Drawer.Content>
                  </Drawer.Portal>
                </Drawer.Root>,
                drawerRef.current,
              )
            : null}

          {(isUpdating || !online) && (
            <Typography.Body
              className={styles.editPost__notification}
              data-show-detail-media-attachment={showToastPosition()}
              data-isclip={isClipPost}
            >
              <Notification
                className={styles.editPost__notificationToast}
                content={online ? 'Posting...' : 'Waiting for network...'}
                icon={<Spinner />}
                alignment="fixed"
              />
            </Typography.Body>
          )}
          {(isError || postErrorText) && (
            <Typography.Body
              className={styles.editPost__notification}
              data-show-detail-media-attachment={showToastPosition()}
              data-isclip={isClipPost}
            >
              <Notification
                content={postErrorText ? postErrorText : 'Failed to edit post. Please try again.'}
                icon={<ExclamationCircle className={styles.editPost_notificationIcon} />}
                alignment="fixed"
                duration={3000}
                className={styles.editPost__notificationToast}
                onClose={() => {
                  setPostErrorText(undefined);
                  setIsError(false);
                }}
              />
            </Typography.Body>
          )}
        </div>
      )}

      <div className={styles.editPost__notificationContainer}>
        {(isPending || !online) && (
          <div
            className={styles.editPost__notification}
            data-show-detail-media-attachment={showToastPosition()}
            data-isclip={isClipPost}
          >
            <Notification
              className={styles.editPost__notificationToast}
              content={online ? 'Posting...' : 'Waiting for network...'}
              icon={<Spinner />}
              alignment="fixed"
            />
          </div>
        )}
        {postErrorText && (
          <div
            className={styles.editPost__notification}
            data-isclip={isClipPost}
            data-show-detail-media-attachment={showToastPosition()}
          >
            <Notification
              content={postErrorText ? postErrorText : 'Failed to edit post. Please try again.'}
              icon={<ExclamationCircle className={styles.editPost__notificationIcon} />}
              alignment="fixed"
              duration={3000}
              className={styles.editPost__notificationToast}
              onClose={() => {
                setPostErrorText(undefined);
                setIsError(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
