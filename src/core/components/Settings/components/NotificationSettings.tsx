import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { Box, H3, Stack, Text, Container, Loader } from '@noom/wax-component-library';

import { SwitchSetting } from './SwitchSetting';

import { NotificationSettings as Settings } from '../models';

const NOTIFICATION_ORDER = ['comment', 'reaction', 'post'];
const TypeToTile = {
  email: <FormattedMessage id="settings.emailNotifications.title" />,
  push: <FormattedMessage id="settings.pushNotifications.title" />,
};

export type NotificationSettingsProps = {
  type: keyof typeof TypeToTile;
  spacing?: number;
  isLoading?: boolean;
  settings?: Settings;
  onChangeGlobal: (type: string, isChecked: boolean) => void;
  onChangeCommunity: (communityId: string, isChecked: boolean) => void;
};

export function NotificationSettings({
  type,
  isLoading,
  spacing = 4,
  settings,
  onChangeGlobal,
  onChangeCommunity,
}: NotificationSettingsProps) {
  const { formatMessage } = useIntl();

  const sortedCommunities = settings
    ? [...settings.community].sort((a, b) => a.communityName.localeCompare(b.communityName))
    : [];

  return (
    <Box>
      <H3 pb={spacing}>{TypeToTile[type]}</H3>
      <Stack divider={<Box />} spacing={spacing}>
        {NOTIFICATION_ORDER.map((key) => (
          <SwitchSetting
            key={key}
            name={key}
            size="lg"
            label={formatMessage({ id: `settings.notifications.${key}.label` })}
            helper={formatMessage({ id: `settings.notifications.${key}.helper` })}
            isDisabled={isLoading}
            isChecked={settings?.global[key]}
            onChange={() => onChangeGlobal(key, !settings?.global[key])}
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
            isDisabled={isLoading || !settings?.global.post}
            isChecked={community.isEnabled}
            onChange={() => onChangeCommunity(community.communityId, !community.isEnabled)}
          />
        ))}

        {isLoading && !sortedCommunities.length && (
          <Container centerHorizontal>
            <Loader size="md" colorScheme="primary" />
          </Container>
        )}
      </Stack>
    </Box>
  );
}
