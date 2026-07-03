import { useAmityPage } from '~/v4/core/hooks/uikit';
import { CHAT_PAGE_IDS } from '~/v4/chat/constants/chatPageIds';
import { CreateConversation } from '~/v4/chat/features/conversation/create/CreateConversation';

export function ChannelCreateConversationPage() {
  const pageId = CHAT_PAGE_IDS.CREATE_CONVERSATION_PAGE;
  const { themeStyles, accessibilityId } = useAmityPage({ pageId });

  return (
    <div style={themeStyles} data-testid={accessibilityId}>
      <CreateConversation />
    </div>
  );
}
