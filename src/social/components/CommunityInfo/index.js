import React, { memo, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { ImageSize, FileRepository } from '@amityco/js-sdk';

import withSDK from '~/core/hocs/withSDK';
import useCommunity from '~/social/hooks/useCommunity';
import { useNavigation } from '~/social/providers/NavigationProvider';
import UICommunityInfo from './UICommunityInfo';
import { confirm } from '~/core/components/Confirm';
import useCommunityOneMember from '~/social/hooks/useCommunityOneMember';

const CommunityInfo = ({ communityId, currentUserId }) => {
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
        imageSize: ImageSize.Medium,
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

  const { postsCount, membersCount, description, isJoined, userId: communityOwnerId } = community;
  const { isCommunityOwner, isCommunityModerator } = useCommunityOneMember(
    communityId,
    currentUserId,
    communityOwnerId,
  );
  const canEditCommunity = (isCommunityModerator && isJoined) || isCommunityOwner;
  const canLeaveCommunity = isJoined;
  const categoryNames = communityCategories.map(({ name }) => name);

  return (
    <UICommunityInfo
      communityId={communityId}
      communityCategories={categoryNames}
      postsCount={postsCount}
      membersCount={membersCount}
      description={description}
      isJoined={isJoined}
      isOfficial={community.isOfficial}
      isPublic={community.isPublic}
      avatarFileUrl={fileUrl}
      canEditCommunity={canEditCommunity}
      onEditCommunity={onEditCommunity}
      joinCommunity={joinCommunity}
      leaveCommunity={leaveCommunityConfirm}
      canLeaveCommunity={canLeaveCommunity}
      name={community.displayName}
    />
  );
};

export { UICommunityInfo };
export default memo(withSDK(CommunityInfo));
