import { AmityChannelNotificationModeEnum } from '@amityco/ts-sdk';

export function getNotificationModeLabelKey(mode?: Amity.NotificationMode | null): string {
  switch (mode) {
    case AmityChannelNotificationModeEnum.Silent:
      return 'amity_chat_group_notification_silent_label';
    case AmityChannelNotificationModeEnum.Subscribe:
      return 'amity_chat_group_notification_subscribe_label';
    case AmityChannelNotificationModeEnum.Default:
    default:
      return 'amity_chat_group_notification_default_label';
  }
}
