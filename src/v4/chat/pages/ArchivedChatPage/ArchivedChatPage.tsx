import { useAmityPage } from '~/v4/core/hooks/uikit';
import { CHAT_PAGE_IDS } from '~/v4/chat/constants/chatPageIds';
import { ArchivedChat } from '~/v4/chat/features/archive';

export type ArchivedChatPageProps = Record<string, never>;

export function ArchivedChatPage() {
  const pageId = CHAT_PAGE_IDS.ARCHIVED_CHAT_PAGE;
  const { themeStyles, accessibilityId } = useAmityPage({ pageId });

  return (
    <div style={themeStyles} data-testid={accessibilityId}>
      <ArchivedChat />
    </div>
  );
}
