import { Title } from '~/v4/social/elements';
import { PAGE_ID } from '~/v4/constants/customization';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { EventPostTargetSelectionPage } from '~/v4/social/pages/EventPostTargetSelectionPage';

export function useRedirectEventPostTargetSelectionPage() {
  const pageId = PAGE_ID.EVENT_POST_TARGET_SELECTION_PAGE;

  const { isDesktop } = useResponsive();
  const { openPopup } = usePopupContext();
  const { goToEventPostTargetSelectionPage } = useNavigation();

  const redirectEventPostTargetSelectionPage = (event: Amity.Event) => {
    if (isDesktop) {
      openPopup({
        pageId,
        view: 'desktop',
        header: (
          <Title
            pageId={pageId}
            variant="headline"
            textKey="amity_social_label_select_event_post_target_title"
          />
        ),
        children: <EventPostTargetSelectionPage event={event} />,
      });
    } else {
      goToEventPostTargetSelectionPage({ event });
    }
  };

  return { redirectEventPostTargetSelectionPage };
}
