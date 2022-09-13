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

const SwitchItem = ({ onChange, value }) => {
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
        data-qa-anchor="social-community-approve-post-permission"
        onChange={onChange}
      />
    </SwitchItemContainer>
  );
};

export default SwitchItem;
