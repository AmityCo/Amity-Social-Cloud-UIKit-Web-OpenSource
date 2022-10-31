import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import { MessageRepository } from '@amityco/js-sdk';
import { FormattedMessage, useIntl } from 'react-intl';

import Popover from '~/core/components/Popover';
import Menu, { MenuItem } from '~/core/components/Menu';
import { notification } from '~/core/components/Notification';

import { MessageOptionsIcon, SaveIcon, CloseIcon, EditingInput, EditingContainer } from './styles';

const StyledPopover = styled(Popover)`
  ${({ align, theme }) => align === 'end' && `color: ${theme.palette.neutral.main};`}
`;

const Flagging = ({ messageId }) => {
  const [isFlaggedByMe, setIsFlaggedByMe] = useState(null);
  useEffect(() => {
    if (!messageId) return;
    MessageRepository.isFlaggedByMe(messageId).then(setIsFlaggedByMe);
  }, [messageId]);

  const flagMessage = () => {
    MessageRepository.flag(messageId).then(() => {
      setIsFlaggedByMe(true);
    });
  };

  const unflagMessage = () => {
    MessageRepository.unflag(messageId).then(() => {
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

const Options = ({ isIncoming, messageId, data, isSupportedMessageType, popupContainerRef }) => {
  // const popupContainerRef = useRef();
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
    MessageRepository.updateMessage({ messageId, data: { text } })
      .then(close)
      .catch(() => {
        notification.error({
          content: formatMessage({ id: 'message.saveOptionsError' }),
        });
      });
  };

  const deleteMessage = () => {
    MessageRepository.deleteMessage(messageId).then(close);
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
    <StyledPopover
      isOpen={isOpen}
      positions={['bottom', 'top']}
      align={isIncoming ? 'start' : 'end'}
      content={isEditing ? editing : menu}
      parentElement={popupContainerRef.current}
      onClickOutside={close}
    >
      <div role="button" tabIndex={0} onClick={open} onKeyDown={open}>
        <MessageOptionsIcon />
      </div>
    </StyledPopover>
  );
};

export default Options;
