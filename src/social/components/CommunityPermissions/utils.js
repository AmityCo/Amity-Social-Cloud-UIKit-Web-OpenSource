import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { info } from '~/core/components/Confirm';
import useCommunity from '~/social/hooks/useCommunity';

export function usePermission(communityId, key) {
  const { community, updateCommunity } = useCommunity(communityId);
  const prevValue = community[key];

  const [permission, setPermissionState] = useState(prevValue);

  useEffect(() => setPermissionState(prevValue), [prevValue]);

  const setPermission = useCallback(
    async (newValue) => {
      try {
        setPermissionState(newValue);
        await updateCommunity({ [key]: newValue });
      } catch (error) {
        setPermissionState(prevValue);

        info({
          title: (
            <FormattedMessage
              id={`community.permissions.error.${key}.${newValue ? 'turnOn' : 'turnOff'}`}
            />
          ),
          content: <FormattedMessage id="general.error.tryAgainLater" />,
        });
      }
    },
    [key, prevValue, updateCommunity],
  );

  return [permission, setPermission];
}
