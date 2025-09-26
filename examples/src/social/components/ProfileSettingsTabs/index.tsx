import React from 'react';
import { ProfileSettingsTabs } from './styles';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';

type ProfileSettingsTabsProps = React.ComponentProps<typeof ProfileSettingsTabs>;

export default (props: ProfileSettingsTabsProps) => {
  const CustomComponentFn = useCustomComponent<ProfileSettingsTabsProps>('ProfileSettingsTabs');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <ProfileSettingsTabs {...props} />;
};
