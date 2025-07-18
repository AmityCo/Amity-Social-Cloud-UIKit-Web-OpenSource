import React from 'react';
import InternalMessageComposer, {
  type ComposeActionTypes,
} from '~/v4/chat/internal-components/MessageComposer/MessageComposer';

interface MessageComposerProps {
  channel: Amity.Channel;
  composeAction?: ComposeActionTypes;
  disabled?: boolean;
  pageId?: string;
}

export const MessageComposer = ({ pageId = '*', channel, composeAction }: MessageComposerProps) => {
  const componentId = 'message_composer';

  return (
    <InternalMessageComposer
      pageId={pageId}
      composeAction={composeAction}
      componentId={componentId}
    />
  );
};

export default MessageComposer;
