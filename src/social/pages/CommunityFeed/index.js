import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

import { FeedType, PostTargetType } from '@amityco/js-sdk';
import { FormattedMessage } from 'react-intl';
import CommunityCreatedModal from '~/social/components/CommunityCreatedModal';

import useCommunity from '~/social/hooks/useCommunity';

import ConditionalRender from '~/core/components/ConditionalRender';
import withSDK from '~/core/hocs/withSDK';
import useCommunityOneMember from '~/social/hooks/useCommunityOneMember';

import Feed from '~/social/components/Feed';
import MediaGallery from '~/social/components/MediaGallery';
import CommunityInfo from '~/social/components/CommunityInfo';
import CommunityMembers from '~/social/components/CommunityMembers';
import FeedHeaderTabs from '~/social/components/FeedHeaderTabs';
import { CommunityFeedTabs } from './constants';
import { getTabs } from './utils';
import { DeclineBanner, Wrapper } from './styles';

const CommunityFeed = ({ communityId, currentUserId, isNewCommunity }) => {
  const { community } = useCommunity(communityId);
  const { canReviewCommunityPosts } = useCommunityOneMember(
    communityId,
    currentUserId,
    community.userId,
  );

  const pendingPostCount = community.reviewingFeed?.postCount ?? 0;

  const tabs = useMemo(
    () =>
      getTabs(
        community?.needApprovalOnPostCreation,
        community?.isJoined,
        canReviewCommunityPosts,
        pendingPostCount,
      ),
    [
      community?.needApprovalOnPostCreation,
      community?.isJoined,
      canReviewCommunityPosts,
      pendingPostCount,
    ],
  );

  const [activeTab, setActiveTab] = useState(CommunityFeedTabs.TIMELINE);

  useEffect(() => {
    if (!tabs.find(tab => tab.value === activeTab)) {
      setActiveTab(tabs[0].value);
    }
  }, [activeTab, tabs]);

  const isJoined = !!community?.isJoined;

  const [isCreatedModalOpened, setCreatedModalOpened] = useState(isNewCommunity);

  return (
    <Wrapper>
      <CommunityInfo communityId={communityId} />

      <FeedHeaderTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <ConditionalRender condition={activeTab === CommunityFeedTabs.TIMELINE}>
        <Feed
          targetType={PostTargetType.CommunityFeed}
          targetId={communityId}
          readonly={!isJoined}
          showPostCreator={isJoined}
          feedType={FeedType.Published}
        />
      </ConditionalRender>

      {activeTab === CommunityFeedTabs.GALLERY && (
        <MediaGallery targetType={PostTargetType.CommunityFeed} targetId={communityId} />
      )}

      <ConditionalRender condition={activeTab === CommunityFeedTabs.MEMBERS}>
        <CommunityMembers communityId={communityId} />
      </ConditionalRender>

      {activeTab === CommunityFeedTabs.PENDING && (
        <>
          {canReviewCommunityPosts && (
            <DeclineBanner>
              <FormattedMessage id="community.review.declinePendingPosts" />
            </DeclineBanner>
          )}
          <Feed
            targetType={PostTargetType.CommunityFeed}
            targetId={communityId}
            readonly={!isJoined}
            showPostCreator={false}
            feedType={FeedType.Reviewing}
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

CommunityFeed.propTypes = {
  communityId: PropTypes.string.isRequired,
  currentUserId: PropTypes.string.isRequired,
  isNewCommunity: PropTypes.bool,
};

CommunityFeed.defaultProps = {
  isNewCommunity: false,
};

export default withSDK(CommunityFeed);
