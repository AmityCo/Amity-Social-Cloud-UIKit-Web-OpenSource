import { Client, UserNotificationModuleNameEnum } from '@amityco/ts-sdk';
import { useQuery } from '@tanstack/react-query';

export function useUserPushNotificationQuery() {
  const { data } = useQuery({
    queryKey: ['userPushNotification'],
    queryFn: () => Client.notifications().user().getSettings(),
  });

  const isChatNotificationDisabled =
    data != null &&
    (!data.isEnabled ||
      data.modules.some(
        (m) => m.moduleName === UserNotificationModuleNameEnum.CHAT && !m.isEnabled,
      ));

  return { isChatNotificationDisabled };
}
