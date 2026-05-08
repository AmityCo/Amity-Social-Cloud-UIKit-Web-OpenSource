import { useState } from 'react';
import { resolveString } from '~/v4/core/localization';
import { FeedSourceEnum } from '@amityco/ts-sdk';
import ChipButton from '~/v4/social/elements/ChipButton';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import { MEDIA_TABS, MediaTabType } from '~/v4/social/constants/mediaTabs';
import { UserImageFeed, UserVideoFeed, UserClipFeed } from '~/v4/social/components';
import styles from './MediaFeed.module.css';

type UserMediaFeedProps = {
  userId: string;
  pageId?: string;
  feedSources?: FeedSourceEnum[];
  followStatus?: Amity.FollowStatus['status'] | null;
};

export const UserMediaFeed = ({
  pageId = '*',
  userId,
  feedSources,
  followStatus,
}: UserMediaFeedProps) => {
  const { linkToPost } = useLayoutContext();
  const [activeTab, setActiveTab] = useState<MediaTabType>(
    linkToPost ? linkToPost.mediaTab : MediaTabType.IMAGES,
  );

  return (
    <section className={styles.userMediaFeed} data-testid="user-media-feed">
      <div className={styles.userMediaFeed__tabs}>
        {MEDIA_TABS.map((tab) => {
          const tabLabel =
            tab.type === MediaTabType.IMAGES
              ? resolveString('amity_social_tab_tab_photos')
              : tab.type === MediaTabType.VIDEOS
                ? resolveString('amity_social_tab_tab_videos')
                : resolveString('amity_social_tab_tab_clips');
          return (
            <ChipButton
              key={tab.type}
              variant="body"
              label={tabLabel}
              isTransparent={false}
              aria-label={tabLabel}
              isActive={activeTab === tab.type}
              data-testid={`chip-button-${tab.type}`}
              onPress={() => setActiveTab(tab.type)}
            />
          );
        })}
      </div>
      <div className={styles.userMediaFeed__content}>
        {activeTab === MediaTabType.IMAGES && (
          <UserImageFeed
            pageId={pageId}
            userId={userId}
            feedSources={feedSources}
            followStatus={followStatus}
          />
        )}
        {activeTab === MediaTabType.VIDEOS && (
          <UserVideoFeed
            pageId={pageId}
            userId={userId}
            feedSources={feedSources}
            followStatus={followStatus}
          />
        )}
        {activeTab === MediaTabType.CLIPS && (
          <UserClipFeed
            pageId={pageId}
            userId={userId}
            feedSources={feedSources}
            followStatus={followStatus}
          />
        )}
      </div>
    </section>
  );
};
