import React, { useCallback, useEffect, useRef, useState } from 'react';
import InternalMessageComposer from '~/v4/chat/internal-components/MessageComposer/MessageComposer';
import styles from './LivestreamChatMessageComposer.module.css';
import { Typography } from '~/v4/core/components';
import ChatMuted from '~/v4/icons/ChatMuted';
import Like from '~/v4/social/elements/ReactionButton/Like';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { ImageIconButton } from '~/v4/core/internal-components/ButtonIcon/ImageIconButton';
import { useCreateMessage } from '~/v4/chat/hooks/useCreateMessage';
import { $getRoot, LexicalEditor } from 'lexical';
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
import useSDK from '~/v4/core/hooks/useSDK';
import { useSearchChannelUser } from '~/v4/chat/hooks/collections/useSearchChannelUser';

interface LivestreamChatMessageComposerProps {
  channelId: Amity.Channel['channelId'];
  postId?: Amity.Post['postId'];
  disabled?: boolean;
  pageId?: string;
  isJoined: boolean;
}

const LIVESTREAM_MESSAGE_MAX_CHARACTOR = 200;

export const LivestreamChatMessageComposer = ({
  pageId = '*',
  channelId,
  postId,
  disabled = false,
  isJoined,
}: LivestreamChatMessageComposerProps) => {
  const componentId = 'livestream_chat_compose_bar';
  const editorRef = useRef<LexicalEditor | null>(null);
  const { channel, loading: isChannelLoading } = useChannel({ channelId });

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
              pageId={pageId}
              componentId={componentId}
              onReactionClick={() => openPopover()}
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
    ({ message, targetId, streamId }: { message: string; targetId: string; streamId: string }) => {
      return (
        <div className={styles.livestreamChatMessageComposer__mute__container}>
          <ChatMuted className={styles.livestreamChatMessageComposer__mute__icon} />
          <Typography.Body className={styles.livestreamChatMessageComposer__mute__text}>
            {message}
          </Typography.Body>
          {renderReactionButton({
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
  };

  const renderContent = useCallback(() => {
    if (isChannelLoading || isLoadingMembership) return null;

    if (!isJoined)
      return (
        <div className={styles.livestreamChatMessageComposer__unJoined__container}>
          <Typography.Body className={styles.livestreamChatMessageComposer__unJoined__text}>
            Join community to interact with live stream.
          </Typography.Body>
        </div>
      );

    if (channel?.isMuted && channel?.attachedTo?.postId && channel?.attachedTo?.videoStreamId)
      return renderReadOnlyState({
        message: 'This live stream is now read-only.',
        targetId: channel?.attachedTo?.postId,
        streamId: channel?.attachedTo?.videoStreamId,
      });
    if (isMuted && channel?.attachedTo?.postId && channel?.attachedTo?.videoStreamId)
      return renderReadOnlyState({
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
                onPress={sendMessage}
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
    isEmpty,
    isSpacebar,
    channel?.isMuted,
    isMuted,
    isChannelLoading,
    isLoadingMembership,
    channel?.attachedTo?.postId,
    channel?.attachedTo?.videoStreamId,
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
