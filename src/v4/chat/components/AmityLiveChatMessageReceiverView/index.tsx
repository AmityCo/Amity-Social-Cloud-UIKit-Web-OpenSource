import React from 'react';
import useUser from '~/core/hooks/useUser';
import useImage from '~/core/hooks/useImage';
import LiveChatMessageContent from '../LiveChatMessageContent';
import { AmityMessageActionType } from '../LiveChatMessageContent/MessageAction';

interface AmityLiveChatMessageReceiverViewProps {
  pageId?: string;
  componentId?: string;
  message: Amity.Message;
  containerRef: React.RefObject<HTMLDivElement>;
  action: AmityMessageActionType;
}

export const AmityLiveChatMessageReceiverView = ({
  pageId = '*',
  componentId = '*',
  message,
  containerRef,
  action,
}: AmityLiveChatMessageReceiverViewProps) => {
  const user = useUser(message.creatorId);
  const avatarFileUrl = useImage({ fileId: user?.avatarFileId, imageSize: 'small' });

  return (
    <LiveChatMessageContent
      pageId={pageId}
      componentId={componentId}
      message={message as Amity.Message<'text'>}
      userDisplayName={user?.displayName}
      avatarUrl={avatarFileUrl}
      containerRef={containerRef}
      action={action}
    />
  );
};

export default AmityLiveChatMessageReceiverView;
