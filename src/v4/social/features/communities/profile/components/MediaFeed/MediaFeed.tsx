import { useState } from 'react';
import { resolveString } from '~/v4/core/localization';
import ChipButton from '~/v4/social/elements/ChipButton';
import { CommunityVideoFeed } from '~/v4/social/components';
import useCommunity from '~/v4/core/hooks/collections/useCommunity';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import { MEDIA_TABS, MediaTabType } from '~/v4/social/constants/mediaTabs';
import { CommunityClipFeed } from '~/v4/social/components/CommunityClipFeed';
import { CommunityImageFeed } from '~/v4/social/components/CommunityImageFeed';
import LockPrivateContent from '~/v4/social/internal-components/LockPrivateContent';
import styles from './MediaFeed.module.css';

type CommunityMediaFeedProps = {
  pageId?: string;
  communityId: string;
};

export const CommunityMediaFeed = ({ pageId = '*', communityId }: CommunityMediaFeedProps) => {
  const { linkToPost } = useLayoutContext();
  const [activeTab, setActiveTab] = useState<MediaTabType>(
    linkToPost ? linkToPost.mediaTab : MediaTabType.IMAGES,
  );

  const { community } = useCommunity({ communityId, shouldCall: !!communityId });

  if (!community?.isJoined && !community?.isPublic)
    return (
      <section className={styles.communityMediaFeed} data-testid="community-media-feed">
        <LockPrivateContent />
      </section>
    );

  return (
    <section className={styles.communityMediaFeed} data-testid="community-media-feed">
      <div className={styles.communityMediaFeed__tabs}>
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
      <div className={styles.communityMediaFeed__content}>
        {activeTab === MediaTabType.IMAGES && (
          <CommunityImageFeed pageId={pageId} communityId={communityId} />
        )}
        {activeTab === MediaTabType.VIDEOS && (
          <CommunityVideoFeed pageId={pageId} communityId={communityId} />
        )}
        {activeTab === MediaTabType.CLIPS && (
          <CommunityClipFeed pageId={pageId} communityId={communityId} />
        )}
      </div>
    </section>
  );
};
