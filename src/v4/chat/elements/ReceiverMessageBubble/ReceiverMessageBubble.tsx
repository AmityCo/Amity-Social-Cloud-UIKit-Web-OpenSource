import React from 'react';
import LiveChatMessageContent from '~/v4/chat/internal-components/LiveChatMessageContent';
import { MessageActionType } from '~/v4/chat/internal-components/LiveChatMessageContent/MessageAction';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { useImage } from '~/v4/core/hooks/useImage';

interface ReceiverMessageBubbleProps {
  pageId?: string;
  componentId?: string;
  message: Amity.Message;
  containerRef: React.RefObject<HTMLDivElement>;
  action: MessageActionType;
}

export const ReceiverMessageBubble = ({
  pageId = '*',
  componentId = '*',
  message,
  containerRef,
  action,
}: ReceiverMessageBubbleProps) => {
  const elementId = 'receiver_message_bubble';
  const { user } = useUser(message.creatorId);
  const avatarFileUrl = useImage({ fileId: user?.avatarFileId, imageSize: 'small' });

  return (
    <LiveChatMessageContent
      pageId={pageId}
      componentId={componentId}
      elementId={elementId}
      message={message as Amity.Message<'text'>}
      userDisplayName={user?.displayName}
      avatarUrl={avatarFileUrl}
      containerRef={containerRef}
      action={action}
    />
  );
};
