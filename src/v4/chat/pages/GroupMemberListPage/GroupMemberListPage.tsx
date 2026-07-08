import { useAmityPage } from '~/v4/core/hooks/uikit';
import { CHAT_PAGE_IDS } from '~/v4/chat/constants/chatPageIds';
import { GroupMembers } from '~/v4/chat/features/group/members';

export type GroupMemberListPageProps = {
  channelId: string;
};

export function GroupMemberListPage({ channelId }: GroupMemberListPageProps) {
  const pageId = CHAT_PAGE_IDS.GROUP_MEMBER_LIST_PAGE;
  const { themeStyles, accessibilityId } = useAmityPage({ pageId });

  return (
    <div style={themeStyles} data-testid={accessibilityId}>
      <GroupMembers channelId={channelId} />
    </div>
  );
}
