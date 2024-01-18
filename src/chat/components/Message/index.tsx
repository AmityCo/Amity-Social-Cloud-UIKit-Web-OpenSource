import React from 'react';
import { FormattedTime } from 'react-intl';

import { backgroundImage as UserImage } from '~/icons/User';

import Options from './Options';
import MessageContent from './MessageContent';

import {
  Avatar,
  AvatarWrapper,
  MessageReservedRow,
  MessageWrapper,
  MessageContainer,
  GeneralMessageBody,
  DeletedMessageBody,
  UnsupportedMessageBody,
  UserName,
  BottomLine,
  MessageDate,
} from './styles';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';

const MessageBody = ({
  isDeleted,
  type,
  isSupportedMessageType,
  ...otherProps
}: {
  isDeleted: boolean;
  type: string;
  isSupportedMessageType: boolean;
  [key: string]: unknown;
}) => {
  if (isDeleted) {
    return <DeletedMessageBody {...otherProps} data-qa-anchor="message-body-deleted" />;
  }

  if (!isSupportedMessageType) {
    return <UnsupportedMessageBody {...otherProps} data-qa-anchor="message-body-unsupported" />;
  }

  return <GeneralMessageBody {...otherProps} data-qa-anchor="message-body-general" />;
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
    if (avatar) return <Avatar avatar={avatar} />;

    return <Avatar backgroundImage={UserImage} />;
  };

  return (
    <MessageReservedRow isIncoming={isIncoming}>
      <MessageWrapper>
        {isIncoming && <AvatarWrapper>{!isConsequent && renderAvatar()}</AvatarWrapper>}

        <MessageContainer data-qa-anchor="message">
          {shouldShowUserName && <UserName>{userDisplayName}</UserName>}
          <MessageBody
            type={type}
            isIncoming={isIncoming}
            isDeleted={isDeleted || false}
            isSupportedMessageType={isSupportedMessageType}
          >
            <MessageContent data={data} type={type} isDeleted={isDeleted} />
            {!isDeleted && (
              <BottomLine>
                <MessageDate>
                  <FormattedTime value={createdAt} />
                </MessageDate>
                <Options
                  messageId={messageId}
                  data={data}
                  isIncoming={isIncoming}
                  isSupportedMessageType={isSupportedMessageType}
                  popupContainerRef={containerRef}
                />
              </BottomLine>
            )}
          </MessageBody>
        </MessageContainer>
      </MessageWrapper>
    </MessageReservedRow>
  );
};

export default (props: MessageProps) => {
  const CustomComponentFn = useCustomComponent<MessageProps>('Message');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <Message {...props} />;
};
