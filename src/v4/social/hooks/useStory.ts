import { StoryRepository } from '@amityco/ts-sdk';

import useLiveObject from '~/v4/core/hooks/useLiveObject';

const useStory = ({ storyId, shouldCall }: { storyId?: string; shouldCall?: boolean }) => {
  const { item, ...rest } = useLiveObject({
    fetcher: StoryRepository.getStoryByStoryId,
    params: storyId,
    shouldCall: shouldCall || storyId != null,
  });

  return { story: item, ...rest };
};

export default useStory;
