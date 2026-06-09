import { useAmityPage } from '~/v4/core/hooks/uikit';
import { CHAT_PAGE_IDS } from '~/v4/chat/constants/chatPageIds';
import { BannedGroupMembers } from '~/v4/chat/features/group/banned-members';

export type BannedGroupMemberListPageProps = {
  channelId: string;
};

export function BannedGroupMemberListPage({ channelId }: BannedGroupMemberListPageProps) {
  const pageId = CHAT_PAGE_IDS.BANNED_GROUP_MEMBER_LIST_PAGE;
  const { themeStyles, accessibilityId } = useAmityPage({ pageId });

  return (
    <div style={themeStyles} data-testid={accessibilityId}>
      <BannedGroupMembers channelId={channelId} />
    </div>
  );
}
