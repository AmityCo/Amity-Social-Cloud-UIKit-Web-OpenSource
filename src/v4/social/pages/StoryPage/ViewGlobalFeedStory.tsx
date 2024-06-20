import React from 'react';
import { useGlobalStoryTargets } from '~/v4/social/hooks/collections/useGlobalStoryTargets';
import { GlobalFeedStory } from '~/v4/social/pages/StoryPage/GlobalFeedStory';
import { AmityStoryMediaType } from '~/v4/social/pages/DraftsPage/DraftsPage';

export const ViewGlobalFeedStoryPage = ({
  targetId,
  onChangePage,
  onClickStory,
  goToDraftStoryPage,
  onClose,
  onSwipeDown,
  onClickCommunity,
}: {
  targetId: string;
  onChangePage: () => void;
  onClickStory: (targetId: string) => void;
  goToDraftStoryPage: ({
    targetId,
    targetType,
    mediaType,
    storyType,
  }: {
    targetId: string;
    targetType: string;
    mediaType: AmityStoryMediaType;
    storyType: 'globalFeed';
  }) => void;
  onClose: (targetId: string) => void;
  onSwipeDown: (targetId: string) => void;
  onClickCommunity: (targetId: string) => void;
}) => {
  const { stories } = useGlobalStoryTargets({
    seenState: 'smart' as Amity.StorySeenQuery,
    limit: 10,
  });
  return (
    <GlobalFeedStory
      targetId={targetId}
      targetIds={stories.map((s) => s.targetId)}
      onChangePage={onChangePage}
      onClickStory={onClickStory}
      goToDraftStoryPage={goToDraftStoryPage}
      onClose={onClose}
      onSwipeDown={onSwipeDown}
      onClickCommunity={onClickCommunity}
    />
  );
};
