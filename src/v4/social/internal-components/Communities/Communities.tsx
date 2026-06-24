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
  const [activeTab, setActiveTab] = useState<Key>(CommunitiesTab.Explore);

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
            ...(!hideExplore
              ? [
                  {
                    value: CommunitiesTab.Explore,
                    label: exploreLabel,
                    content: () => <Explore pageId={pageId} />,
                  },
                ]
              : []),
            {
              value: CommunitiesTab.MyCommunities,
              label: myCommunitiesLabel,
              content: () => <MyCommunities pageId={pageId} />,
            },
          ]}
        />
      )}
    </section>
  );
}
