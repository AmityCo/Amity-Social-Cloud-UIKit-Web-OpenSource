import React from 'react';
import { useGlobalStoryTargets } from '../../hooks/collections/useGlobalStoryTargets';
import { GlobalFeedStory } from './GlobalFeedStory';

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
  }: {
    targetId: string;
    targetType: string;
    mediaType: any;
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
