import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { EkoPostTargetType } from 'eko-sdk';

import useCommunity from '~/social/hooks/useCommunity';

import ConditionalRender from '~/core/components/ConditionalRender';
import PageLayout from '~/social/layouts/Page';

import Feed from '~/social/components/Feed';
import CommunityInfo from '~/social/components/CommunityInfo';
import CommunityMembers from '~/social/components/CommunityMembers';
import FeedHeaderTabs from '~/social/components/FeedHeaderTabs';

// TODO replace with translations keys
// TODO: react-intl
const tabs = {
  TIMELINE: 'Timeline',
  MEMBERS: 'Members',
};

const CommunityFeed = ({ communityId, onClickUser }) => {
  const [activeTab, setActiveTab] = useState(tabs.TIMELINE);

  const { community } = useCommunity(communityId);
  const isJoined = !!community?.isJoined;

  return (
    <PageLayout aside={<CommunityInfo communityId={communityId} />}>
      <FeedHeaderTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <ConditionalRender condition={activeTab === tabs.TIMELINE}>
        <Feed
          targetType={EkoPostTargetType.CommunityFeed}
          targetId={communityId}
          showPostCreator={isJoined}
          noPostInteractionMessage={isJoined ? null : 'Join community to interact with all posts'}
          onClickUser={onClickUser}
        />
      </ConditionalRender>

      <ConditionalRender condition={activeTab === tabs.MEMBERS}>
        <CommunityMembers communityId={communityId} onClickUser={onClickUser} />
      </ConditionalRender>
    </PageLayout>
  );
};

CommunityFeed.propTypes = {
  communityId: PropTypes.string.isRequired,
  onClickUser: PropTypes.func,
};

CommunityFeed.defaultProps = {
  onClickUser: () => {},
};

export default CommunityFeed;
