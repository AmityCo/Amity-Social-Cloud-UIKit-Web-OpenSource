import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { EkoImageSize, FileRepository } from 'eko-sdk';

import { isModerator } from '~/helpers/permissions';
import withSDK from '~/core/hocs/withSDK';
import useCommunity from '~/social/hooks/useCommunity';
import { useNavigation } from '~/social/providers/NavigationProvider';
import UICommunityInfo from './UICommunityInfo';
import { confirm } from '~/core/components/Confirm';

const CommunityInfo = ({ communityId, userRoles, currentUserId }) => {
  const { onEditCommunity } = useNavigation();
  const { community, communityCategories, joinCommunity, leaveCommunity } = useCommunity(
    communityId,
  );
  // TODO: this is temporary - we should use file.fileUrl when supported.
  const fileUrl = useMemo(
    () =>
      community.avatarFileId &&
      FileRepository.getFileUrlById({
        fileId: community.avatarFileId,
        imageSize: EkoImageSize.Medium,
      }),
    [community.avatarFileId],
  );

  const { formatMessage } = useIntl();

  const leaveCommunityConfirm = () =>
    confirm({
      title: formatMessage({ id: 'community.leaveCommunityTitle' }),
      content: formatMessage({ id: 'community.leaveCommunityBody' }),
      okText: formatMessage({ id: 'community.leaveCommunityButtonText' }),
      onOk: () => leaveCommunity(community.communityId),
    });

  const { postsCount, membersCount, description, isJoined, userId } = community;
  const isOwner = currentUserId === userId;
  const canEditCommunity = (isModerator(userRoles) && isJoined) || isOwner;
  const canLeaveCommunity = !isOwner;
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
      onEditCommunity={onEditCommunity}
      joinCommunity={joinCommunity}
      leaveCommunity={leaveCommunityConfirm}
      canLeaveCommunity={canLeaveCommunity}
    />
  );
};

export { UICommunityInfo };
export default withSDK(CommunityInfo);
