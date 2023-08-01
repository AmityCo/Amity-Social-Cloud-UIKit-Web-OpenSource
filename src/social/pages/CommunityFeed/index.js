import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

import {
  EventSubscriberRepository,
  FeedType,
  PostRepository,
  PostTargetType,
  SubscriptionLevels,
  getCommunityTopic,
} from '@amityco/js-sdk';
import { FormattedMessage } from 'react-intl';
import CommunityCreatedModal from '~/social/components/CommunityCreatedModal';

import useCommunity from '~/social/hooks/useCommunity';

import withSDK from '~/core/hocs/withSDK';
import useCommunityOneMember from '~/social/hooks/useCommunityOneMember';

import CommunityInfo from '~/social/components/CommunityInfo';
import CommunityMembers from '~/social/components/CommunityMembers';
import Feed from '~/social/components/Feed';
import FeedHeaderTabs from '~/social/components/FeedHeaderTabs';
import MediaGallery from '~/social/components/MediaGallery';
import Post from '~/social/components/post/Post';
import { CommunityFeedTabs } from './constants';
import { DeclineBanner, Wrapper } from './styles';
import { getTabs } from './utils';

const postLiveObject = PostRepository.postForId('64b6ab1efc7ca338eeced8b1');
postLiveObject.once('dataUpdated', (model) => {
  console.log('Post', model.data.text);
});

const CommunityFeed = ({
  communityId,
  currentUserId,
  isNewCommunity,
  targetType = '',
  readonly = false,
  pinned,
}) => {
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
      <CommunityInfo communityId={communityId} />
      {communityId === '649b243a2b963c70c54750bf' && (
        <Post
          postId="64c825313b7d23040b7c2abc"
          hidePostTarget={targetType !== PostTargetType.GlobalFeed}
          readonly={readonly}
          pinned={pinned}
        />
      )}

      <FeedHeaderTabs
        data-qa-anchor="community-feed-header"
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === CommunityFeedTabs.TIMELINE && (
        <Feed
          className="pb-[68px]"
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
  targetType: PropTypes.string,
  readonly: PropTypes.bool,
  pinned: PropTypes.string,
};

CommunityFeed.defaultProps = {
  isNewCommunity: false,
};

export default withSDK(CommunityFeed);
