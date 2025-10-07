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

interface LivestreamChatMessageComposerProps {
  channelId?: Amity.Channel['channelId'];
  disabled?: boolean;
  pageId?: string;
  isJoined?: boolean;
  isPendingPost?: boolean;
}

const LIVESTREAM_MESSAGE_MAX_CHARACTOR = 200;

type AddLivestreamReactionParams = {
  reaction: string;
  targetId: string;
  streamId: string;
};

export const LivestreamChatMessageComposer = ({
  pageId = '*',
  channelId,
  disabled = false,
  isJoined,
  isPendingPost = false,
}: LivestreamChatMessageComposerProps) => {
  const { handleCommunityProfileBehavior } = useCommunityProfileGlobalBehavior();

  const componentId = 'livestream_chat_compose_bar';
  const editorRef = useRef<LexicalEditor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDesktop } = useResponsive();
  const { currentUserId } = useSDK();

  const { channel, loading: isChannelLoading } = useChannel({ channelId });

  const { info } = useNotifications();

  const [error, setError] = useState<string | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [isSpacebar, setIsSpacebar] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoadingMembership, setIsLoadingMembership] = useState(true);

  const { themeStyles, accessibilityId } = useAmityComponent({
    pageId,
    componentId,
  });

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
    ({ reaction, targetId, streamId }: AddLivestreamReactionParams) => {
      LiveReactionRepository.createReaction({
        referenceId: targetId,
        referenceType: 'post',
        reactionName: reaction,
        streamId,
      });
    },
    [],
  );

  const handleReactionClick = (params: AddLivestreamReactionParams) => {
    return handleCommunityProfileBehavior({
      defaultBehavior: () => onReactionClick(params),
      allowNonMember: false,
      isJoined: isJoined,
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
    ({ targetId, streamId }: { targetId: string; streamId: string }) => {
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
                  streamId,
                })
              }
              onHover={openPopover}
              onLongPress={openPopover}
              hoverDuration={600}
              defaultIcon={() => (
                <Liked className={styles.livestreamChatMessageComposer__reactionButton} />
              )}
            />
          )}
          className={styles.livestreamChatMessageComposer__reactionPopOver}
          crossOffset={-85}
        >
          <ReactionBar targetId={targetId} targetType="post" streamId={streamId} />
        </Popover>
      );
    },
    [],
  );

  const renderReadOnlyState = useCallback(
    ({
      message,
      targetId,
      streamId,
      allowReaction,
    }: {
      message: string;
      targetId: string;
      streamId: string;
      allowReaction?: boolean;
    }) => {
      return (
        <div className={styles.livestreamChatMessageComposer__mute__container}>
          <ChatMuted className={styles.livestreamChatMessageComposer__mute__icon} />
          <Typography.Body className={styles.livestreamChatMessageComposer__mute__text}>
            {message}
          </Typography.Body>
          {allowReaction &&
            renderReactionButton({
              targetId,
              streamId,
            })}
        </div>
      );
    },
    [],
  );

  const sendMessage = () => {
    if (!channel) return;
    if (!editorRef.current) return;
    if (!isJoined) {
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

    if (channel?.isMuted && channel?.attachedTo?.postId && channel?.attachedTo?.videoStreamId)
      return renderReadOnlyState({
        allowReaction: true,
        message: 'This live stream is now read-only.',
        targetId: channel?.attachedTo?.postId,
        streamId: channel?.attachedTo?.videoStreamId,
      });
    if (
      (isMuted || channel?.metadata?.mutedMembers?.includes(currentUserId)) &&
      channel?.attachedTo?.postId &&
      channel?.attachedTo?.videoStreamId
    )
      return renderReadOnlyState({
        allowReaction: true,
        message: 'You have been muted.',
        targetId: channel?.attachedTo?.postId,
        streamId: channel?.attachedTo?.videoStreamId,
      });

    return (
      <>
        <div
          className={styles.livestreamChatMessageComposer__composeBar__container}
          data-testid={accessibilityId}
          style={themeStyles}
          data-disabled={disabled}
          ref={containerRef}
        >
          <InternalMessageComposer
            ref={editorRef}
            pageId={pageId}
            componentId={componentId}
            setIsEmpty={setIsEmpty}
            setIsSpacebar={setIsSpacebar}
            allowEnterNewLine={false}
            maxCharactor={200}
            maxLines={1}
            scrollable={false}
            isJoinedCommunity={isJoined}
          />
          <div className={styles.livestreamChatMessageComposer__sendButton__container}>
            {(isEmpty && channel?.attachedTo?.postId && channel?.attachedTo?.videoStreamId) ||
            (isMuted && channel?.attachedTo?.postId && channel?.attachedTo?.videoStreamId) ? (
              renderReactionButton({
                targetId: channel?.attachedTo?.postId,
                streamId: channel?.attachedTo?.videoStreamId,
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
      </>
    );
  }, [
    isJoined,
    isPendingPost,
    isDesktop,
    isEmpty,
    isSpacebar,
    channel?.isMuted,
    isMuted,
    isChannelLoading,
    isLoadingMembership,
    channel?.attachedTo?.postId,
    channel?.attachedTo?.videoStreamId,
    channel?.metadata?.mutedMembers,
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
