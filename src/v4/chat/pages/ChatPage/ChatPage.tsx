import { useAmityPage } from '~/v4/core/hooks/uikit';
import { CHAT_PAGE_IDS } from '~/v4/chat/constants/chatPageIds';
import { Chat } from '~/v4/chat/features/conversation/chat/Chat';

export type ChatPageProps = {
  channelId?: string;
  userId?: string;
  userDisplayName?: string;
  avatarUrl?: string;
  isJustCreated?: boolean;
  jumpToMessageId?: string;
};

export function ChatPage({
  channelId,
  userId,
  userDisplayName,
  avatarUrl,
  isJustCreated,
  jumpToMessageId,
}: ChatPageProps) {
  const pageId = CHAT_PAGE_IDS.CHAT_PAGE;
  const { themeStyles, accessibilityId } = useAmityPage({ pageId });

  return (
    <div style={themeStyles} data-testid={accessibilityId}>
      <Chat
        channelId={channelId}
        userId={userId}
        userDisplayName={userDisplayName}
        avatarUrl={avatarUrl}
        isJustCreated={isJustCreated}
        jumpToMessageId={jumpToMessageId}
      />
    </div>
  );
}
