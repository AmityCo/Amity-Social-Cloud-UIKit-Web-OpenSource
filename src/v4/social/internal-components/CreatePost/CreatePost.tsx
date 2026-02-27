import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AmityAttachmentProductTags, CommunityPostSettings, PostRepository } from '@amityco/ts-sdk';
import { FileType } from '@amityco/ts-sdk';
import { useForm } from 'react-hook-form';
import { useNetworkState } from 'react-use';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import {
  AmityPostComposerCreateOptions,
  CreatePostParams,
} from '~/v4/social/pages/PostComposerPage/PostComposerPage';
import ExclamationCircle from '~/v4/icons/ExclamationCircle';
import { CommunityDisplayName } from '~/v4/social/elements/CommunityDisplayName';
import { CreateNewPostButton } from '~/v4/social/elements/CreateNewPostButton';
import { TextEditor } from '~/v4/core/components/TextEditor';
import { ImageThumbnail } from '~/v4/social/internal-components/ImageThumbnail';
import { VideoThumbnail } from '~/v4/social/internal-components/VideoThumbnail';
import ReactDOM from 'react-dom';
import { Drawer } from 'vaul';
import { Spinner } from '~/v4/social/internal-components/Spinner';
import { MediaAttachment } from '~/v4/social/components/MediaAttachment';
import { DetailedMediaAttachment } from '~/v4/social/components/DetailedMediaAttachment';
import { CloseButton } from '~/v4/social/elements/CloseButton/CloseButton';
import { Notification } from '~/v4/core/components/Notification';
import useCommunityModeratorsCollection from '~/v4/social/hooks/collections/useCommunityModeratorsCollection';
import { ERROR_RESPONSE } from '~/v4/social/constants/errorResponse';
import { MAXIMUM_POST_CHARACTERS } from '~/v4/social/constants';
import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { useSDK } from '~/v4/core/hooks/useSDK';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { isAdmin } from '~/v4/utils/permissions';
import { useMediaAttachmentVisible } from '~/v4/social/hooks/useMediaAttachmentVisible';
import { useFilePostUpload } from '~/v4/social/hooks/useFilePostUpload';
import { useMutation } from '@tanstack/react-query';
import { useResizeObserver } from '~/v4/social/hooks/useResizeObserver';
import styles from './CreatePost.module.css';
import { Typography } from '~/v4/core/components';
import { useClipContext } from '~/v4/social/providers/ClipProvider';
import { Play } from '~/v4/icons/Play';
import { isAmityFile } from '~/v4/utils/checkFileType';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { TextArea } from '~/v4/core/components/TextField';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import { MAX_LINKS_PER_POST } from '~/v4/social/constants/post';
import { ProductTagActionButton } from '~/v4/social/features/product-tagged';
import { DEFAULT_MAX_PRODUCTS } from '~/v4/constants/text-editor';

export function CreatePost({
  community,
  targetType,
  targetId,
  isClipPost = false,
  targetName,
}: AmityPostComposerCreateOptions) {
  const pageId = 'post_composer_page';

  const drawerRef = useRef<HTMLDivElement>(null);
  const mentionRef = useRef<HTMLDivElement | null>(null);
  const drawerContentRef = useRef<HTMLDivElement>(null);

  const { currentUserId, client } = useSDK();
  const { user } = useUser({ userId: currentUserId });
  const { handleSubmit } = useForm();
  const { info } = useConfirmContext();
  const { isDesktop } = useResponsive();
  const { confirm } = useConfirmContext();
  const { onBack, prevPage, prev2Page } = useNavigation();
  const { AmityPostComposerPageBehavior } = usePageBehavior();
  const { themeStyles } = useAmityPage({ pageId });
  const drawerHeight = useResizeObserver({ ref: drawerContentRef });
  const { moderators } = useCommunityModeratorsCollection({ communityId: community?.communityId });
  const { closePopup } = usePopupContext();
  const { setVideoThumbnail, setCanBeDiscarded } = useLayoutContext();

  const { online } = useNetworkState();
  const {
    files,
    progress,
    isLoading,
    removeFile,
    handleFileChange,
    handleAltTextChange,
    handleProductTagsChange,
  } = useFilePostUpload(pageId);

  const {
    file: clipFile,
    setFile: setClipFile,
    clipThumbnail,
    isMuted,
    isAspectFill,
    setIsMuted,
    setIsAspectFill,
  } = useClipContext();

  const [isCreating, setIsCreating] = useState(false);
  const [isError, setIsError] = useState(false);
  const [postErrorText, setPostErrorText] = useState<string | undefined>();
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const [title, setTitle] = useState<string>('');
  const [productTags, setProductTags] = useState<Amity.TextProductTag[] | undefined>();
  const [textValue, setTextValue] = useState<CreatePostParams>({
    text: '',
    mentioned: [],
    hashtagsMetadata: [],
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
    links: [],
  });

  useEffect(() => {
    if (isPreviewLoading && files.length > 0) {
      setIsPreviewLoading(false);
    }
  }, [isPreviewLoading, files.length]);

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
  } = useMediaAttachmentVisible({ files });

  const { mutate: createPost } = useMutation({
    mutationFn: async (params: Parameters<typeof PostRepository.createPost>[0]) =>
      PostRepository.createPost(params),

    onMutate: () => {
      setIsCreating(true);
      setIsError(false);
      setPostErrorText(undefined);
    },

    onSuccess: (response) => {
      const post = response.data;

      setVideoThumbnail({
        postId: post.postId,
        videos: files
          .filter(({ file }) => file.type === 'video')
          .map(({ file, thumbnailVideo }) => ({
            fileId: isAmityFile(file) ? file.fileId : '',
            thumbnailUrl: thumbnailVideo,
          })),
      });

      const isModerator =
        (moderators || []).find((moderator) => moderator.userId === post.postedUserId) != null;

      // TODO: check needApprovalOnPostCreation and onlyAdminCanPost after postSetting fix from SDK
      if (
        ((community as Amity.Community & { needApprovalOnPostCreation?: boolean })
          ?.needApprovalOnPostCreation ||
          community?.postSetting === CommunityPostSettings.ADMIN_REVIEW_POST_REQUIRED) &&
        !isModerator &&
        !isAdmin(user?.roles)
      ) {
        info({
          pageId,
          title: 'Posts sent for review',
          content:
            'Your post has been submitted to the pending list. It will be published once approved by the community moderator.',
          okText: 'OK',
        });
      }
      setIsMuted(false);
      setIsAspectFill(true);
      setIsCreating(false);
      handlePostSuccess();
    },

    onError: (error: Error) => {
      setIsCreating(false);
      setIsError(true);
      handlePostError(error);
    },
  });

  const allProductTags = useMemo(() => {
    const productMap = new Map<string, Amity.TextProductTag | Amity.MediaProductTag>();

    if (productTags) {
      productTags.forEach((tag) => {
        if (!productMap.has(tag.productId)) {
          productMap.set(tag.productId, tag);
        }
      });
    }
    files.forEach((file) => {
      if (file.productTags) {
        file.productTags.forEach((tag) => {
          if (!productMap.has(tag.productId)) {
            productMap.set(tag.productId, tag);
          }
        });
      }
    });

    return Array.from(productMap.values());
  }, [files, productTags]);

  async function onCreatePost({ removeTag }: { removeTag?: boolean } = {}) {
    if (textValue.text?.length > MAXIMUM_POST_CHARACTERS) {
      setPostErrorText('You have reached the maximum of 50,000 characters in a post.');
      return;
    }

    if (textValue.links && textValue.links.length > MAX_LINKS_PER_POST) {
      info({
        title: 'Link limit reached',
        content: `You can only add link up to ${MAX_LINKS_PER_POST} links per post.`,
        pageId,
        okText: 'OK',
      });
      return;
    }

    let attachments: Array<{
      fileId: string;
      type: string;
      productTags?: Amity.MediaProductTag[];
      displayMode?: string;
      isMuted?: boolean;
    }> = isClipPost
      ? [
          {
            fileId: clipFile && isAmityFile(clipFile) ? clipFile.fileId : '',
            type: 'clip',
            displayMode: isAspectFill ? 'fill' : 'fit',
            isMuted: isMuted,
          },
        ]
      : files.map(({ file, productTags }) => ({
          fileId: (file as Amity.File).fileId,
          type: file.type,
          productTags: productTags?.map(({ productId }) => ({ productId })),
        }));

    const attachmentProductTags = new AmityAttachmentProductTags();
    let hasAttachmentProductTags = false;

    attachments = attachments.map((attachment) => {
      const { productTags, ...rest } = attachment;
      if (productTags && productTags?.length > 0) {
        attachmentProductTags.set(rest.fileId, productTags);
        hasAttachmentProductTags = true;
      }

      return rest;
    });

    let createPostParams: Parameters<typeof PostRepository.createPost>[0] = {
      targetId: targetId!,
      targetType,
      data: { title: title.trim(), text: textValue.text },
      metadata: { mentioned: textValue.mentioned, hashtags: textValue.hashtagsMetadata },
      mentionees: textValue.mentionees as Amity.UserMention[],
      attachments,
      hashtags: textValue.hashtagsMetadata?.map((hashtag) => hashtag.text),
      links: textValue.links,
    };

    if (!removeTag) {
      const finalProductTags = productTags?.length
        ? productTags.map((productTag) => {
            const { product, ...rest } = productTag;
            return rest;
          })
        : undefined;

      createPostParams = {
        ...createPostParams,
        productTags: finalProductTags,
        attachmentProductTags: hasAttachmentProductTags ? attachmentProductTags : undefined,
      };
    }

    createPost(createPostParams);
  }

  const removeProductTag = () => {
    setProductTags([]);
    files.forEach((file) => (file.productTags = []));
  };

  const validatePost = async () => {
    const setting = await client?.getProductCatalogueSetting();
    const hasProductTags =
      textValue.attachments?.some(
        (attachment) => attachment.productTags && attachment.productTags?.length > 0,
      ) ||
      (productTags && productTags?.length > 0);

    if (setting && !setting.product.enabled && hasProductTags) {
      confirm({
        pageId: pageId,
        type: 'confirm',
        title: 'Product tagging isn’t available',
        content: 'Your post can still be published, but product tags will be removed.',
        onOk: () => onCreatePost({ removeTag: true }),
        okText: 'Publish',
        okButtonColor: 'primary',
        cancelText: 'Review post',
        onCancel: () => removeProductTag(),
      });
    } else onCreatePost();
  };

  const handlePostSuccess = () => {
    setClipFile(null);
    isDesktop ? closePopup() : checkRedirectPage();
  };

  const handlePostError = (error: Error) => {
    if (error.message.includes(ERROR_RESPONSE.BLOCKED_WORD)) {
      setPostErrorText("Your post wasn't posted as it contains an inappropriate word.");
    } else if (error.message.includes(ERROR_RESPONSE.BLOCKED_URL)) {
      setPostErrorText("Your post wasn't posted as it contains a link that's not allowed.");
    } else {
      setPostErrorText('Failed to create post. Please try again.');
    }
  };

  const onClickClose = () => {
    if (hasNoChanges) return onBack();
    confirm({
      pageId: pageId,
      type: 'confirm',
      title: 'Discard this post?',
      content: 'The post will be permanently discarded. It cannot be undone.',
      onOk: () => {
        setClipFile(null);
        checkRedirectPage();
      },
      okText: 'Discard',
      cancelText: 'Keep editing',
    });
  };

  const notifications = (
    <div
      data-testid="create-post-notification-wrapper"
      className={styles.createPost__notificationWrapper}
      data-item-position={snap === HEIGHT_MEDIA_ATTACHMENT_MENU}
    >
      {(isCreating || !online) && (
        <Notification
          icon={<Spinner />}
          content={online ? 'Posting...' : 'Waiting for network...'}
          alignment="fixed"
        />
      )}
      {(isError || postErrorText) && (
        <Notification
          duration={3000}
          content={postErrorText ? postErrorText : 'Failed to create post. Please try again.'}
          alignment="fixed"
          icon={<ExclamationCircle className={styles.createPost_notificationIcon} />}
          onClose={() => {
            setPostErrorText(undefined);
            setIsError(false);
          }}
        />
      )}
    </div>
  );

  const checkRedirectPage = () => {
    if (isDesktop) closePopup();
    if (
      prevPage?.type === PageTypes.SelectPostTargetPage ||
      prev2Page?.type === PageTypes.SelectPostTargetPage
    ) {
      return AmityPostComposerPageBehavior?.goToSocialHomePage?.();
    } else if (
      prev2Page?.type === PageTypes.UserProfilePage ||
      prev2Page?.type === PageTypes.CommunityProfilePage
    ) {
      return onBack(2);
    } else {
      return onBack();
    }
  };

  const hasContent = textValue.text.length > 0 || files.length > 0 || clipFile !== undefined;
  const hasErrors = files.some((file) => file.errorText !== undefined);
  const hasNoChanges = textValue.text.length === 0 && files.length === 0 && clipFile == undefined;

  const canSubmitPost =
    !hasNoChanges &&
    hasContent &&
    !hasErrors &&
    !isCreating &&
    online &&
    !isLoading &&
    !isPreviewLoading;

  useEffect(() => {
    setCanBeDiscarded(hasNoChanges);
  }, [hasNoChanges]);

  const renderPosting = () => {
    if (isCreating || !online) {
      return (
        <Typography.Body
          data-testid="create-post-posting-notification"
          className={styles.createPost__notification}
          data-show-detail-media-attachment={showToastPosition()}
          data-is-clip-post={isClipPost}
        >
          <Notification
            className={styles.createPost__notificationToast}
            content={online ? 'Posting...' : 'Waiting for network...'}
            icon={<Spinner />}
            alignment="fixed"
          />
        </Typography.Body>
      );
    }
    return null;
  };

  const renderError = () => {
    if (isError || postErrorText) {
      return (
        <Typography.Body
          data-testid="create-post-error-notification"
          className={styles.createPost__notification}
          data-show-detail-media-attachment={showToastPosition()}
          data-is-clip-post={isClipPost}
        >
          <Notification
            content={postErrorText ? postErrorText : 'Failed to create post. Please try again.'}
            icon={<ExclamationCircle className={styles.createPost_notificationIcon} />}
            alignment="fixed"
            duration={3000}
            className={styles.createPost__notificationToast}
            onClose={() => {
              setPostErrorText(undefined);
              setIsError(false);
            }}
          />
        </Typography.Body>
      );
    }
    return null;
  };

  return (
    <div className={styles.createPost} style={themeStyles}>
      {isDesktop && notifications}
      <form
        className={styles.createPost__form}
        onSubmit={handleSubmit(validatePost)}
        data-from-media={snap == HEIGHT_MEDIA_ATTACHMENT_MENU}
      >
        <div className={styles.createPost__topBar}>
          <CloseButton pageId={pageId} onPress={onClickClose} />
          <CommunityDisplayName pageId={pageId} community={community} displayName={targetName} />
          <CreateNewPostButton pageId={pageId} variant="text" isDisabled={!canSubmitPost} />
        </div>
        {isClipPost && (
          <div className={styles.createPost__clipPostThumbnaiContainer}>
            <img
              data-aspect-fill={isAspectFill}
              src={clipThumbnail ?? undefined}
              alt="thumbnail clip"
              className={styles.createPost__clipPostThumbnail}
            />
            <div className={styles.createPost__clipPostPlayIconWrap}>
              <Play className={styles.createPost__clipPostPlayIcon} />
            </div>
          </div>
        )}
        <div className={styles.createPost__formContent}>
          <TextArea
            data-testid="create-post-title-input"
            name="title"
            value={title}
            maxLength={150}
            onChange={(e) => {
              e.target.value.length > 150
                ? setTitle(e.target.value.slice(0, 150))
                : setTitle(e.target.value);
            }}
            placeholder="Title (optional)"
            className={styles.createPost__titleInput}
            onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
          />
          <div className={styles.createPost__textEditor}>
            <TextEditor
              pageId={pageId}
              editorContentType="post"
              communityId={targetId}
              initialText={textValue.text}
              enableProductMention={true}
              onTextChanged={(text) => {
                setTextValue((prev) => ({ ...prev, text }));
              }}
              onProductMentionsChanged={(productTags) => setProductTags([...productTags])}
              onMentionsChanged={(mentioned) => {
                setTextValue((prev) => ({
                  ...prev,
                  mentioned,
                  mentionees: [
                    {
                      type: 'user',
                      userIds: mentioned.map((m) => m.userId).filter((id): id is string => !!id),
                    },
                  ],
                }));
              }}
              onHashtagsChanged={(hashtags) => {
                setTextValue((prev) => ({ ...prev, hashtagsMetadata: hashtags }));
              }}
              onUrlsDetected={(urls) => {
                const links: Amity.Link[] = urls.map((url) => ({
                  url: url.url,
                  index: url.start,
                  length: url.end - url.start,
                  // TODO: check if this field is required from FE
                  renderPreview: true,
                }));
                setTextValue((prev) => ({ ...prev, links }));
              }}
              maxUniqueProductMentions={DEFAULT_MAX_PRODUCTS - (productTags?.length ?? 0)}
              initialProductMentions={productTags}
            />
          </div>
          <ImageThumbnail
            files={files}
            pageId={pageId}
            progress={progress}
            removeFile={removeFile}
            onAltTextChange={handleAltTextChange}
            onFileProductTagsChange={handleProductTagsChange}
            productTagsReachLimit={allProductTags.length >= DEFAULT_MAX_PRODUCTS}
          />
          <VideoThumbnail
            files={files}
            pageId={pageId}
            progress={progress}
            removeFile={removeFile}
            onFileProductTagsChange={handleProductTagsChange}
            productTagsReachLimit={allProductTags.length >= DEFAULT_MAX_PRODUCTS}
          />
        </div>
        <div className={styles.createPost__attachment}>
          <MediaAttachment
            pageId={pageId}
            isVisibleCamera={isVisibleCamera}
            isVisibleImage={isVisibleImage}
            isVisibleVideo={isVisibleVideo}
            totalMedia={files.length}
            productTags={allProductTags}
            onVideoFileChange={(files) => handleFileChange(files, FileType.VIDEO)}
            onImageFileChange={(files) => handleFileChange(files, FileType.IMAGE)}
          />
        </div>
        <div className={styles.createPost__ctaWrapper}>
          <CreateNewPostButton
            variant="fill"
            pageId={pageId}
            className={styles.createPost__cta}
            isDisabled={!canSubmitPost}
          />
        </div>
        <div
          ref={mentionRef}
          className={styles.createPost__mention}
          data-testid={`${pageId}/mention_text_input_options`}
          style={{ '--asc-mention-bottom': `${drawerHeight ?? 0}px` } as React.CSSProperties}
        />
      </form>
      {!isDesktop && !isClipPost && (
        <div className={styles.createPost__attachmentDrawer}>
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
                    if (newSnapPoint === null) {
                      handleSnapChange(HEIGHT_MEDIA_ATTACHMENT_MENU);
                    }

                    typeof newSnapPoint === 'string' && handleSnapChange(newSnapPoint);
                  }}
                >
                  <Drawer.Portal container={drawerRef.current}>
                    <Drawer.Content className={styles.createPost__attachmentDrawer__content}>
                      <div
                        ref={drawerContentRef}
                        className={styles.createPost__attachmentDrawer__contentContainer}
                        data-show-detail-media-attachment={isShowDetailMediaAttachmentMenu}
                      >
                        {isShowDetailMediaAttachmentMenu ? (
                          <DetailedMediaAttachment
                            pageId={pageId}
                            isVisibleCamera={isVisibleCamera}
                            isVisibleImage={isVisibleImage}
                            isVisibleVideo={isVisibleVideo}
                            totalMedia={files.length}
                            onImageFileChange={(files) => handleFileChange(files, FileType.IMAGE)}
                            onVideoFileChange={(files) => handleFileChange(files, FileType.VIDEO)}
                          />
                        ) : (
                          <MediaAttachment
                            pageId={pageId}
                            isVisibleCamera={isVisibleCamera}
                            isVisibleImage={isVisibleImage}
                            isVisibleVideo={isVisibleVideo}
                            totalMedia={files.length}
                            productTags={allProductTags}
                            onImageFileChange={(files) => handleFileChange(files, FileType.IMAGE)}
                            onVideoFileChange={(files) => handleFileChange(files, FileType.VIDEO)}
                          />
                        )}
                      </div>
                    </Drawer.Content>
                  </Drawer.Portal>
                </Drawer.Root>,
                drawerRef.current,
              )
            : null}

          {renderPosting()}
          {renderError()}
        </div>
      )}
      {isClipPost && (
        <>
          {renderPosting()}
          {renderError()}
        </>
      )}
      {!isDesktop && allProductTags.length > 0 && (
        <div
          className={styles.createPost__productTagActionButton}
          data-from-media={snap == HEIGHT_MEDIA_ATTACHMENT_MENU}
        >
          <ProductTagActionButton
            pageId={pageId}
            productTags={allProductTags}
            className={styles.createPost__productTagActionButton__button}
          />
        </div>
      )}
    </div>
  );
}
