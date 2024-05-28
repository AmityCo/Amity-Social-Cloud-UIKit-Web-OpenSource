import React from 'react';
import useUser from '~/core/hooks/useUser';
import useImage from '~/core/hooks/useImage';
import LiveChatMessageContent from '../LiveChatMessageContent';
import { AmityMessageActionType } from '../LiveChatMessageContent/MessageAction';

interface AmityLiveChatMessageSenderViewProps {
  pageId?: string;
  componentId?: string;
  message: Amity.Message;
  containerRef: React.RefObject<HTMLDivElement>;
  action?: AmityMessageActionType;
}

export const AmityLiveChatMessageSenderView = ({
  pageId = '*',
  componentId = '*',
  message,
  containerRef,
  action,
}: AmityLiveChatMessageSenderViewProps) => {
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
    />
  );
};

export default AmityLiveChatMessageSenderView;
