import React from 'react';
import Global from '~/v4/icons/Global';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { HomePageTab } from '~/v4/social/constants/HomePageTab';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';
import { CommunitySideBarMenuItem } from '~/v4/social/elements/CommunitySideBarMenuItem';
import { IconComponent } from '~/v4/core/IconComponent';

type ExploreMenuItemProps = {
  pageId?: string;
  componentId?: string;
};

export function ExploreMenuItem({ pageId = '*', componentId = '*' }: ExploreMenuItemProps) {
  const elementId = 'explore_sidebar_menu_item';

  const { onChangePage, page } = useNavigation();
  const { activeTab, setActiveTab } = useLayoutContext();
  const { accessibilityId, config, isExcluded, defaultConfig, uiReference } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <CommunitySideBarMenuItem
      accessibilityId={accessibilityId}
      isActive={page.type === PageTypes.SocialHomePage && activeTab === HomePageTab.Explore}
      onPress={() => {
        setActiveTab(HomePageTab.Explore);
        onChangePage(PageTypes.SocialHomePage);
      }}
      icon={(props) => (
        <IconComponent
          configIconName={config.icon}
          defaultIconName={defaultConfig.icon}
          defaultIcon={() => <Global {...props} />}
          imgIcon={() => <img src={config.icon} alt={uiReference} />}
        />
      )}
    >
      {config.text}
    </CommunitySideBarMenuItem>
  );
}
