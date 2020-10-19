import React, { useState } from 'react';
import useCommunityMembers from '~/social/hooks/useCommunityMembers';
import { ConditionalRender } from '~/core/components/ConditionalRender';
import { LoadMore } from '~/social/components/LoadMore';
import { customizableComponent } from '~/core/hocs/customization';
import CommunityMemberItem from './CommunityMemberItem';
import { CommunityMembersContainer, CommunityMembersHeader, CommunityMembersTabs } from './styles';

// TODO replace with translations keys
// TODO: react-intl
const tabs = {
  MEMBERS: 'Members',
  MODERATORS: 'Moderators',
};

const CommunityMembers = ({ communityId, onMemberClick }) => {
  const [activeTab, setActiveTab] = useState(tabs.MEMBERS);

  const { members, hasMoreMembers, loadMoreMembers, membersCount } = useCommunityMembers(
    communityId,
  );

  // TODO - fetch and show moderators for community.
  const [moderators, hasMoreModerators, loadMoreModerators] = [[], false, () => {}];

  return (
    <CommunityMembersContainer>
      <CommunityMembersHeader>Community Members • {membersCount}</CommunityMembersHeader>
      <CommunityMembersTabs tabs={[tabs.MEMBERS]} activeTab={activeTab} onChange={setActiveTab} />
      <ConditionalRender condition={activeTab === tabs.MEMBERS}>
        <LoadMore hasMore={hasMoreMembers} loadMore={loadMoreMembers}>
          {members.length > 0 &&
            members.map(({ userId }) => (
              <CommunityMemberItem key={userId} userId={userId} onMemberClick={onMemberClick} />
            ))}
        </LoadMore>
      </ConditionalRender>
      <ConditionalRender condition={activeTab === tabs.MODERATORS}>
        <LoadMore hasMore={hasMoreModerators} loadMore={loadMoreModerators}>
          {moderators.length > 0 &&
            moderators.map(({ userId }) => (
              <CommunityMemberItem key={userId} userId={userId} onMemberClick={onMemberClick} />
            ))}
        </LoadMore>
      </ConditionalRender>
    </CommunityMembersContainer>
  );
};

export default customizableComponent('CommunityMembers', CommunityMembers);
