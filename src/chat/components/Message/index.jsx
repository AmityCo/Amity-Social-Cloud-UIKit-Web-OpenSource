import React from 'react';
import PropTypes from 'prop-types';
import { FormattedTime } from 'react-intl';
import { MessageType } from '@amityco/js-sdk';

import customizableComponent from '~/core/hocs/customization';
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

const MessageBody = ({ isDeleted, type, isSupportedMessageType, ...otherProps }) => {
  if (isDeleted) {
    return <DeletedMessageBody {...otherProps} data-qa-anchor="message-body-deleted" />;
  }

  if (!isSupportedMessageType) {
    return <UnsupportedMessageBody {...otherProps} data-qa-anchor="message-body-unsupported" />;
  }

  return <GeneralMessageBody {...otherProps} data-qa-anchor="message-body-general" />;
};

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
}) => {
  const shouldShowUserName = isIncoming && !isConsequent && userDisplayName;
  const isSupportedMessageType = [MessageType.Text, MessageType.Custom].includes(type);

  const getAvatarProps = () => {
    if (avatar) return { avatar };
    return { backgroundImage: UserImage };
  };

  return (
    <MessageReservedRow isIncoming={isIncoming}>
      <MessageWrapper>
        {isIncoming && (
          <AvatarWrapper>{!isConsequent && <Avatar {...getAvatarProps()} />}</AvatarWrapper>
        )}

        <MessageContainer data-qa-anchor="message">
          {shouldShowUserName && <UserName>{userDisplayName}</UserName>}
          <MessageBody
            type={type}
            isIncoming={isIncoming}
            isDeleted={isDeleted}
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

Message.propTypes = {
  messageId: PropTypes.string.isRequired,
  type: PropTypes.oneOf(Object.values(MessageType)).isRequired,
  data: PropTypes.object.isRequired,
  createdAt: PropTypes.instanceOf(Date),
  userDisplayName: PropTypes.string,
  isDeleted: PropTypes.bool,
  isIncoming: PropTypes.bool,
  isConsequent: PropTypes.bool,
  avatar: PropTypes.string,
  containerRef: PropTypes.object.isRequired,
};

Message.defaultProps = {
  userDisplayName: '',
  avatar: '',
  isDeleted: false,
  isIncoming: false,
  isConsequent: false,
};

export default customizableComponent('Message', Message);
