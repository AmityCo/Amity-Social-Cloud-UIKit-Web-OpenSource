import { CommunityPostSettings, CommunityRepository } from '@amityco/ts-sdk';
import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { info } from '~/core/components/Confirm';
import useCommunity from '~/social/hooks/useCommunity';

// TODO: check CommunityPostSettings

function getValue(
  key: 'needApprovalOnPostCreation' | 'storyComments',
  community?: Amity.Community | null,
) {
  if (key === 'needApprovalOnPostCreation') {
    return community?.postSetting === CommunityPostSettings.ADMIN_REVIEW_POST_REQUIRED;
  }

  return false;
}

function getPatch(key: string, value: unknown) {
  if (key === 'needApprovalOnPostCreation') {
    return {
      postSetting: value
        ? CommunityPostSettings.ADMIN_REVIEW_POST_REQUIRED
        : CommunityPostSettings.ANYONE_CAN_POST,
    };
  }

  return { [key]: value };
}

export function usePermission({
  communityId,
  key,
}: {
  communityId?: string;
  key: 'needApprovalOnPostCreation';
}): [permission: boolean, setPermission: (newValue: boolean) => Promise<void>] {
  const community = useCommunity(communityId);
  const prevValue = getValue(key, community);

  const [permission, setPermissionState] = useState(prevValue);

  useEffect(() => setPermissionState(prevValue), [prevValue]);

  const setPermission = useCallback(
    async (newValue) => {
      try {
        setPermissionState(newValue);
        if (communityId == null) return;

        await CommunityRepository.updateCommunity(communityId, getPatch(key, newValue));
      } catch (error) {
        setPermissionState(prevValue);
        if (error instanceof Error) {
          info({
            title: (
              <FormattedMessage
                id={`community.permissions.error.${key}.${newValue ? 'turnOn' : 'turnOff'}`}
              />
            ),
            content: error.message,
          });
        }
      }
    },
    [key, prevValue],
  );

  return [permission, setPermission];
}
