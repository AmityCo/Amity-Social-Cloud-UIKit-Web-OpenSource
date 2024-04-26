import React from 'react';
import { CommunityPostSettings } from '@amityco/ts-sdk';
import UICommunityInfo from './UICommunityInfo';

import { useCommunityInfo } from './hooks';
import { FormattedMessage } from 'react-intl';
import { useConfirmContext } from '~/core/providers/ConfirmProvider';

import useSDK from '~/core/hooks/useSDK';

interface CommunityInfoProps {
  communityId: string;
}

const CommunityInfo = ({ communityId }: CommunityInfoProps) => {
  const { currentUserId } = useSDK();

  const {
    community,
    communityCategories,
    avatarFileUrl,
    canEditCommunity,
    onEditCommunity,
    joinCommunity,
    leaveCommunity,
    pendingPostsCount,
    canReviewCommunityPosts,
  } = useCommunityInfo(communityId);

  const { info, confirm } = useConfirmContext();

  const categoryNames = (communityCategories || []).map((category) => category.name);

  if (community == null) return null;

  const canLeaveCommunity = community.isJoined || false;
  const { membersCount, description, isJoined } = community;

  const leaveCommunityConfirmModal = ({ onOk }: { onOk: () => void }) =>
    confirm({
      'data-qa-anchor': 'leave-community',
      title: <FormattedMessage id="community.leaveCommunityTitle" />,
      content: <FormattedMessage id="community.leaveCommunityBody" />,
      okText: <FormattedMessage id="community.leaveCommunityButtonText" />,
      onOk: () => onOk(),
    });

  return (
    <UICommunityInfo
      communityId={communityId}
      communityCategories={categoryNames}
      pendingPostsCount={pendingPostsCount}
      postsCount={community.postsCount ?? 0}
      membersCount={membersCount}
      description={description || ''}
      isJoined={isJoined || false}
      isOfficial={community.isOfficial || false}
      isPublic={community.isPublic || false}
      avatarFileUrl={avatarFileUrl || null}
      joinCommunity={joinCommunity}
      canEditCommunity={canEditCommunity}
      canLeaveCommunity={canLeaveCommunity || false}
      canReviewPosts={canReviewCommunityPosts}
      name={community.displayName}
      postSetting={community.postSetting || CommunityPostSettings.ADMIN_REVIEW_POST_REQUIRED}
      onEditCommunity={onEditCommunity}
      onClickLeaveCommunity={() =>
        leaveCommunityConfirmModal({
          onOk: () => leaveCommunity(),
        })
      }
    />
  );
};

export { UICommunityInfo };
export default CommunityInfo;
