import React, { useState } from 'react';

import { SwitchSetting as UISwitchSetting, SwitchSettingProps } from './components/SwitchSetting';
import {
  NotificationSettings as UINotificationSettings,
  NotificationSettingsProps,
} from './components/NotificationSettings';

import { settings as settingsMock } from './mocks';

export default {
  title: 'Ui Only',
};

export const SwitchSetting = ({ ...props }: SwitchSettingProps) => {
  return <UISwitchSetting {...props} />;
};

SwitchSetting.argTypes = {
  label: { control: { type: 'text' } },
  name: { control: { type: 'text' } },
  helper: { control: { type: 'text' } },
  size: { control: { type: 'text' } },
};
SwitchSetting.args = {
  label: 'That nice switch',
  name: 'switch',
  helper: 'That nice helper text that is about two lines long, but should not be longer than that',
  size: 'lg',
  isDisabled: false,
};

export const NotificationSettings = ({ ...props }: NotificationSettingsProps) => {
  const [settings, setSettings] = useState(settingsMock);

  const onChangeGlobal = (key: string, value: boolean) => {
    setSettings({
      ...settings,
      global: {
        ...settings.global,
        [key]: value,
      },
    });
  };

  const onChangeCommunity = (communityId: string, value: boolean) => {
    const target = settings.community.find((c) => c.communityId === communityId)!;
    target.enabled = value;

    setSettings({
      ...settings,
      community: [target, ...settings.community.filter((c) => c.communityId !== communityId)],
    });
  };

  return (
    <UINotificationSettings
      {...props}
      settings={settings}
      onChangeGlobal={onChangeGlobal}
      onChangeCommunity={onChangeCommunity}
    />
  );
};

NotificationSettings.argTypes = {
  isLoading: { control: { type: 'boolean' } },
  type: { control: { type: 'select' }, options: ['email', 'push'] },
};

NotificationSettings.args = {
  isLoading: false,
  type: 'email',
};
