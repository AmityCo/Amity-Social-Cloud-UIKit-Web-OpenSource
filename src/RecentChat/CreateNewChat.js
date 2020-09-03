import React, { useState } from 'react';
import { ChannelRepository, EkoChannelType } from 'eko-sdk';
import Popover from '../commonComponents/Popover';

import {
  CreateIcon,
  CloseIcon,
  CreateNewChatIcon,
  CreationInput,
  CreationContainer,
  CreateNewChatContainer,
} from './styles';

const channelRepo = new ChannelRepository();

const CreateNewChat = () => {
  const [text, setText] = useState('');

  const [isOpen, setIsOpen] = useState(false);
  const open = () => {
    setText('');
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  const create = () => {
    if (!text) return;
    const createChat = channelRepo.createChannel({
      channelId: text,
      type: EkoChannelType.Standard,
      userIds: [],
    });
    createChat.once('dataUpdated', () => {
      close();
    });
  };

  const creation = (
    <CreationContainer>
      <CreationInput
        autoFocus
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') create();
          if (e.key === 'Escape') close();
        }}
      />
      <CreateIcon onClick={create} />
      <CloseIcon onClick={close} />
    </CreationContainer>
  );

  return (
    <Popover isOpen={isOpen} onClickOutside={close} position="left" content={creation}>
      <CreateNewChatContainer onClick={open}>
        <CreateNewChatIcon />
      </CreateNewChatContainer>
    </Popover>
  );
};

export default CreateNewChat;
