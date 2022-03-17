import React, { useState, useEffect } from 'react';
import { MessageEditorRepository, MessageFlagRepository } from '@amityco/js-sdk';
import { FormattedMessage, useIntl } from 'react-intl';

import Popover from '~/core/components/Popover';
import Menu, { MenuItem } from '~/core/components/Menu';
import { notification } from '~/core/components/Notification';

import { MessageOptionsIcon, SaveIcon, CloseIcon, EditingInput, EditingContainer } from './styles';

const Flagging = ({ messageId }) => {
  const [isFlaggedByMe, setIsFlaggedByMe] = useState(null);
  const [flagRepo, setFlagRepo] = useState(null);

  useEffect(() => {
    if (!messageId) return;
    const flagRepository = new MessageFlagRepository(messageId);
    setFlagRepo(flagRepository);
    flagRepository.isFlaggedByMe().then(setIsFlaggedByMe);
  }, [messageId]);

  const flagMessage = () => {
    if (!flagRepo) return;

    flagRepo.flag().then(() => {
      setIsFlaggedByMe(true);
    });
  };

  const unflagMessage = () => {
    if (!flagRepo) return;

    flagRepo.unflag().then(() => {
      setIsFlaggedByMe(false);
    });
  };

  if (isFlaggedByMe === null) return null;

  return isFlaggedByMe ? (
    <MenuItem onClick={unflagMessage}>
      <FormattedMessage id="message.unflag" />
    </MenuItem>
  ) : (
    <MenuItem onClick={flagMessage}>
      <FormattedMessage id="message.flag" />
    </MenuItem>
  );
};

const Options = ({ isIncoming, messageId, data, isSupportedMessageType }) => {
  const [text, setText] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const edit = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const [isOpen, setIsOpen] = useState(false);

  const { formatMessage } = useIntl();

  const open = () => {
    setText(data.text || data);
    setIsOpen(true);
    setIsEditing(false);
  };

  const close = () => {
    setIsOpen(false);
  };

  const save = () => {
    const editor = new MessageEditorRepository(messageId);
    editor
      .editText(text)
      .catch(() => {
        notification.error({
          content: formatMessage({ id: 'message.saveOptionsError' }),
        });
      })
      .then(close);
  };

  const deleteMessage = () => {
    const editor = new MessageEditorRepository(messageId);
    editor.delete().then(close);
  };

  const menu = (
    <Menu>
      {!isIncoming && isSupportedMessageType && (
        <MenuItem onClick={edit}>
          <FormattedMessage id="message.edit" />
        </MenuItem>
      )}
      {isIncoming && <Flagging messageId={messageId} />}
      {!isIncoming && (
        <MenuItem onClick={deleteMessage}>
          <FormattedMessage id="message.delete" />
        </MenuItem>
      )}
    </Menu>
  );

  const editing = (
    <EditingContainer>
      <EditingInput
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
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
      position="bottom"
      align={isIncoming ? 'start' : 'end'}
      content={isEditing ? editing : menu}
      onClickOutside={close}
    >
      <div role="button" tabIndex={0} onClick={open} onKeyDown={open}>
        <MessageOptionsIcon />
      </div>
    </Popover>
  );
};

export default Options;
