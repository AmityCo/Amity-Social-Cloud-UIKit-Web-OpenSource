import React from 'react';

import { isModerator } from 'helpers/permissions';
import { confirm } from '~/core/components/Confirm';
import useCommunityWithAvatar from '~/social/hooks/useCommunityWithAvatar';
import withSDK from '~/core/hocs/withSDK';
import UICommunityInfo from './UICommunityInfo';

const CommunityInfo = ({ communityId, userRoles, onEditCommunityClick }) => {
  const {
    community,
    communityCategories,
    joinCommunity,
    leaveCommunity,
    file,
  } = useCommunityWithAvatar(communityId);
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

  return (
    <UICommunityInfo
      communityId={communityId}
      communityCategories={communityCategories}
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
