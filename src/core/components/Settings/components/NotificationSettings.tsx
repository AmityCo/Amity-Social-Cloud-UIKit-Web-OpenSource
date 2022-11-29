import React from 'react';
import { useIntl } from 'react-intl';
import { Box, H3, Stack, Text } from '@noom/wax-component-library';

import { SwitchSetting } from './SwitchSetting';

import { NotificationSettings as Settings } from '../models';

const NOTIFICATION_ORDER = ['comment', 'reaction', 'post'];

export type NotificationSettingsProps = {
  title?: string;
  spacing?: number;
  isLoading?: boolean;
  settings: Settings;
  onChangeGlobal: (type: string, isChecked: boolean) => void;
  onChangeCommunity: (communityId: string, isChecked: boolean) => void;
};

export function NotificationSettings({
  title,
  isLoading,
  spacing = 4,
  settings,
  onChangeGlobal,
  onChangeCommunity,
}: NotificationSettingsProps) {
  const { formatMessage } = useIntl();

  const sortedCommunities = [...settings.community].sort((a, b) =>
    a.communityName.localeCompare(b.communityName),
  );

  return (
    <Box>
      {title && <H3 pb={spacing}>{title}</H3>}
      <Stack divider={<Box />} spacing={spacing}>
        {NOTIFICATION_ORDER.map((key) => (
          <SwitchSetting
            key={key}
            name={key}
            size="lg"
            label={formatMessage({ id: `settings.notifications.${key}.label` })}
            helper={formatMessage({ id: `settings.notifications.${key}.helper` })}
            isDisabled={isLoading}
            isChecked={settings.global[key]}
            onChange={() => onChangeGlobal(key, !settings.global[key])}
          />
        ))}

        {sortedCommunities.map((community) => (
          <SwitchSetting
            key={community.communityId}
            name={`community-${community.communityId}`}
            size="md"
            label={
              <Text ml={spacing} title={community.communityName}>
                {community.communityName}
              </Text>
            }
            isDisabled={isLoading || !settings.global.post}
            isChecked={community.enabled}
            onChange={() => onChangeCommunity(community.communityId, !community.enabled)}
          />
        ))}
      </Stack>
    </Box>
  );
}
