import React from 'react';
import { FormattedMessage } from 'react-intl';
import Switch from '~/core/components/Switch';
import {
  SwitchItemContainer,
  SwitchItemDescription,
  SwitchItemName,
  SwitchItemPrompt,
} from './styles';

export default function SwitchItem({ onChange, value }) {
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

      <Switch value={value} onChange={onChange} />
    </SwitchItemContainer>
  );
}
