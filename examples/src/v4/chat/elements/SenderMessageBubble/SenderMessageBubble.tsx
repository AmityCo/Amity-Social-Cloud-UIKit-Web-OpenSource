import React from 'react';
import useUser from '~/core/hooks/useUser';
import useImage from '~/core/hooks/useImage';
import LiveChatMessageContent from '~/v4/chat/internal-components/LiveChatMessageContent';
import { MessageActionType } from '~/v4/chat/internal-components/LiveChatMessageContent/MessageAction';

interface SenderMessageBubbleProps {
  pageId?: string;
  componentId?: string;
  message: Amity.Message;
  containerRef: React.RefObject<HTMLDivElement>;
  action?: MessageActionType;
}

export const SenderMessageBubble = ({
  pageId = '*',
  componentId = '*',
  message,
  containerRef,
  action,
}: SenderMessageBubbleProps) => {
  const elementId = 'sender_message_bubble';
  const user = useUser(message.creatorId);
  const avatarFileUrl = useImage({ fileId: user?.avatarFileId, imageSize: 'small' });

  return (
    <LiveChatMessageContent
      message={message as Amity.Message<'text'>}
      userDisplayName={user?.displayName}
      avatarUrl={avatarFileUrl}
      containerRef={containerRef}
      action={action}
      pageId={pageId}
      componentId={componentId}
      elementId={elementId}
    />
  );
};
