export function getPersonalNotificationLabelKey(isEnabled?: boolean): string {
  return isEnabled ? 'amity_chat_notifications_on' : 'amity_chat_notifications_off';
}
