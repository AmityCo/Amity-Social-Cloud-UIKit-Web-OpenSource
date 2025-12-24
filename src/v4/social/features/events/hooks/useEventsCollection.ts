import { EventRepository } from '@amityco/ts-sdk';
import { useLiveCollectionV4 } from '~/v4/core/hooks/useLiveCollectionV4';

type UseEventsCollectionParams = Partial<Parameters<typeof EventRepository.getEvents>[0]> & {
  shouldCall?: boolean;
};

export function useEventsCollection({
  shouldCall,
  limit = 20,
  ...props
}: UseEventsCollectionParams) {
  const query = useLiveCollectionV4({
    params: { limit, ...props },
    fetcher: EventRepository.getEvents,
    shouldCall,
  });

  return { ...query };
}
