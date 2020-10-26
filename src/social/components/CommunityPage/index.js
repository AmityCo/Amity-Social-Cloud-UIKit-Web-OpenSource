import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { EkoPostTargetType } from 'eko-sdk';

import useCommunity from '~/social/hooks/useCommunity';

import ConditionalRender from '~/core/components/ConditionalRender';

import Feed from '~/social/components/Feed';
import CommunityInfo from '~/social/components/CommunityInfo';
import CommunityMembers from '~/social/components/CommunityMembers';

import { PageWrapper, FeedHeaderTabs, PageMain } from './styles';

// TODO replace with translations keys
// TODO: react-intl
const tabs = {
  TIMELINE: 'Timeline',
  MEMBERS: 'Members',
};

const CommunityPage = ({
  communityId,
  onPostAuthorClick,
  onMemberClick,
  onEditCommunityClick,
  blockRouteChange,
  shouldHideTabs = false,
}) => {
  const [activeTab, setActiveTab] = useState(tabs.TIMELINE);
  const { community } = useCommunity(communityId);
  const canMemberPost = !!community?.isJoined;

  return (
    <PageWrapper>
      <PageMain>
        {!shouldHideTabs && (
          <FeedHeaderTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        )}
        <ConditionalRender condition={activeTab === tabs.TIMELINE}>
          <Feed
            targetType={EkoPostTargetType.CommunityFeed}
            targetId={communityId}
            blockRouteChange={blockRouteChange}
            showPostCreator={canMemberPost}
            onPostAuthorClick={onPostAuthorClick}
          />
        </ConditionalRender>
        <ConditionalRender condition={activeTab === tabs.MEMBERS}>
          <CommunityMembers communityId={communityId} onMemberClick={onMemberClick} />
        </ConditionalRender>
      </PageMain>
      <CommunityInfo communityId={communityId} onEditCommunityClick={onEditCommunityClick} />
    </PageWrapper>
  );
};

CommunityPage.propTypes = {
  communityId: PropTypes.string.isRequired,
  onPostAuthorClick: PropTypes.func,
  onMemberClick: PropTypes.func,
  onEditCommunityClick: PropTypes.func,
  blockRouteChange: PropTypes.func,
  shouldHideTabs: PropTypes.bool,
};

export default CommunityPage;
