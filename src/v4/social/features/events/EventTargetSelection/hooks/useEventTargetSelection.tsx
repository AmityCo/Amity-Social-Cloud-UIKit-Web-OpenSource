import { useState } from 'react';
import useSDK from '~/v4/core/hooks/useSDK';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { PAGE_ID } from '~/v4/constants/customization';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import useCommunitiesCollection from '~/v4/social/hooks/collections/useCommunitiesCollection';

export function useEventTargetSelection() {
  const pageId = PAGE_ID.SELECT_EVENT_TARGET_PAGE;

  const { client } = useSDK();
  const { onBack } = useNavigation();
  const { closePopup } = usePopupContext();
  const { themeStyles } = useAmityPage({ pageId });

  const { communities, hasMore, loadMore, isLoading } = useCommunitiesCollection({
    queryParams: { limit: 20, membership: 'member' },
  });

  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);

  useIntersectionObserver({
    node: intersectionNode,
    options: { threshold: 0.7 },
    onIntersect: () => hasMore && !isLoading && loadMore(),
  });

  return {
    pageId,
    client,
    onBack,
    communities,
    themeStyles,
    closePopup,
    isLoading,
    setIntersectionNode,
  };
}
