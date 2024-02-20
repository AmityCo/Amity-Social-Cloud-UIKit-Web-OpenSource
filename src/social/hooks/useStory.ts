import { StoryRepository } from '@amityco/ts-sdk';

import useLiveObject from '~/core/hooks/useLiveObject';

const useStory = (storyId?: string) => {
  const story = useLiveObject({
    fetcher: StoryRepository.getStoryByStoryId,
    params: storyId as string,
    shouldCall: () => !!storyId,
  });

  return story;
};

export default useStory;
