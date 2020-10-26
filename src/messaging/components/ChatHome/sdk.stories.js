import React from 'react';

import UiKitChat from '.';
import UiKitMessage from '~/messaging/components/Message';

export default {
  title: 'SDK Connected/Messaging/Channel',
};

const CustomMessage = props => (
  <div>
    original message with header
    <UiKitMessage {...props} />
  </div>
);

export const Chat = ({ useCustomMessage }) => {
  const Message = useCustomMessage ? CustomMessage : UiKitMessage;
  return <UiKitChat customComponents={{ Message }} />;
};

Chat.args = {
  useCustomMessage: false,
};

Chat.argsType = {
  useCustomMessage: { control: { type: 'boolean' } },
};
