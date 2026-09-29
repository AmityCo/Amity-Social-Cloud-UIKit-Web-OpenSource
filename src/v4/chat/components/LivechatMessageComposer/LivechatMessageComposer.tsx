import React, { useCallback } from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
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
  // Owned by a module and never asked — the component kept rendering
  // after its module was switched off.
  const { isExcluded } = useAmityComponent({ pageId, componentId });

  if (isExcluded) return null;

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
