import React from 'react';
import { FormattedTime } from 'react-intl';

import { customizableComponent } from 'hocs/customization';

import Linkify from 'components/Linkify';

import Options from './Options';

import {
  Avatar,
  AvatarWrapper,
  MessageWrapper,
  MessageContainer,
  MessageBody,
  UserName,
  BottomLine,
  MessageDate,
  SystemMessageContainer,
} from './styles';

const DeletedMessage = () => <SystemMessageContainer>deleted</SystemMessageContainer>;

const MessageContent = ({ message: { data, type, isDeleted } }) => {
  if (isDeleted) return <DeletedMessage />;
  switch (type) {
    case 'text':
      return <Linkify>{data.text}</Linkify>;
    case 'custom':
      return JSON.stringify(data);

    case 'image':
    case 'file':
    default:
      return <SystemMessageContainer>Unsupported message format</SystemMessageContainer>;
  }
};

const Message = ({ message, message: { createdAt, user }, consequent, incoming }) => {
  const { displayName } = user.model;

  return (
    <MessageWrapper incoming={incoming}>
      {incoming && <AvatarWrapper>{!consequent && <Avatar />}</AvatarWrapper>}
      <MessageContainer>
        {incoming && !consequent && <UserName>{displayName}</UserName>}
        <MessageBody incoming={incoming}>
          <MessageContent message={message} />
          <BottomLine>
            <MessageDate>
              <FormattedTime value={createdAt} />
            </MessageDate>
            {!message.isDeleted && <Options incoming={incoming} message={message} />}
          </BottomLine>
        </MessageBody>
      </MessageContainer>
    </MessageWrapper>
  );
};

export default customizableComponent('Message', Message);
