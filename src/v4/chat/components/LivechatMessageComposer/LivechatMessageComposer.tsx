import React, { useCallback } from 'react';
import InternalMessageComposer from '~/v4/chat/internal-components/MessageComposer/MessageComposer';
interface LivechatMessageComposerProps {
  channel: Amity.Channel;
  disabled?: boolean;
  pageId?: string;
  isJoined: boolean;
}

export const LivechatMessageComposer = ({
  pageId = '*',
  channel,
  disabled = false,
  isJoined,
}: LivechatMessageComposerProps) => {
  const componentId = 'livechat_message_composer';

  return (
    <InternalMessageComposer
      pageId={pageId}
      channel={channel}
      disabled={disabled}
      componentId={componentId}
    />
  );
};

export default LivechatMessageComposer;
