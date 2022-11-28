import React from 'react';
import { useIntl } from 'react-intl';

import { Box, H3, Stack, Text } from '@noom/wax-component-library';

import { SwitchSetting } from './SwitchSetting';

import { NotificationSettings as Settings } from '../models';

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
        <SwitchSetting
          name="comment"
          size="lg"
          label={formatMessage({ id: 'settings.notifications.comment.label' })}
          helper={formatMessage({ id: 'settings.notifications.comment.helper' })}
          isDisabled={isLoading}
          isChecked={settings.global.comment}
          onChange={() => onChangeGlobal('comment', !settings.global.comment)}
        />

        <SwitchSetting
          name="reaction"
          size="lg"
          label={formatMessage({ id: 'settings.notifications.reaction.label' })}
          helper={formatMessage({ id: 'settings.notifications.reaction.helper' })}
          isDisabled={isLoading}
          isChecked={settings.global.reaction}
          onChange={() => onChangeGlobal('reaction', !settings.global.reaction)}
        />

        <SwitchSetting
          name="post"
          size="lg"
          label={formatMessage({ id: 'settings.notifications.post.label' })}
          helper={formatMessage({ id: 'settings.notifications.post.helper' })}
          isDisabled={isLoading}
          isChecked={settings.global.post}
          onChange={() => onChangeGlobal('post', !settings.global.post)}
        />

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
