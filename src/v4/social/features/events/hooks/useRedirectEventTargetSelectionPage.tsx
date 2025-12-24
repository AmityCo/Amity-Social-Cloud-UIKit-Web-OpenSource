import { Title } from '~/v4/social/elements';
import { PAGE_ID } from '~/v4/constants/customization';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { EventTargetSelection } from '~/v4/social/features/events/EventTargetSelection';

export function useRedirectEventTargetSelectionPage() {
  const pageId = PAGE_ID.SELECT_EVENT_TARGET_PAGE;

  const { isDesktop } = useResponsive();
  const { openPopup } = usePopupContext();
  const { AmityCreatePostMenuComponentBehavior } = usePageBehavior();

  const redirectEventTargetSelectionPage = () => {
    isDesktop
      ? openPopup({
          pageId,
          view: 'desktop',
          header: <Title pageId={pageId} variant="headline" />,
          children: <EventTargetSelection />,
        })
      : AmityCreatePostMenuComponentBehavior?.goToSelectEventTargetPage?.();
  };

  return {
    redirectEventTargetSelectionPage,
  };
}
