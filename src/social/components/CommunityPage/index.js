import React, { useState } from 'react';
import { EkoPostTargetType } from 'eko-sdk';

import { ConditionalRender } from '~/core/components/ConditionalRender';
import CommunityInfo from '~/social/components/CommunityInfo';
import Feed from '~/social/components/Feed';
import CommunityMembers from '~/social/components/Community/CommunityMembers';
import useCommunity from '~/social/hooks/useCommunity';
import { PageWrapper, FeedHeaderTabs, PageMain } from './styles';

const tabKeys = {
  TIMELINE: 'TIMELINE',
  MEMBERS: 'MEMBERS',
};

// TODO replace with translations keys
// TODO: react-intl
const tabs = {
  [tabKeys.TIMELINE]: 'Timeline',
  [tabKeys.MEMBERS]: 'Members',
};

const CommunityPage = ({
  communityId,
  onPostAuthorClick,
  onMemberClick,
  onEditCommunityClick,
  blockRouteChange,
}) => {
  const [activeTab, setActiveTab] = useState(tabKeys.TIMELINE);
  const { community } = useCommunity(communityId);
  const canMemberPost = !!community?.isJoined;

  return (
    <PageWrapper>
      <PageMain>
        <FeedHeaderTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        <ConditionalRender condition={activeTab === tabKeys.TIMELINE}>
          <Feed
            targetType={EkoPostTargetType.CommunityFeed}
            targetId={communityId}
            blockRouteChange={blockRouteChange}
            showPostCompose={canMemberPost}
            onPostAuthorClick={onPostAuthorClick}
          />
        </ConditionalRender>
        <ConditionalRender condition={activeTab === tabKeys.MEMBERS}>
          <CommunityMembers communityId={communityId} onMemberClick={onMemberClick} />
        </ConditionalRender>
      </PageMain>
      <CommunityInfo communityId={communityId} onEditCommunityClick={onEditCommunityClick} />
    </PageWrapper>
  );
};

export default CommunityPage;
