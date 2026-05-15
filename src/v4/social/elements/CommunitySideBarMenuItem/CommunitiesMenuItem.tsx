import Users from '~/v4/icons/Users';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { HomePageTab } from '~/v4/social/constants/HomePageTab';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';
import { CommunitySideBarMenuItem } from '~/v4/social/elements/CommunitySideBarMenuItem';

type CommunitiesMenuItemProps = {
  pageId?: string;
  componentId?: string;
};

export function CommunitiesMenuItem({ pageId = '*', componentId = '*' }: CommunitiesMenuItemProps) {
  const elementId = 'communities_sidebar_menu_item';

  const { onChangePage, page } = useNavigation();
  const { activeTab, setActiveTab } = useLayoutContext();
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
      isActive={page.type === PageTypes.SocialHomePage && activeTab === HomePageTab.Communities}
      onPress={() => {
        setActiveTab(HomePageTab.Communities);
        onChangePage(PageTypes.SocialHomePage);
      }}
      icon={(props) => (
        <IconComponent
          configIconName={config.icon}
          defaultIconName={defaultConfig.icon}
          defaultIcon={() => <Users {...props} />}
          imgIcon={() => <img src={config.icon} alt={uiReference} />}
        />
      )}
    >
      {resolveText('amity_social_tab_tab_communities')}
    </CommunitySideBarMenuItem>
  );
}
