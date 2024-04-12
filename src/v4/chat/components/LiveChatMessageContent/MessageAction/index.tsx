import React, { useRef } from 'react';
import styles from './styles.module.css';
import Kebub from '~/v4/icons/Kebub';
import Reaction from '~/v4/icons/Reaction';
import { useIntl } from 'react-intl';
import Popover from '~/v4/core/components/Popover';
import Reply from '~/v4/icons/Reply';
import Copy from '~/v4/icons/Copy';
import Bin from '~/v4/icons/Bin';
import { Typography } from '~/v4/core/components';
import clsx from 'clsx';

export type AmityMessageActionType = {
  onCopy?: () => void;
  onFlag?: () => void;
  onDelete?: () => void;
  onReply?: () => void;
  onMention?: () => void;
};

interface MessageActionProps {
  isOwner: boolean;
  isModerator: boolean;
  action: AmityMessageActionType;
  containerRef: React.RefObject<HTMLDivElement>;
}

const MessageAction = ({ isOwner, isModerator, action, containerRef }: MessageActionProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const { formatMessage } = useIntl();
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

  return (
    <>
      <Popover
        positions={['bottom', 'top']}
        onClickOutside={() => setIsPopoverOpen(false)}
        isOpen={isPopoverOpen}
        align="start"
        parentElement={containerRef?.current || undefined}
        content={
          <>
            <div className={styles.messageActionButton} onClick={onReplyMessage}>
              <div className={styles.messageActionButtonText}>
                <Typography.Body>
                  {formatMessage({ id: 'livechat.messageBubble.reply.button' })}
                </Typography.Body>
              </div>
              <Reply className={styles.replyIcon} />
            </div>
            <div className={styles.messageActionButton} onClick={onCopyMessage}>
              <div className={styles.messageActionButtonText}>
                <Typography.Body>
                  {formatMessage({ id: 'livechat.messageBubble.copy.button' })}
                </Typography.Body>
              </div>
              <Copy className={styles.copyIcon} />
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
            {/* {(isModerator && !isOwner) || (
              <div className={styles.messageActionButton}>
                <div
                  className={clsx(
                    styles.messageDangerActionButtonText,
                    typography.ascTypograyphyBody,
                  )}
                >
                  {formatMessage({ id: 'livechat.messageBubble.report.button' })}
                </div>
                <Flag
                  className={styles.flagIcon}
                  onClick={() => {
                    onFlag && onFlag();
                  }}
                />
              </div>
            )} */}
            {(isOwner || isModerator) && (
              <div className={styles.messageActionButton} onClick={onDeleteMessage}>
                <div className={styles.messageDangerActionButtonText}>
                  <Typography.Body>
                    {formatMessage({ id: 'livechat.messageBubble.delete.button' })}
                  </Typography.Body>
                </div>
                <Bin className={styles.binIcon} />
              </div>
            )}
          </>
        }
      >
        <div
          className={styles.optionIcon}
          ref={clickMeButtonRef}
          onClick={() => {
            setIsPopoverOpen(!isPopoverOpen);
          }}
        >
          <Kebub />
        </div>
      </Popover>
      {/* <Reaction className={styles.reactionIcon} /> */}
    </>
  );
};

export default MessageAction;
