import React, { useRef, useState } from 'react';
import styles from './styles.module.css';
import Kebub from '~/v4/icons/Kebub';
import Popover from '~/v4/core/components/Popover';
import Reply from '~/v4/icons/Reply';
import Copy from '~/v4/icons/Copy';
import Bin from '~/v4/icons/Bin';
import { Pin } from '~/v4/icons/Pin';
import Flag from '~/v4/icons/Flag';
import { Typography } from '~/v4/core/components';

export type MessageActionType = {
  onCopy?: () => void;
  onFlag?: () => void;
  onUnflag?: () => void;
  onDelete?: () => void;
  onReply?: () => void;
  onMention?: () => void;
  onPin?: () => void;
};

interface MessageActionProps {
  isOwner: boolean;
  isModerator: boolean;
  isFlagged?: boolean;
  action: MessageActionType;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const MessageAction = ({
  isOwner,
  isModerator,
  isFlagged,
  action,
  containerRef,
}: MessageActionProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const clickMeButtonRef = useRef<HTMLDivElement | null>(null);

  const onCopyMessage = () => {
    action.onCopy && action.onCopy();
    setIsPopoverOpen(false);
  };

  const onReplyMessage = () => {
    action.onReply && action.onReply();
    setIsPopoverOpen(false);
  };

  const onDeleteMessage = () => {
    action.onDelete && action.onDelete();
    setIsPopoverOpen(false);
  };

  const onFlagMessage = () => {
    action.onFlag && action.onFlag();
    setIsPopoverOpen(false);
  };

  const onUnFlagMessage = () => {
    action.onUnflag && action.onUnflag();
    setIsPopoverOpen(false);
  };

  const onPinMessage = () => {
    action.onPin && action.onPin();
    setIsPopoverOpen(false);
  };

  return (
    <>
      <Popover
        positions={['bottom', 'top']}
        onClickOutside={() => setIsPopoverOpen(false)}
        isOpen={isPopoverOpen}
        align="start"
        parentElement={containerRef?.current || undefined}
        containerClassName={styles.optionContainer}
        content={
          <>
            <div className={styles.messageActionButton} onClick={onReplyMessage}>
              <Reply className={styles.replyIcon} />
              <div className={styles.messageActionButtonText}>
                <Typography.Body>Reply</Typography.Body>
              </div>
            </div>
            <div className={styles.messageActionButton} onClick={onCopyMessage}>
              <Copy className={styles.copyIcon} />
              <div className={styles.messageActionButtonText}>
                <Typography.Body>Copy</Typography.Body>
              </div>
            </div>
            {/* TODO: release 1.1 hide these action, will be implement in release 1.2 */}
            {/* {!isOwner || (
              <div
                className={styles.messageActionButton}
                onClick={() => {
                  onMention && onMention();
                }}
              >
                <div
                  className={clsx(styles.messageActionButtonText, typography.ascTypograyphyBody)}
                >
                  {formatMessage({ id: 'livechat.messageBubble.mention.button' })}
                </div>
                <Mention className={styles.mentionIcon} />
              </div>
            )} */}
            {(isModerator || !isOwner) && (
              <div
                className={styles.messageActionButton}
                onClick={isFlagged ? onUnFlagMessage : onFlagMessage}
              >
                <Flag className={styles.flagIcon} />
                <div className={styles.messageDangerActionButtonText}>
                  <Typography.Body>{isFlagged ? 'Unreport' : 'Report'}</Typography.Body>
                </div>
              </div>
            )}
            {(isOwner || isModerator) && (
              <div className={styles.messageActionButton} onClick={onDeleteMessage}>
                <Bin className={styles.binIcon} />
                <div className={styles.messageDangerActionButtonText}>
                  <Typography.Body>Delete</Typography.Body>
                </div>
              </div>
            )}
            {isModerator && (
              <div className={styles.messageActionButton} onClick={onPinMessage}>
                <Pin className={styles.pinIcon} />
                <div className={styles.messageActionButtonText}>
                  <Typography.Body>Pin</Typography.Body>
                </div>
              </div>
            )}
          </>
        }
      >
        <div
          className={styles.optionButton}
          ref={clickMeButtonRef}
          onClick={() => {
            setIsPopoverOpen(!isPopoverOpen);
          }}
        >
          <Kebub className={styles.optionIcon} />
        </div>
      </Popover>
      {/* <Reaction className={styles.reactionIcon} /> */}
    </>
  );
};
