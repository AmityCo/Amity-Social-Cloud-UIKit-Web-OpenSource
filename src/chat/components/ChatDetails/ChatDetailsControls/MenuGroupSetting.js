import React, { useState, Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { ChannelRepository } from '@amityco/js-sdk';

import GroupSettings from '~/chat/components/GroupSettings';

import { ControlItem, ControlItemLabel, SideWrapper, GroupSettingIcon } from './styles';

const channelRepo = new ChannelRepository();

function MenuGroupSetting({ chatName, channelId }) {
  const [shouldShowSettingsModal, setShouldShowSettingsModal] = useState(false);

  const updateGroupName = newGroupChatName => {
    channelRepo.setDisplayName({ channelId, displayName: newGroupChatName });
  };

  return (
    <Fragment>
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
          submitButtonName={<FormattedMessage id="general.done.capital" />}
          onSubmit={updateGroupName}
          closeModal={() => setShouldShowSettingsModal(false)}
        />
      )}
    </Fragment>
  );
}

export default MenuGroupSetting;
