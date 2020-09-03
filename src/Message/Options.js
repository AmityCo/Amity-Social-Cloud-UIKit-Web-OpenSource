import React, { useState, useEffect } from 'react';
import { MessageEditorRepository, MessageFlagRepository } from 'eko-sdk';

import Popover from '../commonComponents/Popover';
import Menu, { MenuItem } from '../commonComponents/Menu';

import { MessageOptionsIcon, SaveIcon, CloseIcon, EditingInput, EditingContainer } from './styles';

const Flagging = ({ message: { messageId } = {} }) => {
  const [isFlaggedByMe, setIsFlaggedByMe] = useState(null);
  const [flagRepo, setFlagRepo] = useState(null);

  useEffect(() => {
    if (!messageId) return;
    const flagRepository = new MessageFlagRepository(messageId);
    setFlagRepo(flagRepository);
    flagRepository.isFlaggedByMe().then(setIsFlaggedByMe);
  }, [messageId]);

  const flagMessage = id => {
    flagRepo.flag({ messageId: id }).then(() => {
      setIsFlaggedByMe(true);
    });
  };

  const unflagMessage = id => {
    flagRepo.unflag({ messageId: id }).then(() => {
      setIsFlaggedByMe(false);
    });
  };

  if (isFlaggedByMe === null) return null;

  return isFlaggedByMe ? (
    <MenuItem onClick={unflagMessage}>unflag</MenuItem>
  ) : (
    <MenuItem onClick={flagMessage}>flag</MenuItem>
  );
};

const Options = ({ incoming, message }) => {
  const [text, setText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const edit = e => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const [isOpen, setIsOpen] = useState(false);
  const open = () => {
    setText(message.data.text);
    setIsOpen(true);
    setIsEditing(false);
  };
  const close = () => {
    setIsOpen(false);
  };

  const save = () => {
    const editor = new MessageEditorRepository(message.messageId);
    editor
      .editText(text)
      .catch(() => {
        message.error('There was an error processing your request');
      })
      .then(close);
  };

  const deleteMessage = () => {
    const editor = new MessageEditorRepository(message.messageId);
    editor.delete().then(close);
  };

  const menu = (
    <Menu>
      {!incoming && <MenuItem onClick={edit}>edit</MenuItem>}
      {incoming && <Flagging message={message} />}
      <MenuItem onClick={deleteMessage}>delete</MenuItem>
    </Menu>
  );

  const editing = (
    <EditingContainer>
      <EditingInput
        autoFocus
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') save();
          if (e.key === 'Escape') close();
        }}
      />
      <SaveIcon onClick={save} />
      <CloseIcon onClick={close} />
    </EditingContainer>
  );

  return (
    <Popover
      isOpen={isOpen}
      onClickOutside={close}
      position="bottom"
      align={incoming ? 'start' : 'end'}
      content={isEditing ? editing : menu}
    >
      <div role="button" tabIndex={0} onClick={open} onKeyDown={open}>
        <MessageOptionsIcon />
      </div>
    </Popover>
  );
};

export default Options;
