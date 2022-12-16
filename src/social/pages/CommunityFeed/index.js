import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

import { FeedType, PostTargetType } from '@amityco/js-sdk';
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

const ADMIN_ONLY_POST_SETTING = 'ONLY_ADMIN_CAN_POST';

const CommunityFeed = ({
  communityId,
  currentUserId,
  isNewCommunity,
  handleCopyPostPath,
  handleCopyCommentPath,
}) => {
  const { community } = useCommunity(communityId);
  const { canReviewCommunityPosts, hasModeratorPermissions } = useCommunityOneMember(
    communityId,
    currentUserId,
    community.userId,
  );

  const isJoined = !!community?.isJoined;
  const isAdminOnly = community?.postSetting === ADMIN_ONLY_POST_SETTING;
  const pendingPostCount = community.reviewingFeed?.postCount ?? 0;
  const canCreatePosts = isJoined && isAdminOnly ? hasModeratorPermissions : true;

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
    if (!tabs.find((tab) => tab.value === activeTab)) {
      setActiveTab(tabs[0].value);
    }
  }, [activeTab, tabs]);

  const [isCreatedModalOpened, setCreatedModalOpened] = useState(isNewCommunity);

  return (
    <Wrapper>
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
          showPostCreator={canCreatePosts}
          feedType={FeedType.Published}
          handleCopyPostPath={handleCopyPostPath}
          handleCopyCommentPath={handleCopyCommentPath}
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
            handleCopyPostPath={handleCopyPostPath}
            handleCopyCommentPath={handleCopyCommentPath}
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
  handleCopyPostPath: PropTypes.func,
  handleCopyCommentPath: PropTypes.func,
};

CommunityFeed.defaultProps = {
  isNewCommunity: false,
};

export default withSDK(CommunityFeed);
