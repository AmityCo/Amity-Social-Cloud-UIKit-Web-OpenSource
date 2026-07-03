import { useAmityPage } from '~/v4/core/hooks/uikit';
import { CHAT_PAGE_IDS } from '~/v4/chat/constants/chatPageIds';
import { EditGroupMemberPermissions } from '~/v4/chat/features/group/edit-permission';

export type EditGroupMemberPermissionsPageProps = {
  channelId: string;
};

export function EditGroupMemberPermissionsPage({ channelId }: EditGroupMemberPermissionsPageProps) {
  const pageId = CHAT_PAGE_IDS.EDIT_GROUP_MEMBER_PERMISSIONS_PAGE;
  const { themeStyles, accessibilityId } = useAmityPage({ pageId });

  return (
    <div style={themeStyles} data-testid={accessibilityId}>
      <EditGroupMemberPermissions channelId={channelId} />
    </div>
  );
}
