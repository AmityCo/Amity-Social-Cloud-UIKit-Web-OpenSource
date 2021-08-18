import React from 'react';
import { FormattedMessage } from 'react-intl';
import Switch from '~/core/components/Switch';
import { useSDK } from '~/core/hocs/withSDK';
import {
  SwitchItemContainer,
  SwitchItemDescription,
  SwitchItemName,
  SwitchItemPrompt,
} from './styles';

export default function SwitchItem({ onChange, value }) {
  const { connected } = useSDK();
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

      <Switch
        disabled={!connected}
        value={value}
        onChange={onChange}
        data-qa-anchor="social-community-approve-post-permission"
      />
    </SwitchItemContainer>
  );
}
