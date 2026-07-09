import { useAmityPage } from '~/v4/core/hooks/uikit';
import { CHAT_PAGE_IDS } from '~/v4/chat/constants/chatPageIds';
import { ChatHome } from '~/v4/chat/features/home/ChatHome';

export function ChatHomePage() {
  const pageId = CHAT_PAGE_IDS.CHAT_HOME_PAGE;
  const { themeStyles, accessibilityId } = useAmityPage({ pageId });

  return (
    <div style={themeStyles} data-testid={accessibilityId}>
      <ChatHome />
    </div>
  );
}
