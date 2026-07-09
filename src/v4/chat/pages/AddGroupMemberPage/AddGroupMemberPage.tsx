import { useAmityPage } from '~/v4/core/hooks/uikit';
import { CHAT_PAGE_IDS } from '~/v4/chat/constants/chatPageIds';
import { AddGroupMember } from '~/v4/chat/features/group/add-member';

export type AddGroupMemberPageProps = {
  channelId: string;
};

export function AddGroupMemberPage({ channelId }: AddGroupMemberPageProps) {
  const pageId = CHAT_PAGE_IDS.ADD_GROUP_MEMBER_PAGE;
  const { themeStyles, accessibilityId } = useAmityPage({ pageId });

  return (
    <div style={themeStyles} data-testid={accessibilityId}>
      <AddGroupMember channelId={channelId} />
    </div>
  );
}
