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
import { InviteCoHostList } from '~/v4/social/features/livestream/internal-components/InviteCoHostList';
import { useLivestreamData } from '~/v4/social/features/livestream/providers';
import { TagOutlined } from '~/v4/icons/TagOutlined';
import { ManageProductTagList } from '~/v4/social/features/product-tagged/components/ManageProductTagList';
import useTaggingProduct from '~/v4/social/hooks/useTaggingProduct';
import { usePostSubscription } from '~/v4/social/features/livestream/hooks';
import { ProductTagList } from '~/v4/social/features/product-tagged/components/ProductTagList';
import { AnalyticsSourceTypeEnum } from '@amityco/ts-sdk';

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
    livestreamPost: livestreamPostFromContext,
  } = useLivestreamData();
  const { handleCommunityProfileBehavior } = useCommunityProfileGlobalBehavior();
  const { success, info } = useNotifications();

  const componentId = 'livestream_chat_compose_bar';
  const editorRef = useRef<LexicalEditor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDesktop } = useResponsive();

  const { channel, loading: isChannelLoading } = useChannel({ channelId });
  const { currentUserId } = useSDK();

  const { openPopup, closePopup } = usePopupContext();

  const isHost = hostId === currentUserId;
  const isCoHost = coHostId === currentUserId;

  const canManageProducts = isHost || (isCoHost && coHost?.canManageProductTags);

  const [livestreamPost, setLivestreamPost] = useState(
    isHost ? livestreamPostFromContext?.childrenPosts[0] : livestreamPostFromContext,
  );
  const { post: subscribedPost } = usePostSubscription(livestreamPost?.postId);
  const pinnedProductId = subscribedPost?.pinnedProductId;

  const [error, setError] = useState<string | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [isSpacebar, setIsSpacebar] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoadingMembership, setIsLoadingMembership] = useState(true);

  const [isShowPinnedProduct, setIsShowPinnedProduct] = useState(!!pinnedProductId);

  const hasProductTags = subscribedPost?.productTags && subscribedPost?.productTags.length > 0;

  useEffect(() => {
    setIsShowPinnedProduct(!!pinnedProductId);
  }, [pinnedProductId]);

  useEffect(() => {
    if (livestreamPost?.postId) return;
    if (room?.roomId && room.post) setLivestreamPost(room.post as Amity.Post);
  }, [room, subscribedPost?.productTags, pinnedProductId]);

  const { pinProduct, unpinProduct, isPinning, isUnpinning, updateProductTags } =
    useTaggingProduct();

  const { themeStyles, accessibilityId } = useAmityComponent({
    pageId,
    componentId,
  });

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

    return () => {
      container.removeEventListener('touchstart', handleContainerTouch, true);
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
          {!hasProductTags && !canManageProducts ? null : (
            <div className={styles.livestreamChatMessageComposer__productTaggingButton__wrapper}>
              {canManageProducts ? (
                <ActionButton
                  pageId={pageId}
                  componentId={componentId}
                  elementId={'product_tagging_button'}
                  size="large"
                  defaultIcon={<TagOutlined />}
                  isDisabled={disabled}
                  color="secondary"
                  onPress={() =>
                    openPopup({
                      pageId,
                      id: 'manage_product_tagging_popup',
                      view: 'desktop',
                      children: (
                        <ManageProductTagList
                          pageId={pageId}
                          sourceType={AnalyticsSourceTypeEnum.ROOM}
                          sourceId={room?.roomId as string}
                          renderMode="livestream"
                          productTags={subscribedPost?.productTags}
                          onClose={() => {
                            closePopup('manage_product_tagging_popup');
                          }}
                          pinnedProductId={pinnedProductId}
                          onRemove={async (productTag) => {
                            // Handle product removal - no success toast
                            if (subscribedPost?.postId) {
                              const updatedTags = subscribedPost?.productTags?.filter(
                                (tag) => tag.productId !== productTag.productId,
                              );
                              try {
                                await updateProductTags({
                                  postId: subscribedPost?.postId,
                                  productTags: updatedTags || [],
                                });
                                success({ content: 'Product tag removed.' });
                              } catch (error) {
                                info({
                                  content: 'Failed to remove product tag. Please try again.',
                                });
                              }
                            }
                          }}
                          onUpdateProductTags={async (tags) => {
                            if (subscribedPost?.postId) {
                              try {
                                await updateProductTags({
                                  postId: subscribedPost?.postId,
                                  productTags: tags,
                                });
                                success({ content: 'Product tags added.' });
                              } catch (error) {
                                info({ content: 'Failed to add product tags. Please try again.' });
                              }
                            }
                          }}
                          onPinnedProductIdChange={async (productId) => {
                            if (subscribedPost?.postId) {
                              if (productId) {
                                // Only pin if the product ID has changed
                                if (productId !== pinnedProductId) {
                                  await pinProduct({
                                    postId: subscribedPost?.postId,
                                    productId,
                                  });
                                }
                              } else {
                                // Unpin the product (when toggling pin off, not removing)
                                await unpinProduct(subscribedPost?.postId);
                              }
                            }
                          }}
                          isPinning={isPinning}
                          isUnpinning={isUnpinning}
                        />
                      ),
                    })
                  }
                />
              ) : (
                hasProductTags && (
                  <ActionButton
                    pageId={pageId}
                    componentId={componentId}
                    elementId={'product_tagging_button'}
                    size="large"
                    defaultIcon={<TagOutlined />}
                    isDisabled={disabled}
                    color="secondary"
                    onPress={() =>
                      openPopup({
                        pageId,
                        id: 'product_tag_list_popup',
                        view: 'desktop',
                        children: (
                          <ProductTagList
                            mode="livestream"
                            pageId={pageId}
                            displayMode="desktop"
                            onClose={() => {
                              closePopup('product_tag_list_popup');
                            }}
                            productTags={subscribedPost?.productTags as Amity.ProductTag[]}
                            pinnedProductId={pinnedProductId}
                          />
                        ),
                      })
                    }
                  />
                )
              )}
              {hasProductTags && (
                <div className={styles.livestreamChatMessageComposer__productTaggingButton__badge}>
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
              onPress={() =>
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
                })
              }
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
    channel?.metadata?.mutedMembers,
    invitationByMe?.status,
    subscribedPost?.productTags,
    pinnedProductId,
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
