import React, { useState, useEffect } from 'react';
import { MessageRepository } from '@amityco/ts-sdk';
import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components';

import Popover from '~/core/components/Popover';
import Menu, { MenuItem } from '~/core/components/Menu';
import { EllipsisV, Save, Close } from '~/icons';

import styles from './styles.module.css';
import useMessageFlaggedByMe from '~/chat/hooks/useMessageFlaggedByMe';
import useMessageSubscription from '~/social/hooks/useMessageSubscription';
import { useNotifications } from '~/core/providers/NotificationProvider';

const StyledPopover = styled(Popover)<{ align?: string; className?: string }>`
  ${({ align, theme }) => align === 'end' && `color: ${theme.palette.neutral.main};`}
`;

type FlaggingProps = {
  messageId: string;
};

const Flagging = ({ messageId }: FlaggingProps) => {
  const { isFlaggedByMe, flagMessage, unflagMessage } = useMessageFlaggedByMe(messageId);

  useMessageSubscription({
    messageId,
  });

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

type OptionsProps = {
  isIncoming: boolean;
  messageId: string;
  data: string | { text: string };
  isSupportedMessageType: boolean;
  popupContainerRef: React.RefObject<HTMLDivElement>;
};

const Options = ({
  isIncoming,
  messageId,
  data,
  isSupportedMessageType,
  popupContainerRef,
}: OptionsProps) => {
  // const popupContainerRef = useRef();
  const [text, setText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const notification = useNotifications();

  const edit: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const [isOpen, setIsOpen] = useState(false);

  const { formatMessage } = useIntl();

  const open = () => {
    setText(typeof data === 'object' ? data.text : data);
    setIsOpen(true);
    setIsEditing(false);
  };

  const close = () => {
    setIsOpen(false);
  };

  const save = () => {
    MessageRepository.updateMessage(messageId, { data: { text } })
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
        <MenuItem data-testid="message-menu-item-edit" onClick={edit}>
          <FormattedMessage id="message.edit" />
        </MenuItem>
      )}
      {isIncoming && <Flagging messageId={messageId} />}
      {!isIncoming && (
        <MenuItem data-testid="message-menu-item-delete" onClick={deleteMessage}>
          <FormattedMessage id="message.delete" />
        </MenuItem>
      )}
    </Menu>
  );

  const editing = (
    <div className={styles.editingContainer}>
      <input
        className={styles.editingInput}
        data-testid="message-edit-input"
        autoFocus
        value={text}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') save();
          if (e.key === 'Escape') close();
        }}
      />
      <Save
        className={styles.saveIcon}
        data-testid="message-save-button"
        onClick={save}
        width={14}
        height={14}
      />
      <Close className={styles.closeIcon} onClick={close} width={14} height={14} />
    </div>
  );

  return (
    <StyledPopover
      isOpen={isOpen}
      positions={['bottom', 'top']}
      align={isIncoming ? 'start' : 'end'}
      content={isEditing ? editing : menu}
      parentElement={popupContainerRef?.current || undefined}
      onClickOutside={close}
    >
      <div
        data-testid="message-options-button"
        role="button"
        tabIndex={0}
        onClick={open}
        onKeyDown={open}
      >
        <EllipsisV className={styles.messageOptionsIcon} width={11} height={11} />
      </div>
    </StyledPopover>
  );
};

export default Options;
