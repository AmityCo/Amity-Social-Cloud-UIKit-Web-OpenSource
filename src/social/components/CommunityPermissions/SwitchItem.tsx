import React from 'react';
import { FormattedMessage } from 'react-intl';
import Switch from '~/core/components/Switch';
import {
  SwitchItemContainer,
  SwitchItemDescription,
  SwitchItemName,
  SwitchItemPrompt,
} from './styles';
import { useSDK } from '~/core/hooks/useSDK';

interface SwitchItemProps {
  onChange?: (value: boolean) => void;
  value: boolean;
}

const SwitchItem = ({ onChange, value }: SwitchItemProps) => {
  return (
    <SwitchItemContainer>
      <SwitchItemDescription>
        <SwitchItemName>
          <FormattedMessage id="community.permissions.approvePosts" />
        </SwitchItemName>
        <SwitchItemPrompt>
          <FormattedMessage id="community.permissions.approvePosts.prompt" />
        </SwitchItemPrompt>
      </SwitchItemDescription>

      <Switch value={value} data-qa-anchor="community-permissions" onChange={onChange} />
    </SwitchItemContainer>
  );
};

export default SwitchItem;
