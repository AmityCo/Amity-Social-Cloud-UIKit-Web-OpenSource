import React from 'react';
import { useIntl } from 'react-intl';
import { ChannelType } from '@amityco/js-sdk';

import { StyledSelect } from './styles';

const itemRenderer = ({ name }) => (
  <div data-qa-anchor={`chat-type-selector-item-${name}`}>{name}</div>
);

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
      data-qa-anchor="chat-type"
      options={options}
      value={[options[0]]}
      parentContainer={parentContainer}
      renderItem={itemRenderer}
      onSelect={({ value }) => onChange(value)}
    />
  );
};

export default ChatTypeSelector;
