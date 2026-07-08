import { useAmityPage } from '~/v4/core/hooks/uikit';
import { CHAT_PAGE_IDS } from '~/v4/chat/constants/chatPageIds';
import { GroupChat } from '~/v4/chat/features/group/chat/GroupChat';

export type GroupChatPageProps = {
  channelId: string;
  isJustCreated?: boolean;
  jumpToMessageId?: string;
};

export function GroupChatPage({ channelId, isJustCreated, jumpToMessageId }: GroupChatPageProps) {
  const pageId = CHAT_PAGE_IDS.GROUP_CHAT_PAGE;
  const { themeStyles, accessibilityId } = useAmityPage({ pageId });

  return (
    <div style={themeStyles} data-testid={accessibilityId}>
      <GroupChat
        channelId={channelId}
        isJustCreated={isJustCreated}
        jumpToMessageId={jumpToMessageId}
      />
    </div>
  );
}
