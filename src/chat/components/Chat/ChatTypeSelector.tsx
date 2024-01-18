import React from 'react';
import { useIntl } from 'react-intl';

import { StyledSelect } from './styles';

const itemRenderer = ({ name }: { name?: string }) => (
  <div data-qa-anchor={`chat-type-selector-item-${name}`}>{name}</div>
);

interface ChatTypeSelectorProps {
  onChange: (value: string) => void;
  parentContainer?: HTMLElement | null;
}

const ChatTypeSelector = ({ onChange, parentContainer }: ChatTypeSelectorProps) => {
  const { formatMessage } = useIntl();

  const options = ['live', 'community', 'conversation', 'broadcast'].map((answerType) => ({
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
