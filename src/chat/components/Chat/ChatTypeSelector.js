import React from 'react';
import { useIntl } from 'react-intl';
import { ChannelType } from '@amityco/js-sdk';

import { StyledSelect } from './styles';

const itemRenderer = ({ name }) => <div>{name}</div>;

const ChatTypeSelector = ({ onChange, parentContainer = null }) => {
  const { formatMessage } = useIntl();

  const options = [
    ChannelType.Live,
    ChannelType.Community,
    ChannelType.Conversation,
    ChannelType.Broadcast,
  ].map((answerType) => ({
    name: formatMessage({ id: 'select.chatType.item' }, { answerType }),
    value: answerType,
  }));

  return (
    <StyledSelect
      options={options}
      value={[options[0]]}
      parentContainer={parentContainer}
      renderItem={itemRenderer}
      onSelect={({ value }) => onChange(value)}
    />
  );
};

export default ChatTypeSelector;
