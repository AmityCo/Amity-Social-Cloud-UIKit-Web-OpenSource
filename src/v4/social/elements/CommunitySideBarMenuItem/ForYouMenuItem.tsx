import React from 'react';
import { FeedRepository } from '@amityco/ts-sdk';
import Home from '~/v4/icons/Home';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { ELEMENT_ID } from '~/v4/constants/customization';
import { HomePageTab } from '~/v4/social/constants/HomePageTab';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';
import { CommunitySideBarMenuItem } from '~/v4/social/elements/CommunitySideBarMenuItem';
import { useForYouFeedCollection } from '~/v4/social/hooks/collections/useForYouFeedCollection';
import useSDK from '~/v4/core/hooks/useSDK';

type ForYouMenuItemProps = {
  pageId?: string;
  componentId?: string;
};

export function ForYouMenuItem({ pageId = '*', componentId = '*' }: ForYouMenuItemProps) {
  const elementId = ELEMENT_ID.FOR_YOU_SIDEBAR_MENU_ITEM;

  const { isVisitorOrBot } = useSDK();
  const { onChangePage, page } = useNavigation();
  const { activeTab, setActiveTab } = useLayoutContext();
  const { accessibilityId, config, isExcluded, defaultConfig, uiReference, resolveText } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  const { error: forYouError } = useForYouFeedCollection({ shouldCall: !isVisitorOrBot });

  const forYouEnabled = !(forYouError instanceof FeedRepository.AmityForYouFeedDisabledError);

  if (isExcluded || isVisitorOrBot || !forYouEnabled) return null;

  return (
    <CommunitySideBarMenuItem
      accessibilityId={accessibilityId}
      isActive={page.type === PageTypes.SocialHomePage && activeTab === HomePageTab.ForYou}
      onPress={() => {
        setActiveTab(HomePageTab.ForYou);
        onChangePage(PageTypes.SocialHomePage);
      }}
      icon={(props) => (
        <IconComponent
          configIconName={config.icon}
          defaultIconName={defaultConfig.icon}
          defaultIcon={() => <Home {...props} />}
          imgIcon={() => <img src={config.icon} alt={uiReference} />}
        />
      )}
    >
      {resolveText('amity_social_button_social_home_for_you_button')}
    </CommunitySideBarMenuItem>
  );
}
