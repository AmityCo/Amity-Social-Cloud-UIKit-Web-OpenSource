import React, { useCallback, useEffect, useRef, useState } from 'react';
import InternalMessageComposer from '~/v4/chat/internal-components/MessageComposer/MessageComposer';
import styles from './LivestreamChatMessageComposer.module.css';
import { Typography } from '~/v4/core/components';
import ChatMuted from '~/v4/icons/ChatMuted';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { useCreateMessage } from '~/v4/chat/hooks/useCreateMessage';
import { $getRoot, $getSelection, $isRangeSelection, LexicalEditor } from 'lexical';
import { ActionButton } from '~/v4/core/components/ActionButton/ActionButton';
import ArrowTop from '~/v4/icons/ArrowTop';
import Notification from '~/v4/core/components/Notification';
import ExclamationCircle from '~/v4/icons/ExclamationCircle';
import { editorToText } from '~/v4/social/internal-components/Lexical/utils';
import { ReactionButton } from '~/v4/social/elements/';
import Liked from '~/v4/icons/Liked';
import { Popover } from '~/v4/core/components/AriaPopover/Popover';
import { ReactionBar } from '~/v4/chat/components/ReactionBar/ReactionBar';
import { useChannel } from '~/v4/chat/hooks/useChannel';
import { LiveReactionRepository } from '@amityco/ts-sdk';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import useCommunityProfileGlobalBehavior from '~/v4/core/hooks/useCommunityProfileGlobalBehavior';
import useSDK from '~/v4/core/hooks/useSDK';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import AddUser from '~/v4/icons/AddUser';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { InviteCoHostList } from '~/v4/social/features/livestream/internal-components/InviteCoHostList';
import { useLivestreamData } from '~/v4/social/features/livestream/providers';
import { TagOutlined } from '~/v4/icons/TagOutlined';
import { ManageProductTagList } from '~/v4/social/features/product-tagged/components/ManageProductTagList';
import useTaggingProduct from '~/v4/social/hooks/useTaggingProduct';
import { ProductTagList } from '~/v4/social/features/product-tagged/components/ProductTagList';
import { AnalyticsSourceTypeEnum } from '@amityco/ts-sdk';
import useProductCatalogueSettings from '~/v4/social/hooks/useProductCatalogueSettings';
import { usePost } from '~/v4/social/hooks/posts/';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';

interface LivestreamChatMessageComposerProps {
  channelId?: Amity.Channel['channelId'];
  disabled?: boolean;
  pageId?: string;
  community?: Amity.Community | null;
  isPendingPost?: boolean;
  isPlayer?: boolean;
}

const LIVESTREAM_MESSAGE_MAX_CHARACTOR = 200;

type AddLivestreamReactionParams = {
  reaction: string;
  targetId: string;
  roomId: string;
};

interface LiveManageProductTagListContentProps {
  postId: string;
  roomId: string;
  pageId: string;
  sourceType: AnalyticsSourceTypeEnum;
  onClose: () => void;
  onProductCatalogueDisabled?: () => void;
  onPostUpdate?: (post: Amity.Post<'room'>) => void;
}

function LiveManageProductTagListContent({
  postId,
  roomId,
  pageId,
  sourceType,
  onClose,
  onProductCatalogueDisabled,
  onPostUpdate,
}: LiveManageProductTagListContentProps) {
  const { post: subscribedPost, isLoading } = usePost({ postId });

  useEffect(() => {
    if (subscribedPost && subscribedPost.dataType === 'room') {
      onPostUpdate?.(subscribedPost as Amity.Post<'room'>);
    }
  }, [subscribedPost, onPostUpdate]);
  const pinnedProductId = subscribedPost?.pinnedProductId;

  const handleProductCatalogueDisabledWithClose = useCallback(() => {
    onClose();
    onProductCatalogueDisabled?.();
  }, [onClose, onProductCatalogueDisabled]);

  const { pinProduct, unpinProduct, isPinning, isUnpinning, updateProductTags } = useTaggingProduct(
    { onProductCatalogueDisabled: handleProductCatalogueDisabledWithClose },
  );
  const { success } = useNotifications();

  // Track the last confirmed server tag IDs independently of subscribedPost,
  // which can be stale right after an add/remove API call.
  const lastKnownTagIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (subscribedPost?.productTags) {
      lastKnownTagIdsRef.current = new Set(
        subscribedPost.productTags.map((t: Amity.ProductTag) => t.productId),
      );
    }
  }, [subscribedPost?.productTags]);

  if (isLoading || !subscribedPost) return null;

  return (
    <ManageProductTagList
      pageId={pageId}
      sourceType={sourceType}
      sourceId={roomId}
      renderMode="livestream"
      productTags={subscribedPost?.productTags}
      onClose={onClose}
      pinnedProductId={pinnedProductId}
      onRemove={async (productTag) => {
        if (subscribedPost?.postId) {
          const updatedTags = subscribedPost?.productTags?.filter(
            (tag) => tag.productId !== productTag.productId,
          );
          try {
            await updateProductTags({
              postId: subscribedPost?.postId,
              productTags: updatedTags || [],
              action: 'remove',
            });
            success({ content: 'Product tag removed.' });
          } catch (error) {
            return subscribedPost?.productTags as Amity.ProductTag[] | undefined;
          }
        }
      }}
      onUpdateProductTags={async (tags) => {
        if (subscribedPost?.postId) {
          const hasNewTags = tags.some(
            (t: Amity.ProductTag) => !lastKnownTagIdsRef.current.has(t.productId),
          );
          try {
            const result = await updateProductTags({
              postId: subscribedPost?.postId,
              productTags: tags,
              action: 'add',
            });

            // Update the ref immediately with confirmed server state
            if (result?.data?.productTags) {
              lastKnownTagIdsRef.current = new Set(
                result.data.productTags.map((t: Amity.ProductTag) => t.productId),
              );
            }

            const hasUnavailableProducts = result?.data?.productTags?.some(
              (tag: Amity.ProductTag) => !tag.product || tag.product.status === 'archived',
            );
            if (!hasUnavailableProducts && hasNewTags) {
              success({ content: 'Product tags added.' });
            }

            return result?.data?.productTags as Amity.ProductTag[] | undefined;
          } catch (error) {
            return subscribedPost?.productTags as Amity.ProductTag[] | undefined;
          }
        }
      }}
      onPinnedProductIdChange={async (productId) => {
        if (subscribedPost?.postId) {
          if (productId) {
            if (productId !== pinnedProductId) {
              await pinProduct({
                postId: subscribedPost?.postId,
                productId,
              });
            }
          } else {
            // Only call unpinProduct for explicit unpin actions, not when the pinned product was removed
            const pinnedProductStillExists = subscribedPost?.productTags?.some(
              (tag) => tag.productId === pinnedProductId,
            );
            if (pinnedProductStillExists) {
              await unpinProduct(subscribedPost?.postId);
            }
          }
        }
      }}
      isPinning={isPinning}
      isUnpinning={isUnpinning}
    />
  );
}

export const LivestreamChatMessageComposer = ({
  pageId = '*',
  channelId,
  disabled = false,
  community,
  isPendingPost = false,
  isPlayer = false,
}: LivestreamChatMessageComposerProps) => {
  // Get values from context
  const {
    hostId,
    coHostId,
    coHost,
    invitationByMe,
    room,
    livestreamPost: subscribedPost,
    setLivestreamPost,
  } = useLivestreamData();
  const { handleCommunityProfileBehavior } = useCommunityProfileGlobalBehavior();
  const { info } = useNotifications();

  const componentId = 'livestream_chat_compose_bar';
  const editorRef = useRef<LexicalEditor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDesktop } = useResponsive();
  const { currentUserId } = useSDK();

  const { channel, loading: isChannelLoading } = useChannel({ channelId });

  const { openPopup, closePopup } = usePopupContext();
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { info: warning } = useConfirmContext();
  const { productCatalogueSettings, refetchProductCatalogueSettings } =
    useProductCatalogueSettings();

  const isHost = hostId === currentUserId;
  const isCoHost = coHostId === currentUserId;

  const isHostOrCoHostWithProductManagement = isHost || (isCoHost && coHost?.canManageProductTags);

  const pinnedProductId = subscribedPost?.pinnedProductId;

  const [error, setError] = useState<string | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [isSpacebar, setIsSpacebar] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoadingMembership, setIsLoadingMembership] = useState(true);
  const [isProductTagButtonHidden, setIsProductTagButtonHidden] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const hasProductTags = subscribedPost?.productTags && subscribedPost?.productTags.length > 0;

  const { themeStyles, accessibilityId } = useAmityComponent({
    pageId,
    componentId,
  });

  useEffect(() => {
    if (productCatalogueSettings == null) return;
    setIsProductTagButtonHidden(!productCatalogueSettings.product.enabled);
  }, [productCatalogueSettings?.product.enabled]);

  const handleProductCatalogueDisabled = useCallback(() => {
    setIsProductTagButtonHidden(true);
    closePopup('manage_product_tagging_popup');
    closePopup('product_tag_list_popup');
    removeDrawerData();
  }, [closePopup, removeDrawerData]);

  const canReact = ((!isHost && !isCoHost) || isPlayer) && (isEmpty || isMuted);

  const clearMessage = () => {
    editorRef.current?.update(() => {
      const root = $getRoot();
      root.clear();
    });
  };

  const { createMessage } = useCreateMessage({
    onError: (message: string) => {
      setError(message);
    },
  });

  const onReactionClick = useCallback(
    ({ reaction, targetId, roomId }: AddLivestreamReactionParams) => {
      LiveReactionRepository.createReaction({
        referenceId: targetId,
        referenceType: 'post',
        reactionName: reaction,
        roomId,
      });
    },
    [],
  );

  const handleReactionClick = (params: AddLivestreamReactionParams) => {
    return handleCommunityProfileBehavior({
      defaultBehavior: () => onReactionClick(params),
      allowNonMember: false,
      isJoined: community?.isJoined,
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleContainerTouch = (event: TouchEvent) => {
      const target = event.target as HTMLElement;

      // ✅ Check for ActionButton and other interactive elements
      const isActionButton = target.closest('button, [role="button"], [data-element-id]');

      if (isActionButton) {
        return; // Don't interfere with buttons
      }

      // ✅ Check if touching the editor area
      const editorElement = container.querySelector('[contenteditable="true"]') as HTMLElement;
      const isTouchingEditor =
        editorElement && (target === editorElement || editorElement.contains(target));

      if (isTouchingEditor) {
        event.preventDefault();
        editorElement.focus();

        // ✅ Also focus using Lexical editor reference
        if (editorRef.current) {
          editorRef.current.focus();

          // ✅ Move cursor to end
          editorRef.current.update(() => {
            const root = $getRoot();
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              root.selectEnd();
            }
          });
        }
      }
    };

    // ✅ Use capture phase to handle before child components
    container.addEventListener('touchstart', handleContainerTouch, true);

    const handleFocusIn = () => setIsFocused(true);
    const handleFocusOut = (e: FocusEvent) => {
      if (!container.contains(e.relatedTarget as Node)) {
        setIsFocused(false);
      }
    };

    container.addEventListener('focusin', handleFocusIn);
    container.addEventListener('focusout', handleFocusOut);

    return () => {
      container.removeEventListener('touchstart', handleContainerTouch, true);
      container.removeEventListener('focusin', handleFocusIn);
      container.removeEventListener('focusout', handleFocusOut);
    };
  }, [containerRef.current]);

  useEffect(() => {
    let unsubscribe: () => void;

    if (channel?.channelId)
      unsubscribe = (channel as Amity.Channel<'live'>)?.myMembership(({ data, loading }) => {
        setIsLoadingMembership(loading);
        if (!loading && data) setIsMuted(data.isMuted);
      });

    return () => {
      unsubscribe?.();
    };
  }, [channel?.channelId]);

  const renderReactionButton = useCallback(
    ({ targetId, roomId }: { targetId: string; roomId: string }) => {
      return (
        <Popover
          forceShowPopUp={true}
          placement="top"
          trigger={({ openPopover }) => (
            <ReactionButton
              isLivestreamReaction={true}
              pageId={pageId}
              componentId={componentId}
              onReactionClick={(reaction: string) =>
                handleReactionClick({
                  reaction,
                  targetId,
                  roomId,
                })
              }
              onHover={openPopover}
              onLongPress={openPopover}
              hoverDuration={600}
              reactButtonClassName={styles.livestreamChatMessageComposer__reactionButton}
              defaultIcon={() => (
                <Liked className={styles.livestreamChatMessageComposer__reactionButton} />
              )}
              community={community}
            />
          )}
          className={styles.livestreamChatMessageComposer__reactionPopOver}
          crossOffset={-85}
        >
          <ReactionBar
            targetId={targetId}
            targetType="post"
            roomId={roomId}
            isJoinedCommunity={community?.isJoined}
          />
        </Popover>
      );
    },
    [community?.communityId],
  );

  const renderReadOnlyState = useCallback(
    ({
      message,
      channel,
      allowReaction,
    }: {
      message: string;
      channel?: Amity.Channel<'live'> | null;
      allowReaction?: boolean;
    }) => {
      if (!channel || !channel.attachedTo?.postId || !channel.attachedTo.roomId) return;

      return (
        <div className={styles.livestreamChatMessageComposer__mute__container}>
          <ChatMuted className={styles.livestreamChatMessageComposer__mute__icon} />
          <Typography.Body className={styles.livestreamChatMessageComposer__mute__text}>
            {message}
          </Typography.Body>
          {allowReaction &&
            renderReactionButton({
              targetId: channel.attachedTo.postId,
              roomId: channel.attachedTo.roomId,
            })}
        </div>
      );
    },
    [],
  );

  const sendMessage = () => {
    if (!channel) return;
    if (!editorRef.current) return;
    if (!community?.isJoined) {
      return info({
        content: 'Join community to interact.',
        alignment: 'fullscreen',
      });
    }

    const { mentioned, mentionees, text } = editorToText(editorRef.current);

    if (text?.trim().length === 0) return;

    if (text.trim().length > LIVESTREAM_MESSAGE_MAX_CHARACTOR) {
      setError('Your message is too long. Please shorten your message and try again.');
      return;
    }

    createMessage({
      tags: [],
      subChannelId: channel.channelId,
      data: { text: text.trim() },
      dataType: 'text',
      mentionees,
      metadata: { mentioned },
    });

    clearMessage();
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.blur();
      }
    }, 50);
  };

  const ensureCatalogueEnabledOrWarn = useCallback(async () => {
    const latestSettings = await refetchProductCatalogueSettings();
    if (!latestSettings?.product.enabled) {
      setIsProductTagButtonHidden(true);
      warning({
        title: `Product tagging isn't available`,
        content: `Any products you've tagged will be removed and won't be shown to viewers.`,
      });
      return false;
    }
    return true;
  }, [refetchProductCatalogueSettings, warning]);

  const renderContent = useCallback(() => {
    if (isChannelLoading || isLoadingMembership) return null;

    if (isDesktop && isPendingPost) return null;

    if (!isDesktop && isPendingPost)
      return (
        <div className={styles.livestreamChatMessageComposer__pendingPost__container}>
          <Typography.Body className={styles.livestreamChatMessageComposer__pendingPost__text}>
            This live stream has started, but with limited visibility until the post has been
            approved.
          </Typography.Body>
        </div>
      );

    if (channel?.isMuted)
      return renderReadOnlyState({
        allowReaction: !isHost,
        message: 'This live stream is now read-only.',
        channel,
      });
    if (
      (isMuted || channel?.metadata?.mutedMembers?.includes(currentUserId)) &&
      channel?.attachedTo?.postId &&
      channel?.attachedTo?.roomId
    )
      return renderReadOnlyState({
        allowReaction: !isHost,
        message: 'You have been muted.',
        channel,
      });

    return (
      <div className={styles.livestreamChatMessageComposer__composeBar__outer}>
        <div
          className={styles.livestreamChatMessageComposer__composeBar__container}
          data-testid={accessibilityId}
          style={themeStyles}
          data-disabled={disabled}
          ref={containerRef}
          data-is-host={isHost && !isPlayer}
        >
          {/* Product tagging button */}
          {!isProductTagButtonHidden && (hasProductTags || isHostOrCoHostWithProductManagement) && (
            <div className={styles.livestreamChatMessageComposer__productTaggingButton__wrapper}>
              {isHostOrCoHostWithProductManagement ? (
                <ActionButton
                  pageId={pageId}
                  componentId={componentId}
                  elementId={'product_tagging_button'}
                  size="large"
                  defaultIcon={<TagOutlined />}
                  isDisabled={disabled}
                  color="secondary"
                  onPress={async () => {
                    if (!(await ensureCatalogueEnabledOrWarn())) return;
                    if (isDesktop) {
                      openPopup({
                        pageId,
                        id: 'manage_product_tagging_popup',
                        view: 'desktop',
                        children: subscribedPost?.postId ? (
                          <LiveManageProductTagListContent
                            postId={subscribedPost.postId}
                            roomId={room?.roomId as string}
                            pageId={pageId}
                            sourceType={AnalyticsSourceTypeEnum.ROOM}
                            onClose={() => closePopup('manage_product_tagging_popup')}
                            onProductCatalogueDisabled={handleProductCatalogueDisabled}
                            onPostUpdate={setLivestreamPost}
                          />
                        ) : null,
                      });
                    } else {
                      setDrawerData({
                        content: subscribedPost?.postId ? (
                          <LiveManageProductTagListContent
                            postId={subscribedPost.postId}
                            roomId={room?.roomId as string}
                            pageId={pageId}
                            sourceType={AnalyticsSourceTypeEnum.ROOM}
                            onClose={removeDrawerData}
                            onProductCatalogueDisabled={handleProductCatalogueDisabled}
                            onPostUpdate={setLivestreamPost}
                          />
                        ) : null,
                      });
                    }
                  }}
                />
              ) : (
                hasProductTags &&
                room &&
                !isHost && (
                  <ActionButton
                    pageId={pageId}
                    componentId={componentId}
                    elementId={'product_tagging_button'}
                    size="large"
                    defaultIcon={<TagOutlined />}
                    isDisabled={disabled}
                    color="secondary"
                    onPress={async () => {
                      if (!(await ensureCatalogueEnabledOrWarn())) return;
                      if (isDesktop) {
                        openPopup({
                          pageId,
                          id: 'product_tag_list_popup',
                          view: 'desktop',
                          children: (
                            <ProductTagList
                              renderMode="livestream"
                              pageId={pageId}
                              displayMode="desktop"
                              onClose={() => {
                                closePopup('product_tag_list_popup');
                              }}
                              productTags={subscribedPost?.productTags as Amity.ProductTag[]}
                              pinnedProductId={pinnedProductId}
                              sourceId={room.roomId}
                            />
                          ),
                        });
                      } else {
                        setDrawerData({
                          content: (
                            <ProductTagList
                              renderMode="livestream"
                              pageId={pageId}
                              displayMode="mobile"
                              onClose={removeDrawerData}
                              productTags={subscribedPost?.productTags as Amity.ProductTag[]}
                              pinnedProductId={pinnedProductId}
                              sourceId={room.roomId}
                            />
                          ),
                        });
                      }
                    }}
                  />
                )
              )}
              {hasProductTags &&
                productCatalogueSettings?.product.enabled &&
                !isProductTagButtonHidden && (
                  <div
                    className={styles.livestreamChatMessageComposer__productTaggingButton__badge}
                  >
                    {subscribedPost?.productTags?.length}
                  </div>
                )}
            </div>
          )}

          {/* Invite coHost */}
          {isHost && !isPlayer && (
            <ActionButton
              pageId={pageId}
              componentId={componentId}
              elementId={'invite_co_host_button'}
              size="large"
              defaultIcon={<AddUser />}
              isDisabled={disabled}
              color="secondary"
              onPress={() => {
                if (isDesktop) {
                  openPopup({
                    pageId,
                    view: 'desktop',
                    header: (
                      <Typography.Headline
                        className={styles.livestreamChatMessageComposer__inviteCoHost__header}
                      >
                        Invite co-host
                      </Typography.Headline>
                    ),
                    children: (
                      <InviteCoHostList
                        pageId={pageId}
                        room={room}
                        onAction={closePopup}
                        coHost={coHost}
                        invitation={invitationByMe}
                      />
                    ),
                  });
                } else {
                  setDrawerData({
                    content: (
                      <InviteCoHostList
                        pageId={pageId}
                        room={room}
                        onAction={removeDrawerData}
                        coHost={coHost}
                        invitation={invitationByMe}
                      />
                    ),
                  });
                }
              }}
            />
          )}
          <div className={styles.livestreamChatMessageComposer__messageComposer__wrapper}>
            <InternalMessageComposer
              ref={editorRef}
              pageId={pageId}
              componentId={componentId}
              setIsEmpty={setIsEmpty}
              setIsSpacebar={setIsSpacebar}
              allowEnterNewLine={false}
              maxCharacters={200}
              maxLines={1}
              scrollable={false}
              isJoinedCommunity={community?.isJoined}
            />
          </div>
          <div className={styles.livestreamChatMessageComposer__sendButton__container}>
            {canReact ? (
              channel?.attachedTo?.postId &&
              channel?.attachedTo?.roomId &&
              renderReactionButton({
                targetId: channel?.attachedTo?.postId,
                roomId: channel?.attachedTo?.roomId,
              })
            ) : (
              <ActionButton
                pageId={pageId}
                componentId={componentId}
                elementId={'create_message_button'}
                onPress={() => {
                  sendMessage();
                }}
                size="large"
                defaultIcon={<ArrowTop />}
                isDisabled={disabled}
                color={!disabled && isFocused ? 'primary' : 'secondary'}
                iconClassName={
                  disabled || !isFocused
                    ? styles.livestreamChatMessageComposer__sendButton__inactiveIcon
                    : undefined
                }
              />
            )}
          </div>
        </div>
      </div>
    );
  }, [
    community?.isJoined,
    isPendingPost,
    isDesktop,
    isEmpty,
    isSpacebar,
    channel?.isMuted,
    isMuted,
    isChannelLoading,
    isLoadingMembership,
    channel?.attachedTo?.postId,
    channel?.attachedTo?.roomId,
    coHost?.userId,
    coHost?.canManageProductTags,
    channel?.metadata?.mutedMembers,
    invitationByMe?.status,
    subscribedPost,
    pinnedProductId,
    isProductTagButtonHidden,
    productCatalogueSettings?.product.enabled,
    isHostOrCoHostWithProductManagement,
    isHost,
    isCoHost,
    isPlayer,
    room,
    hasProductTags,
    canReact,
    isFocused,
    handleProductCatalogueDisabled,
  ]);

  return (
    <>
      <div
        style={themeStyles}
        className={styles.livestreamChatMessageComposer}
        data-testid={accessibilityId}
      >
        {renderContent()}
      </div>
      <div className={styles.livestreamChatMessageComposer__notification__refPosition}>
        {error && (
          <Notification
            duration={3000}
            content={error}
            className={styles.livestreamChatMessageComposer__notification__container}
            icon={
              <ExclamationCircle
                className={styles.livestreamChatMessageComposer__notification__icon}
              />
            }
            onClose={() => {
              setError(null);
            }}
          />
        )}
      </div>
    </>
  );
};

export default LivestreamChatMessageComposer;
