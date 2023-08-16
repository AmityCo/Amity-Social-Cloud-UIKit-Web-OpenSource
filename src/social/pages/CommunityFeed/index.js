import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

import {
  EventSubscriberRepository,
  FeedType,
  getCommunityTopic,
  PostTargetType,
  SubscriptionLevels,
} from '@amityco/js-sdk';
import { FormattedMessage } from 'react-intl';
import CommunityCreatedModal from '~/social/components/CommunityCreatedModal';

import useCommunity from '~/social/hooks/useCommunity';

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
import {BackButton, Header, Title} from "~/social/pages/CategoryCommunities/styles";
import ArrowLeft from "~/icons/ArrowLeft";
import {PageTypes} from "~/social/constants";
import {useNavigation} from "~/social/providers/NavigationProvider";

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
        community?.postSetting,
        community?.isJoined,
        canReviewCommunityPosts,
        pendingPostCount,
      ),
    [community?.postSetting, community?.isJoined, canReviewCommunityPosts, pendingPostCount],
  );

  const [activeTab, setActiveTab] = useState(CommunityFeedTabs.TIMELINE);
  const { onBack, lastPage } = useNavigation();

  useEffect(() => {
    const topic = getCommunityTopic(community, SubscriptionLevels.POST);
    EventSubscriberRepository.subscribe(topic);

    return () => EventSubscriberRepository.unsubscribe(topic);
    // eslint-disable-next-line
  }, [community.id]);

  useEffect(() => {
    if (!tabs.find((tab) => tab.value === activeTab)) {
      setActiveTab(tabs[0].value);
    }
  }, [activeTab, tabs]);

  const isJoined = !!community?.isJoined;

  const [isCreatedModalOpened, setCreatedModalOpened] = useState(isNewCommunity);

  return (
    <Wrapper>
      <Header>
        <BackButton onClick={onBack}>
          <ArrowLeft height={14} />
        </BackButton>

        {lastPage.type === PageTypes.NewsFeed && (
            <Title>{"Main Feed"}</Title>
        )}

        {lastPage.type === PageTypes.Search && (
            <Title>{"Search & Communities"}</Title>
        )}

        {lastPage.type === PageTypes.UserFeed && (
            <Title>{"User Feed"}</Title>
        )}

        {lastPage.type === PageTypes.Explore && (
            <Title>{"Explore"}</Title>
        )}

        {lastPage.type === PageTypes.Category && (
            <Title>{"Communities"}</Title>
        )}

      </Header>
      <CommunityInfo communityId={communityId} />

      <FeedHeaderTabs
        data-qa-anchor="community-feed-header"
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === CommunityFeedTabs.TIMELINE && (
        <Feed
          targetType={PostTargetType.CommunityFeed}
          targetId={communityId}
          readonly={!isJoined}
          showPostCreator={isJoined}
          feedType={FeedType.Published}
        />
      )}

      {activeTab === CommunityFeedTabs.GALLERY && (
        <MediaGallery targetType={PostTargetType.CommunityFeed} targetId={communityId} />
      )}

      {activeTab === CommunityFeedTabs.MEMBERS && <CommunityMembers communityId={communityId} />}

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
