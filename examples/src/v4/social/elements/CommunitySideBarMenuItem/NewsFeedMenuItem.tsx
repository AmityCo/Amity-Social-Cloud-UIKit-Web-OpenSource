import React from 'react';
import Newspaper from '~/v4/icons/Newspaper';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { HomePageTab } from '~/v4/social/constants/HomePageTab';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';
import { CommunitySideBarMenuItem } from '~/v4/social/elements/CommunitySideBarMenuItem';

type NewsFeedMenuItemProps = {
  pageId?: string;
  componentId?: string;
};

export function NewsFeedMenuItem({ pageId = '*', componentId = '*' }: NewsFeedMenuItemProps) {
  const elementId = 'newsfeed_sidebar_menu_item';

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
      isActive={page.type === PageTypes.SocialHomePage && activeTab === HomePageTab.Newsfeed}
      onPress={() => {
        setActiveTab(HomePageTab.Newsfeed);
        onChangePage(PageTypes.SocialHomePage);
      }}
      icon={(props) => (
        <IconComponent
          configIconName={config.icon}
          defaultIconName={defaultConfig.icon}
          defaultIcon={() => <Newspaper {...props} />}
          imgIcon={() => <img src={config.icon} alt={uiReference} />}
        />
      )}
    >
      {config.text}
    </CommunitySideBarMenuItem>
  );
}
