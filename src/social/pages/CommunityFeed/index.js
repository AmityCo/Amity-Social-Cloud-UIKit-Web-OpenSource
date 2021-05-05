import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { PostTargetType } from '@amityco/js-sdk';
import { FormattedMessage } from 'react-intl';

import useCommunity from '~/social/hooks/useCommunity';

import ConditionalRender from '~/core/components/ConditionalRender';
import PageLayout from '~/social/layouts/Page';

import Feed from '~/social/components/Feed';
import CommunityInfo from '~/social/components/CommunityInfo';
import CommunityMembers from '~/social/components/CommunityMembers';
import FeedHeaderTabs from '~/social/components/FeedHeaderTabs';

const tabs = {
  TIMELINE: <FormattedMessage id="tabs.timeline" />,
  MEMBERS: <FormattedMessage id="tabs.members" />,
};

const CommunityFeed = ({ communityId }) => {
  const [activeTab, setActiveTab] = useState(tabs.TIMELINE);

  const { community } = useCommunity(communityId);
  const isJoined = !!community?.isJoined;

  return (
    <PageLayout aside={<CommunityInfo communityId={communityId} />}>
      <FeedHeaderTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <ConditionalRender condition={activeTab === tabs.TIMELINE}>
        <Feed
          targetType={PostTargetType.CommunityFeed}
          targetId={communityId}
          readonly={!isJoined}
          showPostCreator={isJoined}
        />
      </ConditionalRender>

      <ConditionalRender condition={activeTab === tabs.MEMBERS}>
        <CommunityMembers communityId={communityId} />
      </ConditionalRender>
    </PageLayout>
  );
};

CommunityFeed.propTypes = {
  communityId: PropTypes.string.isRequired,
};

export default CommunityFeed;
