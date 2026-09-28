import { Key } from 'react-aria';
import { useString } from '~/v4/core/localization';
import { useState } from 'react';
import { Plus } from '~/v4/icons/Plus';
import useSDK from '~/v4/core/hooks/useSDK';
import { Tabs, Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/components/AriaButton';
import { AmityCommunitySetupPageMode } from '~/v4/social/pages';
import { Explore, MyCommunities } from '~/v4/social/components';
import { useConfig } from '~/v4/social/providers/ConfigProvider';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { COMPONENT_ID } from '~/v4/constants/customization';
import styles from './Communities.module.css';

enum CommunitiesTab {
  Explore = 'Explore',
  MyCommunities = 'My Communities',
}

type CommunitiesProps = {
  pageId?: string;
};

export function Communities({ pageId }: CommunitiesProps) {
  const { isVisitorOrBot } = useSDK();
  const { goToCreateCommunityPage } = useNavigation();
  const { socialCommunityCreationButtonVisible, hideExplore } = useConfig();
  // The tab has to ask the same question its content does, or Discovery off
  // leaves a tab that opens on nothing — the label is the door and the door
  // belongs to the room.
  const { isExcluded: isExploreExcluded } = useAmityComponent({
    pageId: pageId ?? '*',
    componentId: COMPONENT_ID.EXPLORE_COMPONENT,
  });
  const showExplore = !hideExplore && !isExploreExcluded;
  const [activeTab, setActiveTab] = useState<Key>(
    // Landing on a tab that is not there leaves the panel blank until someone
    // presses the other one.
    showExplore ? CommunitiesTab.Explore : CommunitiesTab.MyCommunities,
  );

  const communitiesTitle = useString('amity_social_tab_tab_communities');
  const exploreLabel = useString('amity_social_tab_tab_explore');
  const myCommunitiesLabel = useString('amity_social_button_my_communities');

  return (
    <section className={styles.communities}>
      {!isVisitorOrBot && (
        <div className={styles.communities__header} data-has-tabs={!isVisitorOrBot}>
          <Typography.Headline>{communitiesTitle}</Typography.Headline>

          {socialCommunityCreationButtonVisible && (
            <Button
              icon={<Plus />}
              variant="default"
              aria-label="Create community"
              data-testid="create-community-button"
              iconClassName={styles.communities__header__icon}
              onPress={() => {
                goToCreateCommunityPage?.({ mode: AmityCommunitySetupPageMode.CREATE });
              }}
            />
          )}
        </div>
      )}

      {isVisitorOrBot ? (
        <Explore pageId={pageId} />
      ) : (
        <Tabs
          variant="underlined"
          value={activeTab}
          onChange={setActiveTab}
          tabListClassName={styles.communities__tabList}
          tabPanelClassName={styles.communities__tabPanel}
          tabs={[
            ...(showExplore
              ? [
                  {
                    value: CommunitiesTab.Explore,
                    label: exploreLabel,
                    accessibilityId: 'explore-communities-tab',
                    content: () => <Explore pageId={pageId} />,
                  },
                ]
              : []),
            {
              value: CommunitiesTab.MyCommunities,
              label: myCommunitiesLabel,
              accessibilityId: 'my-communities-tab',
              content: () => <MyCommunities pageId={pageId} />,
            },
          ]}
        />
      )}
    </section>
  );
}
