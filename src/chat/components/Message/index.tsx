import React from 'react';
import { FormattedTime } from 'react-intl';

import { backgroundImage as UserImage } from '~/icons/User';
import UiKitAvatar from '~/core/components/Avatar';

import Options from './Options';
import MessageContent from './MessageContent';

import styles from './styles.module.css';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';

const MessageBody = ({
  isDeleted,
  type,
  isSupportedMessageType,
  isIncoming,
  children,
  ...otherProps
}: {
  isDeleted: boolean;
  type: string;
  isSupportedMessageType: boolean;
  isIncoming: boolean;
  children: React.ReactNode;
  [key: string]: unknown;
}) => {
  if (isDeleted) {
    return (
      <div
        className={`${styles.deletedMessageBody} ${isIncoming ? styles.incoming : styles.outgoing}`}
        data-testid="message-body-deleted"
        {...otherProps}
      >
        {children}
      </div>
    );
  }

  if (!isSupportedMessageType) {
    return (
      <div
        className={styles.unsupportedMessageBody}
        data-testid="message-body-unsupported"
        {...otherProps}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={`${styles.generalMessageBody} ${isIncoming ? styles.incoming : styles.outgoing}`}
      data-testid="message-body-general"
      {...otherProps}
    >
      {children}
    </div>
  );
};

interface MessageProps {
  messageId: string;
  avatar: string;
  type: string;
  data: { text: string } | string;
  createdAt: Date;
  isDeleted?: boolean;
  isIncoming: boolean;
  isConsequent: boolean;
  userDisplayName: string;
  containerRef: React.RefObject<HTMLDivElement>;
}

const Message = ({
  messageId,
  avatar,
  type,
  data,
  createdAt,
  isDeleted,
  isIncoming,
  isConsequent,
  userDisplayName,
  containerRef,
}: MessageProps) => {
  const shouldShowUserName = isIncoming && !isConsequent && userDisplayName;
  const isSupportedMessageType = ['text', 'custom'].includes(type);

  const renderAvatar = () => {
    if (avatar) return <UiKitAvatar avatar={avatar} className={styles.avatar} />;

    return <UiKitAvatar backgroundImage={UserImage} className={styles.avatar} />;
  };

  return (
    <div className={`${styles.messageReservedRow} ${isIncoming ? '' : styles.outgoing}`}>
      <div className={styles.messageWrapper}>
        {isIncoming && (
          <div className={styles.avatarWrapper}>{!isConsequent && renderAvatar()}</div>
        )}

        <div className={styles.messageContainer} data-testid="message">
          {shouldShowUserName && <div className={styles.userName}>{userDisplayName}</div>}
          <MessageBody
            type={type}
            isIncoming={isIncoming}
            isDeleted={isDeleted || false}
            isSupportedMessageType={isSupportedMessageType}
          >
            <MessageContent data={data} type={type} isDeleted={isDeleted} />
            {!isDeleted && (
              <div className={styles.bottomLine}>
                <div className={styles.messageDate}>
                  <FormattedTime value={createdAt} />
                </div>
                <Options
                  messageId={messageId}
                  data={data}
                  isIncoming={isIncoming}
                  isSupportedMessageType={isSupportedMessageType}
                  popupContainerRef={containerRef}
                />
              </div>
            )}
          </MessageBody>
        </div>
      </div>
    </div>
  );
};

export default (props: MessageProps) => {
  const CustomComponentFn = useCustomComponent<MessageProps>('Message');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <Message {...props} />;
};
