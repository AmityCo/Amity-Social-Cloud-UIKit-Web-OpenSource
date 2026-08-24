import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useString, resolveString } from '~/v4/core/localization';
import {
  FileType,
  PostContentType,
  PostRepository,
  CommunityPostSettings,
  AmityAttachmentProductTags,
} from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNetworkState } from 'react-use';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import {
  AmityPostComposerEditOptions,
  CreatePostParams,
} from '~/v4/social/pages/PostComposerPage/PostComposerPage';
import {
  TextEditor,
  TextEditorLinkPreview,
  UrlHighlight,
  LinkRetentionState,
} from '~/v4/core/components/TextEditor';
import { DEFAULT_MAX_PRODUCTS } from '~/v4/constants/text-editor';
import { Spinner } from '~/v4/social/internal-components/Spinner';
import { CloseButton } from '~/v4/social/elements/CloseButton/CloseButton';
import { Notification } from '~/v4/core/components/Notification';
import { EditPostButton } from '~/v4/social/elements/EditPostButton';
import { EditPostTitle } from '~/v4/social/elements/EditPostTitle';
import usePostByIds from '~/v4/core/hooks/usePostByIds';
import { useGlobalFeedContext } from '~/v4/social/providers/GlobalFeedProvider';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { Mentioned } from '~/v4/helpers/utils';
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
import { getPostEventId, isEventPost, isTextPost } from '~/v4/social/utils/postTypeChecker';
import { EventCard } from '~/v4/social/features/events/components/EventCard';
import { Play } from '~/v4/icons/Play';
import { useImage } from '~/v4/core/hooks/useImage';
import { TextArea } from '~/v4/core/components/TextField';
import { MAX_LINKS_PER_POST } from '~/v4/social/constants/post';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { ProductTagActionButton } from '~/v4/social/features/product-tagged';

export function EditPost({ post }: AmityPostComposerEditOptions) {
  const pageId = 'post_composer_page';
  const isEventPostEdit = isEventPost(post);
  const eventId = isEventPostEdit ? getPostEventId(post) : undefined;

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
  const { confirm, info } = useConfirmContext();
  const {
    files,
    progress,
    isLoading,
    removeFile,
    handleFileChange,
    handleAltTextChange,
    handleProductTagsChange,
  } = useFilePostUpload(pageId);

  const posts = usePostByIds(post?.children || []);

  // Add community and user permissions related hooks
  const { currentUserId, client } = useSDK();
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

  const initialTitle = (post as Amity.Post<'text'>)?.data?.title || '';
  const initialText = (post as Amity.Post<'text'>)?.data?.text ?? '';
  const [title, setTitle] = useState<string>(initialTitle);
  const [textValue, setTextValue] = useState<CreatePostParams>({
    text: initialText,
    mentioned: post.metadata?.mentioned || [],
    hashtagsMetadata: [],
    mentionees: post.mentionees as Amity.UserMention[],
    attachments: [],
    links: post.links || [],
  });

  const { online } = useNetworkState();
  const { success, info: infoNotification } = useNotifications();

  const [postErrorText, setPostErrorText] = useState<string | undefined>();

  const updatingText = useString('amity_social_toast_event_post_updating');
  const waitingForNetworkText = useString('amity_social_label_waiting_for_network');
  // Backwards-compat name — EditPost is the update flow, so use the updating text.
  const postingText = updatingText;
  const postEditGenericErrorText = useString('amity_social_toast_post_edit_generic_error_message');
  const titlePlaceholder = useString('amity_social_label_title_optional');

  const [postImages, setPostImages] = useState<Amity.Post<'image'>[]>([]);
  const [postVideos, setPostVideos] = useState<Amity.Post<'video'>[]>([]);
  const [postClip, setPostClip] = useState<Amity.Post<'clip'>[]>([]);

  const [isUpdating, setIsUpdating] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [urlHighlights, setUrlHighlights] = useState<UrlHighlight[]>(() => {
    // Initialize from post.links if available
    return (post.links || []).map((link) => ({
      url: link.url,
      start: link.index ?? 0,
      end: (link.index ?? 0) + (link.length ?? 0),
      renderPreview: link.renderPreview ?? true,
    }));
  });
  // Ref to store link retention state from TextEditorLinkPreview
  const linkRetentionRef = useRef<LinkRetentionState>({
    debouncedFirstUrl: (() => {
      // Initialize with the first link that has renderPreview: true
      const links = post.links || [];
      if (links.length > 0) {
        const firstLinkWithPreview = links.find((link) => link.renderPreview === true);
        return firstLinkWithPreview?.url ?? null;
      }
      return null;
    })(),
    hiddenPreviewUrl: null,
  });
  const [productTags, setProductTags] = useState<Amity.TextProductTag[] | undefined>(
    post.productTags as Amity.TextProductTag[],
  );

  const allProductTags = useMemo(() => {
    const productMap = new Map<string, Amity.ProductTag>();

    if (productTags) {
      productTags.forEach((tag) => {
        if (tag.product?._id && !productMap.has(tag.product?._id)) {
          productMap.set(tag.product?._id, tag);
        }
      });
    }

    files.forEach((file) => {
      if (file.productTags) {
        file.productTags.forEach((tag) => {
          if (tag.product?._id && !productMap.has(tag.product?._id)) {
            productMap.set(tag.product?._id, tag);
          }
        });
      }
    });

    postImages.forEach((post) => {
      post.productTags.forEach((tag) => {
        if (tag.product?._id && !productMap.has(tag.product?._id)) {
          productMap.set(tag.product?._id, tag);
        }
      });
    });

    postVideos.forEach((post) => {
      post.productTags.forEach((tag) => {
        if (tag.product?._id && !productMap.has(tag.product?._id)) {
          productMap.set(tag.product?._id, tag);
        }
      });
    });

    return Array.from(productMap.values());
  }, [postImages, postVideos, productTags, files]);

  // Callback to receive link retention state from TextEditorLinkPreview
  const handleLinkRetentionChange = useCallback((state: LinkRetentionState) => {
    linkRetentionRef.current = state;
  }, []);

  const mediaOnlyProductCount = useMemo(() => {
    const textProductIds = new Set(productTags?.map((tag) => tag.product?._id) ?? []);
    const mediaOnlyProducts = new Set<string>();

    files.forEach((file) => {
      if (file.productTags) {
        file.productTags.forEach((tag) => {
          if (tag.product?._id && !textProductIds.has(tag.product?._id)) {
            mediaOnlyProducts.add(tag.product?._id);
          }
        });
      }
    });

    postImages.forEach((post) => {
      post.productTags?.forEach((tag) => {
        if (tag.product && !textProductIds.has(tag.product._id)) {
          mediaOnlyProducts.add(tag.product?._id);
        }
      });
    });

    postVideos.forEach((post) => {
      post.productTags?.forEach((tag) => {
        if (tag.product?._id && !textProductIds.has(tag.product?._id)) {
          mediaOnlyProducts.add(tag.product?._id);
        }
      });
    });

    return mediaOnlyProducts.size;
  }, [files, productTags, postImages, postVideos]);

  const isModerator =
    (moderators || []).find((moderator) => moderator.userId === currentUserId) != null;

  const isModeratorOrAdmin = isModerator || isAdmin(user?.roles);
  const isPostNeedsApproval =
    !isModeratorOrAdmin &&
    ((community as Amity.Community & { needApprovalOnPostCreation?: boolean })
      ?.needApprovalOnPostCreation ||
      community?.postSetting === CommunityPostSettings.ADMIN_REVIEW_POST_REQUIRED);

  const { updateNewPost } = useGlobalFeedContext();

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
        const updatedPost = response.data;

        // Calculate expected product tags count (what we sent)
        const expectedTextProductTagsCount = productTags?.length || 0;
        const expectedMediaProductTagsCount =
          postImages.reduce((sum, post) => sum + (post.productTags?.length || 0), 0) +
          postVideos.reduce((sum, post) => sum + (post.productTags?.length || 0), 0) +
          files.reduce((sum, file) => sum + (file.productTags?.length || 0), 0);

        // Calculate actual product tags count (what we received back)
        const actualTextProductTagsCount = updatedPost.productTags?.length || 0;
        const actualMediaProductTagsCount =
          updatedPost.childrenPosts?.reduce(
            (sum: number, childPost: Amity.Post) => sum + (childPost.productTags?.length || 0),
            0,
          ) || 0;

        // Check for deleted products (length mismatch)
        const hasDeletedProducts =
          actualTextProductTagsCount !== expectedTextProductTagsCount ||
          actualMediaProductTagsCount !== expectedMediaProductTagsCount;

        // Check for archived products
        const hasArchivedProducts =
          updatedPost.productTags?.some(
            (tag: Amity.ProductTag) => tag.product?.status === 'archived',
          ) ||
          updatedPost.childrenPosts?.some((childPost: Amity.Post) =>
            childPost.productTags?.some(
              (tag: Amity.ProductTag) => tag.product?.status === 'archived',
            ),
          );

        if (hasDeletedProducts || hasArchivedProducts) {
          infoNotification({
            content: resolveString('amity_social_toast_post_products_unavailable_toast'),
          });
        }

        setIsUpdating(false);
        isDesktop ? closePopup() : onBack();
        updateNewPost(updatedPost);

        if (isPostNeedsApproval) {
          success({
            content: resolveString(
              'amity_social_label_post_composer_post_updates_sent_for_review_title',
            ),
          });
        } else if (isEventPostEdit) {
          success({
            content: resolveString('amity_social_toast_event_post_updated'),
          });
        }
      },
      onError: (error) => {
        setIsUpdating(false);
        setIsError(true);

        if (error.message.includes(ERROR_RESPONSE.BLOCKED_WORD)) {
          setPostErrorText(
            resolveString(
              isEventPostEdit
                ? 'amity_social_toast_event_post_blocked_word'
                : 'amity_social_error_post_create_ban_word_error',
            ),
          );
        } else if (error.message.includes(ERROR_RESPONSE.BLOCKED_URL)) {
          setPostErrorText(
            resolveString(
              isEventPostEdit
                ? 'amity_social_toast_event_post_blocked_link'
                : 'amity_social_error_add_blocked_links_post_error_message',
            ),
          );
        } else {
          setPostErrorText(
            resolveString(
              isEventPostEdit
                ? 'amity_social_toast_event_post_update_failed'
                : 'amity_social_toast_post_create_generic_error_message',
            ),
          );
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

  useEffect(() => {
    if (post.links && post.links.length > 0) {
      setTextValue((prev) => ({
        ...prev,
        links: post.links,
      }));
    }
  }, [post.links]);

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

  const performPostUpdate = ({ removeTag }: { removeTag?: boolean } = {}) => {
    const attachments: { fileId: string; type: string }[] = [];

    // Build attachment product tags
    const attachmentProductTags = new AmityAttachmentProductTags();
    let hasAttachmentProductTags = false;

    if (!isClipPost) {
      // Handle existing post images with their product tags
      const attachmentsImage = postImages.map((item: Amity.Post<'image'>) => {
        const fileId = item?.data?.fileId as string;
        if (!removeTag && item.productTags && item.productTags.length > 0) {
          attachmentProductTags.set(
            fileId,
            item.productTags.map(({ productId }) => ({ productId })),
          );
          hasAttachmentProductTags = true;
        }
        return {
          fileId,
          type: PostContentType.IMAGE,
        };
      });

      // Handle existing post videos with their product tags
      const attachmentsVideo = postVideos.map((item: Amity.Post<'video'>) => {
        const fileId = item?.data?.videoFileId.original as string;
        if (!removeTag && item.productTags && item.productTags.length > 0) {
          attachmentProductTags.set(
            fileId,
            item.productTags.map(({ productId }) => ({ productId })),
          );
          hasAttachmentProductTags = true;
        }
        return { fileId, type: PostContentType.VIDEO };
      });

      // Handle newly uploaded files with their product tags
      const newAttachments = files.map((file: FileItem) => {
        const fileId = isAmityFile(file.file) ? file.file.fileId : file.id;
        if (!removeTag && file.productTags && file.productTags.length > 0) {
          attachmentProductTags.set(
            fileId,
            file.productTags.map(({ productId }) => ({ productId })),
          );
          hasAttachmentProductTags = true;
        }
        return {
          fileId,
          type: isAmityFile(file.file)
            ? file.file.type
            : file.file.type.startsWith('image/')
              ? PostContentType.IMAGE
              : PostContentType.VIDEO,
        };
      });

      // Combine all attachments
      attachments.push(...attachmentsImage, ...attachmentsVideo, ...newAttachments);
    }

    const finalProductTags = removeTag
      ? undefined
      : productTags?.length
        ? productTags.map((productTag) => {
            const { product, ...rest } = productTag;
            return rest;
          })
        : undefined;

    // Compute effective links, including retained URL if preview is still showing but text was removed
    const currentTotalMedia =
      ((files && files?.length) || 0) +
      ((postImages && postImages?.length) || 0) +
      ((postVideos && postVideos?.length) || 0);

    let effectiveLinks = textValue?.links ?? [];

    // If no links in text but debounced URL exists and not hidden, retain the link
    // This handles the case where link text was removed but preview is still showing
    const { debouncedFirstUrl: retainedUrl, hiddenPreviewUrl: hiddenUrl } =
      linkRetentionRef.current;
    if (
      effectiveLinks.length === 0 &&
      retainedUrl &&
      retainedUrl !== hiddenUrl &&
      currentTotalMedia === 0
    ) {
      effectiveLinks = [
        {
          index: 0,
          length: 0,
          url: retainedUrl,
          renderPreview: true,
        },
      ];
    }

    // If media is attached, set renderPreview to false for all links (Requirement 5)
    if (currentTotalMedia > 0 && effectiveLinks.length > 0) {
      effectiveLinks = effectiveLinks.map((link) => ({
        ...link,
        renderPreview: false,
      }));
    }

    if (textValue) {
      if (isEventPostEdit) {
        mutateUpdatePostAsync({
          data: { text: textValue.text, title: title.trim() },
          metadata: {
            mentioned: textValue.mentioned ?? [],
            hashtags: textValue.hashtagsMetadata,
          },
          mentionees: textValue.mentionees as Amity.UserMention[],
          hashtags: textValue.hashtagsMetadata?.map((hashtag) => hashtag.text) || [],
          links: effectiveLinks,
        });
      } else if (isClipPost) {
        mutateUpdatePostAsync({
          data: { text: textValue.text },
          metadata: {
            mentioned: textValue.mentioned ?? [],
            hashtags: textValue.hashtagsMetadata,
          },
          mentionees: textValue.mentionees as Amity.UserMention[],
          hashtags: textValue.hashtagsMetadata?.map((hashtag) => hashtag.text) || [],
          links: effectiveLinks,
          productTags: finalProductTags,
        });
      } else {
        mutateUpdatePostAsync({
          data: { text: textValue.text, title: title.trim() },
          metadata: {
            mentioned: textValue.mentioned ?? [],
            hashtags: textValue.hashtagsMetadata,
          },
          mentionees: textValue.mentionees as Amity.UserMention[],
          hashtags: textValue.hashtagsMetadata?.map((hashtag) => hashtag.text) || [],
          attachments: attachments,
          links: effectiveLinks,
          productTags: finalProductTags,
          attachmentProductTags: hasAttachmentProductTags ? attachmentProductTags : undefined,
        });
      }
    }
  };

  const removeProductTag = () => {
    setProductTags([]);
    setPostImages((prev) => prev.map((post) => ({ ...post, productTags: [] })));
    setPostVideos((prev) => prev.map((post) => ({ ...post, productTags: [] })));
    files.forEach((file) => (file.productTags = []));
  };

  const validatePost = async () => {
    if (isEventPostEdit) {
      return performPostUpdate();
    }
    const setting = await client?.getProductCatalogueSetting();
    const hasProductTags =
      files.some((file) => file.productTags && file.productTags.length > 0) ||
      postImages.some((post) => post.productTags && post.productTags.length > 0) ||
      postVideos.some((post) => post.productTags && post.productTags.length > 0) ||
      (productTags && productTags.length > 0);

    if (setting && !setting.product.enabled && hasProductTags) {
      confirm({
        pageId: pageId,
        type: 'confirm',
        title: resolveString('amity_social_label_product_tagging_unavailable_title'),
        content: resolveString('amity_social_your_post_can_still_be_published_but_product_tags_'),
        onOk: () => performPostUpdate({ removeTag: true }),
        okText: resolveString('amity_social_button_publish'),
        okButtonColor: 'primary',
        cancelText: resolveString('amity_social_button_review_post'),
        onCancel: () => removeProductTag(),
      });
    } else {
      proceedWithSave();
    }
  };

  const proceedWithSave = () => {
    // Check if post needs approval and show confirmation popup before API call
    if (shouldCallCommunity && isPostNeedsApproval) {
      info({
        pageId,
        title: resolveString(
          'amity_social_button_post_composer_create_button_will_be_sent_for_review',
        ),
        content: resolveString('amity_social_label_edit_post_community_requires_approval_content'),
        okText: resolveString('amity_social_button_ok'),
        cancelText: resolveString('amity_social_button_cancel'),
        onOk: () => {
          performPostUpdate();
        },
      });
    } else {
      performPostUpdate();
    }
  };

  const onSave = () => {
    if (textValue.text?.length && textValue.text.length > MAXIMUM_POST_CHARACTERS) {
      setPostErrorText(resolveString('amity_social_error_post_text_exceed_error_message'));
      return;
    }

    if (textValue.links && textValue.links.length > MAX_LINKS_PER_POST) {
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

    validatePost();
  };

  const onClickClose = () => {
    if (hasNoChanges) return onBack();
    confirm({
      pageId: pageId,
      type: 'confirm',
      title: resolveString('amity_social_modal_dialog_title_discard_post'),
      content: resolveString('amity_social_modal_dialog_discard_post'),
      onOk: () => {
        onBack();
      },
      okText: resolveString('amity_social_button_discard'),
      cancelText: resolveString('amity_social_button_keep_editing'),
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
          content={online ? postingText : waitingForNetworkText}
          alignment="fixed"
        />
      )}
      {(isError || postErrorText) && (
        <Notification
          duration={3000}
          content={postErrorText ?? postEditGenericErrorText}
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

  const hasLinkChanges = () => {
    const originalLinks = post.links || [];
    const currentLinks = textValue.links || [];

    if (originalLinks.length !== currentLinks.length) {
      return true;
    }

    return originalLinks.some((originalLink, index) => {
      const currentLink = currentLinks[index];
      return (
        originalLink.url !== currentLink?.url ||
        originalLink.renderPreview !== currentLink?.renderPreview ||
        originalLink.index !== currentLink?.index ||
        originalLink.length !== currentLink?.length
      );
    });
  };

  // Check if product tags have changed
  const hasProductTagsChange = useMemo(() => {
    // Check text product tags
    const originalTextTags = post.productTags || [];
    const currentTextTags = productTags || [];
    if (originalTextTags.length !== currentTextTags.length) return true;
    const textTagsChanged = originalTextTags.some(
      (tag, index) => tag.product?._id !== currentTextTags[index]?.product?._id,
    );
    if (textTagsChanged) return true;

    // Check image product tags
    const originalImagePosts = posts.filter((p) => p.dataType === 'image') as Amity.Post<'image'>[];
    for (const originalPost of originalImagePosts) {
      const currentPost = postImages.find((p) => p.postId === originalPost.postId);
      if (!currentPost) continue;
      const originalTags = originalPost.productTags || [];
      const currentTags = currentPost.productTags || [];
      if (originalTags.length !== currentTags.length) return true;
      const tagsChanged = originalTags.some(
        (tag, index) => tag.product?._id !== currentTags[index]?.product?._id,
      );
      if (tagsChanged) return true;
    }

    // Check video product tags
    const originalVideoPosts = posts.filter((p) => p.dataType === 'video') as Amity.Post<'video'>[];
    for (const originalPost of originalVideoPosts) {
      const currentPost = postVideos.find((p) => p.postId === originalPost.postId);
      if (!currentPost) continue;
      const originalTags = originalPost.productTags || [];
      const currentTags = currentPost.productTags || [];
      if (originalTags.length !== currentTags.length) return true;
      const tagsChanged = originalTags.some(
        (tag, index) => tag.product?._id !== currentTags[index]?.product?._id,
      );
      if (tagsChanged) return true;
    }

    // Check new files with product tags
    if (files.some((file) => file.productTags && file.productTags.length > 0)) return true;

    return false;
  }, [post.productTags, productTags, posts, postImages, postVideos, files]);

  const hasNoChanges = isEventPostEdit
    ? initialText === textValue.text && initialTitle === title
    : isTextPost(post) &&
      post.data?.text === textValue.text &&
      post.data?.title === title &&
      !hasLinkChanges() &&
      !hasMediaChange &&
      !hasProductTagsChange;

  const hasNoContent = isEventPostEdit
    ? false
    : !(
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
    isPreviewLoading ||
    files.some((file) => !isAmityFile(file.file)); // to make sure that files are uploaded with fileId

  // Move the useImage hook outside conditional rendering
  const thumbnailFileId = postClip.length > 0 ? postClip[0].data?.thumbnailFileId : null;
  const clipThumbnail = useImage({
    fileId: thumbnailFileId,
    imageSize: 'medium',
  });

  const renderPosting = () => {
    if (isUpdating || !online) {
      return (
        <Typography.Body
          data-testid="edit-post-posting-notification"
          className={styles.editPost__notification}
          data-show-detail-media-attachment={showToastPosition()}
          data-isclip={isClipPost}
          data-is-event-post={isEventPostEdit}
        >
          <Notification
            className={styles.editPost__notificationToast}
            content={online ? postingText : waitingForNetworkText}
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
          data-testid="edit-post-error-notification"
          className={styles.editPost__notification}
          data-show-detail-media-attachment={showToastPosition()}
          data-isclip={isClipPost}
          data-is-event-post={isEventPostEdit}
        >
          <Notification
            content={postErrorText ?? postEditGenericErrorText}
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
      );
    }
    return null;
  };

  return (
    <div className={styles.editPost} style={themeStyles}>
      {isDesktop && notifications}
      <form
        className={styles.editPost__form}
        onSubmit={handleSubmit(onSave)}
        data-from-media={snap == HEIGHT_MEDIA_ATTACHMENT_MENU}
        data-is-event-post={isEventPostEdit}
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
          <TextArea
            data-testid="edit-post-title-input"
            name="title"
            value={title}
            maxLength={150}
            placeholder={titlePlaceholder}
            className={styles.editPost__titleInput}
            onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
            onChange={(e) => {
              e.target.value.length > 150
                ? setTitle(e.target.value.slice(0, 150))
                : setTitle(e.target.value);
            }}
          />
          <div className={styles.editPost__textEditor}>
            <TextEditor
              pageId={pageId}
              editorContentType="post"
              initialLinks={post.links}
              enableFloatingLink={isDesktop}
              communityId={post.targetType === 'community' ? post.targetId : undefined}
              initialText={textValue.text}
              initialMentions={post.metadata?.mentioned}
              initialHashtags={post.metadata?.hashtags}
              enableProductMention={!isEventPostEdit}
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
              maxUniqueProductMentions={DEFAULT_MAX_PRODUCTS - mediaOnlyProductCount}
              initialProductMentions={productTags as Amity.TextProductTag[]}
            />
          </div>
          {!isClipPost && !isEventPostEdit && (
            <TextEditorLinkPreview
              pageId={pageId}
              urls={urlHighlights}
              attachmentAmount={totalMedia}
              isClipPost={isClipPost}
              onPreviewStateChange={(showPreview, isLoading) => {
                setIsPreviewLoading(isLoading ?? false);
              }}
              onLinkRetentionChange={handleLinkRetentionChange}
              onClose={(updatedUrls) => {
                // hiddenPreviewUrl is now managed inside TextEditorLinkPreview
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
          {isEventPostEdit && eventId && (
            <div className={styles.editPost__eventCardPreview}>
              <EventCard eventId={eventId} variant="card" size="lg" readOnly />
            </div>
          )}

          {!isEventPostEdit && (
            <ImageThumbnail
              files={files}
              pageId={pageId}
              progress={progress}
              removeFile={removeFile}
              postImages={postImages as Amity.Post<'image'>[]}
              onAltTextChange={handleAltTextChange}
              onRemovePostImage={handleRemoveThumbnailImage}
              onFileProductTagsChange={handleProductTagsChange}
              onChildPostProductTagsChange={(postId, productTags) => {
                setPostImages((prev) => {
                  const updatedPosts = prev.map((post) =>
                    post.postId === postId ? { ...post, productTags: [...productTags] } : post,
                  );

                  return [...updatedPosts];
                });
              }}
              productTagsReachLimit={allProductTags.length >= DEFAULT_MAX_PRODUCTS}
              remainingLimit={DEFAULT_MAX_PRODUCTS - allProductTags.length}
              taggedProductIds={allProductTags.map((tag) => tag.productId)}
            />
          )}
          {!isEventPostEdit && (
            <VideoThumbnail
              files={files}
              pageId={pageId}
              progress={progress}
              removeFile={removeFile}
              postVideos={postVideos as Amity.Post<'video'>[]}
              onRemovePostVideo={handleRemoveThumbnailVideo}
              onFileProductTagsChange={handleProductTagsChange}
              onChildPostProductTagsChange={(postId, productTags) => {
                setPostVideos((prev) => {
                  const updatedPosts = prev.map((post) =>
                    post.postId === postId ? { ...post, productTags: [...productTags] } : post,
                  );

                  return [...updatedPosts];
                });
              }}
              productTagsReachLimit={allProductTags.length >= DEFAULT_MAX_PRODUCTS}
              remainingLimit={DEFAULT_MAX_PRODUCTS - allProductTags.length}
              taggedProductIds={allProductTags.map((tag) => tag.productId)}
            />
          )}
        </div>
        {/* TODO: Handle file type */}
        {!isClipPost && !isEventPostEdit && (
          <div className={styles.editPost__attachment}>
            <MediaAttachment
              pageId={pageId}
              sourceId={post.postId}
              totalMedia={totalMedia}
              isVisibleCamera={isVisibleCamera}
              isVisibleImage={isVisibleImage}
              isVisibleVideo={isVisibleVideo}
              productTags={allProductTags}
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
      {!isDesktop && !isClipPost && !isEventPostEdit && (
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
                            sourceId={post.postId}
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

          {renderPosting()}
          {renderError()}
        </div>
      )}

      <div className={styles.editPost__notificationContainer}>
        {(isPending || !online) && (
          <div
            className={styles.editPost__notification}
            data-show-detail-media-attachment={showToastPosition()}
            data-isclip={isClipPost}
            data-is-event-post={isEventPostEdit}
          >
            <Notification
              className={styles.editPost__notificationToast}
              content={online ? postingText : waitingForNetworkText}
              icon={<Spinner />}
              alignment="fixed"
            />
          </div>
        )}
        {(isError || postErrorText) && (
          <div
            className={styles.editPost__notification}
            data-isclip={isClipPost}
            data-show-detail-media-attachment={showToastPosition()}
            data-is-event-post={isEventPostEdit}
          >
            <Notification
              content={postErrorText ?? postEditGenericErrorText}
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
      {!isDesktop && allProductTags.length > 0 && (
        <div
          className={styles.editPost__productTagActionButton}
          data-from-media={snap == HEIGHT_MEDIA_ATTACHMENT_MENU}
        >
          <ProductTagActionButton
            pageId={pageId}
            productTags={allProductTags}
            className={styles.editPost__productTagActionButton__button}
          />
        </div>
      )}
    </div>
  );
}
