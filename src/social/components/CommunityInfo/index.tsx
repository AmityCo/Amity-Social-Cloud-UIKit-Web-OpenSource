import React from 'react';
import { CommunityPostSettings } from '@amityco/ts-sdk';
import UICommunityInfo from './UICommunityInfo';

import { useCommunityInfo } from './hooks';
import { useNavigation } from '~/social/providers/NavigationProvider';

import useSDK from '~/core/hooks/useSDK';

import { useStoryContext } from '~/v4/social/providers/StoryProvider';
import { checkStoryPermission } from '~/utils';
import { FormattedMessage } from 'react-intl';
import { useConfirmContext } from '~/core/providers/ConfirmProvider';

interface CommunityInfoProps {
  communityId: string;
  stories: (Amity.Story | undefined)[];
}

const CommunityInfo = ({ communityId, stories }: CommunityInfoProps) => {
  const { setFile } = useStoryContext();
  const haveStories = stories?.length > 0;
  const isStorySyncing = haveStories && stories.some((story) => story?.syncState === 'syncing');
  const isStoryErrored = haveStories && stories.some((story) => story?.syncState === 'error');
  const isSeen = haveStories && stories.every((story) => story?.isSeen);

  const { onClickStory } = useNavigation();

  const { client } = useSDK();
  const haveStoryPermission = checkStoryPermission(client, communityId);

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

  const { confirm } = useConfirmContext();

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
      setStoryFile={(storyFile) => setFile(storyFile)}
      haveStories={haveStories || false}
      haveStoryPermission={haveStoryPermission}
      isStorySyncing={isStorySyncing || false}
      isStoryErrored={isStoryErrored || false}
      isSeen={isSeen || false}
      onClickStory={onClickStory}
    />
  );
};

export { UICommunityInfo };
export default CommunityInfo;
