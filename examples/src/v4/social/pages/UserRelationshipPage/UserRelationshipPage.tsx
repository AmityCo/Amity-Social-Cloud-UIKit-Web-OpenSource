import React, { useState, FC } from 'react';
import styles from './UserRelationshipPage.module.css';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { BackButton } from '~/v4/social/elements/BackButton';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { Typography } from '~/v4/core/components';
import { SecondaryTab } from '~/v4/core/components/SecondaryTab';
import { UserFollowingTabContent } from './TabContent/UserFollowingTabContent';
import { UserFollowerTabContent } from './TabContent/UserFollowerTabContent';

export const enum UserRelationshipPageTabs {
  FOLLOWING = 'following',
  FOLLOWER = 'followers',
}
type UserRelationshipPageProps = {
  userId: string;
  selectedTab: UserRelationshipPageTabs;
};

export const UserRelationshipPage: FC<UserRelationshipPageProps> = ({ userId, selectedTab }) => {
  const pageId = 'user_releationship_page';

  const { themeStyles } = useAmityPage({ pageId });
  const { user } = useUser({ userId });
  const { onBack } = useNavigation();

  const [currentActiveTab, setCurrentActiveTab] = useState<UserRelationshipPageTabs>(selectedTab);

  const tabs = [
    {
      label: 'Following',
      value: UserRelationshipPageTabs.FOLLOWING,
      content: () => {
        return <UserFollowingTabContent userId={userId} />;
      },
    },
    {
      label: 'Followers',
      value: UserRelationshipPageTabs.FOLLOWER,
      content: () => {
        return <UserFollowerTabContent userId={userId} />;
      },
    },
  ];

  return (
    <div className={styles.userRelationshipPage} style={themeStyles}>
      <div className={styles.userRelationshipPage__container}>
        <div className={styles.userRelationshipPage__topSection}>
          <div className={styles.userRelationshipPage__topBar}>
            <BackButton pageId={pageId} onPress={() => onBack()} />
            <Typography.TitleBold className={styles.userRelationshipPage__displayName}>
              {user?.displayName}
            </Typography.TitleBold>
          </div>
        </div>
        <div className={styles.userRelationshipPage__content}>
          <SecondaryTab
            className={styles.userRelationshipPage__tabBar}
            tabs={tabs}
            activeTab={currentActiveTab}
            onChange={(key) => setCurrentActiveTab(key as UserRelationshipPageTabs)}
            tabListClassName={styles.userRelationshipPage__tabList}
            tabPanelClassName={styles.userRelationshipPage__tabPanel}
          />
        </div>
      </div>
    </div>
  );
};
