import React from 'react';

import isModerator from '~/helpers/permissions';
import withSDK from '~/core/hocs/withSDK';

import useCommunity from '~/social/hooks/useCommunity';

import UICommunityInfo from './UICommunityInfo';

import { confirm } from '~/core/components/Confirm';

const CommunityInfo = ({ communityId, userRoles, onEditCommunityClick }) => {
  const { community, communityCategories, joinCommunity, leaveCommunity, file } = useCommunity(
    communityId,
  );
  const { fileUrl } = file;

  // TODO: react-intl
  const leaveCommunityConfirm = () =>
    confirm({
      title: 'Leave community?',
      content: 'You won’t no longer be able to post and interact in this community after leaving.',
      okText: 'Leave',
      onOk: () => leaveCommunity(community.communityId),
    });

  const { postsCount, membersCount, description, isJoined } = community;
  const canEditCommunity = isModerator(userRoles) && isJoined;
  const categoryNames = communityCategories.map(({ name }) => name);

  return (
    <UICommunityInfo
      communityId={communityId}
      communityCategories={categoryNames}
      postsCount={postsCount}
      membersCount={membersCount}
      description={description}
      isJoined={isJoined}
      avatarFileUrl={fileUrl}
      canEditCommunity={canEditCommunity}
      onEditCommunityClick={onEditCommunityClick}
      joinCommunity={joinCommunity}
      leaveCommunity={leaveCommunityConfirm}
    />
  );
};

export { UICommunityInfo };
export default withSDK(CommunityInfo);
