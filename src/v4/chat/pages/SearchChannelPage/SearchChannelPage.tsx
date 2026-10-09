import { useAmityPage } from '~/v4/core/hooks/uikit';
import { CHAT_PAGE_IDS } from '~/v4/chat/constants/chatPageIds';
import { SearchChannel } from '~/v4/chat/features/search';

export type SearchChannelPageProps = Record<string, never>;

export function SearchChannelPage() {
  const pageId = CHAT_PAGE_IDS.SEARCH_CHANNEL_PAGE;
  const { themeStyles, accessibilityId, isExcluded } = useAmityPage({ pageId });

  // A module switched off renders nothing, so a stale route or deep
  // link lands on emptiness rather than a page with holes in it.
  if (isExcluded) return null;

  return (
    <div style={themeStyles} data-testid={accessibilityId}>
      <SearchChannel />
    </div>
  );
}
