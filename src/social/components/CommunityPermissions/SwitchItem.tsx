import React from 'react';
import Switch from '~/core/components/Switch';
import {
  SwitchItemContainer,
  SwitchItemDescription,
  SwitchItemName,
  SwitchItemPrompt,
} from './styles';

interface SwitchItemProps {
  onChange?: (value: boolean) => void;
  value: boolean;
  title?: React.ReactNode;
  promptText?: React.ReactNode;
}

const SwitchItem = ({ onChange, value, title, promptText }: SwitchItemProps) => {
  return (
    <SwitchItemContainer>
      <SwitchItemDescription>
        {title && <SwitchItemName>{title}</SwitchItemName>}
        {promptText && <SwitchItemPrompt>{promptText}</SwitchItemPrompt>}
      </SwitchItemDescription>
      <Switch value={value} data-qa-anchor="community-permissions" onChange={onChange} />
    </SwitchItemContainer>
  );
};

export default SwitchItem;
