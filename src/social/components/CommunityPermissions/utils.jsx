import { CommunityPostSettings } from '@amityco/js-sdk';
import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { info } from '~/core/components/Confirm';
import useCommunity from '~/social/hooks/useCommunity';

function getValue(key, community) {
  if (key === 'needApprovalOnPostCreation') {
    return community.postSetting === CommunityPostSettings.ADMIN_REVIEW_POST_REQUIRED;
  }

  return community[key];
}

function getPatch(key, value) {
  if (key === 'needApprovalOnPostCreation') {
    return {
      postSetting: value
        ? CommunityPostSettings.ADMIN_REVIEW_POST_REQUIRED
        : CommunityPostSettings.ANYONE_CAN_POST,
    };
  }

  return { [key]: value };
}

export function usePermission(communityId, key) {
  const { community, updateCommunity } = useCommunity(communityId);
  const prevValue = getValue(key, community);

  const [permission, setPermissionState] = useState(prevValue);

  useEffect(() => setPermissionState(prevValue), [prevValue]);

  const setPermission = useCallback(
    async (newValue) => {
      try {
        setPermissionState(newValue);

        await updateCommunity(getPatch(key, newValue));
      } catch (error) {
        setPermissionState(prevValue);

        info({
          title: (
            <FormattedMessage
              id={`community.permissions.error.${key}.${newValue ? 'turnOn' : 'turnOff'}`}
            />
          ),
          content: error.message,
        });
      }
    },
    [key, prevValue, updateCommunity],
  );

  return [permission, setPermission];
}
