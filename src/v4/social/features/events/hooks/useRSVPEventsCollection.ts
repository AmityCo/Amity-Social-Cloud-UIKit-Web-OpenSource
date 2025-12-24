import { AmityEventResponseStatus } from '@amityco/ts-sdk';
import { useLiveCollectionV4 } from '~/v4/core/hooks/useLiveCollectionV4';

type UseRSVPsCollectionParams = {
  event: Amity.Event;
  status: Amity.EventResponseStatus;
  shouldCall?: boolean;
  limit?: number;
};

export default function useRSVPEventsCollection({
  event,
  status = AmityEventResponseStatus.Going,
  shouldCall,
  limit = 20,
  ...props
}: UseRSVPsCollectionParams) {
  const query = useLiveCollectionV4({
    params: { status, options: { limit }, ...props },
    fetcher: event.getRSVPs,
    shouldCall,
  });

  return { ...query };
}
