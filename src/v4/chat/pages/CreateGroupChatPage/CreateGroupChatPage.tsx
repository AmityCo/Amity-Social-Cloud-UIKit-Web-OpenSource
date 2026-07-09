import { useAmityPage } from '~/v4/core/hooks/uikit';
import { CHAT_PAGE_IDS } from '~/v4/chat/constants/chatPageIds';
import { CreateGroupChat } from '~/v4/chat/features/group/create/CreateGroupChat';

export type CreateGroupChatPageProps = {
  selectedUsers: Amity.User[];
};

export function CreateGroupChatPage({ selectedUsers }: CreateGroupChatPageProps) {
  const pageId = CHAT_PAGE_IDS.CREATE_GROUP_CHAT_PAGE;
  const { themeStyles, accessibilityId } = useAmityPage({ pageId });

  return (
    <div style={themeStyles} data-testid={accessibilityId}>
      <CreateGroupChat selectedUsers={selectedUsers} />
    </div>
  );
}
