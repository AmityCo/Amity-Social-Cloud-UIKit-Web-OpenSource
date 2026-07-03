import { useAmityPage } from '~/v4/core/hooks/uikit';
import { CHAT_PAGE_IDS } from '~/v4/chat/constants/chatPageIds';
import { SelectGroupMember } from '~/v4/chat/features/group/select-member/SelectGroupMember';

export type SelectGroupMemberPageProps = {
  selectedGroupMember?: Amity.User[];
};

export function SelectGroupMemberPage({ selectedGroupMember }: SelectGroupMemberPageProps) {
  const pageId = CHAT_PAGE_IDS.SELECT_GROUP_MEMBER_PAGE;
  const { themeStyles, accessibilityId } = useAmityPage({ pageId });

  return (
    <div style={themeStyles} data-testid={accessibilityId}>
      <SelectGroupMember selectedGroupMember={selectedGroupMember} />
    </div>
  );
}
