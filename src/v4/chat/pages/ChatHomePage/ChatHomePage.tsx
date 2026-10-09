import { useAmityPage } from '~/v4/core/hooks/uikit';
import { CHAT_PAGE_IDS } from '~/v4/chat/constants/chatPageIds';
import { ChatHome } from '~/v4/chat/features/home/ChatHome';

type ChatHomePageProps = {
  /**
   * Keeps the page mounted but out of view, with its channel collections and
   * their realtime subscriptions alive, while another chat page is on top.
   * The chat application sets this instead of unmounting the home; see
   * `Application.tsx`.
   */
  hidden?: boolean;
};

export function ChatHomePage({ hidden = false }: ChatHomePageProps = {}) {
  const pageId = CHAT_PAGE_IDS.CHAT_HOME_PAGE;
  const { themeStyles, accessibilityId, isExcluded } = useAmityPage({ pageId });

  // A module switched off renders nothing, so a stale route or deep
  // link lands on emptiness rather than a page with holes in it.
  if (isExcluded) return null;

  return (
    <div style={themeStyles} data-testid={accessibilityId} hidden={hidden}>
      <ChatHome hidden={hidden} />
    </div>
  );
}
