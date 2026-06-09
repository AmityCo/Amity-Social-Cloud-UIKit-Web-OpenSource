import { useAmityPage } from '~/v4/core/hooks/uikit';
import { CHAT_PAGE_IDS } from '~/v4/chat/constants/chatPageIds';
import { EditGroupNotification } from '~/v4/chat/features/group/edit-notification';

export type EditGroupNotificationPageProps = {
  channelId: string;
};

export function EditGroupNotificationPage({ channelId }: EditGroupNotificationPageProps) {
  const pageId = CHAT_PAGE_IDS.EDIT_GROUP_NOTIFICATION_PAGE;
  const { themeStyles, accessibilityId } = useAmityPage({ pageId });

  return (
    <div style={themeStyles} data-testid={accessibilityId}>
      <EditGroupNotification channelId={channelId} />
    </div>
  );
}
