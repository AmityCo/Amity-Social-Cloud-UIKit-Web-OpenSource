import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useString, resolveString } from '~/v4/core/localization';
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
import {
  TextEditor,
  TextEditorLinkPreview,
  UrlHighlight,
  LinkRetentionState,
} from '~/v4/core/components/TextEditor';
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
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import styles from './CreatePost.module.css';
import { Typography } from '~/v4/core/components';
import { useClipContext } from '~/v4/social/providers/ClipProvider';
import { Play } from '~/v4/icons/Play';
import { isAmityFile } from '~/v4/utils/checkFileType';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { TextArea } from '~/v4/core/components/TextField';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import { useGlobalFeedContext } from '~/v4/social/providers/GlobalFeedProvider';
import { MAX_LINKS_PER_POST } from '~/v4/social/constants/post';
import { ProductTagActionButton } from '~/v4/social/features/product-tagged';
import { DEFAULT_MAX_PRODUCTS } from '~/v4/constants/text-editor';
import { EventCard } from '~/v4/social/features/events/components/EventCard';

export function CreatePost({
  community,
  targetType,
  targetId,
  isClipPost = false,
  targetName,
  event,
}: AmityPostComposerCreateOptions) {
  const pageId = 'post_composer_page';
  const isEventPost = !!event;

  const drawerRef = useRef<HTMLDivElement>(null);
  const mentionRef = useRef<HTMLDivElement | null>(null);
  const drawerContentRef = useRef<HTMLDivElement>(null);

  const { currentUserId, client } = useSDK();
  const { prependNewPost } = useGlobalFeedContext();
  const { user } = useUser({ userId: currentUserId });
  const { handleSubmit } = useForm();
  const { info, confirm } = useConfirmContext();
  const notification = useNotifications();
  const { isDesktop } = useResponsive();
  const { onBack, prevPage, prev2Page } = useNavigation();
  const { AmityPostComposerPageBehavior } = usePageBehavior();
  const { themeStyles } = useAmityPage({ pageId });
  const drawerHeight = useResizeObserver({ ref: drawerContentRef });
  const { moderators } = useCommunityModeratorsCollection({ communityId: community?.communityId });
  const { closePopup } = usePopupContext();
  const { setVideoThumbnail, setCanBeDiscarded } = useLayoutContext();

  const { online } = useNetworkState();

  const postingText = useString('amity_social_toast_poll_create_posting_toast');
  const waitingForNetworkText = useString('amity_social_label_waiting_for_network');
  const genericPostErrorText = useString('amity_social_toast_error_create_post_failed');
  const titleOptionalPlaceholder = useString('amity_social_label_title_optional');
  const clipBodyPlaceholder = useString(
    'amity_social_placeholder_post_composer_body_clip_placeholder',
  );
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
  const [urlHighlights, setUrlHighlights] = useState<UrlHighlight[]>([]);
  // Ref to store link retention state from TextEditorLinkPreview
  const linkRetentionRef = useRef<LinkRetentionState>({
    debouncedFirstUrl: null,
    hiddenPreviewUrl: null,
  });

  const [title, setTitle] = useState<string>(event?.title ?? '');
  const [productTags, setProductTags] = useState<Amity.TextProductTag[] | undefined>();

  const [textValue, setTextValue] = useState<CreatePostParams>({
    text: event?.description ?? '',
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

  // Callback to update link retention state from TextEditorLinkPreview
  const handleLinkRetentionChange = useCallback((state: LinkRetentionState) => {
    linkRetentionRef.current = state;
  }, []);

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

      prependNewPost(post);

      // Calculate expected product tags count (what we sent)
      const expectedTextProductTagsCount = productTags?.length || 0;
      const expectedMediaProductTagsCount = files.reduce(
        (sum, file) => sum + (file.productTags?.length || 0),
        0,
      );

      // Calculate actual product tags count (what we received back)
      const actualTextProductTagsCount = post.productTags?.length || 0;
      const actualMediaProductTagsCount =
        post.childrenPosts?.reduce(
          (sum: number, childPost: Amity.Post) => sum + (childPost.productTags?.length || 0),
          0,
        ) || 0;

      // Check for deleted products (length mismatch)
      const hasDeletedProducts =
        actualTextProductTagsCount !== expectedTextProductTagsCount ||
        actualMediaProductTagsCount !== expectedMediaProductTagsCount;

      // Check for archived products
      const hasArchivedProducts =
        post.productTags?.some((tag: Amity.ProductTag) => tag.product?.status === 'archived') ||
        post.childrenPosts?.some((childPost: Amity.Post) =>
          childPost.productTags?.some(
            (tag: Amity.ProductTag) => tag.product?.status === 'archived',
          ),
        );

      if (hasDeletedProducts || hasArchivedProducts) {
        notification.info({
          content: resolveString('amity_social_toast_post_products_unavailable_toast'),
        });
      }

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
      const needsApproval =
        ((community as Amity.Community & { needApprovalOnPostCreation?: boolean })
          ?.needApprovalOnPostCreation ||
          community?.postSetting === CommunityPostSettings.ADMIN_REVIEW_POST_REQUIRED) &&
        !isModerator &&
        !isAdmin(user?.roles);

      if (needsApproval) {
        info({
          pageId,
          title: resolveString('amity_social_button_post_composer_create_buttons_sent_for_review'),
          content: resolveString('amity_social_modal_dialog_post_pending_approval'),
          okText: resolveString('amity_social_button_ok'),
        });
      }
      setIsMuted(false);
      setIsAspectFill(true);
      setIsCreating(false);
      handlePostSuccess({ suppressToast: needsApproval });
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

  const mediaOnlyProductCount = useMemo(() => {
    const textProductIds = new Set(productTags?.map((tag) => tag.productId) ?? []);
    const mediaOnlyProducts = new Set<string>();

    files.forEach((file) => {
      if (file.productTags) {
        file.productTags.forEach((tag) => {
          if (!textProductIds.has(tag.productId)) {
            mediaOnlyProducts.add(tag.productId);
          }
        });
      }
    });

    return mediaOnlyProducts.size;
  }, [files, productTags]);

  async function onCreatePost({ removeTag }: { removeTag?: boolean } = {}) {
    if (textValue.text?.length > MAXIMUM_POST_CHARACTERS) {
      setPostErrorText(resolveString('amity_social_error_post_text_exceed_error_message'));
      return;
    }

    // Get link retention state from the ref (updated by TextEditorLinkPreview)
    const { debouncedFirstUrl, hiddenPreviewUrl } = linkRetentionRef.current;

    // Handle link retention - same logic as PostTextField OnChangePlugin
    let effectiveLinks = textValue.links ?? [];

    // If no links in text but debounced URL exists and not hidden, retain the link
    // This handles the case where link text was removed but preview is still showing
    if (
      effectiveLinks.length === 0 &&
      debouncedFirstUrl &&
      debouncedFirstUrl !== hiddenPreviewUrl &&
      files.length === 0
    ) {
      effectiveLinks = [
        {
          index: 0,
          length: 0,
          url: debouncedFirstUrl,
          renderPreview: true,
        },
      ];
    }

    // If media is attached, set renderPreview to false for all links (Requirement 5)
    if (files.length > 0 && effectiveLinks.length > 0) {
      effectiveLinks = effectiveLinks.map((link) => ({
        ...link,
        renderPreview: false,
      }));
    }

    if (effectiveLinks && effectiveLinks.length > MAX_LINKS_PER_POST) {
      info({
        title: resolveString('amity_social_modal_dialog_title_link_limit_reached'),
        content: resolveString('amity_social_modal_dialog_link_limit').replace(
          '%s',
          String(MAX_LINKS_PER_POST),
        ),
        pageId,
        okText: resolveString('amity_social_button_ok'),
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

    let createPostParams: Parameters<typeof PostRepository.createPost>[0] = isEventPost
      ? ({
          targetId: targetId!,
          targetType,
          dataType: 'event',
          data: {
            eventId: event!.eventId,
            title: title.trim(),
            text: textValue.text,
          },
          metadata: { mentioned: textValue.mentioned, hashtags: textValue.hashtagsMetadata },
          mentionees: textValue.mentionees as Amity.UserMention[],
          hashtags: textValue.hashtagsMetadata?.map((hashtag) => hashtag.text),
          links: effectiveLinks,
        } as unknown as Parameters<typeof PostRepository.createPost>[0])
      : {
          targetId: targetId!,
          targetType,
          data: { title: title.trim(), text: textValue.text },
          metadata: { mentioned: textValue.mentioned, hashtags: textValue.hashtagsMetadata },
          mentionees: textValue.mentionees as Amity.UserMention[],
          attachments,
          hashtags: textValue.hashtagsMetadata?.map((hashtag) => hashtag.text),
          links: effectiveLinks,
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
    if (isEventPost) {
      return onCreatePost();
    }
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
        title: resolveString('amity_social_label_product_tagging_unavailable_title'),
        content: resolveString('amity_social_label_product_tagging_unavailable_description'),
        onOk: () => onCreatePost({ removeTag: true }),
        okText: resolveString('amity_social_button_publish'),
        okButtonColor: 'primary',
        cancelText: resolveString('amity_social_button_review_post'),
        onCancel: () => removeProductTag(),
      });
    } else onCreatePost();
  };

  const handlePostSuccess = ({ suppressToast = false }: { suppressToast?: boolean } = {}) => {
    setClipFile(null);
    if (isEventPost && !suppressToast) {
      notification.success({
        content: resolveString('amity_social_toast_event_post_created'),
      });
    }
    isDesktop ? closePopup() : checkRedirectPage();
  };

  const handlePostError = (error: Error) => {
    if (error.message.includes(ERROR_RESPONSE.BLOCKED_WORD)) {
      setPostErrorText(
        resolveString(
          isEventPost
            ? 'amity_social_toast_event_post_blocked_word'
            : 'amity_social_error_post_create_ban_word_error',
        ),
      );
    } else if (error.message.includes(ERROR_RESPONSE.BLOCKED_URL)) {
      setPostErrorText(
        resolveString(
          isEventPost
            ? 'amity_social_toast_event_post_blocked_link'
            : 'amity_social_error_add_blocked_links_post_error_message',
        ),
      );
    } else {
      setPostErrorText(
        resolveString(
          isEventPost
            ? 'amity_social_toast_event_post_create_failed'
            : 'amity_social_toast_error_create_post_failed',
        ),
      );
    }
  };

  const onClickClose = () => {
    if (hasNoChanges) return onBack();
    confirm({
      pageId: pageId,
      type: 'confirm',
      title: resolveString('amity_social_modal_dialog_title_discard_post'),
      content: resolveString('amity_social_modal_dialog_discard_post'),
      onOk: () => {
        setClipFile(null);
        checkRedirectPage();
      },
      okText: resolveString('amity_social_button_discard'),
      cancelText: resolveString('amity_social_button_keep_editing'),
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
          content={online ? postingText : waitingForNetworkText}
          alignment="fixed"
        />
      )}
      {(isError || postErrorText) && (
        <Notification
          duration={3000}
          content={postErrorText ? postErrorText : genericPostErrorText}
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
    if (isEventPost) {
      if (prevPage?.type === PageTypes.EventPostTargetSelectionPage) {
        return onBack(2);
      }
      return onBack();
    }
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
  const hasNoChanges =
    !isEventPost && textValue.text.length === 0 && files.length === 0 && clipFile == undefined;

  const canSubmitPost =
    (isEventPost || (!hasNoChanges && hasContent && !hasErrors)) &&
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
          data-is-event-post={isEventPost}
        >
          <Notification
            className={styles.createPost__notificationToast}
            content={
              online
                ? resolveString('amity_social_toast_poll_create_posting_toast')
                : resolveString('amity_social_label_waiting_for_network')
            }
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
          data-is-event-post={isEventPost}
        >
          <Notification
            content={
              postErrorText
                ? postErrorText
                : resolveString('amity_social_toast_error_create_post_failed')
            }
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
        data-is-event-post={isEventPost}
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
          {!isClipPost && (
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
              placeholder={titleOptionalPlaceholder}
              className={styles.createPost__titleInput}
              onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
            />
          )}
          <div className={styles.createPost__textEditor}>
            <TextEditor
              pageId={pageId}
              editorContentType="post"
              communityId={targetId}
              enableFloatingLink={isDesktop}
              placeholder={isClipPost ? clipBodyPlaceholder : undefined}
              initialText={textValue.text}
              enableProductMention={!isEventPost}
              taggedProductIds={allProductTags.map((tag) => tag.productId)}
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
                setUrlHighlights(urls);
                const links: Amity.Link[] = urls.map((url) => ({
                  url: url.url,
                  index: url.start,
                  length: url.end - url.start,
                  renderPreview: url.renderPreview,
                }));
                setTextValue((prev) => ({ ...prev, links }));
              }}
              // max = 20 - tags count in media feeds (if there are those tags in media tag)
              maxUniqueProductMentions={DEFAULT_MAX_PRODUCTS - mediaOnlyProductCount}
              initialProductMentions={productTags}
            />
          </div>
          {!isClipPost && !isEventPost && (
            <TextEditorLinkPreview
              pageId={pageId}
              urls={urlHighlights}
              attachmentAmount={files.length}
              isClipPost={isClipPost}
              onPreviewStateChange={(showPreview, isLoading) => {
                setIsPreviewLoading(isLoading ?? false);
              }}
              onLinkRetentionChange={handleLinkRetentionChange}
              onClose={(updatedUrls) => {
                setUrlHighlights(updatedUrls);
                const links: Amity.Link[] = updatedUrls.map((url) => ({
                  url: url.url,
                  index: url.start,
                  length: url.end - url.start,
                  renderPreview: url.renderPreview,
                }));
                setTextValue((prev) => ({ ...prev, links }));
              }}
            />
          )}
          {isEventPost && event && (
            <div className={styles.createPost__eventCardPreview}>
              <EventCard eventId={event.eventId} variant="card" size="lg" readOnly />
            </div>
          )}
          {!isEventPost && (
            <ImageThumbnail
              files={files}
              pageId={pageId}
              progress={progress}
              removeFile={removeFile}
              onAltTextChange={handleAltTextChange}
              onFileProductTagsChange={handleProductTagsChange}
              productTagsReachLimit={allProductTags.length >= DEFAULT_MAX_PRODUCTS}
              remainingLimit={DEFAULT_MAX_PRODUCTS - allProductTags.length}
              taggedProductIds={allProductTags.map((tag) => tag.productId)}
            />
          )}
          {!isEventPost && (
            <VideoThumbnail
              files={files}
              pageId={pageId}
              progress={progress}
              removeFile={removeFile}
              onFileProductTagsChange={handleProductTagsChange}
              productTagsReachLimit={allProductTags.length >= DEFAULT_MAX_PRODUCTS}
              remainingLimit={DEFAULT_MAX_PRODUCTS - allProductTags.length}
              taggedProductIds={allProductTags.map((tag) => tag.productId)}
            />
          )}
        </div>
        {!isEventPost && (
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
        )}
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
      {!isDesktop && !isClipPost && !isEventPost && (
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
      {!isDesktop && isEventPost && (
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
