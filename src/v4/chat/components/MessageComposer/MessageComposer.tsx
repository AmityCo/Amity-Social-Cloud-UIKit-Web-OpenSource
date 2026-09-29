import React from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
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
  // Owned by a module and never asked — the component kept rendering
  // after its module was switched off.
  const { isExcluded } = useAmityComponent({ pageId, componentId });

  if (isExcluded) return null;

  return (
    <InternalMessageComposer
      pageId={pageId}
      composeAction={composeAction}
      componentId={componentId}
    />
  );
};

export default MessageComposer;
