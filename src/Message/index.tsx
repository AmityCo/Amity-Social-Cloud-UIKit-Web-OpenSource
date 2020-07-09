import React, { useState } from 'react';
import { FormattedTime } from 'react-intl';
import { customizableComponent } from '../hoks/customization';
import useLiveObject from '../hooks/useLiveObject';

import {
  Avatar,
  AvatarWrapper,
  MessageWrapper,
  MessageContainer,
  MessageBody,
  UserName,
  BottomLine,
  MessageDate,
  MessageOptionsIcon,
} from './styles';

const MessageContent = ({ data, type }) => {
  switch (type) {
    case 'text':
      return data.text || null;
    case 'custom':
      return JSON.stringify(data);

    case 'image':
    case 'file':
    default:
      return 'Unsupported message format';
  }
};

const Message = ({ message, message: { data, type, editedAt, user }, consequent, incoming }) => {
  const { displayName } = user.model;

  return (
    <MessageWrapper incoming={incoming}>
      {incoming && <AvatarWrapper>{!consequent && <Avatar />}</AvatarWrapper>}
      <MessageContainer>
        {incoming && !consequent && <UserName>{displayName}</UserName>}
        <MessageBody incoming={incoming}>
          <MessageContent data={data} type={type} />
          <BottomLine>
            <MessageDate>
              <FormattedTime value={editedAt} />
            </MessageDate>
            <MessageOptionsIcon />
          </BottomLine>
        </MessageBody>
      </MessageContainer>
    </MessageWrapper>
  );
};

export default customizableComponent('Message')(Message);
