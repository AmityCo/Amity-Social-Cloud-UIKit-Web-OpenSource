import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { info } from '~/core/components/Confirm';
import useCommunity from '~/social/hooks/useCommunity';

export function usePermission(communityId, key) {
  const { community, updateCommunity } = useCommunity(communityId);
  const [permission, setPermissionState] = useState(community[key]);

  useEffect(() => setPermissionState(community[key]), [community[key]]);

  const setPermission = useCallback(
    async value => {
      try {
        setPermissionState(value);
        await updateCommunity({ [key]: value });
      } catch (error) {
        setPermissionState(community[key]);

        info({
          title: (
            <FormattedMessage
              id={`community.permissions.error.${key}.${value ? 'turnOn' : 'turnOff'}`}
            />
          ),
          content: <FormattedMessage id="general.error.tryAgainLater" />,
        });
      }
    },
    [community[key], updateCommunity],
  );

  return [permission, setPermission];
}
