import React, { useEffect, useRef, useState } from 'react';
import styles from './PublicProfilePage.module.css';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { UserProfileHeader } from '~/v4/social/components/UserProfileHeader';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { UserFeedTabButton } from '~/v4/social/elements/UserFeedTabButton/UserFeedTabButton';
import { UserImageFeedTabButton } from '~/v4/social/elements/UserImageFeedTabButton/UserImageFeedTabButton';
import { UserVideoFeedTabButton } from '~/v4/social/elements/UserVideoFeedTabButton/UserVideoFeedTabButton';
import { PullToRefresh } from '~/v4/core/components/PullToRefresh';
import { UserFeed } from '~/v4/social/components/UserFeed/UserFeed';
import { UserImageFeed } from '~/v4/social/components/UserImageFeed/UserImageFeed';
import { UserVideoFeed } from '~/v4/social/components/UserVideoFeed/UserVideoFeed';
import { Typography } from '~/v4/core/components';
import { TopNavigation } from '~/v4/social/components/TopNavigation';
import { MasterTrophy } from '~/v4/icons/MasterTrophy';
import ChevronRight from '~/v4/icons/ChevronRight';

type PublicProfilePageProps = {
  userId: string;
  userBadgeTitle?: string;
};

const enum UserProfileTabs {
  FEED = 'feed',
  IMAGE = 'image',
  VIDEO = 'video',
}

export const PublicProfilePage: React.FC<PublicProfilePageProps> = ({ userId, userBadgeTitle }) => {
  const pageId = 'public_profile_page';
  const containerRef = useRef<HTMLDivElement>(null);

  const { themeStyles } = useAmityPage({ pageId });
  const { user } = useUser({ userId });

  const [isScroll, setIsScroll] = useState(false);
  const [currentActiveTab, setCurrentActiveTab] = React.useState<UserProfileTabs>(
    UserProfileTabs.FEED,
  );

  const onChangeTab = (tab: UserProfileTabs) => {
    setCurrentActiveTab(tab);
  };

  const renderTabContent = () => {
    if (currentActiveTab === UserProfileTabs.FEED) {
      return <UserFeed pageId={pageId} userId={userId} />;
    } else if (currentActiveTab === UserProfileTabs.IMAGE) {
      return <UserImageFeed pageId={pageId} userId={userId} />;
    } else if (currentActiveTab === UserProfileTabs.VIDEO) {
      return <UserVideoFeed pageId={pageId} userId={userId} />;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollPosition = containerRef.current.scrollTop;

        if (scrollPosition > 0) {
          setIsScroll(true);
        } else {
          setIsScroll(false);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const renderActivityTabs = () => {
    return (
      <div className={styles.publicProfilePage__feedTabs}>
        <UserFeedTabButton
          pageId={pageId}
          isActive={currentActiveTab === UserProfileTabs.FEED}
          onClick={() => onChangeTab(UserProfileTabs.FEED)}
        />
        <UserImageFeedTabButton
          pageId={pageId}
          isActive={currentActiveTab === UserProfileTabs.IMAGE}
          onClick={() => onChangeTab(UserProfileTabs.IMAGE)}
        />
        <UserVideoFeedTabButton
          pageId={pageId}
          isActive={currentActiveTab === UserProfileTabs.VIDEO}
          onClick={() => onChangeTab(UserProfileTabs.VIDEO)}
        />
      </div>
    );
  };

  return (
    <PullToRefresh className={styles.publicProfilePage} style={themeStyles}>
      <div className={styles.publicProfilePage__container} ref={containerRef}>
        <div className={styles.publicProfilePage__cardBorders}>
          <UserProfileHeader
            user={user}
            pageId={pageId}
            userBadgeTitle={userBadgeTitle}
            isCurrentUser={false}
            forcePublicProfileView={true}
          />
          {/* Public profile cta buttons */}
          <div className=""></div>
          <Typography.Caption className={styles.publicProfilePage__caption}>
            Appassionato di sport e giochi di squadra, ama le sfide e condividere emozioni con nuovi
            amici. Sempre pronto a tifare e a mettersi in gioco! Milano, Italia
          </Typography.Caption>

          <div className={styles.publicProfilePage__card}>
            <div className={styles.publicProfilePage__cardContentSection}>
              <Typography.BodyBold>Le sue info</Typography.BodyBold>
              <ChevronRight />
            </div>
            <div className={styles.publicProfilePage__cardContentSection}>
              preferenze di gioco, interessi , livello ...
            </div>
          </div>
        </div>

        {renderActivityTabs()}
        {renderTabContent()}
      </div>
    </PullToRefresh>
  );
};
