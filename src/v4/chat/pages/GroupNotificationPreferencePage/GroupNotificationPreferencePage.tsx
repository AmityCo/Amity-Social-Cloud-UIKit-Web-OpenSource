import { useAmityPage } from '~/v4/core/hooks/uikit';
import { CHAT_PAGE_IDS } from '~/v4/chat/constants/chatPageIds';
import { NotificationPreference } from '~/v4/chat/features/group/notification-preference';

export type GroupNotificationPreferencePageProps = {
  channelId: string;
};

export function GroupNotificationPreferencePage({
  channelId,
}: GroupNotificationPreferencePageProps) {
  const pageId = CHAT_PAGE_IDS.GROUP_NOTIFICATION_PREFERENCE_PAGE;
  const { themeStyles, accessibilityId } = useAmityPage({ pageId });

  return (
    <div style={themeStyles} data-testid={accessibilityId}>
      <NotificationPreference channelId={channelId} />
    </div>
  );
}
