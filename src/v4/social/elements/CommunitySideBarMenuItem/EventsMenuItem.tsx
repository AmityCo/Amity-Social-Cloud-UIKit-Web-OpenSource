import Event from '~/v4/icons/Events';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { HomePageTab } from '~/v4/social/constants/HomePageTab';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';
import { CommunitySideBarMenuItem } from '~/v4/social/elements/CommunitySideBarMenuItem';
import { useSocialHomePageTab } from '~/v4/social/features/home/hooks';

type EventsMenuItemProps = {
  pageId?: string;
  componentId?: string;
};

export function EventsMenuItem({ pageId = '*', componentId = '*' }: EventsMenuItemProps) {
  const elementId = 'events_sidebar_menu_item';

  const { onChangePage, page } = useNavigation();
  const { activeTab, setActiveTab } = useLayoutContext();
  const [, setPersistedTab] = useSocialHomePageTab();
  const { accessibilityId, config, isExcluded, defaultConfig, uiReference, resolveText } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <CommunitySideBarMenuItem
      accessibilityId={accessibilityId}
      isActive={page.type === PageTypes.SocialHomePage && activeTab === HomePageTab.Events}
      onPress={() => {
        setActiveTab(HomePageTab.Events);
        setPersistedTab(HomePageTab.Events);
        onChangePage(PageTypes.SocialHomePage);
      }}
      icon={(props) => (
        <IconComponent
          configIconName={config.icon}
          defaultIconName={defaultConfig.icon}
          defaultIcon={() => <Event {...props} />}
          imgIcon={() => <img src={config.icon} alt={uiReference} />}
        />
      )}
    >
      {resolveText('amity_social_button_social_home_events_button')}
    </CommunitySideBarMenuItem>
  );
}
