import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { ChannelRepository } from '@amityco/ts-sdk';

import GroupSettings from '~/chat/components/GroupSettings';

import { ControlItem, ControlItemLabel, SideWrapper, GroupSettingIcon } from './styles';

interface MenuGroupSettingProps {
  chatName?: string;
  channelId: string;
}

const MenuGroupSetting = ({ chatName, channelId }: MenuGroupSettingProps) => {
  const [shouldShowSettingsModal, setShouldShowSettingsModal] = useState(false);
  const { formatMessage } = useIntl();

  const updateGroupName = async (newGroupChatName: string) => {
    await ChannelRepository.updateChannel(channelId, { displayName: newGroupChatName });
  };

  return (
    <>
      <ControlItem onClick={() => setShouldShowSettingsModal(true)}>
        <SideWrapper>
          <GroupSettingIcon />
          <ControlItemLabel>
            <FormattedMessage id="chat.groupSetting" />
          </ControlItemLabel>
        </SideWrapper>
      </ControlItem>

      {shouldShowSettingsModal && (
        <GroupSettings
          title={<FormattedMessage id="chat.groupSetting" />}
          chatName={chatName}
          submitButtonName={formatMessage({ id: 'general.done.capital' })}
          closeModal={() => setShouldShowSettingsModal(false)}
          onSubmit={updateGroupName}
        />
      )}
    </>
  );
};

export default MenuGroupSetting;
