import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { ChannelRepository } from '@amityco/ts-sdk';
import Pencil from '~/icons/Pencil';

import GroupSettings from '~/chat/components/GroupSettings';

import styles from './styles.module.css';

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
      <div className={styles.controlItem} onClick={() => setShouldShowSettingsModal(true)}>
        <div className={styles.sideWrapper}>
          <Pencil className={styles.groupSettingIcon} width={24} height={20} />
          <div className={styles.controlItemLabel}>
            <FormattedMessage id="chat.groupSetting" />
          </div>
        </div>
      </div>

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
