import React from 'react';
import { FormattedTime } from 'react-intl';

import customizableComponent from '~/core/hocs/customization';
import ConditionalRender from '~/core/components/ConditionalRender';

import { backgroundImage as UserImage } from '~/icons/User';

import Linkify from '~/core/components/Linkify';

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
      <ConditionalRender condition={incoming}>
        <AvatarWrapper>
          <ConditionalRender condition={!consequent}>
            <Avatar backgroundImage={UserImage} />
          </ConditionalRender>
        </AvatarWrapper>
      </ConditionalRender>
      <MessageContainer>
        <ConditionalRender condition={incoming && !consequent}>
          <UserName>{displayName}</UserName>
        </ConditionalRender>
        <MessageBody incoming={incoming}>
          <MessageContent message={message} />
          <BottomLine>
            <MessageDate>
              <FormattedTime value={createdAt} />
            </MessageDate>
            <ConditionalRender condition={!message.isDeleted}>
              <Options incoming={incoming} message={message} />
            </ConditionalRender>
          </BottomLine>
        </MessageBody>
      </MessageContainer>
    </MessageWrapper>
  );
};

export default customizableComponent('Message', Message);
