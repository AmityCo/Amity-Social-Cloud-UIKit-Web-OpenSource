import React, { useEffect, useMemo, useState } from 'react';

import { SubscriptionLevels } from '@amityco/ts-sdk';
import { FormattedMessage } from 'react-intl';
import CommunityCreatedModal from '~/social/components/CommunityCreatedModal';

import useCommunity from '~/social/hooks/useCommunity';

import Feed from '~/social/components/Feed';
import MediaGallery from '~/social/components/MediaGallery';
import CommunityInfo from '~/social/components/CommunityInfo';
import CommunityMembers from '~/social/components/CommunityMembers';
import FeedHeaderTabs from '~/social/components/FeedHeaderTabs';
import { CommunityFeedTabs } from './constants';
import { getTabs } from './utils';
import { DeclineBanner, Wrapper } from './styles';
import useCommunityPermission from '~/social/hooks/useCommunityPermission';
import useCommunitySubscription from '~/social/hooks/useCommunitySubscription';

import usePostsCollection from '~/social/hooks/collections/usePostsCollection';

import {
  CommunitySideMenuOverlay,
  HeadTitle,
  MobileContainer,
  StyledBarsIcon,
  StyledCommunitySideMenu,
} from '../NewsFeed/styles';

import { useNavigation } from '~/social/providers/NavigationProvider';
import { useGetActiveStoriesByTarget } from '~/v4/social/hooks/useGetActiveStories';

interface CommunityFeedProps {
  communityId: string;
  isNewCommunity: boolean;
  isOpen: boolean;
  toggleOpen: () => void;
}

const CommunityFeed = ({ communityId, isNewCommunity, isOpen, toggleOpen }: CommunityFeedProps) => {
  const { goToDraftStoryPage } = useNavigation();
  const { stories } = useGetActiveStoriesByTarget({
    targetId: communityId,
    targetType: 'community',
    options: {
      orderBy: 'asc',
      sortBy: 'createdAt',
    },
  });

  const community = useCommunity(communityId);

  const { canReview } = useCommunityPermission({ community });

  const { posts } = usePostsCollection({
    targetId: communityId,
    targetType: 'community',
    feedType: 'reviewing',
  });

  const pendingPostCount = posts.reduce((acc, post) => acc + post.flagCount, 0);

  const tabs = useMemo(
    () => getTabs(community?.postSetting, community?.isJoined, canReview, pendingPostCount),
    [community?.postSetting, community?.isJoined, canReview, pendingPostCount],
  );

  const [activeTab, setActiveTab] = useState(CommunityFeedTabs.TIMELINE);

  const isJoined = community?.isJoined || false;

  const [isCreatedModalOpened, setCreatedModalOpened] = useState(isNewCommunity);

  useEffect(() => {
    if (!tabs.find((tab) => tab.value === activeTab)) {
      setActiveTab(tabs[0].value);
    }
  }, [activeTab, tabs]);

  return (
    <Wrapper>
      <CommunitySideMenuOverlay isOpen={isOpen} onClick={toggleOpen} />
      <StyledCommunitySideMenu isOpen={isOpen} />
      <MobileContainer>
        <StyledBarsIcon onClick={toggleOpen} />
        <HeadTitle>
          <FormattedMessage id="sidebar.community" />
        </HeadTitle>
      </MobileContainer>
      <CommunityInfo communityId={communityId} stories={stories} />
      <FeedHeaderTabs
        data-qa-anchor="community-feed-header"
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === CommunityFeedTabs.TIMELINE && (
        <Feed
          targetType={'community'}
          targetId={communityId}
          readonly={!isJoined}
          showPostCreator={isJoined}
          feedType={'published'}
        />
      )}

      {activeTab === CommunityFeedTabs.GALLERY && (
        <MediaGallery targetType={'community'} targetId={communityId} grid />
      )}

      {activeTab === CommunityFeedTabs.MEMBERS && <CommunityMembers communityId={communityId} />}

      {activeTab === CommunityFeedTabs.PENDING && (
        <>
          {canReview && (
            <DeclineBanner>
              <FormattedMessage id="community.review.declinePendingPosts" />
            </DeclineBanner>
          )}
          <Feed
            targetType={'community'}
            targetId={communityId}
            readonly={!isJoined}
            showPostCreator={false}
            feedType={'reviewing'}
          />
        </>
      )}

      {isCreatedModalOpened && (
        <CommunityCreatedModal
          communityId={communityId}
          onClose={() => setCreatedModalOpened(false)}
        />
      )}
    </Wrapper>
  );
};

export default CommunityFeed;
