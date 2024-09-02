import React, { useRef, useState } from 'react';
import styles from './CommunityProfilePage.module.css';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { CommunityHeader } from '~/v4/social/components/CommunityHeader';
import { CommunityFeed } from '~/v4/social/components/CommunityFeed';
import { CommunityProfileSkeleton } from '~/v4/social/pages/CommunityProfilePage/CommunityProfilePageSkeleton';
import { useCommunityTabContext } from '~/v4/core/providers/CommunityTabProvider';
import { CommunityPin } from '~/v4/social/components/CommunityPin';
import useCommunity from '~/v4/core/hooks/collections/useCommunity';
import { RefreshSpinner } from '~/v4/icons/RefreshSpinner';

interface CommunityProfileProps {
  communityId: string;
}

export const CommunityProfilePage: React.FC<CommunityProfileProps> = ({ communityId }) => {
  const { activeTab } = useCommunityTabContext();
  const pageId = 'community_profile_page';
  const { themeStyles, accessibilityId } = useAmityPage({
    pageId,
  });
  const { community } = useCommunity({
    communityId,
    shouldCall: !!communityId,
  });
  const containerRef = useRef(null);

  const touchStartY = useRef(0);
  const [touchDiff, setTouchDiff] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'community_feed':
        return <CommunityFeed pageId={pageId} communityId={communityId} />;
      case 'community_pin':
        return <CommunityPin pageId={pageId} communityId={communityId} />;
      default:
        return null;
    }
  };

  const handleRefresh = async () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <div
      ref={containerRef}
      data-qa-anchor={accessibilityId}
      className={styles.communityProfilePage__container}
      style={themeStyles}
      onDrag={(event) => event.stopPropagation()}
      onTouchStart={(e) => {
        touchStartY.current = e.touches[0].clientY;
      }}
      onTouchMove={(e) => {
        const touchY = e.touches[0].clientY;

        if (touchStartY.current > touchY) {
          return;
        }

        setTouchDiff(Math.min(touchY - touchStartY.current, 100));
      }}
      onTouchEnd={(e) => {
        touchStartY.current = 0;
        if (touchDiff >= 75) {
          handleRefresh();
        }
        setTouchDiff(0);
      }}
    >
      <div
        style={
          {
            '--asc-pull-to-refresh-height': `${touchDiff}px`,
          } as React.CSSProperties
        }
        className={styles.communityProfilePage__pullToRefresh}
      >
        <RefreshSpinner className={styles.communityProfilePage__pullToRefresh__spinner} />
      </div>

      {community ? <CommunityHeader community={community} /> : <CommunityProfileSkeleton />}

      <div key={refreshKey}>{renderTabContent()}</div>
    </div>
  );
};
